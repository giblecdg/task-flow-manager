import { Priority } from '../models/task.model';

export interface PriorityStyle {
  dot: string;
  badge: string;
  ring: string;
  label: string;
}

const STYLES: Record<Priority, PriorityStyle> = {
  low: {
    dot: 'bg-emerald-500',
    badge:
      'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300 border border-emerald-300/60 dark:border-emerald-500/30',
    ring: 'ring-emerald-400/50',
    label: 'Low',
  },
  medium: {
    dot: 'bg-amber-500',
    badge:
      'bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300 border border-amber-300/60 dark:border-amber-500/30',
    ring: 'ring-amber-400/50',
    label: 'Medium',
  },
  high: {
    dot: 'bg-rose-500',
    badge:
      'bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300 border border-rose-300/60 dark:border-rose-500/30',
    ring: 'ring-rose-400/50',
    label: 'High',
  },
};

export function priorityStyle(priority: Priority): PriorityStyle {
  return STYLES[priority];
}
