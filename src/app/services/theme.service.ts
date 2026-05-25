import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { StorageService } from './storage.service';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'tfm:theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly storage = inject(StorageService);
  private readonly themeSignal = signal<Theme>(this.resolveInitialTheme());

  readonly theme = this.themeSignal.asReadonly();
  readonly isDark = computed(() => this.themeSignal() === 'dark');

  constructor() {
    effect(() => {
      const current = this.themeSignal();
      this.applyTheme(current);
      this.storage.write<Theme>(STORAGE_KEY, current);
    });
  }

  toggle(): void {
    this.themeSignal.update((current) => (current === 'dark' ? 'light' : 'dark'));
  }

  set(theme: Theme): void {
    this.themeSignal.set(theme);
  }

  private resolveInitialTheme(): Theme {
    const stored = this.storage.read<Theme | null>(STORAGE_KEY, null);
    if (stored === 'light' || stored === 'dark') {
      return stored;
    }
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  }

  private applyTheme(theme: Theme): void {
    if (typeof document === 'undefined') {
      return;
    }
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }
}
