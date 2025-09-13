// src/engine/steps/ecosystemEvents.js
//
// Purpose:
// Roll daily ecosystem events that introduce animals or plants.
// Select eligible tiles by habitat, choose a small random subset,
// then spread each tile’s spawns across the tile and its adjacent tiles.
// Any overflow is placed on the last adjacent tile.
//
// Notes:
// - Instances use minimal per-entity state with UUIDs.
// - Icons are NOT stored on instances; fetch from species stores at render.
// - Health and fruiting.pollinated use { env, measured:{ value, date, collect }, target }.
// - Assumes map.tiles is a 2D grid. We flatten only for selection.
// - getAdjacentTiles(tile, tilesGrid) is provided in utils.

import { gameStore } from '@/stores/game.js'
import { mapStore } from '@/stores/map.js'
import { animalTypes } from '@/data/animals.data.js'
import { plantTypes} from '@/data/plants.data.js'
import { getAdjacentTiles } from '@/utils/tileHelpers.js'
import { makeInstance } from '@/engine/phases/optimizations/biotaFactories.js'

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
    const waterTable = tile?.topography?.waterTable?.env ?? -Infinity
    const elevation = tile?.topography?.elevation?.env ?? Infinity
    const soilWater = tile?.soil?.water?.env ?? 0
    return elevation <= waterTable || soilWater >= 90
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
    dailyProbability: 1.0,
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
    dailyProbability: 1.0, // debug: always
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

    // Flatten to a single array for habitat filtering and sampling
    const allTilesFlat = map?.tiles?.flat?.() ?? []
    if (!allTilesFlat.length) return false

  // Ensure event bucket exists
  game.currentEvents = game.currentEvents || {}
  game.currentEvents.ecosystem = Array.isArray(game.currentEvents.ecosystem)
    ? game.currentEvents.ecosystem
    : []

    // Process each event independently per tick
    for (const eventDef of EVENTS) {
        if (!randomChance(eventDef.dailyProbability)) continue

        const habitatPool = filterTilesByHabitat(allTilesFlat, eventDef.habitat)
        if (!habitatPool.length) continue

        const targetTileCount = clampToRange(Math.ceil(habitatPool.length * 0.05), 1, 25)
        const seedTiles = sampleUniqueTiles(habitatPool, targetTileCount)

        const catalog = eventDef.entity === 'animal'
            ? animalTypes
            : plantTypes

        const specByType = new Map(catalog.map(spec => [spec.type, spec]))
        const availableCandidates = eventDef.candidates.filter(t => specByType.has(t))
        if (!availableCandidates.length) continue

        const chosenTypeKey = pickRandom(availableCandidates)
        const chosenSpec = specByType.get(chosenTypeKey)

        let placementsCount = 0

        for (const seedTile of seedTiles) {


            const spawnCount =
                getRandomIntBelow(eventDef.spawnCount.max - eventDef.spawnCount.min + 1) +
                eventDef.spawnCount.min

            const neighbors = getAdjacentTiles(seedTile, map.tiles) || []
            const spreadStripe = [seedTile, ...neighbors]

            for (let i = 0; i < spawnCount; i++) {
                // inside for (let i = 0; i < spawnCount; i++) { ... }
                const targetTile = spreadStripe[Math.min(i, spreadStripe.length - 1)]
                const stage = pickRandom(chosenSpec.growthStages)

                if (eventDef.entity === 'animal') {
                    targetTile.animals.real.push(
                        makeInstance('animal', chosenSpec.type, stage)
                    )
                } else {
                    targetTile.plants.real.push(
                        makeInstance('plant', chosenSpec.type, stage)
                    )
                }

                placementsCount++
            }
        }

        if (placementsCount > 0) {
            game.currentEvents.ecosystem.push(eventDef)
        }
    }

    return true
}
