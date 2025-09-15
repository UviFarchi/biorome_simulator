<script setup>
import {reactive, computed, onMounted, onBeforeUnmount, watch, ref} from 'vue'
import eventBus from '@/eventBus.js'
import {gameStore} from '@/stores/game.js'
import {clearSavedStores, loadAllStores} from '@/utils/persistance.js'
import { formatDateLocale, formatDateTime } from '@/utils/formatting.js'
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

function toggleTheme() {
  game.currentTheme = game.currentTheme === 'dark' ? 'light' : 'dark'
}

watch(() => game.currentTheme, (val) => {
  document.documentElement.dataset.theme = val
}, { immediate: true })
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
            <button role="menuitem"
                    :class="{ active: game.currentTheme === 'light' }"
                    @click.stop="toggleTheme">
              Light Theme
            </button>
          </div>
        </div>
      </div>
      <div class="subpanel">
        <div class="subpanel-title">Layout</div>
        <div class="layout-controls">
          <button class="app-button layout-btn" @click.stop="eventBus.emit('layout','single')" title="Single width">
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
          <button class="app-button layout-btn" @click.stop="eventBus.emit('layout','double')" title="Double width">
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
          <button class="app-button layout-btn" @click.stop="eventBus.emit('layout','full')" title="Full width">
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
        <button id="assemblyStation" class="app-button" @click.stop="eventBus.emit('nav', 'assembly')">Assembly Station</button>
      </div>
    </div>
    <div class="centerPanel">
      <div class="subpanel">
        <div class="controlItem"   v-show="allowedSet.has('weather')">
          <button id="showWeather" class="app-button"
                  :class="stateClass('weather')"

                  @click.stop="eventBus.emit('overlay', { target: 'weather' })">
          </button>
          <div class="app-label">Weather</div>
        </div>
        <div class="controlItem"  v-show="allowedSet.has('news')">
          <button id="showNews" class="app-button"
                  :class="stateClass('news')"

                  @click.stop="eventBus.emit('overlay', { target: 'news' })">
          </button>


          <div class="app-label">News</div>
        </div>
        <hr/>
        <div class="controlItem" v-show="allowedSet.has('log')">
          <button id="showLog" class="app-button"
                  :class="stateClass('log')"

                  @click.stop="eventBus.emit('overlay', { target: 'log' })">
          </button>
          <div class="app-label">Log</div>
        </div>
        <div class="controlItem" v-show="allowedSet.has('analytics')">
          <button id="showAnalytics" class="app-button"
                  :class="stateClass('analytics')"

                  @click.stop="eventBus.emit('overlay', { target: 'analytics' })">
          </button>

          <div class="app-label">Analytics</div>
        </div>
        <hr/>
        <div class="controlItem" v-show="allowedSet.has('market')">
          <button id="showMarket" class="app-button"
                  :class="stateClass('market')"

                  @click.stop="eventBus.emit('overlay', { target: 'market' })">
          </button>
          <div class="app-label">Market</div>
        </div>
        <div class="controlItem" v-show="allowedSet.has('gate')">
          <button id="showGate" class="app-button"
                  :class="stateClass('gate')"

                  @click.stop="eventBus.emit('overlay', { target: 'gate' })">
          </button>
          <div class="app-label">Gate</div>
        </div>
        <hr/>
        <div class="controlItem"  v-show="allowedSet.has('animals')">
          <button id="showAnimals" class="app-button"
                  :class="stateClass('animals')"

                  @click.stop="eventBus.emit('overlay', { target: 'animals' })">
          </button>
          <div class="app-label">Animals</div>
        </div>
        <div class="controlItem"  v-show="allowedSet.has('plants')">
          <button id="showPlants" class="app-button"
                  :class="stateClass('plants')"

                  @click.stop="eventBus.emit('overlay', { target: 'plants' })">
          </button>
          <div class="app-label">Plants</div>
        </div>
        <div class="controlItem"   v-show="allowedSet.has('assemblies')">
          <button id="showAssemblies" class="app-button"
                  :class="stateClass('assemblies')"

                  @click.stop="eventBus.emit('overlay', { target: 'assemblies' })">
          </button>

          <div class="app-label">Assemblies</div>
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
        <button class="app-button next-phase-btn" @click.stop="eventBus.emit('phase',{})">Next</button>
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
  border-bottom: 2px solid var(--color-border);
  background-color: color-mix(in srgb, var(--color-text) 50%, var(--color-background));
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
  border: 2px solid var(--color-border);
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
  color: var(--color-background);
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
  background: var(--color-background);
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
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 6px;
}

.optionsMenu button {
  width: 100%;
}

.optionsMenu button.active {
  background: var(--color-highlight);
}

.menu-wrap:focus-within .optionsMenu {
  display: block;
}

/* === Control items: round bulbs with labels === */
.controlItem {
  text-align: center;
}


.infoScreen {
  background-color: var(--color-background);
  position: relative;
  padding: 5px;
  border: 5px inset var(--color-background);
  height: 75%;
  width: 5vw;
  text-align: left;
  font-size: medium;
  color: var(--color-success);
  aspect-ratio: 4/3;
  line-height: 1.25rem;
  word-break: break-word;
}

#assemblyStation {
  border-radius: 100%;
  height: 7vh;
  width: 7vh;
  color: var(--color-background);
  font-weight: lighter;
  text-shadow: 0 0 5px var(--color-text);
  background-color: color-mix(in srgb, var(--color-text) 50%, var(--color-background));
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

.next-phase-btn {
  border-radius: 5vh;
  height: 5vh;
  width: 5vh;
  margin: 0;
  background: color-mix(in srgb, var(--color-background) 75%, transparent);
  color: var(--color-text);
}

.layout-controls {
  flex: 0 0 100%;
  z-index: 2;
  display: flex;
  gap: 6px;
  color: var(--color-success);
  margin-bottom: 10px;
  justify-content: space-evenly;
  width: 10vw;
}

.layout-btn {
  display: flex;
  background: color-mix(in srgb, var(--color-text) 50%, var(--color-background));
  border: 2px outset var(--color-background);
  cursor: pointer;
  padding: 3px;
  font-family: monospace;
  width: auto;
  height: auto;
  border-radius: var(--radius);
}

.layout-btn svg {
  color: var(--color-background);
}


</style>
