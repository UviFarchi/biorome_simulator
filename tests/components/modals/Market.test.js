import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { mount } from '@vue/test-utils'
import MarketModal from '@/components/modals/Market.vue'

describe('Market.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('mounts', () => {
    const wrapper = mount(MarketModal)
    expect(wrapper.exists()).toBe(true)
  })
})
