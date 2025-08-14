import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { mount } from '@vue/test-utils'
import Weather from '@/components/areas/map/panels/Weather.vue'
vi.mock('@/eventBus.js', () => ({ default: { emit: vi.fn() } }))
import eventBus from '@/eventBus.js'

describe('Weather panel', () => {
  beforeEach(() => { setActivePinia(createPinia()); vi.clearAllMocks() })

  it('shows day, season, weather; header toggles via bus; collapses body', async () => {
    const wrapper = mount(Weather, { props: { collapsed: false }, attachTo: document.body })
    expect(wrapper.find('#day').exists()).toBe(true)
    expect(wrapper.find('#season').exists()).toBe(true)
    expect(wrapper.find('#weather').exists()).toBe(true)
    expect(wrapper.find('#weather').attributes('title')).toMatch(/Temp:/)

    await wrapper.find('.panel-header').trigger('click')
    expect(eventBus.emit).toHaveBeenCalledWith('panel', { target: 'weather' })

    await wrapper.setProps({ collapsed: true })
    expect(wrapper.find('.panel-body').isVisible()).toBe(false)
  })
})

