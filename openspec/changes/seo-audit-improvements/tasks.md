# Tasks: seo-audit-improvements

## Phase 1 — Technical SEO Foundation
- [x] Create `public/robots.txt`
- [x] Create `public/sitemap.xml` (49 URLs)
- [x] Create `public/llms.txt`

## Phase 2 — Schema & Layout
- [x] Fix phone: `+529984934110` → `+529984934110`
- [x] Fix title home ≤60 chars
- [x] Upgrade schema to `@graph` (LocalBusiness, WebSite, BreadcrumbList, Service)
- [x] Nav: add all 4 hub links + mobile hamburger
- [x] Footer: add all 4 hub links
- [x] Fix footer NAP: real phone number
- [x] Add `og:image` meta tag
- [x] Add breadcrumbs visual (hub/spoke)

## Phase 3 — Content Quality (44 Spokes)
- [x] Rewrite all 44 spoke .md files (400-600 words, local data injection)

## Phase 4 — E-E-A-T & Social
- [x] Generate OG social card image
- [x] Add trust signals section to Layout.astro

## Verification
- [x] `pnpm build` — 49 páginas sin errores
- [x] `pnpm test` — 12/12 passing
- [x] schema validation
- [x] robots + sitemap check post-deploy
