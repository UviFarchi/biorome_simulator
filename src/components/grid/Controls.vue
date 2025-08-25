<script setup>
import {reactive, computed, onMounted, onBeforeUnmount, watch} from 'vue'
import eventBus from '@/eventBus.js'
import {gameStore} from '@/stores/game.js'
import {clearSavedStores} from '@/utils.js'

const game = gameStore()
const phase = computed(() => game.turnPhase)
const currentPhaseLabel = computed(() => game.engines[(phase.value) % game.engines.length])
const nextPhaseLabel = computed(() => game.engines[(phase.value + 1) % game.engines.length])

const userName = computed(() => game.userName)
const userAvatar = computed(() => game.userAvatar)
const gold = computed(() => game.gold)
const stageLabel = computed(() => game.bioromizationStages[game.bioromizationStage] || 'discovery')

// Active highlight per overlay (toggled via existing `overlay` events)
const open = reactive({
  weather: false, news: false, log: false, analytics: false,
  market: false, gate: false, resources: false, animals: false, plants: false, assemblies: false
})

// Enable/disable per phase (matrix)
const allowedSet = computed(() => {
  if (phase.value === 0) {
    return new Set(['weather', 'news', 'log', 'analytics', 'market']) // analytics enabled, user may open
  } else if (phase.value === 1) {
    return new Set(['weather', 'news', 'log', 'analytics', 'market', 'animals', 'plants', 'resources'])
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
</script>


<template>

  <div id="controlPanel">
    <div class="left-panel">
    <div class="subpanel">
      <div class="menu-wrap">
        <button class="hamburger" aria-label="More">☰</button>
        <div class="menu" role="menu">
          <button role="menuitem" @click.stop="restart">Restart</button>
        </div>
      </div>
    </div>
    <div class="subpanel">
      <div class="infoScreen"> Bioromization Stage: <br/> {{ stageLabel?.toUpperCase() }}</div>
      <div class="infoScreen">Current Phase:<br/>{{ currentPhaseLabel?.toUpperCase() }}</div>
      <div class="infoScreen">Current Turn:<br/>{{ game.currentTurn }}</div>
      <div class="infoScreen">Current Date:<br/>{{ game.currentDate.toLocaleDateString('en-GB') }}</div>
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
        <button id="showResources" class="controlButton"
                :class="stateClass('resources')"
                :disabled="!allowedSet.has('resources')"
                @click.stop="eventBus.emit('overlay', { target: 'resources' })">
        </button>
        <div class="label">Resources</div>
      </div>
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
    <div class="subpanel">
      <button id="a3" @click.stop="eventBus.emit('nav', 'assembly')">Go To A3</button>
    </div>
</div>
    <div class="right-panel">
      <div class="subpanel">
            <div id="player" class="infoScreen">    Operator<br/>{{ userAvatar }}<br/>{{ userName }}</div>
        <div id="gold" class="infoScreen" title="Gold">Gold 💰<br/>{{ gold }}</div>
      </div>
    <div class="subpanel">
      <button id="nextPhase" @click.stop="eventBus.emit('phase',{})">
        <span class="next-label">Next Phase:</span>
        <span class="next-phase">{{ nextPhaseLabel }}</span>
      </button>
    </div>
  </div>
  </div>


</template>


<style scoped>
/* BAR: three columns; center grows */
#controlPanel{
  display:flex;
  align-items:center;
  gap:12px;
  padding:6px 10px;
  height:10vh;
  border-bottom:2px solid #2a2f2a;
background-color: grey;
}

/* columns */
.left-panel,
.right-panel{
  flex:0 0 auto;            /* width = content */
  display:flex;
  align-items:center;
  gap:12px;
}

.centerPanel{
  flex:1 1 auto;            /* takes remaining space */
  display:flex;
  justify-content:center;   /* keeps bulbs centered */
  align-items:center;
  gap:12px;
  min-width:0;              /* prevents overflow push */
}

/* subpanels: use your image */
.subpanel{
  display:flex;
  align-items:center;
  gap:10px;
  height:8vh;
  padding:6px 10px;
  border:2px solid #1f231f;
  border-radius:8px;
  background-image:url("@/assets/steel_plate.png");
  background-size:cover;        /* or 'contain' if you prefer */
  background-position:center;
  background-repeat:no-repeat;
}

.subpanel hr{

  all: unset;
  display: block;
  flex: 0 0 2px;
  align-self: center;
  height: 80%;
  margin: 0 10px;
  background: black;
  border-radius: 2px;
}



/* optional: keep small menus anchored inside their panel */
.menu-wrap{ position:relative; }
.menu{
  position:absolute;
  top:100%;
  right:0;
  margin-top:8px;
  display:none;
  background:#1a1f1a;
  border:1px solid #2a2f2a;
  border-radius:8px;
  padding:6px;
}
.menu-wrap:focus-within .menu{ display:block; }

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
  box-shadow: inset 0 2px 6px rgba(0,0,0,.7),
  0 0 8px 2px rgba(200,40,40,.35);
  cursor: not-allowed;
}
.controlButton.s-idle {
  background: #7a5702;
  border-color: #6e5a2c;
  box-shadow: inset 0 2px 6px rgba(0,0,0,.6),
  0 0 10px 2px rgba(255,170,0,.4);
}
.controlButton.s-active {
  background: #0f7a39;
  border-color: #1d6f3c;
  box-shadow: inset 0 2px 6px rgba(0,0,0,.6),
  0 0 14px 4px rgba(80,255,120,.5);
}

/* labels follow state color */
.label {
  margin-top: 4px;
  font-family: ui-monospace, Menlo, monospace;
  font-size: 0.8em;
  color: #cfd3cf;
  box-shadow: inset 10px 50px rgba(0,0,0,0.35);
  border: 2px inset black;
  padding: 0 3px;
}
.controlButton.s-disabled + .label {
  color: #ff8c8c;
  text-shadow: 0 0 3px rgba(255,90,90,.35);

}
.controlButton.s-idle + .label {
  color: #ffd27a;
  text-shadow: 0 0 3px rgba(255,200,90,.35);
}
.controlButton.s-active + .label {
  color: #97ffb0;
  text-shadow: 0 0 3px rgba(100,255,140,.35);
}


.infoScreen {
  background-color: black;
  position: relative;
  padding: 5px;
border: 5px inset black;
  height: 75%;
  text-align: center;
  color: lawngreen;
  aspect-ratio: 4/3;
  line-height: 1.25rem;
}
</style>
