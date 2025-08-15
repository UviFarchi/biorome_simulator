<script setup>
import {onMounted, onBeforeUnmount, ref, nextTick} from 'vue'
import eventBus from '@/eventBus.js'
import {gameStore} from '@/stores/game.js'
import {mapStore} from '@/stores/map.js'
import {recalculateTileValues} from '@/calc/recalculateTileValues.js'
import {produceReport} from '@/calc/produceReport.js'

import ControlPanel from '@/components/panels/Control.vue'
import WeatherPanel from '@/components/panels/Weather.vue'
import PlayerPanel from '@/components/panels/Player.vue'
import ResourcesPanel from '@/components/panels/Resources.vue'

import EventLog from '@/components/modals/EventLog.vue'
import AnalyticsReport from '@/components/modals/AnalyticsReport.vue'
import AssembliesMenu from '@/components/menus/operations/AssembliesMenu.vue'
import AnimalsMenu from '@/components/menus/optimizations/AnimalsMenu.vue'
import PlantsMenu from '@/components/menus/optimizations/PlantsMenu.vue'
import FarmGate from '@/components/menus/operations/FarmGate.vue'
import TilesGrid from "@/components/map/TilesGrid.vue";
import TileModal from "@/components/modals/TileModal.vue";
import {saveAllStores, loadAllStores} from '@/utils.js'

const show = ref({
  log: false,
  analytics: false,
  animals: false,
  plants: false,
  assemblies: false,
  gate: false,
  control: true,
  weather: true,
  player: true,
  resources: true,
  tileModal: false
})

const gameState = gameStore()
const map = mapStore()

function handlePhaseChange() {
  const engines = gameState.engines
  const next = ((gameState.turnPhase + 1) % engines.length + engines.length) % engines.length;

  if (next === 0) {
    gameState.currentDay += 1;
    saveAllStores();
    eventBus.emit('log', {engine: 'analytics', msg: 'Day ' + gameState.currentDay + ' in the biorome'})
    recalculateTileValues()
    eventBus.emit('log', {engine: 'analytics', msg: 'Recalculated entity values, producing report'})
    produceReport()
    eventBus.emit('menu', {target: 'analytics', show: true})
    eventBus.emit('menu', {target: 'assemblies', show: false})
    eventBus.emit('menu', {target: 'gate', show: false})
    saveAllStores();
  } else if (next === 1) {
    eventBus.emit('log', {engine: 'optimizations', msg: 'Running simulations...'})
    eventBus.emit('menu', {target: 'animals', show: true})
    eventBus.emit('menu', {target: 'plants', show: true})
    eventBus.emit('menu', {target: 'analytics', show: false})
  } else if (next === 2) {
    eventBus.emit('log', {engine: 'operations', msg: 'Executing instructions...'})
    eventBus.emit('menu', {target: 'assemblies', show: true})
    eventBus.emit('menu', {target: 'gate', show: true})
    eventBus.emit('menu', {target: 'animals', show: false})
    eventBus.emit('menu', {target: 'plants', show: false})
  }

  gameState.turnPhase = next
}

function toggleMenu(menu) {
  const target = menu.target
  const explicit = menu.show
  const current = show.value[target]
  show.value[target] = explicit === undefined ? !current : !!explicit
}

function togglePanel(panel) {
  const target = panel.target
  const explicit = panel.show
  const current = show.value[target]
  show.value[target] = explicit === undefined ? !current : !!explicit
}

function toggleModal(modal) {
  const target = modal.target
  const explicit = modal.show
  const current = show.value[target]
  show.value[target] = explicit === undefined ? !current : !!explicit
}

function handleTileClick(tile) {
  map.selectedTile.value = tile;
  toggleModal({target: "tileModal", show: "true"})
}


onMounted(() => {

  eventBus.on('menu', toggleMenu)
  eventBus.on('panel', togglePanel)
  eventBus.on('phase', handlePhaseChange)
  eventBus.on('tileModal', handleTileClick)
  const hydrated = loadAllStores()
  if (!hydrated) {
    nextTick(() => {
      handlePhaseChange()
    })
  }
})

onBeforeUnmount(() => {
  eventBus.off('menu', toggleMenu)
  eventBus.off('panel', togglePanel)
  eventBus.off('phase', handlePhaseChange)
  eventBus.off('tileModal', handleTileClick)
})
</script>

<template>
  <!-- Map.vue panels block -->
  <div class="panels">
    <ControlPanel :collapsed="!show.control"/>
    <WeatherPanel :collapsed="!show.weather"/>
    <PlayerPanel :collapsed="!show.player"/>
    <ResourcesPanel :collapsed="!show.resources"/>
  </div>
  <div class="grid-area">
    <TilesGrid/>

  </div>
  <div class="modals">
    <EventLog v-if="show.log"/>
    <AnalyticsReport v-if="show.analytics"/>
    <TileModal v-if="show.tileModal"></TileModal>
  </div>

  <div class="menus">
    <AnimalsMenu v-if="show.animals"/>
    <PlantsMenu v-if="show.plants"/>
    <AssembliesMenu v-if="show.assemblies"/>
    <FarmGate v-if="show.gate"/>
  </div>
</template>

<style scoped>
.map-root {
  display: grid;
  grid-template-rows:auto 1fr auto;
  height: 100vh;
  overflow: hidden;
}

.grid-area {
  position: relative;
  height: 100%;
}

.panels, .menus, .modals {
  position: absolute;
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
  z-index: 10000;
}

.modals {
  bottom: 0;
}

.menus {
  bottom: 0;
  right: 0;
}

.terrain-overlay {
  text-align: center;
  vertical-align: center;
  height: 100%;
}
</style>
