import {defineStore} from 'pinia'
import {ref} from 'vue'

export const weatherStore = defineStore('weatherStore', () => {

    const temperature = ref(25) // Celsius
    const rainfall = ref(0)     // mm
    const cloudCover = ref(0.1) // 0 (clear) to 1 (overcast)
    const windKph =ref(0)
    const relHumidity = ref(0.5)
    const currentLabel = ref({label: 'Mild', icon: '🌤️'})

    const weatherHistory = []

//TODO => Implement week long weather forecast by generating 7 days of weather, and then vary the forecast daily to get the real weather.
const weatherForecast= []
    return {temperature, rainfall, cloudCover, currentLabel, windKph, relHumidity, weatherHistory, weatherForecast}
})
