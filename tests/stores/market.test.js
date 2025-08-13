import { describe, it, expect } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { marketStore } from '@/stores/market.js';

describe('market store', () => {
  it('initializes', () => {
    setActivePinia(createPinia());
    const store = marketStore();
    expect(store).toBeDefined();
  });
});
