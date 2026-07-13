# Exploration: SEO Local Microsite for Masonry in Cancun

This document explores the technical structure, deployment pipeline, routing strategies, internal linking, and lead generation setup for the masonry local microsite in Cancun (`elbuenmaestro`).

## Current State

The `elbuenmaestro` project is currently a pristine Astro v7.0.8 starter template configured with TypeScript and using `pnpm` as the package manager.
* **Routing**: Only the default `/src/pages/index.astro` exists.
* **Deployment**: Not yet deployed; no configuration files for Vercel are present.
* **Content**: No content files, collections, or SEO schemas exist.
* **Lead Form**: No form components or serverless endpoints are implemented.

---

## Affected Areas

Establishing this SEO microsite will affect and require creating files in the following areas:
* `astro.config.mjs` — Add integration/adapter configurations (e.g., Vercel adapter if choosing hybrid/SSR model, or site URL for sitemaps).
* `/src/content/` — Set up Content Collections schemas and directories for hubs and location pages.
* `/src/pages/` — Replace boilerplate routing with dynamic routes for hubs (`/[hub].astro`) and locations (`/[hub]/[location].astro`).
* `/src/components/` — Create shared layout components (Header, Footer, Navigation, SEO Meta Tags, and a responsive Lead Form).
* `/src/layouts/` — Update base layout with SEO support (JSON-LD schema markup, Open Graph, meta descriptions).
* `/github/workflows/` (optional) — Define CI/CD validation checks (linting, build verification) to protect branches.
* `package.json` — Add dependencies for SEO plugins (e.g., `@astrojs/sitemap`), adapters, and potential form-handling tools.

---

## Approaches

### 1. Astro Routing & Content Architecture

To manage ~50 pages (1 Home, 4 Hubs, 44 Locations [4 Hubs x 11 Locations]), we compare three routing approaches:

| Dimension | Option A: Pure File-Based Routing | Option B: Static Config + Dynamic Routing | Option C: Content Collections + Dynamic Routing (Recommended) |
| :--- | :--- | :--- | :--- |
| **Structure** | 49 separate `.astro` files under `/src/pages/`. | 2 dynamic files (`[hub].astro`, `/[hub]/[location].astro`) + 1 JSON config. | 2 dynamic files (`[hub].astro`, `/[hub]/[location].astro`) + Astro Content Collections. |
| **Content Format** | HTML/Astro markup inline in each page file. | Raw JSON or JS objects containing text strings. | Markdown / MDX files (`.md` or `.mdx`) in `src/content/`. |
| **Pros** | • Intuitive for beginners.<br>• Full code flexibility per page. | • Minimal code duplication.<br>• Adding a page is just a config line. | • Best-practice separation of content and layout.<br>• Type-safe frontmatter schema validations (SEO check).<br>• Scalable for copywriters. |
| **Cons** | • Heavy code duplication.<br>• Making global structure changes is painful. | • Hard to write rich, formatted body copy inside JSON strings. | • Slightly higher initial layout complexity. |
| **Effort** | High (ongoing maintenance) | Medium | Medium (one-time setup) |

---

## 2. GitHub & Vercel Deployment Setup

To ensure stable deployments, branch protection, and preview builds:

### Option A: Pure Static Hosting (SSG)
* **Description**: Astro builds to static files (`dist/`). Vercel automatically detects the Astro project and deploys it as a static site.
* **Branch Protection**: Protect `main` in GitHub. Require all PRs to pass the Vercel Build check before merging.
* **Lead Form**: Submits client-side directly to a third-party serverless service (e.g., Formspree, Netlify Forms, custom webhook).
* **Pros**: Simple, completely serverless, zero cold starts, free tier friendly, fast.
* **Cons**: Form submission endpoint is exposed in client-side JS; dependent on third-party pricing/limits.

### Option B: Hybrid Rendering (Recommended)
* **Description**: Astro builds pages statically (using pre-rendering) but supports serverless endpoints. Install `@astrojs/vercel` and set `output: 'hybrid'` in `astro.config.mjs`.
* **Branch Protection**: Protect `main` in GitHub. Require approvals and successful Vercel preview builds.
* **Lead Form**: Form submits via POST to an Astro endpoint `/api/lead` which runs securely on Vercel Serverless.
* **Pros**: Form validation and email sending credentials remain fully secure on the server. Fast static load for users, dynamic API execution on submit.
* **Cons**: Small serverless cold start for lead submissions (doesn't affect page speed).

---

## 3. Internal Linking Strategy (SEO Silo / Hub-and-Spoke)

An effective SEO silo structure is critical for local keyword ranking in Cancun:
* **Level 1 (Root)**: Home (`/`) links to the 4 main service Hubs.
* **Level 2 (Hubs)**: Each Hub (e.g., `/albanileria-residencial`) links to all 11 locations for that specific service.
* **Level 3 (Locations)**: Each location page (e.g., `/albanileria-residencial/centro`) links back to its parent Hub and the Home page.
* **Horizontal Mesh**: Each location page lists 3-4 neighboring locations (e.g., Centro links to Zona Hotelera, Alfredo V. Bonfil, etc.) to pass authority laterally.
* **Automation**: We will generate these linking menus programmatically by querying the Astro Content Collections, preventing broken internal links.

---

## 4. Lead Form Implementation

To capture and process leads securely:
* **Form Component**: Built with Astro and client-side validation, styled with clean, modern CSS.
* **Spam Prevention**: Honeypot input fields + optional Cloudflare Turnstile integration.
* **Submission Handling**: Submits via `fetch` to `/api/lead.ts`.
* **Lead Storage/Notification**:
  1. Forward lead details via email (using Resend API) to the contractor.
  2. (Optional) Log leads to a Google Sheet via a secure webhook.

---

## Recommendation

We recommend **Option C (Content Collections + Dynamic Routing)** combined with **Vercel Hybrid Deployment (Option B)**:
1. **Astro Pages Structure**: Use Content Collections for type-safe metadata validation (ensuring every page has a unique meta title, description, H1, and geotag). Use dynamic routing (`[hub].astro` and `/[hub]/[location].astro`) for rendering.
2. **GitHub/Vercel**: Set up a repository with `main` (production) and `develop` (staging/preview). Enable branch protection rules on `main` requiring approved PRs and passing Vercel checks. Set Astro to `hybrid` mode.
3. **Form Setup**: Handle form submissions via a secure `/api/lead` serverless endpoint to prevent API key exposure and block spam server-side.
4. **SEO Optimization**: Automate internal linking menus and schema markup generation dynamically based on the location dataset.

---

## Risks

* **Spam Submissions**: Local contact forms are highly targeted by spam bots.
  * *Mitigation*: Implement a honeypot field and integrate Cloudflare Turnstile if spam persists.
* **Content Duplication (SEO Penalty)**: Creating 44 location pages might lead to thin or duplicate content flags from search engines.
  * *Mitigation*: Ensure the content collections schema requires customized, local-specific paragraphs (e.g., reference landmarks in Cancun, local pricing, specific neighborhood references) to differentiate pages.
* **Vercel Cold Starts**: The `/api/lead` serverless endpoint might experience mild cold starts.
  * *Mitigation*: Optimize the endpoint package size and keep imports lightweight to minimize execution duration.

---

## Ready for Proposal

**Yes**. We have a clear path forward for the architectural skeleton and are ready to compile the project specification and task list.
