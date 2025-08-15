import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia } from 'pinia';
import AssembliesMenu from '@/components/menus/operations/AssembliesMenu.vue';

describe('AssembliesMenu.vue', () => {
  it('mounts', () => {
    const wrapper = mount(AssembliesMenu, { global: { plugins: [createPinia()] } });
    expect(wrapper.exists()).toBe(true);
  });
});
