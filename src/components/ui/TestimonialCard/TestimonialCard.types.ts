import { CustomerReview } from '@/types';
import { HTMLAttributes } from 'react';

export interface TestimonialCardProps extends HTMLAttributes<HTMLDivElement> {
  review: CustomerReview;
  index: number;
}
