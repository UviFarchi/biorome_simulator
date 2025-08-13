import { describe, it, expect } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { recalculateTileValues } from '@/calc/recalculateTileValues.js';

describe('recalculateTileValues', () => {
  it('runs without throwing', () => {
    setActivePinia(createPinia());
    expect(() => recalculateTileValues()).not.toThrow();
  });
});
