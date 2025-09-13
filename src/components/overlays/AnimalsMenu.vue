<script setup>
import {computed} from 'vue'
import {mapStore} from '@/stores/map.js'
import {gameStore} from '@/stores/game.js'
import {marketStore} from '@/stores/market.js'
import {animalStore} from '@/stores/animal.js'
import {makeInstance} from '@/engine/phases/optimizations/biotaFactories.js'
import {applyOptimizationEffects} from "@/utils/tileHelpers.js";

const map = mapStore()
const game = gameStore()
const market = marketStore()
const animals = animalStore()

const currentTile = computed(() => {
  const selected = map.selectedTile
  return selected && typeof selected === 'object' && 'value' in selected ? selected.value : selected
})

const selectedTileKey = computed(() => {
  return currentTile.value ? `${currentTile.value.row},${currentTile.value.col}` : null
})

const animalTypesList = animals.animalTypes

function addAnimalToTile(animalType, growthStage) {
  const tile = currentTile.value
  const domain = 'animal'

  // capture instance
  const inst = makeInstance(domain, animalType, growthStage)

  // push into optimized list
  tile.animals.optimized.push(inst)


  //Pass animal model
  const model = animalTypesList.filter(animal => animal.type === animalType)[0]
  // pass instance as subject
  applyOptimizationEffects(domain, animalType, tile, inst, model)
}
</script>

<template>
  <div class="panel animalMenu">
    <div class="panel-header-row">
      <h4>Animals</h4>
    </div>

    <div v-if="!currentTile" class="hint">Select a tile to add animals to its optimization plan.</div>

    <div v-else class="cards">
      <div
          v-for="animal in animalTypesList"
          :key="animal.type"
          class="card"
      >
        <div class="card-header">
          <div class="card-title">
            {{ animal.type }}
          </div>
          <div class="card-icon" v-if="animal.icon">{{ animal.icon }}</div>
        </div>

        <div class="card-body">
          <div class="phase-buttons">
            <button
                v-for="growthStage in animal.growthStages"
                :key="growthStage"
                class="phase-button"
                :disabled="!selectedTileKey"
                @click="addAnimalToTile(animal.type , growthStage)"
            >
              <span class="phase-label">{{ growthStage }}</span>
              <span class="phase-price">
                <span>
                  {{ market.priceCatalog.animals[animal.type].stagePrices[growthStage] || 'No price' }}
                </span>

              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animalMenu {
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
  border: 1px solid var(--border, #2c3e50);
  background: transparent;
  cursor: pointer;
  color: white;
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
