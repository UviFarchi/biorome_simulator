import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia } from 'pinia';
import TileModal from '@/components/modals/TileInfo.vue';

describe('TileInfo.vue', () => {
  it('mounts', () => {
    const wrapper = mount(TileModal, { global: { plugins: [createPinia()] } });
    expect(wrapper.exists()).toBe(true);
  });
});
