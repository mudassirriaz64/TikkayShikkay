import { api } from './client';
import { ContactMethod, ContactPageData, OpeningDay } from '@/types';

export interface ContactSubmission {
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
  is_read?: boolean;
  createdAt?: string;
}

export interface ContactPageConfig {
  hero?: unknown;
  map?: unknown;
  form?: unknown;
  catering?: unknown;
  franchise?: unknown;
}

export const contactService = {
  getPageData(): Promise<ContactPageData> {
    return api.get<ContactPageData>('/contact/page-data');
  },

  getPageConfig(): Promise<ContactPageConfig> {
    return api.get<ContactPageConfig>('/contact/page-config');
  },

  updatePageConfig(data: Partial<ContactPageConfig>): Promise<ContactPageConfig> {
    return api.patch<ContactPageConfig>('/contact/page-config', data);
  },

  getMethods(): Promise<ContactMethod[]> {
    return api.get<ContactMethod[]>('/contact/methods');
  },

  saveMethods(methods: ContactMethod[]): Promise<ContactMethod[]> {
    return api.put<ContactMethod[]>('/contact/methods', methods);
  },

  createMethod(data: Partial<ContactMethod>): Promise<ContactMethod> {
    return api.post<ContactMethod>('/contact/methods', data);
  },

  getMethod(id: string): Promise<ContactMethod> {
    return api.get<ContactMethod>(`/contact/methods/${id}`);
  },

  updateMethod(id: string, data: Partial<ContactMethod>): Promise<ContactMethod> {
    return api.patch<ContactMethod>(`/contact/methods/${id}`, data);
  },

  deleteMethod(id: string): Promise<void> {
    return api.delete<void>(`/contact/methods/${id}`);
  },

  getOpeningHours(): Promise<OpeningDay[]> {
    return api.get<OpeningDay[]>('/contact/opening-hours');
  },

  saveOpeningHours(openingHours: OpeningDay[]): Promise<OpeningDay[]> {
    return api.put<OpeningDay[]>('/contact/opening-hours', openingHours);
  },

  createOpeningDay(data: Partial<OpeningDay>): Promise<OpeningDay> {
    return api.post<OpeningDay>('/contact/opening-hours', data);
  },

  getOpeningDay(id: string): Promise<OpeningDay> {
    return api.get<OpeningDay>(`/contact/opening-hours/${id}`);
  },

  updateOpeningDay(id: string, data: Partial<OpeningDay>): Promise<OpeningDay> {
    return api.patch<OpeningDay>(`/contact/opening-hours/${id}`, data);
  },

  deleteOpeningDay(id: string): Promise<void> {
    return api.delete<void>(`/contact/opening-hours/${id}`);
  },

  submitForm(data: ContactSubmission): Promise<ContactSubmission> {
    return api.post<ContactSubmission>('/contact/submit', data);
  },

  getSubmissions(): Promise<ContactSubmission[]> {
    return api.get<ContactSubmission[]>('/contact/submissions');
  },

  markRead(id: string): Promise<ContactSubmission> {
    return api.patch<ContactSubmission>(`/contact/submissions/${id}/read`);
  },

  deleteSubmission(id: string): Promise<void> {
    return api.delete<void>(`/contact/submissions/${id}`);
  },
};
