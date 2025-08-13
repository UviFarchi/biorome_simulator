import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia } from 'pinia';
import TileModal from '@/components/modals/TileModal.vue';

describe('TileModal.vue', () => {
  it('mounts', () => {
    const wrapper = mount(TileModal, { global: { plugins: [createPinia()] } });
    expect(wrapper.exists()).toBe(true);
  });
});
