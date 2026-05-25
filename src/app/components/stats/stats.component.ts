import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { COLUMN_DEFINITIONS, PRIORITIES, Priority } from '../../models/task.model';
import { TaskService } from '../../services/task.service';
import { priorityStyle } from '../../shared/priority-styles';

interface PriorityRow {
  priority: Priority;
  count: number;
  label: string;
  dot: string;
  percent: number;
}

@Component({
  selector: 'app-stats',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="px-4 sm:px-6 lg:px-10 py-8 max-w-[1600px] mx-auto">
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-slate-900 dark:text-slate-100">Statistics</h1>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Real-time overview of your workload distribution and progress.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        @for (column of columns; track column.id) {
          <div
            class="rounded-2xl p-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm"
          >
            <div class="flex items-center justify-between">
              <span class="text-xs uppercase tracking-wide font-medium text-slate-500 dark:text-slate-400">
                {{ column.title }}
              </span>
              <span
                class="h-2 w-2 rounded-full bg-gradient-to-br"
                [class]="column.accent"
              ></span>
            </div>
            <div class="mt-3 text-3xl font-bold text-slate-900 dark:text-slate-100">
              {{ stats().perColumn[column.id] }}
            </div>
            <div class="text-xs text-slate-500 dark:text-slate-400 mt-1">
              tasks
            </div>
          </div>
        }
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <section
          class="rounded-2xl p-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm"
        >
          <h2 class="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-4">
            Priority breakdown
          </h2>
          @if (stats().total === 0) {
            <p class="text-sm text-slate-500 dark:text-slate-400">
              No data yet — create your first task to see insights.
            </p>
          } @else {
            <div class="space-y-3">
              @for (row of priorityRows(); track row.priority) {
                <div>
                  <div class="flex items-center justify-between text-xs mb-1">
                    <span class="flex items-center gap-2 text-slate-700 dark:text-slate-200 font-medium">
                      <span class="h-2 w-2 rounded-full" [class]="row.dot"></span>
                      {{ row.label }}
                    </span>
                    <span class="text-slate-500 dark:text-slate-400">
                      {{ row.count }} ({{ row.percent }}%)
                    </span>
                  </div>
                  <div class="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      class="h-full rounded-full transition-all duration-500"
                      [class]="row.dot"
                      [style.width.%]="row.percent"
                    ></div>
                  </div>
                </div>
              }
            </div>
          }
        </section>

        <section
          class="rounded-2xl p-6 border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-md"
        >
          <h2 class="text-sm font-semibold uppercase tracking-wide text-white/80 mb-4">
            Completion
          </h2>
          <div class="flex items-end gap-2">
            <span class="text-5xl font-bold">{{ stats().completionPercent }}</span>
            <span class="text-2xl font-semibold mb-1">%</span>
          </div>
          <p class="text-sm text-white/85 mt-2">
            {{ stats().perColumn.done }} of {{ stats().total }} tasks completed.
          </p>
          <div class="mt-4 h-2 rounded-full bg-white/20 overflow-hidden">
            <div
              class="h-full bg-white rounded-full transition-all duration-700"
              [style.width.%]="stats().completionPercent"
            ></div>
          </div>
        </section>
      </div>
    </div>
  `,
})
export class StatsComponent {
  private readonly taskService = inject(TaskService);

  readonly columns = COLUMN_DEFINITIONS;
  readonly stats = this.taskService.stats;

  readonly priorityRows = computed<PriorityRow[]>(() => {
    const total = this.stats().total;
    return PRIORITIES.map((priority) => {
      const count = this.stats().perPriority[priority];
      const style = priorityStyle(priority);
      return {
        priority,
        count,
        label: style.label,
        dot: style.dot,
        percent: total === 0 ? 0 : Math.round((count / total) * 100),
      };
    });
  });
}
