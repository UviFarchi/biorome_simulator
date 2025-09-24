<script setup>
import {computed, ref, onMounted, onBeforeUnmount, nextTick} from 'vue'


import {mapStore} from '@/stores/map.js'
import {roundN} from '@/utils/formatting.js';

const map = mapStore()

const props = defineProps({
  title: {type: String, required: true},
  data: {type: Object, required: true}
})

const fieldData = computed(() => props.data || {})


// --- column selection for delta via header clicks ---
const selectedColumns = ref([]) // holds up to 2 indices from [2,3,4,5]

function isSelectableColumn(index) {
  // 0: Property, 1: Expiry, 2: Previous, 3: Last average, 4: Current, 5: Optimized, 6: Delta
  return index === 2 || index === 3 || index === 4 || index === 5
}

function isColumnSelected(index) {
  return selectedColumns.value.includes(index)
}

function handleHeaderClick(index) {
  if (!isSelectableColumn(index)) return
  const sel = selectedColumns.value
  const pos = sel.indexOf(index)
  if (pos !== -1) {
    sel.splice(pos, 1)                 // toggle off
  } else {
    sel.push(index)                    // add
    if (sel.length > 2) sel.shift()    // keep last two
  }
}

function getHistoryData(property) {
  const history = property?.measured?.history ?? []
  const len = history.length
  let sum = 0
  const values = new Array(len)
  const dates = new Array(len)
  for (let i = 0; i < len; i++) {
    const vNum = Number(history[i]?.value)
    values[i] = Number.isFinite(vNum) ? vNum : '-'
    dates[i] = history[i]?.date
    if (Number.isFinite(vNum)) sum += vNum
  }
  const meanNum = len ? sum / len : null
  const mean = Number.isFinite(meanNum) ? Number(roundN(meanNum)) : null
  const lastNum = len ? Number(history[0]?.value) : null
  const last = Number.isFinite(lastNum) ? Number(lastNum) : null
  const digest = values.join('|') + '::' + dates.join('|')
  return {last, mean, values, dates, digest}
}

function getDelta(property) {
  const sel = selectedColumns.value
  if (sel.length !== 2) return null
  const [leftIdx, rightIdx] = sel
  const h = getHistoryData(property)
  const a =
      leftIdx === 2 ? h.last :
          leftIdx === 3 ? h.mean :
              leftIdx === 4 ? property?.measured?.value :
                  leftIdx === 5 ? property?.optimized : null
  const b =
      rightIdx === 2 ? h.last :
          rightIdx === 3 ? h.mean :
              rightIdx === 4 ? property?.measured?.value :
                  rightIdx === 5 ? property?.optimized : null
  if (!Number.isFinite(a) || !Number.isFinite(b)) return null
  return Number(b - a)
}
// TODO => Add measurement tick to turn mneasured.collect true during the analytics phase.
//TODO => Recalculate Optimized values so that they are always computed on top of the current. For example, if an animal is projected to have an effect on a property, that effect is always on top of the current value, not set once.
function formatDelta(value) {
  return value === null ? 'Not enough data' : value
}

function isNonZeroDelta(property) {
  const d = getDelta(property)
  return d !== null && d !== 0
}


</script>

<template>
  <!-- remount the whole table each start-of-day -->
  <div class="metrics-table-wrapper">
    <h1>{{ title }}</h1>

    <table class="app-table">
      <thead>
      <tr>
        <th>Property</th>
        <th>Expiry</th>
        <th
            @click="handleHeaderClick(2)"
            :class="{ selected: isColumnSelected(2) }"
            title="Click to select for Δ"
        >
          Previous
        </th>
        <th
            @click="handleHeaderClick(3)"
            :class="{ selected: isColumnSelected(3) }"
            title="Click to select for Δ"
        >
          Historical average
        </th>
        <th
            @click="handleHeaderClick(4)"
            :class="{ selected: isColumnSelected(4) }"
            title="Click to select for Δ"
        >
          Current
        </th>
        <th
            @click="handleHeaderClick(5)"
            :class="{ selected: isColumnSelected(5) }"
            title="Click to select for Δ"
        >
          Optimized
        </th>
        <th>Δ</th>
      </tr>
      </thead>

      <tbody>
      <tr
          v-for="(property, key) in fieldData"
          :key="key + ':' + getHistoryData(property).digest + ':' + (property.measured?.date || '')"
          :class="{ 'app-table--highlight': isNonZeroDelta(property) }"
      >
        <td>{{ key }}</td>
        <td>{{ property.measured?.date }}</td>

        <!-- Previous -->
        <td :class="{ selected: isColumnSelected(2) }">
          {{ getHistoryData(property).last ?? '-' }}
          <!-- keep your expand button if you still use it -->
        </td>

        <!-- History average -->
        <td :class="{ selected: isColumnSelected(3) }">
  <span
      :title="(getHistoryData(property).values || []).join(', ')"
      style="cursor: help; text-decoration: underline dotted;"
  >
    {{ getHistoryData(property).mean ?? '-' }}
  </span>
        </td>

        <!-- Current -->
        <td :class="{ selected: isColumnSelected(4) }">
          {{ property.measured?.value ?? '-' }}
        </td>

        <!-- Optimized -->
        <td :class="{ selected: isColumnSelected(5) }">
          {{ property.optimized ?? '-' }}
        </td>

        <td :title="selectedColumns.length === 2
              ? `Δ = col${selectedColumns[1]} − col${selectedColumns[0]}`
              : 'Select two columns by clicking their headers'">
          {{ formatDelta(getDelta(property)) }}
        </td>


      </tr>
      </tbody>
    </table>
  </div>
</template>


<style scoped>
.metrics-table-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  overflow-x: auto;
  padding-bottom: 8px;
}

.metrics-table-wrapper h1 {
  margin: 0;
  font-size: 1.15rem;
  font-weight: 700;
}

.app-table {
  border-collapse: collapse;
  width: 100%;
  min-width: 720px;
}

.app-table th,
.app-table td {
  padding: 0.55rem 0.6rem;
  text-align: left;
  border-bottom: 1px solid color-mix(in srgb, var(--color-border, #334155) 65%, transparent);
  background: color-mix(in srgb, var(--color-surface, #0f172a) 92%, transparent);
}

.app-table thead th {
  position: sticky;
  top: 0;
  z-index: 1;
  background: color-mix(in srgb, var(--color-surface, #0f172a) 82%, transparent);
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.app-table tbody tr:last-child td {
  border-bottom: none;
}

.app-table tbody tr.app-table--highlight td {
  background: color-mix(in srgb, var(--color-warning, #f59e0b) 12%, var(--color-surface, #0f172a));
  color: inherit;
}

.app-table td.selected,
.app-table th.selected {
  background: color-mix(in srgb, var(--color-highlight, #38bdf8) 18%, var(--color-surface, #0f172a));
  color: inherit;
}

.app-table td.selected {
  font-weight: 600;
}

.app-table tbody tr.app-table--highlight td.selected {
  background: color-mix(in srgb, var(--color-highlight, #38bdf8) 22%, var(--color-warning, #f59e0b) 8%, var(--color-surface, #0f172a));
}
</style>

