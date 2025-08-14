import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { plants } from '@/stores/plants.js';

describe('plants store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('creates a store instance', () => {
    const store = plants();
    expect(store).toBeTruthy();
  });
});
