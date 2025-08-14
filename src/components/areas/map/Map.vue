<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import eventBus from '@/eventBus.js'
import { gameStore } from '@/stores/game.js'
import { mapStore } from '@/stores/map.js'
import { recalculateTileValues } from '@/calc/recalculateTileValues.js'
import { produceReport } from '@/calc/produceReport.js'

import ControlPanel from '@/components/areas/map/panels/Control.vue'
import WeatherPanel from '@/components/areas/map/panels/Weather.vue'
import PlayerPanel from '@/components/areas/map/panels/Player.vue'
import ResourcesPanel from '@/components/areas/map/panels/Resources.vue'

import EventLog from '@/components/modals/EventLog.vue'
import AnalyticsReport from '@/components/modals/AnalyticsReport.vue'
import AssembliesMenu from '@/components/areas/map/menus/operations/AssembliesMenu.vue'
import AnimalsMenu from '@/components/areas/map/menus/optimizations/AnimalsMenu.vue'
import PlantsMenu from '@/components/areas/map/menus/optimizations/PlantsMenu.vue'
import FarmGate from '@/components/areas/map/menus/operations/FarmGate.vue'



const show = ref({ log: false, analytics: false, animals: false, plants: false, assemblies: false, gate: false, control: true, weather: true, player: true, resources: true })

const gameState = gameStore()
const map = mapStore()
function handlePhaseChange () {
  const engines = gameState.engines
  const next = ((gameState.turnPhase + 1) % engines.length + engines.length) % engines.length

  if (next === 0) {
    gameState.currentDay += 1
    eventBus.emit('log', { engine: 'analytics', msg: 'Day ' + gameState.currentDay + ' in the biorome' })
    recalculateTileValues()
    eventBus.emit('log', { engine: 'analytics', msg: 'Recalculated entity values, producing report' })
    produceReport()
    eventBus.emit('menu', { target: 'analytics', show: true })
    eventBus.emit('menu', { target: 'assemblies', show: false })
    eventBus.emit('menu', { target: 'gate', show: false })
  } else if (next === 1) {
    eventBus.emit('log', { engine: 'optimizations', msg: 'Running simulations...' })
    eventBus.emit('menu', { target: 'animals', show: true })
    eventBus.emit('menu', { target: 'plants', show: true })
    eventBus.emit('menu', { target: 'analytics', show: false })
  } else if (next === 2) {
    eventBus.emit('log', { engine: 'operations', msg: 'Executing instructions...' })
    eventBus.emit('menu', { target: 'assemblies', show: true })
    eventBus.emit('menu', { target: 'gate', show: true })
    eventBus.emit('menu', { target: 'animals', show: false })
    eventBus.emit('menu', { target: 'plants', show: false })
  }

  gameState.turnPhase = next
}

function toggleMenu (menu) {
  const target = menu.target
  const explicit = menu.show
  const current = show.value[target]
  show.value[target] = explicit === undefined ? !current : !!explicit
}

function togglePanel (payload) {
  const target = payload.target
  const explicit = payload.show
  const current = show.value[target]
  show.value[target] = explicit === undefined ? !current : !!explicit
}

onMounted(() => {
  eventBus.on('menu', toggleMenu)
  eventBus.on('panel', togglePanel)
  eventBus.on('phase', handlePhaseChange)
  if (gameState.turnPhase === -1) handlePhaseChange()
})

onBeforeUnmount(() => {
  eventBus.off('menu', toggleMenu)
  eventBus.off('panel', togglePanel)
  eventBus.off('phase', handlePhaseChange)
})
</script>

<template>
  <!-- Map.vue panels block -->
  <div class="panels">
    <ControlPanel  :collapsed="!show.control" />
    <WeatherPanel  :collapsed="!show.weather" />
    <PlayerPanel   :collapsed="!show.player" />
    <ResourcesPanel :collapsed="!show.resources" />
  </div>

  <!-- Dummy tiles until terrain generation -->
  <div class="tiles">
    <div v-for="tileRow in map.tiles" :key="tileRow[0]?.row">
      <div v-for="tile in tileRow" :key="`${tile.row}-${tile.col}`" class="tile">
        {{ tile.row }}, {{ tile.col }}*
      </div>
    </div>
  </div>
<div class="menus">
  <EventLog v-if="show.log" />
  <AnalyticsReport v-if="show.analytics" />
  <AnimalsMenu v-if="show.animals" />
  <PlantsMenu v-if="show.plants" />
  <AssembliesMenu v-if="show.assemblies" />
  <FarmGate v-if="show.gate" />
</div>
</template>

<style scoped>
.panels { display: flex; gap: 8px; margin-bottom: 8px; }
.tiles { display: flex; flex-wrap: wrap; }
.tile { display: flex; flex: 1; border: 1px solid black; }
</style>
