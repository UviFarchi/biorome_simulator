<script setup>
import {computed, ref} from 'vue'
import eventBus from '@/eventBus.js'
import {mapStore} from '@/stores/map.js'
import TerrainBackdrop from '@/components/grid/TerrainBackdrop.vue'
import TileInfo from '@/components/grid/TileInfo.vue'

const map = mapStore()
const size = computed(() => map.size)
const flatTiles = computed(() => map.tiles.flat())

function isSelected(tile) {
  return map.selectedTile.value?.row === tile.row && map.selectedTile.value?.col === tile.col
}

function isSurveyed(tile) {
  return typeof tile.topography.elevation.measured.value === 'number'
}

const showTileInfo = ref(false)


function clickTile(tile) {
  if (isSelected(tile)) {
    map.selectedTile.value = {}
    showTileInfo.value = false;
  } else {
    map.selectedTile.value = tile
    showTileInfo.value = true;
  }
}

function closeModal(){
  map.selectedTile.value = null;
  showTileInfo.value = false;
}

</script>

<template>
  <div class="grid-fit">
    <!-- Tile info uses the exact grid box -->

    <div class="grid-box" v-show="showTileInfo">
      <button v-show="showTileInfo" class="closeModalBtn" @click="closeModal">Close</button>
      <TileInfo />
    </div>

    <!-- Grid view -->
    <div class="grid-box" v-show="!showTileInfo"
         :style="{ gridTemplateColumns:`repeat(${size},1fr)`,
                   gridTemplateRows:`repeat(${size},1fr)` }">
      <TerrainBackdrop/>
      <div v-for="tile in flatTiles"
           :key="`${tile.row}-${tile.col}`"
           :class="['cell', { active: isSelected(tile) }, {unsurveyed: !isSurveyed(tile)}]"
           :title="`R${tile.row+1} C${tile.col+1} | ${tile.topography.elevation.env.toFixed(1)} m`"
           @click="clickTile(tile)">
        <div class="icons">
          <span v-if="tile.plants">{{ tile.plants.map(p => p.icon) }}</span>
          <span v-if="tile.animals">{{ tile.animals.map(a => a.icon) }}</span>
          <span v-if="tile.assemblies">{{ tile.assemblies.map(s => s.icon || '🤖') }}</span>
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
  box-shadow: inset 0 0 0 1px black;
  color: black;
}

.cell.active {
  outline: 3px solid #ffd600;
  outline-offset: -2px;
}

.cell.unsurveyed:before {
  content: "Unsurveyed";
  position: absolute;
  top: 10px
}

.cell.unsurveyed {
  background: rgba(0, 0, 0, .095);

}

.icons {
  display: flex;
  gap: .15em;
  font-size: 1.1em;
}

.closeModalBtn {
  position: absolute;
  top: 5px;
  right: 20px;
}
</style>
