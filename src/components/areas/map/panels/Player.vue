<script setup>
import { defineProps, defineEmits, computed } from 'vue'
import { gameStore } from '@/stores/game.js'
const props = defineProps({ collapsed: { type: Boolean, default: false } })
const emit = defineEmits(['panel'])
const gameState = gameStore()
const userName = computed(() => gameState.userName)
const userAvatar = computed(() => gameState.userAvatar)
function togglePanel() { emit('panel', { id: 'player', collapsed: !props.collapsed }) }
</script>

<template>
  <div id="playerPanel" class="panel">
    <div class="panel-header" @click="togglePanel">Player</div>
    <div v-if="!collapsed" id="player" class="panel-body statusBarCell">
      {{ userName }} {{ userAvatar }}
    </div>
  </div>
</template>

<style scoped>
.panel { border: 1px solid #000; margin: 0; }
.panel-header { font-weight: bold; padding: 4px; cursor: pointer; }
.statusBarCell { display: flex; justify-content: center; align-items: center; font-weight: bold; border-top: 1px solid #000; padding: 4px; }
</style>
