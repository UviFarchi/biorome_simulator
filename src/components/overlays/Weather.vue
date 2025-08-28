<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import eventBus from '@/eventBus.js'
import { gameStore } from '@/stores/game.js'
import { weatherStore } from '@/stores/weather.js'
import simpleTable from '@/components/overlays/blocks/SimpleTable.vue'
import weatherDays from '@/components/overlays/blocks/WeatherDays.vue'

// TODO => Remake with blocks to unify look, extract as much CSS as possible to main
const game = gameStore()
const weather = weatherStore()

const { currentSeason } = storeToRefs(game)
const { temperature, rainfall, cloudCover, windKph, relHumidity, currentLabel } = storeToRefs(weather)

const cloudPct = computed(() => Math.round((cloudCover.value ?? 0) * 100))
const humidityPct = computed(() => Math.round((relHumidity.value ?? 0) * 100))

// SimpleTable: current stats
const statsHeaders = ['Metric', 'Value']
const statsRows = computed(() => ([
  ['Temp', `${temperature.value ?? '—'}°C`],
  ['Rain', `${rainfall.value ?? '—'} mm`],
  ['Cloud', `${cloudPct.value}%`],
  ['Wind', `${windKph.value ?? '—'} km/h`],
  ['Humidity', `${humidityPct.value}%`]
]))

// WeatherDays: history + forecast (same shape as analytics)
const historyDays = computed(() => game.analyticsReport?.weather?.history || [])
const forecastDays = computed(() => game.analyticsReport?.weather?.forecast || [])



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
          {{ currentLabel.icon }}{{ currentLabel.label }}
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
