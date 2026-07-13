import { test } from 'node:test';
import assert from 'node:assert';
import { getPageUrl } from './getPageUrl.ts';
import type { SiloPageEntry } from './siloLinking.ts';

test('getPageUrl - home page (id "index") resolves to root', () => {
  const home: SiloPageEntry = {
    id: 'index',
    data: {
      title: 'Home',
      description: 'Home',
      h1: 'Home',
      type: 'hub',
      service: 'general',
    },
  };

  assert.strictEqual(getPageUrl(home), '/');
});

test('getPageUrl - hub page resolves to single-segment URL', () => {
  const hub: SiloPageEntry = {
    id: 'construccion-bardas',
    data: {
      title: 'Bardas',
      description: 'Hub',
      h1: 'Bardas',
      type: 'hub',
      service: 'construccion-bardas',
    },
  };

  assert.strictEqual(getPageUrl(hub), '/construccion-bardas');
});

test('getPageUrl - spoke page resolves to nested two-segment URL from parentHub + locationSlug', () => {
  const spoke: SiloPageEntry = {
    id: 'bardas-zona-hotelera',
    data: {
      title: 'Bardas Zona Hotelera',
      description: 'Spoke',
      h1: 'Bardas Zona Hotelera',
      type: 'spoke',
      service: 'construccion-bardas',
      parentHub: 'construccion-bardas',
      locationSlug: 'zona-hotelera',
    },
  };

  assert.strictEqual(getPageUrl(spoke), '/construccion-bardas/zona-hotelera');
});

test('getPageUrl - malformed spoke missing parentHub falls back to flat id URL', () => {
  const spoke: SiloPageEntry = {
    id: 'bardas-orphan',
    data: {
      title: 'Orphan',
      description: 'Spoke',
      h1: 'Orphan',
      type: 'spoke',
      service: 'construccion-bardas',
      locationSlug: 'zona-hotelera',
    },
  };

  assert.strictEqual(getPageUrl(spoke), '/bardas-orphan');
});

test('getPageUrl - malformed spoke missing locationSlug falls back to flat id URL', () => {
  const spoke: SiloPageEntry = {
    id: 'bardas-orphan-2',
    data: {
      title: 'Orphan 2',
      description: 'Spoke',
      h1: 'Orphan 2',
      type: 'spoke',
      service: 'construccion-bardas',
      parentHub: 'construccion-bardas',
    },
  };

  assert.strictEqual(getPageUrl(spoke), '/bardas-orphan-2');
});
