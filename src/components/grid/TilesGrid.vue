<script setup>
import {computed} from 'vue'
import eventBus from '@/eventBus.js'
import {mapStore} from '@/stores/map.js'
import TerrainBackdrop from '@/components/grid/TerrainBackdrop.vue'

const map = mapStore()
const size = computed(() => map.size)
const flatTiles = computed(() => map.tiles.flat())

const isSelected = (tile) =>
    map.selectedTile.value?.row === tile.row &&
    map.selectedTile.value?.col === tile.col

function clickTile(tile) {
  if (isSelected(tile)) {
    map.selectedTile.value = {}
    eventBus.emit('modal', {target: 'tileInfo', show: false})
  } else {
    map.selectedTile.value = tile
    eventBus.emit('modal', {target: 'tileInfo', show: true})
  }
}

const tileStyle = () => ({backgroundColor: 'transparent'})
</script>

<template>
  <div class="grid-fit">
    <div class="grid-box"
         :style="{ gridTemplateColumns:`repeat(${size},1fr)`,
                   gridTemplateRows:`repeat(${size},1fr)` }">
      <TerrainBackdrop/>
      <div v-for="tile in flatTiles"
           :key="`${tile.row}-${tile.col}`"
           :class="['cell', { active: isSelected(tile) }]"
           :style="tileStyle(tile)"
           :title="`R${tile.row+1} C${tile.col+1} | ${tile.topography.elevation.env.toFixed(1)} m`"
           @click="clickTile(tile)">
        <div class="icons">
          <span v-if="tile.plant">{{ tile.plant.forEach(plant => {
            return plant.icon
          }) }}</span>
          <span v-if="tile.animal">{{ tile.animal.icon }}</span>
          <span v-for="a in tile.assemblies" :key="a.id">{{ a.icon || '🤖' }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.grid-fit {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}


.grid-box {
  position: relative;
  height: 100%;
  max-width: 100%;
  aspect-ratio: 1/1;
  display: grid;
  gap: 0;
}

.cell {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
  cursor: pointer;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, .06);
}

.cell.active {
  outline: 3px solid #ffd600;
  outline-offset: -2px;
}

.icons {
  display: flex;
  gap: .15em;
  font-size: 1.1em;
}

.terrain-canvas {
  position: absolute;
  inset: 0;
  z-index: 0;
}

</style>
