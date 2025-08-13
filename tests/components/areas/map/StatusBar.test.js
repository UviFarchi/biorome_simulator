import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia } from 'pinia';
import StatusBar from '@/components/areas/map/StatusBar.vue';

describe('StatusBar.vue', () => {
  it('mounts', () => {
    const wrapper = mount(StatusBar, { global: { plugins: [createPinia()] } });
    expect(wrapper.exists()).toBe(true);
  });
});
