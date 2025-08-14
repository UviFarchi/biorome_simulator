<script setup>
import { defineProps, defineEmits, computed } from 'vue'
import { gameStore } from '/src/stores/game.js'

const props = defineProps({ collapsed: { type: Boolean, default: false } })
const emit = defineEmits(['panel', 'restart', 'show-log', 'show-analytics', 'next-phase'])

const gameState = gameStore()
const phaseLabel = computed(() => gameState)
function togglePanel() { emit('panel', { id: 'control', collapsed: !props.collapsed }) }
</script>

<template>
  <div id="controlPanel" class="panel">
    <div class="panel-header" @click="togglePanel">Control</div>
    <div v-if="!collapsed" class="panel-body">
      <div id="restart" class="statusBarCell" @click="$emit('restart')">Restart</div>
      <div id="showLog" class="statusBarCell" @click="$emit('show-log')">Show Log</div>
      <div id="showAnalytics" class="statusBarCell" @click="$emit('show-analytics')">Show Analytics</div>
      <div id="nextPhase" class="statusBarCell" @click="$emit('next-phase')">
        Current Phase:<br />{{ phaseLabel }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.panel { border: 1px solid #000; margin: 0; }
.panel-header { font-weight: bold; padding: 4px; cursor: pointer; }
.statusBarCell { display: flex; justify-content: center; align-items: center; font-weight: bold; border-top: 1px solid #000; padding: 4px; }
</style>
