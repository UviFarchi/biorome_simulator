// tests/stores/resources.test.js
import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { resourceStore } from '@/stores/resources.js';
import { gameStore } from '@/stores/game.js';

describe('resources store', () => {
  beforeEach(() => {
    localStorage.clear();
    setActivePinia(createPinia());
  });

  it('initializes with numeric counters and gold derived from difficulty=1', () => {
    const r = resourceStore();
    expect(typeof r.electricity).toBe('number');
    expect(typeof r.water).toBe('number');
    expect(typeof r.waste).toBe('number');
    expect(r.electricity).toBe(0);
    expect(r.water).toBe(0);
    expect(r.waste).toBe(0);
    // game.difficulty default is 1 ⇒ gold = 30000
    expect(r.gold).toBe(30000);
  });

  it('derives gold from saved difficulty before init (2 → 15000, 3 → 10000)', () => {
    localStorage.setItem('bioromeUser', JSON.stringify({ userName: 'a', userAvatar: 'b', difficulty: 2 }));
    setActivePinia(createPinia());
    expect(resourceStore().gold).toBe(15000);

    localStorage.setItem('bioromeUser', JSON.stringify({ userName: 'a', userAvatar: 'b', difficulty: 3 }));
    setActivePinia(createPinia());
    expect(resourceStore().gold).toBe(10000);
  });

  it('does not back-write to localStorage on init', () => {
    const before = localStorage.getItem('bioromeUser');
    resourceStore();
    const after = localStorage.getItem('bioromeUser');
    expect(before).toBeNull();
    expect(after).toBeNull();
  });

  it('gold is not retroactive if difficulty changes after creation', () => {
    const r = resourceStore();
    const g = gameStore();
    const initial = r.gold;
    g.difficulty = 3; // change after resources initialized
    expect(r.gold).toBe(initial); // remains fixed until a new game/reset
  });
});
