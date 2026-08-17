export type MediaType = 'Image' | 'Video';

export interface JourneyPost {
  id: string;
  day_number: number;
  title: string;
  content: string;
  media_type: MediaType;
  media_url: string;
  image_public_id?: string;
  created_at: string;
}
