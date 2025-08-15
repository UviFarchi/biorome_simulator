// tests/stores/map.test.js
import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { mapStore } from '@/stores/map.js';
function expectMeas(field, envVal) {
  expect(field).toEqual({ env: envVal, measured: { value: undefined } })
}
function expectTile(tile, r, c) {
  expect(tile.row).toBe(r)
  expect(tile.col).toBe(c)
}

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

  it('exposes gate and selectedTile with correct defaults', () => {
    const m = mapStore();
    expect(m.gate).toEqual({ animals: [], plants: [], extras: [] });
    expect(typeof m.selectedTile).toBe('object');
    expect(Object.keys(m.selectedTile).length).toBe(0);
  }); // :contentReference[oaicite:2]{index=2}
});

it('initializes measurement-shaped fields for topo, soil, and env', () => {
  const m = mapStore()
  const t = m.tiles[0][0]

  // topo
  expectMeas(t.topo.elevation, 0)
  expectMeas(t.topo.slopeDeg, 0)
  expectMeas(t.topo.aspectDeg, 0)
  expectMeas(t.topo.waterTable, 0)
  expectMeas(t.topo.drainageIndex, 0)

  // soil
  expectMeas(t.soil.health, 100)
  expectMeas(t.soil.water, 0)
  expectMeas(t.soil.fertility, 0)
  expectMeas(t.soil.recoveryRate, 5)
  expectMeas(t.soil.compaction, 0)
  expectMeas(t.soil.ph, 7)

  // env
  expectMeas(t.env.moisturePct, 0)
  expectMeas(t.env.tempC, 0)
  expectMeas(t.env.nutrients.N, 0)
  expectMeas(t.env.nutrients.P, 0)
  expectMeas(t.env.nutrients.K, 0)
  expectMeas(t.env.salinityDsM, 0)
  expectMeas(t.env.ph, 7)
  expectMeas(t.env.ec, 0)
})

it('keeps non-measurement fields intact', () => {
  const m = mapStore()
  const t = m.tiles[0][0]
  expect(t.plant).toBeNull()
  expect(t.animal).toBeNull()
  expect(Array.isArray(t.assemblies)).toBe(true)
})
