# Delta for SEO Microsite Structure

## MODIFIED Requirements

### Requirement: URL Routing Topology

The site MUST expose exactly 49 pages built as static paths:
- Home page at `/`.
- 4 Service Hubs, each at a single-segment URL `/[hub]` (e.g. `/construccion-bardas`).
- 44 location spokes, each at a nested two-segment URL `/[hub]/[location-slug]` derived
  as `/${parentHub}/${locationSlug}` from the spoke's frontmatter.

Hub URLs MUST remain single-segment. The home URL MUST remain `/`. Spoke URLs MUST be
nested and MUST be derived from `parentHub` (the hub page id) plus `locationSlug`. The
system MUST NOT emit flat single-segment spoke URLs (e.g. `/bardas-zona-hotelera`); the
prior flat routing model is non-conformant. The rest-parameter route serving pages MUST
NOT shadow the home page (`/`) or the `/api/lead` endpoint.

(Previously: spec stated slugs "MUST use flat routing" while requiring nested paths, an
internal contradiction; spokes were emitted as flat single-segment URLs. This locks nested
spoke URLs and explicitly rejects flat spoke URLs. Closes issue #4.)

#### Scenario: Spoke renders at nested URL

- GIVEN a spoke page with `parentHub` = `construccion-bardas` and `locationSlug` = `zona-hotelera`
- WHEN the static paths are generated
- THEN the spoke is served at `/construccion-bardas/zona-hotelera`
- AND no flat single-segment path for that spoke is generated

#### Scenario: Hub renders at single-segment URL

- GIVEN a hub page with id `construccion-bardas`
- WHEN the static paths are generated
- THEN the hub is served at `/construccion-bardas`
- AND the home page remains at `/`

#### Scenario: Build emits exactly 49 nested static paths

- GIVEN the 49-page content collection (1 home, 4 hubs, 44 spokes)
- WHEN the site builds
- THEN 49 pages build successfully
- AND all 44 spoke paths are two-segment nested URLs, all 4 hub paths are single-segment

#### Scenario: API and index routes are not shadowed

- GIVEN the rest-parameter page route and the `/api/lead` endpoint coexist
- WHEN a request resolves to `/` or `/api/lead`
- THEN the home page and the lead endpoint respond, not the rest-parameter route

### Requirement: Silo Navigation Linking

Navigation links MUST be generated dynamically using silo routing rules:
- Downward: Hub pages link to their 11 spoke (location) pages.
- Upward: Spoke pages link back to their parent Hub page.
- Lateral: Spoke pages link to sibling spokes of the same Hub.

All internal links that point to a spoke (downward from hub, and lateral sibling/next/prev)
MUST use the nested URL `/${parentHub}/${locationSlug}`. Links to hubs (upward, and home-to-hub)
MUST use the single-segment hub URL, and the home link MUST remain `/`. All URL construction
MUST derive from a single shared source of truth so link URLs and generated static paths
never diverge.

(Previously: silo links to spokes were built as flat single-segment `/${id}` URLs, diverging
from the required nested topology and duplicating URL construction across sites.)

#### Scenario: Lateral spoke link is nested

- GIVEN a visitor on a spoke page under hub `construccion-bardas`
- WHEN the page compiles
- THEN each lateral sibling-spoke link points to `/construccion-bardas/[sibling-location-slug]`
- AND the upward link points to the single-segment hub URL `/construccion-bardas`

#### Scenario: Downward hub-to-spoke link is nested

- GIVEN a visitor on a hub page
- WHEN the page compiles
- THEN each of the 11 downward spoke links uses the nested `/${parentHub}/${locationSlug}` URL

#### Scenario: Link URLs match generated static paths

- GIVEN a spoke URL rendered in a silo link
- WHEN compared to that spoke's generated static path
- THEN both are byte-identical, because both derive from the same shared URL source
