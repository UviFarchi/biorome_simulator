<script setup>
import { computed } from 'vue'
import MetricsTable from '@/components/grid/tileInfoBlocks/MetricsTable.vue'
import { plantStore } from '@/stores/plant.js'
import { animalStore } from '@/stores/animal.js'

const plants  = plantStore()
const animals = animalStore()

// preload plant/animal stage images
const images = import.meta.glob('/src/assets/{plants,animals}/*/*.png', { eager: true, as: 'url' })

function bioImg(kind, type, stage) {
  if (!kind || !type || !stage) return null
  const key = `/src/assets/${kind}/${type}/${stage}.png`
  return images[key] || null
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

const props = defineProps({
  group: { type: String, required: true },                 // "animals" | "plants"
  real: { type: Array, default: () => [] },
  projected: { type: Array, default: () => [] },
  comparison: { type: Object, required: true },            // { measuredMap, otherMap }
  // pass-through utils from TileInfo
  isMeasureMarked: { type: Function, required: true },
  toggleMeasureMark: { type: Function, required: true },
  formatValue: { type: Function, required: true },
  formatDate: { type: Function, required: true },
  title: { type: String, default: '' },
})
import { gameStore } from '@/stores/game.js'
const game = gameStore()
const phase = computed(() => game.phase)
/* ---------- helpers ---------- */
function idFor(inst, idx) {
  const base = inst?.type ?? 'item'
  const stage = inst?.growthStage
  return stage ? `${base}:${stage}#${idx}` : `${base}#${idx}`
}

// Build a comparison object that exposes *only* the projected instance's
// measured metrics as the "otherMap" so MetricsTable can render that row.
function comparisonForProjectedInstance(inst, idx, group) {
  const otherMap = new Map()
  const prefix = `${group}:[${idFor(inst, idx)}]`

  const visit = (obj, path) => {
    if (!obj || typeof obj !== 'object') return
    if (obj.measured && typeof obj.measured === 'object') {
      otherMap.set(`${prefix}.${path}`, {
        value: obj.measured.value,
        unit: obj.unit,
        expiry: null
      })
      return
    }
    for (const k of Object.keys(obj)) {
      const v = obj[k]
      if (v && typeof v === 'object') visit(v, path ? `${path}.${k}` : k)
    }
  }
  visit(inst, '') // collect all measured leaves under the instance
  return { measuredMap: new Map(), otherMap }
}

const realRows = computed(() =>
    props.real.map((b, idx) => ({ b, idx, basePath: `[${idFor(b, idx)}]` }))
)

const projRows = computed(() =>
    props.projected.map((b, idx) => ({
      b, idx,
      basePath: `[${idFor(b, idx)}]`,
      comp: comparisonForProjectedInstance(b, idx, props.group),
    }))
)

const displayTitle = computed(() =>
    props.title || (props.group ? props.group[0].toUpperCase() + props.group.slice(1) : '')
)
</script>

<template>
  <section class="group-section">
    <h4 class="group-title">{{ displayTitle }} — On Tile</h4>

    <table class="kv kv--biota">
      <colgroup>
        <col style="width:10ch" />  <!-- Image -->
        <col style="width:4ch" />  <!-- Type and stage -->
        <col style="width:8ch" />  <!-- Actions -->
        <col style="width:24ch"/>                     <!-- Properties -->
      </colgroup>
      <thead>
      <tr>
        <th>Image</th>
        <th>Type</th>
        <th>Actions</th>
        <th>Properties</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="row in realRows" :key="row.b.id || `real-${row.idx}`">
        <td>
          <img
              v-if="bioImg(group, row.b.type, row.b.growthStage)"
              :src="bioImg(group, row.b.type, row.b.growthStage)"
              class="table-image"              alt=""
          />
          <span v-else>{{ bioIcon(group, row.b.type) }}</span>
        </td>
        <td><span class="badge badge--real">{{ row.b.type }}</span><br/><span class="badge badge--real">{{ row.b.growthStage}}</span></td>

        <td class="actions">
          <template v-if="group === 'animals'">
            <button class="btn btn--ghost" :disabled="phase!==1" @click="row.b.flags = {...(row.b.flags||{}), move: !row.b.flags?.move}">
              Move <span v-if="row.b.flags?.move">(on)</span>
            </button>
            <button class="btn btn--ghost" :disabled="phase!==1" @click="row.b.flags = {...(row.b.flags||{}), limitArea: !row.b.flags?.limitArea}">
              Limit Area <span v-if="row.b.flags?.limitArea">(on)</span>
            </button>
          </template>
          <button class="btn btn--danger" :disabled="phase!==1" @click="row.b.flags = {...(row.b.flags||{}), remove: !row.b.flags?.remove}">
            Remove <span v-if="row.b.flags?.remove">(flagged)</span>
          </button>
        </td>

        <td>
          <MetricsTable
              :title="'Properties'"
              :group="group"
              :tile="{}"
              :comparison="comparison"
              :basePath="row.basePath"
              :isMeasureMarked="isMeasureMarked"
              :toggleMeasureMark="toggleMeasureMark"
              :formatValue="formatValue"
              :formatDate="formatDate"
              :showMeasureInPhase1="true"
          />
        </td>
      </tr>
      </tbody>
    </table>

    <h4 class="group-title">{{ displayTitle }} — Projected</h4>
    <table class="kv kv--biota" style="margin-top:10px">
      <colgroup>
        <col style="width:10ch" />  <!-- Image -->
        <col style="width:4ch" />  <!-- Type and stage -->
        <col style="width:8ch" />  <!-- Actions -->
        <col style="width:24ch"/>                     <!-- Properties -->
      </colgroup>
      <thead>
      <tr>
        <th>Image</th>
        <th>Type</th>
        <th>Actions</th>
        <th>Properties</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="row in projRows" :key="row.b.id || `proj-${row.idx}`">
        <td>
          <img
              v-if="bioImg(group, row.b.type, row.b.growthStage)"
              :src="bioImg(group, row.b.type, row.b.growthStage)"
              class="table-image"
              alt=""
          />
          <span v-else>{{ bioIcon(group, row.b.type) }}</span>
        </td>
        <td><span class="badge badge--proj">{{ row.b.type }}</span><br/><span class="badge badge--proj">{{ row.b.growthStage }}</span></td>
        <td class="actions">
          <button class="btn btn--danger" :disabled="phase!==1" @click="projected.splice(row.idx,1)">Remove</button>
        </td>
        <td>
          <MetricsTable
              :title="'Properties'"
              :group="group"

              :tile="{}"
              :comparison="row.comp"
              :basePath="row.basePath"
              :isMeasureMarked="isMeasureMarked"
              :toggleMeasureMark="toggleMeasureMark"
              :formatValue="formatValue"
              :formatDate="formatDate"
              :showMeasureInPhase1="false"
          />
        </td>
      </tr>
      </tbody>
    </table>
  </section>
</template>

<style scoped>
.kv--biota,
.kv--props { table-layout: fixed; }
.kv--props th,
.kv--props td { overflow: hidden; text-overflow: clip; white-space: nowrap; }
td.actions { white-space: nowrap; }

.table-image {
  max-height: 18ch;
  align-items: center;
  justify-self: center;
  display: flex;
}
</style>
