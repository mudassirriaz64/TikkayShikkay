import { api } from './client';
import { JobListing } from '@/types';

export interface JobApplicationInput {
  job_id: string;
  job_title: string;
  full_name: string;
  email: string;
  phone: string;
  experience_years: number;
  cover_letter?: string;
  resume: File;
}

export interface JobApplicationRecord {
  id?: string;
  _id?: string;
  job_id: string;
  job_title: string;
  full_name: string;
  email: string;
  phone: string;
  experience_years: number;
  cover_letter?: string;
  resume_url: string;
  resume_public_id: string;
  resume_file_name: string;
  resume_file_size: number;
  status: 'applied' | 'reviewed' | 'interview' | 'hired' | 'rejected';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export const careersService = {
  getOpenJobs(): Promise<JobListing[]> {
    return api.get<JobListing[]>('/careers/jobs');
  },

  getAllJobsAdmin(): Promise<JobListing[]> {
    return api.get<JobListing[]>('/careers/jobs/admin');
  },

  createJob(data: Partial<JobListing>): Promise<JobListing> {
    return api.post<JobListing>('/careers/jobs', data);
  },

  updateJob(id: string, data: Partial<JobListing>): Promise<JobListing> {
    return api.patch<JobListing>(`/careers/jobs/${id}`, data);
  },

  deleteJob(id: string): Promise<void> {
    return api.delete<void>(`/careers/jobs/${id}`);
  },

  async apply(data: JobApplicationInput): Promise<JobApplicationRecord> {
    const formData = new FormData();
    formData.append('job_id', data.job_id);
    formData.append('job_title', data.job_title);
    formData.append('full_name', data.full_name);
    formData.append('email', data.email);
    formData.append('phone', data.phone);
    formData.append('experience_years', String(data.experience_years));
    if (data.cover_letter) formData.append('cover_letter', data.cover_letter);
    formData.append('resume', data.resume);

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
    const res = await fetch(`${baseUrl}/careers/apply`, {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'Failed to submit application' }));
      throw new Error(err.message || 'Failed to submit application');
    }

    const json = await res.json();
    return json.data ?? json;
  },

  getAllApplications(params?: { job_id?: string; status?: string }): Promise<JobApplicationRecord[]> {
    return api.get<JobApplicationRecord[]>('/careers/applications', { query: params });
  },

  updateApplicationStatus(id: string, status: string, notes?: string): Promise<JobApplicationRecord> {
    return api.patch<JobApplicationRecord>(`/careers/applications/${id}/status`, { status, notes });
  },

  deleteApplication(id: string): Promise<void> {
    return api.delete<void>(`/careers/applications/${id}`);
  },
};
