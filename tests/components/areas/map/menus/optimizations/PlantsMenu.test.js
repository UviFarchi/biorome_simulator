import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia } from 'pinia';
import PlantsMenu from '@/components/areas/map/menus/optimizations/PlantsMenu.vue';

describe('PlantsMenu.vue', () => {
  it('mounts', () => {
    const wrapper = mount(PlantsMenu, { global: { plugins: [createPinia()] } });
    expect(wrapper.exists()).toBe(true);
  });
});
