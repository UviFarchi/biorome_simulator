import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { animal as animalStore } from '@/stores/animal.js'

describe('animal store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('initializes with products and animalTypes', () => {
    const s = animalStore()
    expect(s).toBeDefined()
    expect(typeof s.products).toBe('object')
    expect(Array.isArray(s.animalTypes)).toBe(true)
    expect(s.animalTypes.length).toBeGreaterThan(0)
  })

  it('products have required fields', () => {
    const { products } = animalStore()
    for (const [key, p] of Object.entries(products)) {
      expect(typeof key).toBe('string')
      expect(typeof p.icon).toBe('string')
      expect(typeof p.label).toBe('string')
      expect(typeof p.basePrice).toBe('number')
      expect(p.basePrice).toBeGreaterThanOrEqual(0)
      expect(typeof p.shelfLife).toBe('number')
      expect(p.shelfLife).toBeGreaterThan(0)
    }
    // spot check canonical items
    for (const k of ['milk','eggs','honey','wool']) expect(products).toHaveProperty(k)
  })

  it('animalTypes have consistent schema', () => {
    const { animalTypes, products } = animalStore()
    for (const a of animalTypes) {
      // primitives
      expect(typeof a.type).toBe('string')
      expect(typeof a.icon).toBe('string')
      expect(typeof a.foodConsumption).toBe('number')
      expect(typeof a.waterConsumption).toBe('number')
      expect(typeof a.health).toBe('number')
      expect(typeof a.product).toBe('string')
      expect(typeof a.outputFrequency).toBe('number')
      expect(typeof a.wastePerTurn).toBe('number')
      expect(typeof a.dateDeployed).toBe('string')
      expect(typeof a.growthStage).toBe('string')

      // arrays
      expect(Array.isArray(a.food)).toBe(true)
      expect(Array.isArray(a.growthStages)).toBe(true)
      expect(Array.isArray(a.daysPerGrowthStage)).toBe(true)
      expect(Array.isArray(a.pricesPerStage)).toBe(true)
      expect(Array.isArray(a.yieldPerStage)).toBe(true)
      expect(Array.isArray(a.effects)).toBe(true)
      expect(Array.isArray(a.synergies || [])).toBe(true)

      // length alignment
      const n = a.growthStages.length
      expect(a.daysPerGrowthStage.length).toBe(n)
      expect(a.pricesPerStage.length).toBe(n)
      expect(a.yieldPerStage.length).toBe(n)

      // product linkage
      if (a.product && products[a.product]) {
        expect(a.outputFrequency).toBeGreaterThan(0)
      } else {
        expect(a.outputFrequency).toBeGreaterThanOrEqual(0)
      }

      // effects shape
      for (const e of a.effects) {
        expect(typeof e.target).toBe('string')
        if (e.property !== undefined && e.property !== null) {
          expect(typeof e.property).toBe('string')
        }
        expect(typeof e.delta).toBe('number')
      }
      // synergies shape
      for (const s of a.synergies || []) {
        expect(typeof s.target).toBe('string')
        expect(typeof s.strength).toBe('number')
      }
    }
  })

  it('includes expected animal types', () => {
    const { animalTypes } = animalStore()
    const types = animalTypes.map(a => a.type)
    for (const t of ['cow','goat','sheep','pig','chicken','duck','bee','rabbit','horse','donkey','ladybug','dog']) {
      expect(types).toContain(t)
    }
  })
})
