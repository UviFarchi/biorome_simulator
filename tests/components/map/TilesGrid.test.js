import { describe, it, expect, vi, beforeAll } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia } from 'pinia';
vi.mock('/src/areas/components/map/modals/TileInfo.vue', () => ({ default: { template: '<div />' } }), { virtual: true });
import TilesGrid from '@/components/grid/TilesGrid.vue';

beforeAll(() => {
  HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
    clearRect: vi.fn(),
    fillRect: vi.fn(),
    drawImage: vi.fn(),
    getImageData: vi.fn(() => ({ data: [] })),
    putImageData: vi.fn(),
    createImageData: vi.fn((w, h) => ({ data: new Uint8ClampedArray(w * h * 4) })),
    setTransform: vi.fn(),
  }))
})

describe('TilesGrid.vue', () => {
  it('mounts', () => {
    const wrapper = mount(TilesGrid, { global: { plugins: [createPinia()] } });
    expect(wrapper.exists()).toBe(true);
  });
});
