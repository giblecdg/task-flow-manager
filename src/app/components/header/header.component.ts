import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header
      class="sticky top-0 z-30 backdrop-blur bg-white/80 dark:bg-slate-950/70 border-b border-slate-200 dark:border-slate-800"
    >
      <div class="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 h-16 flex items-center justify-between gap-4">
        <a routerLink="/board" class="flex items-center gap-2 group">
          <span
            class="h-9 w-9 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" class="h-5 w-5">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M4 6h4v12H4zM10 6h4v8h-4zM16 6h4v5h-4z"
              />
            </svg>
          </span>
          <div class="flex flex-col leading-tight">
            <span class="text-sm font-bold text-slate-900 dark:text-slate-100">
              Task Flow
            </span>
            <span class="text-[10px] uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Manager
            </span>
          </div>
        </a>

        <nav class="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/70 rounded-full p-1 text-sm">
          <a
            routerLink="/board"
            routerLinkActive="bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm"
            class="px-3 py-1.5 rounded-full text-slate-600 dark:text-slate-300 font-medium transition-colors"
          >
            Board
          </a>
          <a
            routerLink="/stats"
            routerLinkActive="bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm"
            class="px-3 py-1.5 rounded-full text-slate-600 dark:text-slate-300 font-medium transition-colors"
          >
            Stats
          </a>
        </nav>

        <button
          type="button"
          class="h-9 w-9 rounded-full flex items-center justify-center bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
          [attr.aria-label]="theme.isDark() ? 'Switch to light mode' : 'Switch to dark mode'"
          (click)="theme.toggle()"
        >
          @if (theme.isDark()) {
            <svg viewBox="0 0 20 20" fill="currentColor" class="h-4 w-4">
              <path
                d="M10 2a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 10 2Zm5.657 2.343a.75.75 0 0 1 0 1.06l-1.06 1.061a.75.75 0 1 1-1.061-1.06l1.06-1.061a.75.75 0 0 1 1.06 0ZM18 10a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1 0-1.5h1.5A.75.75 0 0 1 18 10Zm-2.343 5.657a.75.75 0 0 1-1.06 0l-1.061-1.06a.75.75 0 1 1 1.06-1.061l1.061 1.06a.75.75 0 0 1 0 1.061ZM10 16a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 10 16Zm-5.657-.343a.75.75 0 0 1 0-1.06l1.06-1.061a.75.75 0 1 1 1.061 1.06l-1.06 1.061a.75.75 0 0 1-1.061 0ZM4 10a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1 0-1.5h1.5A.75.75 0 0 1 4 10Zm.343-5.657a.75.75 0 0 1 1.06 0l1.061 1.06a.75.75 0 1 1-1.06 1.061l-1.061-1.06a.75.75 0 0 1 0-1.061ZM10 6a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z"
              />
            </svg>
          } @else {
            <svg viewBox="0 0 20 20" fill="currentColor" class="h-4 w-4">
              <path
                d="M7.455 2.004a.75.75 0 0 1 .26.77 7 7 0 0 0 9.958 7.967.75.75 0 0 1 1.067.853A8.5 8.5 0 1 1 6.647 1.921a.75.75 0 0 1 .808.083Z"
              />
            </svg>
          }
        </button>
      </div>
    </header>
  `,
})
export class HeaderComponent {
  readonly theme = inject(ThemeService);
}
