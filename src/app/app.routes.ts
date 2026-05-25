import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'board' },
  {
    path: 'board',
    loadComponent: () =>
      import('./components/board/board.component').then((m) => m.BoardComponent),
    title: 'Board · Task Flow Manager',
  },
  {
    path: 'stats',
    loadComponent: () =>
      import('./components/stats/stats.component').then((m) => m.StatsComponent),
    title: 'Stats · Task Flow Manager',
  },
  { path: '**', redirectTo: 'board' },
];
