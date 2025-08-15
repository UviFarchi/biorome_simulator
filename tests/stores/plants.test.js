// tests/stores/plants.test.js
import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { plants as plantsStore } from '@/stores/plants.js'

describe('plants store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('initializes with plantTypes and products', () => {
    const s = plantsStore()
    expect(Array.isArray(s.plantTypes)).toBe(true)
    expect(s.plantTypes.length).toBeGreaterThan(0)
    expect(typeof s.products).toBe('object')
    expect(Object.keys(s.products).length).toBeGreaterThan(0)
  })

  it('products have required fields and valid types', () => {
    const { products } = plantsStore()
    for (const [key, p] of Object.entries(products)) {
      expect(typeof key).toBe('string')
      expect(typeof p.icon).toBe('string')
      expect(typeof p.label).toBe('string')
      expect(typeof p.basePrice).toBe('number')
      expect(p.basePrice).toBeGreaterThanOrEqual(0)
      expect(typeof p.shelfLife).toBe('number')
      expect(p.shelfLife).toBeGreaterThan(0)
      expect(typeof p.harvestType).toBe('string')
      expect(['product', 'plant']).toContain(p.harvestType)
    }
    // spot check presence
    for (const k of ['hay','corn_cob','tomato_fruit','wood']) {
      expect(products).toHaveProperty(k)
    }
  })

  it('plantTypes have consistent schema', () => {
    const { plantTypes, products } = plantsStore()
    for (const plant of plantTypes) {
      // primitives
      expect(typeof plant.type).toBe('string')
      expect(typeof plant.health).toBe('number')
      expect(typeof plant.waterRequired).toBe('number')
      expect(plant.waterRequired).toBeGreaterThanOrEqual(0)
      expect(typeof plant.fertilizerRequired).toBe('number')
      expect(plant.fertilizerRequired).toBeGreaterThanOrEqual(0)
      expect(typeof plant.yield).toBe('number')
      expect(plant.yield).toBeGreaterThanOrEqual(0)
      expect(typeof plant.seedCost).toBe('number')
      expect(plant.seedCost).toBeGreaterThanOrEqual(0)
      expect(typeof plant.seedlingCost).toBe('number')
      expect(plant.seedlingCost).toBeGreaterThanOrEqual(0)
      expect(typeof plant.icon).toBe('string')
      expect(typeof plant.productKey).toBe('string') // may be ''
      expect(typeof plant.dateDeployed).toBe('string')
      expect(typeof plant.growthStage).toBe('string')
      expect(typeof plant.plantMaterialKey).toBe('string')
      expect(typeof plant.removedWhenHarvested).toBe('boolean')

      // arrays
      expect(Array.isArray(plant.plantingOptions)).toBe(true)
      expect(plant.plantingOptions.length).toBeGreaterThan(0)
      expect(Array.isArray(plant.growthStages)).toBe(true)
      expect(plant.growthStages.length).toBeGreaterThan(0)
      expect(Array.isArray(plant.daysPerGrowthStage)).toBe(true)
      expect(plant.daysPerGrowthStage.length).toBe(plant.growthStages.length)
      expect(Array.isArray(plant.harvestWindows)).toBe(true)
      expect(Array.isArray(plant.effects)).toBe(true)
      expect(Array.isArray(plant.synergies)).toBe(true)

      // harvest windows shape
      for (const w of plant.harvestWindows) {
        expect(typeof w.startMonth).toBe('number')
        expect(typeof w.startDay).toBe('number')
        expect(typeof w.endMonth).toBe('number')
        expect(typeof w.endDay).toBe('number')
      }

      // effects and synergies shape
      for (const e of plant.effects) {
        expect(typeof e.type).toBe('string')
        expect(typeof e.strength).toBe('number')
      }
      for (const s of plant.synergies) {
        expect(typeof s.target).toBe('string')
        expect(typeof s.strength).toBe('number')
      }

      // optional fruiting model
      if ('fruitStages' in plant) {
        expect(Array.isArray(plant.fruitStages)).toBe(true)
        expect(Array.isArray(plant.daysPerFruitStage)).toBe(true)
        expect(plant.daysPerFruitStage.length).toBe(plant.fruitStages.length)
        expect(typeof plant.fruitStage).toBe('string')
      }

      // product linkage when present
      if (plant.productKey) {
        expect(products).toHaveProperty(plant.productKey)
      }
    }
  })

  it('includes expected plant types', () => {
    const { plantTypes } = plantsStore()
    const types = plantTypes.map(p => p.type)
    for (const t of ['grass','corn','tomato','lettuce','carrot','pumpkin','lavender','clover','sunflower','wheat','barley','oats','strawberry','blueberry','coffee','apple_tree','oak_tree','poplar','willow','pear_tree','almond_tree','orange_tree','lemon_tree','grape_vine']) {
      expect(types).toContain(t)
    }
  })
})
