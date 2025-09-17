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
  gap: clamp(6px, 1.2vw, 12px);
  padding: clamp(6px, 1.2vw, 8px) clamp(10px, 2vw, 16px);
  border-bottom: 1px solid var(--color-border);
  background: var(--color-surface);
  box-shadow: 0 4px 14px color-mix(in srgb, var(--color-shadow-neutral) 14%, transparent);
  flex-wrap: nowrap;
  overflow: visible;
  height: 100%;
  min-height: 0;
  min-width: 0;
  box-sizing: border-box;
}

.panel-section {
  display: flex;
  align-items: stretch;
  gap: clamp(6px, 1.2vw, 12px);
  height: 100%;
  flex: 1 1 0;
  min-width: 0;
  flex-wrap: wrap;
}

.left-panel,
.right-panel {
  flex: 0 1 clamp(240px, 28vw, 320px);
  min-width: 0;
}

.centerPanel {
  flex: 1 1 clamp(320px, 44vw, 480px);
  display: flex;
  justify-content: center;
  align-items: stretch;
  min-width: 0;
  height: 100%;
}

.centerPanel > .subpanel {
  flex: 1 1 auto;
  width: 100%;
  max-width: none;
  min-width: 0;
}

.subpanel {
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: clamp(6px, 1vw, 10px);
  row-gap: clamp(4px, 0.9vw, 8px);
  padding: clamp(6px, 1vw, 8px) clamp(8px, 1.6vw, 12px);
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  box-shadow: 0 6px 16px color-mix(in srgb, var(--color-shadow-neutral) 10%, transparent);
  height: 100%;
  min-height: 0;
  overflow: hidden;
  box-sizing: border-box;
  flex-wrap: wrap;
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
  gap: clamp(4px, 0.9vw, 8px);
  min-width: 0;
  flex-wrap: wrap;
}

.subpanel--shortcuts {
  justify-content: center;
  gap: clamp(6px, 1.2vw, 16px);
  flex-wrap: wrap;
}

.subpanel--toggles {
  justify-content: center;
  gap: clamp(8px, 1.4vw, 16px);
  row-gap: clamp(5px, 0.9vw, 12px);
  flex-wrap: wrap;
  overflow: visible;
}

.subpanel--info {
  flex-direction: row;
  align-items: center;
  gap: clamp(12px, 2vw, 20px);
  min-width: 0;
  justify-content: center;
  flex-wrap: wrap;
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
  width: clamp(36px, 4vw, 42px);
  height: clamp(36px, 4vw, 42px);
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
  width: clamp(16px, 2.4vw, 20px);
  height: clamp(16px, 2.4vw, 20px);
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
  flex-wrap: wrap;
  gap: clamp(6px, 1.1vw, 10px);
  justify-content: center;
}

.layout-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text);
  width: clamp(56px, 7.4vw, 64px);
  height: clamp(38px, 5.6vw, 44px);
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
  width: clamp(34px, 5.4vw, 44px);
  height: clamp(20px, 3.6vw, 28px);
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
  gap: clamp(4px, 0.8vw, 6px);
  min-width: clamp(60px, 7.4vw, 92px);
  white-space: normal;
  text-align: center;
  flex: 0 1 auto;
}

.controlItem--shortcut {
  min-width: clamp(78px, 11vw, 116px);
}

.controlItem .app-label {
  max-width: clamp(94px, 13.6vw, 120px);
  text-align: center;
  line-height: 1.25;
}

.controlItem .app-button {
  width: clamp(54px, 6.8vw, 68px);
  height: clamp(54px, 6.8vw, 68px);
}

.controlItem .app-button svg {
  width: clamp(28px, 3.8vw, 32px);
  height: clamp(28px, 3.8vw, 32px);
}

.control-divider {
  width: 1px;
  align-self: stretch;
  background: var(--color-border);
  opacity: 0.6;
  flex: 0 0 1px;
  margin: 0 clamp(6px, 1.1vw, 10px);
}

.infoScreen {
  display: flex;
  flex-direction: column;
  gap: clamp(3px, 0.8vw, 6px);
  padding: 0;
  min-width: clamp(116px, 18vw, 150px);
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
  gap: clamp(6px, 1.1vw, 10px);
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
  width: clamp(28px, 3.6vw, 32px);
  height: clamp(28px, 3.6vw, 32px);
  border-radius: 50%;
  background: color-mix(in srgb, var(--color-accent) 18%, var(--color-surface));
  color: color-mix(in srgb, var(--color-text) 92%, var(--color-surface));
  font-size: clamp(0.9rem, 0.6rem + 0.5vw, 1rem);
  font-weight: 600;
}

.info-panel {
  justify-content: center;
  flex-wrap: wrap;
}


.info-panel--stage .infoScreen {
  min-width: clamp(110px, 16vw, 140px);
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
  gap: clamp(8px, 1.4vw, 12px);
  min-width: clamp(180px, 26vw, 220px);
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  box-shadow: 0 6px 16px color-mix(in srgb, var(--color-shadow-neutral) 12%, transparent);
  flex-wrap: wrap;
}

.nextPhaseBg.active {
  border-color: color-mix(in srgb, var(--color-accent) 30%, var(--color-border));
}

.next-phase__details {
  display: flex;
  flex-direction: column;
  gap: clamp(2px, 0.6vw, 6px);
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
  padding-block: clamp(0.35rem, calc(0.28rem + 0.6vw), 0.45rem);
  padding-inline: clamp(0.88rem, calc(0.68rem + 0.9vw), 1.2rem);
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
    gap: clamp(4px, 0.9vw, 10px);
    padding: clamp(5px, 1vw, 7px) clamp(8px, 1.6vw, 12px);
  }

  .panel-section {
    gap: clamp(4px, 0.9vw, 10px);
  }

  .left-panel,
  .right-panel {
    flex: 0 1 clamp(220px, 26vw, 300px);
  }

  .centerPanel {
    flex: 1 1 clamp(300px, 42vw, 440px);
  }

  .subpanel {
    gap: clamp(4px, 0.9vw, 8px);
    row-gap: clamp(3px, 0.8vw, 6px);
    padding: clamp(5px, 0.9vw, 7px) clamp(6px, 1.4vw, 10px);
  }

  .menu-button {
    padding: clamp(6px, 0.95vw, 8px);
  }

  .layout-controls {
    gap: clamp(4px, 0.9vw, 8px);
  }

  .layout-btn {
    width: clamp(50px, 6.4vw, 60px);
    height: clamp(32px, 4.8vw, 38px);
  }

  .layout-btn svg {
    width: clamp(30px, 5vw, 36px);
    height: clamp(18px, 3vw, 22px);
  }

  .controlItem {
    min-width: clamp(58px, 7vw, 88px);
    gap: clamp(4px, 0.75vw, 6px);
  }

  .controlItem--shortcut {
    min-width: clamp(74px, 9.5vw, 108px);
  }

  .controlItem .app-label {
    max-width: clamp(90px, 12.6vw, 112px);
  }

  .controlItem .app-button {
    width: clamp(52px, 6.5vw, 64px);
    height: clamp(52px, 6.5vw, 64px);
  }

  .controlItem .app-button svg {
    width: clamp(26px, 3.5vw, 30px);
    height: clamp(26px, 3.5vw, 30px);
  }

  .infoScreen {
    min-width: clamp(108px, 16vw, 140px);
  }

  .infoScreen__value {
    gap: clamp(5px, 0.95vw, 8px);
  }

  .nextPhaseBg {
    min-width: clamp(170px, 26vw, 210px);
    gap: clamp(6px, 1.1vw, 10px);
  }

  .next-phase-btn {
    padding-inline: clamp(0.8rem, 0.66rem + 0.8vw, 1.06rem);
  }
}

@media (max-width: 1100px) {
  #controlPanel {
    gap: clamp(3px, 0.7vw, 6px);
    padding: clamp(4px, 0.8vw, 6px) clamp(6px, 1.2vw, 10px);
  }

  .panel-section {
    gap: clamp(3px, 0.7vw, 6px);
  }

  .left-panel,
  .right-panel {
    flex: 0 1 clamp(200px, 25vw, 260px);
  }

  .centerPanel {
    flex: 1 1 clamp(260px, 46vw, 380px);
  }

  .subpanel {
    gap: clamp(3px, 0.7vw, 6px);
    row-gap: clamp(2px, 0.6vw, 6px);
    padding: clamp(4px, 0.7vw, 6px) clamp(5px, 1vw, 8px);
  }

  .subpanel--shortcuts {
    gap: clamp(5px, 1vw, 12px);
  }

  .subpanel--toggles {
    gap: clamp(6px, 1.2vw, 12px);
    row-gap: clamp(4px, 0.8vw, 10px);
  }

  .menu-button {
    padding: clamp(5px, 0.8vw, 7px);
  }

  .menu-button__icon {
    width: clamp(14px, 1.8vw, 18px);
    height: clamp(14px, 1.8vw, 18px);
  }

  .layout-controls {
    gap: clamp(3px, 0.7vw, 6px);
  }

  .layout-btn {
    width: clamp(46px, 5.6vw, 54px);
    height: clamp(30px, 4.2vw, 36px);
  }

  .layout-btn svg {
    width: clamp(28px, 4.4vw, 32px);
    height: clamp(16px, 2.8vw, 20px);
  }

  .controlItem {
    min-width: clamp(52px, 6.2vw, 78px);
    gap: clamp(3px, 0.6vw, 5px);
  }

  .controlItem--shortcut {
    min-width: clamp(68px, 8.5vw, 96px);
  }

  .controlItem .app-label {
    font-size: 0.75rem;
    max-width: clamp(84px, 11.8vw, 104px);
  }

  .controlItem .app-button {
    width: clamp(48px, 5.8vw, 60px);
    height: clamp(48px, 5.8vw, 60px);
  }

  .controlItem .app-button svg {
    width: clamp(24px, 3.3vw, 28px);
    height: clamp(24px, 3.3vw, 28px);
  }

  .control-divider {
    margin: 0 clamp(5px, 0.9vw, 8px);
  }

  .infoScreen {
    min-width: clamp(100px, 14vw, 132px);
  }

  .infoScreen__label {
    font-size: 0.66rem;
  }

  .infoScreen__value {
    font-size: 0.82rem;
    gap: clamp(4px, 0.7vw, 7px);
  }

  .infoScreen__name {
    font-size: 0.86rem;
  }

  .infoScreen__meta {
    font-size: 0.7rem;
  }

  .infoScreen__avatar {
    width: clamp(24px, 3.2vw, 28px);
    height: clamp(24px, 3.2vw, 28px);
    font-size: clamp(0.82rem, 0.56rem + 0.45vw, 0.94rem);
  }

  .nextPhaseBg {
    min-width: clamp(156px, 24vw, 192px);
    gap: clamp(5px, 0.9vw, 8px);
    padding: clamp(4px, 0.8vw, 6px) clamp(6px, 1.2vw, 9px);
  }

  .next-phase__label {
    font-size: 0.7rem;
  }

  .next-phase__value {
    font-size: 0.88rem;
  }

  .next-phase-btn {
    padding-block: clamp(0.26rem, 0.24rem + 0.4vw, 0.38rem);
    padding-inline: clamp(0.7rem, 0.56rem + 0.6vw, 0.94rem);
    font-size: 0.86rem;
  }
}

@media (max-width: 920px) {
  #controlPanel {
    gap: clamp(2px, 0.55vw, 5px);
    padding: clamp(3px, 0.6vw, 5px) clamp(5px, 1vw, 8px);
  }

  .panel-section {
    gap: clamp(2px, 0.55vw, 5px);
  }

  .left-panel,
  .right-panel {
    flex: 0 1 clamp(184px, 27vw, 240px);
  }

  .centerPanel {
    flex: 1 1 clamp(240px, 46vw, 340px);
  }

  .subpanel {
    gap: clamp(2px, 0.55vw, 5px);
    row-gap: clamp(2px, 0.55vw, 5px);
    padding: clamp(3px, 0.6vw, 5px) clamp(4px, 0.8vw, 6px);
  }

  .subpanel--shortcuts {
    gap: clamp(4px, 0.8vw, 10px);
  }

  .subpanel--toggles {
    gap: clamp(5px, 1vw, 10px);
    row-gap: clamp(3px, 0.6vw, 8px);
  }

  .menu-button {
    padding: clamp(4px, 0.7vw, 6px);
  }

  .menu-button__icon {
    width: clamp(13px, 1.6vw, 16px);
    height: clamp(13px, 1.6vw, 16px);
  }

  .layout-controls {
    gap: clamp(2px, 0.55vw, 5px);
  }

  .layout-btn {
    width: clamp(42px, 5.2vw, 50px);
    height: clamp(28px, 4vw, 34px);
  }

  .layout-btn svg {
    width: clamp(26px, 4vw, 30px);
    height: clamp(16px, 2.5vw, 18px);
  }

  .controlItem {
    min-width: clamp(48px, 5.6vw, 70px);
  }

  .controlItem--shortcut {
    min-width: clamp(62px, 7.5vw, 86px);
  }

  .controlItem .app-label {
    font-size: 0.7rem;
    max-width: clamp(78px, 11vw, 96px);
  }

  .controlItem .app-button {
    width: clamp(46px, 5.6vw, 58px);
    height: clamp(46px, 5.6vw, 58px);
  }

  .controlItem .app-button svg {
    width: clamp(24px, 3.2vw, 28px);
    height: clamp(24px, 3.2vw, 28px);
  }

  .control-divider {
    margin: 0 clamp(4px, 0.7vw, 7px);
  }

  .infoScreen {
    min-width: clamp(90px, 13vw, 120px);
  }

  .infoScreen__value {
    font-size: 0.78rem;
    gap: clamp(4px, 0.7vw, 6px);
  }

  .infoScreen__name {
    font-size: 0.82rem;
  }

  .infoScreen__meta {
    font-size: 0.68rem;
  }

  .infoScreen__avatar {
    width: clamp(22px, 3vw, 26px);
    height: clamp(22px, 3vw, 26px);
    font-size: clamp(0.78rem, 0.54rem + 0.4vw, 0.9rem);
  }

  .nextPhaseBg {
    min-width: clamp(142px, 22vw, 180px);
    gap: clamp(4px, 0.8vw, 7px);
    padding: clamp(3px, 0.6vw, 5px) clamp(5px, 0.9vw, 7px);
  }

  .next-phase__details {
    gap: clamp(2px, 0.5vw, 5px);
  }

  .next-phase__label {
    font-size: 0.68rem;
  }

  .next-phase__value {
    font-size: 0.84rem;
  }

  .next-phase-btn {
    padding-block: clamp(0.24rem, 0.2rem + 0.35vw, 0.34rem);
    padding-inline: clamp(0.6rem, 0.46rem + 0.55vw, 0.86rem);
    font-size: 0.82rem;
  }
}

@media (max-width: 780px) {
  #controlPanel {
    gap: clamp(1px, 0.4vw, 4px);
    padding: clamp(2px, 0.5vw, 4px) clamp(4px, 0.8vw, 6px);
  }

  .panel-section {
    gap: clamp(2px, 0.45vw, 4px);
  }

  .left-panel,
  .right-panel {
    flex: 0 1 clamp(128px, 30vw, 192px);
  }

  .centerPanel {
    flex: 1 1 clamp(180px, 38vw, 280px);
  }

  .subpanel {
    gap: clamp(2px, 0.5vw, 4px);
    row-gap: clamp(2px, 0.5vw, 4px);
    padding: clamp(2px, 0.5vw, 4px) clamp(3px, 0.7vw, 5px);
  }

  .subpanel--shortcuts {
    gap: clamp(3px, 0.7vw, 8px);
  }

  .subpanel--toggles {
    gap: clamp(4px, 0.9vw, 8px);
    row-gap: clamp(3px, 0.6vw, 7px);
  }

  .menu-button {
    width: clamp(32px, 3.6vw, 38px);
    height: clamp(32px, 3.6vw, 38px);
    padding: clamp(3px, 0.6vw, 5px);
  }

  .menu-button__icon {
    width: clamp(12px, 1.4vw, 15px);
    height: clamp(12px, 1.4vw, 15px);
  }

  .layout-controls {
    gap: clamp(2px, 0.5vw, 4px);
  }

  .layout-btn {
    width: clamp(38px, 4.8vw, 48px);
    height: clamp(26px, 3.6vw, 32px);
  }

  .layout-btn svg {
    width: clamp(24px, 3.6vw, 28px);
    height: clamp(14px, 2.2vw, 18px);
  }

  .controlItem {
    min-width: clamp(44px, 5vw, 64px);
    gap: clamp(2px, 0.5vw, 4px);
  }

  .controlItem--shortcut {
    min-width: clamp(58px, 6.8vw, 80px);
  }

  .controlItem .app-label {
    font-size: 0.68rem;
    max-width: clamp(72px, 10vw, 90px);
  }

  .controlItem .app-button {
    width: clamp(42px, 5vw, 54px);
    height: clamp(42px, 5vw, 54px);
  }

  .controlItem .app-button svg {
    width: clamp(22px, 2.8vw, 26px);
    height: clamp(22px, 2.8vw, 26px);
  }

  .control-divider {
    margin: 0 clamp(3px, 0.6vw, 6px);
  }

  .infoScreen {
    min-width: clamp(82px, 12vw, 112px);
  }

  .infoScreen__label {
    font-size: 0.62rem;
  }

  .infoScreen__value {
    font-size: 0.76rem;
    gap: clamp(3px, 0.6vw, 5px);
  }

  .infoScreen__name {
    font-size: 0.8rem;
  }

  .infoScreen__meta {
    font-size: 0.66rem;
  }

  .infoScreen__avatar {
    width: clamp(20px, 2.8vw, 24px);
    height: clamp(20px, 2.8vw, 24px);
    font-size: clamp(0.72rem, 0.5rem + 0.35vw, 0.86rem);
  }

  .nextPhaseBg {
    min-width: clamp(126px, 20vw, 168px);
    gap: clamp(3px, 0.7vw, 6px);
    padding: clamp(2px, 0.6vw, 5px) clamp(4px, 0.8vw, 6px);
  }

  .next-phase__details {
    gap: clamp(2px, 0.45vw, 4px);
  }

  .next-phase__label {
    font-size: 0.64rem;
  }

  .next-phase__value {
    font-size: 0.8rem;
  }

  .next-phase-btn {
    padding-block: clamp(0.22rem, 0.18rem + 0.3vw, 0.32rem);
    padding-inline: clamp(0.54rem, 0.4rem + 0.5vw, 0.78rem);
    font-size: 0.78rem;
  }
}

@media (max-width: 680px) {
  #controlPanel {
    gap: clamp(1px, 0.32vw, 3px);
    padding: clamp(2px, 0.45vw, 4px) clamp(4px, 0.7vw, 6px);
  }

  .panel-section {
    gap: clamp(2px, 0.4vw, 3px);
  }

  .left-panel,
  .right-panel {
    flex: 0 1 clamp(110px, 28vw, 160px);
  }

  .centerPanel {
    flex: 1 1 clamp(150px, 36vw, 232px);
  }

  .subpanel {
    gap: clamp(2px, 0.45vw, 3px);
    row-gap: clamp(2px, 0.45vw, 3px);
    padding: clamp(2px, 0.45vw, 3px) clamp(3px, 0.6vw, 5px);
  }

  .subpanel--shortcuts {
    gap: clamp(3px, 0.6vw, 7px);
  }

  .subpanel--toggles {
    gap: clamp(4px, 0.8vw, 7px);
    row-gap: clamp(3px, 0.55vw, 6px);
  }

  .menu-button {
    width: clamp(30px, 3.2vw, 36px);
    height: clamp(30px, 3.2vw, 36px);
    padding: clamp(2px, 0.55vw, 4px);
  }

  .menu-button__icon {
    width: clamp(11px, 1.3vw, 14px);
    height: clamp(11px, 1.3vw, 14px);
  }

  .layout-controls {
    gap: clamp(1px, 0.4vw, 3px);
  }

  .layout-btn {
    width: clamp(34px, 4.4vw, 44px);
    height: clamp(24px, 3.2vw, 30px);
  }

  .layout-btn svg {
    width: clamp(22px, 3.2vw, 26px);
    height: clamp(14px, 2vw, 16px);
  }

  .controlItem {
    min-width: clamp(38px, 4.4vw, 56px);
    gap: clamp(2px, 0.45vw, 3px);
  }

  .controlItem--shortcut {
    min-width: clamp(54px, 6.2vw, 76px);
  }

  .controlItem .app-label {
    font-size: 0.65rem;
    max-width: clamp(68px, 9vw, 84px);
  }

  .controlItem .app-button {
    width: clamp(36px, 4.4vw, 48px);
    height: clamp(36px, 4.4vw, 48px);
  }

  .controlItem .app-button svg {
    width: clamp(18px, 2.4vw, 22px);
    height: clamp(18px, 2.4vw, 22px);
  }

  .control-divider {
    margin: 0 clamp(3px, 0.55vw, 5px);
  }

  .infoScreen {
    min-width: clamp(74px, 10.5vw, 104px);
  }

  .infoScreen__label {
    font-size: 0.6rem;
  }

  .infoScreen__value {
    font-size: 0.72rem;
    gap: clamp(3px, 0.5vw, 5px);
  }

  .infoScreen__name {
    font-size: 0.76rem;
  }

  .infoScreen__meta {
    font-size: 0.64rem;
  }

  .infoScreen__avatar {
    width: clamp(18px, 2.4vw, 22px);
    height: clamp(18px, 2.4vw, 22px);
    font-size: clamp(0.68rem, 0.46rem + 0.28vw, 0.82rem);
  }

  .nextPhaseBg {
    min-width: clamp(112px, 17vw, 152px);
    gap: clamp(3px, 0.6vw, 6px);
    padding: clamp(2px, 0.5vw, 4px) clamp(4px, 0.7vw, 6px);
  }

  .next-phase__label {
    font-size: 0.62rem;
  }

  .next-phase__value {
    font-size: 0.78rem;
  }

  .next-phase-btn {
    padding-block: clamp(0.2rem, 0.16rem + 0.28vw, 0.3rem);
    padding-inline: clamp(0.5rem, 0.38rem + 0.48vw, 0.74rem);
    font-size: 0.76rem;
  }
}
</style>
