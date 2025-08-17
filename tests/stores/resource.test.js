// tests/stores/resource.test.js
import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { resourceStore } from '@/stores/resource.js'
import { gameStore } from '@/stores/game.js'

describe('resource store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('initializes counters and derives gold from difficulty', () => {
    const r = resourceStore()
    expect(r.electricity).toBe(0)
    expect(r.water).toBe(0)
    expect(r.waste).toBe(0)
    expect(r.gold).toBe(30000)
  })

  it('derives gold from difficulty before init', () => {
    const game = gameStore()
    game.difficulty = 3
    const r = resourceStore()
    expect(r.gold).toBe(10000)
  })

  it('gold is not retroactive if difficulty changes after creation', () => {
    const game = gameStore()
    const r = resourceStore()
    const initial = r.gold
    game.difficulty = 2
    expect(r.gold).toBe(initial)
  })
})
