import { describe, it, expect } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { eventsStore } from '@/stores/events.js';

describe('events store', () => {
  it('initializes', () => {
    setActivePinia(createPinia());
    const store = eventsStore();
    expect(store).toBeDefined();
  });
});
