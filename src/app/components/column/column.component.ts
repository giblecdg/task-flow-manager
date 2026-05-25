import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { CdkDrag, CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';
import { ColumnDefinition, Task } from '../../models/task.model';
import { TaskCardComponent } from '../task-card/task-card.component';

@Component({
  selector: 'app-column',
  standalone: true,
  imports: [CdkDropList, CdkDrag, TaskCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section
      class="flex flex-col rounded-2xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden min-h-[280px]"
    >
      <header
        class="px-5 py-4 bg-gradient-to-r border-b border-slate-200 dark:border-slate-800 flex items-center justify-between"
        [class]="'bg-gradient-to-r ' + definition().accent"
      >
        <div class="flex items-center gap-2 text-white">
          <h3 class="text-sm font-semibold tracking-wide uppercase">
            {{ definition().title }}
          </h3>
          <span
            class="text-xs font-medium px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-sm"
          >
            {{ tasks().length }}
          </span>
        </div>
        <button
          type="button"
          class="text-xs font-medium text-white/90 hover:text-white px-2 py-1 rounded-md hover:bg-white/15 transition-colors"
          (click)="addRequested.emit(definition().id)"
        >
          + Add
        </button>
      </header>

      <div
        cdkDropList
        [id]="definition().id"
        [cdkDropListData]="tasks()"
        [cdkDropListConnectedTo]="connectedTo()"
        (cdkDropListDropped)="onDrop($event)"
        class="flex flex-col gap-3 p-4 flex-1 overflow-y-auto scrollbar-thin"
      >
        @for (task of tasks(); track task.id) {
          <div cdkDrag [cdkDragData]="task">
            <app-task-card
              [task]="task"
              (edit)="editRequested.emit($event)"
              (remove)="removeRequested.emit($event)"
            />
          </div>
        } @empty {
          <div
            class="empty-column-anim flex flex-col items-center justify-center text-center py-10 text-slate-400 dark:text-slate-500"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" class="h-10 w-10 mb-3">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M9 5h6a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Zm1 4h4M10 13h4"
              />
            </svg>
            <p class="text-xs max-w-[200px]">{{ definition().emptyMessage }}</p>
          </div>
        }
      </div>
    </section>
  `,
})
export class ColumnComponent {
  readonly definition = input.required<ColumnDefinition>();
  readonly tasks = input.required<Task[]>();
  readonly connectedColumnIds = input.required<string[]>();

  readonly editRequested = output<Task>();
  readonly removeRequested = output<Task>();
  readonly addRequested = output<string>();
  readonly dropped = output<CdkDragDrop<Task[]>>();

  readonly connectedTo = computed(() =>
    this.connectedColumnIds().filter((id) => id !== this.definition().id),
  );

  onDrop(event: CdkDragDrop<Task[]>): void {
    this.dropped.emit(event);
  }
}
