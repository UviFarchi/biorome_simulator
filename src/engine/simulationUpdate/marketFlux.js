// src/engine/steps/marketFlux.js
import {v4 as uuidv4} from 'uuid'
import {gameStore} from '@/stores/game.js'
import {marketStore} from '@/stores/market.js'
import {plantStore} from '@/stores/plant.js'
import {animalStore} from '@/stores/animal.js'
import { formatDate } from '@/utils/formatting.js'

// ——— utils
const iso = formatDate
const rint = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a
const pick = arr => arr[Math.floor(Math.random() * arr.length)]

function eventPriceModifier(game, productType) {
    const evts = game.currentEvents?.market ?? []
    let m = 1
    for (const e of evts) {
        if (Array.isArray(e?.affectedTypes) && e.affectedTypes.includes(productType) && typeof e?.priceModifier === 'number') {
            m *= e.priceModifier
        }
    }
    return m
}

function basePriceDict(plants, animals) {
    const pp = plants.products ?? {}   // plant products dict (key → {basePrice})
    const ap = animals.products ?? {}  // animal products dict (key → {basePrice})
    return {...pp, ...ap}
}

// ——— plant buy prices: only seed + seedling/sapling
function plantStagePrices(plants, productPrices) {
    const out = {}
    const list = plants.plantTypes || []
    for (const p of list) {
        const type = p.type
        const stages = p.growthStages || []
        const days = p.daysPerGrowthStage || []
        const productKey = p.productKey
        const base = productKey ? productPrices[productKey]?.basePrice : undefined
        if (!type || !stages.length || !productKey || typeof base !== 'number') continue

    // same multipliers as before, now applied to per-ha quantities
        const isPerennial = (p.plantMaterialKey === 'wood') || days.some(d => (d || 0) >= 1000) || stages.includes('sapling')
        const kSeed = isPerennial ? 2.0 : 1.5
        const kSeedling = isPerennial ? 10.0 : 4.0

        const purch = []
        const prices = {}
        if (stages.includes('seed')) {
      const qtyKgPerHa = Number(p.seedRate_kg_per_ha || 0)           // kg/ha
      prices.seed = Math.max(1, Math.round(base * kSeed * qtyKgPerHa))
            purch.push('seed')
        }

    // second buyable stage can be 'seedling' or 'sapling' depending on species
        if (stages.includes('seedling')) {
      const qtyUnitsPerHa = Number(p.seedlingDensity_per_ha || 0)     // units/ha
      prices.seedling = Math.max(1, Math.round(base * kSeedling * qtyUnitsPerHa))
            purch.push('seedling')
        } else if (stages.includes('sapling')) {
      const qtyUnitsPerHa = Number(p.seedlingDensity_per_ha || 0)
      prices.sapling = Math.max(1, Math.round(base * kSeedling * qtyUnitsPerHa))
            purch.push('sapling')
        }

        out[type] = {purchasableStages: purch, stagePrices: prices}
    }
    return out
}

// ——— animal buy prices: scale by adult-revenue anchor
function animalStagePrices(animals, productPrices) {
    const out = {}
    const list = animals.animalTypes || []
    for (const a of list) {
        const type = a.type
        const stages = a.growthStages || []
        const days = a.daysPerGrowthStage || []
        const yieldPer = a.yieldPerStage || []
        const productKey = a.product
        const base = productKey ? productPrices[productKey]?.basePrice : 0
        if (!type || !stages.length) continue

        const freq = Math.max(1, a.outputFrequency || 0)
        const revPerDay = i => ((yieldPer[i] || 0) / freq) * (base || 0)

        const adultIdx = Math.max(0, stages.indexOf('adult'))
        const adultDays = days[adultIdx] || 365
        const adultRev = revPerDay(adultIdx)
        const alpha = 0.1
        const adultAnchor = Math.max(100, Math.round(adultRev * Math.min(adultDays, 365) * alpha))

        const mult = [0.4, 0.7, 1.0, 0.6]
        const prices = {}
        for (let i = 0; i < stages.length; i++) {
            const m = mult[Math.min(i, mult.length - 1)]
            prices[stages[i]] = Math.max(1, Math.round(adultAnchor * m))
        }
        out[type] = {purchasableStages: [...stages], stagePrices: prices}
    }
    return out
}

function resourcesCatalog(game, market) {
    const base = market.baseResources || {}
    const out = {}
    for (const k of Object.keys(base)) {
        const b = base[k]
        const noise = 0.9 + Math.random() * 0.2
        const mod = eventPriceModifier(game, k)
        out[k] = {
            label: b.label, unit: b.unit, icon: b.icon, shelfLifeDays: b.shelfLifeDays,
            unitPrice: Number((b.basePrice * noise * mod).toFixed(2)),
        }
    }
    return out
}

function pruneExpired(market, todayISO) {
    for (const c of market.contracts) {
        if (c.status === 'pending' && new Date(c.dueDate) < new Date(todayISO)) {
            c.status = 'expired'
            market.notifications.push(`Contract expired: ${c.productType} x${c.quantity}`)
        }
    }
    for (const o of market.openMarketOffers) {
        if (o.status === 'open' && new Date(o.expiryDate) < new Date(todayISO)) {
            o.status = 'expired'
            market.notifications.push(`Offer expired: ${o.productType} x${o.quantity}`)
        }
    }
    while (market.notifications.length > 10) market.notifications.shift()
}

function genOpenOffers(game, market, productPrices, n = 1) {
    const keys = Object.keys(productPrices)
    if (!keys.length) return
    const today = iso(game.currentDate)
    for (let i = 0; i < n; i++) {
        const k = pick(keys)
        const base = productPrices[k]?.basePrice || 1
        const noise = 0.9 + Math.random() * 0.2
        const pricePerUnit = Math.max(1, Math.round(base * noise * eventPriceModifier(game, k)))
        const qty = rint(1, 15)
        const exp = new Date(today);
        exp.setDate(exp.getDate() + rint(1, 4))
        market.openMarketOffers.push({
            id: uuidv4(), productType: k, quantity: qty, pricePerUnit, expiryDate: iso(exp), status: 'open'
        })
        market.notifications.push(`New open offer for ${qty} ${k}`)
    }
}

function genContractOffers(game, market, productPrices, n = 1) {
    const keys = Object.keys(productPrices)
    if (!keys.length) return
    const today = iso(game.currentDate)
    for (let i = 0; i < n; i++) {
        const k = pick(keys)
        const base = productPrices[k]?.basePrice || 1
        const pricePerUnit = Math.max(1, Math.round(base * (1.1 + Math.random() * 0.5) * eventPriceModifier(game, k)))
        const qty = rint(5, 20)
        const due = new Date(today);
        due.setDate(due.getDate() + rint(3, 7))
        const recurring = Math.random() < 0.3
        market.contracts.push({
            id: uuidv4(), productType: k, quantity: qty, dueDate: iso(due),
            pricePerUnit, status: 'offered',
            type: recurring ? 'recurring' : 'one-off',
            interval: recurring ? rint(3, 7) : 0,
            penalty: Math.max(1, Math.round(0.2 * qty * pricePerUnit))
        })
        market.notifications.push(`New contract offer for ${qty} ${k}`)
    }
}

// ——— public API
export function marketFlux() {
    const game = gameStore()          // currentDate, currentEvents.market
    const market = marketStore()      // offers, contracts, utilities, extras
    const plants = plantStore()      // plantTypes + products
    const animals = animalStore()    // animalTypes + products

    const today = iso(game.currentDate)
    if (market.lastMarketDate === today) return {ran: false, reason: 'already_ran'}

    // --- market events lifecycle ---
    game.currentEvents = game.currentEvents || {}
    game.currentEvents.market = Array.isArray(game.currentEvents.market) ? game.currentEvents.market : []

// 1) decrement remaining & prune
    game.currentEvents.market = game.currentEvents.market
        .map(e => ({...e, remaining: (typeof e.remaining === 'number' ? e.remaining - 1 : null)}))
        .filter(e => e.remaining == null || e.remaining >= 0)

// 2) maybe create a new event
    if (Math.random() < 1) { // 25% chance per tick
        const templates = [
            () => ({
                id: 'demand-surge-tomato',
                headline: 'Demand surge for tomatoes',
                affectedTypes: ['tomato_fruit'],
                priceModifier: 1.2,
                remaining: rint(2, 4)
            }),
            () => ({
                id: 'oversupply-milk',
                headline: 'Milk oversupply depresses prices',
                affectedTypes: ['milk'],
                priceModifier: 0.85,
                remaining: rint(2, 4)
            }),
            () => ({
                id: 'fertilizer-spike',
                headline: 'Fertilizer price spike',
                affectedTypes: ['fertilizer'],
                priceModifier: 1.3,
                remaining: rint(1, 3)
            })
        ]
        const ev = templates[rint(0, templates.length - 1)]()
        game.currentEvents.market.push(ev)
        market.notifications.push(`Market event: ${ev.headline}`)
    }

    // 1) expirations
    pruneExpired(market, today)

    // 2) price catalog
    const prices = basePriceDict(plants, animals)
    const plantPrices = plantStagePrices(plants, prices)
    const animalPrices = animalStagePrices(animals, prices)
    const resources = resourcesCatalog(game, market)
    market.priceCatalog = { plants: plantPrices, animals: animalPrices, resources }

    // 3) new offers
    genOpenOffers(game, market, prices, 1)
    genContractOffers(game, market, prices, 1)

    // 4) cap notifications
    while (market.notifications.length > 10) market.notifications.shift()
//TODO => Calculate how much water, electricity and waste removal was consumed last turn and take money
    market.lastMarketDate = today
    return {ran: true, date: today}
}
