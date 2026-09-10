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
- `src/app/app.routes.server.ts` pre-renders the marketing pages (`RenderMode.Prerender`)
  and forces `RenderMode.Client` for `sandbox`, the auth screens and everything under
  `admin/**` — those depend on the visitor's session and must not be pre-rendered.
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
- The four legal pages (`/mentions-legales`, `/politique-de-confidentialite`,
  `/politique-de-cookies`, `/conditions-generales`) share one layout component
  (`components/legal-page`) and get their text from `config/content/legal.ts`. That file still
  contains `[À COMPLÉTER : …]` placeholders for facts only the company holds (registration,
  registered office, applicable law, payment terms) — fill them before going live. Its
  technical statements (data collected, cookies set, sub-processors) describe what the code
  actually does, so revisit them when adding analytics, a payment flow or a new form.
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

### Back-office (`/admin`) and the Spring backend
- The API is a separate Spring Boot app (`../backend`, port 8081 in dev). Its base URL lives in
  `src/environments/environment.ts` (production) / `environment.development.ts`, swapped by the
  `fileReplacements` entry in `angular.json`. The backend must list the site's origin in
  `app.cors.allowed-origins`, and `app.frontend-url` must point at this Angular app — the
  password-reset and notification emails build their links from it.
- `src/app/core/` holds everything API-related: `models/` (mirrors of the backend DTOs),
  `services/` (one per resource, most extending `CrudApi` which wraps the shared
  `PageResponse` list / get / create / update / delete contract), `guards/`, `interceptors/`,
  `directives/`, `utils/`.
- **Auth model**: the access token is kept in memory only (`AuthService`); persistence across
  reloads comes from the HttpOnly `refresh_token` cookie, scoped to `/api/v1/auth`. Hence
  `withCredentials` on those calls only. `authInterceptor` attaches the bearer token and, on a
  401, refreshes once and replays the request — with a module-level guard so concurrent 401s
  share a single refresh (the backend rotates the refresh token, so parallel refreshes would
  kill the session).
- **Authorisation**: `authGuard` / `guestGuard` (`core/guards/auth.guard.ts`) and
  `hasPermission('READ_USER', …)` (`permission.guard.ts`) on routes; `*appHasPermission` to
  hide actions in templates. All of it is display convenience — the backend's `@PreAuthorize`
  is what actually decides, and permission names (`ACTION_RESOURCE`) must match its strings.
- Admin screens live in `src/app/pages/admin/*`; `admin-layout` is the shell (sidebar filtered
  by permission, notification bell over SSE, `p-toast` / `p-confirmDialog` outlets) and
  provides `MessageService` / `ConfirmationService` so the marketing bundle stays free of them.
  Shared admin CSS (`.panel`, `.stat-card`, `.page-header`, …) is global, in
  `src/styles/admin.css`, to stay under the 4 kB per-component style budget.
- Routes fixed by the backend's emails — do not rename: `/reset-password?token=`,
  `/admin/contact/:id`, `/admin/contact`, `/admin/users`, `/admin/blog`.
- The blog is the one resource with a public face as well: `BlogService` wraps both
  `/api/v1/blog` (drafts included, `*_BLOG` permissions) and `/public/v1/blog` (published
  posts only, no auth). Admin screens are the list (`pages/admin/blog`) and a full-page
  editor (`pages/admin/blog-editor`, routed as `blog/nouveau` **before** `blog/:id`) — a
  dialog like the other resources would be too cramped for an article body. Slug and
  `publishedAt` are the backend's to set; publishing notifies once, on the draft→published
  transition only. No public `/blog` page exists on the marketing site yet.
- Lists are server-driven: `p-table` in `[lazy]` mode maps `first`/`rows`/`sortField`/
  `sortOrder` onto the backend's `PageQuery`. Only the fields each backend service whitelists
  are sortable — the service files document them.

### Layout
`src/app/pages/*` are routed pages; `src/app/components/*` are reusable pieces (`Header`,
`Footer`, `Container`, `MyButton`, `MySlider`, FAQ set, etc.); `src/app/models/*` are the
TypeScript interfaces for the config/content shapes. Static images live in `public/` and are
referenced by absolute path (e.g. `img/home/...`).
