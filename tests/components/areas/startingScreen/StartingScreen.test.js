import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia } from 'pinia';
import StartingScreen from '@/components/areas/startingScreen/StartingScreen.vue';

describe('StartingScreen.vue', () => {
  it('mounts', () => {
    const wrapper = mount(StartingScreen, { global: { plugins: [createPinia()] } });
    expect(wrapper.exists()).toBe(true);
  });
});
