<script setup>
import eventBus from '@/eventBus.js'
import {animalsStore} from '@/stores/animal.js'
import {gameStore} from '@/stores/game.js'
import {marketStore} from '@/stores/market.js'
import {plantsStore} from '@/stores/plant.js'
import {v4 as uuidv4} from 'uuid'
import {computed, onMounted, ref} from 'vue'
import {mapStore} from '@/stores/map.js';

const market = marketStore()

const animals = animalsStore()
const plants = plantsStore()
const game = gameStore()
const tiles = mapStore()

const activeContracts = computed(() =>
    market.contracts.filter(c => c.status === 'pending').sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
)
const offeredContracts = computed(() =>
    market.contracts.filter(c => c.status === 'offered').sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
)
const openOffers = computed(() =>
    market.openMarketOffers.filter(o => o.status === 'open').sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate))
)
const filterType = ref('all')
const productTypes = computed(() => Array.from(new Set([
  ...market.contracts.map(c => c.productType),
  ...market.openMarketOffers.map(o => o.productType)
])))

const filteredActiveContracts = computed(() =>
    activeContracts.value.filter(c => filterType.value === 'all' || c.productType === filterType.value)
)
const filteredOfferedContracts = computed(() =>
    offeredContracts.value.filter(c => filterType.value === 'all' || c.productType === filterType.value)
)
const filteredOpenOffers = computed(() =>
    openOffers.value.filter(o => filterType.value === 'all' || o.productType === filterType.value)
)
const latestNotifications = computed(() => market.notifications.slice(-5).reverse())
const newsForToday = computed(() =>
    game.eventLog.filter(n => n.day === game.day)
)

const buyQuantities = ref({})

function setQuantity(type, val) {
  buyQuantities.value[type] = Number(val)
}

function buyExtra(type) {
  const item = market.extraBuyables.find(b => b.type === type)
  const qty = buyQuantities.value[type] || 1
  const totalCost = item.basePrice * qty

  if (!item) return
  if (game.gold < totalCost) {
    addNotification('Not enough gold!')
    return
  }
  game.gold -= totalCost
  for (let i = 0; i < qty; i++) {
    tiles.gate.extras.push({...item})
  }
  addNotification(`Bought and delivered ${qty} ${item.type.replace('_', ' ')}${qty > 1 ? 's' : ''} to gate for ${totalCost} gold.`)
}

function addNotification(msg) {
  market.notifications.push(msg)
  if (market.notifications.length > 10) market.notifications.shift()
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function availableProducts() {
  return [
    ...Object.values(plants.products),
    ...Object.values(animals.products)
  ]
}

function getPriceModifier(productType) {
  return newsForToday.value.reduce((mult, n) => {
    if (n.effect && n.effect.affectedTypes && n.effect.affectedTypes.includes(productType)) {
      return mult * (n.effect.priceModifier || 1)
    }
    return mult
  }, 1)
}


function generateRandomContract() {
  const prod = randomItem(availableProducts())
  const quantity = randomInt(5, 20)
  const pricePerUnit = Math.round(prod.basePrice * randomInt(100, 300) / 100)
  const interval = randomInt(3, 7)
  const due = new Date()
  due.setDate(due.getDate() + interval)
  const recurring = Math.random() < 0.3
  market.contracts.push({
    id: uuidv4(),
    productType: prod.type,
    quantity,
    dueDate: due.toISOString().slice(0, 10),
    pricePerUnit,
    status: 'offered',
    type: recurring ? 'recurring' : 'one-off',
    interval,
    penalty: Math.round(pricePerUnit * quantity * 0.2)
  })
  addNotification(`New contract offer for ${quantity} ${prod.type}`)
}

function generateRandomOffer() {
  const prod = randomItem(availableProducts())
  const quantity = randomInt(1, 15)
  const pricePerUnit = Math.round(prod.basePrice * randomInt(80, 120) / 100)
  const expiresIn = randomInt(1, 4)
  const exp = new Date()
  exp.setDate(exp.getDate() + expiresIn)
  market.openMarketOffers.push({
    id: uuidv4(),
    productType: prod.type,
    quantity,
    pricePerUnit,
    expiryDate: exp.toISOString().slice(0, 10),
    status: 'open'
  })
  addNotification(`New open market offer for ${quantity} ${prod.type}`)
}

function generateDailyOffers(numContracts = 1, numOffers = 1) {
  for (let i = 0; i < numContracts; i++) generateRandomContract()
  for (let i = 0; i < numOffers; i++) generateRandomOffer()
}

function removeFromInventory(type, qty) {
  const item = market.harvestedProducts.find(p => p.type === type)
  if (!item || item.qty < qty) return false
  item.qty -= qty
  if (item.qty <= 0) {
    const idx = market.harvestedProducts.findIndex(p => p.type === type)
    market.harvestedProducts.splice(idx, 1)
  }
  return true
}

function isContractExpired(contract) {
  return new Date(contract.dueDate) < new Date()
}

function isOfferExpired(offer) {
  return new Date(offer.expiryDate) < new Date()
}

function canFulfillContract(contract) {
  const item = market.harvestedProducts.find(p => p.type === contract.productType)
  return item && item.qty >= contract.quantity && contract.status === 'pending' && !isContractExpired(contract)
}

function canSellOffer(offer) {
  const item = market.harvestedProducts.find(p => p.type === offer.productType)
  return item && item.qty >= offer.quantity && offer.status === 'open' && !isOfferExpired(offer)
}

function acceptContract(id) {
  const contract = market.contracts.find(c => c.id === id && c.status === 'offered')
  if (contract) {
    contract.status = 'pending'
    addNotification(`Accepted contract for ${contract.quantity} ${contract.productType}`)
  }
}

function fulfillContract(id) {
  const contract = market.contracts.find(c => c.id === id && c.status === 'pending')
  if (!contract) return
  if (isContractExpired(contract)) {
    contract.status = 'expired'
    addNotification('Contract has expired and cannot be fulfilled.')
    return
  }
  if (!removeFromInventory(contract.productType, contract.quantity)) {
    addNotification('Not enough inventory to fulfill contract.')
    return
  }
  const mod = getPriceModifier(contract.productType)
  const earned = contract.quantity * contract.pricePerUnit * mod
  game.gold += earned
  addNotification(`Fulfilled contract for ${earned} gold.`)
  if (contract.type === 'recurring') {
    const next = new Date(contract.dueDate)
    next.setDate(next.getDate() + contract.interval)
    contract.dueDate = next.toISOString().slice(0, 10)
    contract.quantity = randomInt(Math.max(1, contract.quantity - 5), contract.quantity + 5)
    contract.status = 'pending'
  } else {
    contract.status = 'completed'
  }
}

function sellToOpenMarket(id) {
  const offer = market.openMarketOffers.find(o => o.id === id && o.status === 'open')
  if (!offer) return
  if (isOfferExpired(offer)) {
    offer.status = 'expired'
    addNotification('Offer has expired and cannot be sold.')
    return
  }
  if (!removeFromInventory(offer.productType, offer.quantity)) {
    addNotification('Not enough inventory to sell on offer.')
    return
  }
  const mod = getPriceModifier(offer.productType)
  const earned = offer.quantity * offer.pricePerUnit * mod
  game.gold += earned
  offer.status = 'sold'
  addNotification(`Sold ${offer.quantity} ${offer.productType} for ${earned} gold.`)
}

onMounted(() => {
  generateDailyOffers()
})

function deliver(id) {
  fulfillContract(id)
}

function sell(id) {
  sellToOpenMarket(id)
}

function accept(id) {
  acceptContract(id)
}

function canFulfill(c) {
  return canFulfillContract(c)
}

function canSell(o) {
  return canSellOffer(o)
}
</script>

<template>
  <div class="market-area">
    <div class="news-ticker" aria-label="News ticker">
      <div v-if="newsForToday.length" :class="{ animate: newsForToday.length > 1 }" class="ticker-inner">
        <span v-for="n in newsForToday" :key="n.id" :class="['news-item', n.type]">{{ n.headline }}</span>
      </div>
      <div v-else class="ticker-inner">No news today.</div>
    </div>
    <h1>Market</h1>
    <div class="gold">Gold: {{ game.gold }}</div>
    <button class="btn btn--return return-btn" @click="eventBus.emit('nav', 'main')">Back to Map</button>
    <section class="market-buy-extras">
      <h2>Buy Farm Inputs</h2>
      <div class="buy-buttons">
        <div v-for="x in market.extraBuyables" :key="x.type" class="buy-extra-block">
          <label>
            {{ x.icon }} {{ x.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) }}<br>
            <input
                type="number"
                min="1"
                :max="Math.floor(gameState.gold / x.basePrice) || 1"
                v-model.number="buyQuantities[x.type]"
                @input="setQuantity(x.type, buyQuantities[x.type])"
                style="width:3em"
            >
            <button
                @click="buyExtra(x.type)"
                :disabled="!buyQuantities[x.type] || gameState.gold < x.basePrice * buyQuantities[x.type]"
            >
              Buy ({{ x.basePrice * (buyQuantities[x.type] || 1) }}💰)
            </button>
          </label>
        </div>
      </div>
    </section>
    <div class="filter-row">
      <label>Filter:</label>
      <select v-model="filterType">
        <option value="all">All</option>
        <option v-for="t in productTypes" :key="t" :value="t">{{ t }}</option>
      </select>
    </div>
    <div class="lists">
      <section class="contracts">
        <h2>Contracts</h2>
        <div class="sub-list" v-if="filteredOfferedContracts.length">
          <h3>Offered</h3>
          <div v-for="c in filteredOfferedContracts" :key="c.id" class="contract-item">
            <div class="row"><span class="type">{{ c.productType }}</span> x{{ c.quantity }} @ {{ c.pricePerUnit }}
            </div>
            <div class="row">Due: {{ new Date(c.dueDate).toLocaleDateString() }}</div>
            <div class="row">Penalty: {{ c.penalty }}</div>
            <button @click="accept(c.id)">Accept</button>
          </div>
        </div>
        <p v-else>No contract offers.</p>

        <div class="sub-list" v-if="filteredActiveContracts.length">
          <h3>Active</h3>
          <div v-for="c in filteredActiveContracts" :key="c.id" class="contract-item">
            <div class="row"><span class="type">{{ c.productType }}</span> x{{ c.quantity }} @ {{ c.pricePerUnit }}
            </div>
            <div class="row">Due: {{ new Date(c.dueDate).toLocaleDateString() }}</div>
            <div class="row">Penalty: {{ c.penalty }}</div>
            <div class="row">Status: {{ isContractExpired(c) ? 'Expired' : c.status }}</div>
            <button @click="deliver(c.id)" :disabled="!canFulfill(c)">Deliver</button>
          </div>
        </div>
        <p v-else>No active contracts.</p>
      </section>

      <section class="offers">
        <h2>Open Offers</h2>
        <div class="sub-list" v-if="filteredOpenOffers.length">
          <div v-for="o in filteredOpenOffers" :key="o.id" class="offer-item">
            <div class="row"><span class="type">{{ o.productType }}</span> x{{ o.quantity }} @ {{ o.pricePerUnit }}
            </div>
            <div class="row">Expires: {{ new Date(o.expiryDate).toLocaleDateString() }}</div>
            <div class="row">Status: {{ isOfferExpired(o) ? 'Expired' : o.status }}</div>
            <button @click="sell(o.id)" :disabled="!canSell(o)">Sell</button>
          </div>
        </div>
        <p v-else>No open offers.</p>
      </section>
    </div>

    <section class="inventory">
      <h2>Harvested Products</h2>
      <ul>
        <li v-for="p in market.harvestedProducts" :key="p.type">
          {{ p.type }} - {{ p.qty }} (shelf {{ p.shelfLife }})
        </li>
      </ul>
    </section>

    <section class="notifications">
      <h2>Notifications</h2>
      <ul>
        <li v-for="(n, i) in latestNotifications" :key="i">{{ n }}</li>
      </ul>
    </section>


  </div>


</template>

<style scoped>
.market-area {
  display: flex;
  flex-direction: column;
  gap: 1.4rem;
  padding: 1.6rem 2.2rem 2.2rem 2.2rem;
  font-family: 'Segoe UI', 'Arial', sans-serif;
  background: #f8fafb;
  min-height: 100vh;
}

h1, h2, h3 {
  color: #1378c1;
  margin-bottom: 0.6em;
}

.filter-row {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  margin-bottom: 0.9em;
}

.lists {
  display: flex;
  gap: 2rem;
  min-height: 18em;
}

.contracts, .offers {
  flex: 1;
  background: #fff;
  border-radius: 1em;
  box-shadow: 0 2px 12px #0097a71a;
  padding: 1.1em 1.2em;
  display: flex;
  flex-direction: column;
  gap: 1em;
  min-width: 240px;
}

.sub-list {
  display: flex;
  flex-direction: column;
  gap: 0.6em;
  border-bottom: 1px solid #eee;
  padding-bottom: 0.5em;
}

.contract-item,
.offer-item {
  background: #f3fbe9;
  border-radius: 0.6em;
  padding: 0.7em 1em;
  box-shadow: 0 1px 4px #b2dfdb33;
  display: flex;
  flex-direction: column;
  gap: 0.32em;
  border: 1px solid #b2dfdb;
}

.contract-item button,
.offer-item button {
  margin-top: 0.35em;
  background: #00bcd4;
  color: #fff;
  border: none;
  border-radius: 0.4em;
  padding: 0.3em 1.2em;
  font-weight: 600;
  font-size: 0.98em;
  cursor: pointer;
  box-shadow: 0 1px 4px #00bcd433;
  transition: background 0.18s;
}

.contract-item button:disabled,
.offer-item button:disabled {
  background: #eee;
  color: #bbb;
  cursor: not-allowed;
}

.contract-item button:not(:disabled):hover,
.offer-item button:not(:disabled):hover {
  background: #008ba3;
}

.row {
  display: flex;
  justify-content: space-between;
  font-size: 1.01em;
}

.type {
  font-weight: bold;
  color: #1976d2;
}

.gold {
  margin-top: 1.2rem;
  font-weight: bold;
  font-size: 1.08em;
  color: #17652c;
}

.news-ticker {
  overflow: hidden;
  white-space: nowrap;
  border: 1px solid #b2dfdb;
  border-radius: 6px;
  background: #e0f7fa;
  padding: 0.6em 1.2em;
  margin-bottom: 1.1rem;
  font-size: 1.1em;
}

.ticker-inner {
  display: inline-block;
}

.ticker-inner.animate {
  animation: scroll 15s linear infinite;
  padding-left: 100%;
}

.news-item {
  padding: 0 1em;
  margin-right: 0.6em;
  display: inline-block;
  border-radius: 0.4em;
  background: #fffde7;
}

.news-item.market {
  background: #fff176;
  color: #333;
}

.news-item.weather {
  background: #90caf9;
  color: #333;
}

.return-btn {
  align-self: flex-end;
  margin-bottom: 0.8rem;
  padding: 0.45em 1.15em;
  background: #b2dfdb;
  border-radius: 0.7em;
  border: none;
  font-weight: bold;
  color: #234;
  cursor: pointer;
  transition: background 0.13s;
}

.return-btn:hover {
  background: #80deea;
}

.market-buy-extras {
  margin-bottom: 1.5em;
  margin-top: 0.3em;
}

.buy-buttons {
  display: flex;
  gap: 1.5em;
  margin-top: 0.7em;
  flex-wrap: wrap;
}

.buy-extra-block {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.4em;
  background: #fffde7;
  padding: 1em 1.3em;
  border-radius: 0.8em;
  border: 1.5px solid #ffd60088;
  box-shadow: 0 1px 6px #ffd60033;
  min-width: 145px;
}

.buy-extra-block label {
  font-weight: 500;
  color: #333;
  font-size: 1.08em;
}

.buy-extra-block input[type="number"] {
  margin: 0.35em 0 0.42em 0;
  border-radius: 0.25em;
  border: 1px solid #bdbdbd;
  padding: 0.12em 0.8em;
  font-size: 1em;
  width: 3.6em;
  background: #fafaf2;
}

.buy-extra-block button {
  background: #00bcd4;
  color: #fff;
  border: none;
  border-radius: 0.45em;
  font-size: 0.97em;
  padding: 0.15em 1.1em;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.1s;
}

.buy-extra-block button:disabled {
  background: #eee;
  color: #bbb;
  cursor: not-allowed;
}

.buy-extra-block button:not(:disabled):hover {
  background: #0097a7;
}

.inventory {
  background: #e3f2fd;
  padding: 1.1em 1.5em 1.3em 1.5em;
  border-radius: 0.9em;
  margin-bottom: 1.5em;
}

.inventory h2 {
  margin-top: 0;
  margin-bottom: 0.7em;
}

.notifications {
  background: #f9fbe7;
  padding: 1em 1.2em 0.5em 1.2em;
  border-radius: 0.8em;
  min-height: 5em;
}

.notifications h2 {
  margin-top: 0;
  margin-bottom: 0.7em;
}

.notifications ul {
  list-style: disc;
  padding-left: 1.1em;
  margin-bottom: 0.4em;
}

@keyframes scroll {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-100%);
  }
}
</style>
