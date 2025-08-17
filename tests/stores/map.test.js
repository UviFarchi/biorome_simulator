// tests/stores/map.test.js
import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { mapStore } from '@/stores/map.js'
function expectTile(tile, r, c) {
  expect(tile.row).toBe(r)
  expect(tile.col).toBe(c)
}

describe('map store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('initializes with a square grid sized by difficulty (default 6x6)', () => {
    const m = mapStore() // game.difficulty defaults to 1
    expect(Array.isArray(m.tiles)).toBe(true)
    expect(m.tiles.length).toBe(6)                    // rows
    expect(m.tiles.every(row => Array.isArray(row) && row.length === 6)).toBe(true) // cols
    expectTile(m.tiles[0][0], 0, 0)
    expectTile(m.tiles[5][5], 5, 5)
  })

  it('exposes gate and selectedTile with correct defaults', () => {
    const m = mapStore();
    expect(m.gate).toEqual({ animals: [], plants: [], extras: [] });
    expect(typeof m.selectedTile).toBe('object');
    expect(Object.keys(m.selectedTile).length).toBe(0);
  }); // 
});

it('initializes measurement-shaped fields for topo, soil, and atmosphere', () => {
  const m = mapStore()
  const t = m.tiles[0][0]

  const expectMeasWithDate = (field, envVal) => {
    expect(field).toEqual({ env: envVal, measured: { value: undefined, date: undefined } })
  }

  // topo
  expectMeasWithDate(t.topo.elevation, 0)
  expectMeasWithDate(t.topo.slopeDeg, 0)
  expectMeasWithDate(t.topo.aspectDeg, 0)
  expectMeasWithDate(t.topo.waterTable, 0)
  expectMeasWithDate(t.topo.drainageIndex, 0)

  // soil
  expectMeasWithDate(t.soil.health, 100)
  expectMeasWithDate(t.soil.water, 0)
  expectMeasWithDate(t.soil.fertility, 0)
  expectMeasWithDate(t.soil.nutrients.N, 0)
  expectMeasWithDate(t.soil.nutrients.P, 0)
  expectMeasWithDate(t.soil.nutrients.K, 0)
  expectMeasWithDate(t.soil.salinityDsM, 0)
  expectMeasWithDate(t.soil.recoveryRate, 5)
  expectMeasWithDate(t.soil.compaction, 0)
  expectMeasWithDate(t.soil.ph, 7)
  expectMeasWithDate(t.soil.ec, 0)

  // atmosphere
  expectMeasWithDate(t.atmosphere.moisturePct, 0)
  expectMeasWithDate(t.atmosphere.tempC, 0)
})

it('keeps non-measurement fields intact', () => {
  const m = mapStore()
  const t = m.tiles[0][0]
  expect(t.plant).toBeNull()
  expect(t.animal).toBeNull()
  expect(Array.isArray(t.assemblies)).toBe(true)
})
