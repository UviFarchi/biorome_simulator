import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { nextTick } from 'vue'
import App from '@/App.vue'
import eventBus from '@/eventBus.js'
import { gameStore } from '@/stores/game.js'

beforeAll(() => {
  HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
    clearRect: vi.fn(),
    fillRect: vi.fn(),
    drawImage: vi.fn(),
    getImageData: vi.fn(() => ({ data: [] })),
    putImageData: vi.fn(),
    createImageData: vi.fn((w, h) => ({ data: new Uint8ClampedArray(w * h * 4) })),
    setTransform: vi.fn(),
  }))
})

describe('App.vue', () => {
  beforeEach(() => {
    eventBus.all.clear()
  })

  it('navigates between start and map screens', async () => {
    const pinia = createPinia()
    const wrapper = mount(App, { global: { plugins: [pinia] } })

    expect(wrapper.find('.start-form').exists()).toBe(true)
    eventBus.emit('nav', 'map')
    await nextTick()
    expect(wrapper.findComponent({ name: 'Map' }).exists()).toBe(true)
    eventBus.emit('nav', 'start')
    await nextTick()
    expect(wrapper.find('.start-form').exists()).toBe(true)
    wrapper.unmount()
  })

  it('logs events to the store', async () => {
    const pinia = createPinia()
    mount(App, { global: { plugins: [pinia] } })
    const store = gameStore()
    const content = { engine: 'test', msg: 'hello' }
    eventBus.emit('log', content)
    await nextTick()
    expect(store.log).toEqual(expect.arrayContaining([content]))
  })
})

