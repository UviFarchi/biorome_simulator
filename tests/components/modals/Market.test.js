import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { mount } from '@vue/test-utils'
import MarketModal from '@/components/modals/Market.vue'
vi.mock('@/stores/animal.js', () => ({ animalsStore: () => ({ products: { milk: { basePrice: 1 } }, animalTypes: [] }) }))
vi.mock('@/stores/plant.js', () => ({ plantsStore: () => ({ products: { hay: { basePrice: 1 } }, plantTypes: [] }) }))
vi.mock('@/stores/market.js', () => ({ marketStore: () => ({ contracts: [], openMarketOffers: [], notifications: [], extraBuyables: [], harvestedProducts: [] }) }))
vi.mock('@/stores/map.js', () => ({ mapStore: () => ({ gate: { extras: [] } }) }))
vi.mock('@/stores/game.js', () => ({ gameStore: () => ({ gold: 0, eventLog: [], day: 0 }) }))

describe('Market.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('mounts', () => {
    const wrapper = mount(MarketModal)
    expect(wrapper.exists()).toBe(true)
  })
})
