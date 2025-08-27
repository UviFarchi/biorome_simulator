import { gameStore } from '@/stores/game.js'
import { mapStore } from '@/stores/map.js'
import eventBus from '@/eventBus.js'
import { buildDataMissing } from './buildDataMissing.js'
import { buildWeather } from './buildWeather.js'
import { buildMarket } from './buildMarket.js'
import { buildEcology } from './buildEcology.js'
import { buildTileDiff } from './buildTileDiff.js'
import { buildResourceUse } from './buildResourceUse.js'

const iso = (d) => new Date(d).toISOString().slice(0, 10)

export function produceReport() {
    const game = gameStore()
    const map = mapStore()

    const currentDateISO = iso(game.currentDate || Date.now())
    const currentGrid2D = Array.isArray(map.tiles) ? map.tiles : (map.tiles?.value || [])
    const previousGrid2D = Array.isArray(map.previousDayTiles) ? map.previousDayTiles : (map.previousDayTiles?.value || [])

    const dataMissing = buildDataMissing(currentGrid2D, currentDateISO)
    const weather = buildWeather(previousGrid2D, currentGrid2D, game.currentEvents?.weather || [], currentDateISO)

    // New sections
    const market = buildMarket(game.currentEvents?.market || [], currentDateISO)
    const ecology = buildEcology(
        // support either `ecology` or `ecosystem` bucket in currentEvents
        game.currentEvents?.ecology || game.currentEvents?.ecosystem || [],
        currentDateISO
    )

    const tileDiff    = buildTileDiff(currentGrid2D, map.optimizedTiles || [], currentDateISO)
    const resourceUse = buildResourceUse(currentGrid2D, currentDateISO)

    game.analyticsReport = { dataMissing, weather, market, ecology, tileDiff, resourceUse }
    eventBus.emit('overlay', { target: 'analytics', show: true })
    return true
}
