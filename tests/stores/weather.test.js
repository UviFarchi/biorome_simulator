import { describe, it, expect } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { weatherStore } from '@/stores/weather.js';

describe('weather store', () => {
  it('initializes', () => {
    setActivePinia(createPinia());
    const store = weatherStore();
    expect(store).toBeDefined();
  });
});
