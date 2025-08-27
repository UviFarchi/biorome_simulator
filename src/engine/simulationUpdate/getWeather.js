import {gameStore} from '@/stores/game.js'
import {weatherStore} from '@/stores/weather.js'

// Catalog (can grow)
const weatherEvents = [
    {
        id: 'weather-1', type: 'weather', season: 'spring', headline: 'Steady Showers',
        details: 'Gentle rain soaks the fields. Soil moisture rises.',
        frequency: 0.15, duration: 2,
        effect: [{target: 'weather', parameter: 'rainfall', delta: 3}]
    },
    {
        id: 'weather-2', type: 'weather', season: 'spring', headline: 'Cool Snap',
        details: 'Night temperatures drop. Growth slows for warm-season crops.',
        frequency: 0.05, duration: 2,
        effect: [{target: 'weather', parameter: 'temperature', delta: -4}]
    },
    {
        id: 'weather-3', type: 'weather', season: 'summer', headline: 'Drought',
        details: 'A persistent drought dries out the soil. Water demand increases.',
        frequency: 1, duration: 5,
        effect: [{target: 'weather', parameter: 'rainfall', delta: -3},
            {target: 'weather', parameter: 'temperature', delta: 2}]
    },
    {
        id: 'weather-4', type: 'weather', season: 'summer', headline: 'Heatwave',
        details: 'High temperatures stress both plant and animal.',
        frequency: 0.05, duration: 3,
        effect: [{target: 'weather', parameter: 'temperature', delta: 5}]
    },
    {
        id: 'weather-5', type: 'weather', season: 'autumn', headline: 'Early Frost',
        details: 'A surprise frost damages tender crops.',
        frequency: 0.04, duration: 1,
        effect: [{target: 'weather', parameter: 'temperature', delta: -8}]
    },
    {
        id: 'weather-6', type: 'weather', season: 'winter', headline: 'Snowfall',
        details: 'Snow insulates the soil, but harvests must wait.',
        frequency: 0.09, duration: 2,
        effect: [{target: 'weather', parameter: 'rainfall', delta: 1},
            {target: 'weather', parameter: 'temperature', delta: -4}]
    },
    {
        id: 'weather-7', type: 'weather', season: 'spring', headline: 'Mild Spring',
        details: 'Perfect weather for planting and growth.',
        frequency: 0.12, duration: 3,
        effect: [{target: 'weather', parameter: 'temperature', delta: 2}]
    },
    {
        id: 'weather-8', type: 'weather', season: 'any', headline: 'Thunderstorm',
        details: 'Heavy rains and wind. Occasional equipment outages.',
        frequency: 0.03, duration: 1,
        effect: [{target: 'weather', parameter: 'rainfall', delta: 5},
            {target: 'weather', parameter: 'cloudCover', delta: 0.4}]
    },
]

// Seasonal baselines (extended to wind and humidity)
const seasonalWeather = {
    spring: {
        temperature: {min: 12, max: 22, mean: 17},
        rainfall: {min: 0, max: 8, mean: 2},
        cloudCover: {min: 0.1, max: 0.5, mean: 0.25},
        windKph: {min: 4, max: 18, mean: 10},
        relHumidity: {min: 0.4, max: 0.8, mean: 0.55},
    },
    summer: {
        temperature: {min: 20, max: 35, mean: 28},
        rainfall: {min: 0, max: 5, mean: 1},
        cloudCover: {min: 0, max: 0.4, mean: 0.1},
        windKph: {min: 2, max: 12, mean: 6},
        relHumidity: {min: 0.25, max: 0.7, mean: 0.45},
    },
    autumn: {
        temperature: {min: 10, max: 24, mean: 16},
        rainfall: {min: 0, max: 10, mean: 3},
        cloudCover: {min: 0.1, max: 0.7, mean: 0.35},
        windKph: {min: 4, max: 20, mean: 11},
        relHumidity: {min: 0.35, max: 0.85, mean: 0.6},
    },
    winter: {
        temperature: {min: 1, max: 12, mean: 7},
        rainfall: {min: 0, max: 7, mean: 2},
        cloudCover: {min: 0.3, max: 1, mean: 0.6},
        windKph: {min: 6, max: 28, mean: 14},
        relHumidity: {min: 0.4, max: 0.95, mean: 0.7},
    },
}

function selectWeatherLabel(temperature, rainfall, cloudCover) {

    switch (true) {
        case (temperature < -5 && rainfall === 0 && cloudCover > 0.4):
            return {label: 'Freezing Fog', icon: '🌫️'}
        case (temperature < 2 && rainfall > 2):
            return {label: 'Snowy', icon: '❄️'}
        case (temperature < 2 && rainfall > 0):
            return {label: 'Sleet', icon: '🌨️'}
        case (temperature < 5 && rainfall === 0 && cloudCover > 0.6):
            return {label: 'Frosty', icon: '🧊'}
        case (rainfall > 20):
            return {label: 'Heavy Rain', icon: '🌧️'}
        case (rainfall > 5):
            return {label: 'Rainy', icon: '🌦️'}
        case (rainfall > 0 && cloudCover > 0.5):
            return {label: 'Showers', icon: '🌦️'}
        case (cloudCover > 0.85 && temperature > 0):
            return {label: 'Overcast', icon: '☁️'}
        case (cloudCover > 0.6):
            return {label: 'Cloudy', icon: '☁️'}
        case (temperature > 32 && rainfall === 0):
            return {label: 'Scorching', icon: '🔥'}
        case (temperature > 27 && rainfall === 0 && cloudCover < 0.2):
            return {label: 'Hot', icon: '🌞'}
        case (temperature > 22 && rainfall === 0 && cloudCover < 0.4):
            return {label: 'Sunny', icon: '☀️'}
        case (temperature < 5 && rainfall === 0 && cloudCover < 0.2):
            return {label: 'Frosty', icon: '🧊'}
        case (cloudCover < 0.2 && rainfall === 0):
            return {label: 'Clear', icon: '🌄'}
        case (cloudCover > 0.3 && cloudCover < 0.7 && rainfall === 0):
            return {label: 'Partly Cloudy', icon: '🌤️'}
        default:
            return {label: 'Mild', icon: '🌤️'}
    }
}

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v))
const jitter = (mean, min, max) => clamp(mean + (Math.random() - 0.5) * (max - min) / 3, min, max)

export default function getWeather() {
    const game = gameStore()
    const weather = weatherStore()

    const seasonKey = (game.currentSeason?.label || '').toLowerCase() || 'spring'
    const season = seasonalWeather[seasonKey] || seasonalWeather.spring

    // 1) Seasonal base draw
    let temperature = Math.round(jitter(season.temperature.mean, season.temperature.min, season.temperature.max))
    let rainfall = Math.round(jitter(season.rainfall.mean, season.rainfall.min, season.rainfall.max))
    let cloudCover = jitter(season.cloudCover.mean, season.cloudCover.min, season.cloudCover.max)
    let windKph = Math.round(jitter(season.windKph.mean, season.windKph.min, season.windKph.max))
    let relHumidity = jitter(season.relHumidity.mean, season.relHumidity.min, season.relHumidity.max)

    // 2) Apply ongoing multi-day currentEvents (today counts), then decrement and prune
    const active = game.currentEvents.weather || []
    const appliedEventIds = []
    for (const ev of active) {
        if (!ev?.effect) continue
        for (const e of ev.effect) {
            if (e.target !== 'weather') continue
            if (e.parameter === 'temperature') temperature += e.delta
            if (e.parameter === 'rainfall') rainfall += e.delta
            if (e.parameter === 'cloudCover') cloudCover += e.delta
            if (e.parameter === 'windKph') windKph += e.delta
            if (e.parameter === 'relHumidity') relHumidity += e.delta
        }
        appliedEventIds.push(ev.id)
    }
    // decrement and prune after applying
    game.currentEvents.weather = active
        .map(ev => ({...ev, remaining: (ev.remaining ?? 0) - 1}))
        .filter(ev => (ev.remaining ?? 0) > 0)


    // 3) Roll at most one new event for today
    const candidates = weatherEvents.filter(w =>
        w.type === 'weather' && (w.season === 'any' || w.season === seasonKey)
    )
    const startedEventIds = []
    for (const w of candidates) {
        if (Math.random() < (w.frequency ?? 0)) {
            // apply immediately
            for (const e of w.effect || []) {
                if (e.target !== 'weather') continue
                if (e.parameter === 'temperature') temperature += e.delta
                if (e.parameter === 'rainfall') rainfall += e.delta
                if (e.parameter === 'cloudCover') cloudCover += e.delta
                if (e.parameter === 'windKph') windKph += e.delta
                if (e.parameter === 'relHumidity') relHumidity += e.delta
            }
            // persist if multi-day
            if ((w.duration ?? 1) > 1) {
                const existing = (game.currentEvents.weather || []).find(ev => ev.id === w.id)
                if (existing) {
                    existing.remaining = Math.max(existing.remaining, (w.duration - 1))
                } else {
                    game.currentEvents.weather.push({
                        id: w.id,
                        type: 'weather',
                        headline: w.headline,
                        remaining: (w.duration - 1),
                        effect: w.effect
                    })
                }
            }
            startedEventIds.push(w.id)
            break // cap at one new event
        }
    }

    // 4) Derive relHumidity if still out of range; clamp all
    // simple humidity proxy if currentEvents/base pushed it out
    if (relHumidity == null) relHumidity = 0.35 + 0.04 * rainfall + 0.5 * cloudCover
    rainfall = Math.max(0, Math.round(rainfall))
    cloudCover = clamp(cloudCover, 0, 1)
    relHumidity = clamp(relHumidity, 0, 1)
    // soft temperature clamp
    const tLo = season.temperature.min - 5
    const tHi = season.temperature.max + 5
    temperature = clamp(temperature, tLo, tHi)
    windKph = Math.max(0, Math.round(windKph))

    // 5) Label via helper
    const label = selectWeatherLabel(temperature, rainfall, cloudCover)

    // 6) Commit to store
    weather.temperature = temperature
    weather.rainfall = rainfall
    weather.cloudCover = cloudCover
    weather.windKph = windKph
    weather.relHumidity = relHumidity
    weather.currentLabel = label

    return {appliedEventIds, startedEventIds}
}
