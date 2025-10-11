<!-- src/components/overlays/AnalyticsReportBlocks/SimpleTable.vue -->
<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  title: { type: String, required: true },
  // Array of rows; each row is an array of cell values, e.g.:
  // [ ['Tiles with issues','3 / 6'], ['Total missing', 12] ]
  data: { type: Array, default: () => [] },
  // Optional header labels (array of strings). If provided, renders <thead>.
  headers: { type: Array, default: null },
  // Start opened? By default tables are closed.
  startOpen: { type: Boolean, default: false },
});

const isOpen = ref(!!props.startOpen);

const PRICE_CELL_KIND = 'price';

const maxColumns = computed(() => {
  const headerLen = Array.isArray(props.headers) ? props.headers.length : 0;
  const rowMax = props.data.reduce((m, r) => {
    const cells = Array.isArray(r)
      ? r
      : Array.isArray(r?.cells)
        ? r.cells
        : Array.isArray(r?.values)
          ? r.values
          : [];
    return Math.max(m, cells.length);
  }, 0);
  return Math.max(headerLen, rowMax, 1);
});

const normalizedRows = computed(() =>
  props.data.map((row) => {
    let className = '';
    let cells;

    if (Array.isArray(row)) {
      cells = row;
    } else if (row && typeof row === 'object') {
      className = row.className || row.class || '';
      cells = Array.isArray(row.cells) ? row.cells : Array.isArray(row.values) ? row.values : [row];
    } else {
      cells = [row];
    }

    const arr = cells.slice(0, maxColumns.value);
    while (arr.length < maxColumns.value) arr.push('—');
    return { className, cells: arr };
  })
);

function toggleOpen() {
  isOpen.value = !isOpen.value;
}

function display(cell) {
  if (cell == null) return '—';
  return typeof cell === 'number' && Number.isFinite(cell) ? String(cell) : String(cell);
}

function isPriceCell(cell) {
  return cell && typeof cell === 'object' && cell.kind === PRICE_CELL_KIND;
}

function priceLabel(cell) {
  if (!isPriceCell(cell)) return display(cell);
  return cell.display ?? display(cell.price);
}

function handlePriceBuy(cell) {
  if (!isPriceCell(cell) || cell.disabled) return;
  if (typeof cell.onBuy === 'function') {
    cell.onBuy();
  }
}
</script>

<template>
  <div class="lane-fit">
    <div class="table-header">
      <strong>{{ title }}</strong>
      <button
        class="linklike"
        @click="toggleOpen"
        :aria-label="isOpen ? 'Collapse section' : 'Expand section'"
      >
        {{ isOpen ? '▲' : '▼' }}
      </button>
    </div>

    <table v-if="isOpen" class="kv compact fixed lane-fit">
      <thead v-if="headers && headers.length">
        <tr>
          <th v-for="(h, i) in headers" :key="'h-' + i">{{ h }}</th>
          <th v-for="i in maxColumns - headers.length" :key="'hf-' + i"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, rIdx) in normalizedRows" :key="'r-' + rIdx" :class="row.className">
          <td v-for="(cell, cIdx) in row.cells" :key="'c-' + rIdx + '-' + cIdx" class="wrap">
            <template v-if="isPriceCell(cell)">
              <div class="price-cell">
                <span class="price-value">{{ priceLabel(cell) }}</span>
                <button
                  type="button"
                  class="price-buy"
                  :disabled="cell.disabled"
                  @click="handlePriceBuy(cell)"
                >
                  {{ cell.buttonLabel || 'Buy' }}
                </button>
              </div>
            </template>
            <template v-else>
              {{ display(cell) }}
            </template>
          </td>
        </tr>
        <tr v-if="!normalizedRows.length">
          <td :colspan="maxColumns">—</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.price-cell {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.table-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.table-header .linklike {
  margin-left: auto;
  font-size: 0.9rem;
  line-height: 1;
  padding: 0;
  background: transparent;
  border: none;
}

.price-buy {
  border: 1px solid var(--color-border);
  background: var(--color-accent);
  color: var(--color-surface);
  border-radius: calc(var(--radius) / 1.6);
  padding: 0.2rem 0.6rem;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition:
    transform 120ms ease,
    filter 120ms ease;
}

.price-buy:hover:not(:disabled) {
  filter: brightness(1.05);
  transform: translateY(-1px);
}

.price-buy:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.price-value {
  white-space: nowrap;
}
</style>
