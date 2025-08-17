// tests/stores/weatherLabel.test.js
import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { weatherStore } from '@/stores/weather.js';

const in01 = (x) => x >= 0 && x <= 1;

describe('weatherLabel store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('initializes base values', () => {
    const w = weatherStore();
    expect(w.temperature).toBe(25);
    expect(w.rainfall).toBe(0);
    expect(w.cloudCover).toBeCloseTo(0.1, 5);
  });

  it('exposes seasonalWeather with valid ranges', () => {
    const { seasonalWeather } = weatherStore();
    for (const s of ['spring','summer','autumn','winter']) {
      const sw = seasonalWeather[s];
      for (const k of ['temperature','rainfall','cloudCover']) {
        expect(typeof sw[k].min).toBe('number');
        expect(typeof sw[k].max).toBe('number');
        expect(typeof sw[k].mean).toBe('number');
        expect(sw[k].min).toBeLessThanOrEqual(sw[k].max);
      }
      expect(in01(sw.cloudCover.min)).toBe(true);
      expect(in01(sw.cloudCover.max)).toBe(true);
    }
  });

  it('weatherEvents exist and are well-formed', () => {
    const { weatherEvents } = weatherStore();
    expect(Array.isArray(weatherEvents)).toBe(true);
    expect(weatherEvents.length).toBeGreaterThan(0);
    for (const e of weatherEvents) {
      expect(typeof e.id).toBe('string');
      expect(e.type).toBe('weatherLabel');
      expect(['spring','summer','autumn','winter','any']).toContain(e.season);
      expect(typeof e.frequency).toBe('number');
      expect(e.frequency).toBeGreaterThanOrEqual(0);
      expect(e.frequency).toBeLessThanOrEqual(1);
      expect(typeof e.duration).toBe('number');
      expect(e.duration).toBeGreaterThan(0);
      expect(Array.isArray(e.effect)).toBe(true);
      for (const fx of e.effect) {
        expect(fx.target).toBe('weatherLabel');
        expect(['temperature','rainfall','cloudCover']).toContain(fx.parameter);
        expect(typeof fx.delta).toBe('number');
      }
    }
  });

  it('sample events have expected effects', () => {
    const { weatherEvents } = weatherStore();
    const drought = weatherEvents.find(e => e.id === 'weatherLabel-3');
    expect(drought).toBeTruthy();
    expect(drought.effect.some(fx => fx.parameter === 'rainfall' && fx.delta === -3)).toBe(true);
    expect(drought.effect.some(fx => fx.parameter === 'temperature' && fx.delta === 2)).toBe(true);

    const thunder = weatherEvents.find(e => e.id === 'weatherLabel-8');
    expect(thunder).toBeTruthy();
    expect(thunder.effect.some(fx => fx.parameter === 'cloudCover' && fx.delta === 0.4)).toBe(true);

    const frost = weatherEvents.find(e => e.id === 'weatherLabel-5');
    expect(frost).toBeTruthy();
    expect(frost.effect.some(fx => fx.parameter === 'temperature' && fx.delta === -8)).toBe(true);
  });
});
