import { HTMLAttributes, ReactNode } from 'react';

export interface AccentCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  accentColor?: 'peach' | 'gold';
}
