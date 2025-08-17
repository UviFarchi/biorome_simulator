// tests/stores/game.test.js
import {describe, it, expect, beforeEach} from 'vitest'
import {setActivePinia, createPinia} from 'pinia'
import {gameStore} from '@/stores/game.js'

function isoDateLike(s) {
    return /^\d{4}-\d{2}-\d{2}$/.test(s);
}

describe('game store', () => {
    beforeEach(() => {
        setActivePinia(createPinia())
    })

    it('initializes', () => {
        const store = gameStore()
        expect(store).toBeDefined()
    })

    it('exposes the expected keys with correct defaults', () => {
        const g = gameStore()
        expect(typeof g.startDate).toBe('string')
        expect(isoDateLike(g.startDate)).toBe(true)
        expect(g.currentDay).toBe(0)
        expect(g.bioromizationStage).toBe(0)
        expect(g.turnPhase).toBe(-1)
        expect(g.userName).toBe('')
        expect(g.userAvatar).toBe('')
        expect(g.difficulty).toBe(1)
        expect(g.bioromizationStages).toEqual(['discovery', 'design', 'deployment'])
        expect(g.engines).toEqual(['analytics', 'optimizations', 'operations'])
    })
})
