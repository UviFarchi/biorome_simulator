// tests/stores/game.test.js
import {describe, it, expect, beforeEach} from 'vitest';
import {setActivePinia, createPinia} from 'pinia';
import {nextTick} from 'vue';
import {gameStore} from '@/stores/game.js';

function isoDateLike(s) {
    return /^\d{4}-\d{2}-\d{2}$/.test(s);
}

describe('game store', () => {
    beforeEach(() => {
        localStorage.clear();
        setActivePinia(createPinia());
    });

    it('initializes', () => {
        const store = gameStore();
        expect(store).toBeDefined();
    });

    it('exposes the expected keys with correct defaults', () => {
        const g = gameStore();
        expect(typeof g.startDate).toBe('string');
        expect(isoDateLike(g.startDate)).toBe(true);
        expect(g.currentDay).toBe(0);
        expect(g.bioromizationStage).toBe(0);
        expect(g.turnPhase).toBe(-1);
        expect(g.userName).toBe('');
        expect(g.userAvatar).toBe('');
        expect(g.difficulty).toBe(1);
        expect(g.bioromizationStages).toEqual(['discovery', 'design', 'deployment']);
        expect(g.engines).toEqual(['analytics', 'optimizations', 'operations']);
    });

    it('loads profile from localStorage on first instantiation', () => {
        localStorage.setItem('bioromeUser', JSON.stringify({userName: 'Ada', userAvatar: 'ava.png', difficulty: 2}));
        const g = gameStore();
        expect(g.userName).toBe('Ada');
        expect(g.userAvatar).toBe('ava.png');
        expect(g.difficulty).toBe(2);
    });

    it('persists profile fields to localStorage when they change (async watch)', async () => {
        const g = gameStore();
        g.userName = 'Lin';
        g.userAvatar = 'lin.png';
        g.difficulty = 0;
        await nextTick(); // wait for watch() to flush
        const savedRaw = localStorage.getItem('bioromeUser');
        expect(savedRaw).toBeTruthy();
        const saved = JSON.parse(savedRaw);
        expect(saved).toEqual({userName: 'Lin', userAvatar: 'lin.png', difficulty: 0});
    });

    it('rehydrates difficulty=1 exactly', () => {
        localStorage.setItem('bioromeUser', JSON.stringify({userName: 'Zoe', userAvatar: 'z.png', difficulty: 0}));
        const g = gameStore();


        expect(g.difficulty).toBe(1);
    });
});
