<script setup>
import {reactive, computed, onMounted, onBeforeUnmount, watch, ref} from 'vue'
import eventBus from '@/eventBus.js'
import {gameStore} from '@/stores/game.js'
import {clearSavedStores, loadAllStores} from '@/utils/persistance.js'
import { formatDateLocale, formatDateTime } from '@/utils/formatting.js'
import { themeStore } from '@/stores/theme.js'

const game = gameStore()
const phase = computed(() => game.phase)
const currentPhaseLabel = computed(() => game.engines[(phase.value) % game.engines.length])
const nextPhaseLabel = computed(() => game.engines[(phase.value + 1) % game.engines.length])

const userName = computed(() => game.userName)
const userAvatar = computed(() => game.userAvatar)
const gold = computed(() => game.gold)
const stageLabel = computed(() => game.bioromizationStages[game.bioromizationStage] || 'discovery')

// Active highlight per overlay (toggled via existing `overlay` events)
const open = reactive({
  weather: false, news: false, log: false, analytics: false,
  market: false, gate: false, animals: false, plants: false, assemblies: false
})
const bioromeTest = ref(false)
const theme = themeStore()
const themeLabel = computed(() => theme.theme === 'light' ? 'Dark Mode' : 'Light Mode')
// Enable/disable per phase (matrix)
const allowedSet = computed(() => {
  if (phase.value === 0) {
    return new Set(['weather', 'news', 'log', 'analytics', 'market']) // analytics enabled, user may open
  } else if (phase.value === 1) {
    return new Set(['weather', 'news', 'log', 'analytics', 'market', 'animals', 'plants', 'assemblies'])
  } else { // phase 2
    return new Set(['weather', 'news', 'log', 'market', 'assemblies', 'gate'])
  }
})

// Keep highlights consistent when phase changes
watch(allowedSet, (allow) => {
  Object.keys(open).forEach(k => {
    if (!allow.has(k)) open[k] = false
  })
}, {immediate: true})

// Reflect overlay toggles (same event you already emit)
function onOverlay({target, show}) {
  if (!(target in open)) return
  if (typeof show === 'boolean') open[target] = !!show
  else open[target] = !open[target]
}

const stateClass = (key) =>
    allowedSet.value.has(key) ? (open[key] ? 's-active' : 's-idle') : 's-disabled'
onMounted(() => eventBus.on('overlay', onOverlay))
onBeforeUnmount(() => eventBus.off('overlay', onOverlay))

function restart() {
  clearSavedStores()
  eventBus.emit('nav', 'start')
  window.location.reload()
}

const spinnerOn = ref(false);

function toggleSpinner(on) {
  spinnerOn.value = on
}

onMounted(() => {
  eventBus.on('spinner', toggleSpinner)
  loadAllStores()
})

onBeforeUnmount(() => {
  eventBus.off('spinner', toggleSpinner)
})

/*** TEST MODE ***/
import { mapStore } from '@/stores/map.js'
import { makeInstance } from '@/engine/phases/optimizations/biotaFactories.js'
import { measureTileProperty } from '@/utils/tileHelpers.js'
import {makeAssembly} from '@/engine/phases/operations/assemblyFactory.js';

const map = mapStore()


let phaseHandler = null

function getGrid() {
  return Array.isArray(map.tiles) ? map.tiles : map.tiles?.value
}

function addTestEntitiesToTile(row, col) {
  const tile = getGrid()?.[row]?.[col]
  tile.plants.real.push(makeInstance('plant', 'tomato', 'mature'))
  tile.animals.real.push(makeInstance('animal', 'cow', 'heifer'))
  let testAssembly = makeAssembly('Test Assembly',  [{type: 'transport'}, {type: 'battery'}, {type: 'cart'}, { type: 'arm',subtype: 'heavy'}])
  console.log(testAssembly)
  tile.assemblies.real.push(testAssembly)
}

function removeTestEntitiesFromTile(row, col) {
  const tile = getGrid()?.[row]?.[col]
  if (Array.isArray(tile.plants.real))  tile.plants.real  = tile.plants.real.filter(p => !(p.type === 'tomato' && p.growthStage === 'mature'))
  if (Array.isArray(tile.animals.real)) tile.animals.real = tile.animals.real.filter(a => !(a.type === 'cow' && a.growthStage === 'heifer'))
  if (Array.isArray(tile.assemblies.real)) tile.assemblies.real = tile.assemblies.real.filter(a => !(a.name === 'Test Assembly'))

}

/* -------- measure everything on a tile -------- */

function measureBlock(blockName, blockObj) {
  for (const key in blockObj) {
    const prop = blockObj[key]
    if (prop && prop.measured && 'env' in prop) {
      measureTileProperty(prop, `${blockName}.${key}`)
    }
  }
}

function measureBiotaArray(typeName, arr) {
  if (!Array.isArray(arr)) return
  for (const item of arr) {
    for (const key in item) {
      const node = item[key]
      if (node && node.measured && 'env' in node) {
        measureTileProperty(node, `${typeName}.${key}`)
      }
      if (node && typeof node === 'object' && !('measured' in node)) {
        for (const subKey in node) {
          const sub = node[subKey]
          if (sub && sub.measured && 'env' in sub) {
            measureTileProperty(sub, `${typeName}.${key}.${subKey}`)
          }
        }
      }
    }
  }
}

function measureAllTilesOnce() {
  const grid = getGrid()
  if (!grid) return
  for (const row of grid) {
    for (const tile of row) {
      measureBlock('topography', tile.topography)
      measureBlock('soil',        tile.soil)
      measureBlock('resources',   tile.resources)
      measureBiotaArray('plants',  tile.plants?.real)
      measureBiotaArray('animals', tile.animals?.real)
    }
  }
}

/* -------- phase-driven test mode -------- */

function startTestingSync() {
  addTestEntitiesToTile(2, 1)
  measureAllTilesOnce()
  // handle both empty payloads and payloads that include phase
  phaseHandler = () => {

    if (game.phase < 1) measureAllTilesOnce()
  }

  eventBus.on('phase', phaseHandler)
}

function stopTestingSync() {
  if (phaseHandler) eventBus.off('phase', phaseHandler)
  phaseHandler = null
  removeTestEntitiesFromTile(2, 1)
}

// keep your existing test toggle
watch(bioromeTest, on => (on ? startTestingSync() : stopTestingSync()), { immediate: true })
onBeforeUnmount(stopTestingSync)



</script>


<template>

  <div id="controlPanel">
    <div class="left-panel">
      <div class="subpanel">
        <div class="menu-wrap">
          <button class="hamburger" aria-label="More">☰</button>
          <div class="optionsMenu" role="menu">
            <button role="menuitem" @click.stop="restart">Restart</button>
            <button role="menuitem">Tutorial Mode</button>
            <button role="menuitem"
                    :class="{ active: bioromeTest }"
                    @click.stop="bioromeTest = !bioromeTest">
              Testing Mode
            </button>
            <button role="menuitem" @click.stop="theme.toggle()">{{ themeLabel }}</button>
          </div>
        </div>
      </div>
      <div class="subpanel">
        <div class="subpanel-title">Layout</div>
        <div class="layout-controls">
          <button class="layout-btn" @click.stop="eventBus.emit('layout','single')" title="Single width">
            <svg width="48" height="30" viewBox="0 0 48 30" fill="none" role="img" aria-labelledby="singleLayoutTitle"
                 focusable="false" style="pointer-events:none">
              <title id="singleLayoutTitle">Single layout</title>
              <!-- frame -->
              <rect x="0.5" y="0.5" width="47" height="29" stroke="currentColor" stroke-width="1" fill="none"/>
              <!-- lanes -->
              <rect x="0.5" y="0.5" width="14" height="29" fill="currentColor" fill-opacity="0.85"/>
              <rect x="33.5" y="0.5" width="14" height="29" fill="currentColor" fill-opacity="0.85"/>
              <!-- grid (center 19 units wide) -->
              <g stroke="currentColor" stroke-opacity="0.55" stroke-width="1" stroke-linecap="square">
                <!-- horizontals -->
                <line x1="14.5" y1="10.5" x2="33.5" y2="10.5"/>
                <line x1="14.5" y1="20.5" x2="33.5" y2="20.5"/>
                <!-- verticals -->
                <line x1="19.5" y1="0.5" x2="19.5" y2="29.5"/>
                <line x1="24.5" y1="0.5" x2="24.5" y2="29.5"/>
                <line x1="29.5" y1="0.5" x2="29.5" y2="29.5"/>
              </g>
            </svg>
          </button>
          <button class="layout-btn" @click.stop="eventBus.emit('layout','double')" title="Double width">
            <svg width="48" height="30" viewBox="0 0 48 30" fill="none" role="img" aria-labelledby="doubleLayoutTitle"
                 focusable="false" style="pointer-events:none">
              <title id="doubleLayoutTitle">Double layout</title>
              <!-- frame -->
              <rect x="0.5" y="0.5" width="47" height="29" stroke="currentColor" stroke-width="1" fill="none"/>
              <!-- wide left lane -->
              <rect x="0.5" y="0.5" width="28" height="29" fill="currentColor" fill-opacity="0.85"/>
              <!-- narrow grid on right (14 units) -->
              <g stroke="currentColor" stroke-opacity="0.55" stroke-width="1" stroke-linecap="square">
                <!-- horizontals -->
                <line x1="28.5" y1="10.5" x2="47.5" y2="10.5"/>
                <line x1="28.5" y1="20.5" x2="47.5" y2="20.5"/>
                <!-- verticals -->
                <line x1="33.5" y1="0.5" x2="33.5" y2="29.5"/>
                <line x1="38.5" y1="0.5" x2="38.5" y2="29.5"/>
                <line x1="43.5" y1="0.5" x2="43.5" y2="29.5"/>
              </g>
            </svg>
          </button>
          <button class="layout-btn" @click.stop="eventBus.emit('layout','full')" title="Full width">
            <svg width="48" height="30" viewBox="0 0 48 30" fill="none" role="img" aria-labelledby="fullLayoutTitle"
                 focusable="false" style="pointer-events:none">
              <title id="fullLayoutTitle">Full layout</title>
              <!-- frame -->
              <rect x="0.5" y="0.5" width="47" height="29" stroke="currentColor" stroke-width="1" fill="none"/>
              <!-- full-width lane -->
              <rect x="0.5" y="0.5" width="47" height="29" fill="currentColor" fill-opacity="0.85"/>
            </svg>
          </button>
        </div>
      </div>
      <div class="subpanel">
        <button id="assemblyStation" @click.stop="eventBus.emit('nav', 'assembly')">Assembly Station</button>
      </div>
    </div>
    <div class="centerPanel">
      <div class="subpanel">
        <div class="controlItem">
          <button id="showWeather" class="controlButton"
                  :class="stateClass('weather')"
                  :disabled="!allowedSet.has('weather')"
                  @click.stop="eventBus.emit('overlay', { target: 'weather' })">
          </button>
          <div class="label">Weather</div>
        </div>
        <div class="controlItem">
          <button id="showNews" class="controlButton"
                  :class="stateClass('news')"
                  :disabled="!allowedSet.has('news')"
                  @click.stop="eventBus.emit('overlay', { target: 'news' })">
          </button>


          <div class="label">News</div>
        </div>
        <hr/>
        <div class="controlItem">
          <button id="showLog" class="controlButton"
                  :class="stateClass('log')"
                  :disabled="!allowedSet.has('log')"
                  @click.stop="eventBus.emit('overlay', { target: 'log' })">
          </button>
          <div class="label">Log</div>
        </div>
        <div class="controlItem">
          <button id="showAnalytics" class="controlButton"
                  :class="stateClass('analytics')"
                  :disabled="!allowedSet.has('analytics')"
                  @click.stop="eventBus.emit('overlay', { target: 'analytics' })">
          </button>

          <div class="label">Analytics</div>
        </div>
        <hr/>
        <div class="controlItem">
          <button id="showMarket" class="controlButton"
                  :class="stateClass('market')"
                  :disabled="!allowedSet.has('market')"
                  @click.stop="eventBus.emit('overlay', { target: 'market' })">
          </button>
          <div class="label">Market</div>
        </div>
        <div class="controlItem">
          <button id="showGate" class="controlButton"
                  :class="stateClass('gate')"
                  :disabled="!allowedSet.has('gate')"
                  @click.stop="eventBus.emit('overlay', { target: 'gate' })">
          </button>
          <div class="label">Gate</div>
        </div>
        <hr/>
        <div class="controlItem">
          <button id="showAnimals" class="controlButton"
                  :class="stateClass('animals')"
                  :disabled="!allowedSet.has('animals')"
                  @click.stop="eventBus.emit('overlay', { target: 'animals' })">
          </button>
          <div class="label">Animals</div>
        </div>
        <div class="controlItem">
          <button id="showPlants" class="controlButton"
                  :class="stateClass('plants')"
                  :disabled="!allowedSet.has('plants')"
                  @click.stop="eventBus.emit('overlay', { target: 'plants' })">
          </button>
          <div class="label">Plants</div>
        </div>
        <div class="controlItem">
          <button id="showAssemblies" class="controlButton"
                  :class="stateClass('assemblies')"
                  :disabled="!allowedSet.has('assemblies')"
                  @click.stop="eventBus.emit('overlay', { target: 'assemblies' })">
          </button>

          <div class="label">Assemblies</div>
        </div>
      </div>

    </div>
    <div class="right-panel">
      <div class="subpanel">
        <div class="infoScreen" title="Gold">Operator:<br/>{{ userAvatar }} {{ userName }} <br/>💰{{ gold }}</div>
        <div class="infoScreen">Stage: <br/> {{ stageLabel?.toUpperCase() }}</div>
          <div class="infoScreen">Date:<br/>{{
              formatDateLocale(game.currentDate)
            }}<br/>Turn:{{ game.currentTurn }}
          </div>
        <div class="infoScreen">Phase:<br/>{{ currentPhaseLabel?.toUpperCase() }}</div>


      </div>
      <div class="subpanel nextPhaseBg" :class="(spinnerOn) ? 'active' : 'inactive'"
           :title='"Next Phase:\n" + nextPhaseLabel'>
        <button id="nextPhaseBtn" @click.stop="eventBus.emit('phase',{})">Next</button>
      </div>
    </div>
  </div>


</template>


<style scoped>
/* BAR: three columns; center grows */
#controlPanel {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 6px 10px;
  height: 10vh;
  border-bottom: 2px solid #2a2f2a;
  background-color: grey;
}

/* columns */
.left-panel,
.right-panel {
  flex: 0 0 auto; /* width = content */
  display: flex;
  align-items: center;
  gap: 12px;
}

.centerPanel {
  flex: 1 1 auto; /* takes remaining space */
  display: flex;
  justify-content: center; /* keeps bulbs centered */
  align-items: center;
  gap: 12px;
  min-width: 0; /* prevents overflow push */
}

/* subpanels: use your image */
.subpanel {
  position: relative;
  display: flex;
  align-items: center;
  gap: 6px;
  height: 8vh;
  padding: 6px 10px;
  border: 2px solid #1f231f;
  border-radius: 8px;
  /*background-image: url("@/assets/steel_plate.png");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;*/
  flex-wrap: wrap;
}

.subpanel .subpanel-title {
  flex: 0 0 100%;
  text-align: center;
  font-weight: bold;
  pointer-events: none;
  color: black;
  padding: 0;
  margin: 0;
}

.subpanel hr {

  all: unset;
  display: block;
  flex: 0 0 2px;
  align-self: center;
  height: 80%;
  margin: 0 10px;
  background: black;
  border-radius: 2px;
}


.menu-wrap {
  position: relative;
}

.optionsMenu {
  position: absolute;
  margin: 0;
  bottom: -16vh;
  left: -10px;
  height: 12vh;
  width: 100px;
  display: none;
  background: #1a1f1a;
  border: 1px solid #2a2f2a;
  border-radius: 8px;
  padding: 6px;
}

.optionsMenu button {
  width: 100%;
}

.optionsMenu button.active {
  background: #97ffb0;
}

.menu-wrap:focus-within .optionsMenu {
  display: block;
}

/* === Control items: round bulbs with labels === */
.controlItem {
  text-align: center;
}

.controlButton {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid #202420;
  background: #0a0d0a;
  position: relative;
  cursor: pointer;
  transition: transform .05s ease, filter .12s ease;
}

/* states */
.controlButton.s-disabled {
  background: #7b1e1e;
  border-color: #612525;
  box-shadow: inset 0 2px 6px rgba(0, 0, 0, .7),
  0 0 8px 2px rgba(200, 40, 40, .35);
  cursor: not-allowed;
}

.controlButton.s-idle {
  background: #7a5702;
  border-color: #6e5a2c;
  box-shadow: inset 0 2px 6px rgba(0, 0, 0, .6),
  0 0 10px 2px rgba(255, 170, 0, .4);
}

.controlButton.s-active {
  background: #0f7a39;
  border-color: #1d6f3c;
  box-shadow: inset 0 2px 6px rgba(0, 0, 0, .6),
  0 0 14px 4px rgba(80, 255, 120, .5);
}

/* labels follow state color */
.label {
  margin-top: 4px;
  font-family: ui-monospace, Menlo, monospace;
  font-size: 0.8em;
  color: #cfd3cf;
  box-shadow: inset 10px 50px rgba(0, 0, 0, 0.5);
  border: 2px inset black;
  padding: 0 3px;
}

.controlButton.s-disabled + .label {
  color: #ff8c8c;
  text-shadow: 0 0 3px rgba(255, 90, 90, .35);

}

.controlButton.s-idle + .label {
  color: #ffd27a;
  text-shadow: 0 0 3px rgba(255, 200, 90, .35);
}

.controlButton.s-active + .label {
  color: #97ffb0;
  text-shadow: 0 0 3px rgba(100, 255, 140, .35);
}


.infoScreen {
  background-color: black;
  position: relative;
  padding: 5px;
  border: 5px inset black;
  height: 75%;
  width: 5vw;
  text-align: left;
  font-size: medium;
  color: limegreen;
  aspect-ratio: 4/3;
  line-height: 1.25rem;
  word-break: break-word;
}

#assemblyStation {
  border-radius: 100%;
  height: 7vh;
  width: 7vh;
  color: black;
  font-weight: lighter;
  text-shadow: 0 0 5px white;
  background-color: silver;
}

.nextPhaseBg {
  background-image: url("@/assets/gears.png");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  width: 6vw;
  display: flex;
  align-items: center;
  justify-items: center;
  flex-direction: column;
  filter: saturate(0.2);

}

.nextPhaseBg.active {
  background-image: url("@/assets/gears.gif");
}

#nextPhaseBtn {
  border-radius: 5vh;
  height: 5vh;
  width: 5vh;
  margin: 0;
  background: rgba(0, 0, 0, 0.75);
  color: white;
}

.layout-controls {
  flex: 0 0 100%;
  z-index: 2;
  display: flex;
  gap: 6px;
  color: limegreen;
  margin-bottom: 10px;
  justify-content: space-evenly;
  width: 10vw;
}

.layout-btn {
  display: flex;
  background: silver;
  border: 2px outset black;
  cursor: pointer;
  padding: 3px;
  font-family: monospace;
}

.layout-btn svg {
  color: black;
}


</style>
