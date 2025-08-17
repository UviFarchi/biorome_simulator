<script setup>
import {computed, toRef} from 'vue'
import eventBus from '@/eventBus.js'
import {gameStore} from '@/stores/game.js'

const game = gameStore()
const userName = computed(() => game.userName)
const userAvatar = computed(() => game.userAvatar)
const stageLabel = computed(() => game.bioromizationStages[game.bioromizationStage] || 'discovery')
const currentPhaseLabel = computed(() => game.engines[(game.turnPhase) % game.engines.length])
const props = defineProps({collapsed: {type: Boolean, default: false}})
const collapsed = toRef(props, 'collapsed')

</script>

<template>
  <div id="playerPanel" class="panel">
    <div class="panel-header" @click="eventBus.emit('panel', { target: 'player' })">Player</div>
    <div id="player" class="panel-body statusBarCell" v-show="!collapsed">{{ userName }} {{ userAvatar }}
      <br/>
    <div id="stage"> Bioromization Stage {{ stageLabel }}</div>
      <br/>
      <div>Difficulty: {{game.difficulty}}</div>
     <div>Current Phase:<br/>{{currentPhaseLabel}}</div>
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
