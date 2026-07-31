# Specification: Google Reviews Widget

## Capability: google-reviews-widget

### 1. Static Data Structure Requirement
The application MUST store Google Reviews snapshot data in `src/data/googleReviews.json`.
- The JSON file MUST contain `overallRating` (number), `totalReviews` (number), `googleMapsUrl` (string), and `reviews` (array).
- Each entry in `reviews` MUST include `id`, `authorName`, `authorPhoto`, `rating`, `relativeTime`, and `text`.

### 2. Floating Review Badge Requirement
The application MUST provide a global floating review badge component (`src/components/GoogleReviewBadge.astro`).
- The component MUST display the average rating score, star icons, total review count, and official Google logo.
- The component MUST remain fixed or sticky at the bottom viewport across mobile and desktop screen sizes.
- The component MUST link directly to the target Google Maps business listing.

### 3. Homepage Reviews Section Requirement
The application MUST provide a dedicated reviews section component (`src/components/GoogleReviewsSection.astro`).
- The component MUST display overall rating statistics and a structured layout of review cards.
- Each review card MUST render the reviewer photo, author name, star rating, comment text, and relative date.

### 4. Structured Data / SEO Requirement
The application MUST inject Schema.org structured data in `src/layouts/Layout.astro`.
- The layout MUST embed `AggregateRating` and `Review` nodes into the `@graph` JSON-LD schema.
- The `AggregateRating` node MUST specify `ratingValue` and `reviewCount`.

---

## Scenarios

### Scenario 1: Floating badge visibility on mobile and desktop viewports
**Given** a user views any page on the website  
**When** the page renders on a mobile or desktop viewport  
**Then** the floating Google Review badge MUST remain visible fixed at the bottom viewport  
**And** the badge MUST display the overall rating score, star icons, and total review count cleanly.

### Scenario 2: Clicking badge opens Google Maps review link in a new tab
**Given** the floating Google Review badge is rendered on screen  
**When** a user clicks on the badge anchor link  
**Then** the browser MUST open the business Google Maps review URL in a new tab using `target="_blank"` and `rel="noopener noreferrer"`.

### Scenario 3: Reviews section renders rating breakdown and card grid correctly
**Given** a user visits the homepage  
**When** the user scrolls to the Google Reviews section  
**Then** the component MUST display overall rating metrics alongside customer review cards  
**And** each card MUST render the reviewer photo, author name, star rating, text body, and relative date populated from `src/data/googleReviews.json`.

### Scenario 4: JSON-LD @graph outputs valid schema containing AggregateRating
**Given** an HTML validator or search engine crawler inspects the page head  
**When** parsing the JSON-LD script tag in `src/layouts/Layout.astro`  
**Then** the `@graph` array MUST contain `AggregateRating` with valid `ratingValue` and `reviewCount`  
**And** it MUST contain nested or linked `Review` nodes matching snapshot reviews.
