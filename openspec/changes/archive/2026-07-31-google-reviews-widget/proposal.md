# Proposal: Google Reviews Widget

## Intent
Integrate Google Reviews social proof into El Buen Maestro's website via a floating review badge, a dedicated homepage reviews section, and structured Schema.org JSON-LD data to boost local SEO authority and conversion rates.

## Scope

### In Scope
- Static snapshot data file (`src/data/googleReviews.json`) storing rating statistics and curated review entries.
- Global floating Google Review badge component (`src/components/GoogleReviewBadge.astro`) displaying average rating and direct Google review link across pages.
- Dedicated Google Reviews section component (`src/components/GoogleReviewsSection.astro`) on the homepage.
- Rich snippet integration via JSON-LD (`AggregateRating` & `Review`) inside `src/layouts/Layout.astro`.

### Out of Scope
- Dynamic Google Places API runtime fetching or API key setup.
- User-submitted reviews or interactive dynamic filtering.

## Capabilities

### New Capabilities
- `google-reviews-widget`: Renders validated Google Business review ratings, customer testimonials, floating badge anchor, and rich snippet schemas.

## Approach
Option A: Static snapshot implementation. Store snapshot review data in `src/data/googleReviews.json`. Render the global floating badge in `Layout.astro` and the detailed section on `index.astro` using clean, semantic Astro components with zero client-side external API latency.

## Affected Areas
- `src/data/googleReviews.json` (New)
- `src/components/GoogleReviewBadge.astro` (New)
- `src/components/GoogleReviewsSection.astro` (New)
- `src/layouts/Layout.astro` (Modified - includes badge & JSON-LD schema)
- `src/pages/index.astro` (Modified - includes section)

## Risks
- Static metrics require manual updates if snapshot falls behind live Google Business profile data.
  *Mitigation*: Simple, well-formatted JSON structure for quick future updates.

## Rollback Plan
Revert modifications in `src/layouts/Layout.astro` and `src/pages/index.astro`, and remove new files under `src/data/` and `src/components/`.

## Success Criteria
- Global floating badge renders properly across all pages.
- Homepage displays formatted reviews section with star ratings and feedback.
- Valid JSON-LD `AggregateRating` and `Review` schemas detected without errors.
- Build completes cleanly with zero impact on page load speed.
