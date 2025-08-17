// tests/stores/stageRequirements.test.js
import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { stageRequirementsStore } from '@/stores/stageRequirements.js'

describe('requirements store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  })

  it('exposes stage milestones arrays', () => {
    const { stage } = stageRequirementsStore()
    expect(Array.isArray(stage.discovery.milestones)).toBe(true)
    expect(Array.isArray(stage.design.milestones)).toBe(true)
  })

  it('exposes action restrictions per stage', () => {
    const { stage } = stageRequirementsStore()
    expect(Array.isArray(stage.discovery.restrictions.actionsAllowed)).toBe(true)
    expect(stage.design.restrictions.actionsAllowed).toContain('sow')
    expect(stage.deployment.restrictions.actionsAllowed).toContain('harvestPlant')
  })
})

