import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  ColumnId,
  PRIORITIES,
  Priority,
  Task,
  TaskFilters,
  TaskStats,
} from '../models/task.model';
import { StorageService } from './storage.service';

const STORAGE_KEY = 'tfm:tasks';
const SEARCH_DEBOUNCE_MS = 300;

export type NewTaskInput = Omit<Task, 'id' | 'createdAt' | 'status'> & {
  status?: ColumnId;
};

@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly storage = inject(StorageService);
  private readonly searchInput$ = new Subject<string>();

  readonly tasks = signal<Task[]>([]);
  readonly priorityFilter = signal<Priority | 'all'>('all');
  readonly categoryFilter = signal<string | 'all'>('all');
  readonly search = signal<string>('');

  readonly categories = computed(() => {
    const set = new Set<string>();
    for (const task of this.tasks()) {
      if (task.category.trim().length > 0) {
        set.add(task.category.trim());
      }
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  });

  readonly filteredTasks = computed(() => {
    const priority = this.priorityFilter();
    const category = this.categoryFilter();
    const query = this.search().trim().toLowerCase();
    return this.tasks().filter((task) => {
      if (priority !== 'all' && task.priority !== priority) {
        return false;
      }
      if (category !== 'all' && task.category !== category) {
        return false;
      }
      if (query.length > 0 && !task.title.toLowerCase().includes(query)) {
        return false;
      }
      return true;
    });
  });

  readonly filters = computed<TaskFilters>(() => ({
    priority: this.priorityFilter(),
    category: this.categoryFilter(),
    search: this.search(),
  }));

  readonly stats = computed<TaskStats>(() => {
    const all = this.tasks();
    const perColumn: Record<ColumnId, number> = {
      todo: 0,
      'in-progress': 0,
      done: 0,
    };
    const perPriority: Record<Priority, number> = {
      low: 0,
      medium: 0,
      high: 0,
    };
    for (const task of all) {
      perColumn[task.status] += 1;
      perPriority[task.priority] += 1;
    }
    const completionPercent =
      all.length === 0 ? 0 : Math.round((perColumn.done / all.length) * 100);
    return {
      total: all.length,
      perColumn,
      perPriority,
      completionPercent,
    };
  });

  constructor() {
    this.tasks.set(this.storage.read<Task[]>(STORAGE_KEY, []));

    effect(() => {
      const snapshot = this.tasks();
      this.storage.write(STORAGE_KEY, snapshot);
    });

    this.searchInput$
      .pipe(debounceTime(SEARCH_DEBOUNCE_MS), distinctUntilChanged(), takeUntilDestroyed())
      .subscribe((value) => this.search.set(value));
  }

  tasksByColumn(columnId: ColumnId): Task[] {
    return this.filteredTasks().filter((task) => task.status === columnId);
  }

  pushSearchTerm(term: string): void {
    this.searchInput$.next(term);
  }

  setPriorityFilter(priority: Priority | 'all'): void {
    this.priorityFilter.set(priority);
  }

  setCategoryFilter(category: string | 'all'): void {
    this.categoryFilter.set(category);
  }

  resetFilters(): void {
    this.priorityFilter.set('all');
    this.categoryFilter.set('all');
    this.search.set('');
  }

  addTask(input: NewTaskInput): Task {
    const task: Task = {
      id: this.createId(),
      title: input.title.trim(),
      description: input.description.trim(),
      priority: input.priority,
      category: input.category.trim(),
      status: input.status ?? 'todo',
      createdAt: new Date().toISOString(),
      deadline: input.deadline,
    };
    this.tasks.update((tasks) => [task, ...tasks]);
    return task;
  }

  updateTask(id: string, changes: Partial<Omit<Task, 'id' | 'createdAt'>>): void {
    this.tasks.update((tasks) =>
      tasks.map((task) =>
        task.id === id
          ? {
              ...task,
              ...changes,
              title: changes.title?.trim() ?? task.title,
              description: changes.description?.trim() ?? task.description,
              category: changes.category?.trim() ?? task.category,
            }
          : task,
      ),
    );
  }

  deleteTask(id: string): void {
    this.tasks.update((tasks) => tasks.filter((task) => task.id !== id));
  }

  moveTask(id: string, target: ColumnId): void {
    this.tasks.update((tasks) =>
      tasks.map((task) => (task.id === id ? { ...task, status: target } : task)),
    );
  }

  reorderWithinColumn(columnId: ColumnId, orderedIds: string[]): void {
    this.tasks.update((tasks) => {
      const others = tasks.filter((task) => task.status !== columnId);
      const lookup = new Map(tasks.filter((t) => t.status === columnId).map((t) => [t.id, t]));
      const reordered = orderedIds
        .map((id) => lookup.get(id))
        .filter((task): task is Task => task !== undefined);
      return [...reordered, ...others];
    });
  }

  priorities(): readonly Priority[] {
    return PRIORITIES;
  }

  private createId(): string {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
      return crypto.randomUUID();
    }
    return `id-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  }
}
