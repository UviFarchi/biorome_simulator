<script setup>
import {reactive, computed, onMounted, onBeforeUnmount, watch, ref} from 'vue'
import eventBus from '@/eventBus.js'
import {gameStore} from '@/stores/game.js'
import {clearSavedStores, loadAllStores} from '@/utils/persistance.js'
import { formatDateLocale } from '@/utils/formatting.js'
const game = gameStore()
const phase = computed(() => game.phase)
const currentPhaseLabel = computed(() => game.engines[(phase.value) % game.engines.length])
const nextPhaseLabel = computed(() => game.engines[(phase.value + 1) % game.engines.length])

const userName = computed(() => game.userName)
const userAvatar = computed(() => game.userAvatar)
const gold = computed(() => game.gold)
const formattedGold = computed(() => {
  const value = Number(gold.value ?? 0)
  if (!Number.isFinite(value)) return '—'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
})
const stageLabel = computed(() => game.bioromizationStages[game.bioromizationStage] || 'discovery')
const userAvatarDisplay = computed(() => userAvatar.value || '👤')

const settingsOpen = ref(false)
const settingsWrap = ref(null)

function closeSettingsMenu() {
  settingsOpen.value = false
}

function toggleSettingsMenu() {
  settingsOpen.value = !settingsOpen.value
}

function handleClickOutsideSettings(event) {
  if (!settingsOpen.value) return
  const wrap = settingsWrap.value
  if (wrap && !wrap.contains(event.target)) {
    settingsOpen.value = false
  }
}

// Active highlight per overlay (toggled via existing `overlay` events)
  const open = reactive({
    weather: false, news: false, log: false, analytics: false,
    gate: false, animals: false, plants: false, assemblies: false
  })
const bioromeTest = ref(false)

function toggleTheme() {
  document.documentElement.dataset.theme = game.currentTheme = game.currentTheme === 'dark' ? 'light' : 'dark'
  closeSettingsMenu()
}

function toggleTestMode() {
  bioromeTest.value = !bioromeTest.value
  closeSettingsMenu()
}


// Enable/disable per phase (matrix)
const allowedSet = computed(() => {
    if (phase.value === 0) {
      return new Set(['weather', 'news', 'log', 'analytics']) // analytics enabled, user may open
    } else if (phase.value === 1) {
      return new Set(['weather', 'news', 'log', 'analytics', 'animals', 'plants', 'assemblies'])
    } else { // phase 2
      return new Set(['weather', 'news', 'log', 'assemblies', 'gate'])
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
onMounted(() => document.addEventListener('click', handleClickOutsideSettings))
onBeforeUnmount(() => eventBus.off('overlay', onOverlay))
onBeforeUnmount(() => document.removeEventListener('click', handleClickOutsideSettings))

function restart() {
  closeSettingsMenu()
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
    <div class="panel-section left-panel">
      <div class="subpanel subpanel--menu">
        <div class="menu-wrap" ref="settingsWrap" @keydown.esc.stop="closeSettingsMenu">
          <button
            class="menu-button"
            type="button"
            aria-haspopup="true"
            :aria-expanded="settingsOpen"
            aria-label="Settings menu"
            title="Settings"
            @click.stop="toggleSettingsMenu"
          >
            <span aria-hidden="true" class="menu-button__icon">
              <svg viewBox="0 0 24 24" role="presentation" focusable="false">
                <path
                  d="M10.32 4.32a1 1 0 0 1 .95-.69h1.45a1 1 0 0 1 .95.69l.3.9a1 1 0 0 0 .76.66l.95.17a1 1 0 0 1 .76.98v1.45a1 1 0 0 0 .29.7l.68.68a1 1 0 0 1 0 1.42l-.68.68a1 1 0 0 0-.29.7v1.45a1 1 0 0 1-.76.98l-.95.17a1 1 0 0 0-.76.66l-.3.9a1 1 0 0 1-.95.69h-1.45a1 1 0 0 1-.95-.69l-.3-.9a1 1 0 0 0-.76-.66l-.95-.17a1 1 0 0 1-.76-.98v-1.45a1 1 0 0 0-.29-.7l-.68-.68a1 1 0 0 1 0-1.42l.68-.68a1 1 0 0 0 .29-.7v-1.45a1 1 0 0 1 .76-.98l.95-.17a1 1 0 0 0 .76-.66l.3-.9Z"
                  fill="currentColor"
                />
                <circle cx="12" cy="12" r="3" fill="currentColor" />
              </svg>
            </span>
            <span class="visually-hidden">Settings</span>
          </button>
          <div class="optionsMenu" role="menu" v-show="settingsOpen">
            <button role="menuitem" type="button" @click.stop="restart">Restart</button>
            <button role="menuitem" type="button" @click.stop="closeSettingsMenu">Tutorial Mode</button>
            <button role="menuitem" type="button"
                    :class="{ active: bioromeTest }"
                    @click.stop="toggleTestMode">
              Testing Mode
            </button>
            <button role="menuitem" type="button"
                    :class="{ active: game.currentTheme === 'light' }"
                    @click.stop="toggleTheme">
              Light Theme
            </button>
          </div>
        </div>
      </div>
      <div class="subpanel info-panel info-panel--stage">
        <div class="infoScreen" title="Bioromization stage">
          <span class="infoScreen__label">Stage</span>
          <span class="infoScreen__value">{{ stageLabel?.toUpperCase() }}</span>
        </div>
      </div>
      <div class="subpanel subpanel--layout">
        <div class="layout-controls">
          <button
            class="layout-btn"
            type="button"
            title="Standard layout"
            aria-label="Standard layout"
            @click.stop="eventBus.emit('layout','single')"
          >
            <svg width="48" height="30" viewBox="0 0 48 30" fill="none" role="img" aria-hidden="true" focusable="false">
              <rect x="0.5" y="0.5" width="47" height="29" stroke="currentColor" stroke-width="1" fill="none" />
              <rect x="0.5" y="0.5" width="14" height="29" fill="currentColor" fill-opacity="0.85" />
              <rect x="33.5" y="0.5" width="14" height="29" fill="currentColor" fill-opacity="0.85" />
              <g stroke="currentColor" stroke-opacity="0.55" stroke-width="1" stroke-linecap="square">
                <line x1="14.5" y1="10.5" x2="33.5" y2="10.5" />
                <line x1="14.5" y1="20.5" x2="33.5" y2="20.5" />
                <line x1="19.5" y1="0.5" x2="19.5" y2="29.5" />
                <line x1="24.5" y1="0.5" x2="24.5" y2="29.5" />
                <line x1="29.5" y1="0.5" x2="29.5" y2="29.5" />
              </g>
            </svg>
            <span class="visually-hidden">Standard layout</span>
          </button>
          <button
            class="layout-btn"
            type="button"
            title="Wide planning panels"
            aria-label="Wide planning panels"
            @click.stop="eventBus.emit('layout','double')"
          >
            <svg width="48" height="30" viewBox="0 0 48 30" fill="none" role="img" aria-hidden="true" focusable="false">
              <rect x="0.5" y="0.5" width="47" height="29" stroke="currentColor" stroke-width="1" fill="none" />
              <rect x="0.5" y="0.5" width="28" height="29" fill="currentColor" fill-opacity="0.85" />
              <g stroke="currentColor" stroke-opacity="0.55" stroke-width="1" stroke-linecap="square">
                <line x1="28.5" y1="10.5" x2="47.5" y2="10.5" />
                <line x1="28.5" y1="20.5" x2="47.5" y2="20.5" />
                <line x1="33.5" y1="0.5" x2="33.5" y2="29.5" />
                <line x1="38.5" y1="0.5" x2="38.5" y2="29.5" />
                <line x1="43.5" y1="0.5" x2="43.5" y2="29.5" />
              </g>
            </svg>
            <span class="visually-hidden">Wide planning</span>
          </button>
          <button
            class="layout-btn"
            type="button"
            title="Focus on panels"
            aria-label="Focus on panels"
            @click.stop="eventBus.emit('layout','full')"
          >
            <svg width="48" height="30" viewBox="0 0 48 30" fill="none" role="img" aria-hidden="true" focusable="false">
              <rect x="0.5" y="0.5" width="47" height="29" stroke="currentColor" stroke-width="1" fill="none" />
              <rect x="0.5" y="0.5" width="47" height="29" fill="currentColor" fill-opacity="0.85" />
            </svg>
            <span class="visually-hidden">Panel focus</span>
          </button>
        </div>
      </div>
      <div class="subpanel subpanel--shortcuts">
        <div class="controlItem controlItem--shortcut">
          <button id="assemblyStation" type="button" class="app-button" aria-label="Assembly Station" @click.stop="eventBus.emit('nav', 'assembly')">
            <svg viewBox="0 0 24 24" role="img" aria-hidden="true" focusable="false">
              <rect x="4.5" y="4.5" width="15" height="15" rx="2.5" ry="2.5" fill="none" stroke="currentColor" stroke-width="1.5" />
              <circle cx="12" cy="12" r="3.5" fill="none" stroke="currentColor" stroke-width="1.5" />
              <line x1="12" y1="8.5" x2="12" y2="10.8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
              <line x1="12" y1="13.2" x2="12" y2="15.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
              <line x1="8.5" y1="12" x2="10.8" y2="12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
              <line x1="13.2" y1="12" x2="15.5" y2="12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
            </svg>
          </button>
          <div class="app-label">Assembly Station</div>
        </div>
        <div class="controlItem controlItem--shortcut">
          <button id="marketNav" type="button" class="app-button" aria-label="Market" @click.stop="eventBus.emit('nav', 'market')">
            <svg viewBox="0 0 24 24" role="img" aria-hidden="true" focusable="false">
              <path d="M6.5 9.2L7.4 18a1.2 1.2 0 001.2 1.1h6.8a1.2 1.2 0 001.2-1.1l0.9-8.8" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
              <path d="M8.5 9.2V7.5a3.5 3.5 0 017 0v1.7" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
              <line x1="9.5" y1="12" x2="14.5" y2="12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
            </svg>
          </button>
          <div class="app-label">Market</div>
        </div>

      </div>
    </div>

    <div class="panel-section centerPanel">
      <div class="subpanel subpanel--toggles">
        <div class="controlItem" v-show="allowedSet.has('weather')">
          <button id="showWeather" type="button" class="app-button"
                  :class="stateClass('weather')"
                  aria-label="Weather panel"
                  @click.stop="eventBus.emit('overlay', { target: 'weather' })">

            <svg viewBox="0 0 24 24" role="img" aria-hidden="true" focusable="false">
              <circle cx="12" cy="12" r="4.5" stroke="currentColor" stroke-width="1.5" fill="none" />
              <line x1="12" y1="2" x2="12" y2="5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
              <line x1="12" y1="19" x2="12" y2="22" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
              <line x1="4.22" y1="4.22" x2="6.34" y2="6.34" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
              <line x1="17.66" y1="17.66" x2="19.78" y2="19.78" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
              <line x1="2" y1="12" x2="5" y2="12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
              <line x1="19" y1="12" x2="22" y2="12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
              <line x1="4.22" y1="19.78" x2="6.34" y2="17.66" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
              <line x1="17.66" y1="6.34" x2="19.78" y2="4.22" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
            </svg>

          </button>
          <div class="app-label">Weather</div>
        </div>
        <div class="controlItem" v-show="allowedSet.has('news')">
          <button id="showNews" type="button" class="app-button"
                  :class="stateClass('news')"
                  aria-label="News feed"
                  @click.stop="eventBus.emit('overlay', { target: 'news' })">

            <svg viewBox="0 0 24 24" role="img" aria-hidden="true" focusable="false">
              <rect x="4" y="4" width="16" height="16" rx="2" ry="2" stroke="currentColor" stroke-width="1.5" fill="none" />
              <line x1="8" y1="9" x2="16.5" y2="9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
              <line x1="8" y1="12" x2="16.5" y2="12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
              <line x1="8" y1="15" x2="13.5" y2="15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
              <line x1="8" y1="18" x2="12" y2="18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
            </svg>

          </button>
          <div class="app-label">News</div>
        </div>
        <div class="control-divider" role="presentation"></div>
        <div class="controlItem" v-show="allowedSet.has('log')">
          <button id="showLog" type="button" class="app-button"
                  :class="stateClass('log')"
                  aria-label="Event log"
                  @click.stop="eventBus.emit('overlay', { target: 'log' })">

            <svg viewBox="0 0 24 24" role="img" aria-hidden="true" focusable="false">
              <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
              <circle cx="12" cy="8" r="1.6" fill="none" stroke="currentColor" stroke-width="1.5" />
              <circle cx="12" cy="12" r="1.6" fill="none" stroke="currentColor" stroke-width="1.5" />
              <circle cx="12" cy="16" r="1.6" fill="none" stroke="currentColor" stroke-width="1.5" />
            </svg>

          </button>
          <div class="app-label">Log</div>
        </div>
        <div class="controlItem" v-show="allowedSet.has('analytics')">
          <button id="showAnalytics" type="button" class="app-button"
                  :class="stateClass('analytics')"
                  aria-label="Analytics dashboard"
                  @click.stop="eventBus.emit('overlay', { target: 'analytics' })">

            <svg viewBox="0 0 24 24" role="img" aria-hidden="true" focusable="false">
              <line x1="5" y1="19" x2="19" y2="19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
              <rect x="7" y="12" width="2.8" height="5" rx="1" stroke="currentColor" stroke-width="1.5" fill="none" />
              <rect x="11" y="9" width="2.8" height="8" rx="1" stroke="currentColor" stroke-width="1.5" fill="none" />
              <rect x="15" y="6" width="2.8" height="11" rx="1" stroke="currentColor" stroke-width="1.5" fill="none" />
            </svg>

          </button>
          <div class="app-label">Analytics</div>
        </div>
        <div class="controlItem" v-show="allowedSet.has('gate')">
          <button id="showGate" type="button" class="app-button"
                  :class="stateClass('gate')"
                  aria-label="Operations gate"
                  @click.stop="eventBus.emit('overlay', { target: 'gate' })">
            <svg viewBox="0 0 24 24" role="img" aria-hidden="true" focusable="false">
              <path d="M7 18V12a5 5 0 0110 0v6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              <line x1="5" y1="18" x2="19" y2="18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
              <line x1="12" y1="13" x2="12" y2="18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
            </svg>

          </button>
          <div class="app-label">Gate</div>
        </div>
        <div class="control-divider" role="presentation"></div>
        <div class="controlItem" v-show="allowedSet.has('animals')">
          <button id="showAnimals" type="button" class="app-button"
                  :class="stateClass('animals')"
                  aria-label="Animal planning"
                  @click.stop="eventBus.emit('overlay', { target: 'animals' })">
            <svg viewBox="0 0 24 24" role="img" aria-hidden="true" focusable="false">
              <ellipse cx="12" cy="15.5" rx="4" ry="3.2" fill="none" stroke="currentColor" stroke-width="1.5" />
              <circle cx="8.5" cy="10" r="1.6" fill="none" stroke="currentColor" stroke-width="1.5" />
              <circle cx="15.5" cy="10" r="1.6" fill="none" stroke="currentColor" stroke-width="1.5" />
              <circle cx="10" cy="7.5" r="1.4" fill="none" stroke="currentColor" stroke-width="1.5" />
              <circle cx="14" cy="7.5" r="1.4" fill="none" stroke="currentColor" stroke-width="1.5" />
            </svg>

          </button>
          <div class="app-label">Animals</div>
        </div>
        <div class="controlItem" v-show="allowedSet.has('plants')">
          <button id="showPlants" type="button" class="app-button"
                  :class="stateClass('plants')"
                  aria-label="Plant planning"
                  @click.stop="eventBus.emit('overlay', { target: 'plants' })">
            <svg viewBox="0 0 24 24" role="img" aria-hidden="true" focusable="false">
              <path d="M7 18c0-6.5 5.5-11 10-11 0 6.5-5.5 11-10 11z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M7 18c3-3 6-4.5 9.5-5.2" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
              <line x1="12" y1="18" x2="12" y2="22" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
            </svg>

          </button>
          <div class="app-label">Plants</div>
        </div>
        <div class="controlItem" v-show="allowedSet.has('assemblies')">
          <button id="showAssemblies" type="button" class="app-button"
                  :class="stateClass('assemblies')"
                  aria-label="Assemblies"
                  @click.stop="eventBus.emit('overlay', { target: 'assemblies' })">
            <svg viewBox="0 0 24 24" role="img" aria-hidden="true" focusable="false">
              <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" stroke-width="1.5" />
              <circle cx="12" cy="12" r="6" fill="none" stroke="currentColor" stroke-width="1.5" />
              <line x1="12" y1="4" x2="12" y2="6.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
              <line x1="12" y1="17.5" x2="12" y2="20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
              <line x1="4" y1="12" x2="6.5" y2="12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
              <line x1="17.5" y1="12" x2="20" y2="12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
              <line x1="6.8" y1="6.8" x2="8.5" y2="8.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
              <line x1="15.5" y1="15.5" x2="17.2" y2="17.2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
              <line x1="8.5" y1="15.5" x2="6.8" y2="17.2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
              <line x1="17.2" y1="6.8" x2="15.5" y2="8.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
            </svg>

          </button>
          <div class="app-label">Assemblies</div>
        </div>
      </div>
    </div>

    <div class="panel-section right-panel">
      <div class="subpanel subpanel--info">
        <div class="infoScreen infoScreen--user" title="Operator and balance">
          <span class="infoScreen__label">Operator</span>
          <div class="infoScreen__value infoScreen__value--user">
            <span class="infoScreen__avatar" aria-hidden="true">{{ userAvatarDisplay }}</span>
            <div class="infoScreen__details">
              <span class="infoScreen__name">{{ userName || '—' }}</span>
              <span class="infoScreen__meta">Balance: {{ formattedGold }}</span>
            </div>
          </div>
        </div>
        <div class="infoScreen infoScreen--time" title="Simulation date and phase">
          <span class="infoScreen__label">Date &amp; Phase</span>
          <span class="infoScreen__value infoScreen__value--stacked">
            <span>{{ formatDateLocale(game.currentDate) }}</span>
            <span class="infoScreen__meta">Phase: {{ currentPhaseLabel?.toUpperCase() }}</span>
          </span>
        </div>
      </div>
      <div class="subpanel nextPhaseBg" :class="(spinnerOn) ? 'active' : 'inactive'"
           :title="'Next phase: ' + nextPhaseLabel">
        <div class="next-phase__details">

        </div>
        <button class="next-phase-btn" type="button" @click.stop="eventBus.emit('phase',{})">To {{ nextPhaseLabel }}</button>
      </div>
    </div>
  </div>
</template>


<style scoped>
#controlPanel {
  display: flex;
  align-items: stretch;

  gap: 12px;
  padding: 8px 16px;

  border-bottom: 1px solid var(--color-border);
  background: var(--color-surface);
  box-shadow: 0 4px 14px color-mix(in srgb, var(--color-shadow-neutral) 14%, transparent);
  flex-wrap: nowrap;
  overflow: visible;
  height: 100%;
  min-height: 0;
  box-sizing: border-box;
}

.panel-section {
  display: flex;
  align-items: stretch;
  gap: 12px;
  height: 100%;
}

.left-panel,
.right-panel {
  flex: 0 0 auto;
}

.centerPanel {
  flex: 1 1 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 0;
  height: 100%;

}

.subpanel {
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  box-shadow: 0 6px 16px color-mix(in srgb, var(--color-shadow-neutral) 10%, transparent);
  height: 100%;
  min-height: 0;
  overflow: hidden;
  box-sizing: border-box;
}

.subpanel-title {
  margin: 0;
  font-size: 0.78rem;
  letter-spacing: 0.08em;

  text-transform: uppercase;
  font-weight: 600;
  color: color-mix(in srgb, var(--color-text) 65%, var(--color-background));
}

.subpanel--menu {
  align-items: center;
  overflow: visible;
}

.subpanel--menu .menu-wrap {
  overflow: visible;
}

.subpanel--layout {
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-width: 0;
}

.subpanel--shortcuts {
  justify-content: center;
  gap: 16px;
}

.subpanel--toggles {
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
}

.subpanel--info {
  flex-direction: row;
  align-items: center;
  gap: 20px;
  min-width: 0;
}

.menu-wrap {
  position: relative;
  z-index: 2;
}

.menu-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--color-border);
  background: var(--color-accent);
  color: #fff;
  width: 42px;
  height: 42px;
  padding: 0;
  border-radius: var(--radius);
  font-weight: 600;
  line-height: 1;
  cursor: pointer;
  transition: filter 0.2s ease, transform 0.1s ease;
}

.menu-button:hover,
.menu-button:focus-visible {
  filter: brightness(1.05);
  transform: translateY(-1px);
  outline: none;
}

.menu-button__icon {
  display: inline-flex;
  width: 20px;
  height: 20px;
  color: inherit;
}

.menu-button__icon svg {
  width: 100%;
  height: 100%;
  fill: currentColor;
}

.optionsMenu {
  position: absolute;
  top: calc(100% + 10px);
  left: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 12px;
  min-width: 180px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  background: var(--color-surface);
  box-shadow: 0 12px 32px color-mix(in srgb, var(--color-shadow-neutral) 18%, transparent);
  z-index: 3;
}

.optionsMenu button {
  all: unset;
  border-radius: var(--radius);
  padding: 0.45rem 0.6rem;
  font-size: 0.9rem;
  color: var(--color-text);
  cursor: pointer;
}

.optionsMenu button:hover,
.optionsMenu button:focus-visible {
  background: color-mix(in srgb, var(--color-accent) 12%, var(--color-background));
  outline: none;
}

.optionsMenu button.active {
  background: color-mix(in srgb, var(--color-accent) 18%, var(--color-background));
  color: color-mix(in srgb, var(--color-text) 85%, var(--color-surface));
}

.layout-controls {
  display: flex;
  flex-wrap: nowrap;
  gap: 8px;
  justify-content: center;
}

.layout-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text);
  width: 64px;
  height: 44px;
  padding: 0;
  border-radius: var(--radius);
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease, transform 0.1s ease;
}

.layout-btn:hover,
.layout-btn:focus-visible {
  background: color-mix(in srgb, var(--color-accent) 12%, var(--color-surface));
  border-color: color-mix(in srgb, var(--color-accent) 24%, var(--color-border));
  transform: translateY(-1px);
  outline: none;
}

.layout-btn svg {
  width: 44px;
  height: 28px;
}

.layout-btn svg rect,
.layout-btn svg line {
  transition: color 0.2s ease, fill 0.2s ease, stroke 0.2s ease;
}

.controlItem {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-width: 72px;
  white-space: normal;
  text-align: center;
  flex: 0 0 auto;
}

.controlItem--shortcut {
  min-width: 96px;
}

.controlItem .app-label {
  max-width: 110px;
  text-align: center;
  line-height: 1.25;
}

.control-divider {
  width: 1px;
  align-self: stretch;
  background: var(--color-border);
  opacity: 0.6;
  flex: 0 0 1px;
  margin: 0 10px;
}

.infoScreen {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 0;
  min-width: 150px;
}

.infoScreen__label {
  font-size: 0.68rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: color-mix(in srgb, var(--color-text) 55%, var(--color-background));
}

.infoScreen__value {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-text);
  word-break: break-word;
}

.infoScreen__value--stacked {
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
}

.infoScreen__value--user {
  align-items: center;
}

.infoScreen__details {
  display: flex;
  flex-direction: column;
  gap: 2px;
  align-items: flex-start;
}

.infoScreen__name {
  font-size: 0.9rem;
  font-weight: 600;
}

.infoScreen__meta {
  font-size: 0.72rem;
  font-weight: 500;
  color: color-mix(in srgb, var(--color-text) 55%, var(--color-background));
}

.infoScreen__avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: color-mix(in srgb, var(--color-accent) 18%, var(--color-surface));
  color: color-mix(in srgb, var(--color-text) 92%, var(--color-surface));
  font-size: 1rem;
  font-weight: 600;
}

.info-panel {
  justify-content: center;
}


.info-panel--stage .infoScreen {
  min-width: 120px;
  align-items: center;
  text-align: center;
}

.info-panel--stage .infoScreen__value {
  justify-content: center;
}

.nextPhaseBg {
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-width: 220px;
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  box-shadow: 0 6px 16px color-mix(in srgb, var(--color-shadow-neutral) 12%, transparent);
}

.nextPhaseBg.active {
  border-color: color-mix(in srgb, var(--color-accent) 30%, var(--color-border));
}

.next-phase__details {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.next-phase__label {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: color-mix(in srgb, var(--color-text) 55%, var(--color-background));
}

.next-phase__value {
  font-size: 0.92rem;
  font-weight: 600;
  color: var(--color-text);
  text-transform: uppercase;

}

.next-phase-btn {
  border: none;
  border-radius: var(--radius);
  background: var(--color-accent);
  color: #fff;
  font-weight: 600;
  padding: 0.45rem 1.2rem;
  cursor: pointer;
  transition: filter 0.2s ease, transform 0.1s ease;
  white-space: nowrap;
}

.next-phase-btn:hover,
.next-phase-btn:focus-visible {
  filter: brightness(1.07);
  transform: translateY(-1px);
  outline: none;
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

@media (max-width: 1280px) {
  #controlPanel {
    padding: 6px 12px;
    gap: 8px;
  }

  .panel-section {
    gap: 8px;
  }

  .subpanel {
    padding: 6px 10px;
    gap: 8px;
  }

  .layout-controls {
    gap: 4px;
  }

  .subpanel--info {
    gap: 12px;
  }

  .infoScreen {
    min-width: 130px;
  }
}
</style>
