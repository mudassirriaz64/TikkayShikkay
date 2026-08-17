import { SpiceLevel } from '@/types';
import { HTMLAttributes } from 'react';

export interface FlameRatingProps extends HTMLAttributes<HTMLDivElement> {
  level: SpiceLevel;
}
