<!-- src/components/grid/TileInfo.vue -->
<script setup>
import { computed } from 'vue'
import { mapStore } from '@/stores/map.js'
import { gameStore } from '@/stores/game.js'

const map = mapStore()
const game = gameStore()

const currentTile = computed(() => {
  const t = map.selectedTile
  return t && typeof t === 'object' && 'value' in t ? t.value : t
})

const selectedKey = computed(() =>
    currentTile.value ? `${currentTile.value.row},${currentTile.value.col}` : null
)

const previousTile = computed(() => {
  if (!currentTile.value) return null
  const prevGrid = Array.isArray(map.previousDayTiles) ? map.previousDayTiles : map.previousDayTiles?.value
  const r = currentTile.value.row, c = currentTile.value.col
  return prevGrid?.[r]?.[c] || null
})

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
  rows.sort((a, b) => a.group.localeCompare(b.group) || a.path.localeCompare(b.path))
  return rows
})

/* group into [{ group, rows: [...] }, ...] */
const grouped = computed(() => {
  const map = new Map()
  for (const r of tableRows.value) {
    if (!map.has(r.group)) map.set(r.group, [])
    map.get(r.group).push(r)
  }
  return Array.from(map, ([group, rows]) => ({ group, rows }))
})

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

  visit(tile.topography ?? {}, 'topography', '')
  visit(tile.soil ?? {},       'soil',       '')
  visit(tile.resources ?? {},  'resources',  '')
  visit(tile.plants ?? [],     'plants',     '')
  visit(tile.animals ?? [],    'animals',    '')
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
  <div class="panel modalData" v-if="currentTile">
    <div class="headerRow">
      <h4>Tile {{ selectedKey }}</h4>
    </div>

    <div v-if="grouped.length" class="groupsGrid">
      <section v-for="g in grouped" :key="g.group" class="groupSection">
        <h5 class="groupTitle">{{ g.group.toUpperCase() }}</h5>
        <table class="kv">
          <thead>
          <tr>
            <th>Path</th>
            <th>Previous</th>
            <th>Current</th>
            <th>Δ</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="r in g.rows" :key="r.key"
              :class="{ changed: r.changed, up: r.changed && Number(r.delta) > 0, down: r.changed && Number(r.delta) < 0 }">
            <td>{{ r.path }}</td>
            <td>{{ fmt(r.prev) }}</td>
            <td>{{ fmt(r.curr) }}</td>
            <td>{{ r.delta }}</td>
          </tr>
          </tbody>
        </table>
      </section>
    </div>

    <div v-else>No comparable values on this tile.</div>
  </div>

  <div v-else class="panel modalData">No tile selected.</div>
</template>

<style scoped>
.modalData {
  display: block;
  width: 100%;
  max-width: none;
  height: 100%;
  max-height: none;
  overflow: auto;
  padding: 8px;
  box-sizing: border-box;
}

.headerRow {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 8px;
}
.headerRow h4 { margin: 0; }

.groupsGrid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  grid-auto-flow: row;
  grid-auto-rows: min-content; /* rows sized to their content */
  align-items: start;          /* items top-aligned inside cells */
  align-content: start;        /* grid packed at the top */
}

.groupSection {
  align-self: start;
  min-height: 0;               /* prevent accidental stretch */
}


.groupTitle {
  margin: 0 0 6px 0;          /* remove default top margin */
}

.kv {
  width: 100%;
  border-collapse: collapse;
  margin: 0;
  table-layout: fixed;         /* avoid intrinsic table width pushing */
}

.kv th, .kv td { padding: 4px 6px; border-bottom: 1px solid rgba(0,0,0,.2); word-break: break-word; }
.changed { background: rgba(255, 235, 59, 0.25); }
.up td:last-child { color: #2e7d32; font-weight: 600; }
.down td:last-child { color: #c62828; font-weight: 600; }
</style>
