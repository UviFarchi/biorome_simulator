import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { animals } from '@/stores/animals.js';

describe('animals store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('creates a store instance', () => {
    const store = animals();
    expect(store).toBeTruthy();
  });
});
