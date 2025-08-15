<script setup>
import { computed } from 'vue'
import eventBus from '@/eventBus.js'
import { mapStore } from '@/stores/map.js'

const map = mapStore()
const size = computed(() => map.size)
const flatTiles = computed(() => map.tiles.flat())

function clickTile(tile){ eventBus.emit('tileModal', tile) }

function tileStyle(tile){
  const [emin, emax] = map.topographyConstraints?.elevationRange ?? [0,100]
  const e = tile.topo.elevation.env, s = tile.topo.slopeDeg.env
  const t = Math.min(1, Math.max(0, (e-emin)/Math.max(1e-6, emax-emin)))
  const hue = 120 + (35-120)*t
  const light = 65 - 25*Math.min(1, s/60)
  return { backgroundColor: `hsl(${hue.toFixed(1)},55%,${light.toFixed(1)}%)` }
}
</script>

<template>
  <div class="grid-fit">
    <div
        class="grid-box"
        :style="{
        gridTemplateColumns: `repeat(${size}, 1fr)`,
        gridTemplateRows: `repeat(${size}, 1fr)`
      }"
    >
      <div
          v-for="tile in flatTiles"
          :key="`${tile.row}-${tile.col}`"
          class="cell"
          :style="tileStyle(tile)"
          :title="`R${tile.row+1} C${tile.col+1} | ${tile.topo.elevation.env.toFixed(1)} m`"
          @click="clickTile(tile)"
      >
        <div class="icons">
          <span v-if="tile.plant">{{ tile.plant.icon }}</span>
          <span v-if="tile.animal">{{ tile.animal.icon }}</span>
          <span v-for="a in tile.assemblies" :key="a.id">{{ a.icon || '🤖' }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Fills the middle row and centers a square box that never overflows */
.grid-fit{
  height:100%;
  display:flex;
  align-items:center;
  justify-content:center;
  overflow:hidden;
}

/* Square container: uses the limiting dimension of the available area */
.grid-box{
  height:100%;
  max-width:100%;
  aspect-ratio:1/1;
  display:grid;
  gap:0;                 /* no gaps */
}

/* Each track is 1fr; since the container is square, cells are square */
.cell{
  width:100%;
  height:100%;
  display:flex;
  align-items:center;
  justify-content:center;
  user-select:none;
  cursor:pointer;
  /* optional faint grid lines without creating gaps */
  box-shadow: inset 0 0 0 1px rgba(0,0,0,.06);
}

.icons{ display:flex; gap:.15em; font-size:1.1em; }
</style>
