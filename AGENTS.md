<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

# Architecture Principles

- Server-first: use React Server Components by default. Add `'use client'` only when strictly necessary (event handlers, browser APIs, client state).
- Minimal client JS: avoid large client-side bundles. Keep client islands small and isolated.
- DRY: do not duplicate logic. Extract to a `packages/` workspace if used by more than one app; extract to `shared/` within `apps/web` if used by more than one module.
- Strong boundaries: modules own their UI and server logic. Infrastructure owns external communication. Shared packages own nothing domain-specific.
- Co-locate related code: tests, types, and styles live next to the file they belong to.
- Do not over-engineer: lean structure first, expand only when complexity justifies it. No deep nesting without need, no excess abstraction layers.

# Repository Structure

This is a **Turborepo monorepo**. There are two deployment targets (web + native app) sharing common packages.

```
apps/
  web/                  → Next.js website
    src/
      app/              → Routing, layouts, metadata, page entrypoints only
        (public)/       → Public routes
        (member)/       → Authenticated member routes
        api/            → API route handlers
        layout.tsx
        not-found.tsx
        global-error.tsx
        sitemap.ts
        robots.ts

      modules/          → Feature/domain ownership (UI + server logic)
        library/
          components/   → UI components for this module
          server/       → BFF — data orchestration, combining sources, caching
          library.model.ts
          index.ts
        events/
        cpd/
        commerce/
        account/
        navigation/

      infrastructure/   → External system integrations only
        cms/
        crm/
        commerce/
        auth/
        cache/

  native/               → Native wrapper app (iOS + Android)
                          Thin shell only — app store distribution, push
                          notifications, secure token storage, deep linking

packages/
  ui/                   → Shared UI components consumed by web and native
    atoms/
    molecules/
    organisms/
  types/                → Shared TypeScript types consumed by web and native
  utils/                → Shared utilities consumed by web and native
```

**Rules:**

- `apps/web/src/app/` contains only Next.js route files and entrypoints. No business logic, no data fetching.
- `apps/web/src/modules/<feature>/server/` is the BFF layer: orchestrate data, combine sources, apply caching, return UI-ready data.
- `apps/web/src/infrastructure/<system>/` contains gateways: external API calls, data normalisation, SDK isolation. Do not put caching logic here.
- `packages/` is for code shared across apps. Do not put domain-specific or app-specific logic here.
- `apps/native/` stays thin — business logic belongs in the shared application layer, not in the native shell.
- Atomic design (`atoms/`, `molecules/`, `organisms/`) applies only in `packages/ui/`. Feature modules in `apps/web` stay flat unless complexity grows.
- Do not import across apps directly. Cross-app sharing goes through `packages/` only.
- Do not create new top-level `apps/` or `packages/` directories without team discussion.

# Naming Conventions

- Folders and files: camelCase (`userCard.tsx`, `formatDate.ts`)
- React component names: PascalCase (`UserCard`)
- Exports: named exports by default — no default exports except Next.js page/layout files
- Next.js route files follow framework conventions exactly: `page.tsx`, `layout.tsx`, `route.ts`, `loading.tsx`, `error.tsx`
- Hooks: camelCase prefixed with `use` (`useUserData.ts`)
- Gateways in infrastructure: suffix with `Gateway` (`crmGateway.ts`)
- Constants: SCREAMING_SNAKE_CASE (`MAX_RETRY_COUNT`)

# File Conventions

- One component per file, filename matches the component name
- Co-locate tests next to the file they test (`userCard.test.tsx`)
- Co-locate types with the code that owns them — promote to `packages/types/` only if used by more than one app; promote to a module's own type file if used across modules within the same app
- Module public API is exported from `index.ts` — outside code imports from the module root, not from internal paths
- Import shared packages using their workspace alias (e.g. `@bsava/ui`, `@bsava/types`) — never use relative paths to cross into another app or package

# BFF and DAL Pattern

**BFF (Backend for Frontend)** — lives in `modules/<feature>/server/`:

- Orchestrates data from one or more infrastructure gateways
- Prepares UI-ready data shapes
- Applies caching strategy (cache here, not in infrastructure)
- Never communicates directly with external APIs

**DAL / Gateway** — lives in `infrastructure/<system>/`:

- Handles all external API communication
- Normalises external data to internal types
- Isolates SDKs — nothing outside infrastructure imports an external SDK directly
- No caching, no business logic

# Cache Strategy

- Classify each UI surface: static shell, cached shared content, streamed request-time content, or fully dynamic/personalised
- Apply caching in the module server (BFF) layer, not in infrastructure
- Use Next.js streaming and Suspense boundaries for dynamic sections
- Do not hide cache decisions inside infrastructure gateways

# React & Next.js Best Practices

**Component design:**

- Server Components by default. Only add `'use client'` when the component needs event handlers, browser APIs, or client state (useState, useEffect, useReducer).
- Never fetch data in client components. Data fetching belongs in Server Components or the BFF layer — pass data down as props.
- Keep client components as leaf nodes. Push `'use client'` as far down the tree as possible — wrap only the interactive part, not the whole page.
- Compose with children: pass Server Components as `children` or slot props into client components rather than making the parent a client component.
- Avoid `useEffect` for data that can be computed during render or fetched on the server. `useEffect` is for synchronising with external systems, not for data transformation.
- Use `React.cache()` to deduplicate identical data requests within a single render pass.
- Extract shared layouts into `layout.tsx` — do not duplicate navigation, headers, or wrappers across pages.

**Data fetching & caching:**

- Use `async` Server Components for data fetching — no `useEffect` + `useState` fetch patterns.
- Apply `next/cache` (`unstable_cache` or fetch cache options) in the BFF layer to control revalidation. Tag caches for on-demand revalidation with `revalidateTag()`.
- Use Suspense boundaries to stream slow data without blocking the full page. Wrap each independent data section in its own `<Suspense fallback={...}>`.
- Use `loading.tsx` for route-level loading states. Use inline `<Suspense>` for component-level streaming.
- Prefer `generateStaticParams` for pages with a known set of paths — static generation over dynamic rendering where possible.

**Rendering & performance:**

- Use `next/image` for all images — never use raw `<img>` tags. Set explicit `width` and `height` or use `fill` with a sized container.
- Use `next/font` for fonts — never load fonts from external CDNs or with `<link>` tags.
- Use `next/link` for internal navigation — never use raw `<a>` tags for internal routes.
- Use the Metadata API (`generateMetadata` or static `metadata` export) for SEO — never use raw `<head>` or `<title>` tags.
- Minimise client-side JavaScript: avoid pulling large libraries into client components. If a library is only needed server-side, keep it in a Server Component or the BFF layer.
- Use `dynamic()` imports for heavy client components that are not needed on initial render.

**Error handling & UX:**

- Add `error.tsx` at route segment boundaries to catch rendering errors gracefully.
- Add `not-found.tsx` for custom 404 handling per route segment.
- Use `useFormStatus` and `useActionState` for form submission states — not manual loading booleans.
- Prefer Server Actions for mutations over API route handlers when the form is rendered by a Server Component.

**Accessibility:**

- All interactive elements must be keyboard accessible.
- All images must have meaningful `alt` text (or `alt=""` for decorative images).
- Use semantic HTML elements (`<nav>`, `<main>`, `<article>`, `<button>`) — not `<div onClick>`.
- Form inputs must have associated `<label>` elements.
- Colour contrast must meet WCAG AA minimum (4.5:1 for normal text).

**Vercel platform:**

- Use Edge Runtime only when latency matters and the handler is simple. Default to Node.js runtime.
- Use `vercel.json` rewrites/redirects for URL management — not middleware for simple redirects.
- Use Vercel environment variables for secrets — never hardcode or commit them.
- Be aware of serverless function size limits (50MB compressed). Keep server-side dependencies lean.

# Code Standards

- All new functions must have a corresponding test
- No `any` in TypeScript — use `unknown` and narrow explicitly
- No inline styles — Tailwind classes only
- Validate all external input (API routes, form submissions) with Zod before it touches business logic
- No `console.log` in committed code
- No premature optimisation — solve the actual problem first

# What to Avoid

**Architecture:**

- Creating files or folders outside the defined structure
- Putting business logic in `app/` or `infrastructure/`
- Putting domain-specific logic in `shared/`
- Default exports (except Next.js route files)
- Importing from internal module paths — always import from the module's `index.ts`
- Hiding cache logic inside infrastructure gateways

**React & Next.js anti-patterns:**

- Large client components — if a component needs significant client logic, reconsider the approach
- `'use client'` at the page or layout level — push it down to the smallest interactive leaf
- `useEffect` for fetching data — use async Server Components instead
- `useEffect` to derive or transform data — compute it during render
- Raw `<img>`, `<a>`, `<link rel="stylesheet">` — use `next/image`, `next/link`, `next/font`
- Manual `<head>` / `<title>` tags — use the Metadata API
- Fetching in client components then passing data back up — data flows down from server, interactions flow up from client
- `useState` + `useEffect` to sync with URL params — use `useSearchParams` or `searchParams` prop
- Wrapping Server Components in client components unnecessarily — pass server content as `children` instead
- Using `router.push` for simple navigation — use `<Link>` for static navigation, `router.push` only for programmatic redirects
- `dangerouslySetInnerHTML` without sanitisation
- Inline event handlers that recreate on every render — extract handlers or use `useCallback` only when passed to memoised children
- Ignoring the React compiler / React 19 patterns — avoid manual `useMemo`/`useCallback` unless profiling proves it necessary
