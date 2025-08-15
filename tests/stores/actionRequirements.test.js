import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { actionRequirementsStore } from '@/stores/actionRequirements.js';

const onlyTypeSubtype = (obj) => {
  const keys = Object.keys(obj);
  return keys.every(k => k === 'type' || k === 'subtype');
};

describe('requirements store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('initializes and exposes top-level sections', () => {
    const r = actionRequirementsStore();
    expect(r).toBeDefined();
    for (const k of ['harvest', 'sowing', 'animal', 'assemblies']) {
      expect(typeof r[k]).toBe('object');
    }
  });

  it('harvest dictionary contains known products with arrays of requirements', () => {
    const { harvest } = actionRequirementsStore();
    for (const k of ['honey', 'wool']) {            // sample canonical keys
      expect(Array.isArray(harvest[k])).toBe(true);
      expect(harvest[k].length).toBeGreaterThan(0);
      harvest[k].forEach(req => {
        expect(typeof req.type).toBe('string');
        expect(onlyTypeSubtype(req)).toBe(true);
      });
    }
  }); // :contentReference[oaicite:0]{index=0}

  it('sowing actions expose seed, seedling, fertilize with arrays of {type, subtype?}', () => {
    const { sowing } = actionRequirementsStore();
    for (const k of ['seed', 'seedling', 'fertilize']) {
      expect(Array.isArray(sowing[k])).toBe(true);
      expect(sowing[k].length).toBeGreaterThan(0);
      sowing[k].forEach(req => {
        expect(typeof req.type).toBe('string');
        expect(onlyTypeSubtype(req)).toBe(true);
      });
    }
  }); // :contentReference[oaicite:1]{index=1}

  it('animal actions expose move, collar, feed with arrays of {type, subtype?}', () => {
    const { animal } = actionRequirementsStore();
    for (const k of ['move', 'collar', 'feed']) {
      expect(Array.isArray(animal[k])).toBe(true);
      expect(animal[k].length).toBeGreaterThan(0);
      animal[k].forEach(req => {
        expect(typeof req.type).toBe('string');
        expect(onlyTypeSubtype(req)).toBe(true);
      });
    }
  }); // :contentReference[oaicite:2]{index=2}

  it('assemblies expose transportAssembly and buildAssembly with valid entries', () => {
    const { assemblies } = actionRequirementsStore();
    expect(Array.isArray(assemblies.transportAssembly)).toBe(true);
    expect(assemblies.transportAssembly.length).toBeGreaterThan(0);
    assemblies.transportAssembly.forEach(req => {
      expect(typeof req.type).toBe('string');
      expect(onlyTypeSubtype(req)).toBe(true);
    });

    expect(Array.isArray(assemblies.buildAssembly)).toBe(true);
    expect(assemblies.buildAssembly.length).toBeGreaterThan(0);
    expect(assemblies.buildAssembly.some(x => x.type === 'tool')).toBe(true);
  }); // :contentReference[oaicite:3]{index=3}
});