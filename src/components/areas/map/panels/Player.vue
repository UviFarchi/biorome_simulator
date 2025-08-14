<script setup>
import {computed, toRef} from 'vue'
import eventBus from '@/eventBus.js'
import {gameStore} from '@/stores/game.js'

const gameState = gameStore()
const userName = computed(() => gameState.userName)
const userAvatar = computed(() => gameState.userAvatar)
const stageLabel = computed(() => gameState.bioromizationStages[gameState.bioromizationStage] || 'discovery')

const props = defineProps({collapsed: {type: Boolean, default: false}})
const collapsed = toRef(props, 'collapsed')

</script>

<template>
  <div id="playerPanel" class="panel">
    <div class="panel-header" @click="eventBus.emit('panel', { target: 'player' })">Player</div>
    <div id="player" class="panel-body statusBarCell" v-show="!collapsed">{{ userName }} {{ userAvatar }}</div>
    <span id="stage"> Bioromization Stage {{ stageLabel }}</span>

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
