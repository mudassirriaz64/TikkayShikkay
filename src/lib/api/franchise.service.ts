import { api } from './client';

export interface FranchiseInquiryInput {
  full_name: string;
  email: string;
  phone: string;
  target_city: string;
  proposed_location?: string;
  investment_budget: string;
  experience_summary?: string;
  timeline?: string;
}

export interface FranchiseInquiryRecord {
  id?: string;
  _id?: string;
  full_name: string;
  email: string;
  phone: string;
  target_city: string;
  proposed_location?: string;
  investment_budget: string;
  experience_summary?: string;
  timeline: string;
  status: 'pending' | 'reviewed' | 'contacted' | 'approved' | 'rejected';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export const franchiseService = {
  submitInquiry(data: FranchiseInquiryInput): Promise<FranchiseInquiryRecord> {
    return api.post<FranchiseInquiryRecord>('/franchise', data);
  },

  getAllInquiries(params?: { status?: string; target_city?: string }): Promise<FranchiseInquiryRecord[]> {
    return api.get<FranchiseInquiryRecord[]>('/franchise', { query: params });
  },

  updateStatus(id: string, status: string, notes?: string): Promise<FranchiseInquiryRecord> {
    return api.patch<FranchiseInquiryRecord>(`/franchise/${id}/status`, { status, notes });
  },

  deleteInquiry(id: string): Promise<void> {
    return api.delete<void>(`/franchise/${id}`);
  },
};
