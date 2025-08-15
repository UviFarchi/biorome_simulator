import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia } from 'pinia';
import FarmGate from '@/components/menus/operations/FarmGate.vue';

describe('FarmGate.vue', () => {
  it('mounts', () => {
    const wrapper = mount(FarmGate, { global: { plugins: [createPinia()] } });
    expect(wrapper.exists()).toBe(true);
  });
});
