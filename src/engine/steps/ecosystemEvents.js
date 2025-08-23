// src/engine/steps/ecosystemEvents.js
import {gameStore} from "@/stores/game.js"
import {mapStore} from "@/stores/map.js"
import {animal as animalStore} from "@/stores/animal.js"
import {plant as plantStore} from "@/stores/plant.js"
import { getAdjacentTiles } from "@/utils.js"
import eventBus from "@/eventBus.js"

// ---------- Helpers
const rand = (n) => Math.floor(Math.random() * n)
const chance = (p) => Math.random() < p
const pick = (arr) => arr[rand(arr.length)]
const clamp = (x, a, b) => Math.max(a, Math.min(b, x))

const isWaterTile = (t) => {
    const wt = t?.topo?.waterTable?.env ?? -Infinity
    const el = t?.topo?.elevation?.env ?? Infinity
    const soilWater = t?.soil?.water?.env ?? 0
    return el <= wt || soilWater >= 90
}

const nowISO = (d) => new Date(d).toISOString().slice(0, 10)
const firstStage = (stages) => (Array.isArray(stages) && stages.length ? stages[0] : "")

const ensureArraysOnTile = (tile) => {
    if (!Array.isArray(tile.animals)) tile.animals = []
    if (!Array.isArray(tile.plants)) tile.plants = []
}

const makePlantInstance = (spec, date) => ({
    type: spec.type,
    icon: spec.icon,
    dateDeployed: nowISO(date),
    growthStage: firstStage(spec.growthStages),
    health: {env: spec.health?.env ?? 100, unit: "life", measured: {value: undefined, date: undefined}}
})

const makeAnimalInstance = (spec, date) => ({
    type: spec.type,
    icon: spec.icon,
    dateDeployed: nowISO(date),
    growthStage: firstStage(spec.growthStages),
    health: {env: spec.health?.env ?? 100, unit: "life", measured: {value: undefined, date: undefined}}
})

// ---------- Event catalog
const EVENTS = [
    {
        id: "weed_propagation",
        label: "Weed propagation",
        dailyProbability: 100, // debug
        habitat: "land",
        entity: "plant",
        candidates: ["barnyard_grass"],
        spawnCount: {min: 1, max: 3}
    },
    {
        id: "aquatic_weed_bloom",
        label: "Aquatic weed bloom",
        dailyProbability: 0.08,
        habitat: "water",
        entity: "plant",
        candidates: ["duckweed", "water_hyacinth"],
        spawnCount: {min: 2, max: 6}
    },
    {
        id: "locust_scatter",
        label: "Locusts arrive",
        dailyProbability: 0.05,
        habitat: "land",
        entity: "animal",
        candidates: ["locust"],
        spawnCount: {min: 3, max: 10}
    },
    {
        id: "mosquito_bloom",
        label: "Mosquito bloom",
        dailyProbability: 0.06,
        habitat: "water",
        entity: "animal",
        candidates: ["mosquito"],
        spawnCount: {min: 4, max: 12}
    },
    {
        id: "predator_invasion",
        label: "Predator invasion",
        dailyProbability: 0.04,
        habitat: "land",
        entity: "animal",
        candidates: ["fox", "wild_boar", "raccoon", "hawk", "owl", "snake"],
        spawnCount: {min: 1, max: 2}
    },
    {
        id: "beneficial_insects",
        label: "Beneficial insects arrive",
        dailyProbability: 100, // debug
        habitat: "land",
        entity: "animal",
        candidates: ["ladybug", "bee", "butterfly"],
        spawnCount: {min: 2, max: 8}
    }
]

// ---------- Adjacency wrapper (uses your utils)
function neighborTiles(tile, map) {
    try {
        const res = getAdjacentTiles(tile, map.tiles) || []
        return Array.isArray(res) ? res : []
    } catch {
        return []
    }
}

// ---------- Tile selection by habitat
const filterTiles = (tiles, habitat) => {
    if (!Array.isArray(tiles)) return []
    if (habitat === "water") return tiles.filter(isWaterTile)
    if (habitat === "land") return tiles.filter((t) => !isWaterTile(t))
    return tiles
}

const sampleTiles = (arr, maxCount) => {
    const n = clamp(maxCount, 0, arr.length)
    const picked = []
    const used = new Set()
    while (picked.length < n) {
        const i = rand(arr.length)
        if (!used.has(i)) {
            used.add(i)
            picked.push(arr[i])
        }
    }
    return picked
}

// ---------- Main
export default function ecosystemEvents() {
    const game = gameStore()
    const map = mapStore()
    const animals = animalStore()
    const plants = plantStore()

    const allTiles = map?.tiles?.flat?.() ?? []
    if (!allTiles.length) return false

    for (const ev of EVENTS) {
        if (!chance(ev.dailyProbability)) continue

        const pool = filterTiles(allTiles, ev.habitat)
        if (!pool.length) continue

        const targetCount = clamp(Math.ceil(pool.length * 0.05), 1, 25)
        const chosenTiles = sampleTiles(pool, targetCount)

        const catalog = ev.entity === "animal" ? (animals.animalTypes ?? []) : (plants.plantTypes ?? [])
        const byType = new Map(catalog.map((c) => [c.type, c]))
        const chosenSpecType = pick(ev.candidates.filter((t) => byType.has(t)))
        if (!chosenSpecType) continue
        const spec = byType.get(chosenSpecType)

        let totalSpawns = 0

        for (const tile of chosenTiles) {
            ensureArraysOnTile(tile)
            const k = rand(ev.spawnCount.max - ev.spawnCount.min + 1) + ev.spawnCount.min

            const neighbors = neighborTiles(tile, map)
            const stripe = [tile, ...neighbors] // origin first, then adjacents

            for (let i = 0; i < k; i++) {
                const target = stripe[Math.min(i, stripe.length - 1)] // dump remainder on last neighbor
                ensureArraysOnTile(target)
                if (ev.entity === "animal") {
                    target.animals.push(makeAnimalInstance(spec, game.currentDate))
                } else {
                    target.plants.push(makePlantInstance(spec, game.currentDate))
                }
                totalSpawns++
            }
        }

        if (totalSpawns > 0) {
            eventBus.emit("log", {
                engine: "simulation",
                msg: `${ev.label}: ${totalSpawns} ${ev.entity}${totalSpawns === 1 ? "" : "s"} added (${spec.type}) on ${chosenTiles.length} tiles (adjacent spread).`
            })
        }
    }

    return true
}
