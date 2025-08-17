// tests/components/panels/Control.test.js
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { mount } from '@vue/test-utils'
import Control from '@/components/panels/Control.vue'
import { gameStore } from '@/stores/game.js'
vi.mock('@/eventBus.js', () => ({ default: { emit: vi.fn() } }))
import eventBus from '@/eventBus.js'

describe('Control panel', () => {
  beforeEach(() => { setActivePinia(createPinia()); vi.clearAllMocks() })

  it('shows next phase label from store', () => {
    const game = gameStore()
    game.turnPhase = -1
    const wrapper = mount(Control, { props: { collapsed: false }, attachTo: document.body })
    const expected = game.engines[(game.turnPhase + 1) % game.engines.length]
    expect(wrapper.find('#nextPhase').text()).toContain(expected)
  })

  it('header click emits panel toggle', async () => {
    const wrapper = mount(Control, { props: { collapsed: false } })
    await wrapper.find('.panel-header').trigger('click')
    expect(eventBus.emit).toHaveBeenCalledWith('panel', { target: 'control' })
  })

  it('collapses body when collapsed=true', async () => {
    const wrapper = mount(Control, { props: { collapsed: true }, attachTo: document.body })
    expect(wrapper.find('.panel-body').isVisible()).toBe(false)
    await wrapper.setProps({ collapsed: false })
    expect(wrapper.find('.panel-body').isVisible()).toBe(true)
  })

  it('forwards control actions via bus', async () => {
    const wrapper = mount(Control, { props: { collapsed: false } })
    await wrapper.find('#showLog').trigger('click')
    expect(eventBus.emit).toHaveBeenCalledWith('modal', { target: 'log' })
    await wrapper.find('#showAnalytics').trigger('click')
    expect(eventBus.emit).toHaveBeenCalledWith('modal', { target: 'analytics' })
    await wrapper.find('#nextPhase').trigger('click')
    expect(eventBus.emit).toHaveBeenCalledWith('phase', {})
  })
})
