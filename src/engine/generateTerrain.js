// src/calc/generateTerrain.js
import { mapStore } from '@/stores/map.js'
import eventBus from '@/eventBus.js'

/* ------------------------- PRNG + value noise helpers ------------------------- */

/** Hash a string into a 32‑bit seed function (xmur3 variant). */
function createSeedFromString(str) {
    let h = 1779033703 ^ str.length
    for (let i = 0; i < str.length; i++) {
        h = Math.imul(h ^ str.charCodeAt(i), 3432918353)
        h = (h << 13) | (h >>> 19)
    }
    return () => {
        h = Math.imul(h ^ (h >>> 16), 2246822507)
        h = Math.imul(h ^ (h >>> 13), 3266489909)
        return (h ^= h >>> 16) >>> 0
    }
}

/** Smoothstep interpolation 0..1. */
function interpolateSmoothstep(t) {
    return t * t * (3 - 2 * t)
}

/** Fast integer lattice noise in [0,1). */
function latticeHash2D(ix, iy, seed) {
    const s = (ix * 374761393 + iy * 668265263 + seed) >>> 0
    let t = s + 0x6D2B79F5
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}

/** 2D value noise with bilinear interpolation. */
function valueNoise2D(x, y, frequency, seed) {
    const xf = x * frequency, yf = y * frequency
    const x0 = Math.floor(xf), y0 = Math.floor(yf)
    const tx = xf - x0, ty = yf - y0

    const v00 = latticeHash2D(x0,     y0,     seed)
    const v10 = latticeHash2D(x0 + 1, y0,     seed)
    const v01 = latticeHash2D(x0,     y0 + 1, seed)
    const v11 = latticeHash2D(x0 + 1, y0 + 1, seed)

    const sx = interpolateSmoothstep(tx)
    const sy = interpolateSmoothstep(ty)

    const ix0 = v00 * (1 - sx) + v10 * sx
    const ix1 = v01 * (1 - sx) + v11 * sx
    return ix0 * (1 - sy) + ix1 * sy
}

/** Fractal Brownian Motion using value noise. Returns ~[0,1]. */
function fractalBrownianMotion2D(x, y, seed, octaves = 5, baseFreq = 1.25, lacunarity = 2, gain = 0.5) {
    let amplitude = 1
    let frequency = baseFreq
    let sum = 0
    let norm = 0
    for (let i = 0; i < octaves; i++) {
        sum += amplitude * valueNoise2D(x, y, frequency, seed + i * 1013904223)
        norm += amplitude
        amplitude *= gain
        frequency *= lacunarity
    }
    return sum / Math.max(1e-9, norm)
}

/* ------------------------------ Terrain builder ------------------------------ */

export default function generateTerrain() {
    eventBus.emit('log', { engine: 'simulation', msg: 'Generating terrain' })

    const map = mapStore()
    const tilesGrid = map.tiles
    const rows = tilesGrid.length
    const cols = rows ? tilesGrid[0].length : 0
    if (!rows || !cols) return

    const { elevationRange = [0, 220], cellSize = 100 } = map.topographyConstraints ?? {}

    // Stable-ish per-run seed
    const seedString = `biorome_${Date.now()}_${Math.random()}`
    const seedFn = createSeedFromString(seedString)
    const baseSeed = seedFn()

    // Small utilities
    const toDegrees = (rad) => (rad * 180) / Math.PI
    const clamp01 = (v) => Math.max(0, Math.min(1, v))

    const dxNormalized = cols > 1 ? 1 / (cols - 1) : 1
    const dyNormalized = rows > 1 ? 1 / (rows - 1) : 1
    const [elevMin, elevMax] = elevationRange
    const elevSpan = Math.max(1e-6, elevMax - elevMin)

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const tile = tilesGrid[r][c]

            // Normalized grid coordinates 0..1
            const x = cols > 1 ? c / (cols - 1) : 0
            const y = rows > 1 ? r / (rows - 1) : 0

            /* ----------------------------- Topography fields ----------------------------- */

            // Elevation (m ASL)
            const elevNoise = fractalBrownianMotion2D(x, y, baseSeed, 5, 1.25, 2, 0.5)            // 0..1
            const elevationMeters = +(elevMin + elevNoise * elevSpan).toFixed(2)
            tile.topography.elevation.env = elevationMeters

            // Slope and Aspect by finite differences on the noise field
            const hx = fractalBrownianMotion2D(x + dxNormalized, y, baseSeed) - fractalBrownianMotion2D(x - dxNormalized, y, baseSeed)
            const hy = fractalBrownianMotion2D(x, y + dyNormalized, baseSeed) - fractalBrownianMotion2D(x, y - dyNormalized, baseSeed)
            const dEdx = (hx * elevSpan) / (2 * dxNormalized * cols)
            const dEdy = (hy * elevSpan) / (2 * dyNormalized * rows)

            const slopeRadians = Math.atan(Math.hypot(dEdx, dEdy) / cellSize)
            const slopeDegrees = +Math.min(60, toDegrees(slopeRadians)).toFixed(2)
            tile.topography.slope.env = slopeDegrees

            let aspectDegrees = toDegrees(Math.atan2(dEdy, -dEdx))
            if (aspectDegrees < 0) aspectDegrees += 360
            tile.topography.aspect.env = +aspectDegrees.toFixed(2)

            // Water table as a low‑frequency independent field
            const waterTableNoise = fractalBrownianMotion2D(x + 0.137, y + 0.291, baseSeed + 12345, 4, 0.9, 2, 0.5)
            const waterLevelNorm = clamp01(0.25 + 0.14 * waterTableNoise)
            const waterTableMeters = +(elevMin + waterLevelNorm * elevSpan).toFixed(2)
            tile.topography.waterTable.env = waterTableMeters

            const isSubmerged = elevationMeters <= waterTableMeters

            // Drainage index proxy: better drainage on higher and steeper ground
            const slopeNorm = clamp01(slopeDegrees / 30)
            const elevNorm = clamp01((elevationMeters - elevMin) / elevSpan)
            const wetness = isSubmerged ? 1 : clamp01(0.6 * (1 - slopeNorm) + 0.4 * (1 - elevNorm))
            const drainageIndex = isSubmerged ? 0 : +(1 - wetness).toFixed(2)
            tile.topography.drainageIndex.env = drainageIndex

            /* --------------------------------- Soil base -------------------------------- */

            // Water and temperature
            tile.soil.water.env = isSubmerged ? 100 : Math.round(20 + 60 * wetness)  // %
            tile.soil.soilTemperature.env = 15

            // Salinity, EC, pH, major nutrients
            if (isSubmerged) {
                tile.soil.N.env = 0
                tile.soil.P.env = 0
                tile.soil.K.env = 0
                tile.soil.salinity.env = 0.2
                tile.soil.ec.env = 0.05
                tile.soil.ph.env = 7.0
            } else {
                const nitrateN = Math.round(10 + 50 * wetness)
                const phosphateP = Math.round(8 + 35 * (0.6 * wetness + 0.4 * drainageIndex))
                const potassiumK = Math.round(8 + 35 * (0.5 * wetness + 0.5 * drainageIndex))
                tile.soil.N.env = nitrateN
                tile.soil.P.env = phosphateP
                tile.soil.K.env = potassiumK
                tile.soil.salinity.env = +(0.1 + 1.5 * Math.max(0, wetness - 0.7)).toFixed(2)
                tile.soil.ec.env = +(0.5 + 2.0 * wetness).toFixed(2)
                tile.soil.ph.env = +(6.2 + 0.8 * (1 - wetness)).toFixed(2)
            }

            // CEC and organic carbon
            tile.soil.cec.env = isSubmerged ? 5 : Math.round(8 + 6 * (1 - drainageIndex))               // 8–14
            tile.soil.organicCarbon.env = isSubmerged ? 1.5 : +(1.5 + 1.2 * wetness).toFixed(2)         // 1.5–2.7 %

            // Additional nitrogen forms
            {
                const nForm1 = fractalBrownianMotion2D(x + 0.33, y + 0.71, baseSeed + 777)
                const nForm2 = fractalBrownianMotion2D(x + 0.81, y + 0.19, baseSeed + 778)
                tile.soil.NH4.env = isSubmerged ? 0 : Math.round(1 + 4 * nForm1)   // 1–5 mg/kg
                tile.soil.DON.env = isSubmerged ? 0 : Math.round(1 + 5 * nForm2)   // 1–6 mg/kg
            }

            // Heavy metals: very small amounts, slightly higher with poor drainage
            {
                const m1 = fractalBrownianMotion2D(x + 0.12, y + 0.45, baseSeed + 910)
                const m2 = fractalBrownianMotion2D(x + 0.27, y + 0.63, baseSeed + 911)
                const m3 = fractalBrownianMotion2D(x + 0.49, y + 0.82, baseSeed + 912)
                const metalScale = 0.05 + 0.25 * (1 - drainageIndex)               // 0.05–0.30 baseline
                tile.soil.Cd.env = +(metalScale * m1).toFixed(3)                    // 0.000–0.300 mg/kg
                tile.soil.Pb.env = +(metalScale * 3 * m2).toFixed(2)                // 0.00–0.90 mg/kg
                tile.soil.As.env = +(metalScale * 2 * m3).toFixed(3)                // 0.000–0.600 mg/kg
            }

            // Soil physics
            {
                const p1 = fractalBrownianMotion2D(x + 0.15, y + 0.35, baseSeed + 600)
                const p2 = fractalBrownianMotion2D(x + 0.25, y + 0.55, baseSeed + 601)
                const p3 = fractalBrownianMotion2D(x + 0.65, y + 0.75, baseSeed + 602)
                const p4 = fractalBrownianMotion2D(x + 0.85, y + 0.15, baseSeed + 603)

                tile.soil.infiltrationRate.env      = Math.round(10 + 40 * (1 - slopeNorm) * p1)   // 10–50 mm/hr
                tile.soil.bulkDensity.env           = +(1.10 + 0.50 * (1 - wetness) * p2).toFixed(2) // 1.10–1.60 g/cm3
                tile.soil.penetrationResistance.env = +(0.30 + 1.50 * (1 - wetness) * p3).toFixed(2) // 0.30–1.80 MPa
                tile.soil.aggregateStability.env    = Math.round(35 + 50 * wetness * p4)           // 35–85 %
                tile.soil.hydraulicConductivity.env = Math.round(5 + 25 * (1 - slopeNorm) * p1)    // 5–30 mm/hr
            }

            // Biological indicators
            {
                const b1 = fractalBrownianMotion2D(x + 0.07, y + 0.91, baseSeed + 700)
                const b2 = fractalBrownianMotion2D(x + 0.41, y + 0.29, baseSeed + 701)
                const b3 = fractalBrownianMotion2D(x + 0.53, y + 0.67, baseSeed + 702)

                tile.soil.microbialCFU_good.env       = Math.round(100 + 900 * wetness * b1)              // 100–1000 CFU/g
                tile.soil.microbialCFU_bad.env        = Math.round(10 + 90 * (1 - drainageIndex) * b2)    // 10–100 CFU/g
                tile.soil.mycorrhizalColonization.env = Math.round(5 + 35 * wetness * b3)                 // 5–40 %
                tile.soil.earthwormCount.env          = Math.round(5 + 25 * wetness * b1)                 // 5–30 /m2
            }
        }
    }

    eventBus.emit('log', { engine: 'simulation', msg: 'Terrain Done' })
}
