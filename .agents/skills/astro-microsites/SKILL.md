---
name: astro-microsites
description: "Trigger: crear micrositio, levantar micrositio, nuevo micrositio, astro microsite, local seo site. Architect and build ultra-optimized local SEO microsites using Astro v5, Hub & Spoke SILO architecture, zero-orphan linking, structured entity schemas, E-E-A-T copywriting guidelines, Vercel edge deployment, real-world deep web research, Google Business Profile (GBP) alignment guide, frontend design & UX standards, and Gentle-AI SDD Workflow."
---

# Astro Local SEO Microsites Architecture & Bootstrap Guide

This skill encapsulates the battle-tested architecture, patterns, and best practices derived from **El Buen Maestro**, our **SEO Skill Engine**, and **Gentleman Frontend Skills** for building high-ranking, fast, zero-orphan local SEO microsites under the **Gentle-AI SDD (Spec-Driven Development)** workflow.

## SDD Workflow Protocol (Spec-Driven Development)

All microsite creation, refactoring, and feature additions MUST follow the structured **SDD Workflow**:

1. **SDD Init (`/sdd-init`)**: Bootstrap SDD context and select artifact store (`engram` persistent memory or `openspec` local files).
2. **Explore & Deep Research (`/sdd-explore`)**: Perform real-world web research (using `search_web` or the `research` subagent with `pro` model) to extract real, up-to-date local market data before writing code.
3. **Planning Cycle (`/sdd-new` / `/sdd-ff`)**: Produce explicit Spec, Design, and Task artifacts detailing Hubs, Spokes, Schema, UX/UI Components, and Link structures.
4. **Implementation Batching (`/sdd-apply`)**: Execute task batches isolated inside dynamic subagent boundaries.
5. **Validation (`/sdd-verify`)**: Validate implementation against specs, ensuring 100% test coverage for Silo links, zero orphan pages, accessibility, and visual UX standards.
6. **Archival & Final Deliverables (`/sdd-archive`)**: Close change, persist final state, and generate the mandatory **Google Business Profile Alignment Guide (`GBP-GUIDE.md`)**.

---

## Real-World Grounding & Deep Web Research Protocol

To guarantee maximum E-E-A-T and real-world accuracy, NEVER invent fake local data. During the SDD Explore and Spec phases, use **Deep Web Research** (via `search_web` or invoking the `research` subagent with `pro` model) to retrieve verified real-time data:

- **Verified Local Entities**: Query exact neighborhood names, major avenues, transit hubs, and authentic local landmarks (`landmarks`, `neighborhoodContext`).
- **Geo-Coordinates & Contact Signals**: Fetch accurate latitude/longitude, postal codes, and regional phone area codes for `LocalBusiness` JSON-LD schemas.
- **Knowledge Graph Entity Identification**: Search Wikidata and Wikipedia for official entity URLs to inject into schema `sameAs` arrays.
- **Real Market Pricing**: Retrieve up-to-date regional pricing averages and industry benchmarks for transparent pricing copy (`priceRange`).
- **AEO / GEO Intent Signals**: Research live user queries on Search Overviews, Perplexity, and ChatGPT to craft authoritative opening answers.

---

## Frontend Design System, UI Aesthetics & UX Standards

Microsites built with this skill MUST provide a premium, modern visual experience that wows users instantly (drawing from `modern-web-guidance` and `cognitive-doc-design`):

1. **Aesthetic Excellence & Color Palette**:
   - Curated HSL/RGB color system with dark mode / glassmorphism accents (`backdrop-filter`). Avoid generic browser primary colors.
   - Modern typography from Google Fonts (e.g., `Inter`, `Outfit`, or `Roboto`) with fluid typography math (`clamp()`).
   - Smooth gradients, subtle micro-animations (`transition: ease 0.2s`), container queries, `:has()` relational selectors, and dynamic hover states for interactive elements.
2. **Conversion-Oriented UX Components**:
   - **Hero Section**: High-impact H1 title, immediate local value proposition, and prominent CTA button.
   - **Lead Form (`LeadForm.astro`)**: Multi-step or streamlined quote request form with client-side validation (`:user-valid`), accessible touch targets (min 44px), and clear feedback states.
   - **Trust Badges & Social Proof**: Star ratings, completed job counts, local client testimonials, and verified badge icons.
   - **Cookie & Privacy Banner (`CookieBanner.astro`)**: Non-intrusive, accessible compliance banner.
3. **Responsive & Mobile-First UX**:
   - Zero horizontal overflow, dynamic mobile navigation, click-to-call / click-to-WhatsApp floating action buttons.
   - Optimized Core Web Vitals (LCP < 2.5s, INP < 200ms, CLS < 0.1).

---

## Google Business Profile (GBP) Alignment Deliverable (`GBP-GUIDE.md`)

Upon completing the microsite build, the agent MUST generate a dedicated `GBP-GUIDE.md` artifact in the project root to ensure 100% NAP (Name, Address, Phone) and category alignment between the website and Google Business Profile:

### Mandatory Structure of `GBP-GUIDE.md`:
1. **Primary & Secondary GBP Categories**:
   - Primary category matching the main Hub service (e.g., `Masonry Contractor` / `Albañil`).
   - Secondary categories matching secondary Hubs/services (e.g., `Building Restorer`, `Waterproofing Contractor`).
2. **Service Area & Geographic Coverage**:
   - List of exact municipalities, postal codes, and neighborhoods derived from Spoke pages for GBP Service Area setup.
3. **Business Description (E-E-A-T Copy)**:
   - High-converting 750-character business description integrating core local keywords, service guarantees, and local landmarks.
4. **Services & Items List**:
   - Structured list of services to populate in GBP dashboard, complete with tailored descriptions aligned with Hub/Spoke content.
5. **Website & Schema Data Consistency (NAP)**:
   - Explicit verification checklist matching GBP website URL, phone format, coordinates, and `sameAs` social links with the website's `LocalBusiness` JSON-LD schema.

---

## Interconnected Skills Integration (Mandatory Workflows)

When executing this skill, the agent MUST activate and compose the following specialized skills at specific phases of the microsite lifecycle:

1. **`iwantdeveverything-repo-bootstrap`**:
   - *Phase*: Repository initialization (during SDD Apply phase).
   - *Action*: Apply GitHub organization standards, Trunk-based branching, branch protection rules, issue templates, and Vercel deployment linking.

2. **`seo` (SEO Engine Skill)**:
   - *Phase*: SDD Spec/Design & Post-build Verification.
   - *Action*: Execute `seo content`, `seo schema`, `seo technical`, and `seo sitemap` commands to generate `FULL-AUDIT-REPORT.md` and `ACTION-PLAN.md`.

3. **`modern-web-guidance`** (Frontend Design, CSS & UX):
   - *Phase*: Component and UI layout development.
   - *Action*: Enforce modern HTML5 semantics, zero-dependency vanilla CSS design systems, dynamic micro-animations, glassmorphism, responsive container queries, `:has()`, `:user-valid` form states, View Transitions, and clean layout patterns.

4. **`cognitive-doc-design`**:
   - *Phase*: Content layout & readable documentation structure.
   - *Action*: Optimize document visual hierarchy, scannability, typography spacing, and cognitive clarity.

5. **`a11y-debugging`**:
   - *Phase*: Accessibility testing in SDD Verify.
   - *Action*: Audit focus states, ARIA attributes, semantic landmarks, color contrast, and keyboard navigation.

6. **`debug-optimize-lcp`**:
   - *Phase*: Core Web Vitals performance optimization in SDD Verify.
   - *Action*: Optimize hero images, font loading, critical CSS, and LCP/INP render timing.

---

## Core Pillars & Architectural Standards

### 1. Modern Stack & Tooling
- **Framework**: Astro v5+ (`astro`, `@astrojs/vercel`).
- **Mode**: Static site generation (prerendered) with Vercel adapter for edge optimization and dynamic endpoints if needed.
- **Language**: TypeScript (`astro check` strict typing).
- **Unit Testing**: Native Node.js test runner (`node --experimental-strip-types --test`) for fast, zero-dependency validation.

### 2. Copywriting & SEO Page Content Guidelines (E-E-A-T, GEO & Readability)
Page copy MUST adhere to strict local SEO & AI search readiness standards (leveraging the `seo` skill and Deep Research):
- **Readability**: Short sentences (15–20 words max), short paragraphs (2–4 sentences), clear H2/H3 hierarchy.
- **E-E-A-T Signals**: Demonstrate real local experience using research-backed `neighborhoodContext` and `landmarks`.
- **GEO / AEO (AI Search Readiness)**: State direct, authoritative answers to core user queries in the opening 2 paragraphs so LLMs and Answer Engines (Perplexity, ChatGPT, Search Overviews) extract them cleanly.
- **Title Tags & Meta Descriptions**: Titles under 60 characters with high-intent keywords + location; Meta descriptions between 120–155 characters with explicit call to action.
- **Unique Content**: Avoid copy-pasting text between Spoke pages. Ensure each location page features location-unique landmarks and customized service nuances.

### 3. SILO Architecture (Hub & Spoke Pattern)
Organize content hierarchically into 3 distinct page types:
- **Hub Pages** (`type: 'hub'`): Core service/category landing pages (e.g., `/albaniles-cancun`).
- **Spoke Pages** (`type: 'spoke'`): Geo-targeted or sub-service location pages (e.g., `/albaniles-en-playa-mujeres`).
- **Legal Pages** (`type: 'legal'`): Standard compliance pages (`/privacidad`, `/terminos`).

### 4. Deterministic Silo Linking (Zero Orphan Guarantee)
Every page MUST participate in a strict internal linking hierarchy to prevent orphan pages:
- **Home**: Links to all category Hubs.
- **Hub**: Links down to all its child Spokes.
- **Spoke**: Links upward to parent Hub, Home, and 2 lateral Spokes (same location different service, or circular neighbor for same service).
- **Automated Verification**: Include unit tests (`siloLinking.test.ts`) that verify 100% link connectivity across all generated pages.

### 5. Astro v5 Content Loader (`content.config.ts`)
Use Astro 5 `glob` loader in `src/content.config.ts`:
```typescript
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const pages = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    h1: z.string(),
    type: z.enum(['hub', 'spoke', 'legal']),
    service: z.string(),
    locationName: z.string().optional(),
    locationSlug: z.string().optional(),
    parentHub: z.string().optional(),
    landmarks: z.array(z.string()).optional(),
    neighborhoodContext: z.string().optional(),
  })
});

export const collections = { pages };
```

### 6. Schema.org & Knowledge Graph Entity Alignment (JSON-LD)
Every layout MUST render valid JSON-LD schemas with real researched data:
- `LocalBusiness` / `ProfessionalService` schema with researched GeoCoordinates, address, telephone, priceRange.
- `sameAs` entity signals linking to Wikipedia, Wikidata, LinkedIn, X, and social profiles.
- `BreadcrumbList` schema reflecting the SILO hierarchy (Home > Hub > Spoke).

### 7. Security Headers & Vercel Edge Setup
Ensure `vercel.json` or server headers enforce essential security headers:
- `Content-Security-Policy`
- `Strict-Transport-Security` (HSTS)
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`

---

## Execution Workflow to Bootstrap a New Microsite

When requested to build or bootstrap a new microsite, follow these SDD steps:

1. **Initialize Project & SDD**:
   - Run `/sdd-init`
   - Execute **Deep Web Research** to collect real-world local data.
   - Run `pnpm create astro@latest ./ --template minimal --no-install --typescript strict` (via `iwantdeveverything-repo-bootstrap`).
   - `pnpm add astro @astrojs/vercel`
   - `pnpm add -D @astrojs/check @types/node typescript`

2. **Setup Content Schema & Directory**:
   - Create `src/content.config.ts` using the Zod schema above.
   - Write Markdown/MDX pages in `src/content/pages/` applying research-backed data and **Copywriting & SEO Page Content Guidelines**.

3. **Install Silo Utility**:
   - Place `siloLinking.ts` and `getPageUrl.ts` in `src/utils/`.
   - Add native test runner script to `package.json`: `"test": "node --experimental-strip-types --test src/utils/*.test.ts"`.

4. **Implement Dynamic Routing**:
   - Create `src/pages/[...slug].astro` to automatically catch and render Hub, Spoke, and Legal pages from `getCollection('pages')`.

5. **Build Components** (guided by `modern-web-guidance` & `cognitive-doc-design`):
   - `Layout.astro`: Metadata, canonical URL, JSON-LD schema injection, CSS reset/theme.
   - `SiloLinks.astro`: Semantic internal linking footer block.
   - `LeadForm.astro`: High-converting lead form with validation and clear call to action.
   - `CookieBanner.astro`: Lightweight privacy compliance banner.

6. **Validate & Audit** (SDD Verify phase via `seo`, `a11y-debugging`, and `debug-optimize-lcp`):
   - Run `pnpm typecheck` (`astro check`).
   - Run `pnpm test` (unit tests for URL and Silo linking).
   - Run build check (`pnpm build`).
   - Run `seo audit` or `seo page` analysis.
   - Generate `GBP-GUIDE.md` for Google Business Profile setup.

---

## Reference Snippets & Files
For code implementations of `siloLinking.ts`, `getPageUrl.ts`, and core templates, refer to the `references/` folder in this skill.
