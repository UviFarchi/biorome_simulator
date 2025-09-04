<!-- src/components/grid/TilesGrid.vue -->
<script setup>
import { computed, ref } from 'vue'
import { mapStore } from '@/stores/map.js'
import { gameStore } from '@/stores/game.js'
import { plantStore } from '@/stores/plant.js'
import { animalStore } from '@/stores/animal.js'
import { marketStore } from '@/stores/market.js'
import TerrainBackdrop from '@/components/grid/TerrainBackdrop.vue'
import TileInfo from '@/components/grid/TileInfo.vue'

const map = mapStore()
const game = gameStore()
const plants = plantStore()
const animals = animalStore()
const market = marketStore()

const size = computed(() => map.size)
const flatTiles = computed(() => map.tiles.flat())
const phase = computed(() => game.phase)

const showTileInfo = ref(false)

function isSelected(tile) {
  return map.selectedTile.value?.row === tile.row && map.selectedTile.value?.col === tile.col
}
function isSurveyed(tile) {
  return typeof tile.topography.elevation.measured.value === 'number'
}
function clickTile(tile) {
  if (isSelected(tile)) {
    map.selectedTile.value = {}
    showTileInfo.value = false
  } else {
    map.selectedTile.value = tile
    showTileInfo.value = true
  }
}
function closeModal() {
  map.selectedTile.value = null
  showTileInfo.value = false
}

/* ---------- assets ---------- */
const images = import.meta.glob('/src/assets/{plants,animals}/*/*.png', { eager: true, as: 'url' })
const resImages = import.meta.glob('/src/assets/resources/*.png', { eager: true, as: 'url' })

function bioImg(kind, type, stage) {
  if (!kind || !type || !stage) return null
  return images[`/src/assets/${kind}/${type}/${stage}.png`] || null
}
function bioIcon(kind, type) {
  if (kind === 'plants') {
    const m = plants.plantTypes?.find(t => t.type === type)
    return m?.icon || '🌱'
  }
  if (kind === 'animals') {
    const m = animals.animalTypes?.find(t => t.type === type)
    return m?.icon || '🐾'
  }
  return '❓'
}
function resImg(key) {
  return resImages[`/src/assets/resources/${key}.png`] || null
}
function resSymbol(key) {
    return market.baseResources?.[key]?.icon || '❓'      }
/* ---------- helpers ---------- */
const isBiota = x => x && typeof x === 'object' && typeof x.type === 'string'
const list = arr => (Array.isArray(arr) ? arr.filter(isBiota) : [])

function resKeys(t) {
  return Object.keys(t?.resources || {}).filter(k => k !== 'optimizedUses')
}
function resReal(tile, k) {
  return tile.resources?.[k]?.measured?.value ?? null
}
function resProj(tile, k) {
  return tile.resources?.[k]?.optimized ?? null
}
function fmt(v) {
  return v == null ? '-' : v
}
</script>

<template>
  <div class="grid-fit">
    <div class="grid-box" v-show="showTileInfo">
      <button v-show="showTileInfo" class="closeModalBtn" @click="closeModal">Close</button>
      <TileInfo />
    </div>

    <div class="grid-box" v-show="!showTileInfo"
         :style="{
           gridTemplateColumns: `repeat(${size}, minmax(0,1fr))`,
           gridTemplateRows: `repeat(${size}, minmax(0,1fr))`
         }">
      <TerrainBackdrop/>
      <div v-for="tile in flatTiles"
           :key="`${tile.row}-${tile.col}`"
           :class="['cell', { active: isSelected(tile) }, { unsurveyed: !isSurveyed(tile) }]"
           :title="`Row: ${tile.row} Column: ${tile.col}`"
           @click="clickTile(tile)">

        <div class="icons" v-if="isSurveyed(tile)">
          <div class="tile-rows">

            <!-- Row 1: Resources -->
            <div class="row row-res">
              <template v-if="phase === 0">
                <div v-for="k in resKeys(tile)" :key="`res-r-${tile.row}-${tile.col}-${k}`" class="res-line">
                  <img v-if="resImg(k)" :src="resImg(k)" class="icon-img" alt=""/>
                  <span v-else class="res-fallback">{{ resSymbol(k) }}</span>
                  <span class="val real">{{ fmt(resReal(tile, k)) }}</span>
                </div>
              </template>

              <template v-else-if="phase === 1">
                <div v-for="k in resKeys(tile)" :key="`res-p-${tile.row}-${tile.col}-${k}`" class="res-line proj">
                  <img v-if="resImg(k)" :src="resImg(k)" class="icon-img proj-img" alt=""/>
                  <span v-else class="res-fallback">{{ resSymbol(k) }}</span>
                  <span class="val proj">{{ fmt(resProj(tile, k)) }}</span>
                </div>
              </template>

              <template v-else>
                <div v-for="k in resKeys(tile)" :key="`res-b-${tile.row}-${tile.col}-${k}`" class="res-line both">
                  <img v-if="resImg(k)" :src="resImg(k)" class="icon-img" alt=""/>
                  <span v-else class="res-fallback">{{ resSymbol(k) }}</span>
                  <span class="val real">{{ fmt(resReal(tile, k)) }}</span>
                  <span class="sep">|</span>
                  <span class="val proj">{{ fmt(resProj(tile, k)) }}</span>
                </div>
              </template>
            </div>

            <!-- Row 2: Animals -->
            <div class="row">
              <template v-if="phase === 0">
                <span v-for="(a,i) in list(tile.animals?.real)" :key="`a-r-${tile.row}-${tile.col}-${i}`" class="real">
                  <img v-if="bioImg('animals', a.type, a.growthStage)" :src="bioImg('animals', a.type, a.growthStage)" class="icon-img" alt=""/>
                  <span v-else>{{ bioIcon('animals', a.type) }}</span>
                </span>
              </template>
              <template v-else-if="phase === 1">
                <span v-for="(a,i) in list(tile.animals?.optimized)" :key="`a-p-${tile.row}-${tile.col}-${i}`" class="proj">
                  <img v-if="bioImg('animals', a.type, a.growthStage)" :src="bioImg('animals', a.type, a.growthStage)" class="icon-img proj-img" alt=""/>
                  <span v-else>{{ bioIcon('animals', a.type) }}</span>
                </span>
              </template>
              <template v-else>
                <span v-for="(a,i) in list(tile.animals?.real)" :key="`a-br-${tile.row}-${tile.col}-${i}`" class="real">
                  <img v-if="bioImg('animals', a.type, a.growthStage)" :src="bioImg('animals', a.type, a.growthStage)" class="icon-img" alt=""/>
                  <span v-else>{{ bioIcon('animals', a.type) }}</span>
                </span>
                <span v-for="(a,i) in list(tile.animals?.optimized)" :key="`a-bp-${tile.row}-${tile.col}-${i}`" class="proj">
                  <img v-if="bioImg('animals', a.type, a.growthStage)" :src="bioImg('animals', a.type, a.growthStage)" class="icon-img proj-img" alt=""/>
                  <span v-else>{{ bioIcon('animals', a.type) }}</span>
                </span>
              </template>
            </div>

            <!-- Row 3: Plants -->
            <div class="row">
              <template v-if="phase === 0">
                <span v-for="(p,i) in list(tile.plants?.real)" :key="`p-r-${tile.row}-${tile.col}-${i}`" class="real">
                  <img v-if="bioImg('plants', p.type, p.growthStage)" :src="bioImg('plants', p.type, p.growthStage)" class="icon-img" alt=""/>
                  <span v-else>{{ bioIcon('plants', p.type) }}</span>
                </span>
              </template>
              <template v-else-if="phase === 1">
                <span v-for="(p,i) in list(tile.plants?.optimized)" :key="`p-p-${tile.row}-${tile.col}-${i}`" class="proj">
                  <img v-if="bioImg('plants', p.type, p.growthStage)" :src="bioImg('plants', p.type, p.growthStage)" class="icon-img proj-img" alt=""/>
                  <span v-else>{{ bioIcon('plants', p.type) }}</span>
                </span>
              </template>
              <template v-else>
                <span v-for="(p,i) in list(tile.plants?.real)" :key="`p-br-${tile.row}-${tile.col}-${i}`" class="real">
                  <img v-if="bioImg('plants', p.type, p.growthStage)" :src="bioImg('plants', p.type, p.growthStage)" class="icon-img" alt=""/>
                  <span v-else>{{ bioIcon('plants', p.type) }}</span>
                </span>
                <span v-for="(p,i) in list(tile.plants?.optimized)" :key="`p-bp-${tile.row}-${tile.col}-${i}`" class="proj">
                  <img v-if="bioImg('plants', p.type, p.growthStage)" :src="bioImg('plants', p.type, p.growthStage)" class="icon-img proj-img" alt=""/>
                  <span v-else>{{ bioIcon('plants', p.type) }}</span>
                </span>
              </template>
            </div>

            <!-- Row 4: Assemblies -->
            <div class="row">
              <span v-if="tile.assemblies?.length" class="assemblies-icons">
                {{ tile.assemblies.real.map(() => '🤖').join('') }}
              </span>
            </div>

            <!-- Row 5: Coordinates -->
            <div class="row row-coord">
              <span class="cellId">{{ tile.row }}, {{ tile.col }}</span>
            </div>

          </div>
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
  user-select: none;
  cursor: pointer;
  box-shadow: inset 0 0 0 1px black;
  color: black;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.cell.active { outline: 3px solid #ffd600; outline-offset: -2px; }
.cell .cellId { align-self: flex-end; margin: 5px; }
.cell.unsurveyed .cellId { color: white; }
.cell.unsurveyed { background: rgba(0,0,0,.95); }

.icons {
  position: absolute;
  inset: 0;
  display: grid;
  grid-template-rows: auto auto auto auto auto;
  row-gap: 2px;
  align-content: stretch;
  justify-items: center;
  pointer-events: none;
  padding: 3px 4px;
}
.tile-rows { width: 100%; height: 100%; display: contents; }

.row {
  display: flex;
  flex-wrap: wrap;
  gap: .25em .35em;
  align-items: center;
  justify-content: center;
}

.icon-img {
  width: 1.4em;
  height: 1.4em;
  object-fit: contain;
  vertical-align: middle;
}

.row-res .res-line {
  display: inline-flex;
  align-items: center;
  gap: .35em;
  font-variant-numeric: tabular-nums;
}
.row-res .val.real { color: black; }
.row-res .val.proj { color: #7a5cff; } /* optimized text */
.row-res .proj .icon-img { opacity: .7; filter: hue-rotate(270deg) saturate(1.2); }
.row-res .both .icon-img { opacity: 1; }
.row-res .sep { opacity: .7; padding: 0 .1em; }

.proj img.proj-img { opacity: .7; filter: hue-rotate(270deg) saturate(1.2); }

.row-coord .cellId { align-self: center; margin: 0; opacity: .9; }

.closeModalBtn { position: absolute; top: 5px; right: 20px; }
</style>
