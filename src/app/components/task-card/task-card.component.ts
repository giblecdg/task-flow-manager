import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { Task } from '../../models/task.model';
import { priorityStyle } from '../../shared/priority-styles';

@Component({
  selector: 'app-task-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article
      class="group relative rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 p-4 cursor-grab active:cursor-grabbing"
      [class.ring-2]="true"
      [class]="ringClass()"
    >
      <div class="flex items-start justify-between gap-2">
        <h4 class="font-semibold text-sm text-slate-900 dark:text-slate-100 leading-snug">
          {{ task().title }}
        </h4>
        <span
          class="text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full"
          [class]="badgeClass()"
        >
          {{ priorityLabel() }}
        </span>
      </div>

      @if (task().description) {
        <p class="mt-2 text-xs text-slate-600 dark:text-slate-400 line-clamp-3">
          {{ task().description }}
        </p>
      }

      <div class="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
        @if (task().category) {
          <span
            class="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700/70 text-slate-700 dark:text-slate-200 font-medium"
          >
            #{{ task().category }}
          </span>
        }
        @if (task().deadline; as deadline) {
          <span
            class="inline-flex items-center gap-1"
            [class.text-rose-500]="isOverdue()"
            [class.dark:text-rose-400]="isOverdue()"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" class="h-3.5 w-3.5">
              <path
                fill-rule="evenodd"
                d="M5.75 2a.75.75 0 0 1 .75.75V4h7V2.75a.75.75 0 0 1 1.5 0V4h.25A2.75 2.75 0 0 1 18 6.75v8.5A2.75 2.75 0 0 1 15.25 18H4.75A2.75 2.75 0 0 1 2 15.25v-8.5A2.75 2.75 0 0 1 4.75 4H5V2.75A.75.75 0 0 1 5.75 2Zm-1 4.5c-.69 0-1.25.56-1.25 1.25v.5h13v-.5c0-.69-.56-1.25-1.25-1.25H4.75Zm11.75 3.25h-13v5.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-5.5Z"
                clip-rule="evenodd"
              />
            </svg>
            {{ formattedDeadline() }}
          </span>
        }
      </div>

      <div
        class="mt-3 flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <button
          type="button"
          class="text-xs font-medium px-2 py-1 rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
          (click)="edit.emit(task())"
        >
          Edit
        </button>
        <button
          type="button"
          class="text-xs font-medium px-2 py-1 rounded-md text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10"
          (click)="remove.emit(task())"
        >
          Delete
        </button>
      </div>
    </article>
  `,
})
export class TaskCardComponent {
  readonly task = input.required<Task>();
  readonly edit = output<Task>();
  readonly remove = output<Task>();

  private readonly style = computed(() => priorityStyle(this.task().priority));

  readonly badgeClass = computed(() => this.style().badge);
  readonly ringClass = computed(() => `ring-1 ${this.style().ring}`);
  readonly priorityLabel = computed(() => this.style().label);

  readonly formattedDeadline = computed(() => {
    const deadline = this.task().deadline;
    if (!deadline) {
      return '';
    }
    const date = new Date(deadline);
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  });

  readonly isOverdue = computed(() => {
    const deadline = this.task().deadline;
    if (!deadline || this.task().status === 'done') {
      return false;
    }
    return new Date(deadline).getTime() < Date.now();
  });
}
