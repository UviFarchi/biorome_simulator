import { describe, it, expect } from 'vitest';
import eventBus from '@/eventBus.js';

describe('event bus', () => {
  it('is defined', () => {
    expect(eventBus).toBeTruthy();
  });
});
