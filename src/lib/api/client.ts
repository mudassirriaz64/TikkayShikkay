import { ApiErrorShape, ApiResponseShape, ClientApiError } from './types';

export { ClientApiError } from './types';

export type FetchCredentials = 'include' | 'same-origin' | 'omit';

export interface FetchOptions extends RequestInit {
  credentials?: FetchCredentials;
  timeoutMs?: number;
  normalizeIds?: boolean;
}

export function normalizeDataIds(value: unknown): unknown {
  if (value === null || value === undefined) return value;
  if (Array.isArray(value)) return value.map(normalizeDataIds);
  if (typeof value !== 'object') return value;

  if (value instanceof Date) return value;

  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
    if (k === '_id') {
      if (!('id' in (value as Record<string, unknown>))) {
        out.id = typeof v === 'object' && v !== null && '_id' in (v as Record<string, unknown>)
          ? (v as { _id: unknown })._id
          : v;
      } else {
        out[k] = normalizeDataIds(v);
      }
    } else {
      out[k] = normalizeDataIds(v);
    }
  }
  return out;
}

function getBaseUrl(): string {
  if (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL as string;
  }
  if (typeof window !== 'undefined') {
    return '/api/v1';
  }
  return 'http://localhost:5000/api/v1';
}

export const API_BASE_URL = getBaseUrl();

export function buildUrl(path: string, query?: Record<string, unknown>): string {
  const base = path.startsWith('http') ? path : `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
  if (!query) return base;

  const url = new URL(base);
  for (const [k, v] of Object.entries(query)) {
    if (v === undefined || v === null) continue;
    if (Array.isArray(v)) {
      v.forEach((val) => url.searchParams.append(k, String(val)));
    } else {
      url.searchParams.set(k, String(v));
    }
  }
  return url.toString();
}

function abortAfter(ms: number): { signal: AbortSignal; clear: () => void } {
  const ctrl = new AbortController();
  const id = setTimeout(() => ctrl.abort(), ms);
  return { signal: ctrl.signal, clear: () => clearTimeout(id) };
}

async function safeFetch<T>(
  method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE',
  path: string,
  body?: unknown,
  options: FetchOptions = {},
): Promise<T> {
  const { timeoutMs = 20000, headers: customHeaders, credentials, query, ...rest } = options as FetchOptions & {
    query?: Record<string, unknown>;
  };

  const url = buildUrl(path, query);

  const isBrowser = typeof window !== 'undefined';
  const defaultCredentials: FetchCredentials = isBrowser ? 'include' : 'same-origin';

  let token: string | null = null;
  if (isBrowser) {
    try {
      token = localStorage.getItem('tikkay_access_token');
    } catch {
      /* ignore */
    }
  }

  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...(body !== undefined && !(body instanceof FormData) && { 'Content-Type': 'application/json' }),
    ...(token && { Authorization: `Bearer ${token}` }),
    ...(customHeaders as Record<string, string> | undefined),
  };

  const { signal, clear } = abortAfter(timeoutMs);

  try {
    const response = await fetch(url, {
      method,
      headers,
      credentials: credentials ?? defaultCredentials,
      body: body === undefined ? undefined : body instanceof FormData ? body : JSON.stringify(body),
      signal,
      ...rest,
    });

    const contentType = response.headers.get('content-type') || '';
    const isJson = contentType.includes('application/json');

    let rawBody: unknown;
    try {
      rawBody = isJson ? await response.json() : await response.text();
    } catch {
      rawBody = undefined;
    }

    if (!response.ok) {
      const errBody = (rawBody ?? {}) as ApiErrorShape | Record<string, unknown>;
      const message =
        (errBody as ApiErrorShape).message ||
        (typeof rawBody === 'string' ? rawBody : undefined) ||
        `HTTP ${response.status}: ${response.statusText}`;
      throw ClientApiError.fromResponse(response.status, {
        success: false,
        message,
        errors: (errBody as ApiErrorShape).errors,
      });
    }

    if (!isJson) return rawBody as T;

    const envelope = rawBody as ApiResponseShape<T> | { success?: boolean; data?: T };
    let extracted: unknown;
    if (envelope && typeof envelope === 'object' && 'data' in envelope) {
      extracted = (envelope as ApiResponseShape<T>).data;
    } else {
      extracted = rawBody;
    }

    const shouldNormalize = options.normalizeIds !== false;
    return (shouldNormalize ? normalizeDataIds(extracted) : extracted) as T;
  } catch (err) {
    if (err instanceof ClientApiError) throw err;
    if ((err as Error).name === 'AbortError') {
      throw new ClientApiError(0, 'Request timed out. Please try again.', undefined, false);
    }
    throw ClientApiError.fromUnknown(err);
  } finally {
    clear();
  }
}

export const api = {
  get: <T>(path: string, options?: FetchOptions & { query?: Record<string, unknown> }) =>
    safeFetch<T>('GET', path, undefined, options),

  post: <T>(path: string, body?: unknown, options?: FetchOptions) =>
    safeFetch<T>('POST', path, body, options),

  patch: <T>(path: string, body?: unknown, options?: FetchOptions) =>
    safeFetch<T>('PATCH', path, body, options),

  put: <T>(path: string, body?: unknown, options?: FetchOptions) =>
    safeFetch<T>('PUT', path, body, options),

  delete: <T>(path: string, options?: FetchOptions) =>
    safeFetch<T>('DELETE', path, undefined, options),
};

export function isApiError(err: unknown): err is ClientApiError {
  return err instanceof ClientApiError;
}

export async function tryOrFallback<T>(
  fn: () => Promise<T>,
  fallback: T | (() => T | Promise<T>),
  onError?: (err: ClientApiError) => void,
): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    const apiErr = ClientApiError.fromUnknown(err);
    if (typeof window !== 'undefined') {
      console.warn('[api] fallback used:', apiErr.statusCode, apiErr.message);
    }
    onError?.(apiErr);
    return typeof fallback === 'function' ? (fallback as () => T | Promise<T>)() : fallback;
  }
}
