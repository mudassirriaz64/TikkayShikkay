import { HTMLAttributes } from 'react';

export interface EyebrowBadgeProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
  color?: 'peach' | 'gold' | 'muted';
}
