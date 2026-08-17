export interface ApiResponseShape<T> {
  statusCode?: number;
  data: T;
  message: string;
  success: boolean;
}

export interface ApiErrorShape {
  success: false;
  message: string;
  stack?: string;
  errors?: unknown;
}

export class ClientApiError extends Error {
  statusCode: number;
  errors?: unknown;
  isOperational: boolean;

  constructor(statusCode: number, message: string, errors?: unknown, isOperational = true) {
    super(message);
    this.name = 'ClientApiError';
    this.statusCode = statusCode;
    this.errors = errors;
    this.isOperational = isOperational;
  }

  static fromResponse(statusCode: number, body: ApiErrorShape): ClientApiError {
    return new ClientApiError(statusCode, body.message || 'Request failed', body.errors);
  }

  static fromUnknown(err: unknown): ClientApiError {
    if (err instanceof ClientApiError) return err;
    if (err instanceof Error) {
      return new ClientApiError(0, err.message || 'Network error', undefined, false);
    }
    return new ClientApiError(0, 'Unknown network error', undefined, false);
  }
}
