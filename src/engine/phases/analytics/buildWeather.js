// UI-ready builder for the “Weather” section

import eventBus from "@/eventBus.js";

const isFiniteNumber = (v) => typeof v === 'number' && Number.isFinite(v)

export function buildWeather(previousGrid2D, currentGrid2D, currentEventsWeather, currentDateISO) {
    eventBus.emit('log', {engine:'analytics', msg: 'Building Weather Report'})
    const rowsN = currentGrid2D?.length || 0
    const colsN = rowsN ? (currentGrid2D[0]?.length || 0) : 0

    let tilesCompared = 0, tilesLostWater = 0, tilesGainedWater = 0
    let totalDeltaMm = 0, totalLostMm = 0, totalGainedMm = 0

    for (let r = 0; r < rowsN; r++) {
        for (let c = 0; c < colsN; c++) {
            const prev = previousGrid2D?.[r]?.[c]
            const curr = currentGrid2D?.[r]?.[c]
            const pv = prev?.soil?.water?.measured?.value
            const cv = curr?.soil?.water?.measured?.value
            if (!isFiniteNumber(pv) || !isFiniteNumber(cv)) continue

            const d = cv - pv
            tilesCompared += 1
            totalDeltaMm += d
            if (d < 0) { tilesLostWater += 1; totalLostMm += -d }
            else if (d > 0) { tilesGainedWater += 1; totalGainedMm += d }
        }
    }

    const summaryMetrics = {
        tilesCompared,
        tilesLostWater,
        tilesGainedWater,
        totalLostMm: Number(totalLostMm.toFixed(2)),
        totalGainedMm: Number(totalGainedMm.toFixed(2)),
        netDeltaMm: Number(totalDeltaMm.toFixed(2)),
        avgDeltaPerTileMm: tilesCompared ? Number((totalDeltaMm / tilesCompared).toFixed(2)) : 0
    }

    const todayRow = {
        dateISO: currentDateISO,
        label: 'Today',
        metrics: summaryMetrics,
        effects: {}
    }

    const eventsRows = (currentEventsWeather || []).map(e => ({
        id: e.id, headline: e.headline, remaining: e.remaining ?? null
    }))

    return {
        historyDays: [],
        forecastDays: [todayRow],
        eventsRows
    }
}
