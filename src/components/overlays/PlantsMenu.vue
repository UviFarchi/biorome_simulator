<script setup>
import { computed } from 'vue'
import { mapStore } from '@/stores/map.js'
import { gameStore } from '@/stores/game.js'
import { marketStore } from '@/stores/market.js'
import { plantStore } from '@/stores/plant.js'
import { makeInstance } from '@/engine/phases/optimizations/biotaFactories.js'

const map = mapStore()
const game = gameStore()
const market = marketStore()
const plants = plantStore()

const currentTile = computed(() => {
  const selected = map.selectedTile
  return selected && typeof selected === 'object' && 'value' in selected ? selected.value : selected
})

const selectedTileKey = computed(() => {
  return currentTile.value ? `${currentTile.value.row},${currentTile.value.col}` : null
})

const plantTypesList = plants.plantTypes

function addPlantToTile(plantType, growthStage) {
  const tile = currentTile.value
  tile.plants.optimized.push(makeInstance('plant', plantType, growthStage))
}

function plantStagePrice(plant, growthStage) {
  const entry = market.priceCatalog.plants?.[plant.type]
  const sp = entry?.stagePrices
  if (!sp) return 'No price'
  return Array.isArray(sp)
      ? sp[plant.growthStages.indexOf(growthStage)] ?? 'No price'
      : sp[growthStage] ?? 'No price'
}
</script>

<template>
  <div class="panel plantMenu">
    <div class="panel-header-row">
      <h4>Plants</h4>
    </div>

    <div v-if="!currentTile" class="hint">Select a tile to add plants to its optimization plan.</div>

    <div v-else class="cards">
      <div
          v-for="plant in plantTypesList"
          :key="plant.type"
          class="card"
      >
        <div class="card-header">
          <div class="card-title">{{ plant.type }}</div>
          <div class="card-icon" v-if="plant.icon">{{ plant.icon }}</div>
        </div>

        <div class="card-body">
          <div class="phase-buttons">
            <button
                v-for="growthStage in plant.growthStages.slice(0, 2)"
            :key="growthStage"
            class="phase-button"
            :disabled="!selectedTileKey"
            @click="addPlantToTile(plant.type, growthStage)"
            >
            <span class="phase-label">{{ growthStage }}</span>
            <span class="phase-price">
                {{ plantStagePrice(plant, growthStage) }}
              </span>
            </button>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
.plantMenu {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 12px;
}

.card {
  border: 1px solid var(--border, #2c3e50);
  border-radius: 10px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: rgba(0, 0, 0, 0.25);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card-title { font-weight: 600; }
.card-icon { font-size: 20px; }

.phase-buttons { display: grid; gap: 6px; }

.phase-button {
  display: flex; align-items: center; justify-content: space-between;
  width: 100%; padding: 8px 10px; border-radius: 8px;
  border: 1px solid var(--border, #2c3e50);
  background: transparent; cursor: pointer; color: white;
}
.phase-button:disabled { opacity: 0.5; cursor: not-allowed; }

.phase-label { font-weight: 500; }
.phase-price { font-variant-numeric: tabular-nums; }

.hint { opacity: 0.8; }
</style>
