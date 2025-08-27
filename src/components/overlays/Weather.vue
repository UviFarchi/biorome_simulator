<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import eventBus from '@/eventBus.js'
import { gameStore } from '@/stores/game.js'
import { weatherStore } from '@/stores/weather.js'

//TODO => Remake with blocks to unify look, extract as much CSS as possible to main
const game = gameStore()
const weather = weatherStore()

const { currentSeason } = storeToRefs(game)
const { temperature, rainfall, cloudCover, windKph, relHumidity, currentLabel } = storeToRefs(weather)

const cloudPct = computed(() => Math.round(cloudCover.value * 100))
const humidityPct = computed(() => Math.round(relHumidity.value * 100))

const weatherTooltip = computed(() =>
    `Weather affects soil, plants, and animals
Temp: ${temperature.value}°C
Rain: ${rainfall.value} mm
Cloud: ${cloudPct.value}%
Wind: ${windKph.value} km/h
Humidity: ${humidityPct.value}%`
)
</script>

<template>
  <div id="weatherPanel" class="panel">
    <div class="panel-header" @click="eventBus.emit('overlay', { target: 'weather' })">Weather</div>
    <div class="panel-body">
      <div id="season" class="controlButton">{{ currentSeason.icon }}{{ currentSeason.label }}</div>
      <div id="weather" class="controlButton" :title="weatherTooltip">
        {{ currentLabel.icon }}{{ currentLabel.label }}
      </div>

      <div class="metrics">
        <div><strong>Temp</strong> {{ temperature }}°C</div>
        <div><strong>Rain</strong> {{ rainfall }} mm</div>
        <div><strong>Cloud</strong> {{ cloudPct }}%</div>
        <div><strong>Wind</strong> {{ windKph }} km/h</div>
        <div><strong>Humidity</strong> {{ humidityPct }}%</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.metrics { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 4px; margin-top: 6px; }
.metrics div { border-top: 1px solid white; padding: 4px; }
</style>
