// src/engine/steps/applyEffects.js
import { mapStore } from '@/stores/map.js'
import animalEffects from '@/engine/effects/animal.js'
import assemblyEffects from '@/engine/effects/assembly.js'
import plantEffects from '@/engine/effects/plant.js'
import resourceEffects from '@/engine/effects/resource.js'
import soilEffects from '@/engine/effects/soil.js'
import topographyEffects from '@/engine/effects/topography.js'
import weatherEffects from '@/engine/effects/weather.js'


// Catalog of all effect groups
export const FX = {
    animals: animalEffects,
    assemblies: assemblyEffects,
    plants: plantEffects,
    resources: resourceEffects,
    soil: soilEffects,
    topography: topographyEffects,
    weather: weatherEffects
}

// execution order

export const ORDER = ['weather', 'assemblies', 'topography', 'soil', 'animals', 'plants', 'resources']

// precompute weather entries once since they never change per tile
const WEATHER_ENTRIES = []
for (const key in FX.weather) {
    WEATHER_ENTRIES.push({ key, subject: null })
}

/**
 * Apply all effects to a single tile in place.
 * This mutates the tile directly rather than returning a new object.
 */
export function processTile (tile) {
    const t0 = performance.now?.() ?? Date.now()

    // per-tile cache for effect key arrays
    const cache = tile._fxCache || (tile._fxCache = {
        animals: [],
        plants: [],
        assemblies: [],
        weather: WEATHER_ENTRIES,
        topography: [],
        soil: [],
        resources: [],
        topographyRef: null,
        soilRef: null,
        resourcesRef: null,
        prepared: null
    })

    // rebuild cached keys only if the tile's data reference changed
    if (cache.topographyRef !== tile.topography) {
        cache.topography.length = 0
        for (const k in tile.topography || {}) {
            if (FX.topography?.[k]) cache.topography.push({ key: k, subject: null })
        }
        cache.topographyRef = tile.topography
    }
    if (cache.soilRef !== tile.soil) {
        cache.soil.length = 0
        for (const k in tile.soil || {}) {
            if (FX.soil?.[k]) cache.soil.push({ key: k, subject: null })
        }
        cache.soilRef = tile.soil
    }
    if (cache.resourcesRef !== tile.resources) {
        cache.resources.length = 0
        for (const k in tile.resources || {}) {
            if (FX.resources?.[k]) cache.resources.push({ key: k, subject: null })
        }
        cache.resourcesRef = tile.resources
    }

    // subjects: pair the effect key with the instance that triggered it
    const animals = cache.animals
    animals.length = 0
    if (Array.isArray(tile.animals)) {
        for (const a of tile.animals) {
            animals.push({ key: a.type, subject: a })
        }
    }

    const plants = cache.plants
    plants.length = 0
    if (Array.isArray(tile.plants)) {
        for (const p of tile.plants) {
            plants.push({ key: p.type, subject: p })
        }
    }

    const assemblies = cache.assemblies
    assemblies.length = 0
    if (Array.isArray(tile.assemblies)) {
        for (const a of tile.assemblies) {
            if (!Array.isArray(a.orders)) continue
            for (const order of a.orders) {
                assemblies.push({ key: order, subject: null })
            }
        }
    }

    const prepared = cache.prepared || (cache.prepared = {
        animals,
        plants,
        assemblies,
        weather: cache.weather,
        topography: cache.topography,
        soil: cache.soil,
        resources: cache.resources
    })

    // helper: apply to tile-level groups
    const bumpGroup = (groupName, prop, delta) => {
        const grp = tile[groupName]
        if (grp?.[prop]?.env !== undefined) {
            grp[prop].env += delta
            return true
        }
        return false
    }

    // --- run categories in order ---
    for (const category of ORDER) {
        const entries = prepared[category] || []
        const catalog = FX[category]
        if (!catalog || entries.length === 0) {
            continue
        }

        for (const { key, subject } of entries) {
            const effectList = catalog[key]
            if (!Array.isArray(effectList) || effectList.length === 0) {
                continue
            }

            for (const eff of effectList) {
                const delta = (typeof eff.delta === 'function')
                    ? eff.delta({ tile, subject, key, category })
                    : eff.delta

                // subject-aware targets
                if (eff.target === 'animals') {
                    const targets = subject ? [subject] : tile.animals
                    if (Array.isArray(targets)) {
                        for (const a of targets) {
                            if (a?.[eff.property]?.env === undefined) continue
                            a[eff.property].env = (a[eff.property].env ?? 0) + delta
                        }
                    }
                    continue
                }

                if (eff.target === 'plants') {
                    const targets = subject ? [subject] : tile.plants
                    if (Array.isArray(targets)) {
                        for (const p of targets) {
                            if (p?.[eff.property]?.env === undefined) continue
                            p[eff.property].env = (p[eff.property].env ?? 0) + delta
                        }
                    }
                    continue
                }

                // tile-level targets
                bumpGroup(eff.target, eff.property, delta)
            }
        }
    }

    const dt = (performance.now?.() ?? Date.now()) - t0
    //console.log(`[applyEffects] tile ${tile.row},${tile.col} — complete in ${dt.toFixed(2)}ms`)

    return tile
}

// Iterate over the map and apply effects to every tile in place
export function applyEffects () {
    const map = mapStore()
    const tiles = map.tiles

    for (let r = 0; r < tiles.length; r++) {
        const row = tiles[r]
        for (let c = 0; c < row.length; c++) {
            processTile(row[c])
        }
    }
}

