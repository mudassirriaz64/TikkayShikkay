import { api } from './client';

export interface UploadResult {
  url: string;
  publicId: string;
  format: string;
  resourceType: string;
  bytes: number;
  width: number | null;
  height: number | null;
}

export const uploadService = {
  uploadFile(file: File): Promise<UploadResult> {
    const formData = new FormData();
    formData.append('file', file);
    return api.post<UploadResult>('/upload', formData, {
      timeoutMs: 60000,
    });
  },
};
