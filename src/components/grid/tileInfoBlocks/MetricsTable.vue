<script setup>
import { computed } from 'vue'
import { gameStore } from '@/stores/game.js'
const props = defineProps({
  title: { type: String, required: true },          // e.g., "Resources" | "Soil" | "Topography"
  group: { type: String, required: true },          // "resources" | "soil" | "topography" | "plants" | "animals"
  tile: { type: Object, required: true },
  comparison: { type: Object, required: true },     // { measuredMap, otherMap }
  basePath: { type: String, default: '' },          // optional subtree filter (prefix match)
  isMeasureMarked: { type: Function, required: true },
  toggleMeasureMark: { type: Function, required: true },
  formatValue: { type: Function, required: true },
  formatDate: { type: Function, required: true },
})

const game = gameStore()
const phase = computed(() => game.phase)
function keyMatchesBase(path, base) {
  if (!base) return true
  return path.startsWith(base)
}

const rows = computed(() => {
  const { measuredMap, otherMap } = props.comparison
  const prefix = `${props.group}:`

  const keys = new Set(
      [...measuredMap.keys(), ...otherMap.keys()]
          .filter(k => k.startsWith(prefix))
          .filter(k => keyMatchesBase(k.slice(prefix.length), props.basePath))
  )

  const out = []
  for (const key of keys) {
    const curr = measuredMap.get(key) || null
    const othr = otherMap.get(key) || null

    const currNum = (typeof curr?.value === 'number') ? curr.value : null
    const othrNum = (typeof othr?.value === 'number') ? othr.value : null

    let deltaNum = null
    if (phase === 0) {
      if (currNum != null || othrNum != null) deltaNum = (currNum ?? 0) - (othrNum ?? 0)
    } else {
      // Phase 1/2: if no projected/planned value provided, treat as "no change"
      if (othrNum == null) deltaNum = 0
      else if (currNum == null) deltaNum = null
      else deltaNum = othrNum - currNum
    }

    const expiry = props.formatDate(curr?.expiry ?? curr?.measured?.date ?? null)

    out.push({
      key,
      path: key.slice(prefix.length),
      prevText: props.formatValue(othr),
      currText: props.formatValue(curr),
      expiry,
      deltaNum,
      deltaText:
          (deltaNum == null)
              ? 'No data points'
              : (deltaNum === 0 ? '0' : Number(deltaNum).toFixed(2)),
      changed: Number.isFinite(deltaNum) && deltaNum !== 0,
    })
  }
  out.sort((a, b) => a.path.localeCompare(b.path))
  return out
})

const showMeasure = computed(() => phase === 1)


const displayTitle = computed(() =>
     props.title || (props.group ? props.group[0].toUpperCase() + props.group.slice(1) : '')
    )
</script>

<template>
  <section class="group-section">
    <h5 class="group-title">{{ displayTitle }}</h5>

    <table class="kv">
      <thead>
      <tr v-if="phase === 0">
        <th>Path</th><th>Previous</th><th>Current</th><th>Expiry</th><th>Δ</th>
      </tr>
      <tr v-else-if="phase === 1">
        <th>Path</th><th>Projected</th><th>Current</th><th>Expiry</th><th>Δ</th>
        <th v-if="showMeasure" class="center">Measure</th>
      </tr>
      <tr v-else>
        <th>Path</th><th>Expiry</th><th>Current</th><th>Projected</th><th>Δ</th>
      </tr>
      </thead>

      <tbody>
      <tr v-for="r in rows" :key="r.key"
          :class="['row', props.group, r.changed ? 'changed' : '', (typeof r.deltaNum==='number' && r.deltaNum!==0) ? (r.deltaNum>0?'up':'down') : '']">
        <td>{{ r.path }}</td>

        <template v-if="phase === 0">
          <td>{{ r.prevText }}</td>
          <td>{{ r.currText }}</td>
          <td>{{ r.expiry }}</td>
          <td>{{ r.deltaText }}</td>
        </template>

        <template v-else-if="phase === 1">
          <td>{{ r.prevText }}</td>
          <td>{{ r.currText }}</td>
          <td>{{ r.expiry }}</td>
          <td>{{ r.deltaText }}</td>
          <td v-if="showMeasure" class="center">
            <input type="checkbox"
                   :checked="isMeasureMarked(r.key)"
                   @change="toggleMeasureMark(r.key)" />
          </td>
        </template>

        <template v-else>
          <td>{{ r.prevText }}</td>
          <td>{{ r.currText }}</td>
          <td>{{ r.expiry }}</td>
          <td>{{ r.deltaText }}</td>
        </template>
      </tr>
      </tbody>
    </table>
  </section>
</template>
