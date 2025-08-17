// tests/stores/effect.test.js
import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { effectStore } from '@/stores/effect.js'

describe('effect store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('initializes with empty active array', () => {
    const s = effectStore()
    expect(Array.isArray(s.active)).toBe(true)
    expect(s.active.length).toBe(0)
  })

  it('exposes categorized effect definitions', () => {
    const { effects } = effectStore()
    expect(effects.soil).toBeTruthy()
    expect(effects.water).toBeTruthy()
    expect(effects.biotic).toBeTruthy()
    expect(effects.ops).toBeTruthy()
    expect(effects.modifiers.weather).toBeTruthy()
  })
})
