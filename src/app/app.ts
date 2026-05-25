import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <app-header />
      <main class="flex-1">
        <router-outlet />
      </main>
      <footer
        class="border-t border-slate-200 dark:border-slate-800 py-4 text-center text-xs text-slate-500 dark:text-slate-500"
      >
        Built with Angular {{ angularYear }} · Drag, drop, deliver.
      </footer>
    </div>
  `,
})
export class App {
  protected readonly theme = inject(ThemeService);
  protected readonly angularYear = new Date().getFullYear();
}
