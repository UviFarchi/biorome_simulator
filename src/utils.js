// src/utils.js
import { assemblyRequirementsStore } from '@/stores/assemblyRequirements.js'
import { mapStore }                 from '@/stores/map.js'
import { gameStore }              from '@/stores/game.js'
import { marketStore }              from '@/stores/market.js'
import { resourceStore }            from '@/stores/resource.js'
import { weatherStore }             from '@/stores/weather.js'
import { moduleStore }             from '@/stores/module.js'
import eventBus                     from '@/eventBus.js'

// ---------- Store registry + memoization ----------
const factoryByName = Object.fromEntries(
    Object.entries({
        assemblyRequirementsStore,
        gameStore,
        mapStore,
        marketStore,
        resourceStore,
        weatherStore,
        moduleStore,
    }).map(([exportedName, factoryFn]) => [exportedName.replace(/Store$/, ''), factoryFn])
)

const storeInstances = Object.fromEntries(
    Object.keys(factoryByName).map((name) => [name, null])
)

function getStore(storeName) {
    const factoryFn = factoryByName[storeName]
    if (!factoryFn) throw new Error(`Unknown store "${storeName}"`)
    if (!storeInstances[storeName]) {
        storeInstances[storeName] = factoryFn()
    }
    return storeInstances[storeName]
}

// ---------- Requirements helpers ----------
function assemblyMeetsRequirements(assembly, requirementType, requirementName) {
    if (!assembly || !Array.isArray(assembly.modules)) return false
    const requirementsRoot = getStore('assemblyRequirements')
    const requirementList =
        requirementsRoot[requirementType] && requirementsRoot[requirementType][requirementName]
            ? requirementsRoot[requirementType][requirementName]
            : []

    return requirementList.every((requirement) =>
        assembly.modules.some((module) =>
            (!requirement.type    || module.type    === requirement.type) &&
            (!requirement.subtype || module.subtype === requirement.subtype) &&
            (!requirement.name    || module.name    === requirement.name)
        )
    )
}

function getRequirements(requirementType, requirementName) {
    const requirementsRoot = getStore('assemblyRequirements')
    const group = requirementsRoot[requirementType]
    if (!group || !group[requirementName]) {
        throw new Error(`No requirements for ${requirementType}.${requirementName}`)
    }
    return group[requirementName]
}

function getMatchingModuleNames(requirements, availableModules) {
    return requirements.map((requirement) => {
        const candidates = availableModules.filter((module) => {
            if (module.type !== requirement.type) return false
            if (Object.prototype.hasOwnProperty.call(requirement, 'subtype') &&
                requirement.subtype !== undefined &&
                requirement.subtype !== null) {
                return module.subtype === requirement.subtype
            }
            return true
        })
        return {
            type: requirement.type,
            subtype: requirement.subtype,
            names: candidates.map((module) => module.name),
        }
    })
}

function canAssemblyMoveAlone(assembly) {
    if (!assembly || !Array.isArray(assembly.modules)) return false
    return assembly.modules.some((module) => module.type === 'transport')
}

// ---------- Map helpers ----------
function getAdjacentTiles(tile, tilesGrid) {
    const directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [ 0, -1],          [ 0, 1],
        [ 1, -1], [ 1, 0], [ 1, 1],
    ]
    const adjacent = []
    for (const [deltaRow, deltaCol] of directions) {
        const row = tile.row + deltaRow
        const col = tile.col + deltaCol
        if (
            row >= 0 && row < tilesGrid.length &&
            col >= 0 && col < tilesGrid[0].length &&
            !(row === tile.row && col === tile.col)
        ) {
            adjacent.push(tilesGrid[row][col])
        }
    }
    return adjacent
}

// ---------- Persistence ----------
const SAVE_KEY = 'bioromeState'

function saveAllStores() {
    const payload = {
        game:      getStore('game').$state,
        map:       getStore('map').$state,
        market:    getStore('market').$state,
        resources: getStore('resource').$state,
        weather:   getStore('weather').$state,
        modules:   getStore('module').$state,
    }
    localStorage.setItem(SAVE_KEY, JSON.stringify(payload))
    eventBus.emit('log', { engine: 'game', msg: 'State saved' })
}
function hasSavedState() {
    return !!localStorage.getItem(SAVE_KEY)
}
function loadAllStores() {
    console.log('Loading stores')
    const raw = localStorage.getItem(SAVE_KEY)
    if (!raw) return false
    const data = JSON.parse(raw)

    if (data.game)      getStore('game').$patch(data.game)
    if (data.map)       getStore('map').$patch(data.map)
    if (data.events)    getStore('event').$patch(data.events)
    if (data.market)    getStore('market').$patch(data.market)
    if (data.resources) getStore('resource').$patch(data.resources)
    if (data.weather)   getStore('weather').$patch(data.weather)
    if (data.modules)   getStore('module').$patch(data.modules)

    eventBus.emit('log', { engine: 'game', msg: 'State loaded' })
    return true
}

function clearSavedStores() {
    localStorage.removeItem(SAVE_KEY)
    eventBus.emit('log', { engine: 'game', msg: 'Saved state cleared' })
}

// ---------- Exports ----------
export {
    // requirements
    assemblyMeetsRequirements,
    getRequirements,
    getMatchingModuleNames,
    // map helpers
    getAdjacentTiles,
    canAssemblyMoveAlone,
    // persistence
    saveAllStores,
    loadAllStores,
    clearSavedStores,
    hasSavedState,
    // store accessor
    getStore,
}
