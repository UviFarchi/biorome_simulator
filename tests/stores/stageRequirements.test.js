// tests/stores/stageRequirements.test.js
import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { stageRequirementsStore } from '@/stores/stageRequirements.js';

const onlyTypeSubtype = (obj) => {
  const keys = Object.keys(obj);
  return keys.every(k => k === 'type' || k === 'subtype');
};

describe('requirements store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });
})

  it('exposes stageRequirements with arrays of descriptors', () => {
    const {stageRequirements} = stageRequirementsStore()
    expect(stageRequirements).toBeTruthy()
    expect(Array.isArray(stageRequirements.discovery)).toBe(true)
    expect(Array.isArray(stageRequirements.design)).toBe(true)
    for (const req of stageRequirements.discovery) {
      expect(typeof req.type).toBe('string')
      expect(typeof req.condition).toBe('string')
    }
  })

  it('exposes stageRestrictions with correct booleans per stage', () => {
    const {stageRestrictions} = stageRequirementsStore()
    expect(stageRestrictions.discovery.analytics).toBe(true)
    expect(stageRestrictions.discovery.optimizations).toBe(false)
    expect(stageRestrictions.discovery.operations).toBe(false)
    expect(stageRestrictions.design.optimizations).toBe(true)
    expect(stageRestrictions.deployment.operations).toBe(true)
  })

