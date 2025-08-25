<!-- src/components/modals/TileInfo.vue -->
<script setup>
import { computed } from 'vue'
import { mapStore } from '@/stores/map.js'
import { gameStore } from '@/stores/game.js'

const map = mapStore()
const game = gameStore()

// Unwrap selected tile if it's a ref-like
const currentTile = computed(() => {
  const t = map.selectedTile
  return t && typeof t === 'object' && 'value' in t ? t.value : t
})

const selectedKey = computed(() =>
    currentTile.value ? `${currentTile.value.row},${currentTile.value.col}` : null
)

// Get previous-day tile at same coordinates
const previousTile = computed(() => {
  if (!currentTile.value) return null
  const prevGrid = Array.isArray(map.previousDayTiles) ? map.previousDayTiles : map.previousDayTiles?.value
  const r = currentTile.value.row, c = currentTile.value.col
  const t = prevGrid?.[r]?.[c] || null
  return t
})

// Build table rows: union of all {env,unit} leaves across prev and current
const tableRows = computed(() => {
  const curr = currentTile.value
  if (!curr) return []
  const prev = previousTile.value

  const currMap = collectEnv(curr)
  const prevMap = collectEnv(prev)

  const keys = new Set([...currMap.keys(), ...prevMap.keys()])
  const rows = []
  for (const k of keys) {
    const { group, path } = parseKey(k)
    const currEntry = currMap.get(k)
    const prevEntry = prevMap.get(k)
    rows.push({
      key: k,
      group,
      path,
      prev: prevEntry,
      curr: currEntry,
      changed: !valuesEqual(currEntry?.value, prevEntry?.value),
      delta: computeDelta(prevEntry?.value, currEntry?.value)
    })
  }
  rows.sort((a,b) => a.group.localeCompare(b.group) || a.path.localeCompare(b.path))
  return rows
})

// Helpers

function parseKey(k) {
  const [group, path] = k.split(':', 2)
  return { group, path }
}

function collectEnv(tile) {
  const out = new Map()
  if (!tile) return out
  const visit = (obj, group, prefix) => {
    if (!obj || typeof obj !== 'object') return
    if ('env' in obj) {
      out.set(`${group}:${prefix || group}`, { value: obj.env, unit: obj.unit })
      return
    }
    if (Array.isArray(obj)) {
      obj.forEach((item, i) => {
        const id = item?.type || item?.name || `#${i}`
        visit(item, group, prefix ? `${prefix}[${id}]` : `[${id}]`)
      })
      return
    }
    for (const k of Object.keys(obj)) {
      const v = obj[k]
      const path = prefix ? `${prefix}.${k}` : k
      if (v && typeof v === 'object') visit(v, group, path)
    }
  }
  try {
    visit(tile.topography ?? {}, 'topography', '')
    visit(tile.soil ?? {},       'soil',       '')
    visit(tile.resources ?? {},  'resources',  '')
    visit(tile.plants ?? [],     'plants',     '')
    visit(tile.animals ?? [],    'animals',    '')
  } catch (e) {
  }
  return out
}

function valuesEqual(a, b) {
  if (typeof a === 'number' && typeof b === 'number') return Object.is(a, b)
  return a === b
}

function computeDelta(prev, curr) {
  if (typeof prev === 'number' && typeof curr === 'number') {
    const d = curr - prev
    if (d === 0) return '0'
    return d.toFixed(2)
  }
  if (prev === curr) return '0'
  return '∼'
}

function fmt(entry) {
  if (!entry) return '—'
  const { value, unit } = entry
  if (typeof value === 'number' && Number.isFinite(value)) {
    return `${value.toFixed(2)}${unit ? ' ' + unit : ''}`
  }
  if (value == null) return '—'
  return `${String(value)}${unit ? ' ' + unit : ''}`
}
</script>

<template>
  <div class="modalData" v-if="currentTile">
    <div class="headerRow">
      <h4>Tile {{ selectedKey }}</h4>
      <button class="close" @click="map.selectedTile.value = null">Close</button>
    </div>
    <table class="kv" v-if="tableRows.length">
      <thead>
      <tr>
        <th>Group</th>
        <th>Path</th>
        <th>Previous</th>
        <th>Current</th>
        <th>Δ</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="r in tableRows" :key="r.key" :class="{ changed: r.changed, up: r.changed && Number(r.delta) > 0, down: r.changed && Number(r.delta) < 0 }">
        <td>{{ r.group }}</td>
        <td>{{ r.path }}</td>
        <td>{{ fmt(r.prev) }}</td>
        <td>{{ fmt(r.curr) }}</td>
        <td>{{ r.delta }}</td>
      </tr>
      </tbody>
    </table>

    <div v-else>No comparable values on this tile.</div>
  </div>
  <div v-else class="modalData">No tile selected.</div>
</template>

<style scoped>
.modalData { background: black; max-height: 70vh; overflow: auto; padding: 8px; }
.kv { width: 100%; border-collapse: collapse; font-size: 13px; }
.kv th, .kv td { border: 1px solid #ccc; padding: 4px 6px; white-space: nowrap; text-align: left; }
.changed { background: rgba(255, 235, 59, 0.25); }
.up td:last-child { color: #2e7d32; font-weight: 600; }
.down td:last-child { color: #c62828; font-weight: 600; }
.headerRow {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 8px;
}
.headerRow h4 { margin: 0; }
.close {
  padding: 6px 10px;
  border: 1px solid #ccc;
  background: #f7f7f7;
  border-radius: 4px;
  cursor: pointer;
}
</style>
