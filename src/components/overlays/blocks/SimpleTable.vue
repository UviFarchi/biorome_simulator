<!-- src/components/overlays/AnalyticsReportBlocks/SimpleTable.vue -->
<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  title: { type: String, required: true },
  // Array of rows; each row is an array of cell values, e.g.:
  // [ ['Tiles with issues','3 / 6'], ['Total missing', 12] ]
  data: { type: Array, default: () => [] },
  // Optional header labels (array of strings). If provided, renders <thead>.
  headers: { type: Array, default: null },
  // Start opened? By default tables are closed.
  startOpen: { type: Boolean, default: false },
})

const isOpen = ref(!!props.startOpen)

const maxColumns = computed(() => {
  const headerLen = Array.isArray(props.headers) ? props.headers.length : 0
  const rowMax = props.data.reduce((m, r) => Math.max(m, Array.isArray(r) ? r.length : 0), 0)
  return Math.max(headerLen, rowMax, 1)
})

const normalizedRows = computed(() =>
    props.data.map((row) => {
      const arr = Array.isArray(row) ? row.slice(0, maxColumns.value) : [row]
      while (arr.length < maxColumns.value) arr.push('—')
      return arr
    })
)

function toggleOpen() {
  isOpen.value = !isOpen.value
}

function display(cell) {
  if (cell == null) return '—'
  return typeof cell === 'number' && Number.isFinite(cell) ? String(cell) : String(cell)
}
</script>

<template>
  <div class="lane-fit">
    <div class="table-header">
      <strong>{{ title }}</strong>
      <button class="linklike" @click="toggleOpen">
        {{ isOpen ? 'Hide ⌃' : 'Show ⌄' }}
      </button>
    </div>

    <table v-if="isOpen" class="kv compact fixed lane-fit">
      <thead v-if="headers && headers.length">
      <tr>
        <th v-for="(h, i) in headers" :key="'h-'+i">{{ h }}</th>
        <th v-for="i in (maxColumns - headers.length)" :key="'hf-'+i"></th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(row, rIdx) in normalizedRows" :key="'r-'+rIdx">
        <td v-for="(cell, cIdx) in row" :key="'c-'+rIdx+'-'+cIdx" class="wrap">{{ display(cell) }}</td>
      </tr>
      <tr v-if="!normalizedRows.length">
        <td :colspan="maxColumns">—</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>
