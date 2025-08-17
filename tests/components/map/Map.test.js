// tests/components/map/Map.test.js
import { describe, it, expect, beforeEach, vi, beforeAll } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import MapView from '@/components/Map.vue'
import { gameStore } from '@/stores/game.js'

// stub canvas API used by grid components
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

// functional event bus mock
const handlers = {}
vi.mock('@/eventBus.js', () => ({
  default: {
    on: vi.fn((evt, fn) => { handlers[evt] = fn }),
    off: vi.fn((evt) => { delete handlers[evt] }),
    emit: vi.fn((evt, payload) => { handlers[evt] && handlers[evt](payload) })
  }
}))
vi.mock('@/calc/updateGame.js', () => ({ default: vi.fn() }))

import eventBus from '@/eventBus.js'
import updateGame from '@/calc/updateGame.js'

// panel stubs that expose the collapsed prop for assertions
const ControlStub   = { props: ['collapsed'],  template: '<div id="controlPanel"   :data-collapsed="String(collapsed)"></div>' }
const WeatherStub   = { props: ['collapsed'],  template: '<div id="weatherPanel"   :data-collapsed="String(collapsed)"></div>' }
const PlayerStub    = { props: ['collapsed'],  template: '<div id="playerPanel"    :data-collapsed="String(collapsed)"></div>' }
const ResourcesStub = { props: ['collapsed'],  template: '<div id="resourcesPanel" :data-collapsed="String(collapsed)"></div>' }

// menu/modal stubs
const globalStubs = {
  ControlPanel: ControlStub,
  WeatherPanel: WeatherStub,
  PlayerPanel: PlayerStub,
  ResourcesPanel: ResourcesStub,
  EventLog: { template: '<div id="logModal" />' },
  AnalyticsReport: { template: '<div id="analyticsModal" />' },
  AnimalsMenu: { template: '<div id="animalsMenu" />' },
  PlantsMenu: { template: '<div id="plantsMenu" />' },
  AssembliesMenu: { template: '<div id="assembliesMenu" />' },
  FarmGate: { template: '<div id="farmGate" />' }
}

describe('Map.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    for (const k of Object.keys(handlers)) delete handlers[k]
  })

  it('auto-starts first phase on mount when turnPhase === -1 and shows analytics', async () => {
    const game = gameStore()
    game.turnPhase = -1
    game.currentDay = 0

    const wrapper = mount(MapView, { attachTo: document.body, global: { stubs: globalStubs } })
    await nextTick(); await nextTick()

    expect(game.turnPhase).toBe(0)
    expect(updateGame).toHaveBeenCalled()
    expect(wrapper.find('#analyticsModal').exists()).toBe(true)
    expect(wrapper.find('#animalsMenu').exists()).toBe(false)
    expect(wrapper.find('#plantsMenu').exists()).toBe(false)
    expect(wrapper.find('#assembliesMenu').exists()).toBe(false)
    expect(wrapper.find('#farmGate').exists()).toBe(false)

    wrapper.unmount()
  })

  it('switches menus per phase on phase events', async () => {
    const game = gameStore()
    game.turnPhase = -1
    const wrapper = mount(MapView, { attachTo: document.body, global: { stubs: globalStubs } })
    await nextTick()

    // -> phase 1
    eventBus.emit('phase', {})
    await nextTick()
    expect(game.turnPhase).toBe(1)
    expect(wrapper.find('#animalsMenu').exists()).toBe(true)
    expect(wrapper.find('#plantsMenu').exists()).toBe(true)
    expect(wrapper.find('#analyticsModal').exists()).toBe(false)

    // -> phase 2
    eventBus.emit('phase', {})
    await nextTick()
    expect(game.turnPhase).toBe(2)
    expect(wrapper.find('#assembliesMenu').exists()).toBe(true)
    expect(wrapper.find('#farmGate').exists()).toBe(true)
    expect(wrapper.find('#animalsMenu').exists()).toBe(false)
    expect(wrapper.find('#plantsMenu').exists()).toBe(false)

    // -> wrap to phase 0
    eventBus.emit('phase', {})
    await nextTick()
    expect(game.turnPhase).toBe(0)
    expect(wrapper.find('#analyticsModal').exists()).toBe(true)

    wrapper.unmount()
  })

  it('toggles panels via panel events and passes collapsed prop', async () => {
    const wrapper = mount(MapView, { attachTo: document.body, global: { stubs: globalStubs } })
    await nextTick()

    // default: all visible -> collapsed=false
    expect(wrapper.find('#controlPanel').attributes('data-collapsed')).toBe('false')
    expect(wrapper.find('#weatherPanel').attributes('data-collapsed')).toBe('false')
    expect(wrapper.find('#playerPanel').attributes('data-collapsed')).toBe('false')
    expect(wrapper.find('#resourcesPanel').attributes('data-collapsed')).toBe('false')

    // implicit toggle weather -> collapsed=true
    eventBus.emit('panel', { target: 'weather' })
    await nextTick()
    expect(wrapper.find('#weatherPanel').attributes('data-collapsed')).toBe('true')

    // explicit hide/show player
    eventBus.emit('panel', { target: 'player', show: false })
    await nextTick()
    expect(wrapper.find('#playerPanel').attributes('data-collapsed')).toBe('true')
    eventBus.emit('panel', { target: 'player', show: true })
    await nextTick()
    expect(wrapper.find('#playerPanel').attributes('data-collapsed')).toBe('false')

    wrapper.unmount()
  })
})
