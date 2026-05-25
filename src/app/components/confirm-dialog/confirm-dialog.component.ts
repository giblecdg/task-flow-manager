import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      (click)="cancel.emit()"
    >
      <div
        class="w-full max-w-sm rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden"
        (click)="$event.stopPropagation()"
      >
        <div class="p-6">
          <h3 class="text-lg font-semibold text-slate-900 dark:text-slate-100">
            {{ title() }}
          </h3>
          <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">
            {{ message() }}
          </p>
        </div>
        <div
          class="flex justify-end gap-2 px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700"
        >
          <button
            type="button"
            class="px-4 py-2 text-sm font-medium rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            (click)="cancel.emit()"
          >
            {{ cancelLabel() }}
          </button>
          <button
            type="button"
            class="px-4 py-2 text-sm font-medium rounded-lg bg-rose-600 hover:bg-rose-700 text-white shadow-sm transition-colors"
            (click)="confirm.emit()"
          >
            {{ confirmLabel() }}
          </button>
        </div>
      </div>
    </div>
  `,
})
export class ConfirmDialogComponent {
  readonly title = input<string>('Are you sure?');
  readonly message = input<string>('This action cannot be undone.');
  readonly confirmLabel = input<string>('Delete');
  readonly cancelLabel = input<string>('Cancel');

  readonly confirm = output<void>();
  readonly cancel = output<void>();
}
