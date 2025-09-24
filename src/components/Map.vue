<script setup>
import {onMounted, onBeforeUnmount, ref, computed, watch} from 'vue'
import eventBus from '@/eventBus.js'
import {gameStore} from '@/stores/game.js'
import {mapStore} from '@/stores/map.js'

import ControlPanel from '@/components/grid/Controls.vue'
import WeatherPanel from '@/components/menus/Weather.vue'
import EventLog from '@/components/menus/EventLog.vue'
import AnalyticsReport from '@/components/menus/AnalyticsReport.vue'
import AssembliesMenu from '@/components/menus/AssembliesMenu.vue'
import AnimalsMenu from '@/components/menus/AnimalsMenu.vue'
import PlantsMenu from '@/components/menus/PlantsMenu.vue'
import FarmGate from '@/components/menus/FarmGate.vue'
import TilesGrid from '@/components/grid/TilesGrid.vue'
import {loadAllStores, saveAllStores} from '@/utils/persistance.js'
import News from '@/components/menus/News.vue'
import {produceReport} from '@/engine/phases/analytics/produceReport.js';
import updateGame from '@/engine/simulationUpdate/updateGame.js';
// TODO => Add coverage % mechanic to plants, and adjust seed and seedling prices to coverage, as well as yield.
const game = gameStore()
const map = mapStore()
const currentPhaseLabel = computed(() => game.engines[(game.phase) % game.engines.length])

/* ---------------- Open/close truth per overlay ---------------- */
const show = ref({
  log: false, analytics: false, animals: false, plants: false, assemblies: false,
  gate: false, weather: false, resources: false, news: false
})

/* ---------------- Lane manager (placement + order) ---------------- */
const lanes = ref({
  left: [],               // visual order
  right: [],
  sideByKey: Object.create(null), // key -> 'left' | 'right'
  nextSide: 'left',
})

/* ---------------- Registry for dynamic components ---------------- */
const compByKey = {
  weather: WeatherPanel,
  log: EventLog,
  analytics: AnalyticsReport,
  animals: AnimalsMenu,
  plants: PlantsMenu,
  assemblies: AssembliesMenu,
  gate: FarmGate,
  news: News
}

/* ---------------- Layout modes: singleWidth | doubleWidth | fullWidth ---------------- */
const doubleWidth = ref(false)
const fullWidth = ref(false)
const isSingleWidth = computed(() => !doubleWidth.value && !fullWidth.value)

/** Move all overlays from right → left (preserve order and open/close state). */
function moveAllRightToLeft() {
  const s = lanes.value
  if (!s.right.length) return
  const moving = [...s.right]
  for (const key of moving) {
    removeFromLane(key)
    s.sideByKey[key] = 'left'
    s.left.push(key)
  }
  s.right.length = 0
}

/** Explicitly set layout: 'single' | 'double' | 'full'. */
function setLayoutWidth(mode) {
  if (mode === 'full') {
    fullWidth.value = true
    doubleWidth.value = false
    moveAllRightToLeft()
  } else if (mode === 'double') {
    doubleWidth.value = true
    fullWidth.value = false
    moveAllRightToLeft()
  } else {
    // singleWidth
    doubleWidth.value = false
    fullWidth.value = false
  }
}



/* ---------------- Lane placement helpers ---------------- */
function addToLane(key) {
  const s = lanes.value
  if (s.sideByKey[key]) return
  let side
  if (!isSingleWidth.value) {
    side = 'left' // double/full modes render only left lane
  } else {
    const l = s.left.length, r = s.right.length
    if (l < r) side = 'left'
    else if (r < l) side = 'right'
    else {
      side = s.nextSide;
      s.nextSide = (s.nextSide === 'left' ? 'right' : 'left')
    }
  }
  s.sideByKey[key] = side
  s[side].push(key)
}

function removeFromLane(key) {
  const s = lanes.value
  const side = s.sideByKey[key]
  if (!side) return
  const arr = s[side]
  const i = arr.indexOf(key)
  if (i !== -1) arr.splice(i, 1)
  delete s.sideByKey[key]
}

/* ---------------- Overlay open/close API (via eventBus) ---------------- */
function toggleOverlay({target, show: explicit}) {
  if (!(target in show.value)) return
  const next = explicit === undefined ? !show.value[target] : !!explicit
  show.value[target] = next
  next ? addToLane(target) : removeFromLane(target)
}

/* ---------------- Reordering + switching lanes ---------------- */
function moveOverlay(key, dir) {
  const s = lanes.value
  const side = s.sideByKey[key]
  if (!side) return
  const arr = s[side]
  const i = arr.indexOf(key);
  if (i === -1) return
  const j = i + (dir === 'up' ? -1 : 1)
  if (j < 0 || j >= arr.length) return
      ;
  [arr[i], arr[j]] = [arr[j], arr[i]]
}

function switchLane(key) {
  if (!isSingleWidth.value) return // disabled in double/full
  const s = lanes.value
  const from = s.sideByKey[key]
  if (!from) return
  const arr = s[from]
  const i = arr.indexOf(key);
  if (i === -1) return
  arr.splice(i, 1)
  const to = from === 'left' ? 'right' : 'left'
  s.sideByKey[key] = to
  s[to].push(key)
}

function handlePhaseChange() {
  eventBus.emit('spinner', true)
  const engines = game.engines
  const next = ((game.phase + 1) % engines.length + engines.length) % engines.length

  const on = (target) => eventBus.emit('overlay', {target, show: true, enable: true})
  const off = (target) => eventBus.emit('overlay', {target, show: false, enable: true})
  const disable = (target) => eventBus.emit('overlay', {target, show: false, enable: false})

  if (next === 0) { // Phase 0 — Analytics
    // auto-open
    on('log')
    setLayoutWidth('single')
    // available but closed
    off('analytics');
    off('weather');
    off('news');
    // not allowed
    disable('animals');
    disable('plants');
    disable('resources');
    disable('assemblies');
    disable('gate')

    eventBus.emit('log', {engine: 'analytics', msg: 'Day ' + game.currentTurn + ' in the biorome'})
    setTimeout(async () => {
      await updateGame();
      produceReport()
    }, 1)

  } else if (next === 1) { // Phase 1 — Optimization
    setLayoutWidth('single')
    // auto-open planners
    on('animals');
    on('plants');
    on('assemblies');
    // available but closed
    off('weather');
    off('news');
    off('analytics');
    off('log')
    // not allowed

    disable('gate')

    eventBus.emit('log', {engine: 'optimizations', msg: 'Running simulations...'})

  } else if (next === 2) { // Phase 2 — Operations
    setLayoutWidth('double')
    off('weather');
    off('news');
    off('log');
    on('gate');
    off('analytics');
    off('animals');
    off('plants');
    on('assemblies');

    disable('resources');
    eventBus.emit('log', {engine: 'operations', msg: 'Executing instructions...'})
  }

  game.phase = next
  saveAllStores()
  setTimeout(() => {
    eventBus.emit('spinner', false)
  }, 1000)
}



onMounted(() => {
  eventBus.on('overlay', toggleOverlay)
  eventBus.on('phase', handlePhaseChange)
  eventBus.on('layout', setLayoutWidth)
  loadAllStores()
})

onBeforeUnmount(() => {
  eventBus.off('overlay', toggleOverlay)
  eventBus.off('phase', handlePhaseChange)
  eventBus.off('layout', setLayoutWidth)
  })


</script>

<template>
  <div class="mapWrapper" :class="currentPhaseLabel + 'Background'">
    <ControlPanel class="control"/>

    <!-- content wrapper: add fullscreen class -->
    <div class="content" :class="{
  'doubleWidth': doubleWidth,
  'fullWidth': fullWidth
}">
      <!-- Left lane -->
      <div class="lane left">

        <div v-for="k in lanes.left" :key="'L-'+k" class="overlay-wrapper">
          <div class="overlay-controls">
            <button @click="moveOverlay(k, 'up')">↑</button>
            <button @click="moveOverlay(k, 'down')">↓</button>
            <button v-if="isSingleWidth" @click="switchLane(k)" aria-label="Switch lane">→</button>
          </div>
          <component :is="compByKey[k]" v-show="show[k]" class="overlay"/>
        </div>
      </div>

      <!-- Grid -->
      <TilesGrid class="grid"/>

      <!-- Right lane -->
      <div class="lane right">
        <div v-for="k in lanes.right" :key="'R-'+k" class="overlay-wrapper">
          <div class="overlay-controls">
            <button @click="moveOverlay(k, 'up')">↑</button>
            <button @click="moveOverlay(k, 'down')">↓</button>
            <button @click="switchLane(k)" aria-label="Switch lane">←</button>
          </div>
          <component :is="compByKey[k]" v-show="show[k]" class="overlay"/>
        </div>
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
  height: 100%;
}

/* page layout: top bar + content row */
.mapWrapper {
  display: grid;
  grid-template-rows: 10vh 1fr;
  height: 100vh;

}

/* three columns: left lane | grid | right lane */
.content {
  display: grid;
  grid-template-columns: 1fr max-content 1fr; /* center sizes to grid’s content */
  align-items: start;
  height: 100%;
  gap: 18px;
  padding: 18px 22px;
  background: color-mix(in srgb, var(--color-background) 80%, transparent);
  overflow: hidden; /* keep the page from double-scrolling */
  box-sizing: border-box;
}

/* grid sits centered and can scroll if taller than viewport */
.grid {
  overflow: auto;
  z-index: 1;
  background: black !important;
}

/* lanes fill leftover space on both sides */
.lane {
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0;
  height: 100%;
  padding: 4px 0;
  overflow: hidden; /* let overlays handle their own scroll */
  overscroll-behavior: contain; /* keep scroll in lane */
  z-index: 2;
}

/* every overlay takes proportional height and scrolls inside itself */
.overlay-wrapper {
  flex: 1 1 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.overlay-controls {
  flex: 0 0 auto;
  display: flex;
  gap: 6px;
}

.overlay-controls button {
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text);
  padding: 0.3rem 0.55rem;
  border-radius: var(--radius);
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease, transform 0.1s ease;
}

.overlay-controls button:hover,
.overlay-controls button:focus-visible {
  background: color-mix(in srgb, var(--color-accent) 12%, var(--color-surface));
  border-color: color-mix(in srgb, var(--color-accent) 24%, var(--color-border));
  outline: none;
  transform: translateY(-1px);
}

.overlay {
  flex: 1 1 0;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  border-radius: var(--radius);
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  box-shadow: 0 18px 36px color-mix(in srgb, var(--color-shadow-neutral) 12%, transparent);
  pointer-events: auto;
}

/*  unify inner body scrolling if components expose .overlay-body */
:deep(.overlay-body) {
  display: flex;
  flex-direction: column;
  min-height: 0;
}

:deep(.overlay-body > .scroll-area) {
  flex: 1 1 auto;
  min-height: 0;
  overflow: auto;
}

/* Double width (left lane wider; right lane hidden; grid shrinks) */
.content.doubleWidth {
  grid-template-columns: 2fr max-content 0fr;
}

.content.doubleWidth .lane.right {
  display: none;
}

.content.doubleWidth .grid {
  justify-self: end;
}

/* Full width (left lane covers content row; grid + right hidden) */
.content.fullWidth {
  grid-template-columns: 1fr 0 0;
}

.content.fullWidth .grid {
  display: none;
}

.content.fullWidth .lane.right {
  display: none;
}


</style>
