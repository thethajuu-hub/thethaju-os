# THE THAJU FOUNDER OS

A private, single-founder operating system for running a life, a body of businesses, and a body of work — from one place.

This repository contains the **Foundation phase** only: authentication, the application shell, the design system, and the Command Center structure. The 18 remaining modules (Vision & Goals, Business Portfolio, Personal Finance, etc.) are wired into navigation and routing as **reserved routes**, ready for their own build phases.

---

## Stack

- **Next.js 14** (App Router, Server Actions, Server Components)
- **TypeScript**, strict mode
- **Tailwind CSS** — monochrome design token system (see `src/app/globals.css`)
- **shadcn/ui-style primitives** built on **Radix UI** (`src/components/ui/`)
- **Supabase** (`@supabase/ssr`) — single-admin-account authentication, no sign-up flow
- **next-themes** — light / dark / system, no flash-of-wrong-theme
- **Self-hosted fonts** via `@fontsource` (Inter + JetBrains Mono) — no runtime dependency on Google's font CDN, so the build works offline and behind restrictive networks

## Getting started

```bash
npm install
cp .env.example .env.local
```

### 1. Set up Supabase (auth)

1. Create a free project at [supabase.com](https://supabase.com).
2. Copy your **Project URL** and **anon public key** from Project Settings → API into `.env.local`:

   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

3. This is a **single-admin-account** system — there's no sign-up page by design. Create your one account directly in Supabase: **Authentication → Users → Add user**, and set an email + password there.
4. Without these two variables set, the app still runs — the auth gate is bypassed and a local placeholder profile is used, so you can keep building the UI without a Supabase project. The moment both variables are present, `/login` and the middleware auth gate activate for real.

### 2. Run it

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you'll land on `/command-center` (or `/login` if Supabase is configured and you're signed out).

### 3. Verify before you ship

```bash
npm run typecheck   # tsc --noEmit
npm run lint        # next lint
npm run build        # production build
```

All three are clean on this codebase as delivered.

---

## Project structure

```
src/
  app/
    (auth)/               Public route group — /login, server actions for sign-in/sign-out
    (app)/                 Protected route group — sidebar + header shell, all modules
      command-center/      The only fully-built dashboard in this phase
      settings/             Profile, Appearance, Notifications, Data & Backup
      business/ life/ money/ growth/ journal/   Expandable parents — index page is a
                             <ModuleHubPage>, each child folder a <ReservedModulePage>
      vision/ ideas/ coach/ timeline/            Standalone leaves — <ReservedModulePage>
    layout.tsx              Root layout — fonts, theme provider, tooltip provider
    globals.css              Design tokens (light + dark), scrollbars, focus rings, motion
  components/
    ui/                     Reusable primitives: button, card, input, dialog, dropdown, etc.
    layout/                  Sidebar, header, mobile nav, theme toggle, user menu
    dashboard/                Mission Control, priority list, stat card, module-hub, reserved-module
    providers/                Theme + tooltip providers
  lib/
    navigation.ts            Single source of truth for the sidebar — a tree of groups → items →
                              optional children. Add a module here first; everything else follows.
    supabase/                 Browser client, server client, middleware session refresh
    utils.ts                   cn(), formatCurrency(), getInitials()
  middleware.ts               Auth gate — redirects signed-out visitors to /login
  types/index.ts               Shared TypeScript types
```

### Navigation hierarchy

The sidebar is condensed into ~11 top-level entries across 7 groups (Overview, Direction, Business, Capital, Growth, Journal, AI), with five of them — **Life, Business, Money, Growth, Journal** — expandable via progressive disclosure instead of exposing every module flat. Expanding a parent reveals its children inline with a smooth height transition; collapsing the sidebar to icon-only mode turns each parent back into a direct link to its hub page. Expand/collapse state persists in `localStorage` and the active branch auto-expands on deep links.

Old flat URLs from the previous structure (e.g. `/vision-goals`, `/business-portfolio`) still resolve via permanent redirects defined in `next.config.mjs`, so nothing bookmarked breaks.

## Design system

A sophisticated **layered neutral palette** — off-white → soft grey → medium grey → charcoal → near-black — rather than stark black/white. The sidebar (`--sidebar-bg`) sits one tone apart from the main content area (`--bg`) for quiet visual separation, and cards (`--surface`) sit a touch lighter still. A single muted blue accent (`--accent`) exists only for focus rings — active navigation states use a soft grey surface, never color.

All color, radius, and shadow values are CSS custom properties defined once in `globals.css` and consumed through `tailwind.config.ts` — change a value there and it updates everywhere, in both themes, automatically.


- **Radius**: 8–20px scale (`rounded-sm` through `rounded-2xl`)
- **Type**: Inter for UI text, JetBrains Mono for numbers and data (revenue figures, stats)
- **Motion**: short, purposeful — fade/scale on 150–350ms, respects `prefers-reduced-motion`
- **States**: every list/section in the app has a matching loading skeleton (`<Skeleton />`), empty state (`<EmptyState />`), and error state (`<ErrorState />`) — see `command-center/loading.tsx` and `(app)/error.tsx` for the pattern to copy into new modules

## Adding a new module (future phase)

1. Flip its `status` from `"reserved"` to `"live"` in `src/lib/navigation.ts` (or add a new entry) — this is the single source of truth for the sidebar, so nothing else needs to change to make it appear.
2. Replace the generated `page.tsx` in `src/app/(app)/<module>/` (currently just `<ReservedModulePage href="/..." />`) with the real module UI.
3. Reuse the primitives in `src/components/ui/` and the dashboard components in `src/components/dashboard/` — they're built to be the vocabulary the whole OS speaks, not just the Command Center.

## What's intentionally not in this phase

Per the foundation-only scope: no business logic for the 18 reserved modules, no database tables beyond Supabase auth, no AI Founder Coach, no real financial data. Mission Control's targets are wired to `0` on purpose — they're designed to be fed by Business Portfolio and Personal Finance once those ship.
