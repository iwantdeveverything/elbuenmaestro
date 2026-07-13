export interface SiloPageData {
  title: string;
  description: string;
  h1: string;
  type: 'hub' | 'spoke';
  service: string;
  locationName?: string;
  locationSlug?: string;
  parentHub?: string;
  landmarks?: string[];
  neighborhoodContext?: string;
}

export interface SiloPageEntry {
  id: string;
  data: SiloPageData;
}

export interface SiloLink {
  slug: string;
  url: string;
  text: string;
}

export interface SiloLinksResult {
  type: 'home' | 'hub' | 'spoke';
  hubs?: SiloLink[];
  spokes?: SiloLink[];
  parentHub?: SiloLink;
  home?: SiloLink;
  laterals?: SiloLink[];
}

/**
 * Calculates internal linking nodes for a page within the local SEO silo structure.
 * 
 * - Home page: returns links to all category Hubs.
 * - Hub page: returns links to all its location Spokes.
 * - Spoke page: returns upward link to parent Hub, home link, and 2 lateral sibling links.
 */
export function getSiloLinks(
  currentPage: SiloPageEntry,
  allPages: SiloPageEntry[]
): SiloLinksResult {
  const isHome = currentPage.id === 'index';

  if (isHome) {
    const hubs = allPages
      .filter((page) => page.data.type === 'hub' && page.id !== 'index')
      .map((page) => ({
        slug: page.id,
        url: `/${page.id}`,
        text: page.data.h1 || page.data.title,
      }));

    return {
      type: 'home',
      hubs,
    };
  }

  if (currentPage.data.type === 'hub') {
    const spokes = allPages
      .filter(
        (page) =>
          page.data.type === 'spoke' &&
          (page.data.parentHub === currentPage.id ||
            page.data.parentHub === currentPage.data.service)
      )
      .map((page) => ({
        slug: page.id,
        url: `/${page.id}`,
        text: page.data.h1 || page.data.title,
      }));

    return {
      type: 'hub',
      spokes,
    };
  }

  // Spoke page logic
  const parentHubEntry = allPages.find(
    (page) =>
      page.data.type === 'hub' &&
      (page.id === currentPage.data.parentHub ||
        page.data.service === currentPage.data.parentHub)
  );

  const homeEntry = allPages.find((page) => page.id === 'index');

  const parentHubLink: SiloLink | undefined = parentHubEntry
    ? {
        slug: parentHubEntry.id,
        url: `/${parentHubEntry.id}`,
        text: parentHubEntry.data.h1 || parentHubEntry.data.title,
      }
    : undefined;

  const homeLink: SiloLink = {
    slug: 'index',
    url: '/',
    text: homeEntry?.data.h1 || 'Inicio: Albañiles Profesionales en Cancún',
  };

  const laterals: SiloLink[] = [];
  const allSpokes = allPages.filter((page) => page.data.type === 'spoke');

  // 1. Same location, different service (lateral)
  const currentLocSlug = currentPage.data.locationSlug || currentPage.data.locationName?.toLowerCase();
  const sameLocDiffService = allSpokes.find(
    (page) =>
      page.id !== currentPage.id &&
      page.data.service !== currentPage.data.service &&
      (page.data.locationSlug === currentPage.data.locationSlug ||
        page.data.locationName === currentPage.data.locationName ||
        (page.data.locationSlug && currentLocSlug && page.data.locationSlug === currentLocSlug))
  );

  if (sameLocDiffService) {
    laterals.push({
      slug: sameLocDiffService.id,
      url: `/${sameLocDiffService.id}`,
      text: sameLocDiffService.data.h1 || sameLocDiffService.data.title,
    });
  }

  // 2. Same service, neighboring/other locations (lateral)
  const sameServiceSpokes = allSpokes
    .filter(
      (page) =>
        page.data.service === currentPage.data.service &&
        page.id !== currentPage.id
    )
    .sort((a, b) => a.id.localeCompare(b.id));

  if (sameServiceSpokes.length > 0) {
    const allSameServiceSpokes = [...sameServiceSpokes, currentPage].sort((a, b) =>
      a.id.localeCompare(b.id)
    );
    const currentIndex = allSameServiceSpokes.findIndex(
      (page) => page.id === currentPage.id
    );

    // Next location circular neighbor
    const nextIndex = (currentIndex + 1) % allSameServiceSpokes.length;
    const nextSpoke = allSameServiceSpokes[nextIndex];
    if (nextSpoke.id !== currentPage.id) {
      laterals.push({
        slug: nextSpoke.id,
        url: `/${nextSpoke.id}`,
        text: nextSpoke.data.h1 || nextSpoke.data.title,
      });
    }

    // Graceful fallback: if same-location-diff-service was not found, add previous circular neighbor
    if (!sameLocDiffService && allSameServiceSpokes.length > 2) {
      const prevIndex =
        (currentIndex - 1 + allSameServiceSpokes.length) %
        allSameServiceSpokes.length;
      const prevSpoke = allSameServiceSpokes[prevIndex];
      if (prevSpoke.id !== currentPage.id && prevSpoke.id !== nextSpoke.id) {
        laterals.push({
          slug: prevSpoke.id,
          url: `/${prevSpoke.id}`,
          text: prevSpoke.data.h1 || prevSpoke.data.title,
        });
      }
    }
  }

  return {
    type: 'spoke',
    parentHub: parentHubLink,
    home: homeLink,
    laterals,
  };
}
