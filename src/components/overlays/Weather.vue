<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import eventBus from '@/eventBus.js'
import { gameStore } from '@/stores/game.js'
import { mapStore } from '@/stores/map.js'
import simpleTable from '@/components/overlays/blocks/SimpleTable.vue'
import weatherDays from '@/components/overlays/blocks/WeatherDays.vue'

const game = gameStore()
const map = mapStore()

const { currentSeason } = storeToRefs(game)
const { currentWeather, weatherHistory, weatherForecast } = storeToRefs(map)

// unwrap current weather fields
const temperature = computed(() => currentWeather.value?.temperature)
const rainfall    = computed(() => currentWeather.value?.rainfall)
const cloudCover  = computed(() => currentWeather.value?.cloudCover)
const windSpeed     = computed(() => currentWeather.value?.windSpeed)
const relHumidity = computed(() => currentWeather.value?.relHumidity)
const currentLabel = computed(() => currentWeather.value?.currentLabel)

const cloudPct = computed(() => Math.round(((cloudCover.value ?? 0) * 100)))
const humidityPct = computed(() => Math.round(((relHumidity.value ?? 0) * 100)))

// SimpleTable: current stats
const statsHeaders = ['Metric', 'Value']
const statsRows = computed(() => ([
  ['Temp', `${temperature.value ?? '—'}°C`],
  ['Rain', `${rainfall.value ?? '—'} mm`],
  ['Cloud', `${cloudPct.value}%`],
  ['Wind', `${windSpeed.value ?? '—'} km/h`],
  ['Humidity', `${humidityPct.value}%`]
]))

// WeatherDays: use store history + forecast
const historyDays = computed(() => weatherHistory.value || [])
const forecastDays = computed(() => weatherForecast.value || [])
</script>

<template>
  <div id="weatherPanel" class="panel">
    <div class="panel-header" @click="eventBus.emit('overlay', { target: 'weather' })">
      Weather
    </div>

    <div class="panel-body">
      <div class="controlsRow">
        <div id="season" class="controlButton">
          {{ currentSeason.icon }}{{ currentSeason.label }}
        </div>
        <div id="weather" class="controlButton">
          {{ currentLabel?.icon || '' }}{{ currentLabel?.label || '—' }}
        </div>
      </div>

      <simpleTable
          title="Current stats"
          :headers="statsHeaders"
          :data="statsRows"
          :startOpen="true"
          class="noToggle"
      />

      <weatherDays
          title="Weather History"
          :data="historyDays"
          :startOpen="true"
          class="noToggle"
      />

      <weatherDays
          title="Weather Forecast"
          :data="forecastDays"
          :startOpen="true"
          class="noToggle"
      />
    </div>
  </div>
</template>

<style scoped>
.controlsRow { display: flex; gap: 6px; margin-bottom: 8px; }
</style>
