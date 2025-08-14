<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
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

const show = ref({ log: false, analytics: false, animals: false, plants: false, assemblies: false, gate: false })
const collapsed = ref({ control: false, weather: false, player: false, resources: false })
const gameState = gameStore()

async function handlePhaseChange () {
  if (gameState.turnPhase < 0) { eventBus.emit('nav', 'start'); return }
  gameState.turnPhase++
  if (gameState.turnPhase > 2) gameState.turnPhase = 0
  switch (gameState.turnPhase) {
    case 0:
      gameState.currentDay++
      eventBus.emit('log', { engine: 'analytics', msg: 'Day ' + gameState.currentDay + ' in the biorome' })
      recalculateTileValues()
      eventBus.emit('log', { engine: 'analytics', msg: 'Recalculated entity values, producing report' })
      produceReport()
      eventBus.emit('menu', { target: 'analytics', show: true })
      eventBus.emit('menu', { target: 'assemblies', show: false })
      eventBus.emit('menu', { target: 'gate', show: false })
      break
    case 1:
      eventBus.emit('log', { engine: 'optimizations', msg: 'Running simulations...' })
      eventBus.emit('menu', { target: 'animals', show: true })
      eventBus.emit('menu', { target: 'plants', show: true })
      eventBus.emit('menu', { target: 'analytics', show: false })
      break
    case 2:
      eventBus.emit('log', { engine: 'operations', msg: 'Executing instructions...' })
      eventBus.emit('menu', { target: 'assemblies', show: true })
      eventBus.emit('menu', { target: 'gate', show: true })
      eventBus.emit('menu', { target: 'animals', show: false })
      eventBus.emit('menu', { target: 'plants', show: false })
      break
  }
}

function toggleMenu (menu) {
  let target = menu.target
  let shown = menu.show
  if (shown === undefined) shown = !show.value[target]
  show.value[target] = shown
}

function handlePanelToggle (payload) {
  const { id, collapsed: isCollapsed } = payload
  if (!Object.prototype.hasOwnProperty.call(collapsed.value, id)) return
  collapsed.value[id] = isCollapsed
}

function handleRestart () {
  localStorage.removeItem('bioromeUser')
  window.location.reload()
}

onMounted(() => {
  eventBus.on('menu', toggleMenu)
  eventBus.on('phase', handlePhaseChange)
})
onBeforeUnmount(() => {
  eventBus.off('menu', toggleMenu)
  eventBus.off('phase', handlePhaseChange)
})
</script>

<template>
  <div class="panels">
    <ControlPanel
        :collapsed="collapsed.control"
        @panel="handlePanelToggle"
        @restart="handleRestart"
        @show-log="eventBus.emit('menu', { target: 'log' })"
        @show-analytics="eventBus.emit('menu', { target: 'analytics' })"
        @next-phase="eventBus.emit('phase', {})"
    />
    <WeatherPanel :collapsed="collapsed.weather" @panel="handlePanelToggle" />
    <PlayerPanel :collapsed="collapsed.player" @panel="handlePanelToggle" />
    <ResourcesPanel :collapsed="collapsed.resources" @panel="handlePanelToggle" />
  </div>

  <div class="tiles">
    <div v-for="tileRow in mapStore().tiles">
      <div v-for="tile in tileRow" class="tile">
        {{ tile.row }}, {{ tile.col }}*
      </div>
    </div>
  </div>

  <EventLog v-if="show.log" />
  <AnalyticsReport v-if="show.analytics" />
  <AnimalsMenu v-if="show.animals" />
  <PlantsMenu v-if="show.plants" />
  <AssembliesMenu v-if="show.assemblies" />
  <FarmGate v-if="show.gate" />
</template>

<style scoped>
.panels { display: flex; gap: 8px; margin-bottom: 8px; }
.tiles { display: flex; flex-wrap: wrap; }
.tile { display: flex; flex: 1; border: 1px solid black; }
</style>
