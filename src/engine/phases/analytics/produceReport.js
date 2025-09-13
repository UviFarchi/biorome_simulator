import { gameStore } from '@/stores/game.js'
import { mapStore } from '@/stores/map.js'
import eventBus from '@/eventBus.js'
import { buildDataMissing } from './buildDataMissing.js'
import { buildWeather } from './buildWeather.js'
import { buildMarket } from './buildMarket.js'
import { buildEcology } from './buildEcology.js'
import { buildTileDiff } from './buildTileDiff.js'
import { buildResourceUse } from './buildResourceUse.js'
import { formatDate } from '@/utils/formatting.js'

export function produceReport() {
    const game = gameStore()
    const map = mapStore()

    const currentDateISO = formatDate(game.currentDate || Date.now())
    const currentTiles = Array.isArray(map.tiles) ? map.tiles : (map.tiles?.value || [])

    const dataMissing = buildDataMissing(currentTiles, currentDateISO)
    const weather = buildWeather(currentTiles, game.currentEvents?.weather || [], currentDateISO)

    // New sections
    const market = buildMarket(game.currentEvents?.market || [], currentDateISO)
    const ecology = buildEcology(
        // support either `ecology` or `ecosystem` bucket in currentEvents
        game.currentEvents?.ecology || game.currentEvents?.ecosystem || [],
        currentDateISO
    )

    const tileDiff    = buildTileDiff(currentDateISO)
    const resourceUse = buildResourceUse(currentTiles, currentDateISO)

    game.analyticsReport.value = { dataMissing, weather, market, ecology, tileDiff, resourceUse }
    eventBus.emit('overlay', { target: 'analytics', show: true })
    return true
}
