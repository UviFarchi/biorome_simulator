// tests/stores/modules.test.js
import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { modulesStore } from '@/stores/modules.js'

beforeEach(() => {
  setActivePinia(createPinia())
})

describe('modules store', () => {
  it('initializes', () => {
    const s = modulesStore()
    expect(s).toBeDefined()
  })

  it('exposes constants with battery spec', () => {
    const s = modulesStore()
    expect(s.constants?.units?.electricity).toBe('kWh')
    expect(s.constants?.battery?.moduleKey).toBe('battery')
    expect(typeof s.constants?.battery?.kWhPerPack).toBe('number')
    expect(s.constants.battery.kWhPerPack).toBeGreaterThan(0)
  })

  it('has available modules with normalized shape and unique keys', () => {
    const s = modulesStore()
    const list = s.availableModules
    expect(Array.isArray(list)).toBe(true)
    expect(list.length).toBeGreaterThan(0)

    const keys = new Set()
    for (const m of list) {
      expect(typeof m.key).toBe('string')
      expect(m.key.length).toBeGreaterThan(0)
      expect(typeof m.name).toBe('string')
      expect(typeof m.type).toBe('string')
      expect(typeof m.cost).toBe('number')
      expect(typeof m.electricity).toBe('number')
      expect(typeof m.slots).toBe('number')
      expect(m.slots).toBeGreaterThanOrEqual(0)
      expect(Array.isArray(m.requires)).toBe(true)
      expect(keys.has(m.key)).toBe(false)
      keys.add(m.key)
    }
  })

  it('premade assemblies reference known module types', () => {
    const s = modulesStore()
    const defs = s.availableModules
    const premade = s.premadeAssemblies
    expect(Array.isArray(premade)).toBe(true)
    expect(premade.length).toBeGreaterThan(0)

    const hasTypeSubtype = (t, st) =>
        defs.some(d => d.type === t && (st == null || d.subtype === st))

    for (const a of premade) {
      expect(typeof a.usage).toBe('string')
      expect(Array.isArray(a.modules)).toBe(true)
      for (const ref of a.modules) {
        expect(typeof ref.type).toBe('string')
        expect(hasTypeSubtype(ref.type, ref.subtype)).toBe(true)
      }
    }
  })

  it('active assemblies reference known module types and have control fields', () => {
    const s = modulesStore()
    const defs = s.availableModules
    const active = s.activeAssemblies
    expect(Array.isArray(active)).toBe(true)
    expect(active.length).toBeGreaterThan(0)

    const hasTypeSubtype = (t, st) =>
        defs.some(d => d.type === t && (st == null || d.subtype === st))

    for (const a of active) {
      expect(typeof a.id).toBe('string')
      expect(typeof a.name).toBe('string')
      expect(typeof a.deployed).toBe('boolean')
      expect(typeof a.built).toBe('boolean')
      expect(typeof a.moves).toBe('number')
      expect(typeof a.actions).toBe('number')
      expect(Array.isArray(a.modules)).toBe(true)
      for (const ref of a.modules) {
        expect(typeof ref.type).toBe('string')
        expect(hasTypeSubtype(ref.type, ref.subtype)).toBe(true)
      }
    }
  })

  it('exposes currentAssembly as an array for the UI workflow', () => {
    const s = modulesStore()
    expect(Array.isArray(s.currentAssembly)).toBe(true)
  })
})
