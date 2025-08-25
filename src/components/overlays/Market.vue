<script setup>
import {computed} from 'vue'
import {gameStore} from '@/stores/game.js'
import {marketStore} from '@/stores/market.js'

const game = gameStore()
const market = marketStore()

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

const priceCatalog = computed(() => market.priceCatalog || {plants: {}, animals: {}, inputs: {}})
const harvested = computed(() => market.harvestedProducts || []) // [{ type, qty, shelfLife? }]

const today = computed(() => {
  const d = game.currentDate
  return d ? new Date(d).toISOString().slice(0, 10) : ''
})

const fmtMoney = n => typeof n === 'number' ? `${Math.round(n)}💰` : '—'
const fmtNum = n => typeof n === 'number' ? Math.round(n) : '—'
const fmtDate = s => s ? new Date(s).toLocaleDateString() : ''
</script>
<template>
  <div class="market-overlay">
    <header class="bar">
      <div><strong>Market</strong></div>
      <div>Gold: <strong>{{ Math.round(game.gold) }}</strong></div>
      <div>Today: {{ fmtDate(today) }}</div>
      <div>Last flux: {{ fmtDate(market.lastMarketDate) }}</div>
    </header>

    <section class="panel">
      <h3>Price Catalog</h3>
      <div class="grid">
        <div class="card">
          <h4>Inputs & Utilities</h4>
          <table>
            <thead>
            <tr>
              <th>Item</th>
              <th>Buy</th>
              <th>Sell</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(v,k) in priceCatalog.inputs" :key="k">
              <td>{{ k }}</td>
              <td>{{ fmtMoney(v?.buy ?? v) }}</td>
              <td>{{ fmtMoney(v?.sell ?? (k === 'electricitySellPerKWh' ? v : null)) }}</td>
            </tr>
            </tbody>
          </table>
        </div>

        <div class="card">
          <h4>Plants (seed, seedling/sapling)</h4>
          <table>
            <thead>
            <tr>
              <th>Type</th>
              <th v-for="st in ['seed','seedling','sapling']" :key="st">{{ st }}</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(rec, type) in priceCatalog.plants" :key="type">
              <td>{{ type }}</td>
              <td>{{ fmtMoney(rec.stagePrices?.seed) }}</td>
              <td>{{ fmtMoney(rec.stagePrices?.seedling) }}</td>
              <td>{{ fmtMoney(rec.stagePrices?.sapling) }}</td>
            </tr>
            </tbody>
          </table>
        </div>

        <div class="card">
          <h4>Animals (by stage)</h4>
          <table>
            <thead>
            <tr>
              <th>Type</th>
              <th>Stage</th>
              <th>Buy</th>
            </tr>
            </thead>
            <tbody>
            <template v-for="(rec, type) in priceCatalog.animals" :key="type">
              <tr v-for="(price, stage) in rec.stagePrices" :key="type+'-'+stage">
                <td>{{ type }}</td>
                <td>{{ stage }}</td>
                <td>{{ fmtMoney(price) }}</td>
              </tr>
            </template>
            </tbody>
          </table>
        </div>
      </div>
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

.panel {
  background: #0f1418;
  color: #e0e0e0;
  border: 1px solid #00bcd4;
  border-radius: 10px;
  padding: .8rem;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: .8rem;
}

.card {
  border: 1px solid #2a3b45;
  border-radius: 8px;
  padding: .6rem;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  border-bottom: 1px solid #2a3b45;
  padding: .35rem .4rem;
  text-align: left;
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
  color: teal;
}

h4 {
  margin: .2rem 0;
  color: #ffd54f;
}
</style>
