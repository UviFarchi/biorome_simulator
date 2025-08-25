// src/engine/steps/ecosystemEvents.js
//
// Purpose:
// Roll daily ecosystem events that introduce animals or plants.
// Select eligible tiles by habitat, choose a small random subset,
// then spread each tile’s spawns across the tile and its adjacent tiles.
// Any overflow is placed on the last adjacent tile.
//
// Notes:
// - Uses measurement contract { env, measured:{} } for health.
// - Assumes map.tiles is a 2D grid. We flatten only for selection.
// - getAdjacentTiles(tile, tilesGrid) is provided in utils.

import { gameStore } from '@/stores/game.js'
import { mapStore } from '@/stores/map.js'
import { animal as animalStore } from '@/stores/animal.js'
import { plant as plantStore } from '@/stores/plant.js'
import { getAdjacentTiles } from '@/utils.js'
import eventBus from '@/eventBus.js'

// -------------------------------------------------------------
// Helpers
// -------------------------------------------------------------

function getRandomIntBelow(limitExclusive) {
    return Math.floor(Math.random() * limitExclusive)
}

function randomChance(probabilityZeroToOne) {
    return Math.random() < probabilityZeroToOne
}

function pickRandom(array) {
    return array[getRandomIntBelow(array.length)]
}

function clampToRange(value, minValue, maxValue) {
    return Math.max(minValue, Math.min(maxValue, value))
}

function isWaterTile(tile) {
    const waterTable = tile?.topo?.waterTable?.env ?? -Infinity
    const elevation = tile?.topo?.elevation?.env ?? Infinity
    const soilWater = tile?.soil?.water?.env ?? 0
    return elevation <= waterTable || soilWater >= 90
}

function formatDateISO(dateLike) {
    return new Date(dateLike).toISOString().slice(0, 10)
}

function getFirstStageName(stages) {
    return Array.isArray(stages) && stages.length ? stages[0] : ''
}

function ensureEntityArraysOnTile(tile) {
    if (!Array.isArray(tile.animals)) tile.animals = []
    if (!Array.isArray(tile.plants)) tile.plants = []
}

// Instantiate a minimal plant instance from a catalog spec
function makePlantInstanceFromSpec(spec, dateLike) {
    return {
        type: spec.type,
        icon: spec.icon,
        dateDeployed: formatDateISO(dateLike),
        growthStage: getFirstStageName(spec.growthStages),
        health: {
            env: spec.health?.env ?? 100,
            unit: 'life',
            measured: { value: undefined, date: undefined }
        }
    }
}

// Instantiate a minimal animal instance from a catalog spec
function makeAnimalInstanceFromSpec(spec, dateLike) {
    return {
        type: spec.type,
        icon: spec.icon,
        dateDeployed: formatDateISO(dateLike),
        growthStage: getFirstStageName(spec.growthStages),
        health: {
            env: spec.health?.env ?? 100,
            unit: 'life',
            measured: { value: undefined, date: undefined }
        }
    }
}

// Thin wrapper over provided adjacency util. Always returns an array.
function getNeighborTiles(originTile, map) {
    try {
        const neighbors = getAdjacentTiles(originTile, map.tiles) || []
        return Array.isArray(neighbors) ? neighbors : []
    } catch {
        return []
    }
}

// Filter tiles by requested habitat
function filterTilesByHabitat(tiles, habitat) {
    if (!Array.isArray(tiles)) return []
    if (habitat === 'water') return tiles.filter(isWaterTile)
    if (habitat === 'land') return tiles.filter(t => !isWaterTile(t))
    return tiles
}

// Sample up to maxCount unique tiles from a list
function sampleUniqueTiles(list, maxCount) {
    const count = clampToRange(maxCount, 0, list.length)
    const picked = []
    const usedIndexes = new Set()
    while (picked.length < count) {
        const i = getRandomIntBelow(list.length)
        if (!usedIndexes.has(i)) {
            usedIndexes.add(i)
            picked.push(list[i])
        }
    }
    return picked
}

// -------------------------------------------------------------
// Event catalog
// Each entry:
//   id, label, dailyProbability, habitat ("land" | "water"),
//   entity ("plant" | "animal"), candidates (type keys), spawnCount {min,max}
// -------------------------------------------------------------
const EVENTS = [
    {
        id: 'weed_propagation',
        label: 'Weed propagation',
        dailyProbability: 100, // debug
        habitat: 'land',
        entity: 'plant',
        candidates: ['barnyard_grass'],
        spawnCount: { min: 1, max: 3 }
    },
    {
        id: 'aquatic_weed_bloom',
        label: 'Aquatic weed bloom',
        dailyProbability: 0.08,
        habitat: 'water',
        entity: 'plant',
        candidates: ['duckweed', 'water_hyacinth'],
        spawnCount: { min: 2, max: 6 }
    },
    {
        id: 'locust_scatter',
        label: 'Locusts arrive',
        dailyProbability: 0.05,
        habitat: 'land',
        entity: 'animal',
        candidates: ['locust'],
        spawnCount: { min: 3, max: 10 }
    },
    {
        id: 'mosquito_bloom',
        label: 'Mosquito bloom',
        dailyProbability: 0.06,
        habitat: 'water',
        entity: 'animal',
        candidates: ['mosquito'],
        spawnCount: { min: 4, max: 12 }
    },
    {
        id: 'predator_invasion',
        label: 'Predator invasion',
        dailyProbability: 0.04,
        habitat: 'land',
        entity: 'animal',
        candidates: ['fox', 'wild_boar', 'raccoon', 'hawk', 'owl', 'snake'],
        spawnCount: { min: 1, max: 2 }
    },
    {
        id: 'beneficial_insects',
        label: 'Beneficial insects arrive',
        dailyProbability: 100, // debug
        habitat: 'land',
        entity: 'animal',
        candidates: ['ladybug', 'bee', 'butterfly'],
        spawnCount: { min: 2, max: 8 }
    }
]

// -------------------------------------------------------------
// Main
// -------------------------------------------------------------
export default function ecosystemEvents() {
    const game = gameStore()
    const map = mapStore()
    const animals = animalStore()
    const plants = plantStore()

    // Flatten to a single array for habitat filtering and sampling
    const allTilesFlat = map?.tiles?.flat?.() ?? []
    if (!allTilesFlat.length) return false

    // Process each event independently per tick
    for (const eventDef of EVENTS) {
        if (!randomChance(eventDef.dailyProbability)) continue

        // Habitat-filtered pool and a small target sample
        const habitatPool = filterTilesByHabitat(allTilesFlat, eventDef.habitat)
        if (!habitatPool.length) continue

        // Use up to ~5% of eligible tiles, with sane caps
        const targetTileCount = clampToRange(Math.ceil(habitatPool.length * 0.05), 1, 25)
        const seedTiles = sampleUniqueTiles(habitatPool, targetTileCount)

        // Resolve catalog and pick a candidate species type present in the store
        const catalog = eventDef.entity === 'animal'
            ? (animals.animalTypes ?? [])
            : (plants.plantTypes ?? [])

        const specByType = new Map(catalog.map(spec => [spec.type, spec]))
        const availableCandidates = eventDef.candidates.filter(t => specByType.has(t))
        if (!availableCandidates.length) continue

        const chosenTypeKey = pickRandom(availableCandidates)
        const chosenSpec = specByType.get(chosenTypeKey)

        let placementsCount = 0

        // For each seed tile, spread k instances over the tile + its neighbors
        for (const seedTile of seedTiles) {
            ensureEntityArraysOnTile(seedTile)

            const spawnCount =
                getRandomIntBelow(eventDef.spawnCount.max - eventDef.spawnCount.min + 1) +
                eventDef.spawnCount.min

            const neighbors = getNeighborTiles(seedTile, map)
            const spreadStripe = [seedTile, ...neighbors] // origin first, then adjacency

            for (let i = 0; i < spawnCount; i++) {
                const targetTile = spreadStripe[Math.min(i, spreadStripe.length - 1)] // dump remainder on last
                ensureEntityArraysOnTile(targetTile)

                if (eventDef.entity === 'animal') {
                    targetTile.animals.push(
                        makeAnimalInstanceFromSpec(chosenSpec, game.currentDate)
                    )
                } else {
                    targetTile.plants.push(
                        makePlantInstanceFromSpec(chosenSpec, game.currentDate)
                    )
                }
                placementsCount++
            }
        }

        if (placementsCount > 0) {
            eventBus.emit('log', {
                engine: 'simulation',
                msg: `${eventDef.label}: ${placementsCount} ${eventDef.entity}${placementsCount === 1 ? '' : 's'} added (${chosenSpec.type}) on ${seedTiles.length} tiles (adjacent spread).`
            })
        }
    }

    return true
}
