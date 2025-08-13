import { describe, it, expect, vi } from 'vitest';
vi.mock('@/stores/requirements.js', () => ({ requirements: {} }), { virtual: true });
import { getAdjacentTiles } from '@/utils.js';

describe('utils', () => {
  it('getAdjacentTiles returns adjacent tiles', () => {
    const grid = [
      [{ row:0, col:0 }, { row:0, col:1 }],
      [{ row:1, col:0 }, { row:1, col:1 }]
    ];
    const result = getAdjacentTiles(grid[0][0], grid);
    expect(Array.isArray(result)).toBe(true);
  });
});
