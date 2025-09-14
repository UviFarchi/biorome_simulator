// engine/phases/analytics/buildWeather.js
import { mapStore } from '@/stores/map.js';
import eventBus from '@/eventBus.js';

export function buildWeather(_currentTiles, currentEventsWeather, currentDateISO) {
    eventBus.emit('log', { engine: 'analytics', msg: 'Building Weather Report' });

    const map = mapStore();
    const cw  = map.currentWeather.value || {};

    const todayRow = {
        dateISO: currentDateISO,
        label: cw.currentLabel?.label || 'Today',
        metrics: {
            temperatureC: cw.temperature ?? null,
            rainfallMm:   cw.rainfall ?? null,
            cloudPct:     Math.round(((cw.cloudCover ?? 0) * 100)),
            windKph:      cw.windKph ?? null,
            humidityPct:  Math.round(((cw.relHumidity ?? 0) * 100))
        },
        effects: {}
    };

    const historyDays  = map.weatherHistory.value || [];
    const forecastDays = [todayRow, ...((map.weatherForecast.value || []))];

    const eventsRows = (currentEventsWeather || []).map(e => ({
        id: e.id,
        headline: e.headline,
        remaining: e.remaining ?? null
    }));

    return { historyDays, forecastDays, eventsRows };
}
