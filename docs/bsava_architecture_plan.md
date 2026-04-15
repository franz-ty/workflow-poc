# BSAVA Digital Platform -- Architecture & Implementation Plan

## 1. Core Principles

-   Server-first architecture (Next.js App Router)
-   Minimal client components (client islands only where needed)
-   Lean, maintainable, and organized code
-   DRY (Do Not Repeat Yourself)
-   Strong boundaries (modules, infrastructure, shared)
-   Co-location of related code
-   Continuous validation:
    -   Unit tests
    -   Type checking
    -   Linting
    -   Build verification (dev + production)

------------------------------------------------------------------------

## 2. High-Level Architecture

### Layers

-   app/ → Routing, layouts, metadata, page entrypoints
-   modules/ → Feature/domain ownership (UI + server logic)
-   infrastructure/ → External systems and integrations
-   shared/ → Reusable UI, utilities, and types

------------------------------------------------------------------------

## 3. Folder Structure

    src/
      app/
        (public)/
        (member)/
        api/
        layout.tsx
        not-found.tsx
        global-error.tsx
        sitemap.ts
        robots.ts

      modules/
        library/
          components/
          server/
          library.model.ts
          index.ts

        events/
        cpd/
        commerce/
        account/
        navigation/

      infrastructure/
        cms/
        crm/
        commerce/
        auth/
        cache/

      shared/
        ui/
        layout/
        utils/
        types/

------------------------------------------------------------------------

## 4. Naming Conventions

-   camelCase for folders and files
-   PascalCase for React component names
-   Named exports by default
-   Next.js route files follow framework conventions:
    -   page.tsx
    -   layout.tsx
    -   route.ts

------------------------------------------------------------------------

## 5. BFF and DAL Approach

### BFF (Backend for Frontend)

-   Lives in: modules/`<feature>`{=html}/server/
-   Responsibilities:
    -   Data orchestration
    -   Combining sources
    -   Preparing UI-ready data
    -   Applying caching strategy

### DAL (Data Access Layer)

-   Lives in: infrastructure/`<system>`{=html}/
-   Implemented as "gateways"
-   Responsibilities:
    -   External API communication
    -   Data normalization
    -   SDK isolation

------------------------------------------------------------------------

## 6. UI Strategy

### Approach

-   Server components by default
-   Client components only when necessary
-   Co-located styles and types

### Atomic Design (Selective)

Used mainly in shared/ui:

-   atoms/
-   molecules/
-   organisms/

Feature modules remain simple unless complexity grows.

------------------------------------------------------------------------

## 7. Cache Strategy (Next.js Cache Components)

Each UI surface classified as:

-   Static shell
-   Cached shared content
-   Streamed request-time content
-   Fully dynamic/personalized content

Rules:

-   Cache at module server layer
-   Avoid hiding cache inside infrastructure
-   Use streaming and Suspense boundaries for dynamic sections

------------------------------------------------------------------------

## 8. SEO Strategy

-   Use Next.js Metadata API
-   Use generateMetadata per route
-   Keep metadata close to modules
-   Support:
    -   Canonical URLs
    -   Open Graph
    -   Structured data
    -   sitemap.ts
    -   robots.ts

------------------------------------------------------------------------

## 9. Performance Strategy

-   Server-first rendering
-   Minimal client JS
-   Streaming for dynamic content
-   Cached shared sections
-   Small client islands

------------------------------------------------------------------------

## 10. Engineering Guardrails

### Required in every cycle

-   Unit tests
-   Linting
-   Type checking
-   Build verification

### CI expectations

-   Build must pass
-   Tests must pass
-   No type errors
-   No lint violations

------------------------------------------------------------------------

## 11. Linear Project Structure

### Initiative

BSAVA Digital Platform

### Projects

-   Architecture & Foundations
-   Platform & DevOps
-   Frontend Application (Next.js)
-   CMS & Content
-   Commerce & Payments
-   Events & CPD
-   Member Account & Auth
-   Integrations
-   SEO & Performance
-   QA & Testing
-   Go Live & Migration

------------------------------------------------------------------------

## 12. Initial Epics (Architecture & Foundations)

-   Define architecture standards
-   Bootstrap Next.js project
-   Establish folder structure
-   Implement cache strategy
-   Define SEO patterns
-   Setup testing and CI

------------------------------------------------------------------------

## 13. Key Decisions

-   Module-first architecture
-   No explicit BFF/DAL folders
-   Use gateways for integrations
-   Lean structure first, expand later
-   Atomic design only where valuable
-   Cache strategy defined early
-   Strong engineering discipline enforced

------------------------------------------------------------------------

## 14. What to Avoid

-   Over-engineering early
-   Deep folder nesting without need
-   Excess abstraction layers
-   Large client-side bundles
-   Premature optimization

------------------------------------------------------------------------

## 15. Next Steps

1.  Create Linear initiative and projects
2.  Define architecture epics
3.  Bootstrap Next.js repository
4.  Implement reference module (library)
5.  Establish CI/CD and validation pipelines

------------------------------------------------------------------------

End of Document
