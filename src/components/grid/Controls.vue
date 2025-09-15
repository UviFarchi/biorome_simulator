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

// Active highlight per overlay (toggled via existing `overlay` events)
  const open = reactive({
    weather: false, news: false, log: false, analytics: false,
    gate: false, animals: false, plants: false, assemblies: false
  })
const bioromeTest = ref(false)

function toggleTheme() {
  document.documentElement.dataset.theme = game.currentTheme = game.currentTheme === 'dark' ? 'light' : 'dark'
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
    <div class="panel-section left-panel">
      <div class="subpanel subpanel--menu">
        <div class="menu-wrap">
          <button class="menu-button" type="button" aria-haspopup="true">Menu</button>
          <div class="optionsMenu" role="menu">
            <button role="menuitem" type="button" @click.stop="restart">Restart</button>
            <button role="menuitem" type="button">Tutorial Mode</button>
            <button role="menuitem" type="button"
                    :class="{ active: bioromeTest }"
                    @click.stop="bioromeTest = !bioromeTest">
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
      <div class="subpanel subpanel--layout">
        <div class="subpanel-title">Layout</div>
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
        <button id="assemblyStation" type="button" class="toolbar-button" @click.stop="eventBus.emit('nav', 'assembly')">Assembly Station</button>
        <button id="marketNav" type="button" class="toolbar-button" @click.stop="eventBus.emit('nav', 'market')">Market</button>
      </div>
    </div>

    <div class="panel-section centerPanel">
      <div class="subpanel subpanel--toggles">
        <div class="controlItem" v-show="allowedSet.has('weather')">
          <button id="showWeather" type="button" class="app-button"
                  :class="stateClass('weather')"
                  aria-label="Weather panel"
                  @click.stop="eventBus.emit('overlay', { target: 'weather' })">
            W
          </button>
          <div class="app-label">Weather</div>
        </div>
        <div class="controlItem" v-show="allowedSet.has('news')">
          <button id="showNews" type="button" class="app-button"
                  :class="stateClass('news')"
                  aria-label="News feed"
                  @click.stop="eventBus.emit('overlay', { target: 'news' })">
            N
          </button>
          <div class="app-label">News</div>
        </div>
        <div class="control-divider" role="presentation"></div>
        <div class="controlItem" v-show="allowedSet.has('log')">
          <button id="showLog" type="button" class="app-button"
                  :class="stateClass('log')"
                  aria-label="Event log"
                  @click.stop="eventBus.emit('overlay', { target: 'log' })">
            L
          </button>
          <div class="app-label">Log</div>
        </div>
        <div class="controlItem" v-show="allowedSet.has('analytics')">
          <button id="showAnalytics" type="button" class="app-button"
                  :class="stateClass('analytics')"
                  aria-label="Analytics dashboard"
                  @click.stop="eventBus.emit('overlay', { target: 'analytics' })">
            A
          </button>
          <div class="app-label">Analytics</div>
        </div>
        <div class="controlItem" v-show="allowedSet.has('gate')">
          <button id="showGate" type="button" class="app-button"
                  :class="stateClass('gate')"
                  aria-label="Operations gate"
                  @click.stop="eventBus.emit('overlay', { target: 'gate' })">
            G
          </button>
          <div class="app-label">Gate</div>
        </div>
        <div class="control-divider" role="presentation"></div>
        <div class="controlItem" v-show="allowedSet.has('animals')">
          <button id="showAnimals" type="button" class="app-button"
                  :class="stateClass('animals')"
                  aria-label="Animal planning"
                  @click.stop="eventBus.emit('overlay', { target: 'animals' })">
            An
          </button>
          <div class="app-label">Animals</div>
        </div>
        <div class="controlItem" v-show="allowedSet.has('plants')">
          <button id="showPlants" type="button" class="app-button"
                  :class="stateClass('plants')"
                  aria-label="Plant planning"
                  @click.stop="eventBus.emit('overlay', { target: 'plants' })">
            Pl
          </button>
          <div class="app-label">Plants</div>
        </div>
        <div class="controlItem" v-show="allowedSet.has('assemblies')">
          <button id="showAssemblies" type="button" class="app-button"
                  :class="stateClass('assemblies')"
                  aria-label="Assemblies"
                  @click.stop="eventBus.emit('overlay', { target: 'assemblies' })">
            As
          </button>
          <div class="app-label">Assemblies</div>
        </div>
      </div>
    </div>

    <div class="panel-section right-panel">
      <div class="subpanel subpanel--info">
        <div class="infoScreen" title="Operator">
          <span class="infoScreen__label">Operator</span>
          <span class="infoScreen__value">{{ userAvatar }} {{ userName || '—' }}</span>
        </div>
        <div class="infoScreen" title="Available funds">
          <span class="infoScreen__label">Balance</span>
          <span class="infoScreen__value">{{ formattedGold }}</span>
        </div>
        <div class="infoScreen" title="Bioromization stage">
          <span class="infoScreen__label">Stage</span>
          <span class="infoScreen__value">{{ stageLabel?.toUpperCase() }}</span>
        </div>
        <div class="infoScreen" title="Simulation date">
          <span class="infoScreen__label">Date</span>
          <span class="infoScreen__value">{{ formatDateLocale(game.currentDate) }}</span>
        </div>
        <div class="infoScreen" title="Current operating phase">
          <span class="infoScreen__label">Phase</span>
          <span class="infoScreen__value">{{ currentPhaseLabel?.toUpperCase() }}</span>
        </div>
      </div>
      <div class="subpanel nextPhaseBg" :class="(spinnerOn) ? 'active' : 'inactive'"
           :title="'Next phase: ' + nextPhaseLabel">
        <div class="next-phase__details">
          <span class="next-phase__label">Upcoming phase</span>
          <span class="next-phase__value">{{ nextPhaseLabel }}</span>
        </div>
        <button class="next-phase-btn" type="button" @click.stop="eventBus.emit('phase',{})">Advance</button>
      </div>
    </div>
  </div>
</template>


<style scoped>
#controlPanel {
  display: flex;
  align-items: stretch;
  gap: 18px;
  padding: 18px 24px;
  border-bottom: 1px solid var(--color-border);
  background: var(--color-surface);
  box-shadow: 0 4px 14px color-mix(in srgb, var(--color-shadow-neutral) 14%, transparent);
  flex-wrap: nowrap;
  overflow-x: auto;
}

.panel-section {
  display: flex;
  align-items: stretch;
  gap: 16px;
}

.left-panel,
.right-panel {
  flex: 0 0 auto;
}

.centerPanel {
  flex: 1 1 auto;
  display: flex;
  justify-content: center;
  min-width: 0;
}

.subpanel {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 18px;
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  flex-wrap: wrap;
  box-shadow: 0 6px 16px color-mix(in srgb, var(--color-shadow-neutral) 10%, transparent);
}

.subpanel-title {
  flex: 0 0 100%;
  margin: 0;
  font-size: 0.85rem;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  font-weight: 600;
  color: color-mix(in srgb, var(--color-text) 65%, var(--color-background));
}

.subpanel--menu {
  align-items: stretch;
}

.subpanel--layout {
  min-width: 260px;
}

.subpanel--shortcuts {
  gap: 10px;
}

.subpanel--toggles {
  justify-content: center;
}

.subpanel--info {
  flex-direction: column;
  align-items: stretch;
  gap: 12px;
  min-width: 220px;
}

.menu-wrap {
  position: relative;
}

.menu-button {
  border: 1px solid var(--color-border);
  background: var(--color-accent);
  color: #fff;
  padding: 0.5rem 1rem;
  border-radius: var(--radius);
  font-weight: 600;
  cursor: pointer;
  transition: filter 0.2s ease, transform 0.1s ease;
}

.menu-button:hover,
.menu-button:focus-visible {
  filter: brightness(1.05);
  transform: translateY(-1px);
  outline: none;
}

.optionsMenu {
  position: absolute;
  top: calc(100% + 10px);
  left: 0;
  display: none;
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

.menu-wrap:focus-within .optionsMenu {
  display: flex;
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
  gap: 8px;
  width: 100%;
  justify-content: center;
}

.layout-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text);
  width: 72px;
  height: 52px;
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
  width: 50px;
  height: 32px;
}

.layout-btn svg rect,
.layout-btn svg line {
  transition: color 0.2s ease, fill 0.2s ease, stroke 0.2s ease;
}

.toolbar-button {
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text);
  padding: 0.55rem 1.1rem;
  border-radius: var(--radius);
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease, transform 0.1s ease;
}

.toolbar-button:hover,
.toolbar-button:focus-visible {
  background: color-mix(in srgb, var(--color-accent) 12%, var(--color-surface));
  border-color: color-mix(in srgb, var(--color-accent) 24%, var(--color-border));
  transform: translateY(-1px);
  outline: none;
}

.toolbar-button:active {
  transform: translateY(0);
}

.controlItem {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  min-width: 72px;
}

.control-divider {
  width: 1px;
  align-self: stretch;
  background: var(--color-border);
  opacity: 0.6;
}

.infoScreen {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 0.35rem 0;
}

.infoScreen__label {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: color-mix(in srgb, var(--color-text) 55%, var(--color-background));
}

.infoScreen__value {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--color-text);
  word-break: break-word;
}

.nextPhaseBg {
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  min-width: 240px;
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
}

.next-phase__label {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: color-mix(in srgb, var(--color-text) 55%, var(--color-background));
}

.next-phase__value {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text);
}

.next-phase-btn {
  border: none;
  border-radius: var(--radius);
  background: var(--color-accent);
  color: #fff;
  font-weight: 600;
  padding: 0.55rem 1.4rem;
  cursor: pointer;
  transition: filter 0.2s ease, transform 0.1s ease;
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
    padding: 16px;
    gap: 12px;
    flex-wrap: wrap;
  }

  .panel-section {
    width: 100%;
    justify-content: space-between;
    flex-wrap: wrap;
  }

  .centerPanel {
    justify-content: flex-start;
  }

  .subpanel {
    flex: 1 1 260px;
  }

  .subpanel--info {
    flex-direction: row;
    flex-wrap: wrap;
  }

  .infoScreen {
    flex: 1 1 160px;
  }
}
</style>
