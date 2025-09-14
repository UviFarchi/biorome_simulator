<script setup>
import { computed } from 'vue'
import { mapStore } from '@/stores/map.js'
import { gameStore } from '@/stores/game.js'
import { actionRequirements } from '@/dict/actionRequirements.js'
import {applyOptimizationEffects} from '@/engine/phases/optimizations/applyOptimizationEffects.js';

const map = mapStore()
const game = gameStore()

const currentTile = computed(() => {
  const selected = map.selectedTile
  return selected && typeof selected === 'object' && 'value' in selected ? selected.value : selected
})

function addActionToTile(category, action) {
  const tile = currentTile.value
  if (!tile) return
  // push planned action
    const inst = { category, action }
        tile.assemblies.optimized.push(inst)
        // look up static model for this action and apply effects
            const model = actionRequirements?.[category]?.[action]
       applyOptimizationEffects('assembly', action, tile, inst)
}
</script>

<template>
  <div class="panel assembliesMenu">
    <div class="panel-header-row">
      <h4>Assemblies</h4>
    </div>

    <div v-if="!currentTile" class="hint">Select a tile to plan assembly actions.</div>

    <div v-else class="menu-body">
      <div class="assemblies-list">
        <div
          v-for="assembly in game.stationAssemblies"
          :key="assembly.id"
          class="card"
        >
          <div class="card-header">
            <div class="card-title">{{ assembly.name }}</div>
          </div>
          <div class="card-body">
            <div>Built: {{ assembly.built ? 'Yes' : 'No' }}</div>
            <div>Deployed: {{ assembly.deployed ? 'Yes' : 'No' }}</div>
            <div>Moves: {{ assembly.moves }}</div>
            <div>Actions: {{ assembly.actions }}</div>
            <div class="modules">
              <div v-for="(m, i) in assembly.modules" :key="i">
                {{ m.type }}<span v-if="m.subtype">: {{ m.subtype }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="actions-list">
        <div
          v-for="(actions, category) in actionRequirements"
          :key="category"
          class="action-area"
        >
          <h4>{{ category }}</h4>
          <button
            v-for="actionName in Object.keys(actions)"
            :key="actionName"
            :disabled="!currentTile"
            @click="addActionToTile(category, actionName)"
          >
            {{ actionName }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.assembliesMenu {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.menu-body {
  display: flex;
  gap: 12px;
  height: 100%;
}

.assemblies-list,
.actions-list {
  flex: 1 1 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow-y: auto;
}

.card {
  border: 1px solid var(--color-border-card);
  border-radius: 10px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: color-mix(in srgb, var(--color-bg) 25%, transparent);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card-title {
  font-weight: 600;
}

.modules {
  margin-top: 4px;
}

.hint {
  opacity: 0.8;
}
</style>
