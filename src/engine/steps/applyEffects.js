// src/engine/steps/applyEffects.js
import { mapStore } from '@/stores/map.js'
import animalEffects    from '@/engine/effects/animal.js'
import assemblyEffects  from '@/engine/effects/assembly.js'
import plantEffects     from '@/engine/effects/plant.js'
import resourceEffects  from '@/engine/effects/resource.js'
import soilEffects      from '@/engine/effects/soil.js'
import topographyEffects from '@/engine/effects/topography.js'
import weatherEffects   from '@/engine/effects/weather.js'

export const FX = {
    animals:    animalEffects,
    assemblies: assemblyEffects,
    plants:     plantEffects,
    resources:  resourceEffects,
    soil:       soilEffects,
    topography: topographyEffects,
    weather:    weatherEffects
}

// execution order
export const ORDER = ['weather','assemblies','topography','soil','animals','plants','resources']

// precompute weather entries once since they never change per tile
const WEATHER_ENTRIES = []
for (const key in FX.weather) {
    WEATHER_ENTRIES.push({ key, subject: null })
}

export function applyEffects () {
    const map = mapStore()

    ////console.log('[applyEffects] start')

    const newTiles = map.tiles.map((row, r) =>
        row.map((tile, c) => {
            const t0 = performance.now?.() ?? Date.now()
            ////console.log(`[applyEffects] tile ${r},${c} — prepare`)

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

            //console.log(`[applyEffects] tile ${r},${c} — queues`,
                // Object.fromEntries(Object.entries(prepared).map(([k,v]) => [k, v.length])))

            // --- working copy (only the parts we’ll mutate) ---
            const working = {
                row: tile.row, col: tile.col,
                soil:       { ...tile.soil },
                topography: { ...tile.topography },
                resources:  { ...tile.resources },
                plants:     (tile.plants  || []).map(p => ({ ...p })),
                animals:    (tile.animals || []).map(a => ({ ...a })),
                _fxCache:   cache
            }
            // update references so future runs know if sources changed
            cache.topographyRef = working.topography
            cache.soilRef = working.soil
            cache.resourcesRef = working.resources

            // helper: apply to tile-level groups
            const bumpGroup = (groupName, prop, delta) => {
                const grp = working[groupName]
                if (grp?.[prop]?.env !== undefined) {
                    grp[prop].env += delta
                    return true
                }
                return false
            }

            // --- run categories in order
            for (const category of ORDER) {
                const entries = prepared[category] || []
                const catalog = FX[category]
                if (!catalog || entries.length === 0) {
                    //console.log(`[applyEffects] tile ${r},${c} — skip ${category} (no entries)`)
                    continue
                }

                //console.log(`[applyEffects] tile ${r},${c} — ${category} (${entries.length} keys)`)

                for (const { key, subject } of entries) {
                    const effectList = catalog[key]
                    if (!Array.isArray(effectList) || effectList.length === 0) {
                        // no effects defined for this key on this tile
                        continue
                    }

                    // optional: log once per key
                    // //console.log(`[applyEffects] tile ${r},${c} — ${category}:${key} (${effectList.length} effects)`)

                    for (const eff of effectList) {
                        // compute delta now (supports number or function)
                        const delta = (typeof eff.delta === 'function')
                            ? eff.delta({ tile: working, subject, key, category })
                            : eff.delta

                        // subject-aware targets
                        if (eff.target === 'animals') {
                            const targets = subject ? [subject] : working.animals
                            for (const a of targets) {
                                if (a?.[eff.property]?.env === undefined) continue
                                a[eff.property].env = (a[eff.property].env ?? 0) + delta
                            }
                            continue
                        }

                        if (eff.target === 'plants') {
                            const targets = subject ? [subject] : working.plants
                            for (const p of targets) {
                                if (p?.[eff.property]?.env === undefined) continue
                                p[eff.property].env = (p[eff.property].env ?? 0) + delta
                            }
                            continue
                        }

                        // tile-level targets
                        bumpGroup(eff.target, eff.property, delta)
                    }
                }

                //console.log(`[applyEffects] tile ${r},${c} — done ${category}`)
            }

            const dt = (performance.now?.() ?? Date.now()) - t0
            //console.log(`[applyEffects] tile ${r},${c} — complete in ${dt.toFixed(2)}ms`)

            return working
        })
    )

    // single assignment for reactivity
    map.tiles.value = newTiles

    //console.log('[applyEffects] end')
}
