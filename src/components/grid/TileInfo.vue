<!-- src/components/grid/TileInfo.vue -->
<script setup>
import { computed } from 'vue'
import { mapStore } from '@/stores/map.js'
import { gameStore } from '@/stores/game.js'
import { plantStore } from '@/stores/plant.js'
import { animalStore } from '@/stores/animal.js'

import animalEffects from '@/engine/effects/animal.js'
import plantEffects from '@/engine/effects/plant.js'
import resourceEffects from '@/engine/effects/resource.js'

import MetricsTable from '@/components/grid/tileInfoBlocks/MetricsTable.vue'
import BiotaTable from '@/components/grid/tileInfoBlocks/BiotaTable.vue'

const map = mapStore()
const game = gameStore()
const plants = plantStore()
const animals = animalStore()

/* ---------------- selection & phase ---------------- */
const currentTile = computed(() => {
  const t = map.selectedTile
  return t && typeof t === 'object' && 'value' in t ? t.value : t
})

const turnPhase = computed(() => game.turnPhase)

const selectedKey = computed(() =>
  currentTile.value ? `${currentTile.value.row},${currentTile.value.col}` : null
)

const previousTile = computed(() => {
  if (!currentTile.value) return null
  const grid = Array.isArray(map.previousDayTiles)
    ? map.previousDayTiles
    : map.previousDayTiles?.value
  return grid?.[currentTile.value.row]?.[currentTile.value.col] || null
})

/* ---------------- measured map ---------------- */
function collectMeasured(tile) {
  const out = new Map()
  if (!tile) return out

  function walkAbiotic(obj, group, path = '') {
    if (!obj || typeof obj !== 'object') return
    if (obj.measured && typeof obj.measured === 'object') {
      const { value, date } = obj.measured
      out.set(`${group}:${path}`, {
        value,
        unit: obj.unit,
        expiry: date || null,
      })
      return
    }
    for (const [k, v] of Object.entries(obj)) {
      if (v && typeof v === 'object') {
        walkAbiotic(v, group, path ? `${path}.${k}` : k)
      }
    }
  }

  function walkInstance(inst, group) {
    if (!inst || typeof inst !== 'object') return
    const id = inst.id
    if (!id) throw new Error(`Instance missing id in ${group}`)
    const base = `${group}:${id}`

    function visit(obj, path = '') {
      if (!obj || typeof obj !== 'object') return
      if (obj.measured && typeof obj.measured === 'object') {
        const { value, date } = obj.measured
        out.set(`${base}${path ? '.' + path : ''}`, {
          value,
          unit: obj.unit,
          expiry: date || null,
        })
        return
      }
      for (const [k, v] of Object.entries(obj)) {
        if (['id', 'type', 'growthStage', 'flags'].includes(k)) continue
        if (v && typeof v === 'object') {
          visit(v, path ? `${path}.${k}` : k)
        }
      }
    }

    visit(inst)
  }

  walkAbiotic(tile.soil, 'soil')
  walkAbiotic(tile.topography, 'topography')
  walkAbiotic(tile.resources, 'resources')

  ;(tile.animals?.real || []).forEach((a) => walkInstance(a, 'animals'))
  ;(tile.plants?.real || []).forEach((p) => walkInstance(p, 'plants'))

  return out
}

/* ---------------- helpers for phase overlays ---------------- */
const animalSpecs = computed(() => {
  const m = new Map()
  for (const s of animals.animalTypes || []) m.set(s.type, s)
  return m
})

const plantSpecs = computed(() => {
  const m = new Map()
  for (const s of plants.plantTypes || []) m.set(s.type, s)
  return m
})

function diffById(realArr, projArr) {
  const real = Array.isArray(realArr) ? realArr : []
  const proj = Array.isArray(projArr) ? projArr : []
  const realMap = new Map()
  const projMap = new Map()

  for (const r of real) {
    if (!r?.id) throw new Error('Real instance missing id')
    realMap.set(r.id, r)
  }
  for (const p of proj) {
    if (!p?.id) throw new Error('Projected instance missing id')
    projMap.set(p.id, p)
  }

  const added = []
  const removed = []
  for (const [id, inst] of projMap) if (!realMap.has(id)) added.push(inst)
  for (const [id, inst] of realMap) if (!projMap.has(id)) removed.push(inst)
  return { added, removed }
}

function runEffects({ list, ctx, sign, deltaByKey }) {
  for (const eff of list || []) {
    let d = typeof eff.delta === 'function' ? eff.delta(ctx) : eff.delta
    if (!Number.isFinite(d)) throw new Error('Effect delta is not finite')
    const key = `${eff.target}:${eff.property}`
    deltaByKey.set(key, (deltaByKey.get(key) || 0) + sign * d)
  }
}

function buildOtherMapForPhase(tile) {
  const measuredMap = collectMeasured(tile)
  const otherMap = new Map(measuredMap)
  const deltaByKey = new Map()

  // animals
  {
    const { added, removed } = diffById(
      tile.animals?.real,
      tile.animals?.projected
    )
    for (const inst of added) {
      const spec = animalSpecs.value.get(inst.type)
      runEffects({
        list: animalEffects?.[spec?.type],
        ctx: {
          tile,
          category: 'animals',
          key: spec?.type,
          subject: inst,
          spec,
        },
        sign: 1,
        deltaByKey,
      })
    }
    for (const inst of removed) {
      const spec = animalSpecs.value.get(inst.type)
      runEffects({
        list: animalEffects?.[spec?.type],
        ctx: {
          tile,
          category: 'animals',
          key: spec?.type,
          subject: inst,
          spec,
        },
        sign: -1,
        deltaByKey,
      })
    }
  }

  // plants
  {
    const { added, removed } = diffById(
      tile.plants?.real,
      tile.plants?.projected
    )
    for (const inst of added) {
      const spec = plantSpecs.value.get(inst.type)
      runEffects({
        list: plantEffects?.[spec?.type],
        ctx: {
          tile,
          category: 'plants',
          key: spec?.type,
          subject: inst,
          spec,
        },
        sign: 1,
        deltaByKey,
      })
    }
    for (const inst of removed) {
      const spec = plantSpecs.value.get(inst.type)
      runEffects({
        list: plantEffects?.[spec?.type],
        ctx: {
          tile,
          category: 'plants',
          key: spec?.type,
          subject: inst,
          spec,
        },
        sign: -1,
        deltaByKey,
      })
    }
  }

  // resources projected values & effects
  function walkResource(obj, path = '') {
    if (!obj || typeof obj !== 'object') return
    if (
      Object.prototype.hasOwnProperty.call(obj, 'projected') &&
      typeof obj.projected === 'number' &&
      Number.isFinite(obj.projected)
    ) {
      const key = path
      const entryKey = `resources:${key}`
      otherMap.set(entryKey, {
        value: obj.projected,
        unit: obj.unit,
        expiry: null,
      })

      const list = resourceEffects?.[key] || []
      const ctx = {
        tile,
        category: 'resources',
        key,
        subject: { qty: obj.projected },
        spec: null,
      }
      runEffects({ list, ctx, sign: 1, deltaByKey })
    }
    for (const [k, v] of Object.entries(obj)) {
      if (['measured', 'projected', 'unit', 'env'].includes(k)) continue
      if (v && typeof v === 'object') walkResource(v, path ? `${path}.${k}` : k)
    }
  }
  walkResource(tile.resources || {}, '')

  // apply deltas to otherMap
  for (const [key, d] of deltaByKey.entries()) {
    const entry = otherMap.get(key)
    if (entry && typeof entry.value === 'number') {
      otherMap.set(key, { ...entry, value: entry.value + d })
    } else if (!otherMap.has(key)) {
      otherMap.set(key, { value: d, unit: undefined, expiry: null })
    }
  }

  return otherMap
}

/* ---------------- comparison by phase ---------------- */
const comparison = computed(() => {
  const tile = currentTile.value
  if (!tile) return { label: '—', measuredMap: new Map(), otherMap: new Map() }

  const measuredMap = collectMeasured(tile)

  if (turnPhase.value === 0) {
    const prev = previousTile.value
    const otherMap = prev ? collectMeasured(prev) : new Map()
    return { label: 'Previous', measuredMap, otherMap }
  }

  const otherMap = buildOtherMapForPhase(tile)
  const label = turnPhase.value === 1 ? 'Projected' : 'Planned'
  return { label, measuredMap, otherMap }
})

/* ---------------- measure toggles ---------------- */
function resolveNodeByMetricKey(tile, metricKey) {
  const [group, path] = metricKey.split(':', 2)
  if (!group || !path) return null

  if (group === 'animals' || group === 'plants') {
    const [id, ...rest] = path.split('.')
    const arr = tile[group]?.real
    const inst = Array.isArray(arr) ? arr.find((x) => String(x.id) === id) : null
    if (!inst) return null
    let node = inst
    for (const seg of rest) {
      node = node?.[seg]
      if (node == null) return null
    }
    return node
  }

  let node = tile[group]
  for (const seg of path.split('.')) {
    node = node?.[seg]
    if (node == null) return null
  }
  return node
}

function isMeasureMarked(metricKey) {
  const tile = currentTile.value
  const node = tile && resolveNodeByMetricKey(tile, metricKey)
  return !!node?.measured?.collect
}

function toggleMeasureMark(metricKey) {
  const tile = currentTile.value
  const node = tile && resolveNodeByMetricKey(tile, metricKey)
  if (!node || !node.measured) return
  node.measured.collect = !node.measured.collect
}

/* ---------------- formatting helpers ---------------- */
function formatDate(iso) {
  if (!iso) return '—'
  try {
    const d = new Date(iso)
    if (Number.isNaN(d.getTime())) return String(iso)
    return d.toISOString().slice(0, 10)
  } catch {
    return String(iso)
  }
}

function formatValue(entry) {
  if (!entry) return 'No data'
  const { value, unit } = entry
  if (typeof value === 'number' && Number.isFinite(value)) {
    return `${value.toFixed(2)}${unit ? ' ' + unit : ''}`
  }
  if (value == null) return 'No data'
  return `${String(value)}${unit ? ' ' + unit : ''}`
}
</script>

<template>
  <div class="panel panel--fill" v-if="currentTile">
    <div class="panel-header-row">
      <h4>Tile {{ selectedKey }}</h4>
      <div class="phase-label">{{ comparison.label }}</div>
    </div>

    <div>
      <MetricsTable
        title="Resources"
        group="resources"
        :comparison="comparison"
        :isMeasureMarked="isMeasureMarked"
        :toggleMeasureMark="toggleMeasureMark"
        :formatValue="formatValue"
        :formatDate="formatDate"
      />
      <MetricsTable
        title="Topography"
        group="topography"
        :comparison="comparison"
        :isMeasureMarked="isMeasureMarked"
        :toggleMeasureMark="toggleMeasureMark"
        :formatValue="formatValue"
        :formatDate="formatDate"
      />
      <MetricsTable
        title="Soil"
        group="soil"
        :comparison="comparison"
        :isMeasureMarked="isMeasureMarked"
        :toggleMeasureMark="toggleMeasureMark"
        :formatValue="formatValue"
        :formatDate="formatDate"
      />

      <BiotaTable
        title="Plants"
        group="plants"
        :real="currentTile.plants?.real ?? []"
        :projected="currentTile.plants?.projected ?? []"
        :comparison="comparison"
        :isMeasureMarked="isMeasureMarked"
        :toggleMeasureMark="toggleMeasureMark"
        :formatValue="formatValue"
        :formatDate="formatDate"
      />
      <BiotaTable
        title="Animals"
        group="animals"
        :real="currentTile.animals?.real ?? []"
        :projected="currentTile.animals?.projected ?? []"
        :comparison="comparison"
        :isMeasureMarked="isMeasureMarked"
        :toggleMeasureMark="toggleMeasureMark"
        :formatValue="formatValue"
        :formatDate="formatDate"
      />
    </div>
  </div>
  <div v-else class="panel panel--fill">No tile selected.</div>
</template>

<style scoped>
:root {
  --border: #2c3e50;
  --muted: rgba(255, 255, 255, .08);
  --muted-2: rgba(255, 255, 255, .12);
  --ink: #111;
  --ok: #2fb86a;
  --bad: #d45757;
  --proj: #7a5cff;
}

:deep(.group-section) {
  margin: 12px 0 16px;
  padding: 10px;
  border: 1px solid var(--border);
  border-radius: 10px;
  background: var(--muted);
}

:deep(.group-title) {
  margin: 0 0 8px;
  font-weight: 700;
  letter-spacing: .02em;
  opacity: .9;
}

:deep(table.kv) {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  background: rgba(0, 0, 0, .15);
  border: 1px solid var(--border);
  border-radius: 10px;
  overflow: hidden;
  font-size: 0.95rem;
}

:deep(table.kv thead th) {
  text-align: left;
  padding: 8px 10px;
  background: var(--muted-2);
  border-bottom: 1px solid var(--border);
  font-weight: 600;
}
</style>

