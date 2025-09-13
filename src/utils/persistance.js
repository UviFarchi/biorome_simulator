
import { mapStore }                 from '@/stores/map.js'
import { gameStore }              from '@/stores/game.js'
import { marketStore }              from '@/stores/market.js'
import eventBus                     from '@/eventBus.js'


const factoryByName = Object.fromEntries(
    Object.entries({
        gameStore,
        mapStore,
        marketStore
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




// ---------- Persistence ----------
const SAVE_KEY = 'bioromeState'

function saveAllStores() {
    const payload = {
        game:      getStore('game').$state,
        map:       getStore('map').$state,
        market:    getStore('market').$state
    }
    localStorage.setItem(SAVE_KEY, JSON.stringify(payload))
    eventBus.emit('log', { engine: 'simulation', msg: 'State saved' })
}
function hasSavedState() {
    return !!localStorage.getItem(SAVE_KEY)
}
function loadAllStores() {

    const raw = localStorage.getItem(SAVE_KEY)
    if (!raw) return false
    const data = JSON.parse(raw)

    if (data.game)      getStore('game').$patch(data.game)
    if (data.map)       getStore('map').$patch(data.map)
    if (data.market)    getStore('market').$patch(data.market)
    if (data.weather)   getStore('weather').$patch(data.weather)
    eventBus.emit('log', { engine: 'simulation', msg: 'State loaded' })
    return true
}

function clearSavedStores() {
    localStorage.removeItem(SAVE_KEY)
    eventBus.emit('log', { engine: 'simulation', msg: 'Saved state cleared' })
}



// ---------- Exports ----------
export {

    // persistence
    saveAllStores,
    loadAllStores,
    clearSavedStores,
    hasSavedState,
}
