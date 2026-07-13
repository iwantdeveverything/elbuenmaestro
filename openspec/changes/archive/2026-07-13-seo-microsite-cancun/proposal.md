# Proposal: SEO Local Microsite for Masonry in Cancun

## Intent

To capture local organic traffic for masonry services in Cancun by launching a high-performance microsite with automated linking, type-safe content management, and secure lead capture.

## Scope

### In Scope
- Setup GitHub remote repository under `iwantdeveverything` organization.
- Implement branch protection rules on `main` (requires >= 1 approval, trunk-based, linear history).
- Configure Vercel hybrid deployment using `@astrojs/vercel` adapter for serverless lead processing.
- Create 1 Home page, 4 Hubs (hubs), 44 location pages (hubs x 11 locations) using Astro Content Collections.
- Automate a dynamic internal linking component (silo structure) based on content metadata.
- Implement a secure lead capture form with honeypot spam prevention.

### Out of Scope
- AI voice agent (recepcionista IA) - deferred for future phase.
- Third-party CRM/Google Sheets sync integrations (beyond basic API endpoint validation).

## Capabilities

### New Capabilities
- `github-vercel-setup`: Infrastructure setup with branch protection and Vercel hybrid deployment configuration.
- `seo-microsite-structure`: Multi-page local SEO architecture (1 Home, 4 Hubs, 44 locations) via Astro Content Collections.
- `lead-capture-form`: Spam-protected secure contact form submitting to local endpoint `/api/lead`.

### Modified Capabilities
None

## Approach

Implement an Astro project structured with Content Collections for services and locations. Compile static pages for speed, but configure hybrid rendering to host `/api/lead` as a serverless endpoint on Vercel. Develop a linking component query engine that dynamically stitches parent-child-lateral navigation nodes from collection schemas. Set up GitHub repo under the organization with branch rules.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `astro.config.mjs` | Modified | Add Vercel adapter (`hybrid` output) and site configuration. |
| `package.json` | Modified | Install `@astrojs/vercel` and form helper dependencies. |
| `src/content/config.ts` | New | Define collections schema for service hubs and locations. |
| `src/content/` | New | Markdown/MDX content for service hubs and locations. |
| `src/pages/` | New/Modified | Create dynamic routes: `[hub].astro`, `/[hub]/[location].astro`. |
| `src/components/` | New | Form component with honeypot; dynamic silo linking layouts. |
| `src/pages/api/lead.ts` | New | Serverless route for lead processing. |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Local SEO content duplication | Medium | Enforce schema rules for Cancun landmarks/neighborhoods context. |
| Spam lead form submissions | Medium | Implement hidden honeypot field and input validation. |

## Rollback Plan

Revert git changes to current main, disable Vercel deployments, and delete remote repository if needed.

## Dependencies

- GitHub organization `iwantdeveverything` admin access.
- Vercel team/project integration access.

## Success Criteria

- [ ] Successful hybrid Vercel deployment with SSL and sitemap.
- [ ] 49 correctly routed pages (1 Home + 4 Hubs + 44 Locations).
- [ ] Dynamic internal links generated automatically without hardcoding.
- [ ] Lead submissions validated, spam-filtered, and successfully handled by API.
