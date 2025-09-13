// src/engine/steps/applyEffects.js
// Parallel applyEffects with a worker pool. Preserves per-tile order.

import {mapStore} from '@/stores/map.js'

// Effects catalogs (sync imports; no requireLike)
import animalEffects from '@/engine/effects/animalEffects.js'
import assemblyEffects from '@/engine/effects/assemblyEffects.js'
import plantEffects from '@/engine/effects/plantEffects.js'
import resourceEffects from '@/engine/effects/resourceEffects.js'
import soilEffects from '@/engine/effects/soilEffects.js'
import topographyEffects from '@/engine/effects/topographyEffects.js'
import weatherEffects from '@/engine/effects/weatherEffects.js'

import {roundN} from "@/utils/formatting.js";

const MAX_WORKERS = Math.min(4, navigator.hardwareConcurrency || 4)

const createWorker = () =>
    new Worker(new URL('../workers/effectWorkers.js', import.meta.url), {type: 'module'})


export async function applyEffects() {
    const map = mapStore()
    const tiles2D = Array.isArray(map.tiles) ? map.tiles : map.tiles?.value
    if (!Array.isArray(tiles2D) || !tiles2D.length) return

    const height = tiles2D.length
    const width = tiles2D[0]?.length ?? 0
    if (!width) return

    const flatTiles = tiles2D.flat()
    const payload = flatTiles.map(safeTileSnapshot)

    const workerCount = Math.min(MAX_WORKERS, payload.length) || 1
    const chunks = chunkArray(payload, workerCount)
    const workerPool = chunks.map(createWorker)

    try {
        const jobs = chunks.map((chunk, idx) =>
            new Promise((resolve, reject) => {
                const worker = workerPool[idx]
                worker.onmessage = (e) => {
                    resolve(e.data);
                    worker.terminate()
                }
                worker.onerror = (err) => {
                    reject(err);
                    worker.terminate()
                }
                worker.postMessage({tiles: chunk})
            })
        )

        const processedChunks = await Promise.all(jobs)
        const processedFlat = processedChunks.flat()

        const newTiles2D = tiles2D.map((row, r) =>
            row.map((orig, c) => mergeProcessedIntoOriginal(
                orig,
                processedFlat[r * width + c] || {}
            ))
        )

        if (map.tiles && 'value' in map.tiles) map.tiles.value = newTiles2D
        else map.tiles = newTiles2D

    } catch {
        // Fallback single-thread
        const processed2D = runApplyEffectsSingleThread(tiles2D)
        const merged2D = tiles2D.map((row, r) =>
            row.map((orig, c) => mergeProcessedIntoOriginal(
                orig,
                processed2D[r]?.[c] || {}
            ))
        )
        if (map.tiles && 'value' in map.tiles) map.tiles.value = merged2D
        else map.tiles = merged2D
    } finally {
        workerPool.forEach(w => {
            try {
                w.terminate()
            } catch {
            }
        })
    }
}

/* ---------- helpers ---------- */
const isInstance = x => x && typeof x === 'object' && typeof x.type === 'string'

function structuredCloneSafe(obj) {
    try {
        return structuredClone(obj)
    } catch {
        return JSON.parse(JSON.stringify(obj ?? null))
    }
}

// Normalize to the engine’s input: use .real if present, else the array itself, else []
function realArray(x) {
    if (x && typeof x === 'object' && !Array.isArray(x) && Array.isArray(x.real)) return x.real
    if (Array.isArray(x)) return x
    return []
}

// Build worker-friendly snapshot (only real biota arrays)
function safeTileSnapshot(tile) {
    return {
        row: tile.row,
        col: tile.col,
        topography: structuredCloneSafe(tile.topography ?? {}),
        soil: structuredCloneSafe(tile.soil ?? {}),
        resources: structuredCloneSafe(tile.resources ?? {}),
        plants: structuredCloneSafe(realArray(tile.plants).filter(isInstance)),
        animals: structuredCloneSafe(realArray(tile.animals).filter(isInstance)),
        assemblies: structuredCloneSafe(tile.assemblies ?? [])
    }
}

// Merge worker/single-thread processed tile back into original shape
// Only real arrays are updated; optimized (if present) is passed through unchanged.
function mergeProcessedIntoOriginal(original, processed) {
    const out = {...original}
    if (processed.topography) out.topography = processed.topography
    if (processed.soil) out.soil = processed.soil
    if (processed.resources) out.resources = processed.resources
    if (processed.assemblies) out.assemblies = processed.assemblies

    // animals
    if (original.animals && !Array.isArray(original.animals)) {
        out.animals = {
            real: Array.isArray(processed.animals) ? processed.animals : realArray(original.animals),
            optimized: original.animals.optimized // pass-through
        }
    }

    // plants
    if (original.plants && !Array.isArray(original.plants)) {
        out.plants = {
            real: Array.isArray(processed.plants) ? processed.plants : realArray(original.plants),
            optimized: original.plants.optimized // pass-through
        }
    }

    return out
}

function chunkArray(arr, k) {
    const n = arr.length
    if (k <= 1 || n <= 1) return [arr.slice()]
    const per = Math.ceil(n / k)
    const out = []
    for (let i = 0; i < n; i += per) out.push(arr.slice(i, i + per))
    return out
}

/* ---------- single-thread reference (uses imported FX) ---------- */
function runApplyEffectsSingleThread(tiles2D) {
    const FX = {
        animals: animalEffects,
        assemblies: assemblyEffects,
        plants: plantEffects,
        resources: resourceEffects,
        soil: soilEffects,
        topography: topographyEffects,
        weather: weatherEffects
    }
    const ORDER = ['weather', 'assemblies', 'topography', 'soil', 'animals', 'plants', 'resources']

    return tiles2D.map(row =>
        row.map(tile => {
            const animalsArr = realArray(tile.animals).filter(isInstance)
            const plantsArr = realArray(tile.plants).filter(isInstance)

            const prepared = {
                animals: animalsArr.map(a => ({key: a.type, subject: a})),
                plants: plantsArr.map(p => ({key: p.type, subject: p})),
                assemblies: (Array.isArray(tile.assemblies)
                    ? tile.assemblies.flatMap(a => Array.isArray(a.orders) ? a.orders : [])
                    : []).map(order => ({key: order, subject: null})),
                weather: Object.keys(FX.weather || {}).map(k => ({key: k, subject: null})),
                topography: Object.keys(tile.topography || {}).filter(k => FX.topography?.[k]).map(k => ({
                    key: k,
                    subject: null
                })),
                soil: Object.keys(tile.soil || {}).filter(k => FX.soil?.[k]).map(k => ({key: k, subject: null})),
                resources: Object.keys(tile.resources || {}).filter(k => FX.resources?.[k]).map(k => ({
                    key: k,
                    subject: null
                }))
            }

            const working = {
                row: tile.row, col: tile.col,
                soil: {...tile.soil},
                topography: {...tile.topography},
                resources: {...tile.resources},
                plants: plantsArr.map(p => ({...p})),
                animals: animalsArr.map(a => ({...a})),
                assemblies: Array.isArray(tile.assemblies)
                    ? tile.assemblies.map(a => ({...a, orders: Array.isArray(a.orders) ? [...a.orders] : []}))
                    : []
            }

            const bumpGroup = (groupName, prop, delta) => {
                const grp = working[groupName]
                if (grp?.[prop]?.env !== undefined) {
                    const next = (grp[prop].env ?? 0) + delta
                    grp[prop].env = roundN(next)
                }
            }

            for (const category of ORDER) {
                const entries = prepared[category] || []
                const catalog = FX[category]
                if (!catalog || !entries.length) continue

                for (const {key, subject} of entries) {
                    const effectList = catalog[key]
                    if (!Array.isArray(effectList) || !effectList.length) continue

                    for (const eff of effectList) {
                        const delta = (typeof eff.delta === 'function')
                            ? eff.delta({tile: working, subject, type: key, category})
                            : eff.delta

                        if (eff.target === 'animals') {
                            const targets = subject ? [subject] : working.animals
                            for (const a of targets) if (a?.[eff.property]?.env !== undefined) {
                                const next = (a[eff.property].env ?? 0) + delta
                                a[eff.property].env = roundN(next)
                            }

                            continue
                        }
                        if (eff.target === 'plants') {
                            const targets = subject ? [subject] : working.plants
                            for (const p of targets) if (p?.[eff.property]?.env !== undefined) {
                                const next = (p[eff.property].env ?? 0) + delta
                                p[eff.property].env = roundN(next)
                            }

                            continue
                        }
                        bumpGroup(eff.target, eff.property, delta)
                    }
                }
            }

            return {
                row: working.row,
                col: working.col,
                topography: working.topography,
                soil: working.soil,
                resources: working.resources,
                plants: working.plants,
                animals: working.animals,
                assemblies: working.assemblies
            }
        })
    )
}
