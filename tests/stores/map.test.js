import { describe, it, expect } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { mapStore } from '@/stores/map.js';

describe('map store', () => {
  it('initializes', () => {
    setActivePinia(createPinia());
    const store = mapStore();
    expect(store).toBeDefined();
  });
});
