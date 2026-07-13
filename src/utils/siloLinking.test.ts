import { test } from 'node:test';
import assert from 'node:assert';
import { getSiloLinks } from './siloLinking.ts';
import type { SiloPageEntry } from './siloLinking.ts';

// Mock dataset representing a minimal but complete SEO silo structure
const mockPages: SiloPageEntry[] = [
  {
    id: 'index',
    data: {
      title: 'El Buen Maestro | Albañilería en Cancún',
      description: 'Inicio',
      h1: 'Servicios de Albañilería',
      type: 'hub',
      service: 'general',
    },
  },
  {
    id: 'construccion-bardas',
    data: {
      title: 'Construcción de Bardas en Cancún',
      description: 'Hub de bardas',
      h1: 'Construcción de Bardas Perimetrales',
      type: 'hub',
      service: 'construccion-bardas',
    },
  },
  {
    id: 'acabados-finos',
    data: {
      title: 'Acabados Finos en Cancún',
      description: 'Hub de acabados',
      h1: 'Acabados Finos y Pintura',
      type: 'hub',
      service: 'acabados-finos',
    },
  },
  {
    id: 'bardas-zona-hotelera',
    data: {
      title: 'Bardas en Zona Hotelera',
      description: 'Spoke Zona Hotelera',
      h1: 'Expertos en Bardas en la Zona Hotelera',
      type: 'spoke',
      service: 'construccion-bardas',
      parentHub: 'construccion-bardas',
      locationSlug: 'zona-hotelera',
      locationName: 'Zona Hotelera',
    },
  },
  {
    id: 'bardas-centro',
    data: {
      title: 'Bardas en Centro Cancún',
      description: 'Spoke Centro',
      h1: 'Expertos en Bardas en el Centro de Cancún',
      type: 'spoke',
      service: 'construccion-bardas',
      parentHub: 'construccion-bardas',
      locationSlug: 'centro',
      locationName: 'Centro',
    },
  },
  {
    id: 'acabados-centro',
    data: {
      title: 'Acabados en Centro Cancún',
      description: 'Spoke acabados centro',
      h1: 'Acabados Finos en el Centro de Cancún',
      type: 'spoke',
      service: 'acabados-finos',
      parentHub: 'acabados-finos',
      locationSlug: 'centro',
      locationName: 'Centro',
    },
  },
];

test('Homepage Silo Linking - returns links to main Hubs', () => {
  const homePage = mockPages.find((p) => p.id === 'index')!;
  const result = getSiloLinks(homePage, mockPages);

  assert.strictEqual(result.type, 'home');
  assert.ok(result.hubs);
  // Should link to the 2 hubs (construccion-bardas, acabados-finos)
  assert.strictEqual(result.hubs!.length, 2);
  
  const hubIds = result.hubs!.map((h) => h.slug);
  assert.ok(hubIds.includes('construccion-bardas'));
  assert.ok(hubIds.includes('acabados-finos'));
  assert.strictEqual(result.hubs![0].url, '/construccion-bardas');
});

test('Hub Silo Linking - returns links to all its location Spokes', () => {
  const hubPage = mockPages.find((p) => p.id === 'construccion-bardas')!;
  const result = getSiloLinks(hubPage, mockPages);

  assert.strictEqual(result.type, 'hub');
  assert.ok(result.spokes);
  // Should return the 2 spokes associated with this hub
  assert.strictEqual(result.spokes!.length, 2);
  
  const spokeSlugs = result.spokes!.map((s) => s.slug);
  assert.ok(spokeSlugs.includes('bardas-zona-hotelera'));
  assert.ok(spokeSlugs.includes('bardas-centro'));

  // Downward hub-to-spoke links must be nested (parentHub/locationSlug)
  assert.strictEqual(result.spokes![0].url, '/construccion-bardas/zona-hotelera');
});

test('Spoke Silo Linking - returns upward parent, home, and lateral links', () => {
  const spokePage = mockPages.find((p) => p.id === 'bardas-centro')!;
  const result = getSiloLinks(spokePage, mockPages);

  assert.strictEqual(result.type, 'spoke');
  
  // Upward link
  assert.ok(result.parentHub);
  assert.strictEqual(result.parentHub!.slug, 'construccion-bardas');
  assert.strictEqual(result.parentHub!.url, '/construccion-bardas');

  // Home link
  assert.ok(result.home);
  assert.strictEqual(result.home!.slug, 'index');
  assert.strictEqual(result.home!.url, '/');

  // Lateral links:
  // 1. Same location (Centro), different service -> acabados-centro
  // 2. Same service (construccion-bardas), neighboring location -> bardas-zona-hotelera
  assert.ok(result.laterals);
  assert.strictEqual(result.laterals!.length, 2);

  const lateralSlugs = result.laterals!.map((l) => l.slug);
  assert.ok(lateralSlugs.includes('acabados-centro'), 'Should include same location, different service');
  assert.ok(lateralSlugs.includes('bardas-zona-hotelera'), 'Should include same service, other location');

  // Lateral spoke links must use the nested URL derived from the sibling's own hub
  assert.ok(
    result.laterals!.some((l) => l.url === '/acabados-finos/centro'),
    'Lateral same-location-different-service link must be nested'
  );
  assert.ok(
    result.laterals!.some((l) => l.url === '/construccion-bardas/zona-hotelera'),
    'Lateral same-service-other-location link must be nested'
  );
});
