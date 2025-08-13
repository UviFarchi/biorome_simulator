import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia } from 'pinia';
import App from '@/App.vue';

describe('App.vue', () => {
  it('mounts', () => {
    const wrapper = mount(App, { global: { plugins: [createPinia()] } });
    expect(wrapper.exists()).toBe(true);
  });
});
