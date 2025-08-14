// tests/stores/map.test.js
import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { mapStore } from '@/stores/map.js';

const expectTile = (t, r, c) => {
  expect(t.row).toBe(r);
  expect(t.col).toBe(c);
  expect(t.surveyed).toBe(false);
  expect(t.soil).toEqual({
    health: 100, water: 0, fertility: 0, recoveryRate: 5, compaction: 0, ph: 7
  });
  expect(t.plant).toBeNull();
  expect(t.animal).toBeNull();
  expect(t.pests).toBe(0);
  expect(t.weeds).toBe(0);
  expect(t.pollination).toBe(0);
  expect(t.defense).toBe(0);
  expect(Array.isArray(t.assemblies)).toBe(true);
  expect(t.assemblies.length).toBe(0);
};

describe('map store', () => {
  beforeEach(() => {
    localStorage.clear();
    setActivePinia(createPinia());
  });

  it('initializes with a square grid sized by difficulty (default 6x6)', () => {
    const m = mapStore(); // game.difficulty defaults to 1
    expect(Array.isArray(m.tiles)).toBe(true);
    expect(m.tiles.length).toBe(6);                    // rows
    expect(m.tiles.every(row => Array.isArray(row) && row.length === 6)).toBe(true); // cols
    // spot-check a few tiles
    expectTile(m.tiles[0][0], 0, 0);
    expectTile(m.tiles[5][5], 5, 5);
  }); //

  it('respects saved difficulty at creation time (difficulty=2 -> 12x12)', () => {
    localStorage.setItem('bioromeUser', JSON.stringify({ userName: 'a', userAvatar: 'b', difficulty: 2 }));
    setActivePinia(createPinia()); // new pinia so gameStore reads localStorage before mapStore builds grid
    const m = mapStore();
    expect(m.tiles.length).toBe(12);
    expect(m.tiles.every(row => row.length === 12)).toBe(true);
    expectTile(m.tiles[11][11], 11, 11);
  }); // :contentReference[oaicite:1]{index=1}

  it('exposes gate and selectedSubject with correct defaults', () => {
    const m = mapStore();
    expect(m.gate).toEqual({ animals: [], plants: [], extras: [] });
    expect(typeof m.selectedSubject).toBe('object');
    expect(Object.keys(m.selectedSubject).length).toBe(0);
  }); // :contentReference[oaicite:2]{index=2}
});
