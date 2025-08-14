<script setup>
import { defineProps, defineEmits, ref, computed } from 'vue'
import { gameStore } from '@/stores/game.js'
import { weatherStore } from '@/stores/weather.js'
import { resourceStore } from '@/stores/resources.js' // not used here, but left if you later show water usage

const props = defineProps({ collapsed: { type: Boolean, default: false } })
const emit = defineEmits(['panel'])

const gameState = gameStore()
const weatherStats = weatherStore()

const startDate = ref(new Date(gameState.startDate))
const dayNumber = computed(() => (gameState.currentDay ?? 0) + 1)
const inGameDate = computed(() => {
  const d = new Date(startDate.value)
  d.setDate(d.getDate() + (dayNumber.value - 1))
  return d
})
const dateText = computed(() => inGameDate.value.toLocaleDateString('en-US', { month: 'long', day: 'numeric' }))
const season = computed(() => {
  const month = inGameDate.value.getMonth() + 1
  if (month === 12 || month === 1 || month === 2) return { label: 'Winter', icon: '❄️' }
  if (month >= 3 && month <= 5) return { label: 'Spring', icon: '🌸' }
  if (month >= 6 && month <= 8) return { label: 'Summer', icon: '☀️' }
  if (month >= 9 && month <= 11) return { label: 'Autumn', icon: '🍂' }
  return { label: 'Unknown', icon: '' }
})
const weather = computed(() => {
  const t = weatherStats.temperature
  const r = weatherStats.rainfall
  const c = weatherStats.cloudCover
  if (t < -5 && r === 0 && c > 0.4) return { label: 'Freezing Fog', icon: '🌫️' }
  if (t < 2 && r > 2) return { label: 'Snowy', icon: '❄️' }
  if (t < 2 && r > 0) return { label: 'Sleet', icon: '🌨️' }
  if (t < 5 && r === 0 && c > 0.6) return { label: 'Frosty', icon: '🧊' }
  if (r > 20) return { label: 'Heavy Rain', icon: '🌧️' }
  if (r > 5) return { label: 'Rainy', icon: '🌦️' }
  if (r > 0 && c > 0.5) return { label: 'Showers', icon: '🌦️' }
  if (c > 0.85 && t > 0) return { label: 'Overcast', icon: '☁️' }
  if (c > 0.6) return { label: 'Cloudy', icon: '☁️' }
  if (t > 32 && r === 0) return { label: 'Scorching', icon: '🔥' }
  if (t > 27 && r === 0 && c < 0.2) return { label: 'Hot', icon: '🌞' }
  if (t > 22 && r === 0 && c < 0.4) return { label: 'Sunny', icon: '☀️' }
  if (t < 5 && r === 0 && c < 0.2) return { label: 'Frosty', icon: '🧊' }
  if (c < 0.2 && r === 0) return { label: 'Clear', icon: '🌄' }
  if (c > 0.3 && c < 0.7 && r === 0) return { label: 'Partly Cloudy', icon: '🌤️' }
  return { label: 'Mild', icon: '🌤️' }
})
const weatherTooltip = computed(() =>
    `Weather affects soil, plants, and animals
Temp: ${weatherStats.temperature}°C
Rain: ${weatherStats.rainfall}mm
Cloud: ${Math.round(weatherStats.cloudCover * 100)}%`
)
function togglePanel() { emit('panel', { id: 'weather', collapsed: !props.collapsed }) }
</script>

<template>
  <div id="weatherPanel" class="panel">
    <div class="panel-header" @click="togglePanel">Weather</div>
    <div v-if="!collapsed" class="panel-body">
      <div id="day" class="statusBarCell">📅{{ dateText }}</div>
      <div id="season" class="statusBarCell">{{ season.icon }}{{ season.label }}</div>
      <div id="weather" class="statusBarCell" :title="weatherTooltip">{{ weather.icon }}{{ weather.label }}</div>
    </div>
  </div>
</template>

<style scoped>
.panel { border: 1px solid #000; margin: 0; }
.panel-header { font-weight: bold; padding: 4px; cursor: pointer; }
.statusBarCell { display: flex; justify-content: center; align-items: center; font-weight: bold; border-top: 1px solid #000; padding: 4px; }
</style>
