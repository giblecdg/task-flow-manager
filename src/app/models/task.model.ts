export type Priority = 'low' | 'medium' | 'high';

export type ColumnId = 'todo' | 'in-progress' | 'done';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  category: string;
  status: ColumnId;
  createdAt: string;
  deadline: string | null;
}

export interface ColumnDefinition {
  id: ColumnId;
  title: string;
  accent: string;
  emptyMessage: string;
}

export interface TaskFilters {
  priority: Priority | 'all';
  category: string | 'all';
  search: string;
}

export interface TaskStats {
  total: number;
  perColumn: Record<ColumnId, number>;
  perPriority: Record<Priority, number>;
  completionPercent: number;
}

export const COLUMN_DEFINITIONS: readonly ColumnDefinition[] = [
  {
    id: 'todo',
    title: 'To Do',
    accent: 'from-sky-400/90 to-sky-600/90',
    emptyMessage: 'Nothing planned yet. Add your first task to get started.',
  },
  {
    id: 'in-progress',
    title: 'In Progress',
    accent: 'from-amber-400/90 to-orange-500/90',
    emptyMessage: 'No tasks in progress. Drag one here when you start working.',
  },
  {
    id: 'done',
    title: 'Done',
    accent: 'from-emerald-400/90 to-emerald-600/90',
    emptyMessage: 'No completed tasks yet. Finish something to celebrate here.',
  },
] as const;

export const PRIORITIES: readonly Priority[] = ['low', 'medium', 'high'] as const;
