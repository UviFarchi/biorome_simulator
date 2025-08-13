import { describe, it, expect } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { resourceStore } from '@/stores/resources.js';

describe('resource store', () => {
  it('initializes', () => {
    setActivePinia(createPinia());
    const store = resourceStore();
    expect(store).toBeDefined();
  });
});
