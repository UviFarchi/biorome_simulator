// src/engine/workers/effectWorkers.js
// Worker that applies effects per tile. Imports FX catalogs locally.
// Logs key stages for debugging.

import animalEffects     from '@/engine/effects/animalEffects.js'
import assemblyEffects   from '@/engine/effects/assemblyEffects.js'
import plantEffects      from '@/engine/effects/plantEffects.js'
import resourceEffects   from '@/engine/effects/resourceEffects.js'
import soilEffects       from '@/engine/effects/soilEffects.js'
import topographyEffects from '@/engine/effects/topographyEffects.js'
import weatherEffects    from '@/engine/effects/weatherEffects.js'

const EFFECT_CATALOGS = {
    animals:    animalEffects,
    assemblies: assemblyEffects,
    plants:     plantEffects,
    resources:  resourceEffects,
    soil:       soilEffects,
    topography: topographyEffects,
    weather:    weatherEffects
}

const EXECUTION_ORDER = ['weather','assemblies','topography','soil','animals','plants','resources']

self.onmessage = (event) => {
    const tiles = event.data.tiles
    // Process tiles in the order received
    const t0 = performance.now?.() ?? Date.now()
    const processed = tiles.map(applyEffectsToTile)
    const dt = (performance.now?.() ?? Date.now()) - t0
    // Aggregated log to avoid noise
    self.postMessage(processed)
}

/** Core per-tile logic. Mirrors the original single-thread function. */
function applyEffectsToTile(tile) {
    // Prepare queues
    const preparedQueues = {
        animals:    (tile.animals  || []).map(a => ({ key: a.type,  subject: a })),
        plants:     (tile.plants   || []).map(p => ({ key: p.type,  subject: p })),
        assemblies: (Array.isArray(tile.assemblies)
            ? tile.assemblies.flatMap(a => Array.isArray(a.orders) ? a.orders : [])
            : []).map(order => ({ key: order, subject: null })),
        weather:    Object.keys(EFFECT_CATALOGS.weather || {}).map(k => ({ key: k, subject: null })),
        topography: Object.keys(tile.topography || {}).filter(k => EFFECT_CATALOGS.topography?.[k]).map(k => ({ key: k, subject: null })),
        soil:       Object.keys(tile.soil || {}).filter(k => EFFECT_CATALOGS.soil?.[k]).map(k => ({ key: k, subject: null })),
        resources:  Object.keys(tile.resources || {}).filter(k => EFFECT_CATALOGS.resources?.[k]).map(k => ({ key: k, subject: null })),
    }

    // Working copy limited to mutating groups
    const working = {
        row: tile.row, col: tile.col,
        soil:       { ...tile.soil },
        topography: { ...tile.topography },
        resources:  { ...tile.resources },
        plants:     (tile.plants  || []).map(p => ({ ...p })),
        animals:    (tile.animals || []).map(a => ({ ...a })),
        assemblies: Array.isArray(tile.assemblies) ? tile.assemblies.map(a => ({...a, orders: Array.isArray(a.orders) ? [...a.orders] : []})) : [],
    }

    const bumpGroup = (groupName, prop, delta) => {
        const groupRef = working[groupName]
        if (groupRef?.[prop]?.env !== undefined) {
            groupRef[prop].env = (groupRef[prop].env ?? 0) + delta
        }
    }

    for (const category of EXECUTION_ORDER) {
        const entries = preparedQueues[category] || []
        const catalog = EFFECT_CATALOGS[category]
        if (!catalog || entries.length === 0) continue

        for (const { key, subject } of entries) {
            const effectList = catalog[key]
            if (!Array.isArray(effectList) || effectList.length === 0) continue

            for (const effect of effectList) {
                const delta = (typeof effect.delta === 'function')
                    ? effect.delta({ tile: working, subject, key, category })
                    : effect.delta

                if (effect.target === 'animals') {
                    const targets = subject ? [subject] : working.animals
                    for (const animal of targets) {
                        if (animal?.[effect.property]?.env === undefined) continue
                        animal[effect.property].env = (animal[effect.property].env ?? 0) + delta
                    }
                    continue
                }

                if (effect.target === 'plants') {
                    const targets = subject ? [subject] : working.plants
                    for (const plant of targets) {
                        if (plant?.[effect.property]?.env === undefined) continue
                        plant[effect.property].env = (plant[effect.property].env ?? 0) + delta
                    }
                    continue
                }

                bumpGroup(effect.target, effect.property, delta)
            }
        }
    }

    return working
}
