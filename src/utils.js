import {assemblyRequirementsStore} from '/src/stores/assemblyRequirements.js'
import {gameStore} from '@/stores/game.js'
import {mapStore} from '@/stores/map.js'
import {eventsStore} from '@/stores/events.js'
import {marketStore} from '@/stores/market.js'
import {resourceStore} from '@/stores/resources.js'
import {weatherStore} from '@/stores/weather.js'
import {modulesStore} from '@/stores/modules.js'
import {ref, watch} from "vue";
import eventBus from "@/eventBus.js";

const piniaReady = ref(false)


let assemblyRequirements = null;


watch(piniaReady, (ready) => {
    if (ready) {
        assemblyRequirements = assemblyRequirementsStore()
    }
})

function assemblyMeetsRequirements(assembly, requirementType, requirementName) {
    let localRequirements = assemblyRequirements[requirementType][requirementName]
    if (!assembly || !assembly.modules) return false
    return localRequirements.every(req => assembly.modules.some(m => (!req.type || m.type === req.type) && (!req.subtype || m.subtype === req.subtype) && (!req.name || m.name === req.name)))
}

function getRequirements(requirementType, requirementName) {
    if (!assemblyRequirements[requirementType] || !assemblyRequirements[requirementType][requirementName])
        throw new Error(`No requirements for ${requirementType}.${requirementName}`);
    return assemblyRequirements[requirementType][requirementName];
}

function getMatchingModuleNames(requirements, availableModules) {
    return requirements.map(req => {
        const matches = availableModules.filter(mod => {
            if (mod.type !== req.type) return false;
            if ('subtype' in req && req.subtype !== undefined && req.subtype !== null)
                return mod.subtype === req.subtype;
            return true;
        });
        return {
            type: req.type,
            subtype: req.subtype,
            names: matches.map(mod => mod.name)
        }
    });
}


function getAdjacentTiles(tile, tilesGrid) {
    const dirs = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1],]
    const adj = []
    for (const [dr, dc] of dirs) {
        const row = tile.row + dr
        const col = tile.col + dc
        if (row >= 0 && row < tilesGrid.length && col >= 0 && col < tilesGrid[0].length && !(row === tile.row && col === tile.col)) {
            adj.push(tilesGrid[row][col])
        }
    }
    return adj
}

function canAssemblyMoveAlone(assembly) {
    return assembly.modules.filter(module => module.type === 'transport').length > 0
}


const SAVE_KEY = 'bioromeState'


function saveAllStores () {
    const payload = {
        game:      gameStore().$state,
        map:       mapStore().$state,
        events:    eventsStore().$state,
        market:    marketStore().$state,
        resources: resourceStore().$state,
        weather:   weatherStore().$state,
        modules:   modulesStore().$state,
    }
    localStorage.setItem(SAVE_KEY, JSON.stringify(payload))
}

function loadAllStores () {
    const raw = localStorage.getItem(SAVE_KEY)
    if (!raw) return false
    const data = JSON.parse(raw)

    if (data.game)      gameStore().$patch(data.game)
    if (data.map)       mapStore().$patch(data.map)
    if (data.events)    eventsStore().$patch(data.events)
    if (data.market)    marketStore().$patch(data.market)
    if (data.resources) resourceStore().$patch(data.resources)
    if (data.weather)   weatherStore().$patch(data.weather)
    if (data.modules)   modulesStore().$patch(data.modules)
    return true
}

function clearSavedStores () {
    localStorage.removeItem(SAVE_KEY)
}

export {
    assemblyMeetsRequirements,
    getMatchingModuleNames,
    getRequirements,
    getAdjacentTiles,
    canAssemblyMoveAlone,
    saveAllStores,
    loadAllStores,
    clearSavedStores,
    piniaReady
}
