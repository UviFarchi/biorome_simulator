<!-- src/components/grid/tileInfoBlocks/BiotaTable.vue -->
<!-- eslint-disable vue/no-mutating-props -->
<script setup>
/* eslint-disable vue/no-mutating-props */
import { computed } from 'vue'
import MetricsTable from '@/components/grid/tileInfoBlocks/MetricsTable.vue'
import { gameStore } from '@/stores/game.js'
import { getImageOrIcon } from '@/utils/tileHelpers.js'

const game    = gameStore()
const phase   = computed(() => game.phase)

const props = defineProps({
  group: { type: String, required: true },                 // "animals" | "plants"
  real: { type: Array, default: () => [] },
  optimized: { type: Array, default: () => [] },
  formatValue: { type: Function, required: true },
  formatDate: { type: Function, required: true },
  title: { type: String, default: '' },
})
const NON_MEASURABLE = new Set(['id','type','dateDeployed','growthStage','flags'])

function biotaBlockMeasured(entity) {
  const out = {}
  const seen = new WeakSet()

  const walk = (node, path='') => {
    if (!node || typeof node !== 'object') return
    if (seen.has(node)) return
    seen.add(node)

    // measurable leaf: has measured
    if (node && typeof node.measured === 'object' && 'value' in node.measured) {
      const key = path || 'value'
      out[key] = node   // MetricsTable uses *.measured.*
      return
    }

    // skip plain scalars and known structural keys at the top level
    const entries = Array.isArray(node) ? node.entries() : Object.entries(node)
    for (const [k, v] of entries) {
      if (!v) continue
      if (!path && NON_MEASURABLE.has(k)) continue
      const nextPath = Array.isArray(node) ? `${path}[${k}]` : (path ? `${path}.${k}` : k)
      if (typeof v === 'object') walk(v, nextPath)
    }
  }

  walk(entity, '')
  return out
}


/* rows */
const realRows = computed(() =>
    props.real.map((instance, index) => ({
      instance, index, basePath: `[${instance.id}]`,
    }))
)

const optimizedRows = computed(() =>
    props.optimized.map((instance, index) => ({
      instance,
      index,
      basePath: `[${instance.id}]`,
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
        <col style="width:22ch" />  <!-- Entity -->
        <col />                     <!-- Properties -->
      </colgroup>
      <thead>
      <tr>
        <th>Entity</th>
        <th>Properties</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="row in realRows" :key="row.instance.id || `real-${row.index}`">
        <td class="entity-cell">
          <div class="entity-header">
            <span class="badge badge--real">{{ row.instance.growthStage }}</span>
            <span class="badge badge--real">{{ row.instance.type }}</span>
          </div>
          <div class="entity-visual">
            <img
                v-if="getImageOrIcon(group, row.instance.type, row.instance.growthStage)?.includes('/')"
                :src="getImageOrIcon(group, row.instance.type, row.instance.growthStage)"
                class="entity-image"
                alt=""
            />
            <span v-else class="entity-icon">{{ getImageOrIcon(group, row.instance.type, row.instance.growthStage) }}</span>
          </div>
          <!-- no buttons for real rows -->
        </td>

        <td>
          <MetricsTable title="Properties" field="_biota" :data="biotaBlockMeasured(row.instance)" />

        </td>
      </tr>
      </tbody>
    </table>

    <h4 class="group-title">{{ displayTitle }} — Optimized</h4>
    <table class="kv kv--biota" style="margin-top:10px">
      <colgroup>
        <col style="width:22ch" />  <!-- Entity -->
        <col />                     <!-- Properties -->
      </colgroup>
      <thead>
      <tr>
        <th>Entity</th>
        <th>Properties</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="row in optimizedRows" :key="row.instance.id || `proj-${row.index}`">
        <td class="entity-cell">
          <div class="entity-header">
            <span class="badge badge--proj">{{ row.instance.growthStage }}</span>
            <span class="badge badge--proj">{{ row.instance.type }}</span>
          </div>
          <div class="entity-visual">
            <img
                v-if="getImageOrIcon(group, row.instance.type, row.instance.growthStage)?.includes('/')"
                :src="getImageOrIcon(group, row.instance.type, row.instance.growthStage)"
                class="entity-image"
                alt=""
            />
            <span v-else class="entity-icon">{{ getImageOrIcon(group, row.instance.type, row.instance.growthStage) }}</span>
          </div>
          <button
              class="btn btn--danger entity-action"
              :disabled="phase!==1"
              @click="optimized.splice(row.index, 1)"
          >
            Remove
          </button>
        </td>

        <td>
          <MetricsTable title="Properties" field="_biota" :data="biotaBlockMeasured(row.instance)" />

        </td>
      </tr>
      </tbody>
    </table>
  </section>
</template>

<style scoped>
.kv--biota { table-layout: fixed; }
td.entity-cell { vertical-align: top; }

.entity-header {
  display: flex;
  gap: .4em;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 6px;
}

.entity-visual {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 6rem;
  margin-bottom: 6px;
}

.entity-image {
  max-height: 10ch;
  display: block;
}

.entity-icon {
  font-size: 2rem;
  line-height: 1;
}

.entity-action {
  width: 100%;
  margin-top: 4px;
}

.badge { display: inline-flex; align-items: center; gap: .35em; padding: 2px 8px; border-radius: 999px; border: 1px solid var(--border); font-size: .85em; background: color-mix(in srgb, var(--color-bg) 18%, transparent); }
.badge--real { color: var(--ink); background: color-mix(in srgb, var(--color-bg) 8%, transparent); }
.badge--proj { color: var(--color-text); background: color-mix(in srgb, var(--color-projected) 22%, transparent); border-color: color-mix(in srgb, var(--color-projected) 65%, transparent); }
</style>
