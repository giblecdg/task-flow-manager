# Task Flow Manager

> A modern Kanban board built with Angular 21, signals, and Tailwind CSS — drag, drop, deliver.

[![Angular](https://img.shields.io/badge/Angular-21-DD0031?logo=angular&logoColor=white)](https://angular.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38BDF8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Build](https://img.shields.io/badge/build-passing-brightgreen)](#)

## Table of Contents

- [About](#-about)
- [Features](#-features)
- [Screenshots](#%EF%B8%8F-screenshots)
- [Tech Stack](#%EF%B8%8F-tech-stack)
- [Architecture](#%EF%B8%8F-architecture)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Available Scripts](#-available-scripts)
- [Key Concepts Demonstrated](#-key-concepts-demonstrated)
- [Roadmap](#%EF%B8%8F-roadmap)
- [Contributing](#-contributing)
- [License](#-license)
- [Author](#-author)

## 📋 About

**Task Flow Manager** is a lightweight, opinionated Kanban application designed to help individuals and small teams visualize and move work across the classic *To Do → In Progress → Done* pipeline. It focuses on the essentials — adding, editing, prioritizing, and dragging tasks — without the noise of feature-heavy enterprise tools.

The project was built as a showcase of **modern Angular patterns**: standalone components, the new control flow syntax, signals-based state management, and zoneless change detection. It is intentionally small in scope but production-grade in architecture, making it a strong reference for interview portfolios and learning materials.

Everything lives in the browser. Tasks and user preferences (including the dark mode toggle) are persisted to `localStorage` via a dedicated service, so no backend is required to run, demo, or extend the app.

## ✨ Features

- 🗂️ **Three-column Kanban board** — To Do, In Progress, Done.
- 🖱️ **Drag & drop** between columns and within a column, powered by `@angular/cdk/drag-drop`.
- ➕ **Create, edit and delete** tasks through a modal form built with Reactive Forms.
- 🎯 **Priority levels** (low / medium / high) with color-coded badges and rings.
- 🏷️ **Custom categories** — tag tasks with any label you need.
- ⏰ **Optional deadlines** with overdue highlighting.
- 🔎 **Search by title** with a 300ms RxJS debounce.
- 🧹 **Filter by priority and category** via `signal` + `computed` reactivity.
- 📊 **Stats view** showing tasks per column, priority distribution and overall completion %.
- 🌗 **Dark mode** toggle, persisted in `localStorage` and respecting system preference on first load.
- 💾 **Automatic persistence** — every change is mirrored to `localStorage`.
- 📱 **Responsive layout** — stacked on mobile, three columns on desktop.
- ♻️ **Reusable confirm dialog** for destructive actions.

## 🖼️ Screenshots

> Screenshots should be added after first run. Place PNGs in a `docs/` folder at the repo root.

![Board view](./docs/board.png)

![Statistics view](./docs/stats.png)

![Dark mode](./docs/dark.png)

## 🛠️ Tech Stack

| Technology              | Purpose                                                     | Version |
| ----------------------- | ----------------------------------------------------------- | ------- |
| Angular                 | Application framework (standalone APIs, signals, control flow) | 21.x    |
| TypeScript              | Strict, typed application code                              | 5.9.x   |
| Tailwind CSS            | Utility-first styling and dark-mode variants                | 4.x     |
| @angular/cdk/drag-drop  | Drag & drop interactions between Kanban columns             | 21.x    |
| Reactive Forms          | Modal task editor with validation                           | bundled |
| RxJS                    | Debounced search input pipeline                             | 7.8.x   |
| Vite / esbuild (via @angular/build) | Production builds                                | bundled |

## 🏗️ Architecture

The app follows a **service-driven, signal-first** architecture. Components are thin and declarative — all mutation logic lives inside services, which expose `signal`s and `computed`s for the UI to consume.

```
┌──────────────────────────────────────────────────────────────┐
│                          Components                          │
│   Header · Board · Column · TaskCard · TaskForm · Stats      │
│                  (standalone, OnPush, signals)               │
└──────────▲────────────────────────────────────────▲──────────┘
           │  reads computed() / calls actions      │
           │                                        │
┌──────────┴─────────────┐                ┌─────────┴──────────┐
│      TaskService       │                │    ThemeService    │
│  tasks: signal<Task[]> │                │  theme: signal     │
│  filteredTasks (comp.) │                │  isDark   (comp.)  │
│  stats         (comp.) │                │                    │
└──────────▲─────────────┘                └─────────▲──────────┘
           │                                        │
           └────────────────┬───────────────────────┘
                            ▼
                  ┌───────────────────┐
                  │  StorageService   │
                  │  read / write /   │
                  │  remove (LS)      │
                  └───────────────────┘
```

- **`TaskService`** owns the canonical `tasks` signal, derives `filteredTasks`, `categories`, and `stats` via `computed()`, debounces the search input through an RxJS `Subject`, and persists every change via an `effect()`.
- **`ThemeService`** exposes the current theme as a signal, mirrors it to the `<html>` class list, and persists the user choice.
- **`StorageService`** is the only place that touches `localStorage` — a thin, typed wrapper that gracefully degrades in non-browser environments.
- **Components** are all `standalone`, use `ChangeDetectionStrategy.OnPush`, and rely on the new `@if` / `@for` control flow syntax.

## 📁 Project Structure

```
task-flow-manager/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── board/              # Main Kanban view, filters, modals
│   │   │   ├── column/             # Single column with cdk drop-list
│   │   │   ├── confirm-dialog/     # Reusable confirmation modal
│   │   │   ├── header/             # Top nav, theme toggle, routing
│   │   │   ├── stats/              # Statistics dashboard
│   │   │   ├── task-card/          # Single draggable task card
│   │   │   └── task-form/          # Modal create/edit form
│   │   ├── models/
│   │   │   └── task.model.ts       # Task, Priority, ColumnId, stats
│   │   ├── services/
│   │   │   ├── storage.service.ts  # localStorage wrapper
│   │   │   ├── task.service.ts     # Tasks + filters + computed stats
│   │   │   └── theme.service.ts    # Dark / light mode
│   │   ├── shared/
│   │   │   └── priority-styles.ts  # Tailwind class lookup per priority
│   │   ├── app.config.ts           # Providers, router, zoneless CD
│   │   ├── app.routes.ts           # /board and /stats routes
│   │   └── app.ts                  # Root shell component
│   ├── index.html
│   ├── main.ts
│   └── styles.css                  # Tailwind + global tweaks
├── angular.json
├── package.json
├── tsconfig.json                   # strict: true
├── LICENSE
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.19+ (LTS recommended)
- **npm** 9+ (bundled with Node)
- **Angular CLI** 21+ — install globally with:

```bash
npm install -g @angular/cli
```

### Installation

```bash
git clone https://github.com/giblecdg/task-flow-manager.git
cd task-flow-manager
npm install
```

### Running locally

```bash
ng serve
```

Then open [http://localhost:4200](http://localhost:4200) in your browser. The app supports hot module replacement out of the box.

### Building for production

```bash
ng build
```

The optimized bundle will be emitted to `dist/task-flow-manager/`.

## 📜 Available Scripts

| Command          | Description                                              |
| ---------------- | -------------------------------------------------------- |
| `npm start`      | Alias for `ng serve` — starts the dev server on :4200.   |
| `npm run build`  | Production build into `dist/`.                           |
| `npm run watch`  | Development build in watch mode.                         |
| `npm test`       | Runs the unit test suite via the Angular test runner.    |
| `ng serve`       | Starts the dev server.                                   |
| `ng build`       | One-shot production build.                               |
| `ng generate`    | Scaffold components, services, etc.                      |

## 🎯 Key Concepts Demonstrated

This project intentionally exercises a curated set of modern Angular features — useful as a portfolio talking-point during interviews:

- **Standalone components** (no `NgModule`).
- **Signals** (`signal`, `computed`, `effect`) for reactive state management.
- **Zoneless change detection** (`provideZonelessChangeDetection`).
- **New control flow syntax** — `@if`, `@for` (with `track`), `@empty`, `@switch`.
- **`input()` / `output()` functions** for typed component IO.
- **Reactive Forms** with `FormBuilder`, validators and typed value access.
- **RxJS interop** — `Subject` + `debounceTime` + `takeUntilDestroyed` for search.
- **Dependency injection** with the `inject()` function.
- **Lazy-loaded routes** using `loadComponent`.
- **Angular CDK drag & drop** between connected `cdkDropList`s.
- **Tailwind CSS v4** with the `@custom-variant dark` strategy.
- **TypeScript `strict` mode** end-to-end, no `any` in app code.

## 🗺️ Roadmap

- ✅ MVP: board, filters, stats, dark mode, localStorage
- ⬜ Unit tests for `TaskService` and components
- ⬜ End-to-end tests (Playwright or Cypress)
- ⬜ REST / GraphQL backend integration
- ⬜ Real-time collaboration (WebSocket sync)
- ⬜ Progressive Web App (offline-first, installable)
- ⬜ Multi-user accounts and authentication
- ⬜ Task labels, subtasks and comments
- ⬜ Internationalization (i18n)
- ⬜ Drag-and-drop file attachments

## 🤝 Contributing

Contributions, ideas, and bug reports are very welcome! For anything non-trivial, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

See [CONTRIBUTING.md](./CONTRIBUTING.md) for the full guidelines *(placeholder — add a contributing guide before publishing the repo).*

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](./LICENSE) for more information.

If this project helped you, consider giving it a ⭐ on GitHub — it makes a real difference!
