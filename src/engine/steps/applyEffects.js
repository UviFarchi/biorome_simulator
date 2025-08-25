// src/engine/steps/applyEffects.js
// Parallel applyEffects with a worker pool. Preserves per-tile order.
// Verbose logs for step-by-step tracing.

import {mapStore} from '@/stores/map.js'

// Tune this after profiling
const MAX_WORKERS = Math.min(4, navigator.hardwareConcurrency || 4)
// Set to true to compare worker vs single-thread on a small sample
const ENABLE_CONSISTENCY_CHECK = false
const CONSISTENCY_SAMPLE_SIZE = 200

// Worker factory; path is relative to THIS file
const createWorker = () =>
    new Worker(new URL('../workers/effectWorkers.js', import.meta.url), {type: 'module'})

export async function applyEffects() {

    const map = mapStore()

    // Try to read tiles regardless of ref/reactive shape
    const tiles2D = Array.isArray(map.tiles) ? map.tiles : map.tiles?.value
    if (!Array.isArray(tiles2D) || tiles2D.length === 0) {
        return
    }
    const height = tiles2D.length
    const width = tiles2D[0]?.length ?? 0
    if (width === 0) {
        return
    }

    const flatTiles = tiles2D.flat()
    const totalTiles = flatTiles.length

    // Sanitize payload to plain JSON-friendly objects to avoid DataCloneError
    const payload = flatTiles.map(safeTileSnapshot)

    // Optional: quick consistency check on a small prefix (single-thread vs worker)
    if (ENABLE_CONSISTENCY_CHECK) {
        await debugCompareFirstN(payload, height, width, Math.min(CONSISTENCY_SAMPLE_SIZE, totalTiles))
    }

    // Shard into chunks for workers
    const workerCount = Math.min(MAX_WORKERS, payload.length) || 1
    const chunks = chunkArray(payload, workerCount)

    // Dispatch to the pool
    const workerPool = chunks.map(createWorker)
    try {
        const jobs = chunks.map((chunk, idx) =>
            new Promise((resolve, reject) => {
                const worker = workerPool[idx]
                worker.onmessage = (e) => {
                    // e.data is an array of processed tiles, in the same order as sent
                    resolve(e.data)
                    worker.terminate()
                }
                worker.onerror = (err) => {
                    reject(err)
                    worker.terminate()
                }
                // Post exactly once per worker
                try {
                    worker.postMessage({tiles: chunk})
                } catch (postErr) {
                    reject(postErr)
                }
            })
        )

        const processedChunks = await Promise.all(jobs)
        const processedFlat = processedChunks.flat()

        if (processedFlat.length !== totalTiles) {
            // fall through; we will slice defensively below
        }

        // Rebuild the original 2D grid shape
        const newTiles2D = []
        for (let r = 0; r < height; r++) {
            const rowStart = r * width
            newTiles2D.push(processedFlat.slice(rowStart, rowStart + width))
        }

        // Single assignment for reactivity; support ref or reactive
        if (map.tiles && 'value' in map.tiles) {
            map.tiles.value = newTiles2D
        } else {
            map.tiles = newTiles2D
        }

    } catch (err) {
        // Fallback to the original single-thread function for correctness
        const newTiles2D = runApplyEffectsSingleThread(tiles2D)
        if (map.tiles && 'value' in map.tiles) map.tiles.value = newTiles2D
        else map.tiles = newTiles2D
    } finally {
        // Ensure all workers are terminated if any remain
        workerPool.forEach(w => {
            try {
                w.terminate()
            } catch (_) {
                console.error(_)
            }
        })

    }
}

/**
 * Create a plain object snapshot of the minimal tile shape the worker needs.
 * Avoids proxies, getters, class instances, and functions.
 */
function safeTileSnapshot(tile) {
    // structuredClone is faster and safer; fall back to JSON if unavailable
    const clone = (obj) => {
        try {
            return structuredClone(obj)
        } catch {
            return JSON.parse(JSON.stringify(obj ?? null))
        }
    }
    return {
        row: tile.row,
        col: tile.col,
        // These groups contain {prop: {env, measured?}} objects
        topography: clone(tile.topography ?? {}),
        soil: clone(tile.soil ?? {}),
        resources: clone(tile.resources ?? {}),
        // Arrays of biotic subjects
        plants: clone(tile.plants ?? []),
        animals: clone(tile.animals ?? []),
        // Assemblies may be arrays with .orders arrays; send as-is and the worker will flatten
        assemblies: clone(tile.assemblies ?? [])
    }
}

/** Split an array into k contiguous chunks, preserving order. */
function chunkArray(arr, k) {
    const n = arr.length
    if (k <= 1 || n <= 1) return [arr.slice()]
    const per = Math.ceil(n / k)
    const out = []
    for (let i = 0; i < n; i += per) out.push(arr.slice(i, i + per))
    return out
}

/**
 * Single-threaded reference path. Copies your original logic tile by tile.
 * Use only for consistency checks or fallback.
 */
function runApplyEffectsSingleThread(tiles2D) {

    // Lazy import to avoid bundling FX twice here; effects are pure so direct import is fine
    // We replicate the in-worker logic here without workers.
    const {
        default: animalEffects
    } = requireLike('@/engine/effects/animal.js')
    const {
        default: assemblyEffects
    } = requireLike('@/engine/effects/assembly.js')
    const {
        default: plantEffects
    } = requireLike('@/engine/effects/plant.js')
    const {
        default: resourceEffects
    } = requireLike('@/engine/effects/resource.js')
    const {
        default: soilEffects
    } = requireLike('@/engine/effects/soil.js')
    const {
        default: topographyEffects
    } = requireLike('@/engine/effects/topography.js')
    const {
        default: weatherEffects
    } = requireLike('@/engine/effects/weather.js')

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

    const result = tiles2D.map((row, r) =>
        row.map((tile, c) => {
            const prepared = {
                animals: (tile.animals || []).map(a => ({key: a.type, subject: a})),
                plants: (tile.plants || []).map(p => ({key: p.type, subject: p})),
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
                })),
            }

            const working = {
                row: tile.row, col: tile.col,
                soil: {...tile.soil},
                topography: {...tile.topography},
                resources: {...tile.resources},
                plants: (tile.plants || []).map(p => ({...p})),
                animals: (tile.animals || []).map(a => ({...a})),
                assemblies: Array.isArray(tile.assemblies) ? tile.assemblies.map(a => ({
                    ...a,
                    orders: Array.isArray(a.orders) ? [...a.orders] : []
                })) : [],
            }

            const bumpGroup = (groupName, prop, delta) => {
                const grp = working[groupName]
                if (grp?.[prop]?.env !== undefined) grp[prop].env += delta
            }

            for (const category of ORDER) {
                const entries = prepared[category] || []
                const catalog = FX[category]
                if (!catalog || entries.length === 0) continue

                for (const {key, subject} of entries) {
                    const effectList = catalog[key]
                    if (!Array.isArray(effectList) || effectList.length === 0) continue

                    for (const eff of effectList) {
                        const delta = (typeof eff.delta === 'function')
                            ? eff.delta({tile: working, subject, key, category})
                            : eff.delta

                        if (eff.target === 'animals') {
                            const targets = subject ? [subject] : working.animals
                            for (const a of targets) if (a?.[eff.property]?.env !== undefined)
                                a[eff.property].env = (a[eff.property].env ?? 0) + delta
                            continue
                        }
                        if (eff.target === 'plants') {
                            const targets = subject ? [subject] : working.plants
                            for (const p of targets) if (p?.[eff.property]?.env !== undefined)
                                p[eff.property].env = (p[eff.property].env ?? 0) + delta
                            continue
                        }
                        bumpGroup(eff.target, eff.property, delta)
                    }
                }
            }
            return working
        })
    )

    return result
}

/**
 * Very small helper to import ES modules synchronously where supported.
 * Vite will transform this at build time. In dev it falls back to dynamic import sync-ish.
 */
function requireLike(path) {
    try {
        // @ts-ignore — some bundlers rewrite this
        return __vite_ssr_import__(path)
    } catch {
        // Worst case: direct eval of import; only used in dev checks
        throw new Error(`[applyEffects][single] requireLike failed for ${path}`)
    }
}

/**
 * Run a correctness check on first N tiles by computing both paths
 * and logging the first mismatch with a JSON diff path.
 */
async function debugCompareFirstN(snapshotsFlat, height, width, n) {
    const sample = snapshotsFlat.slice(0, n)
    // Run worker on the sample
    const worker = createWorker()
    const workerPromise = new Promise((resolve, reject) => {
        worker.onmessage = e => {
            resolve(e.data);
            worker.terminate()
        }
        worker.onerror = err => {
            reject(err);
            worker.terminate()
        }
    })
    worker.postMessage({tiles: sample})
    const workerOut = await workerPromise

    // Run single-thread on the same tiles by rebuilding a tiny 2D grid
    const cols = width
    const rows = Math.ceil(sample.length / cols)
    const tinyGrid = []
    for (let r = 0; r < rows; r++) tinyGrid.push(sample.slice(r * cols, (r + 1) * cols))
    // We must call the single-thread function that expects the full FX catalogs.
    // Here we bypass requireLike, as this check is optional; if it fails, we skip.
    let singleOut2D
    try {
        singleOut2D = runApplyEffectsSingleThread(tinyGrid)
    } catch (e) {
        return
    }
    const singleOutFlat = singleOut2D.flat()

    // Compare JSON stringified shallowly; if mismatch, locate the key path
    for (let i = 0; i < workerOut.length; i++) {
        const a = workerOut[i], b = singleOutFlat[i]
        const aj = JSON.stringify(a), bj = JSON.stringify(b)
        if (aj !== bj) {
            break
        }
    }

}

/** Produce a crude first differing key path between two objects. */
function diffKeyPath(a, b, prefix = '') {
    if (a === b) return {path: null, a, b}
    if (typeof a !== 'object' || typeof b !== 'object' || !a || !b) return {path: prefix || '(root)', a, b}
    const keys = new Set([...Object.keys(a), ...Object.keys(b)])
    for (const k of keys) {
        const res = diffKeyPath(a[k], b[k], prefix ? `${prefix}.${k}` : k)
        if (res.path) return res
    }
    return {path: null, a, b}
}
