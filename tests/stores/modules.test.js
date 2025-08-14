import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { modulesStore } from '@/stores/modules.js';

describe('modules store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('creates a store instance', () => {
    const store = modulesStore();
    expect(store).toBeTruthy();
  });
});
