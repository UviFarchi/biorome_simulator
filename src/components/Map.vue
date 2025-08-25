<script setup>
import {onMounted, onBeforeUnmount, ref, nextTick} from 'vue'
import eventBus from '@/eventBus.js'
import {gameStore} from '@/stores/game.js'
import {mapStore} from '@/stores/map.js'
import ControlPanel from '@/components/grid/Controls.vue'
import WeatherPanel from '@/components/overlays/Weather.vue'
import EventLog from '@/components/overlays/EventLog.vue'
import AnalyticsReport from '@/components/overlays/AnalyticsReport.vue'
import AssembliesMenu from '@/components/overlays/AssembliesMenu.vue'
import AnimalsMenu from '@/components/overlays/AnimalsMenu.vue'
import PlantsMenu from '@/components/overlays/PlantsMenu.vue'
import FarmGate from '@/components/overlays/FarmGate.vue'
import TilesGrid from '@/components/grid/TilesGrid.vue';
import {saveAllStores, loadAllStores} from '@/utils.js'
import TileInfo from "@/components/overlays/TileInfo.vue";
import updateGame from "@/engine/updateGame.js";
import Market from "@/components/overlays/Market.vue";
import ResourcesMenu from "@/components/overlays/ResourcesMenu.vue";
import News from "@/components/overlays/News.vue";


const show = ref({
  log: false,
  analytics: false,
  animals: false,
  plants: false,
  assemblies: false,
  gate: false,
  weather: false,
  resources: false,
  tileInfo: false,
  market: false,
  news: false
})

const game = gameStore()
const map = mapStore()

function handlePhaseChange() {
  const engines = game.engines
  const next = ((game.turnPhase + 1) % engines.length + engines.length) % engines.length

  const on  = (target) => eventBus.emit('overlay', { target, show: true,  enable: true })
  const off = (target) => eventBus.emit('overlay', { target, show: false, enable: true })
  const disable = (target) => eventBus.emit('overlay', { target, show: false, enable: false })

  if (next === 0) { // Phase 0 — Analytics
    // auto-open
    on('log')
    // available but closed
    off('analytics'); off('weather'); off('news');  off('market'); off('tileInfo')
    // not allowed
    disable('animals'); disable('plants'); disable('resources'); disable('assemblies'); disable('gate')

    eventBus.emit('log', { engine: 'analytics', msg: 'Day ' + game.currentTurn + ' in the biorome' })
    setTimeout(() => { updateGame() }, 500)

  } else if (next === 1) { // Phase 1 — Optimization
    // auto-open planners
    on('animals'); on('plants'); on('resources')
    // available but closed
    off('tileInfo'); off('weather'); off('news'); off('market'); off('analytics'); off('log')
    // not allowed
    disable('assemblies'); disable('gate')

    eventBus.emit('log', { engine: 'optimizations', msg: 'Running simulations...' })

  } else if (next === 2) { // Phase 2 — Operations
    // auto-open ops
    on('assemblies'); on('gate')
    // available but closed
    off('tileInfo'); off('weather'); off('news'); off('market'); off('log')
    // not allowed
    disable('animals'); disable('plants'); disable('resources'); disable('analytics')

    eventBus.emit('log', { engine: 'operations', msg: 'Executing instructions...' })
  }

  game.turnPhase = next
}



function toggleOverlay(menu) {

  const target = menu.target
  const explicit = menu.show
  const current = show.value[target]
  show.value[target] = explicit === undefined ? !current : !!explicit
}

onMounted(() => {

  eventBus.on('overlay', toggleOverlay)
  eventBus.on('phase', handlePhaseChange)
  loadAllStores()
})

onBeforeUnmount(() => {
  eventBus.off('overlay', toggleOverlay)
  eventBus.off('phase', handlePhaseChange)
})
</script>

<template>
  <div class="mapWrapper">
    <ControlPanel class="control" />

    <div class="content">
      <!-- left overlays -->
      <div class="lane left">
        <WeatherPanel v-if="show.weather" class="overlay"/>
        <EventLog v-if="show.log" class="overlay"/>
        <AnalyticsReport v-if="show.analytics" class="overlay"/>
        <ResourcesMenu v-if="show.resources" class="overlay"/>
      </div>

      <!-- grid takes only what it needs -->
      <TilesGrid class="grid"/>

      <!-- right overlays -->
      <div class="lane right">
        <TileInfo v-if="show.tileInfo" class="overlay"/>
        <Market v-if="show.market" class="overlay"/>
        <AnimalsMenu v-if="show.animals" class="overlay"/>
        <PlantsMenu v-if="show.plants" class="overlay"/>
        <AssembliesMenu v-if="show.assemblies" class="overlay"/>
        <FarmGate v-if="show.gate" class="overlay"/>
        <News v-if="show.news" class="overlay"/>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* top bar */
.control {
  position: sticky;
  top: 0;
  z-index: 3;
}

/* page layout: top bar + content row */
.mapWrapper {
  display: grid;
  grid-template-rows: max-content 1fr;
  height: 100vh;
}

/* three columns: left lane | grid | right lane */
.content {
  display: grid;
  grid-template-columns: 1fr max-content 1fr; /* center sizes to grid’s content */
  align-items: start;


  overflow: hidden; /* keep the page from double-scrolling */
}

/* grid sits centered and can scroll if taller than viewport */
.grid {
  overflow: auto;
  z-index: 1;
}

/* lanes fill leftover space on both sides */
.lane {
  display: grid;
  grid-auto-rows: max-content;
  align-content: start;
  gap: 8px;
  min-width: 0;
  max-height: calc(100vh);
  overflow: auto;               /* lane scroll */
  overscroll-behavior: contain; /* keep scroll in lane */
  z-index: 2;
}

/* every overlay scrolls inside itself and never overflows outside its lane */
.overlay {
  max-height: 100%;
  overflow: auto;
  border-radius: 12px;
  pointer-events: auto;
}

/*  unify inner body scrolling if components expose .overlay-body */
:deep(.overlay-body) { display:flex; flex-direction:column; min-height:0; }
:deep(.overlay-body > .scroll-area) { flex:1 1 auto; min-height:0; overflow:auto; }

</style>
