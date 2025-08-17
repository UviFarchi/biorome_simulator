// tests/stores/market.test.js
import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { marketStore } from '@/stores/market.js';

const isParsableDate = (s) => !Number.isNaN(Date.parse(s));

describe('market store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });
  it('initializes notifications as an empty list', () => {
    const m = marketStore();
    expect(Array.isArray(m.notifications)).toBe(true);
    expect(m.notifications.length).toBe(0);
  });
  it('initializes and exposes expected keys', () => {
    const m = marketStore();
    expect(Array.isArray(m.contracts)).toBe(true);
    expect(Array.isArray(m.openMarketOffers)).toBe(true);
    expect(Array.isArray(m.harvestedProducts)).toBe(true);
    expect(Array.isArray(m.extraBuyables)).toBe(true);
    expect(typeof m.utilityPrices).toBe('object');
  });

  it('contracts have the required fields and types', () => {
    const m = marketStore();
    expect(m.contracts.length).toBeGreaterThan(0); // seeded examples exist
    for (const c of m.contracts) {
      expect(typeof c.id).toBe('string');
      expect(typeof c.productType).toBe('string');
      expect(typeof c.quantity).toBe('number');
      expect(typeof c.pricePerUnit).toBe('number');
      expect(typeof c.status).toBe('string');
      expect(typeof c.type).toBe('string');
      expect(typeof c.interval).toBe('number');
      expect(typeof c.penalty).toBe('number');
      expect(typeof c.dueDate).toBe('string');
      expect(isParsableDate(c.dueDate)).toBe(true);
    }
  }); // seeded sample matches this shape. 

  it('open market offers have the required fields and types', () => {
    const m = marketStore();
    expect(m.openMarketOffers.length).toBeGreaterThan(0);
    for (const o of m.openMarketOffers) {
      expect(typeof o.id).toBe('string');
      expect(typeof o.productType).toBe('string');
      expect(typeof o.quantity).toBe('number');
      expect(typeof o.pricePerUnit).toBe('number');
      expect(typeof o.status).toBe('string');
      expect(typeof o.expiryDate).toBe('string');
      expect(isParsableDate(o.expiryDate)).toBe(true);
    }
  }); // seeded sample matches this shape. 

  it('extraBuyables include feed and fertilizer with prices and shelf life', () => {
    const m = marketStore();
    const types = m.extraBuyables.map(x => x.type);
    expect(types).toContain('feed');
    expect(types).toContain('fertilizer');
    for (const x of m.extraBuyables) {
      expect(typeof x.type).toBe('string');
      expect(typeof x.basePrice).toBe('number');
      expect(x.basePrice).toBeGreaterThanOrEqual(0);
      expect(typeof x.icon).toBe('string');
      expect(typeof x.shelfLife).toBe('number');
      expect(x.shelfLife).toBeGreaterThan(0);
    }
  }); // matches current definitions. 

  it('utilityPrices expose numeric tariffs', () => {
    const { utilityPrices } = marketStore();
    for (const k of ['electricityBuyPerKWh','electricitySellPerKWh','waterBuyPerM3','wasteDisposalPerTon']) {
      expect(typeof utilityPrices[k]).toBe('number');
      expect(utilityPrices[k]).toBeGreaterThanOrEqual(0);
    }
  }); // matches current defaults. 

  it('harvestedProducts starts empty', () => {
    const m = marketStore();
    expect(Array.isArray(m.harvestedProducts)).toBe(true);
    expect(m.harvestedProducts.length).toBe(0);
  });
});
