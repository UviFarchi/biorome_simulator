<script setup>
import {computed, toRef} from 'vue'
import eventBus from '@/eventBus.js'
import {gameStore} from '@/stores/game.js';
const game = gameStore()
const props = defineProps({ collapsed: { type: Boolean, default: false } })
const collapsed = toRef(props, 'collapsed')
</script>

<template>
  <div id="eventPanel" class="panel">
    <div class="panel-header" @click="eventBus.emit('overlay', { target: 'resources' })">News</div>
    <div class="panel-body" v-show="!collapsed">
      <div class="controlButton">{{game.currentEvents}}</div>
    </div>
  </div>
</template>


<style scoped>
.panel { border: 1px solid white; margin: 0; }
.panel-header { font-weight: bold; padding: 4px; cursor: pointer; }
.controlButton { display: flex; justify-content: center; align-items: center; font-weight: bold; border-top: 1px solid #000; padding: 4px; }
</style>
