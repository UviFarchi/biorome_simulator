import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia } from 'pinia';
import EventLog from '@/components/modals/EventLog.vue';

describe('EventLog.vue', () => {
  it('mounts', () => {
    const wrapper = mount(EventLog, { global: { plugins: [createPinia()] } });
    expect(wrapper.exists()).toBe(true);
  });
});
