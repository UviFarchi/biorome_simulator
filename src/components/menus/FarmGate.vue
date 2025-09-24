<script setup>
import { computed } from 'vue'
import { mapStore } from '@/stores/map.js'
import { formatMoney, formatDateLocale } from '@/utils/formatting.js'

const map = mapStore()

const gateItems = computed(() => map.gate)

const hasItems = computed(() => gateItems.value.length > 0)

function titleFor(item) {
  const parts = [item.itemKey || item.type || 'Unknown']
  if (item.stage) parts.push(`(${item.stage})`)
  return parts.join(' ')
}

function quantityLabel(item) {
  const qty = Number.isFinite(item.quantity) ? item.quantity : 1
  return `Qty: ${qty}`
}

function purchasedLabel(item) {
  if (!item.purchasedAt) return ''
  return `Bought: ${formatDateLocale(item.purchasedAt)}`
}

function priceLabel(item) {
  if (!Number.isFinite(item.price)) return ''
  return formatMoney(item.price)
}
</script>

<template>
  <div class="panel farmGate">
    <header class="gate-header">
      <h3>Farm Gate</h3>
      <span class="gate-count" v-if="hasItems">{{ gateItems.length }} incoming</span>
    </header>

    <p v-if="!hasItems" class="gate-empty">No items waiting at the gate.</p>

    <ul v-else class="gate-list">
      <li v-for="item in gateItems" :key="item.id" class="gate-item">
        <div class="gate-row">
          <span class="gate-title">{{ titleFor(item) }}</span>
          <span v-if="priceLabel(item)" class="gate-price">{{ priceLabel(item) }}</span>
        </div>
        <div class="gate-meta">
          <span>{{ quantityLabel(item) }}</span>
          <span v-if="item.type">Type: {{ item.type }}</span>
          <span v-if="item.source">Source: {{ item.source }}</span>
          <span v-if="purchasedLabel(item)">{{ purchasedLabel(item) }}</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.farmGate {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  min-width: 280px;
}

.gate-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.5rem;
}

.gate-count {
  font-size: 0.85rem;
  font-weight: 600;
  opacity: 0.7;
}

.gate-empty {
  margin: 0;
  font-style: italic;
  opacity: 0.7;
}

.gate-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.gate-item {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  padding: 0.75rem;
  border-radius: calc(var(--radius) / 1.2);
  border: 1px solid color-mix(in srgb, var(--color-border) 80%, transparent);
  background: color-mix(in srgb, var(--color-highlight) 8%, var(--color-surface));
  box-shadow: var(--shadow-surface);
}

.gate-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 0.5rem;
}

.gate-title {
  font-weight: 600;
}

.gate-price {
  font-weight: 600;
}

.gate-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1rem;
  font-size: 0.85rem;
  opacity: 0.85;
}
</style>
