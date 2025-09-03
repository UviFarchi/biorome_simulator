<!-- src/components/grid/TileInfo.vue -->
<script setup>
import { computed } from 'vue'
import { mapStore } from '@/stores/map.js'
import { gameStore } from '@/stores/game.js'

import { plantStore } from '@/stores/plant.js'
import { animalStore } from '@/stores/animal.js'

import animalEffects from '@/engine/effects/animal.js'
import plantEffects  from '@/engine/effects/plant.js'
import resourceEffects from '@/engine/effects/resource.js'

import MetricsTable from '@/components/grid/tileInfoBlocks/MetricsTable.vue'
import BiotaTable    from '@/components/grid/tileInfoBlocks/BiotaTable.vue'

const map   = mapStore()
const game  = gameStore()
const plantsStore  = plantStore()
const animalsStore = animalStore()

/* ========= selection & phase ========= */

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
  const grid = Array.isArray(map.previousDayTiles) ? map.previousDayTiles : map.previousDayTiles?.value
  return grid?.[currentTile.value.row]?.[currentTile.value.col] || null
})

/* ========= measured (real) ========= */

function collectMeasured(tile) {
  const out = new Map()
  if (!tile) return out

  const visit = (obj, group, prefix) => {
    if (!obj || typeof obj !== 'object') return

    // leaf metric: { unit, measured:{ value, date, collect } }
    if (obj.measured && typeof obj.measured === 'object') {
      const { value, date } = obj.measured
      out.set(`${group}:${prefix || group}`, {
        value,
        unit: obj.unit,
        expiry: date || null
      })
      return
    }

    if (Array.isArray(obj)) {
      obj.forEach((item, i) => {
        const base  = item?.type
        const stage = item?.growthStage
        const id = item?.id || `${base ?? 'item'}#${i}`
        const tag = stage ? `${base}:${stage}#${id}` : `${base ?? 'item'}#${id}`
        visit(item, group, prefix ? `${prefix}[${tag}]` : `[${tag}]`)
      })
      return
    }

    for (const k of Object.keys(obj)) {
      const v = obj[k]
      const path = prefix ? `${prefix}.${k}` : k
      if (v && typeof v === 'object') visit(v, group, path)
    }
  }

  // abiotic
  visit(tile.topography ?? {}, 'topography', '')
  visit(tile.soil ?? {},       'soil',       '')
  visit(tile.resources ?? {},  'resources',  '')

  // biotic (REAL only)
  visit(tile.plants?.real  ?? [], 'plants',  '')
  visit(tile.animals?.real ?? [], 'animals', '')

  return out
}

/* ========= helpers for phase 1/2 overlay ========= */

const specByAnimalType = computed(() => {
  const m = new Map()
  for (const s of (animalsStore.animalTypes || [])) m.set(s.type, s)
  return m
})

const specByPlantType = computed(() => {
  const m = new Map()
  for (const s of (plantsStore.plantTypes || [])) m.set(s.type, s)
  return m
})

function applyDelta(deltaByKey, key, add) {
  deltaByKey.set(key, (deltaByKey.get(key) || 0) + add)
}

function metricKeyFromEffect(eff) {
  // eff: { target:'soil'|'topography'|'resources'|'animals'|'plants', property:'ph'... }
  return `${eff.target}:${eff.property}`
}

function diffById(realArr, projArr) {
  const r = Array.isArray(realArr) ? realArr : []
  const p = Array.isArray(projArr) ? projArr : []
  const rById = new Map(r.filter(x => x && x.id).map(x => [x.id, x]))
  const pById = new Map(p.filter(x => x && x.id).map(x => [x.id, x]))

  const added   = []
  const removed = []
  for (const [id, inst] of pById) if (!rById.has(id)) added.push(inst)
  for (const [id, inst] of rById) if (!pById.has(id)) removed.push(inst)
  return { added, removed }
}

function runInstanceEffects({ category, instance, spec, deltaByKey, tileLike }) {
  const catalog = (category === 'animals') ? animalEffects : plantEffects
  const list = catalog?.[spec?.type] || []
  for (const eff of list) {
    const d = (typeof eff.delta === 'function')
        ? eff.delta({ tile: tileLike, subject: spec, instance, key: spec.type, category })
        : eff.delta
    if (typeof d !== 'number' || !Number.isFinite(d)) continue
    applyDelta(deltaByKey, metricKeyFromEffect(eff), d)
  }
}

/* ========= build “otherMap” for phase 1/2 ========= */

function buildOtherMapForPhase12(tile) {
  const measuredMap = collectMeasured(tile)
  const deltaByKey = new Map()

  // animals: project add/remove by *id* to preserve growthStage
  {
    const { added, removed } = diffById(tile.animals?.real, tile.animals?.projected)
    for (const inst of added) {
      const spec = specByAnimalType.value.get(inst.type)
      if (!spec) continue
      runInstanceEffects({ category: 'animals', instance: inst, spec, deltaByKey, tileLike: tile })
    }
    for (const inst of removed) {
      const spec = specByAnimalType.value.get(inst.type)
      if (!spec) continue
      // subtract the effect of removed instances
      const before = new Map()
      runInstanceEffects({ category: 'animals', instance: inst, spec, deltaByKey: before, tileLike: tile })
      for (const [k, v] of before) applyDelta(deltaByKey, k, -v)
    }
  }

  // plants: same logic
  {
    const { added, removed } = diffById(tile.plants?.real, tile.plants?.projected)
    for (const inst of added) {
      const spec = specByPlantType.value.get(inst.type)
      if (!spec) continue
      runInstanceEffects({ category: 'plants', instance: inst, spec, deltaByKey, tileLike: tile })
    }
    for (const inst of removed) {
      const spec = specByPlantType.value.get(inst.type)
      if (!spec) continue
      const before = new Map()
      runInstanceEffects({ category: 'plants', instance: inst, spec, deltaByKey: before, tileLike: tile })
      for (const [k, v] of before) applyDelta(deltaByKey, k, -v)
    }
  }

  // resource planned uses (if any)
  {
    const uses = tile?.resources?.projectedUses
    if (Array.isArray(uses) && uses.length) {
      const qtyBy = {}
      for (const u of uses) {
        const k = u?.key
        const q = Number(u?.qty)
        if (!k || !Number.isFinite(q) || q === 0) continue
        qtyBy[k] = (qtyBy[k] || 0) + q
      }
      for (const [rtype, qty] of Object.entries(qtyBy)) {
        const list = resourceEffects?.[rtype] || []
        for (const eff of list) {
          const d = (typeof eff.delta === 'function')
              ? eff.delta({ qty, tile })
              : eff.delta
          if (typeof d !== 'number' || !Number.isFinite(d)) continue
          applyDelta(deltaByKey, metricKeyFromEffect(eff), qty * d)
        }
      }
    }
  }

  // overlay deltas on measured → otherMap
  const otherMap = new Map(measuredMap)
  for (const [key, d] of deltaByKey) {
    const entry = otherMap.get(key)
    if (entry && typeof entry.value === 'number' && Number.isFinite(entry.value)) {
      otherMap.set(key, { ...entry, value: entry.value + d })
    } else if (!otherMap.has(key)) {
      // create placeholder if effect touches a metric that had no measurement yet
      otherMap.set(key, { value: d, unit: undefined, expiry: null })
    }
  }
  return otherMap
}

/* ========= comparison by phase ========= */

const comparison = computed(() => {
  const tile = currentTile.value
  if (!tile) return { label: '—', measuredMap: new Map(), otherMap: new Map() }

  const measuredMap = collectMeasured(tile)

  // Phase 0: Previous vs Current
  if (turnPhase.value === 0) {
    const prevMap = previousTile.value ? collectMeasured(previousTile.value) : new Map()
    return { label: 'Previous', measuredMap, otherMap: prevMap }
  }

  // Phase 1/2: Projected/Planned vs Current
  const otherMap = buildOtherMapForPhase12(tile)
  const label = (turnPhase.value === 1) ? 'Projected' : 'Planned'
  return { label, measuredMap, otherMap }
})

/* ========= measure toggles ========= */

function resolveNodeByMetricKey(tile, metricKey) {
  const [group, rawPath] = metricKey.split(':', 2)
  if (!tile || !group || !rawPath) return null

  let node = (group === 'animals')
      ? tile.animals?.real
      : (group === 'plants')
          ? tile.plants?.real
          : tile[group]

  if (node == null) return null

  const segments = []
  let buf = '', inBracket = false
  for (const ch of rawPath) {
    if (ch === '[') inBracket = true
    if (ch === ']') inBracket = false
    if (ch === '.' && !inBracket) { segments.push(buf); buf = '' }
    else buf += ch
  }
  if (buf) segments.push(buf)

  for (const seg of segments) {
    if (seg.startsWith('[') && seg.endsWith(']')) {
      // segment like: "[type:stage#<id>]" or "[type#<id>]"
      const hash = seg.lastIndexOf('#')
      if (hash < 0) return null
      const id = seg.slice(hash + 1, -1)
      if (!Array.isArray(node)) return null
      node = node.find(x => String(x?.id) === id)
    } else {
      node = node?.[seg]
    }
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

/* ========= formatting ========= */

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
  if (!entry) return 'No entry'
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
          :tile="currentTile"
          :comparison="comparison"
          :isMeasureMarked="isMeasureMarked"
          :toggleMeasureMark="toggleMeasureMark"
          :formatValue="formatValue"
          :formatDate="formatDate"
      />
      <MetricsTable
          title="Topography"
          group="topography"
          :tile="currentTile"
          :comparison="comparison"
          :isMeasureMarked="isMeasureMarked"
          :toggleMeasureMark="toggleMeasureMark"
          :formatValue="formatValue"
          :formatDate="formatDate"
      />
      <MetricsTable
          title="Soil"
          group="soil"
          :tile="currentTile"
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
