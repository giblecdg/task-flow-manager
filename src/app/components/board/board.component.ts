import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import {
  COLUMN_DEFINITIONS,
  ColumnId,
  PRIORITIES,
  Priority,
  Task,
} from '../../models/task.model';
import { TaskService } from '../../services/task.service';
import { ColumnComponent } from '../column/column.component';
import { TaskFormComponent, TaskFormSubmit } from '../task-form/task-form.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

interface FormState {
  open: boolean;
  task: Task | null;
  defaultStatus: ColumnId;
}

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [
    FormsModule,
    TitleCasePipe,
    ColumnComponent,
    TaskFormComponent,
    ConfirmDialogComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="px-4 sm:px-6 lg:px-10 py-8 max-w-[1600px] mx-auto">
      <div class="flex flex-col gap-4 mb-6">
        <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 class="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Your Board
            </h1>
            <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Organize work into To Do, In Progress and Done — drag cards to move them.
            </p>
          </div>
          <button
            type="button"
            class="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium shadow-sm transition-colors self-start md:self-auto"
            (click)="openCreateForm('todo')"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" class="h-4 w-4">
              <path d="M10 4a.75.75 0 0 1 .75.75v4.5h4.5a.75.75 0 0 1 0 1.5h-4.5v4.5a.75.75 0 0 1-1.5 0v-4.5h-4.5a.75.75 0 0 1 0-1.5h4.5v-4.5A.75.75 0 0 1 10 4Z" />
            </svg>
            New task
          </button>
        </div>

        <div
          class="grid grid-cols-1 md:grid-cols-4 gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-sm"
        >
          <label class="md:col-span-2 block">
            <span class="text-[11px] font-medium uppercase text-slate-500 dark:text-slate-400">
              Search
            </span>
            <input
              type="search"
              placeholder="Search by title..."
              [ngModel]="searchTerm()"
              (ngModelChange)="onSearchChange($event)"
              class="mt-1 w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </label>
          <label class="block">
            <span class="text-[11px] font-medium uppercase text-slate-500 dark:text-slate-400">
              Priority
            </span>
            <select
              [ngModel]="taskService.priorityFilter()"
              (ngModelChange)="taskService.setPriorityFilter($event)"
              class="mt-1 w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All priorities</option>
              @for (priority of priorities; track priority) {
                <option [value]="priority">{{ priority | titlecase }}</option>
              }
            </select>
          </label>
          <label class="block">
            <span class="text-[11px] font-medium uppercase text-slate-500 dark:text-slate-400">
              Category
            </span>
            <select
              [ngModel]="taskService.categoryFilter()"
              (ngModelChange)="taskService.setCategoryFilter($event)"
              class="mt-1 w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All categories</option>
              @for (category of taskService.categories(); track category) {
                <option [value]="category">{{ category }}</option>
              }
            </select>
          </label>
        </div>

        @if (hasActiveFilters()) {
          <div class="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span>Filters active</span>
            <button
              type="button"
              class="px-2 py-1 rounded-md bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-medium transition-colors"
              (click)="clearFilters()"
            >
              Clear all
            </button>
          </div>
        }
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        @for (column of columns; track column.id) {
          <app-column
            [definition]="column"
            [tasks]="tasksFor(column.id)"
            [connectedColumnIds]="columnIds"
            (editRequested)="openEditForm($event)"
            (removeRequested)="confirmRemove($event)"
            (addRequested)="openCreateForm($event)"
            (dropped)="handleDrop($event)"
          />
        }
      </div>
    </div>

    @if (formState().open) {
      <app-task-form
        [task]="formState().task"
        [defaultStatus]="formState().defaultStatus"
        (submitForm)="handleFormSubmit($event)"
        (dismiss)="closeForm()"
      />
    }

    @if (taskPendingDelete(); as pending) {
      <app-confirm-dialog
        title="Delete task?"
        [message]="deleteMessage(pending)"
        confirmLabel="Delete"
        (confirm)="performDelete()"
        (cancel)="cancelDelete()"
      />
    }
  `,
})
export class BoardComponent {
  readonly taskService = inject(TaskService);
  readonly columns = COLUMN_DEFINITIONS;
  readonly columnIds: string[] = COLUMN_DEFINITIONS.map((c) => c.id);
  readonly priorities: readonly Priority[] = PRIORITIES;

  readonly searchTerm = signal<string>('');
  readonly formState = signal<FormState>({ open: false, task: null, defaultStatus: 'todo' });
  readonly taskPendingDelete = signal<Task | null>(null);

  readonly hasActiveFilters = computed(
    () =>
      this.taskService.priorityFilter() !== 'all' ||
      this.taskService.categoryFilter() !== 'all' ||
      this.taskService.search().length > 0,
  );

  tasksFor(columnId: ColumnId): Task[] {
    return this.taskService.tasksByColumn(columnId);
  }

  onSearchChange(value: string): void {
    this.searchTerm.set(value);
    this.taskService.pushSearchTerm(value);
  }

  clearFilters(): void {
    this.searchTerm.set('');
    this.taskService.resetFilters();
  }

  openCreateForm(status: ColumnId | string): void {
    this.formState.set({
      open: true,
      task: null,
      defaultStatus: (status as ColumnId) ?? 'todo',
    });
  }

  openEditForm(task: Task): void {
    this.formState.set({ open: true, task, defaultStatus: task.status });
  }

  closeForm(): void {
    this.formState.set({ open: false, task: null, defaultStatus: 'todo' });
  }

  handleFormSubmit(payload: TaskFormSubmit): void {
    const current = this.formState();
    if (current.task) {
      this.taskService.updateTask(current.task.id, payload);
    } else {
      this.taskService.addTask({
        title: payload.title,
        description: payload.description,
        priority: payload.priority,
        category: payload.category,
        deadline: payload.deadline,
        status: payload.status,
      });
    }
    this.closeForm();
  }

  confirmRemove(task: Task): void {
    this.taskPendingDelete.set(task);
  }

  cancelDelete(): void {
    this.taskPendingDelete.set(null);
  }

  performDelete(): void {
    const pending = this.taskPendingDelete();
    if (pending) {
      this.taskService.deleteTask(pending.id);
    }
    this.taskPendingDelete.set(null);
  }

  deleteMessage(task: Task): string {
    return `"${task.title}" will be permanently removed.`;
  }

  handleDrop(event: CdkDragDrop<Task[]>): void {
    const targetColumnId = event.container.id as ColumnId;
    const movedTask = event.item.data as Task;

    if (event.previousContainer === event.container) {
      const ids = event.container.data.map((task) => task.id);
      moveItemInArray(ids, event.previousIndex, event.currentIndex);
      this.taskService.reorderWithinColumn(targetColumnId, ids);
      return;
    }

    this.taskService.moveTask(movedTask.id, targetColumnId);
  }
}
