import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { mapStore } from '@/stores/map.js'
import generateTerrain from '@/calc/generateTerrain.js'

function pickSample(m) {
  // grab a couple of deterministic positions
  const t00 = m.tiles[0][0]
  const tMid = m.tiles[Math.floor(m.tiles.length / 2)][Math.floor(m.tiles[0].length / 2)]
  return { t00, tMid }
}

describe('generateTerrain', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
  })

  it('writes terrain into the map store in place and within bounds', () => {
    const m = mapStore()
    // supply bounds so we can assert ranges deterministically
    m.topographyConstraints = { elevationRange: [10, 50], cellSize: 50 }
    generateTerrain()

    const { t00, tMid } = pickSample(m)
    // elevation range
    expect(t00.topo.elevation.env).toBeGreaterThanOrEqual(10)
    expect(t00.topo.elevation.env).toBeLessThanOrEqual(50)
    expect(tMid.topo.elevation.env).toBeGreaterThanOrEqual(10)
    expect(tMid.topo.elevation.env).toBeLessThanOrEqual(50)

    // slope and aspect ranges
    expect(t00.topo.slopeDeg.env).toBeGreaterThanOrEqual(0)
    expect(t00.topo.slopeDeg.env).toBeLessThanOrEqual(60)
    expect(t00.topo.aspectDeg.env).toBeGreaterThanOrEqual(0)
    expect(t00.topo.aspectDeg.env).toBeLessThanOrEqual(360)

    // atmosphere present
    expect(typeof t00.atmosphere.tempC.env).toBe('number')
    expect(typeof t00.atmosphere.moisturePct.env).toBe('number')

    // soil present and consistent with atmosphere
    expect(t00.soil.water.env).toBe(t00.atmosphere.moisturePct.env)

    // nutrients populated
    expect(typeof t00.soil.nutrients.N.env).toBe('number')
    expect(typeof t00.soil.nutrients.P.env).toBe('number')
    expect(typeof t00.soil.nutrients.K.env).toBe('number')

    // derived indices in sane ranges
    expect(t00.soil.compaction.env).toBeGreaterThanOrEqual(0)
    expect(t00.soil.compaction.env).toBeLessThanOrEqual(100)
    // fertility exists in schema and is set 0..100
    expect(t00.soil.fertility.env).toBeGreaterThanOrEqual(0)
    expect(t00.soil.fertility.env).toBeLessThanOrEqual(100)
  })

  it('sets temperature as a function of elevation (lapse rate) and leaves measured fields untouched', () => {
    const m = mapStore()
    m.topographyConstraints = { elevationRange: [5, 80], cellSize: 100 }
    generateTerrain()

    // scan for a few tiles, validate the formula T = 24 - 0.0065 * elevation (rounded to 0.1)
    for (let r = 0; r < m.tiles.length; r++) {
      for (let c = 0; c < m.tiles[0].length; c++) {
        const t = m.tiles[r][c]
        const elev = t.topo.elevation.env
        const expectedT = +(24 - 0.0065 * elev).toFixed(1)
        expect(t.atmosphere.tempC.env).toBe(expectedT)

        // measured.* remains undefined; generator only sets .env
        expect(t.topo.elevation.measured.value).toBeUndefined()
        expect(t.soil.ph.measured.value).toBeUndefined()
        expect(t.atmosphere.tempC.measured?.value).toBeUndefined()
      }
    }
  })
})
