# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Marketing website for "Raiki Services" (web design / SEO agency). Angular 21 SSR
application served by Express, deployed on Render.com. UI content is in French;
an English content set exists but the language is hardcoded to `fr` at runtime.

## Commands

```bash
npm start                  # dev server at http://localhost:4200 (ng serve, development config)
npm run build              # production build → dist/ (SSR: browser + server bundles)
npm run watch              # rebuild on change (development config)
npm test                   # unit tests via Vitest (@angular/build:unit-test builder)
npm run serve:ssr:raikiservices-ssr   # run the built SSR server locally

# Run a single test file
npx ng test --include='src/app/components/my-button/my-button.spec.ts'

# Scaffold (uses `app` prefix, no `.component` suffix — see naming below)
ng generate component components/foo
```

Formatting is Prettier (`.prettierrc`): 100 col, single quotes, `angular` parser for `.html`.

## Architecture

### SSR + serving
- `src/main.ts` bootstraps the browser app; `src/main.server.ts` the server app.
- `src/server.ts` is the Express entry: serves static `/browser` assets (1y cache),
  exposes `GET /api/ping` (Render health check), and delegates everything else to
  `AngularNodeAppEngine`. Add REST endpoints here **before** the catch-all Angular handler.
- `src/app/app.routes.server.ts` currently forces `RenderMode.Client` for all routes —
  the server ships an SSR shell but pages hydrate/render client-side. Change the render
  mode here if a route needs true server rendering.
- Deploy config is `render.yaml`. `NG_ALLOWED_HOSTS` and `NG_TRUST_PROXY_HEADERS` env vars
  are required in production: without them Angular 21 falls back to CSR behind Render's
  proxy and breaks SEO. Update `NG_ALLOWED_HOSTS` when the domain changes.

### Angular conventions (v21, standalone, signals)
- **No `.component.ts` / `.service.ts` file suffixes.** A component lives in `home.ts` /
  `home.html` / `home.css`, exported as class `Home`. Match this when adding files.
- **Page components use `export default`** because routes lazy-load them via
  `loadComponent: () => import('./pages/...')` in `src/app/app.routes.ts`. Route paths
  are French (`/sites-web`, `/etudes-de-cas`, `/tarifs`, `/a-propos`, …).
- Everything is standalone (no NgModules); state is signal-based. Browser-only code is
  guarded with `isPlatformBrowser(inject(PLATFORM_ID))` (scroll listeners, `IntersectionObserver`,
  `localStorage`) — SSR runs the same code on the server, so keep new DOM/browser access guarded.

### Two separate theming systems (important — do not conflate)
1. **Brand tokens** — `src/app/services/theme.service.ts` reads `src/app/config/brand/theme.ts`
   (`themeConfig`) and writes CSS custom properties (`--brand-*`, `--font-*`, `--radius-*`, …)
   onto `:root` once at startup (called from `App` constructor in `src/app/app.ts`).
   `src/styles.css` maps those vars into Tailwind v4's `@theme`. Change brand colors/fonts here.
2. **Light/dark mode + PrimeNG** — `src/app/theme/theme.service.ts` toggles the `.app-dark`
   class on `<html>` and persists to `localStorage`. `src/app/theme/app-preset.ts` defines the
   PrimeNG (Aura) preset (orange primary), registered in `src/app/app.config.ts`.

   **There are two classes both named `ThemeService`** in different folders. Import the right
   one: `theme/theme.service` for dark-mode toggling, `services/theme.service` for brand tokens.

### Config-driven content & i18n
- `src/app/config/brand/` (`company.ts`, `social.ts`, `theme.ts`) and
  `src/app/config/content/` (`fr.ts`, `en.ts`) hold all editable data. Services
  (`CompanyService`, `SocialService`, `LanguageService`) wrap these as signals — inject the
  service rather than importing the config directly in components.
- `LanguageService.content` is a `computed()` that switches between `fr`/`en`; `language` is
  hardcoded to `'fr'`. Note that much page copy is still inlined in component `.ts` files
  (e.g. `pages/home/home.ts`), not yet routed through the content config.

### Styling
- Tailwind CSS v4 (`@import 'tailwindcss'` in `styles.css`, `@tailwindcss/postcss` via `.postcssrc.json`)
  + PrimeNG + primeicons. PrimeNG is placed in a CSS layer below Tailwind utilities (`cssLayer`
  config in `app.config.ts`) so utilities win.
- Third-party animated UI comes from `@omnedia/ngx-*` (particles, typewriter, number-ticker,
  timeline, aurora); components importing them set `schemas: [CUSTOM_ELEMENTS_SCHEMA]`.
- The `animateOnScroll` directive (`src/app/directives/animate-on-scroll.ts`) adds an `active`
  class when an element scrolls into view — style the reveal in the component's CSS.

### Layout
`src/app/pages/*` are routed pages; `src/app/components/*` are reusable pieces (`Header`,
`Footer`, `Container`, `MyButton`, `MySlider`, FAQ set, etc.); `src/app/models/*` are the
TypeScript interfaces for the config/content shapes. Static images live in `public/` and are
referenced by absolute path (e.g. `img/home/...`).
