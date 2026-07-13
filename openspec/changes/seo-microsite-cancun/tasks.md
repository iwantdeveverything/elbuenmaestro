# Tasks: SEO Local Microsite for Masonry in Cancun

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~600-800 lines (due to 49 content files + routing + components) |
| 400-line budget risk | High |
| Chained PRs recommended | Yes |
| Suggested split | PR 1 (Infra) → PR 2 (Collections & Routing) → PR 3 (Silo Links) → PR 4 (Form & API) → PR 5 (Content) |
| Delivery strategy | ask-on-risk |
| Chain strategy | stacked-to-main |

Decision needed before apply: No
Chained PRs recommended: Yes
Chain strategy: stacked-to-main
400-line budget risk: High

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|------|------|-----------|-------|
| 1 | GitHub & Vercel hybrid deployment | PR 1 | Base setup, dependencies, git rules. |
| 2 | Astro Content Collections & Routing | PR 2 | Dynamic routing `[slug].astro` & schema. Base: PR 1 |
| 3 | Dynamic Silo Linking generator | PR 3 | Query helpers & links component. Base: PR 2 |
| 4 | Lead form component & API endpoint | PR 4 | Honeypot protection & `/api/lead` API. Base: PR 3 |
| 5 | Complete Markdown content population | PR 5 | 4 hubs and 44 spokes generation. Base: PR 4 |

## Phase 1: Infrastructure & Foundation (Unit 1)

- [x] 1.1 Config Vercel adapter (Astro v5+ static/hybrid mode) in `astro.config.mjs` and modify `package.json` dependencies
- [x] 1.2 Setup GitHub remote under `iwantdeveverything` and branch protection for `main`
- [x] 1.3 Verify clean production build and local dev server setup

## Phase 2: Schema & Routing (Unit 2)

- [x] 2.1 Create `src/content.config.ts` (updated for Astro v6+) defining pages schema (`hub` vs `spoke`, landmarks, parentHub)
- [x] 2.2 Create `src/pages/[slug].astro` dynamic route template to handle rendering for hubs and spokes
- [x] 2.3 Add sample Markdown files in `src/content/pages/` to test both page types
- [x] 2.4 Test: Ensure dynamic router correctly renders categories and location pages with correct metadata

## Phase 3: Dynamic Silo Linking (Unit 3)

- [x] 3.1 Create query helper `src/utils/siloLinking.ts` to get parent, child, and lateral pages
- [x] 3.2 Create `src/components/SiloLinks.astro` UI component to render links from the helper
- [x] 3.3 Test: Verify silo links logic correctly isolates hubs and links lateral location pages in unit tests

## Phase 4: Lead Capture (Unit 4)

- [ ] 4.1 Create `src/components/LeadForm.astro` with inputs and hidden honeypot spam protection field
- [ ] 4.2 Create serverless endpoint `src/pages/api/lead.ts` validating input schemas and honeypot
- [ ] 4.3 Test: Mock form submission validating empty honeypot, field types, and spam filtering

## Phase 5: Content & Verification (Unit 5)

- [ ] 5.1 Add all 4 hubs and 44 location spokes markdown content under `src/content/pages/`
- [ ] 5.2 Run automated build validation checks verifying all 49 pages generate correct static paths
- [ ] 5.3 E2E Test: Verify form submit responds successfully under dev server
