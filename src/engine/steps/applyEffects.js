import animalEffects     from '@/engine/effects/animal.js'
import assemblyEffects   from '@/engine/effects/assembly.js'
import plantEffects      from '@/engine/effects/plant.js'
import resourceEffects   from '@/engine/effects/resource.js'
import soilEffects       from '@/engine/effects/soil.js'
import topographyEffects from '@/engine/effects/topography.js'
import weatherEffects    from '@/engine/effects/weather.js'

// effect catalogs shared by main thread and workers
const FX = {
    weather:    weatherEffects,
    topography: topographyEffects,
    soil:       soilEffects,
    resources:  resourceEffects,
    animals:    animalEffects,
    plants:     plantEffects,
    assemblies: assemblyEffects,
}

// categories with no subjects
const GLOBAL_CATS = ['weather', 'topography', 'soil', 'resources']

// precompute global keys once
const FX_KEYS = {
    weather:    Object.keys(FX.weather),
    topography: Object.keys(FX.topography),
    soil:       Object.keys(FX.soil),
    resources:  Object.keys(FX.resources),
}

const GLOBAL_CACHE = GLOBAL_CATS.map(cat => ({
    cat,
    keys: FX_KEYS[cat],
    fx:   FX[cat],
}))

const addEnv = (group, prop, d) => {
    const slot = group?.[prop]
    if (slot && typeof slot === 'object' && 'env' in slot) slot.env += d
}

const iterCategory = (cat, fxCat, keys, tile) => {
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i]
        const list = fxCat[key]
        for (let j = 0; j < list.length; j++) {
            const eff = list[j]
            const d = (typeof eff.delta === 'function')
                ? eff.delta({ tile, subject: null, key, category: cat })
                : eff.delta
            addEnv(tile[eff.target], eff.property, d)
        }
    }
}

/**
 * Apply environment effects to a single tile.
 * Mutates and returns the provided tile.
 */
export function processTile(t) {
    const animals = t.animals ?? []
    const animalsLen = animals.length
    const plants = t.plants ?? []
    const plantsLen = plants.length

    // ---------- GLOBAL CATEGORIES (single pass each) ----------
    for (let g = 0; g < GLOBAL_CACHE.length; g++) {
        const { cat, fx, keys } = GLOBAL_CACHE[g]
        iterCategory(cat, fx, keys, t)
    }

    // ---------- SUBJECT CATEGORIES (skip if empty) ----------
    // assemblies -> orders flattened using reusable buffer
    const orders = []
    if (t.assemblies?.length) {
        for (let a = 0; a < t.assemblies.length; a++) {
            const assembly = t.assemblies[a]
            const list = Array.isArray(assembly.orders) ? assembly.orders : null
            if (list) {
                for (let o = 0; o < list.length; o++) orders.push(list[o])
            }
        }
    }

    if (orders.length) {
        for (let k = 0; k < orders.length; k++) {
            const key = orders[k]
            const list = FX.assemblies[key]
            if (!Array.isArray(list)) continue
            for (let j = 0; j < list.length; j++) {
                const eff = list[j]
                const d = (typeof eff.delta === 'function')
                    ? eff.delta({ tile: t, subject: null, key, category: 'assemblies' })
                    : eff.delta
                addEnv(t[eff.target], eff.property, d)
            }
        }
    }

    // animals
    if (animalsLen) {
        for (let a = 0; a < animalsLen; a++) {
            const subject = animals[a]
            const list = FX.animals[subject.type]
            if (!Array.isArray(list)) continue
            for (let j = 0; j < list.length; j++) {
                const eff = list[j]
                const d = (typeof eff.delta === 'function')
                    ? eff.delta({ tile: t, subject, key: subject.type, category: 'animals' })
                    : eff.delta
                if (eff.target === 'animals') {
                    const slot = subject[eff.property]
                    if (slot && typeof slot === 'object' && 'env' in slot) slot.env += d
                } else if (eff.target === 'plants') {
                    for (let p = 0; p < plantsLen; p++) addEnv(plants[p], eff.property, d)
                } else {
                    addEnv(t[eff.target], eff.property, d)
                }
            }
        }
    }

    // plants
    if (plantsLen) {
        for (let p = 0; p < plantsLen; p++) {
            const subject = plants[p]
            const list = FX.plants[subject.type]
            if (!Array.isArray(list)) continue
            for (let j = 0; j < list.length; j++) {
                const eff = list[j]
                const d = (typeof eff.delta === 'function')
                    ? eff.delta({ tile: t, subject, key: subject.type, category: 'plants' })
                    : eff.delta
                if (eff.target === 'plants') {
                    const slot = subject[eff.property]
                    if (slot && typeof slot === 'object' && 'env' in slot) slot.env += d
                } else if (eff.target === 'animals') {
                    for (let a = 0; a < animalsLen; a++) addEnv(animals[a], eff.property, d)
                } else {
                    addEnv(t[eff.target], eff.property, d)
                }
            }
        }
    }

    return t
}

// clone helper for structured cloning in browsers / node
const clone = obj => (typeof structuredClone === 'function')
    ? structuredClone(obj)
    : JSON.parse(JSON.stringify(obj))

export async function applyEffects() {
    const { mapStore } = await import('@/stores/map.js')
    const map = mapStore()
    const grid = map.tiles // matrix

    const workerCount = navigator?.hardwareConcurrency || 4
    const sliceSize = Math.ceil(grid.length / workerCount)

    const workers = []
    const promises = []

    for (let i = 0; i < workerCount; i++) {
        const start = i * sliceSize
        if (start >= grid.length) break
        const end = Math.min(start + sliceSize, grid.length)
        const rows = []
        for (let r = start; r < end; r++) rows.push(clone(grid[r]))

        const worker = new Worker(new URL('../workers/applyEffectsWorker.js', import.meta.url), { type: 'module' })
        workers.push(worker)
        promises.push(new Promise(resolve => {
            worker.onmessage = e => resolve({ start, tiles: e.data })
        }))
        worker.postMessage(rows)
    }

    const results = await Promise.all(promises)
    workers.forEach(w => w.terminate())

    map.$patch(() => {
        for (const { start, tiles } of results) {
            for (let r = 0; r < tiles.length; r++) {
                const row = tiles[r]
                const mapRow = grid[start + r]
                for (let c = 0; c < row.length; c++) {
                    Object.assign(mapRow[c], row[c])
                }
            }
        }
    })
}

