import { api } from './client';

export type CateringEventType = 'corporate' | 'birthday' | 'wedding' | 'bulk-order';
export type CateringPackageTier = 'classic-grill' | 'royal-bbq-feast' | 'pitmaster-live-station' | 'custom';
export type CateringStatus = 'inquiry' | 'under-review' | 'confirmed' | 'completed' | 'cancelled';

export interface CateringBookingInput {
  user_id?: string;
  event_type: CateringEventType;
  guest_count: number;
  event_date: string;
  event_time?: string;
  package_tier?: CateringPackageTier;
  selected_items?: string[];
  contact_name: string;
  contact_email?: string;
  contact_phone: string;
  event_location: string;
  special_instructions?: string;
  estimated_total: number;
  is_live_tandoor_requested?: boolean;
}

export interface CateringBookingRecord {
  id?: string;
  _id?: string;
  user_id?: string;
  event_type: CateringEventType;
  guest_count: number;
  event_date: string;
  event_time: string;
  package_tier: CateringPackageTier;
  selected_items?: string[];
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  event_location: string;
  special_instructions?: string;
  estimated_total: number;
  status: CateringStatus;
  is_live_tandoor_requested: boolean;
  coordinator_notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AvailabilityResult {
  date: string;
  is_available: boolean;
  remaining_slots: number;
  booking_load: 'open' | 'moderate' | 'heavy';
}

export const cateringService = {
  createBooking(data: CateringBookingInput): Promise<CateringBookingRecord> {
    return api.post<CateringBookingRecord>('/catering/requests', data);
  },

  checkAvailability(date: string): Promise<AvailabilityResult> {
    return api.get<AvailabilityResult>(`/catering/availability?date=${date}`);
  },

  getMyBookings(): Promise<CateringBookingRecord[]> {
    return api.get<CateringBookingRecord[]>('/catering/my');
  },

  getAllBookings(query?: { status?: string; event_type?: string }): Promise<CateringBookingRecord[]> {
    return api.get<CateringBookingRecord[]>('/catering', { query });
  },

  updateStatus(id: string, status: CateringStatus, coordinator_notes?: string): Promise<CateringBookingRecord> {
    return api.patch<CateringBookingRecord>(`/catering/${id}/status`, { status, coordinator_notes });
  },
};
