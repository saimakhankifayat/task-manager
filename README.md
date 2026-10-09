# Taskflow

A calm, local-first task manager for planning your day with clarity. Built as a
production-quality front end with **Nuxt 4**, **Vue 3**, **TypeScript** and
**Tailwind CSS 4** — no backend, no accounts, no paid services.

![Palette: Midnight Blue #1C2E4A, Dusty Blue #52677D, Ivory #BDC4D4, Deep Navy #0F1A2B, Buttercream #D1CFC9](#design-system)

---

## Overview

Taskflow is a small SaaS-style product that stores everything in the browser's
`localStorage`. It opens on a dashboard that answers one question — *what needs
my attention today?* — and includes a full task workspace for search, filtering,
sorting and editing.

Every control in the interface works. There are no placeholder screens, fake
statistics or decorative buttons.

---

## Features

**Dashboard**

- Time-aware greeting and a short overview line.
- Live statistics: total, completed, active and overdue tasks.
- "Today's Progress" card with an animated, dynamically calculated bar.
- Today's tasks (overdue items first) with inline completion.
- Upcoming deadlines sorted by nearest due date, with human labels such as
  `Today`, `Tomorrow`, `In 3 days` or `Oct 14`.

**Tasks workspace (`/tasks`)**

- Reactive search across title and description (no Enter required).
- Filters: All, Active, Completed, Overdue — all derived from one task array.
- Sorting by due date, priority or created date, with an ascending/descending
  toggle.
- Task count with filtered context (`5 of 24`).

**Task management**

- Create and edit through one shared dialog (mobile-friendly bottom sheet that
  becomes a centred modal on larger screens).
- Required title validation with inline, described error messaging.
- Priority selection (low / medium / high) and due date with `Today` /
  `Tomorrow` / `Clear` shortcuts.
- Completion toggle that sets and clears `completedAt`.
- Delete flows always go through a reusable confirmation dialog.

**Appearance & data (`/settings`)**

- Theme preference: System, Light or Dark — a genuinely themed dark mode driven
  by the same design tokens, with an inline head script that prevents the wrong
  theme flashing on load.
- Data summary, "Remove sample tasks" and "Clear all tasks" (behind
  confirmation), plus success feedback via toasts.

**Throughout**

- Responsive navigation: fixed sidebar on desktop, slide-in drawer on mobile.
- Loading, empty, search-empty and error states for every list.
- Toast notifications, subtle transitions and `prefers-reduced-motion` support.
- Keyboard accessible dialogs (focus trap, `Escape`, focus restoration), skip
  link, visible focus rings and semantic markup.

---

## Tech Stack

| Concern       | Choice                                              |
| ------------- | --------------------------------------------------- |
| Framework     | Nuxt 4 (`app/` directory structure)                 |
| UI            | Vue 3, `<script setup lang="ts">`, Composition API  |
| Language      | TypeScript (strict)                                 |
| Styling       | Tailwind CSS 4 via the official Vite integration     |
| Icons         | Lucide (`@lucide/vue`)                              |
| State         | Nuxt `useState` composables + `computed`/`watch`     |
| Persistence   | Browser `localStorage` (SSR-safe)                   |
| Tooling       | `nuxt typecheck` (vue-tsc), `nuxt build`            |

---

## Architecture

- **`app/composables/useTasks.ts` is the single source of truth.** It owns the
  task array, every CRUD operation, persistence and derived state (`stats`,
  `todayTasks`, `upcomingTasks`, `sampleCount`). Pages never touch
  `localStorage` and never duplicate CRUD logic.
- **Derived values are computed, never synchronised.** Statistics, progress and
  filtered/sorted lists are all `computed` expressions over the same array, so a
  single mutation updates every view at once.
- **SSR safety by construction.** Task and theme state start empty and are
  hydrated in `onMounted` inside the default layout. The server renders a
  loading state, so there is no hydration mismatch and `localStorage` is never
  touched during server rendering.
- **Corruption is handled defensively.** Stored JSON is parsed and validated
  field by field; invalid records are dropped, an unreadable payload recovers
  to an empty list, and a storage failure surfaces the error state with a
  "Try again" action.
- **Shared overlays live in composables.** `useTaskForm` and `useConfirm` expose
  a single dialog instance rendered in the layout, so any component can open the
  task form or a confirmation without prop drilling. `useDialog` centralises
  focus trapping, `Escape` handling and focus restoration.
- **One design-token layer.** Brand colours and semantic tokens (`background`,
  `surface`, `foreground`, `border`, `primary`, `danger`, `success`, …) are
  defined as CSS variables and mapped into Tailwind's theme, so utilities such
  as `bg-surface` or `text-foreground-muted` work in both themes.

---

## Project Structure

```text
task-manager/
├── app/
│   ├── app.vue                    # Root component (layout + page)
│   ├── error.vue                  # Application error screen
│   ├── assets/css/main.css        # Design tokens, base styles, primitives
│   ├── components/
│   │   ├── AppSidebar.vue         # Desktop navigation
│   │   ├── AppDrawer.vue          # Mobile slide-in navigation
│   │   ├── AppHeader.vue          # Page title, date, quick-add
│   │   ├── AppLogo.vue
│   │   ├── TaskCard.vue           # Single task row
│   │   ├── TaskList.vue           # Animated task list
│   │   ├── TaskForm.vue           # Shared create/edit dialog
│   │   ├── TaskSearch.vue
│   │   ├── TaskFilters.vue
│   │   ├── StatCard.vue
│   │   ├── ProgressCard.vue
│   │   ├── EmptyState.vue
│   │   ├── LoadingState.vue
│   │   ├── ConfirmDialog.vue
│   │   └── ToastHost.vue
│   ├── composables/
│   │   ├── useTasks.ts            # Task state, CRUD, persistence
│   │   ├── useTaskForm.ts         # Shared task dialog state
│   │   ├── useConfirm.ts          # Shared confirmation dialog state
│   │   ├── useDialog.ts           # Focus trap / Escape / focus restore
│   │   ├── useTheme.ts            # System / Light / Dark
│   │   └── useToast.ts
│   ├── layouts/default.vue        # App shell, client initialisation
│   ├── pages/
│   │   ├── index.vue              # Dashboard
│   │   ├── tasks.vue              # Task workspace
│   │   └── settings.vue
│   ├── types/task.ts              # Central data model
│   └── utils/
│       ├── dates.ts               # Calendar + relative date helpers
│       ├── tasks.ts               # Filtering and sorting helpers
│       └── navigation.ts          # Navigation + page metadata
├── public/favicon.svg
├── nuxt.config.ts
├── package.json
└── tsconfig.json
```

---

## Installation

Requires Node.js 20+ (developed on Node 22) and npm.

```bash
npm install
```

## Development

```bash
npm run dev
```

The app runs at <http://localhost:3000>.

## Production Build

```bash
npm run build     # production build
npm run preview   # serve the build locally
npm run typecheck # vue-tsc type checking
```

---

## Data Persistence

| Key              | Contents                             |
| ---------------- | ------------------------------------ |
| `taskflow_tasks` | The full task array as JSON          |
| `taskflow_theme` | `system` \| `light` \| `dark`        |

- Reading happens **after mount** on the client only; the server never touches
  storage.
- Writing happens inside `useTasks` after every create, update, delete, toggle
  or clear.
- Invalid entries are discarded during load. Malformed JSON recovers to an empty
  list, and an inaccessible `localStorage` shows the error state instead of
  crashing.
- On the very first launch a small set of tasks is seeded and flagged as
  `isSample`, so examples can be removed separately (Settings → Remove sample
  tasks) and are never regenerated once storage exists.

---

## Design System

The five brand colours drive the whole interface:

| Token          | Hex       | Role                                 |
| -------------- | --------- | ------------------------------------ |
| Midnight Blue  | `#1C2E4A` | Primary brand / navigation           |
| Dusty Blue     | `#52677D` | Secondary blue, interactive elements |
| Ivory          | `#BDC4D4` | Cool light surface, icons on navy    |
| Deep Navy      | `#0F1A2B` | Darkest ink, dark theme background   |
| Buttercream    | `#D1CFC9` | Rare warm neutral contrast           |

These are exposed as CSS variables and semantic tokens (`--background`,
`--surface`, `--foreground`, `--border`, `--primary`, `--accent`, `--danger`,
`--success`, …) which the dark theme overrides. Components only reference the
semantic layer, so the palette can be tuned in one place and both themes stay
coherent.

Typography uses one system sans stack with a clear hierarchy: page title →
section title → task title → metadata → supporting text. Radii are restrained
(`rounded-md` for controls, `rounded-lg` for surfaces) and depth comes from thin
borders rather than heavy shadows.

---

## Responsive Behaviour

Verified from 320 px upwards:

- **< 640 px** — compact header with a menu button, slide-in navigation drawer,
  stacked forms, bottom-sheet task dialog, always-visible task actions and
  full-width toolbars.
- **640 – 1024 px** — two-column statistics, inline toolbars, centred dialogs.
- **≥ 1024 px** — fixed sidebar, four-column statistics, two-column dashboard
  layout.

Content is constrained to a `max-w-6xl` column so the interface stays readable
on very wide screens.

---

## Accessibility

- Semantic landmarks (`header`, `nav`, `main`, `section`) with labelled regions.
- Real `<button>`, `<label>`, `<input>` and `<fieldset>` elements — no clickable
  `<div>`s.
- Dialogs use `role="dialog"`/`aria-modal`, are labelled, trap focus, close on
  `Escape` and restore focus to their trigger.
- Checkbox completion is exposed with a descriptive accessible name; priority
  and due state are conveyed with text, not colour alone.
- Visible `:focus-visible` outlines, a skip link, and ARIA live regions for
  toasts.
- All motion is suppressed under `prefers-reduced-motion: reduce`.

---

## Future Improvements

- Task grouping / projects and tags.
- Recurring tasks and reminders.
- Keyboard shortcuts (quick add, command palette).
- Import / export of task data as JSON.
- Optional sync backend (the composable boundary already allows swapping
  persistence without touching the UI).
- Unit tests for the date, filtering and sorting helpers.
