<script setup>
import { computed, reactive } from 'vue'
import { mapStore } from '@/stores/map.js'
import { gameStore } from '@/stores/game.js'
import { actionRequirements } from '@/dict/actionRequirements.js'
import assemblyEffects from '@/engine/effects/actionEffects.js'
import {applyOptimizationEffects} from '@/engine/phases/optimizations/applyOptimizationEffects.js';
import {handleAction} from '@/engine/phases/operations/handleAction.js';

const map = mapStore()
const game = gameStore()

const DEFAULT_ACTION_CATEGORY = 'General'

const currentTile = computed(() => {
  const selected = map.selectedTile
  return selected && typeof selected === 'object' && 'value' in selected ? selected.value : selected
})

const currentPhase = computed(() => Number(game.phase ?? 0))

const actionGroups = computed(() => {
  const groups = new Map()

  Object.entries(actionRequirements || {}).forEach(([actionKey, definition = {}]) => {
    if (!definition) return

    const categories = Array.isArray(definition.categories) && definition.categories.length
      ? definition.categories
      : [DEFAULT_ACTION_CATEGORY]

    const entry = {
      key: actionKey,
      name: definition.displayName || formatTitle(actionKey),
      description: definition.description || '',
      requires: Array.isArray(definition.requires) ? definition.requires : [],
      categories,
      effects: Array.isArray(assemblyEffects?.[actionKey]) ? assemblyEffects[actionKey] : []
    }

    categories.forEach(category => {
      const groupKey = category || DEFAULT_ACTION_CATEGORY
      if (!groups.has(groupKey)) {
        groups.set(groupKey, { key: groupKey, title: formatTitle(groupKey), actions: [] })
      }
      groups.get(groupKey).actions.push(entry)
    })
  })

  return Array.from(groups.values())
    .map(group => ({
      ...group,
      actions: group.actions.slice().sort((a, b) => a.name.localeCompare(b.name))
    }))
    .sort((a, b) => a.title.localeCompare(b.title))
})

const expandedActions = reactive({})
const expandedCategories = reactive({})

function addActionToTile(category, actionKey) {
  const tile = currentTile.value
  if (!tile) return

  if (!tile.assemblies) {
    tile.assemblies = { real: [], optimized: [] }
  }

  if (!Array.isArray(tile.assemblies.optimized)) {
    tile.assemblies.optimized = []
  }

  const inst = { category, action: actionKey }
  const model = actionRequirements?.[actionKey]
  if (model) {
    inst.model = model
  }

  tile.assemblies.optimized.push(inst)
  const phase = currentPhase.value
  if (phase === 2) {
    handleAction('assembly', actionKey, tile, inst)
  } else if (phase === 1) {
    applyOptimizationEffects('assembly', actionKey, tile, inst)
  }
}

function toggleActionDetails(actionKey) {
  expandedActions[actionKey] = !expandedActions[actionKey]
}

function isActionExpanded(actionKey) {
  return !!expandedActions[actionKey]
}

function isCategoryExpanded(categoryKey) {
  return !!expandedCategories[categoryKey]
}

function toggleCategoryExpansion(categoryKey) {
  expandedCategories[categoryKey] = !isCategoryExpanded(categoryKey)
}

function humanize(text) {
  if (!text) return ''
  return text
    .replace(/_/g, ' ')
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/\s+/g, ' ')
    .trim()
}

function formatTitle(text) {
  const base = humanize(text)
  return base.replace(/\b\w/g, letter => letter.toUpperCase())
}

function formatDelta(delta) {
  if (typeof delta === 'function') {
    return 'Dynamic'
  }
  if (Number.isFinite(delta)) {
    return delta > 0 ? `+${delta}` : `${delta}`
  }
  if (delta === null || delta === undefined) {
    return 'N/A'
  }
  if (typeof delta === 'object') {
    return JSON.stringify(delta)
  }
  return String(delta)
}
</script>

<template>
  <div class="panel actionMenu">
    <div class="panel-header-row">
      <h4>Action Menu</h4>
    </div>

    <div v-if="!currentTile" class="hint">Select a tile to plan actions.</div>

    <div v-else class="menu-body">
      <div class="actions-list">
        <div
          v-for="group in actionGroups"
          :key="group.key"
          class="action-group"
        >
          <div class="action-group-header">
            <div class="action-group-title">
              <h4>{{ group.title }}</h4>
              <span class="action-count">{{ group.actions.length }} actions</span>
            </div>
            <button
              type="button"
              class="category-toggle"
              :aria-expanded="isCategoryExpanded(group.key)"
              @click="toggleCategoryExpansion(group.key)"
            >
              <span class="visually-hidden">Toggle {{ group.title }} actions</span>
              <span aria-hidden="true">{{ isCategoryExpanded(group.key) ? '▲' : '▼' }}</span>
            </button>
          </div>

          <div
            class="action-group-body"
            v-show="isCategoryExpanded(group.key)"
          >
            <article
              v-for="action in group.actions"
              :key="action.key"
              class="action-card"
            >
              <div class="action-card-header">
                <button
                  type="button"
                  class="action-title"
                  :disabled="!currentTile"
                  @click="addActionToTile(group.key, action.key)"
                >
                  {{ action.name }}
                </button>
                <button
                  v-if="action.description || action.requires.length"
                  type="button"
                  class="toggle-details"
                  @click="toggleActionDetails(action.key)"
                >
                  {{ isActionExpanded(action.key) ? 'Hide details' : 'Show details' }}
                </button>
              </div>

              <section v-if="isActionExpanded(action.key)" class="action-details">
                <p v-if="action.description" class="action-description">{{ action.description }}</p>
                <p class="action-categories">
                  <strong>Categories:</strong>
                  <span>{{ action.categories.map(formatTitle).join(', ') }}</span>
                </p>
                <div v-if="action.effects.length" class="effects">
                  <h5>Projected Effects</h5>
                  <ul>
                    <li
                      v-for="(effect, index) in action.effects"
                      :key="`${action.key}-effect-${index}`"
                    >
                      <span class="effect-target">{{ formatTitle(effect.target) }}</span>
                      <span class="effect-arrow">→</span>
                      <span class="effect-property">{{ formatTitle(effect.property) }}</span>
                      <span class="effect-delta">{{ formatDelta(effect.delta) }}</span>
                    </li>
                  </ul>
                </div>
                <p v-else class="effects-empty">No effects configured.</p>
                <div v-if="action.requires.length" class="requirements">
                  <h5>Required Functions</h5>
                  <ul>
                    <li
                      v-for="requirement in action.requires"
                      :key="requirement"
                    >
                      {{ formatTitle(requirement) }}
                    </li>
                  </ul>
                </div>
                <p v-else class="requirements-empty">No listed requirements.</p>
              </section>
            </article>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.actionMenu {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.menu-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: 100%;
}

.actions-list {
  flex: 1 1 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow-y: auto;
}

.action-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.action-group-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.action-group-title {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.action-count {
  font-size: 0.875rem;
  opacity: 0.8;
}

.category-toggle {
  border: none;
  background: transparent;
  color: inherit;
  cursor: pointer;
  padding: 0;
  font-size: 1rem;
  line-height: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.category-toggle:hover,
.category-toggle:focus-visible {
  color: var(--color-accent, inherit);
  outline: none;
}

.action-group-body {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.action-card-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.action-title {
  flex: 1 1 auto;
  text-align: left;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  background: color-mix(in srgb, var(--color-background) 35%, transparent);
  cursor: pointer;
}

.action-title:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.toggle-details {
  border: none;
  background: transparent;
  color: var(--color-accent, inherit);
  cursor: pointer;
  font-size: 0.875rem;
  padding: 0 4px;
}

.action-details {
  margin-top: 8px;
  padding: 8px 12px;
  border-left: 2px solid var(--color-border);
  background: color-mix(in srgb, var(--color-background) 15%, transparent);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.action-description {
  margin: 0;
}

.action-categories {
  margin: 0;
  font-size: 0.9rem;
}

.effects h5 {
  margin: 0 0 4px;
  font-size: 0.875rem;
}

.effects ul {
  margin: 0;
  padding-left: 16px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.effects-empty {
  margin: 0;
  opacity: 0.7;
}

.effect-target,
.effect-property {
  font-weight: 600;
}

.effect-arrow,
.effect-delta {
  margin-left: 4px;
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.requirements h5 {
  margin: 0 0 4px;
  font-size: 0.875rem;
}

.requirements ul {
  margin: 0;
  padding-left: 16px;
}

.requirements-empty {
  opacity: 0.7;
  margin: 0;
}

.hint {
  opacity: 0.8;
}
</style>
