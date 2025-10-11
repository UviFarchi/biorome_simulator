<script setup>
import { computed } from 'vue';
import { mapStore } from '@/stores/map.js';
import { marketStore } from '@/stores/market.js';
import { plantTypes } from '@/dict/plantModels.js';
import { makeInstance } from '@/engine/phases/optimizations/biotaFactories.js';
import { applyOptimizationEffects } from '@/engine/phases/optimizations/applyOptimizationEffects.js';

const map = mapStore();
const market = marketStore();
const currentTile = computed(() => {
  const selected = map.selectedTile;
  return selected && typeof selected === 'object' && 'value' in selected
    ? selected.value
    : selected;
});

const selectedTileKey = computed(() => {
  return currentTile.value ? `${currentTile.value.row},${currentTile.value.col}` : null;
});

const plantTypesList = plantTypes;

function addPlantToTile(plantType, growthStage) {
  const tile = currentTile.value;
  const domain = 'plant';

  // capture instance
  const inst = makeInstance(domain, plantType, growthStage);

  // push into optimized list
  tile.plants.optimized.push(inst);

  // pass instance as subject
  applyOptimizationEffects(domain, plantType, tile, inst);
}

function plantStagePrice(plant, growthStage) {
  const entry = market.priceCatalog.plants?.[plant.type];
  const sp = entry?.stagePrices;
  if (!sp) return 'No price';
  return Array.isArray(sp)
    ? (sp[plant.growthStages.indexOf(growthStage)] ?? 'No price')
    : (sp[growthStage] ?? 'No price');
}
</script>

<template>
  <div class="panel plantMenu">
    <div class="panel-header-row">
      <h4>Plants</h4>
    </div>

    <div v-if="!currentTile" class="hint">
      Select a tile to add plants to its optimization plan.
    </div>

    <div v-else class="cards">
      <div v-for="plant in plantTypesList" :key="plant.type" class="card">
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
  border: 1px solid var(--color-border);
  border-radius: 10px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: color-mix(in srgb, var(--color-background) 25%, transparent);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card-title {
  font-weight: 600;
}
.card-icon {
  font-size: 20px;
}

.phase-buttons {
  display: grid;
  gap: 6px;
}

.phase-button {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  background: transparent;
  cursor: pointer;
  color: var(--color-text);
}
.phase-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.phase-label {
  font-weight: 500;
}
.phase-price {
  font-variant-numeric: tabular-nums;
}

.hint {
  opacity: 0.8;
}
</style>
