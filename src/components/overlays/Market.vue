<script setup>
import { computed } from 'vue'
import { gameStore } from '@/stores/game.js'
import { marketStore } from '@/stores/market.js'
import simpleTable from '@/components/overlays/blocks/SimpleTable.vue'
import { formatDateLocale, formatMoney, formatNumber } from '@/utils/formatting.js'

const game = gameStore()
const market = marketStore()

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

// Price catalog tables
const inputsHeaders = ['Item', 'Buy', 'Sell']
const inputsRows = computed(() =>
    Object.entries(priceCatalog.value.resources || {}).map(([k, v]) => [
      k,
      fmtMoney(v?.buy ?? v),
      fmtMoney(v?.sell ?? (k === 'electricitySellPerKWh' ? v : null)),
    ])
)

const plantsHeaders = ['Type', 'seed', 'seedling', 'sapling']
const plantsRows = computed(() =>
    Object.entries(priceCatalog.value.plants || {}).map(([type, rec]) => [
      type,
      fmtMoney(rec.stagePrices?.seed),
      fmtMoney(rec.stagePrices?.seedling),
      fmtMoney(rec.stagePrices?.sapling),
    ])
)

const animalsHeaders = ['Type', 'Stage', 'Buy']
const animalsRows = computed(() => {
  const rows = []
  for (const [type, rec] of Object.entries(priceCatalog.value.animals || {})) {
    for (const [stage, price] of Object.entries(rec.stagePrices || {})) {
      rows.push([type, stage, fmtMoney(price)])
    }
  }
  return rows
})

</script>
<template>
  <div class="market-overlay">
    <header class="bar">
      <div><strong>Market</strong></div>
      <div>Gold: <strong>{{ fmtNum(game.gold) }}</strong></div>
      <div>Today: {{ fmtDate(game.currentDate) }}</div>
      <div>Last flux: {{ fmtDate(market.lastMarketDate) }}</div>
    </header>

    <section class="panel">
      <h3>Price Catalog</h3>
      <simpleTable
          title="Inputs & Utilities"
          :headers="inputsHeaders"
          :data="inputsRows"
          :startOpen="true"
          class="noToggle"
      />
      <simpleTable
          title="Plants (seed, seedling/sapling)"
          :headers="plantsHeaders"
          :data="plantsRows"
          :startOpen="true"
          class="noToggle"
      />
      <simpleTable
          title="Animals (by stage)"
          :headers="animalsHeaders"
          :data="animalsRows"
          :startOpen="true"
          class="noToggle"
      />
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
  </div>
</template>
<style scoped>
.market-overlay {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
}

.bar {
  display: grid;
  grid-template-columns: repeat(4, auto);
  gap: 1rem;
  align-items: center;
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
