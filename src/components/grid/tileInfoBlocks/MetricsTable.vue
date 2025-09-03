<script setup>
import { computed } from 'vue'
import { gameStore } from '@/stores/game.js'

const props = defineProps({
  title: { type: String, required: true },
  group: { type: String, required: true },
  comparison: { type: Object, required: true }, // { measuredMap, otherMap }
  basePath: { type: String, default: '' },
  isMeasureMarked: { type: Function, default: null },
  toggleMeasureMark: { type: Function, default: null },
  formatValue: { type: Function, required: true },
  formatDate: { type: Function, required: true },
})

const phase = computed(() => gameStore().turnPhase)

const showMeasure = computed(
  () => phase.value === 1 && props.isMeasureMarked && props.toggleMeasureMark
)

const headerLabel = computed(() =>
  phase.value === 0 ? 'Previous' : phase.value === 1 ? 'Projected' : 'Planned'
)

const rows = computed(() => {
  const { measuredMap, otherMap } = props.comparison
  const prefix = `${props.group}:`
  const keys = new Set([...measuredMap.keys(), ...otherMap.keys()])

  const out = []
  for (const key of keys) {
    if (!key.startsWith(prefix)) continue
    if (
      props.basePath &&
      !key.startsWith(`${prefix}${props.basePath}.`)
    )
      continue

    const curr = measuredMap.get(key) || null
    const othr = otherMap.get(key) || null

    const currNum =
      typeof curr?.value === 'number' && Number.isFinite(curr.value)
        ? curr.value
        : null
    const othrNum =
      typeof othr?.value === 'number' && Number.isFinite(othr.value)
        ? othr.value
        : null

    let deltaNum = null
    if (currNum != null && othrNum != null) {
      deltaNum = phase.value === 0 ? currNum - othrNum : othrNum - currNum
    }

    let path = key.slice(prefix.length)
    if (props.basePath) path = path.slice(props.basePath.length + 1)

    out.push({
      key,
      path,
      curr,
      othr,
      deltaNum,
    })
  }

  out.sort((a, b) => a.path.localeCompare(b.path))
  return out
})
</script>

<template>
  <section class="group-section">
    <h5 class="group-title">{{ title }}</h5>

    <table class="kv">
      <thead>
        <tr>
          <th>Path</th>
          <th>{{ headerLabel }}</th>
          <th>Current</th>
          <th>Expiry</th>
          <th>Δ</th>
          <th v-if="showMeasure" class="center">Measure</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="r in rows" :key="r.key">
          <td>{{ r.path }}</td>
          <td>{{ props.formatValue(r.othr) }}</td>
          <td>{{ props.formatValue(r.curr) }}</td>
          <td>{{ props.formatDate(r.curr?.expiry) }}</td>
          <td>
            {{
              r.deltaNum == null
                ? 'No data points'
                : r.deltaNum === 0
                ? '0'
                : r.deltaNum.toFixed(2)
            }}
          </td>
          <td v-if="showMeasure" class="center">
            <input
              type="checkbox"
              :checked="props.isMeasureMarked(r.key)"
              @change="props.toggleMeasureMark(r.key)"
            />
          </td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<style scoped>
.center { text-align: center; }
</style>

