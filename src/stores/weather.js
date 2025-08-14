import {defineStore} from 'pinia'
import {ref} from 'vue'

export const weatherStore = defineStore('weatherStore', () => {

    const temperature = ref(25) // Celsius
    const rainfall = ref(0)     // mm
    const cloudCover = ref(0.1) // 0 (clear) to 1 (overcast)

    const weatherEvents = // Weather events
        [
            {
            id: 'weather-1',
            type: 'weather',
            season: 'spring',
            headline: 'Steady Showers',
            details: 'Gentle rain soaks the fields. Soil moisture rises.',
            frequency: 0.15,
            duration: 2,
            effect: [{target: 'weather', parameter: 'rainfall', delta: 3}]
        }, {
            id: 'weather-2',
            type: 'weather',
            season: 'spring',
            headline: 'Cool Snap',
            details: 'Night temperatures drop. Growth slows for warm-season crops.',
            frequency: 0.05,
            duration: 2,
            effect: [{target: 'weather', parameter: 'temperature', delta: -4}]
        }, {
            id: 'weather-3',
            type: 'weather',
            season: 'summer',
            headline: 'Drought',
            details: 'A persistent drought dries out the soil. Water demand increases.',
            frequency: 0.08,
            duration: 5,
            effect: [{target: 'weather', parameter: 'rainfall', delta: -3}, {
                target: 'weather',
                parameter: 'temperature',
                delta: 2
            }]
        }, {
            id: 'weather-4',
            type: 'weather',
            season: 'summer',
            headline: 'Heatwave',
            details: 'High temperatures stress both plants and animals.',
            frequency: 0.05,
            duration: 3,
            effect: [{target: 'weather', parameter: 'temperature', delta: 5}]
        }, {
            id: 'weather-5',
            type: 'weather',
            season: 'autumn',
            headline: 'Early Frost',
            details: 'A surprise frost damages tender crops.',
            frequency: 0.04,
            duration: 1,
            effect: [{target: 'weather', parameter: 'temperature', delta: -8}]
        }, {
            id: 'weather-6',
            type: 'weather',
            season: 'winter',
            headline: 'Snowfall',
            details: 'Snow insulates the soil, but harvests must wait.',
            frequency: 0.09,
            duration: 2,
            effect: [{target: 'weather', parameter: 'rainfall', delta: 1}, // snow adds to soil water after melting
                {target: 'weather', parameter: 'temperature', delta: -4}]
        }, {
            id: 'weather-7',
            type: 'weather',
            season: 'spring',
            headline: 'Mild Spring',
            details: 'Perfect weather for planting and growth.',
            frequency: 0.12,
            duration: 3,
            effect: [{target: 'weather', parameter: 'temperature', delta: 2}]
        }, {
            id: 'weather-8',
            type: 'weather',
            season: 'any',
            headline: 'Thunderstorm',
            details: 'Heavy rains and wind. Occasional equipment outages.',
            frequency: 0.03,
            duration: 1,
            effect: [{target: 'weather', parameter: 'rainfall', delta: 5}, {
                target: 'weather',
                parameter: 'cloudCover',
                delta: 0.4
            }]
        }]
    const seasonalWeather = {
        spring: {
            temperature: {min: 12, max: 22, mean: 17},
            rainfall: {min: 0, max: 8, mean: 2},
            cloudCover: {min: 0.1, max: 0.5, mean: 0.25}
        }, summer: {
            temperature: {min: 20, max: 35, mean: 28},
            rainfall: {min: 0, max: 5, mean: 1},
            cloudCover: {min: 0, max: 0.4, mean: 0.1}
        }, autumn: {
            temperature: {min: 10, max: 24, mean: 16},
            rainfall: {min: 0, max: 10, mean: 3},
            cloudCover: {min: 0.1, max: 0.7, mean: 0.35}
        }, winter: {
            temperature: {min: 1, max: 12, mean: 7},
            rainfall: {min: 0, max: 7, mean: 2},
            cloudCover: {min: 0.3, max: 1, mean: 0.6}
        }
    }
    return {temperature, rainfall, cloudCover, weatherEvents, seasonalWeather}
})
