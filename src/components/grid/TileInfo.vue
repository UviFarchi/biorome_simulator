<!-- src/components/grid/TileInfo.vue -->
<script setup>
import {computed, ref} from 'vue'
import { mapStore } from '@/stores/map.js'
import { gameStore } from '@/stores/game.js'
import animalEffects from '@/engine/effects/animal.js'
import plantEffects from '@/engine/effects/plant.js'

const map = mapStore()
const game = gameStore()

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
  const prevGrid = Array.isArray(map.previousDayTiles) ? map.previousDayTiles : map.previousDayTiles?.value
  const r = currentTile.value.row, c = currentTile.value.col
  return prevGrid?.[r]?.[c] || null
})

const tableRows = computed(() => {
  const tile = currentTile.value
  if (!tile) return []

  const measuredNow = collectMeasured(tile)
  const previous = previousTile.value ? collectMeasured(previousTile.value) : new Map()

  // For phase 1 use projection; otherwise use previous-day comparison
  const useProjection = turnPhase.value === 1
  const projectedMap = useProjection ? projection.value.projectedMap : previous
  const deltaByKey = useProjection ? projection.value.deltaByKey : new Map()

  const keys = new Set([...measuredNow.keys(), ...projectedMap.keys(), ...deltaByKey.keys()])
  const rows = []

  for (const key of keys) {
    const { group, path } = parseKey(key)
    const currentEntry = measuredNow.get(key)
    const otherEntry = projectedMap.get(key) // projected in phase 1, previous otherwise

    // Delta display rule:
    // - If both numbers exist: projected - current (phase 1) or current - previous (others)
    // - If current missing but we have a raw delta (phase 1): show that delta
    // - Else: "No data points"
    let deltaText = 'No data points'
    if (turnPhase.value === 1) {
      const rawDelta = deltaByKey.get(key)
      if (typeof currentEntry?.value === 'number' && typeof otherEntry?.value === 'number') {
        const d = otherEntry.value - currentEntry.value
        deltaText = d === 0 ? '0' : d.toFixed(2)
      } else if (typeof rawDelta === 'number' && Number.isFinite(rawDelta)) {
        deltaText = rawDelta === 0 ? '0' : rawDelta.toFixed(2)
      }
    } else {
      const d = computeDelta(otherEntry?.value, currentEntry?.value)
      deltaText = d
    }

    const nDelta = Number(deltaText)
    const changedFlag = turnPhase.value === 1
        ? Number.isFinite(nDelta) && nDelta !== 0
        : (typeof otherEntry?.value === 'number' &&
            Number.isFinite(otherEntry.value) &&
            typeof currentEntry?.value === 'number' &&
            Number.isFinite(currentEntry.value) &&
            !Object.is(otherEntry.value, currentEntry.value))

    rows.push({
      key,
      group,
      path,
      prev: otherEntry,
      curr: currentEntry,
      delta: deltaText,
      changed: changedFlag
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
function metricKeyFromEffect(effect) {
  return `${effect.target}:${effect.property}` // e.g., "soil:organicCarbon"
}

function countByType(animalArray) {
  if (!Array.isArray(animalArray)) return {}
  const counts = {}
  for (const item of animalArray) {
    const type = item?.type
    if (!type) continue
    counts[type] = (counts[type] || 0) + (Number(item.count) || 1)
  }
  return counts
}

function parseKey(k) {
  const [group, path] = k.split(':', 2)
  return { group, path }
}

function collectMeasured(tile) {
  const out = new Map()
  if (!tile) return out

  const visit = (obj, group, prefix) => {
    if (!obj || typeof obj !== 'object') return

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
        const base = item.type;
        const stage = item.growthStage
        const id = stage ? `${base}:${stage}#${i}` : `${base}#${i}`
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

  visit(tile.topography ?? tile.topography ?? {}, 'topography', '')
  visit(tile.soil ?? {}, 'soil', '')
  visit(tile.resources ?? {}, 'resources', '')
  visit(tile.plants ?? [], 'plants', '')
  visit(tile.animals ?? [], 'animals', '')
  return out
}




function computeDelta(prev, curr) {
  if (typeof prev === 'number' && typeof curr === 'number') {
    const d = curr - prev
    if (d === 0) return '0'
    return d.toFixed(2)
  }
  if (prev === curr) return '0'
  return 'No data points'
}

function isMeasureMarked(metricKey) {
  const key = selectedKey.value
  const entry = key && map.optimizedTiles[key]
  return !!entry?.measure?.[metricKey]
}

function toggleMeasureMark(metricKey) {
  const key = selectedKey.value
  if (!key) return
  if (!map.optimizedTiles[key]) map.optimizedTiles[key] = {}
  if (!map.optimizedTiles[key].measure) map.optimizedTiles[key].measure = {}
  map.optimizedTiles[key].measure[metricKey] = !map.optimizedTiles[key].measure[metricKey]
}

function formatDate(iso) {
  if (!iso) return '—'
  try {
    const d = new Date(iso)
    if (Number.isNaN(d.getTime())) return String(iso)
    return d.toISOString().slice(0, 10)
  } catch { return String(iso) }
}

function formatValue(entry) {
  if (!entry) {
    return 'No entry'
  }
  const { value, unit } = entry
  if (typeof value === 'number' && Number.isFinite(value)) {
    return `${value.toFixed(2)}${unit ? ' ' + unit : ''}`
  }
  if (value == null) return 'No data'
  return `${String(value)}${unit ? ' ' + unit : ''}`
}

const projection = computed(() => {
  if (turnPhase.value !== 1 || !currentTile.value) {
    return { projectedMap: collectMeasured(currentTile.value), deltaByKey: new Map() }
  }

  const rowIndex = currentTile.value.row
  const colIndex = currentTile.value.col
  const baseTile = map.tiles?.[rowIndex]?.[colIndex] || null
  const optimizedTile = map.optimizedTiles?.[rowIndex]?.[colIndex] || null

  const measuredNow = collectMeasured(currentTile.value) // values for "Current"
  const projectedMap = new Map(measuredNow)              // start from current measured
  const deltaByKey = new Map()

  // Animals: optimized minus base
  const baseAnimalCounts = countByType(baseTile?.animals)
  const optimizedAnimalCounts = countByType(optimizedTile?.animals)
  const allAnimalTypes = new Set([...Object.keys(baseAnimalCounts), ...Object.keys(optimizedAnimalCounts)])

  for (const type of allAnimalTypes) {
    const diffCount = (optimizedAnimalCounts[type] || 0) - (baseAnimalCounts[type] || 0)
    if (!diffCount) continue
    const effects = animalEffects?.[type] || []
    for (const effect of effects) {
      const key = metricKeyFromEffect(effect) // e.g., "soil:organicCarbon"
      const next = (deltaByKey.get(key) || 0) + effect.delta * diffCount
      deltaByKey.set(key, next)
    }
  }

  // Plants: optimized minus base
  const basePlantCounts = countByType(baseTile?.plants)
  const optimizedPlantCounts  = countByType(optimizedTile?.plants)
  const allPlantTypes = new Set([...Object.keys(basePlantCounts), ...Object.keys(optimizedPlantCounts)])

  for (const type of allPlantTypes) {
    const diffCount = (optimizedPlantCounts[type] || 0) - (basePlantCounts[type] || 0)
    if (!diffCount) continue
    const effects = plantEffects?.[type] || []
    for (const effect of effects) {
      const key = metricKeyFromEffect(effect)
      const next = (deltaByKey.get(key) || 0) + effect.delta * diffCount
      deltaByKey.set(key, next)
    }
  }

  // Apply deltas where a measured base exists; otherwise leave value absent but keep Δ
  for (const [key, delta] of deltaByKey.entries()) {
    const entry = projectedMap.get(key)
    if (entry && typeof entry.value === 'number' && Number.isFinite(entry.value)) {
      projectedMap.set(key, { ...entry, value: entry.value + delta })
    } else if (!projectedMap.has(key)) {
      projectedMap.set(key, { value: undefined, unit: undefined, expiry: null })
    }
  }

  return { projectedMap, deltaByKey }
})


</script>

<template>
  <div class="panel panel--fill" v-if="currentTile">
    <div class="panel-header-row">
      <h4>Tile {{ selectedKey }}</h4>
    </div>

    <div v-if="grouped.length" class="groups-grid">
      <section v-for="group in grouped" :key="group.group" class="group-section">
        <h5 class="group-title">{{ group.group.toUpperCase() }}</h5>
        <table class="kv kv-wrap">
          <thead>
          <tr>
            <th>Path</th>
            <th>{{ turnPhase === 0 ? 'Previous' : turnPhase === 1 ? 'Projected' : 'Planned' }}</th>
            <th>Current</th>
            <th>Expiry</th>
            <th>Δ</th>
            <th v-if="turnPhase === 1">Measure</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="row in group.rows" :key="row.key"
              :class="{ changed: row.changed, up: row.changed && Number(row.delta) > 0, down: row.changed && Number(row.delta) < 0 }">
            <td>{{ row.path }}</td>
            <td>{{ formatValue(row.prev) }}</td>
            <td>{{ formatValue(row.curr) }}</td>
            <td>{{ formatDate(row.curr?.expiry) }}</td>
            <td>{{ row.delta }}</td>
            <td v-if="turnPhase === 1" class="center">
              <input
                  type="checkbox"
                  :checked="isMeasureMarked(row.key)"
                  @change="toggleMeasureMark(row.key)"
              />
            </td>
          </tr>
          </tbody>
        </table>

      </section>
    </div>

    <div v-else>No comparable values on this tile.</div>
  </div>

  <div v-else class="panel panel--fill">No tile selected.</div>
</template>
