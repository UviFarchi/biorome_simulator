<script setup>
import { computed } from 'vue'
import eventBus from '@/eventBus.js'
import { gameStore } from '@/stores/game.js'
import { marketStore } from '@/stores/market.js'
import { mapStore } from '@/stores/map.js'
import simpleTable from '@/components/menus/blocks/SimpleTable.vue'
import { formatDateLocale, formatMoney, formatNumber } from '@/utils/formatting.js'
import { makeInstance } from '@/engine/phases/optimizations/biotaFactories.js'

const game = gameStore()
const market = marketStore()
const map = mapStore()

const fmtMoney = n => formatMoney(n)
const fmtNum = n => formatNumber(n)
const fmtDate = d => formatDateLocale(d)

// Group contracts
const offeredContracts = computed(() =>
    (market.contracts || []).filter(c => c.status === 'offered')
        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
)
const activeContracts = computed(() =>
    (market.contracts || []).filter(c => c.status === 'pending')
        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
)
const completedContracts = computed(() =>
    (market.contracts || []).filter(c => c.status === 'completed')
        .sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate))
)
const expiredContracts = computed(() =>
    (market.contracts || []).filter(c => c.status === 'expired')
        .sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate))
)

const openOffers = computed(() =>
    (market.openMarketOffers || []).filter(o => o.status === 'open')
        .sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate))
)

const priceCatalog = computed(() => market.priceCatalog || { plants: {}, animals: {}, resources: {} })
const harvested = computed(() => market.harvestedProducts || []) // [{ type, qty, shelfLife? }]

const serviceKeys = new Set(['waste', 'electricity', 'water'])

function normalizeResourceEntry(key, value) {
  const valueObj = typeof value === 'object' && value !== null ? value : { buy: value }
  return {
    key,
    label: valueObj.label || key,
    buyPrice: valueObj.buy ?? valueObj.unitPrice ?? null,
    sellPrice: valueObj.sell ?? null
  }
}

const gateResources = computed(() => {
  const catalog = priceCatalog.value.resources || {}
  return Object.entries(catalog)
      .filter(([key]) => !serviceKeys.has(key))
      .map(([key, value]) => normalizeResourceEntry(key, value))
})

const serviceResources = computed(() => {
  const catalog = priceCatalog.value.resources || {}
  return Object.entries(catalog)
      .filter(([key]) => serviceKeys.has(key))
      .map(([key, value]) => normalizeResourceEntry(key, value))
})

function canAfford(price) {
  const numeric = Number(price)
  if (!Number.isFinite(numeric) || numeric <= 0) return false
  const balance = Number(game.money ?? 0)
  return balance >= numeric
}

function makeResourceEntry(key) {
  return {
    id: `resource-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    kind: 'resource',
    type: key,
    quantity: 1,
    dateDeployed: new Date().toISOString()
  }
}

function buyFromMarket({ category, key, stage, price }) {
  const numeric = Number(price)
  if (!Number.isFinite(numeric) || numeric <= 0) return
  if (!canAfford(numeric)) return

  if (category === 'animal' || category === 'plant') {
    let instance = null
    try {
      instance = makeInstance(category, key, stage)
    } catch (err) {
      console.error('Failed to create biota instance from market purchase', err)
    }
    if (!instance) return
    game.money -= numeric
    map.gate.push(instance)
  } else if (category === 'resource') {
    const entry = makeResourceEntry(key)
    game.money -= numeric
    map.gate.push(entry)
  }
}

function makePriceCell({ category, key, stage, price }) {
  const numeric = Number(price)
  if (!Number.isFinite(numeric) || numeric <= 0) {
    return '—'
  }
  const formatted = fmtMoney(numeric)
  const buyableCategories = new Set(['animal', 'plant', 'resource'])
  const isBuyable = buyableCategories.has(category)
  return {
    kind: 'price',
    price: numeric,
    display: formatted,
    buttonLabel: 'Buy',
    disabled: !canAfford(numeric) || !isBuyable,
    onBuy: () => buyFromMarket({ category, key, stage, price: numeric })
  }
}

// Price catalog tables
const inputsHeaders = ['Item', 'Buy', 'Sell']
const inputsRows = computed(() =>
  gateResources.value.map(({ key, label, buyPrice, sellPrice }) => [
    label,
    makePriceCell({ category: 'resource', key, price: buyPrice }),
    fmtMoney(sellPrice)
  ])
)

const servicesHeaders = ['Service', 'Unit Price']
const servicesRows = computed(() =>
  serviceResources.value.map(({ label, buyPrice }) => [
    label,
    fmtMoney(buyPrice)
  ])
)

const plantsHeaders = ['Type', 'seed', 'seedling', 'sapling']
const plantsRows = computed(() =>
  Object.entries(priceCatalog.value.plants || {}).map(([type, rec]) => {
    const stages = rec?.stagePrices || {}
    return [
      type,
      makePriceCell({ category: 'plant', key: type, stage: 'seed', price: stages.seed }),
      makePriceCell({ category: 'plant', key: type, stage: 'seedling', price: stages.seedling }),
      makePriceCell({ category: 'plant', key: type, stage: 'sapling', price: stages.sapling })
    ]
  })
)

const animalsHeaders = ['Type', 'Stage', 'Buy']
const animalsRows = computed(() => {
  const rows = []
  for (const [type, rec] of Object.entries(priceCatalog.value.animals || {})) {
    for (const [stage, price] of Object.entries(rec.stagePrices || {})) {
      rows.push([
        type,
        stage,
        makePriceCell({ category: 'animal', key: type, stage, price })
      ])
    }
  }
  return rows
})

</script>
<template>
  <button @click="eventBus.emit('nav', 'map')">Back to map</button>
  <div class="market-overlay">
    <header class="bar">
      <div><strong>Market</strong></div>
      <div>money: <strong>{{ fmtNum(game.money) }}</strong></div>
      <div>Today: {{ fmtDate(game.currentDate) }}</div>
      <div>Last flux: {{ fmtDate(market.lastMarketDate) }}</div>
    </header>
    <div class="market-columns">
      <div class="market-column">
        <section class="panel">
          <h3>Price Catalog</h3>
          <simpleTable
              title="Resources (deliver to gate)"
              :headers="inputsHeaders"
              :data="inputsRows"
          />
          <simpleTable
              title="Plants (seed, seedling/sapling)"
              :headers="plantsHeaders"
              :data="plantsRows"
          />
          <simpleTable
              title="Animals (by stage)"
              :headers="animalsHeaders"
              :data="animalsRows"
          />
        </section>
      </div>

      <div class="market-column">
        <section class="panel">
          <h3>Services Pricing</h3>
          <simpleTable
              title="Utilities & Waste"
              :headers="servicesHeaders"
              :data="servicesRows"
              :start-open="true"
          />
        </section>

        <section class="panel">
          <h3>Your Harvested Products</h3>
          <div v-if="harvested.length" class="list">
            <div v-for="p in harvested" :key="p.type" class="row">
              <div>{{ p.type }}</div>
              <div>Qty: {{ fmtNum(p.qty) }}</div>
              <div v-if="p.shelfLife">Shelf: {{ p.shelfLife }}</div>
            </div>
          </div>
          <p v-else>None.</p>
        </section>

        <section class="panel">
          <h3>Open Offers</h3>
          <div v-if="openOffers.length" class="list">
            <div v-for="o in openOffers" :key="o.id" class="row">
              <div>{{ o.productType }} × {{ fmtNum(o.quantity) }}</div>
              <div>@ {{ fmtMoney(o.pricePerUnit) }}</div>
              <div>Expires: {{ fmtDate(o.expiryDate) }}</div>
              <div>Status: {{ o.status }}</div>
            </div>
          </div>
          <p v-else>No open offers.</p>
        </section>

        <section class="panel">
          <h3>Contracts</h3>

          <h4>Offered</h4>
          <div v-if="offeredContracts.length" class="list">
            <div v-for="c in offeredContracts" :key="c.id" class="row">
              <div>{{ c.productType }} × {{ fmtNum(c.quantity) }}</div>
              <div>@ {{ fmtMoney(c.pricePerUnit) }}</div>
              <div>Due: {{ fmtDate(c.dueDate) }}</div>
              <div>Type: {{ c.type }}</div>
              <div>Penalty: {{ fmtMoney(c.penalty) }}</div>
            </div>
          </div>
          <p v-else>None.</p>

          <h4>Active</h4>
          <div v-if="activeContracts.length" class="list">
            <div v-for="c in activeContracts" :key="c.id" class="row">
              <div>{{ c.productType }} × {{ fmtNum(c.quantity) }}</div>
              <div>@ {{ fmtMoney(c.pricePerUnit) }}</div>
              <div>Due: {{ fmtDate(c.dueDate) }}</div>
              <div>Type: {{ c.type }}<span v-if="c.interval"> (every {{ c.interval }}d)</span></div>
              <div>Penalty: {{ fmtMoney(c.penalty) }}</div>
            </div>
          </div>
          <p v-else>None.</p>

          <h4>Completed</h4>
          <div v-if="completedContracts.length" class="list">
            <div v-for="c in completedContracts" :key="c.id" class="row">
              <div>{{ c.productType }} × {{ fmtNum(c.quantity) }}</div>
              <div>@ {{ fmtMoney(c.pricePerUnit) }}</div>
              <div>Date: {{ fmtDate(c.dueDate) }}</div>
            </div>
          </div>
          <p v-else>None.</p>

          <h4>Expired</h4>
          <div v-if="expiredContracts.length" class="list">
            <div v-for="c in expiredContracts" :key="c.id" class="row">
              <div>{{ c.productType }} × {{ fmtNum(c.quantity) }}</div>
              <div>@ {{ fmtMoney(c.pricePerUnit) }}</div>
              <div>Due: {{ fmtDate(c.dueDate) }}</div>
            </div>
          </div>
          <p v-else>None.</p>
        </section>
      </div>
    </div>
  </div>
</template>
<style scoped>
.market-overlay {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  height: 100%;
  box-sizing: border-box;
  overflow-y: auto;
}

.bar {
  display: grid;
  grid-template-columns: repeat(4, auto);
  gap: 1rem;
  align-items: center;
}

.market-columns {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1rem;
  align-content: start;
}

.market-column {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-width: 0;
}

.panel {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  background: var(--color-surface);
  box-shadow: var(--shadow-surface);
}

.list {
  display: grid;
  gap: .35rem;
}

.row {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: .5rem;
}

h3 {
  margin: .2rem 0 .4rem;
  color: var(--color-accent);
}

h4 {
  margin: .2rem 0;
  color: var(--color-warning);
}
</style>
