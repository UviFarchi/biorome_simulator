// tests/components/areas/map/panels/PlayerPanel.test.js
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { mount } from '@vue/test-utils'
vi.mock('@/eventBus.js', () => ({ default: { emit: vi.fn() } }))
import eventBus from '@/eventBus.js'
import PlayerPanel from '@/components/areas/map/panels/Player.vue'
import { gameStore } from '@/stores/game.js'

describe('PlayerPanel', () => {
  beforeEach(() => { setActivePinia(createPinia()); vi.clearAllMocks() })

  it('shows player name, avatar and current stage label; header toggles via event bus', async () => {
    const game = gameStore()
    game.userName = 'Reuven'
    game.userAvatar = '🦊'
    game.bioromizationStage = 1

    const wrapper = mount(PlayerPanel, { attachTo: document.body })
    expect(wrapper.find('#player').text()).toContain('Reuven')
    expect(wrapper.find('#player').text()).toContain('🦊')
    expect(wrapper.find('#stage').text()).toContain('design')


    await wrapper.find('.panel-header').trigger('click')
    expect(eventBus.emit).toHaveBeenCalledWith('panel', { target: 'player' })
  })
})
