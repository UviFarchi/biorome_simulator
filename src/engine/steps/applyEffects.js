import { mapStore } from '@/stores/map.js'
import animalEffects     from '@/engine/effects/animal.js'
import assemblyEffects   from '@/engine/effects/assembly.js'
import plantEffects      from '@/engine/effects/plant.js'
import resourceEffects   from '@/engine/effects/resource.js'
import soilEffects       from '@/engine/effects/soil.js'
import topographyEffects from '@/engine/effects/topography.js'
import weatherEffects    from '@/engine/effects/weather.js'

export function applyEffects() {
    const map = mapStore()

    // catalogs
    const FX = {
        weather:    weatherEffects,
        topography: topographyEffects,
        soil:       soilEffects,
        resources:  resourceEffects,
        animals:    animalEffects,
        plants:     plantEffects,
        assemblies: assemblyEffects,
    }

    // categories
    const GLOBAL_CATS  = ['weather','topography','soil','resources'] // no subjects
    const SUBJECT_CATS = ['assemblies','animals','plants']           // orders or tile entities

    // precompute global keys once
    const FX_KEYS = {
        weather:    Object.keys(FX.weather),
        topography: Object.keys(FX.topography),
        soil:       Object.keys(FX.soil),
        resources:  Object.keys(FX.resources),
    }

    const addEnv = (group, prop, d) => {
        const slot = group?.[prop]
        if (slot && typeof slot === 'object' && 'env' in slot) slot.env += d
    }

    map.$patch(() => {
        const grid = map.tiles // matrix
        const rows = grid.length
        for (let r = 0; r < rows; r++) {
            const row = grid[r]
            const cols = row.length
            for (let c = 0; c < cols; c++) {
                const t = row[c]
                const animals = t.animals ?? []
                const animalsLen = animals.length
                const plants = t.plants ?? []
                const plantsLen = plants.length

                // ---------- GLOBAL CATEGORIES (single pass each) ----------
                // weather
                for (let i = 0; i < FX_KEYS.weather.length; i++) {
                    const key = FX_KEYS.weather[i]
                    const list = FX.weather[key]
                    for (let j = 0; j < list.length; j++) {
                        const eff = list[j]
                        const d = (typeof eff.delta === 'function')
                            ? eff.delta({ tile: t, subject: null, key, category: 'weather' })
                            : eff.delta
                        addEnv(t[eff.target], eff.property, d)
                    }
                }
                // topography
                for (let i = 0; i < FX_KEYS.topography.length; i++) {
                    const key = FX_KEYS.topography[i]
                    const list = FX.topography[key]
                    for (let j = 0; j < list.length; j++) {
                        const eff = list[j]
                        const d = (typeof eff.delta === 'function')
                            ? eff.delta({ tile: t, subject: null, key, category: 'topography' })
                            : eff.delta
                        addEnv(t[eff.target], eff.property, d)
                    }
                }
                // soil
                for (let i = 0; i < FX_KEYS.soil.length; i++) {
                    const key = FX_KEYS.soil[i]
                    const list = FX.soil[key]
                    for (let j = 0; j < list.length; j++) {
                        const eff = list[j]
                        const d = (typeof eff.delta === 'function')
                            ? eff.delta({ tile: t, subject: null, key, category: 'soil' })
                            : eff.delta
                        addEnv(t[eff.target], eff.property, d)
                    }
                }
                // resources
                for (let i = 0; i < FX_KEYS.resources.length; i++) {
                    const key = FX_KEYS.resources[i]
                    const list = FX.resources[key]
                    for (let j = 0; j < list.length; j++) {
                        const eff = list[j]
                        const d = (typeof eff.delta === 'function')
                            ? eff.delta({ tile: t, subject: null, key, category: 'resources' })
                            : eff.delta
                        addEnv(t[eff.target], eff.property, d)
                    }
                }

                // ---------- SUBJECT CATEGORIES (skip if empty) ----------
                // assemblies -> orders flattened
                const orders = Array.isArray(t.assemblies)
                    ? t.assemblies.flatMap(a => Array.isArray(a.orders) ? a.orders : [])
                    : []

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
            }
        }
    })
}
