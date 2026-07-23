## Exploration: seo-critical-fixes

### Current State
- **Security Headers**: The site currently lacks critical HTTP security headers (CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy). The `astro.config.mjs` configures `@astrojs/vercel` in `static` build mode, which outputs pre-rendered HTML files. There is no `vercel.json` file in the root to handle server/CDN headers.
- **Entity SEO**: The `Layout.astro` layout specifies a JSON-LD schema graph representing a `LocalBusiness` entity but lacks `sameAs` links linking to Wikipedia, Wikidata, LinkedIn, or Twitter/X. This hurts entity verification and knowledge graph association.
- **Silo Linking & Internal Links**:
  - The current `siloLinking.ts` utility uses `.find()` for `sameLocDiffService`, which returns only the *first* service found in the same location. This creates an asymmetric link structure where early-processed services accumulate all incoming lateral links and other service pages receive zero lateral links.
  - The same-service location neighbor link is uni-directional (only linking to the next circular neighbor).
  - The crawler only crawled 7 pages because the footer links to the legal pages contain `rel="nofollow"`, preventing search engine crawlers from passing link equity.
- **Home Page Content**: The homepage content in `src/content/pages/index.md` has only 192 words (flagged as thin content) and has a very low Flesch readability score of 4.6 (very difficult), using complex structural vocabulary.

### Affected Areas
- `/vercel.json` (New File) — Set static security headers (CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy) at the Vercel routing layer.
- `/src/layouts/Layout.astro` —
  - Add `sameAs` array mapping to Wikidata (Cancún), Wikipedia (Cancún), LinkedIn, and Twitter/X inside the `LocalBusiness` JSON-LD schema block.
  - Remove `rel="nofollow"` from the privacy policy and cookie policy links in the footer.
- `/src/utils/siloLinking.ts` —
  - Rewrite `sameLocDiffService` to filter and return all other services in the same location, making the lateral links symmetrical.
  - Rewrite neighboring location linking to include both the next and previous circular neighbors in the same service category.
- `/src/content/pages/index.md` — Expand copy to 450+ words with a Cancun-specific context section, step-by-step process explanation, and FAQ. Structure with short sentences (<=20 words) and short paragraphs (2-4 sentences).

### Approaches

#### 1. Security Headers
- **Approach 1: `vercel.json` Header Rules (Recommended)**
  - Pros:
    - Applied at the CDN level by Vercel's routing infrastructure.
    - Protects all pages and static assets without running JS server execution.
    - Standard pattern for static/adapter-based deploys.
  - Cons:
    - Separated from the Astro build pipeline configuration.
- **Approach 2: Astro Middleware Headers Injection**
  - Pros:
    - Configured in JavaScript/TypeScript inside Astro.
  - Cons:
    - Middleware does not execute for static pages when `output: 'static'` is configured, leaving the pre-rendered pages unprotected.
  - **Decision**: Approach 1.

#### 2. Silo & Internal Linking
- **Approach 1: Symmetrical Lateral Cross-Linking & Bi-directional Neighbor Cycles (Recommended)**
  - Change `sameLocDiffService` to filter all other services in the same location and add them as lateral links.
  - Link to both next and previous alphabetical neighbors in the same service category.
  - Pros:
    - Unlocks a fully connected local graph. No page is left with <= 1 inbound link (minimum 5 lateral inbound links + 1 parent Hub link).
    - Perfect balance: every service page in Bonfil links to the other 3 services in Bonfil, reinforcing local relevance.
  - Cons:
    - Adds slightly more links per page (from ~4 to ~7), which is well below any search engine link limits.
- **Approach 2: Global Footer Directory**
  - Pros:
    - Flat directory link distribution.
  - Cons:
    - Bloats the footer on all pages with 44 links, weakening page category boundaries.
  - **Decision**: Approach 1.

#### 3. Home Page Content Readability & Length
- **Approach 1: Structured Content Expansion (Recommended)**
  - Expand word count to 450+ words.
  - Introduce:
    - Cancun-specific climate and masonry challenges (salitre, wind load requirements).
    - Step-by-step service execution process (quote, preparation, inspection).
    - Non-schema FAQ block answering standard homeowner questions.
  - Pros:
    - Solves both readability and word count warnings.
    - Lowers vocabulary complexity.
  - Cons:
    - Requires carefully written copy.
  - **Decision**: Approach 1.

### Recommendation
We recommend moving forward with **Approach 1** across all four target areas. It aligns with Vercel deployment best practices, builds a highly balanced and symmetrical local SEO silo structure, boosts Entity SEO visibility, and improves copy accessibility on the home page.

### Risks
- **Content Security Policy (CSP) Restrictions**: An overly strict CSP value can block Google Fonts, GTM, or local inline scripts like the cookie consent banner.
  - *Mitigation*: The CSP policy must explicitly whitelist `https://fonts.googleapis.com`, `https://fonts.gstatic.com`, `https://www.googletagmanager.com`, and allow `'unsafe-inline'` for Astro-generated styles and critical inline consent scripts.
- **Unit Test Breakages**: Modifying the shape and quantity of lateral links will cause the `siloLinking.test.ts` suite to fail due to hardcoded length and URL checks.
  - *Mitigation*: The implementation proposal must include updating the `siloLinking.test.ts` file to reflect the new symmetrical/bi-directional expectations.

### Ready for Proposal
Yes
