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
  uploadFile(file: File, folder?: string): Promise<UploadResult> {
    const formData = new FormData();
    formData.append('file', file);
    if (folder) {
      formData.append('folder', folder);
    }
    const path = folder ? `/upload?folder=${encodeURIComponent(folder)}` : '/upload';
    return api.post<UploadResult>(path, formData, {
      timeoutMs: 60000,
    });
  },
};
