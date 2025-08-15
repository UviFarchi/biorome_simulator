<script setup>
import {computed, toRef} from 'vue'
import eventBus from '@/eventBus.js'
import {gameStore} from '@/stores/game.js'
import { clearSavedStores } from '@/utils.js'


const gameState = gameStore()
const phaseLabel = computed(() => gameState.engines[(gameState.turnPhase + 1) % gameState.engines.length])
const props = defineProps({collapsed: {type: Boolean, default: false}})
const collapsed = toRef(props, 'collapsed')

function restart() {
    clearSavedStores()
    eventBus.emit('nav', 'start')
    window.location.reload()
}
</script>

<template>
  <div id="controlPanel" class="panel">
    <div class="panel-header" @click="eventBus.emit('panel', { target: 'control' })">Control</div>
    <div class="panel-body" v-show="!collapsed">
      <div id="restart" class="statusBarCell" @click.stop="restart">Restart</div>
      <div id="showLog" class="statusBarCell" @click.stop="eventBus.emit('menu', { target: 'log' })">Show Log</div>
      <div id="showAnalytics" class="statusBarCell" @click.stop="eventBus.emit('menu', { target: 'analytics' })">Show
        Analytics
      </div>
      <div id="nextPhase" class="statusBarCell" @click.stop="eventBus.emit('phase', {})">
        Next Phase:<br/>{{ phaseLabel }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.panel {
  border: 1px solid #000;
  margin: 0;
}

.panel-header {
  font-weight: bold;
  padding: 4px;
  cursor: pointer;
}

.statusBarCell {
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  border-top: 1px solid #000;
  padding: 4px;
}
</style>
