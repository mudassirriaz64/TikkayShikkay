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

export interface VideoUploadConfig {
  mode: 'vps' | 'vercel_direct';
  cloudName: string;
  maxSizeBytes: number;
  allowedFormats: string[];
}

export interface VideoSignatureResult {
  signature: string;
  timestamp: number;
  apiKey: string;
  cloudName: string;
  folder: string;
  resourceType: string;
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

  getVideoConfig(): Promise<VideoUploadConfig> {
    return api.get<VideoUploadConfig>('/upload/video-config');
  },

  getVideoSignature(): Promise<VideoSignatureResult> {
    return api.post<VideoSignatureResult>('/upload/video-signature');
  },

  /**
   * Vercel Mode: Uploads video file directly to Cloudinary using signed upload parameters
   */
  async uploadVideoDirect(
    file: File,
    sig: VideoSignatureResult,
    onProgress?: (percent: number) => void
  ): Promise<{ secure_url: string; public_id: string; duration: number }> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('api_key', sig.apiKey);
    formData.append('timestamp', String(sig.timestamp));
    formData.append('signature', sig.signature);
    formData.append('folder', sig.folder);

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open(
        'POST',
        `https://api.cloudinary.com/v1_1/${sig.cloudName}/video/upload`
      );

      if (onProgress) {
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percent = Math.round((event.loaded / event.total) * 100);
            onProgress(percent);
          }
        };
      }

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText);
            resolve(response);
          } catch (e) {
            reject(new Error('Invalid response from Cloudinary'));
          }
        } else {
          try {
            const err = JSON.parse(xhr.responseText);
            reject(new Error(err?.error?.message || 'Video upload to Cloudinary failed'));
          } catch {
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        }
      };

      xhr.onerror = () => reject(new Error('Network error during video upload'));
      xhr.send(formData);
    });
  },

  /**
   * VPS Mode: Uploads to backend for local in-process FFmpeg compression
   */
  uploadVideoVPS(
    file: File,
    meta: { title: string; customer_name?: string; description?: string }
  ): Promise<{ id: string; title: string; status: string }> {
    const formData = new FormData();
    formData.append('video', file);
    formData.append('title', meta.title);
    if (meta.customer_name) formData.append('customer_name', meta.customer_name);
    if (meta.description) formData.append('description', meta.description);

    return api.post<{ id: string; title: string; status: string }>('/upload/video', formData, {
      timeoutMs: 120000,
    });
  },
};
