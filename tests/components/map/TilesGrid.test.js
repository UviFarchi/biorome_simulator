import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia } from 'pinia';
vi.mock('/src/areas/components/map/modals/TileModal.vue', () => ({ default: { template: '<div />' } }), { virtual: true });
import TilesGrid from '@/components/map/TilesGrid.vue';

describe('TilesGrid.vue', () => {
  it('mounts', () => {
    const wrapper = mount(TilesGrid, { global: { plugins: [createPinia()] } });
    expect(wrapper.exists()).toBe(true);
  });
});
