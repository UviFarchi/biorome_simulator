// tests/components/panels/Resources.test.js
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { mount } from '@vue/test-utils'
import Resources from '@/components/panels/Resources.vue'
import { resourceStore } from '@/stores/resources.js'
vi.mock('@/eventBus.js', () => ({ default: { emit: vi.fn() } }))
import eventBus from '@/eventBus.js'

describe('Resources panel', () => {
  beforeEach(() => { setActivePinia(createPinia()); vi.clearAllMocks() })

  it('renders resources; header toggles; collapses body', async () => {
    const r = resourceStore()
    const wrapper = mount(Resources, { props: { collapsed: false }, attachTo: document.body })
    expect(wrapper.find('#gold').text()).toContain(String(r.gold))
    expect(wrapper.find('#water').text()).toContain(String(r.water))
    expect(wrapper.find('#waste').text()).toContain(String(r.waste))
    expect(wrapper.find('#electricity').text()).toContain(String(r.electricity))

    await wrapper.find('.panel-header').trigger('click')
    expect(eventBus.emit).toHaveBeenCalledWith('panel', { target: 'resources' })

    await wrapper.setProps({ collapsed: true })
    expect(wrapper.find('.panel-body').isVisible()).toBe(false)
  })
})
