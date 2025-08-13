import { describe, it, expect } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { gameStore } from '@/stores/game.js';

describe('game store', () => {
  it('initializes', () => {
    setActivePinia(createPinia());
    const store = gameStore();
    expect(store).toBeDefined();
  });
});
