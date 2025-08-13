import { describe, it, expect } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { requirementsStore } from '@/stores/requirements.js';

describe('requirements store', () => {
  it('initializes', () => {
    setActivePinia(createPinia());
    const store = requirementsStore();
    expect(store).toBeDefined();
  });
});
