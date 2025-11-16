import { mapStore } from '@/stores/map.js';
import eventBus from '@/eventBus.js';
import { formatNumber } from '@/utils/formatting.js';

const DEFAULT_WINDOW = 7;

function avg(values) {
  if (!values.length) return null;
  const total = values.reduce((sum, v) => sum + v, 0);
  return total / values.length;
}

export function buildWeather(_currentTiles, currentEventsWeather, currentDateISO) {
  eventBus.emit('log', { engine: 'analytics', msg: 'Building Weather Report' });

  const map = mapStore();
  const cw = map.currentWeather.value || {};
  const fmt = (v, digits = 1) => (Number.isFinite(v) ? formatNumber(v, digits) : '—');

  const history = (map.weatherHistory.value || []).slice(-DEFAULT_WINDOW);
  const historyTemps = history
    .map((d) => Number(d.temperature ?? d.temperatureC))
    .filter((v) => Number.isFinite(v));
  const historyRain = history
    .map((d) => Number(d.rainfall ?? d.rainfallMm))
    .filter((v) => Number.isFinite(v));
  const avgTemp = avg(historyTemps);
  const avgRain = avg(historyRain);

  const todayMetrics = {
    temperatureC: Number(cw.temperature ?? cw.temperatureC ?? null),
    rainfallMm: Number(cw.rainfall ?? cw.rainfallMm ?? null),
    cloudPct: Math.round((cw.cloudCover ?? 0) * 100),
    windKph: Number(cw.windKph ?? cw.windSpeed ?? null),
    humidityPct: Math.round((cw.relHumidity ?? cw.humidity ?? 0) * 100),
  };

  const anomalyRows = [];
  if (Number.isFinite(todayMetrics.temperatureC) && Number.isFinite(avgTemp)) {
    const delta = todayMetrics.temperatureC - avgTemp;
    if (Math.abs(delta) >= 3) {
      anomalyRows.push(['Temperature', `${delta > 0 ? '+' : ''}${fmt(delta, 1)} °C vs 7-day avg`]);
    }
  }
  if (Number.isFinite(todayMetrics.rainfallMm) && Number.isFinite(avgRain)) {
    const delta = todayMetrics.rainfallMm - avgRain;
    if (Math.abs(delta) >= 5) {
      anomalyRows.push(['Rainfall', `${delta > 0 ? '+' : ''}${fmt(delta, 1)} mm vs 7-day avg`]);
    }
  }

  const summarySimpleTable = {
    headers: ['Metric', 'Value'],
    rows: [
      ['Today temperature', `${fmt(todayMetrics.temperatureC)} °C`],
      ['7-day avg temperature', `${fmt(avgTemp)} °C`],
      ['Today rainfall', `${fmt(todayMetrics.rainfallMm)} mm`],
      [
        '7-day rainfall total',
        `${fmt(
          historyRain.reduce((s, v) => s + v, 0),
          1
        )} mm`,
      ],
      ['Wind speed', `${fmt(todayMetrics.windKph)} km/h`],
      ['Humidity', `${fmt(todayMetrics.humidityPct)}%`],
    ],
  };

  const anomaliesTable = {
    headers: ['Signal', 'Delta'],
    rows: anomalyRows.length ? anomalyRows : [['No notable anomalies', '—']],
  };

  const todayRow = {
    dateISO: currentDateISO,
    label: cw.currentLabel?.label || 'Today',
    metrics: todayMetrics,
  };

  const forecastDays = [todayRow, ...(map.weatherForecast.value || [])];
  const historyDays = history;

  const eventsRows = (currentEventsWeather || []).map((e) => ({
    id: e.id,
    headline: e.headline,
    remaining: e.remaining ?? null,
  }));

  return { summarySimpleTable, anomaliesTable, historyDays, forecastDays, eventsRows };
}
