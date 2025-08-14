import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia } from 'pinia';
import Map from '@/components/areas/map/Map.vue';

describe('Map.vue', () => {
  it('mounts', () => {
    const wrapper = mount(Map, { global: { plugins: [createPinia()] } });
    expect(wrapper.exists()).toBe(true);
  });
});
