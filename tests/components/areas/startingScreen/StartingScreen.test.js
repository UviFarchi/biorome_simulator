// tests/components/areas/startingScreen/StartingScreen.test.js
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { mount } from '@vue/test-utils'
import StartingScreen from '@/components/StartingScreen.vue'
import { gameStore } from '@/stores/game.js'

vi.mock('@/eventBus.js', () => ({ default: { emit: vi.fn() } }))
import eventBus from '@/eventBus.js'

const S = {
  form: 'form.start-form',
  name: '#userName',
  avatar: '#userAvatar',
  startBtn: 'button.start-btn',
  diff: (v) => `input[name="difficulty"][value="${v}"]`,
}

async function pickFirstAvatar(wrapper) {
  const select = wrapper.find(S.avatar)
  const options = select.findAll('option')
  expect(options.length).toBeGreaterThan(0)
  const value = options[0].attributes('value') || options[0].element.value
  options[0].element.selected = true
  await select.trigger('change')
  return value
}

describe('StartingScreen', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
    setActivePinia(createPinia())
  })

  it('Start is disabled until a name is provided', async () => {
    const wrapper = mount(StartingScreen)
    await wrapper.vm.$nextTick()
    expect(wrapper.find(S.startBtn).element.disabled).toBe(true)
    await wrapper.find(S.name).setValue('Reuven')
    expect(wrapper.find(S.startBtn).element.disabled).toBe(false)
  })

  it('persists profile, updates game store, and navigates to map (difficulty=2)', async () => {
    const wrapper = mount(StartingScreen)
    await wrapper.vm.$nextTick()

    await wrapper.find(S.name).setValue('Reuven')
    const avatarValue = await pickFirstAvatar(wrapper)
    await wrapper.find(S.diff(2)).setChecked()
    await wrapper.find(S.form).trigger('submit.prevent')

    const saved = JSON.parse(localStorage.getItem('bioromeUser'))
    expect(saved).toEqual({ userName: 'Reuven', userAvatar: avatarValue, difficulty: 2 })

    const game = gameStore()
    expect(game.userName).toBe('Reuven')
    expect(game.userAvatar).toBe(avatarValue)
    expect(game.difficulty).toBe(2)

    expect(eventBus.emit).toHaveBeenCalledWith('nav', 'map')
  })

  it('defaults difficulty to 1 when no radio is selected', async () => {
    const wrapper = mount(StartingScreen)
    await wrapper.vm.$nextTick()

    await wrapper.find(S.name).setValue('Ada')
    await pickFirstAvatar(wrapper)
    await wrapper.find(S.form).trigger('submit.prevent')

    const saved = JSON.parse(localStorage.getItem('bioromeUser'))
    expect(saved.difficulty).toBe(1)
    expect(gameStore().difficulty).toBe(1)
  })

  it('trims whitespace from name', async () => {
    const wrapper = mount(StartingScreen)
    await wrapper.vm.$nextTick()

    await wrapper.find(S.name).setValue('  Lin  ')
    const avatarValue = await pickFirstAvatar(wrapper)
    await wrapper.find(S.diff(1)).setChecked()
    await wrapper.find(S.form).trigger('submit.prevent')

    const saved = JSON.parse(localStorage.getItem('bioromeUser'))
    expect(saved.userName).toBe('Lin')
    expect(saved.userAvatar).toBe(avatarValue)
  })
})
