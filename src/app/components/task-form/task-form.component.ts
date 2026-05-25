import { ChangeDetectionStrategy, Component, computed, inject, input, OnInit, output } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ColumnId, PRIORITIES, Priority, Task } from '../../models/task.model';

export interface TaskFormSubmit {
  title: string;
  description: string;
  priority: Priority;
  category: string;
  deadline: string | null;
  status: ColumnId;
}

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [ReactiveFormsModule, TitleCasePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      (click)="dismiss.emit()"
    >
      <div
        class="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden"
        (click)="$event.stopPropagation()"
      >
        <header class="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
          <h2 class="text-lg font-semibold text-slate-900 dark:text-slate-100">
            {{ heading() }}
          </h2>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {{ subheading() }}
          </p>
        </header>

        <form
          [formGroup]="form"
          (ngSubmit)="onSubmit()"
          class="p-6 space-y-4"
          autocomplete="off"
        >
          <label class="block">
            <span class="text-xs font-medium text-slate-700 dark:text-slate-300">Title</span>
            <input
              type="text"
              formControlName="title"
              placeholder="Design onboarding screen"
              class="mt-1 w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            @if (showError('title')) {
              <span class="text-xs text-rose-500 mt-1 block">Title is required.</span>
            }
          </label>

          <label class="block">
            <span class="text-xs font-medium text-slate-700 dark:text-slate-300">Description</span>
            <textarea
              formControlName="description"
              rows="3"
              placeholder="Optional context for this task..."
              class="mt-1 w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            ></textarea>
          </label>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label class="block">
              <span class="text-xs font-medium text-slate-700 dark:text-slate-300">Priority</span>
              <select
                formControlName="priority"
                class="mt-1 w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                @for (priority of priorities; track priority) {
                  <option [value]="priority">{{ priority | titlecase }}</option>
                }
              </select>
            </label>

            <label class="block">
              <span class="text-xs font-medium text-slate-700 dark:text-slate-300">Category</span>
              <input
                type="text"
                formControlName="category"
                placeholder="design, frontend..."
                class="mt-1 w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </label>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label class="block">
              <span class="text-xs font-medium text-slate-700 dark:text-slate-300">Status</span>
              <select
                formControlName="status"
                class="mt-1 w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </label>

            <label class="block">
              <span class="text-xs font-medium text-slate-700 dark:text-slate-300">Deadline</span>
              <input
                type="date"
                formControlName="deadline"
                class="mt-1 w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </label>
          </div>

          <footer
            class="flex justify-end gap-2 pt-4 -mx-6 -mb-6 px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700"
          >
            <button
              type="button"
              class="px-4 py-2 text-sm font-medium rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              (click)="dismiss.emit()"
            >
              Cancel
            </button>
            <button
              type="submit"
              [disabled]="form.invalid"
              class="px-4 py-2 text-sm font-medium rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white shadow-sm transition-colors"
            >
              {{ submitLabel() }}
            </button>
          </footer>
        </form>
      </div>
    </div>
  `,
})
export class TaskFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);

  readonly task = input<Task | null>(null);
  readonly defaultStatus = input<ColumnId>('todo');

  readonly submitForm = output<TaskFormSubmit>();
  readonly dismiss = output<void>();

  readonly priorities = PRIORITIES;

  readonly heading = computed(() => (this.task() ? 'Edit task' : 'Create task'));
  readonly subheading = computed(() =>
    this.task()
      ? 'Update the fields below and save your changes.'
      : 'Fill in the details to add a new task to your board.',
  );
  readonly submitLabel = computed(() => (this.task() ? 'Save changes' : 'Add task'));

  readonly form = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(1)]],
    description: [''],
    priority: ['medium' as Priority, Validators.required],
    category: [''],
    status: ['todo' as ColumnId, Validators.required],
    deadline: [''],
  });

  ngOnInit(): void {
    const existing = this.task();
    if (existing) {
      this.form.patchValue({
        title: existing.title,
        description: existing.description,
        priority: existing.priority,
        category: existing.category,
        status: existing.status,
        deadline: existing.deadline ? existing.deadline.slice(0, 10) : '',
      });
    } else {
      this.form.patchValue({ status: this.defaultStatus() });
    }
  }

  showError(controlName: string): boolean {
    const control = this.form.get(controlName);
    return !!control && control.invalid && (control.touched || control.dirty);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.getRawValue();
    this.submitForm.emit({
      title: value.title,
      description: value.description,
      priority: value.priority,
      category: value.category,
      status: value.status,
      deadline: value.deadline ? new Date(value.deadline).toISOString() : null,
    });
  }
}
