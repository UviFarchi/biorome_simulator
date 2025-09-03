<script setup>
import { computed } from 'vue'
import { gameStore } from '@/stores/game.js'
import MetricsTable from '@/components/grid/tileInfoBlocks/MetricsTable.vue'
import { plantStore } from '@/stores/plant.js'
import { animalStore } from '@/stores/animal.js'

const plants = plantStore()
const animals = animalStore()

const images = import.meta.glob('/src/assets/{plants,animals}/*/*.png', {
  eager: true,
  as: 'url',
})

function bioImg(kind, type, stage) {
  if (!kind || !type || !stage) return null
  const key = `/src/assets/${kind}/${type}/${stage}.png`
  return images[key] || null
}

function bioIcon(kind, type) {
  if (kind === 'plants') {
    return plants.plantTypes?.find((p) => p.type === type)?.icon || '🌱'
  }
  if (kind === 'animals') {
    return animals.animalTypes?.find((a) => a.type === type)?.icon || '🐾'
  }
  return '❓'
}

const props = defineProps({
  group: { type: String, required: true }, // 'animals' | 'plants'
  title: { type: String, default: '' },
  real: { type: Array, default: () => [] },
  projected: { type: Array, default: () => [] },
  comparison: { type: Object, required: true },
  isMeasureMarked: { type: Function, default: null },
  toggleMeasureMark: { type: Function, default: null },
  formatValue: { type: Function, required: true },
  formatDate: { type: Function, required: true },
})

const phase = computed(() => gameStore().turnPhase)

function comparisonForProjected(inst) {
  const otherMap = new Map()
  const id = inst.id
  if (!id) throw new Error('Projected instance missing id')
  const base = `${props.group}:${id}`

  function visit(obj, path = '') {
    if (!obj || typeof obj !== 'object') return
    if (obj.measured && typeof obj.measured === 'object') {
      const { value, date } = obj.measured
      otherMap.set(`${base}${path ? '.' + path : ''}`, {
        value,
        unit: obj.unit,
        expiry: date || null,
      })
      return
    }
    for (const [k, v] of Object.entries(obj)) {
      if (['id', 'type', 'growthStage', 'flags'].includes(k)) continue
      if (v && typeof v === 'object') visit(v, path ? `${path}.${k}` : k)
    }
  }

  visit(inst)
  return { measuredMap: props.comparison.measuredMap, otherMap }
}

function toggleFlag(inst, flag) {
  if (!inst.flags) inst.flags = {}
  inst.flags[flag] = !inst.flags[flag]
}

const displayTitle = computed(() =>
  props.title || props.group[0].toUpperCase() + props.group.slice(1)
)
</script>

<template>
  <section class="group-section">
    <h4 class="group-title">{{ displayTitle }} — On Tile</h4>

    <table class="kv kv--biota">
      <colgroup>
        <col style="width:10ch" />
        <col style="width:6ch" />
        <col style="width:12ch" />
        <col />
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
        <tr v-for="inst in real" :key="inst.id">
          <td>
            <img
              v-if="bioImg(group, inst.type, inst.growthStage)"
              :src="bioImg(group, inst.type, inst.growthStage)"
              class="table-image"
              alt=""
            />
            <span v-else>{{ bioIcon(group, inst.type) }}</span>
          </td>
          <td>
            <span class="badge badge--real">{{ inst.type }}</span><br />
            <span class="badge badge--real">{{ inst.growthStage }}</span>
          </td>
          <td class="actions">
            <template v-if="group === 'animals'">
              <button
                class="btn btn--ghost"
                :disabled="phase !== 1"
                @click="toggleFlag(inst, 'move')"
              >
                Move
                <span v-if="inst.flags?.move">(on)</span>
              </button>
              <button
                class="btn btn--ghost"
                :disabled="phase !== 1"
                @click="toggleFlag(inst, 'limitArea')"
              >
                Limit Area
                <span v-if="inst.flags?.limitArea">(on)</span>
              </button>
            </template>
            <button
              class="btn btn--danger"
              :disabled="phase !== 1"
              @click="toggleFlag(inst, 'remove')"
            >
              Remove
              <span v-if="inst.flags?.remove">(flagged)</span>
            </button>
          </td>
          <td>
            <MetricsTable
              title="Properties"
              :group="group"
              :comparison="props.comparison"
              :basePath="inst.id"
              :isMeasureMarked="props.isMeasureMarked"
              :toggleMeasureMark="props.toggleMeasureMark"
              :formatValue="props.formatValue"
              :formatDate="props.formatDate"
            />
          </td>
        </tr>
      </tbody>
    </table>

    <h4 class="group-title">{{ displayTitle }} — Projected</h4>
    <table class="kv kv--biota" style="margin-top:10px">
      <colgroup>
        <col style="width:10ch" />
        <col style="width:6ch" />
        <col style="width:12ch" />
        <col />
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
        <tr v-for="(inst, idx) in projected" :key="inst.id">
          <td>
            <img
              v-if="bioImg(group, inst.type, inst.growthStage)"
              :src="bioImg(group, inst.type, inst.growthStage)"
              class="table-image"
              alt=""
            />
            <span v-else>{{ bioIcon(group, inst.type) }}</span>
          </td>
          <td>
            <span class="badge badge--proj">{{ inst.type }}</span><br />
            <span class="badge badge--proj">{{ inst.growthStage }}</span>
          </td>
          <td class="actions">
            <button
              class="btn btn--danger"
              :disabled="phase !== 1"
              @click="projected.splice(idx, 1)"
            >
              Remove
            </button>
          </td>
          <td>
            <MetricsTable
              title="Properties"
              :group="group"
              :comparison="comparisonForProjected(inst)"
              :basePath="inst.id"
              :formatValue="props.formatValue"
              :formatDate="props.formatDate"
            />
          </td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<style scoped>
.kv--biota { table-layout: fixed; }
.kv--biota th,
.kv--biota td { overflow: hidden; text-overflow: clip; white-space: nowrap; }
td.actions { white-space: nowrap; }

.table-image {
  max-height: 18ch;
  align-items: center;
  justify-self: center;
  display: flex;
}
</style>

