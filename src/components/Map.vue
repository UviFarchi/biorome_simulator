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
import TilesGrid from '@/components/grid/TilesGrid.vue';
import {saveAllStores, loadAllStores} from '@/utils.js'
import TileInfo from "@/components/modals/TileInfo.vue";
import updateGame from "@/calc/updateGame.js";


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
  tileInfo: false,
  tilesGrid:false
})

const game = gameStore()
const map = mapStore()

function handlePhaseChange() {
  const engines = game.engines
  const next = ((game.turnPhase + 1) % engines.length + engines.length) % engines.length;

  if (next === 0) {
    updateGame();
    eventBus.emit('log', {engine: 'analytics', msg: 'Day ' + game.currentDay + ' in the biorome'})
    eventBus.emit('log', {engine: 'analytics', msg: 'Recalculated entity values, producing report'})
    eventBus.emit('menu', {target: 'analytics', show: true})
    eventBus.emit('menu', {target: 'assemblies', show: false})
    eventBus.emit('menu', {target: 'gate', show: false})
  } else if (next === 1) {
    eventBus.emit('log', {engine: 'optimizations', msg: 'Running simulations...'})
    eventBus.emit('menu', {target: 'animal', show: true})
    eventBus.emit('menu', {target: 'plant', show: true})
    eventBus.emit('menu', {target: 'analytics', show: false})
  } else if (next === 2) {
    eventBus.emit('log', {engine: 'operations', msg: 'Executing instructions...'})
    eventBus.emit('menu', {target: 'assemblies', show: true})
    eventBus.emit('menu', {target: 'gate', show: true})
    eventBus.emit('menu', {target: 'animal', show: false})
    eventBus.emit('menu', {target: 'plant', show: false})
  }

  game.turnPhase = next
}

function toggleMenu(menu) {
  console.log("menu: ", menu)
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


function handleModalState(modal, payload) {
  const target = modal.target;
  const explicit = modal.show;
  const current = show.value[target];
  console.log(target)
  show.value[target] = explicit === undefined ? !current : !!explicit
}


onMounted(() => {

  eventBus.on('menu', toggleMenu)
  eventBus.on('panel', togglePanel)
  eventBus.on('phase', handlePhaseChange)
  eventBus.on('modal', handleModalState)
 loadAllStores()
  console.log('autostart')
  handlePhaseChange()

})

onBeforeUnmount(() => {
  eventBus.off('menu', toggleMenu)
  eventBus.off('panel', togglePanel)
  eventBus.off('phase', handlePhaseChange)
  eventBus.off('modal', handleModalState)
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
    <TileInfo v-if="show.tileInfo"></TileInfo>
  </div>

  <div class="menus">
    <AnimalsMenu v-if="show.animal"/>
    <PlantsMenu v-if="show.plant"/>
    <AssembliesMenu v-if="show.assemblies"/>
    <FarmGate v-if="show.gate"/>
  </div>
</template>

<style scoped>

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

</style>
