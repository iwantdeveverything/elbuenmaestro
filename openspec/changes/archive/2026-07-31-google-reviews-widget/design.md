# Design Document: Google Reviews Widget

## Technical Approach & Architecture Decisions

1. **Static JSON Snapshot**: Reviews and rating statistics are stored locally in `src/data/googleReviews.json`. This eliminates client-side API latency, external script layout shifts, runtime failure modes, and Google Places API quota costs.
2. **Astro Components**: Isolated static Astro components (`GoogleReviewBadge.astro` and `GoogleReviewsSection.astro`) generate lightweight HTML during site build.
3. **Glassmorphic CSS Tokens**: Modern visual styling featuring frosted glass effects (`backdrop-filter: blur()`), curated HSL theme variables, smooth hover micro-animations, and responsive layout rules for the floating badge.
4. **JSON-LD Schema Injection**: Layout level integration (`Layout.astro`) adding `AggregateRating` and `Review` nodes into the JSON-LD `@graph` object for enhanced local SEO rich snippets.

## Data Flow

```
[ src/data/googleReviews.json ]
              |
              +---> [ GoogleReviewBadge.astro ] ----> [ Layout.astro ] (Global Floating Badge)
              |
              +---> [ GoogleReviewsSection.astro ] -> [ index.astro ]  (Homepage Section)
              |
              +---> [ Layout.astro ] --------------------------------> [ <head> JSON-LD @graph ]
```

## File Changes

| File | Action | Purpose |
| --- | --- | --- |
| `src/data/googleReviews.json` | Create | Stores snapshot rating statistics, Google Maps URL, and review array |
| `src/components/GoogleReviewBadge.astro` | Create | Fixed global floating badge displaying average score, stars, and link |
| `src/components/GoogleReviewsSection.astro` | Create | Homepage section displaying rating overview card and testimonial grid |
| `src/layouts/Layout.astro` | Modify | Embeds `GoogleReviewBadge` globally and injects `AggregateRating` JSON-LD |
| `src/pages/index.astro` | Modify | Imports and renders `GoogleReviewsSection` |

## Interfaces & Types

```typescript
export interface GoogleReview {
  id: string;
  authorName: string;
  authorPhoto: string;
  rating: number;
  relativeTime: string;
  text: string;
}

export interface GoogleReviewsData {
  overallRating: number;
  totalReviews: number;
  googleMapsUrl: string;
  reviews: GoogleReview[];
}
```

## Testing Strategy

1. **Typechecking**: Execute TypeScript verification (`astro check`) to validate data types and component props.
2. **Schema Validation**: Inspect rendered HTML script tags against Schema.org specs for `AggregateRating` and `Review` validity.
3. **Production Build**: Execute `npm run build` to ensure static page generation builds without errors or performance regressions.

## Threat Matrix

- **Threat Matrix**: N/A (No shell, subprocess execution, dynamic endpoints, user inputs, or PR automation tools involved).

## Rollout Strategy

- Direct deployment upon static site build and deployment pipeline execution.
