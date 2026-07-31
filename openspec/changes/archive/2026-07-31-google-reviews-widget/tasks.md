# Tasks: Google Reviews Widget

## Review Workload Forecast
- Decision needed before apply: No
- Chained PRs recommended: No
- Chain strategy: stacked-to-main
- 400-line budget risk: Low (Estimated lines ~150-200 lines total)

---

## Phase 1: Data & Component Infrastructure
- [x] 1.1 Create `src/data/googleReviews.json` with snapshot review data including aggregate rating (4.9), total review count (128), Google Maps URL, and curated review items (`id`, `authorName`, `authorPhoto`, `rating`, `relativeTime`, `text`).

## Phase 2: UI Component Implementation
- [x] 2.1 Create `src/components/GoogleReviewBadge.astro` for the floating bottom badge displaying average score, stars, total reviews count, Google logo, and link to Google Maps.
- [x] 2.2 Create `src/components/GoogleReviewsSection.astro` for the homepage rendering overall rating statistics card and testimonial grid.

## Phase 3: Layout & Page Integration
- [x] 3.1 Modify `src/layouts/Layout.astro` to include `GoogleReviewBadge` globally and update the JSON-LD `@graph` schema with `AggregateRating` and `Review` nodes.
- [x] 3.2 Modify `src/pages/index.astro` to import and render `GoogleReviewsSection`.

## Phase 4: Verification & Polish
- [x] 4.1 Run `astro check` / `pnpm typecheck` and `pnpm build` to verify clean static site build with zero TypeScript or syntax errors.
