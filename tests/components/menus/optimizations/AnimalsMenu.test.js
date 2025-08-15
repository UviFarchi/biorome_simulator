import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia } from 'pinia';
import AnimalsMenu from '@/components/menus/optimizations/AnimalsMenu.vue';

describe('AnimalsMenu.vue', () => {
  it('mounts', () => {
    const wrapper = mount(AnimalsMenu, { global: { plugins: [createPinia()] } });
    expect(wrapper.exists()).toBe(true);
  });
});
