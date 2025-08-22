<script setup>
import {computed, toRef} from 'vue'
import eventBus from '@/eventBus.js'
import {gameStore} from '@/stores/game.js'
import { clearSavedStores } from '@/utils.js'


const game = gameStore()
const nextPhaseLabel = computed(() => {
  if(game.currentTurn === 0){
    return "Start Game"
  }
  return  game.engines[(game.turnPhase + 1) % game.engines.length]
})
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
      <button id="restart" class="statusBarCell" @click.stop="restart">Restart</button>
      <hr/>
      <button id="showLog" class="statusBarCell" @click.stop="eventBus.emit('modal', { target: 'log' })">Show Log</button>
      <button id="showAnalytics" class="statusBarCell" @click.stop="eventBus.emit('modal', { target: 'analytics' })">Show
        Analytics
      </button>
      <hr/>
      <button id="nextPhase" class="statusBarCell" @click.stop="eventBus.emit('phase', {})">
      Next Phase:<br/>{{ nextPhaseLabel }}
    </button>


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
