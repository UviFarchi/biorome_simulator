import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia } from 'pinia';
import AnalyticsReport from '@/components/modals/AnalyticsReport.vue';

describe('AnalyticsReport.vue', () => {
  it('mounts', () => {
    const wrapper = mount(AnalyticsReport, { global: { plugins: [createPinia()] } });
    expect(wrapper.exists()).toBe(true);
  });
});
