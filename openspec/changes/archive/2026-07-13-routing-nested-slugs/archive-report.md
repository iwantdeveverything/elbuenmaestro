# Archive Report: routing-nested-slugs

**Change**: routing-nested-slugs  
**Archived**: 2026-07-13  
**Branch**: feat/nested-routing  
**PR**: #7 (closes #4)  
**Artifact store**: openspec  
**Status**: COMPLETE

## Executive Summary

The routing-nested-slugs change has been fully implemented, verified PASS (0 CRITICAL, 0 WARNING, 2 SUGGESTION), and archived. Nested hub/spoke URLs are now canonical; flat single-segment spoke URLs are explicitly rejected. The SEO microsite structure spec has been updated to lock nested topology.

## What Was Done

### Implementation Summary

- **new** `src/utils/getPageUrl.ts` — shared URL source of truth (home → `/`, hub → `/${id}`, spoke → `/${parentHub}/${locationSlug}`)
- **new** `src/utils/getPageUrl.test.ts` — 5 unit tests covering home/hub/spoke/malformed guards
- **modified** `src/pages/[slug].astro` → `src/pages/[...slug].astro` — rest-parameter router with nested slugs
- **modified** `src/utils/siloLinking.ts` — all 7 URL sites route through `getPageUrl()` helper
- **modified** `src/utils/siloLinking.test.ts` — added nested-URL assertions (downward spoke, lateral siblings)
- **modified** `package.json` — registered `getPageUrl.test.ts` in test script

### Verification Results

- **pnpm test**: 12/12 green (5 helper + 3 silo + 4 lead)
- **pnpm build**: 49 pages (1 home + 4 hub single-segment + 44 spoke nested two-segment)
- **Spec conformance**: All 4 URL topology scenarios verified against build output
- **Regression**: Hub/home URLs byte-identical; `/api/lead` not shadowed by rest route

**Verdict**: PASS — 0 CRITICAL, 0 WARNING, 2 SUGGESTION (both non-blocking, addressed during archive)

### Spec Merge

Delta spec merged into main spec `openspec/specs/seo-microsite-structure/spec.md`:
- **Removed**: "Slugs MUST use flat routing" (contradictory and non-conformant)
- **Added**: URL Routing Topology requirement with nested spoke rules, 4 nested scenarios, and explicit flat-URL rejection
- **Added**: Updated Silo Navigation Linking requirement with nested spoke URLs and single-source-of-truth rule
- **Preserved**: Content Collections requirement (unchanged)

Main spec now unambiguously mandates nested `/${parentHub}/${locationSlug}` topology.

### Documentation Updates

Refreshed stale documentation per verify-report SUGGESTION 1:
- **openspec/handoff.md L12**: Updated PR #1 description from "dynamic root router `[slug].astro`" to "nested hub/spoke routing via `[...slug].astro`"
- **openspec/handoff.md L23**: Replaced description of `[slug].astro` with rest-parameter router notes and `getPageUrl()` helper reference

## Artifacts Archived

The following change artifacts are now in the archive:
- explore.md
- proposal.md
- design.md
- specs/seo-microsite-structure/spec.md (delta)
- apply-progress.md
- tasks.md (7/7 complete)
- verify-report.md (PASS, 0 CRITICAL)

## Engram Observation IDs

Full SDD cycle traced by observation IDs (for auditing and recovery):
- Proposal: #773
- Spec (delta): #774
- Design: #775
- Tasks: #776
- Verify Report: #778
- Archive Report (this): persisted as `sdd/routing-nested-slugs/archive-report`

## Source of Truth Updated

The following specs now reflect the nested routing canonical rule:
- `openspec/specs/seo-microsite-structure/spec.md` — URL Routing Topology section locks nested hub/spoke URLs

## SDD Cycle Complete

✓ Proposal: Nested URLs solve SEO topical clustering gap (issue #4)  
✓ Spec: Delta written, reconciling contradictions  
✓ Design: REST-param router + shared `getPageUrl()` helper  
✓ Tasks: 7 tasks (TDD-ordered), checklist complete  
✓ Apply: Implementation committed on feat/nested-routing branch, PR #7 open  
✓ Verify: Fresh review PASS, 0 CRITICAL, spec conformance verified  
✓ Archive: Change folder moved, main spec merged, handoff refreshed  

Ready for the next change. Issue #4 closed by PR #7.

---

**Archive folder**: `openspec/changes/archive/2026-07-13-routing-nested-slugs/`
