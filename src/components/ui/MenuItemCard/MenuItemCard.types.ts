import { MenuItem } from '@/types';
import { HTMLAttributes } from 'react';

export interface MenuItemCardProps extends HTMLAttributes<HTMLDivElement> {
  item: MenuItem;
  category?: string;
}
