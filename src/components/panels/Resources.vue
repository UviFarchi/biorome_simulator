<script setup>
import {computed, toRef} from 'vue'
import eventBus from '@/eventBus.js'
import { resourceStore } from '@/stores/resource.js'
const resources = resourceStore()
const gold = computed(() => resources.gold)
const waste = computed(() => resources.waste)
const water = computed(() => resources.water)
const electricity = computed(() => resources.electricity)
const props = defineProps({ collapsed: { type: Boolean, default: false } })
const collapsed = toRef(props, 'collapsed')
</script>

<template>
  <div id="resourcesPanel" class="panel">
    <div class="panel-header" @click="eventBus.emit('panel', { target: 'resources' })">Resources</div>
    <div class="panel-body" v-show="!collapsed">
      <div id="gold" class="statusBarCell" title="Gold">💰{{ gold }}</div>
      <div id="waste" class="statusBarCell" title="Waste">🗑{{ waste }}</div>
      <div id="water" class="statusBarCell" title="Water">💧{{ water }}</div>
      <div id="electricity" class="statusBarCell" title="Electricity">⚡{{ electricity }}</div>
    </div>
  </div>
</template>


<style scoped>
.panel { border: 1px solid #000; margin: 0; }
.panel-header { font-weight: bold; padding: 4px; cursor: pointer; }
.statusBarCell { display: flex; justify-content: center; align-items: center; font-weight: bold; border-top: 1px solid #000; padding: 4px; }
</style>
