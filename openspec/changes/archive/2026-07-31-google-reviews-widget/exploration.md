# SDD Exploration: Google Reviews Widget (`google-reviews-widget`)

**Author / Role**: `sdd-explore` Executor  
**Date**: 2026-07-31  
**Target Codebase**: `/home/hstrejoluna/Projects/elbuenmaestro`  
**Artifact Store Mode**: `openspec`  

---

## 1. Executive Summary & Goal

The goal of this change is to integrate a prominent, high-converting, and SEO-boosted **Google Reviews Widget** across the **El Buen Maestro** local masonry microsite in Cancún. 

### Key Objectives
1. **Global Social Proof**: Display a sticky/floating Google badge across all pages (Hubs, Spokes, Legal) that builds immediate trust without obstructing CTAs or navigation.
2. **Dedicated Reviews Section**: Embed a rich testimonial/reviews grid section on key landing pages featuring real customer ratings, verified badges, and direct "Leave a Review" Google Place links.
3. **SEO Rich Snippets**: Inject structured `aggregateRating` and `review` items into the existing `@graph` JSON-LD in [Layout.astro](file:///home/hstrejoluna/Projects/elbuenmaestro/src/layouts/Layout.astro) to enable Google Search star snippets.
4. **Performance & Design Integrity**: Maintain 100/100 Core Web Vitals, zero layout shifts (CLS), and 100% visual alignment with the existing dark glassmorphism design system (`--bg-dark-card`, `--primary` amber `#f59e0b`, `--glass-blur`).

---

## 2. Codebase Context & Existing Architecture

Analysis of the current codebase in `/src/`:

1. **Framework & Adapter**:
   - Astro v5 (`astro: ^7.0.8`) with `@astrojs/vercel` adapter.
   - Built primarily as static SSG with Astro Content Collections (`pages`).
   - View transitions powered by `<ClientRouter />` in `Layout.astro`.

2. **Design System & Styling**:
   - Pure Vanilla CSS defined in `src/layouts/Layout.astro` and `src/styles/global.css`.
   - CSS Variables: Dark palette (`#0b0d10`), Amber Primary (`#f59e0b`), Glass surface tokens (`--glass-bg-card`, `--glass-border`, `--glass-blur`).
   - Component architecture: Astro components (`Layout.astro`, `LeadForm.astro`, `SiloLinks.astro`, `CookieBanner.astro`).

3. **SEO & Structured Data**:
   - `Layout.astro` builds a dynamic `@graph` containing `LocalBusiness`, `WebSite`, `BreadcrumbList`, and `Service` schema objects.
   - Currently missing `aggregateRating` and `review` schema nodes under `LocalBusiness`.

4. **GBP Alignment**:
   - Documented in [GBP-GUIDE.md](file:///home/hstrejoluna/Projects/elbuenmaestro/GBP-GUIDE.md): Business Name `El Buen Maestro - Albañiles en Cancún`, Phone `+529984934110`, Geo `21.1619, -86.8515`.

---

## 3. Analysis of Architectural Options

We evaluated three integration approaches:

### Option A: Static Data Snapshot + Client Floating Badge & Section + Schema.org (RECOMMENDED)
- **Description**: Store verified Google Reviews in a structured dataset (`src/data/googleReviews.json`). Render static Astro components (`GoogleReviewBadge.astro` & `GoogleReviewsSection.astro`) with Vanilla CSS glassmorphism, and inject `aggregateRating` & `review` schema into `Layout.astro` at build time.
- **Pros**:
  - 🚀 **100/100 CWV Performance**: Zero runtime external HTTP requests, zero JS bundle bloat, zero CLS.
  - 🔍 **SEO Star Snippets**: Googlebot indexes review text and `aggregateRating` directly in server HTML.
  - 🛡️ **Zero API Costs / Quotas**: No reliance on Google Places API keys or billing.
  - 🎨 **Design System Harmony**: Perfect match with existing glassmorphism CSS tokens.
  - 📱 **Client Router Friendly**: Works seamlessly with Astro `<ClientRouter />`.
- **Cons**:
  - Requires periodic manual updates or build trigger to add new reviews.

### Option B: Dynamic Serverless API Route (Google Places API Fetch)
- **Description**: Build an Astro API route (`src/pages/api/reviews.ts` with `export const prerender = false;`) fetching live reviews from Google Places API (New) with Vercel edge/KV caching.
- **Pros**:
  - Automatically syncs latest reviews without manual dataset edits.
- **Cons**:
  - ⚠️ Google Places API returns max 5 reviews per request.
  - 💰 Requires paid Google Cloud API key (`GOOGLE_MAPS_API_KEY`) and Vercel serverless functions.
  - 🐢 Potential latency/cold starts on API cache miss.
  - 🔄 Client-side hydration required for fetching dynamic reviews, risking CLS or extra JS overhead.

### Option C: Third-Party Embed Script (e.g. Elfsight / Trustindex iframe)
- **Description**: Drop a 3rd-party script widget tag into `Layout.astro`.
- **Pros**:
  - Zero code development for review carousel UI.
- **Cons**:
  - ❌ **Third-Party Bloat**: Heavy JS script tags negatively impact LCP and INP metrics.
  - ❌ **SEO Ineffective**: Rich snippets in JSON-LD are not parsed from external client-side iframes.
  - ❌ **Subscription Fees & Branding**: Watermarks unless paid monthly ($6-$15/mo).
  - ❌ **Visual Discordance**: Off-brand UI styles that clash with the site's dark glass design system.

---

## 4. Comparative Architectural Matrix

| Metric / Criteria | Option A (Static + Schema) | Option B (Places API) | Option C (3rd-Party Script) |
|---|---|---|---|
| **Core Web Vitals Impact** | 🟩 Excellent (0ms overhead) | 🟨 Moderate (API latency) | 🟥 Poor (Heavy script bloat) |
| **SEO Rich Snippet (Stars)** | 🟩 Direct in JSON-LD `@graph` | 🟨 Dynamic injection | 🟥 None / Unreliable |
| **Visual / Design Cohesion** | 🟩 100% Glassmorphism matching | 🟩 Customizable UI | 🟥 Clashes with theme |
| **Cost & API Quotas** | 🟩 $0 / Unlimited | 🟥 $17/1k Place Details calls | 🟥 Monthly SaaS fee |
| **Maintenance Effort** | 🟨 Periodic static update | 🟩 Fully automated | 🟩 Fully automated |
| **Mobile & UX Fit** | 🟩 Native floating badge | 🟩 Custom floating badge | 🟨 Generic overlay widget |

---

## 5. Proposed Design & Implementation Plan (Option A)

### 5.1 Data Structure (`src/data/googleReviews.json`)
```json
{
  "placeId": "ChIJ...",
  "googleMapsUrl": "https://maps.google.com/?cid=...",
  "writeReviewUrl": "https://g.page/r/.../review",
  "rating": 5.0,
  "userRatingsTotal": 24,
  "reviews": [
    {
      "id": "rev-1",
      "authorName": "Carlos Mendoza",
      "authorPhoto": "/assets/reviews/carlos.jpg",
      "rating": 5,
      "relativeTimeDescription": "Hace 2 semanas",
      "datePublished": "2026-07-15",
      "text": "Excelente servicio de albañilería en Cumbres Cancún. Construyeron una barda perimetral de 18 metros con colado de castillos e impermeabilización anti-salitre. Entrega puntual y muy limpios al trabajar.",
      "service": "Construcción de Bardas",
      "location": "Cumbres Cancún"
    }
  ]
}
```

### 5.2 Component Architecture
1. **`src/components/GoogleReviewBadge.astro`**:
   - Sticky floating badge at the bottom-left of the viewport (`position: fixed; bottom: 1.5rem; left: 1.5rem; z-index: 90;`).
   - Displays Google logo icon, 5-star graphic, "5.0 rating", total count, and verified checkmark.
   - Click opens modal or scrolls to `#resenas` section.
2. **`src/components/GoogleReviewsSection.astro`**:
   - Full grid section displaying top client reviews, rating breakdown card, and CTA button "Dejar opinión en Google".
3. **`src/layouts/Layout.astro` Integration**:
   - Add `<GoogleReviewBadge />` globally before `</footer>`.
   - Update `schemaGraph` in `Layout.astro` to include `aggregateRating` and `review` array inside the `LocalBusiness` node.

### 5.3 Schema.org JSON-LD Enhancement in `Layout.astro`
```json
{
  "@type": "LocalBusiness",
  "@id": "https://elbuenmaestro.vercel.app/#business",
  "name": "El Buen Maestro",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "5.0",
    "reviewCount": "24",
    "bestRating": "5",
    "worstRating": "1"
  },
  "review": [
    {
      "@type": "Review",
      "author": { "@type": "Person", "name": "Carlos Mendoza" },
      "datePublished": "2026-07-15",
      "reviewRating": { "@type": "Rating", "ratingValue": "5" },
      "reviewBody": "Excelente servicio de albañilería en Cumbres Cancún..."
    }
  ]
}
```

---

## 6. Risks & Mitigation Strategies

1. **Risk**: Floating badge overlapping with WhatsApp/Phone floating buttons or mobile cookies banner.
   - **Mitigation**: Place `GoogleReviewBadge` on bottom-left, keeping bottom-right reserved for primary action/call elements. Ensure high-contrast spacing and mobile media query rules (`@media (max-width: 768px)`).
2. **Risk**: Stale review count over time.
   - **Mitigation**: Document simple updating steps in `GBP-GUIDE.md` or provide a lightweight Node.js sync script (`scripts/fetch-reviews.js`) for optional automated updates.
3. **Risk**: Google Rich Snippet review policy compliance.
   - **Mitigation**: Ensure Schema.org `author`, `datePublished`, `reviewRating`, and `reviewBody` strictly match visible HTML text rendered on the page to pass Google Rich Result tests.

---

## 7. Recommendation & Next Steps

Option A is the clear architectural winner for **El Buen Maestro**. It preserves lightning-fast performance, complies with strict Google Rich Snippet guidelines, matches the site's dark glass design system, and introduces zero external API costs.

### Next Recommended Phases in SDD:
- **`sdd-propose`**: Create change proposal `google-reviews-widget`.
- **`sdd-spec` / `sdd-design`**: Define specs and UI component contracts.
- **`sdd-tasks`**: Break down implementation tasks.
