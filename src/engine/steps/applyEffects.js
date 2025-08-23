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

export function applyEffects () {
    const map = mapStore()

    ////console.log('[applyEffects] start')

    const newTiles = map.tiles.map((row, r) =>
        row.map((tile, c) => {
            const t0 = performance.now?.() ?? Date.now()
            ////console.log(`[applyEffects] tile ${r},${c} — prepare`)

            // --- prepare queues (just keys present on the tile or always-on like weather) ---
            const prepared = {
                // subjects: pair the effect "key" with the instance that triggered it
                animals:    (tile.animals  || []).map(a => ({ key: a.type,  subject: a })),
                plants:     (tile.plants   || []).map(p => ({ key: p.type,  subject: p })),
                assemblies: (Array.isArray(tile.assemblies)
                    ? tile.assemblies.flatMap(a => Array.isArray(a.orders) ? a.orders : [])
                    : []).map(order => ({ key: order, subject: null })),

                // globals: derive keys from the tile’s available properties so we don’t loop unused FX keys
                weather:    Object.keys(FX.weather || {}).map(k => ({ key: k, subject: null })),
                topography: Object.keys(tile.topography || {}).filter(k => FX.topography?.[k])
                    .map(k => ({ key: k, subject: null })),
                soil:       Object.keys(tile.soil || {}).filter(k => FX.soil?.[k])
                    .map(k => ({ key: k, subject: null })),
                resources:  Object.keys(tile.resources || {}).filter(k => FX.resources?.[k])
                    .map(k => ({ key: k, subject: null })),
            }

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
            }

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
