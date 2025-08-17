// tests/stores/weather.test.js
import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { weatherStore } from '@/stores/weather.js'

describe('weather store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('initializes base values', () => {
    const w = weatherStore()
    expect(w.temperature).toBe(25)
    expect(w.rainfall).toBe(0)
    expect(w.cloudCover).toBeCloseTo(0.1, 5)
    expect(w.currentLabel).toEqual({ label: 'Mild', icon: '🌤️' })
  })
})
