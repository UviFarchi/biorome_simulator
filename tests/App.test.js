import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { nextTick } from 'vue'
import App from '@/App.vue'
import eventBus from '@/eventBus.js'
import { eventsStore } from '@/stores/event.js'

vi.mock('@/calc/recalculateTileValues.js', () => ({
  recalculateTileValues: vi.fn(),
}))

vi.mock('@/calc/produceReport.js', () => ({
  produceReport: vi.fn(),
}))

describe('App.vue', () => {
  beforeEach(() => {
    eventBus.all.clear()
  })

  it('navigates and shows only StartingScreen when currentScreen is start', async () => {
    const pinia = createPinia()
    const wrapper = mount(App, { global: { plugins: [pinia] } })

    // hide analytics from initial phase change
    eventBus.emit('menu', { target: 'analytics', show: false })
    await nextTick()

    // only starting screen visible
    expect(wrapper.find('.start-form').exists()).toBe(true)
    expect(wrapper.find('.tiles').exists()).toBe(false)
    expect(wrapper.vm.show.log).toBe(false)
    expect(wrapper.vm.show.analytics).toBe(false)
    expect(wrapper.vm.show.animals).toBe(false)
    expect(wrapper.vm.show.plants).toBe(false)
    expect(wrapper.vm.show.assemblies).toBe(false)
    expect(wrapper.vm.show.gate).toBe(false)

    // navigate to map
    eventBus.emit('nav', 'map')
    await nextTick()
    expect(wrapper.find('.tiles').exists()).toBe(true)
    expect(wrapper.find('.start-form').exists()).toBe(false)

    // navigate back to start
    eventBus.emit('nav', 'start')
    await nextTick()
    expect(wrapper.find('.start-form').exists()).toBe(true)
    expect(wrapper.find('.tiles').exists()).toBe(false)

    wrapper.unmount()
  })

  it('toggles menus via event bus', async () => {
    const pinia = createPinia()
    const wrapper = mount(App, { global: { plugins: [pinia] } })

    // ensure analytics hidden
    eventBus.emit('menu', { target: 'analytics', show: false })
    await nextTick()

    eventBus.emit('menu', { target: 'log', show: true })
    await nextTick()
    expect(wrapper.vm.show.log).toBe(true)

    eventBus.emit('menu', { target: 'log' })
    await nextTick()
    expect(wrapper.vm.show.log).toBe(false)

    eventBus.emit('menu', { target: 'analytics', show: true })
    await nextTick()
    expect(wrapper.vm.show.analytics).toBe(true)

    eventBus.emit('menu', { target: 'analytics' })
    await nextTick()
    expect(wrapper.vm.show.analytics).toBe(false)

    wrapper.unmount()
  })

  it('changes menus based on phase', async () => {
    const pinia = createPinia()
    const wrapper = mount(App, { global: { plugins: [pinia] } })

    // initial phase 0
    expect(wrapper.vm.show.analytics).toBe(true)
    expect(wrapper.vm.show.animals).toBe(false)
    expect(wrapper.vm.show.plants).toBe(false)
    expect(wrapper.vm.show.assemblies).toBe(false)
    expect(wrapper.vm.show.gate).toBe(false)

    // phase 1
    eventBus.emit('phase')
    await nextTick()
    expect(wrapper.vm.show.analytics).toBe(false)
    expect(wrapper.vm.show.animals).toBe(true)
    expect(wrapper.vm.show.plants).toBe(true)
    expect(wrapper.vm.show.assemblies).toBe(false)
    expect(wrapper.vm.show.gate).toBe(false)

    // phase 2
    eventBus.emit('phase')
    await nextTick()
    expect(wrapper.vm.show.animals).toBe(false)
    expect(wrapper.vm.show.plants).toBe(false)
    expect(wrapper.vm.show.assemblies).toBe(true)
    expect(wrapper.vm.show.gate).toBe(true)
    expect(wrapper.vm.show.analytics).toBe(false)

    wrapper.unmount()
  })

  it('logs events to the store', async () => {
    const pinia = createPinia()
    const wrapper = mount(App, { global: { plugins: [pinia] } })
    const store = eventsStore()

    const content = { engine: 'test', msg: 'hello' }
    eventBus.emit('log', content)
    await nextTick()
    expect(store.log).toEqual(expect.arrayContaining([content]))

    wrapper.unmount()
  })
})

