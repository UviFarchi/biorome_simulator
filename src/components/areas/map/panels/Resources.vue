
<script setup>
import { defineProps, defineEmits, computed } from 'vue'
import { resourceStore } from '@/stores/resources.js'
const props = defineProps({ collapsed: { type: Boolean, default: false } })
const emit = defineEmits(['panel'])
const resources = resourceStore()
const gold = computed(() => resources.gold)
const waste = computed(() => resources.waste)
const water = computed(() => resources.water)
const electricity = computed(() => resources.electricity)
function togglePanel() { emit('panel', { id: 'resources', collapsed: !props.collapsed }) }
</script>

<template>
  <div id="resourcesPanel" class="panel">
    <div class="panel-header" @click="togglePanel">Resources</div>
    <div v-if="!collapsed" class="panel-body">
      <div id="gold" title="Gold: Earned from orders, spend to add plants/animals" class="statusBarCell">💰{{ gold }}</div>
      <div id="waste" title="Waste" class="statusBarCell">🗑{{ waste }}</div>
      <div id="water" title="Water" class="statusBarCell">💧{{ water }}</div>
      <div id="electricity" title="Electricity" class="statusBarCell">⚡{{ electricity }}</div>
    </div>
  </div>
</template>

<style scoped>
.panel { border: 1px solid #000; margin: 0; }
.panel-header { font-weight: bold; padding: 4px; cursor: pointer; }
.statusBarCell { display: flex; justify-content: center; align-items: center; font-weight: bold; border-top: 1px solid #000; padding: 4px; }
</style>
