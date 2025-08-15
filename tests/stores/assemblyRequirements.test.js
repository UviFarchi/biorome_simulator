// tests/stores/assemblyRequirements.test.js
import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { assemblyRequirementsStore } from '@/stores/assemblyRequirements.js'

beforeEach(() => {
  setActivePinia(createPinia())
})

describe('assemblyRequirements store', () => {
  it('initializes', () => {
    const s = assemblyRequirementsStore()
    expect(s).toBeDefined()
  })

  it('exposes rule sections', () => {
    const s = assemblyRequirementsStore()
    expect(typeof s.allowByParent).toBe('object')
    expect(typeof s.childOverrides).toBe('object')
    expect(typeof s.coRequires).toBe('object')
    expect(typeof s.forbid).toBe('object')
  })

  it('has baseline parent allowances', () => {
    const s = assemblyRequirementsStore()
    expect(Array.isArray(s.allowByParent['transport:ground'])).toBe(true)
    expect(s.allowByParent['transport:ground']).toContain('arm')
    expect(s.allowByParent['transport:flying']).toContain('battery')
    expect(s.allowByParent['support:pole']).toContain('communications')
    expect(s.allowByParent['internalSpace:*']).toContain('shelf')
  })

  it('child overrides constrain heavy arms and tools correctly', () => {
    const s = assemblyRequirementsStore()
    expect(s.childOverrides['arm:heavy'].forbid).toEqual(
        expect.arrayContaining(['transport:flying', 'support:pole', 'support:shelfRack'])
    )
    expect(s.childOverrides['tool:*'].allow).toContain('arm:*')
    expect(s.childOverrides['tool:grader'].allow).toEqual(
        expect.arrayContaining(['arm:*', 'transport:ground'])
    )
  })

  it('co-requirements capture common pairs', () => {
    const s = assemblyRequirementsStore()
    expect(s.coRequires['sprayer:*']).toEqual(expect.arrayContaining(['tank', 'battery']))
    expect(s.coRequires['generator:*']).toContain('engine')
    expect(s.coRequires['power_elec:*']).toContain('generator')
    expect(s.coRequires['sterilizer:autoclave']).toContain('steam_gen')
    expect(s.coRequires['dispenser:spawn']).toContain('air_clean:laminar')
  })

  it('explicit forbids block fragile parents', () => {
    const s = assemblyRequirementsStore()
    expect(s.forbid['transport:flying']).toEqual(
        expect.arrayContaining(['cart', 'tank', 'arm_heavy'])
    )
  })
})
