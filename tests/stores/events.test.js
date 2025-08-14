// tests/stores/events.test.js
import { describe, it, expect } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { eventsStore } from '@/stores/events.js';

describe('events store', () => {
  it('initializes', () => {
    setActivePinia(createPinia());
    const store = eventsStore();
    expect(store).toBeDefined();
    expect(Array.isArray(store.log)).toBe(true);           // empty log
    expect(store.log.length).toBe(0);
    expect(Array.isArray(store.active)).toBe(true);        // empty active
    expect(store.active.length).toBe(0);
  });

  it('exposes canonical events and effects', () => {
    setActivePinia(createPinia());
    const store = eventsStore();
    expect(Array.isArray(store.possible)).toBe(true);
    expect(store.possible.length).toBeGreaterThan(0);
    expect(store.effects && typeof store.effects).toBe('object');
  });

  it('events have required fields', () => {
    setActivePinia(createPinia());
    const store = eventsStore();
    for (const e of store.possible) {
      expect(typeof e.id).toBe('string');
      expect(['event','market'].includes(e.type)).toBe(true);           // :contentReference[oaicite:0]{index=0}
      expect(typeof e.headline).toBe('string');
      expect(typeof e.details).toBe('string');
      expect(typeof e.frequency).toBe('number');
      expect(e.frequency).toBeGreaterThanOrEqual(0);
      expect(e.frequency).toBeLessThanOrEqual(1);
      expect(typeof e.duration).toBe('number');
      expect(e.duration).toBeGreaterThan(0);
      expect(Array.isArray(e.effect)).toBe(true);
      expect(e.effect.length).toBeGreaterThan(0);
    }
  });

  it('sample general event shape matches spec', () => {
    setActivePinia(createPinia());
    const store = eventsStore();
    const locust = store.possible.find(e => e.id === 'event-1');
    expect(locust).toBeTruthy();                                         // :contentReference[oaicite:1]{index=1}
    expect(locust.type).toBe('event');
    expect(locust.effect.some(x => x.target === 'tile' && x.property === 'pests' && typeof x.delta === 'number')).toBe(true);
  });

  it('sample market event shape matches spec', () => {
    setActivePinia(createPinia());
    const store = eventsStore();
    const surge = store.possible.find(e => e.id === 'market-1');
    expect(surge).toBeTruthy();                                          // :contentReference[oaicite:2]{index=2}
    expect(surge.type).toBe('market');
    const eff = surge.effect[0];
    expect(eff.target).toBe('market');
    expect(Array.isArray(eff.affectedTypes)).toBe(true);
    expect(typeof eff.priceModifier).toBe('number');
  });

  it('effects dictionary exposes known keys', () => {
    setActivePinia(createPinia());
    const store = eventsStore();
    for (const key of ['fertilizer','pest_control','pollination','defense','weed_suppression','ph_up','ph_down','surprise']) {
      expect(store.effects).toHaveProperty(key);                          // :contentReference[oaicite:3]{index=3}
    }
  });

  it('special events with tileCount are well-formed', () => {
    setActivePinia(createPinia());
    const store = eventsStore();
    const fairy = store.possible.find(e => e.id === 'special-2');
    expect(fairy).toBeTruthy();                                           // :contentReference[oaicite:4]{index=4}
    const eff = fairy.effect.find(x => x.target === 'tile');
    expect(eff).toBeTruthy();
    expect(eff.tileCount).toBe(1);
    expect(typeof eff.property).toBe('string');
    expect(typeof eff.delta).toBe('number');
  });
});
