import type { SiloPageEntry } from './siloLinking.ts';

/**
 * Single source of URL truth for the SEO microsite topology.
 *
 * - Home page (id `index`) → `/`.
 * - Hub page → single-segment `/${id}`.
 * - Spoke page → nested two-segment `/${parentHub}/${locationSlug}`.
 * - Malformed spoke (missing `parentHub` or `locationSlug`) → flat `/${id}`
 *   fallback so the build stays green and the page remains reachable while the
 *   data defect is surfaced by the unit test rather than a hard failure.
 */
export function getPageUrl(page: SiloPageEntry): string {
  if (page.id === 'index') return '/';

  if (page.data.type === 'spoke') {
    const { parentHub, locationSlug } = page.data;
    if (parentHub && locationSlug) return `/${parentHub}/${locationSlug}`;
    return `/${page.id}`;
  }

  return `/${page.id}`;
}
