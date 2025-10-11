<script setup>
import { computed, reactive, watch } from 'vue';
import { mapStore } from '@/stores/map.js';
import { gameStore } from '@/stores/game.js';
import { actionModels } from '@/dict/actionModels.js';
import assemblyEffects from '@/engine/effects/actionEffects.js';
import { handleAction } from '@/engine/phases/operations/handleAction.js';

const map = mapStore();
const game = gameStore();

const DEFAULT_ACTION_CATEGORY = 'General';

const expandedActions = reactive({});
const expandedCategories = reactive({});
const parameterState = reactive({});
const parameterTouched = reactive({});

const currentTile = computed(() => {
  const selected = map.selectedTile;
  return selected && typeof selected === 'object' && 'value' in selected
    ? selected.value
    : selected;
});

const currentPhase = computed(() => Number(game.phase ?? 0));

watch(
  () => currentTile.value,
  () => {
    Object.keys(parameterState).forEach((key) => {
      parameterState[key] = {};
    });
    Object.keys(parameterTouched).forEach((key) => {
      parameterTouched[key] = {};
    });
    actionGroups.value.forEach((group) => {
      group.actions.forEach((action) => {
        ensureParameterDefaults(action.key, action.parameters);
      });
    });
  }
);

const actionGroups = computed(() => {
  const groups = new Map();

  Object.entries(actionModels || {}).forEach(([actionKey, model = {}]) => {
    if (!model) return;

    const categories =
      Array.isArray(model.categories) && model.categories.length
        ? model.categories
        : [DEFAULT_ACTION_CATEGORY];

    const parameterOrder =
      Array.isArray(model.parameterOrder) && model.parameterOrder.length
        ? model.parameterOrder
        : Object.keys(model.parameters || {});

    const parameters = parameterOrder
      .map((paramKey) => {
        const definition = model.parameters?.[paramKey];
        if (!definition) return null;
        return {
          ...definition,
          key: definition.key || paramKey,
          label: definition.label || formatTitle(paramKey),
          type: definition.type || 'text',
        };
      })
      .filter(Boolean);

    ensureParameterDefaults(actionKey, parameters);

    const requirementFunctions = Array.isArray(model?.requirements?.functions)
      ? model.requirements.functions.map((fn) => ({
          id: fn.id,
          label: fn.label || formatTitle(fn.id),
          params: Array.isArray(fn.params)
            ? fn.params
                .map((paramKey) => {
                  const ref = model.parameters?.[paramKey];
                  if (!ref) {
                    return {
                      key: paramKey,
                      label: formatTitle(paramKey),
                      type: 'unknown',
                    };
                  }
                  return {
                    ...ref,
                    key: ref.key || paramKey,
                    label: ref.label || formatTitle(paramKey),
                  };
                })
                .filter(Boolean)
            : [],
        }))
      : [];

    const previewEffects = Array.isArray(assemblyEffects?.[actionKey])
      ? assemblyEffects[actionKey].filter((effect) => effect?.target && effect?.property)
      : [];

    const entry = {
      key: actionKey,
      model,
      name: model.displayName || formatTitle(actionKey),
      description: model.description || '',
      categories,
      parameters,
      requirements: { functions: requirementFunctions },
      effects: previewEffects,
    };

    categories.forEach((category) => {
      const groupKey = category || DEFAULT_ACTION_CATEGORY;
      if (!groups.has(groupKey)) {
        groups.set(groupKey, { key: groupKey, title: formatTitle(groupKey), actions: [] });
        if (expandedCategories[groupKey] === undefined) {
          expandedCategories[groupKey] = true;
        }
      }
      groups.get(groupKey).actions.push(entry);
    });
  });

  return Array.from(groups.values())
    .map((group) => ({
      ...group,
      actions: group.actions.slice().sort((a, b) => a.name.localeCompare(b.name)),
    }))
    .sort((a, b) => a.title.localeCompare(b.title));
});

function ensureParameterContainer(actionKey) {
  if (!parameterState[actionKey]) {
    parameterState[actionKey] = {};
  }
  return parameterState[actionKey];
}

function ensureTouchedContainer(actionKey) {
  if (!parameterTouched[actionKey]) {
    parameterTouched[actionKey] = {};
  }
  return parameterTouched[actionKey];
}

function ensureParameterDefaults(actionKey, parameters) {
  const container = ensureParameterContainer(actionKey);
  parameters.forEach((param) => {
    if (container[param.key] === undefined) {
      if (param.default !== undefined) {
        container[param.key] = param.type === 'number' ? Number(param.default) : param.default;
      } else {
        container[param.key] = null;
      }
    }
  });
}

function getParameterValue(actionKey, paramKey) {
  const container = ensureParameterContainer(actionKey);
  return container[paramKey];
}

function setParameterValue(actionKey, field, rawValue) {
  const container = ensureParameterContainer(actionKey);

  if (field.type === 'number') {
    if (rawValue === '' || rawValue === null || rawValue === undefined) {
      container[field.key] = null;
    } else {
      const numeric = Number(rawValue);
      container[field.key] = Number.isNaN(numeric) ? rawValue : numeric;
    }
    return;
  }

  if (field.type === 'select' || field.type === 'entity') {
    container[field.key] = rawValue === '' ? null : rawValue;
    return;
  }

  container[field.key] = rawValue;
}

function formatParameterInputValue(actionKey, field) {
  const value = getParameterValue(actionKey, field.key);
  if (value === null || value === undefined) {
    return '';
  }
  if (field.type === 'number') {
    return typeof value === 'number' ? value : Number(value) || value;
  }
  if (field.type === 'select' || field.type === 'entity') {
    return String(value);
  }
  return value;
}

function markFieldTouched(actionKey, fieldKey) {
  const container = ensureTouchedContainer(actionKey);
  container[fieldKey] = true;
}

function markActionFieldsTouched(actionKey, fields) {
  const container = ensureTouchedContainer(actionKey);
  fields.forEach((field) => {
    container[field.key] = true;
  });
}

function isFieldTouched(actionKey, fieldKey) {
  return !!parameterTouched[actionKey]?.[fieldKey];
}

function getFieldOptions(field) {
  if (!field) return [];
  if (Array.isArray(field.options) && field.options.length) {
    return field.options;
  }

  if (field.type !== 'entity') {
    return [];
  }

  const tile = currentTile.value;
  if (!tile) return [];

  switch (field.source) {
    case 'tileAssemblies':
      return collectEntityOptions(tile.assemblies, 'assembly');
    case 'tilePlants':
      return collectEntityOptions(tile.plants, 'plant');
    case 'tileAnimals':
      return collectEntityOptions(tile.animals, 'animal');
    case 'tileStorage':
      return Object.keys(tile.resources || {}).map((key) => ({
        value: key,
        label: formatTitle(key),
      }));
    default:
      return [];
  }
}

function collectEntityOptions(collection, fallbackPrefix) {
  if (!collection) return [];
  const buckets = [];

  if (Array.isArray(collection)) {
    buckets.push(collection);
  }
  if (Array.isArray(collection?.real)) {
    buckets.push(collection.real);
  }
  if (Array.isArray(collection?.optimized)) {
    buckets.push(collection.optimized);
  }

  const options = [];
  let index = 0;
  buckets.forEach((bucket) => {
    bucket.forEach((item) => {
      const option = buildOptionFromEntity(item, fallbackPrefix, index);
      if (option) {
        options.push(option);
        index += 1;
      }
    });
  });

  return options;
}

function buildOptionFromEntity(entity, prefix, index) {
  if (!entity) return null;
  const rawValue =
    entity.id ??
    entity.key ??
    entity.uuid ??
    entity.slug ??
    entity.name ??
    (typeof index === 'number' ? `${prefix}-${index}` : null);

  if (rawValue === null || rawValue === undefined) {
    return null;
  }

  const label =
    entity.displayName ??
    entity.name ??
    entity.label ??
    entity.title ??
    formatTitle(String(rawValue));

  return {
    value: String(rawValue),
    label: String(label),
  };
}

function getParameterError(actionKey, field) {
  const value = getParameterValue(actionKey, field.key);

  if ((value === null || value === undefined || value === '') && field.required) {
    return 'Required';
  }

  if (field.type === 'number') {
    if (value === null || value === undefined || value === '') {
      return field.required ? 'Required' : '';
    }
    if (typeof value !== 'number' || Number.isNaN(value)) {
      return 'Enter a number';
    }
    if (typeof field.min === 'number' && value < field.min) {
      return `Min ${field.min}`;
    }
    if (typeof field.max === 'number' && value > field.max) {
      return `Max ${field.max}`;
    }
  }

  const options = getFieldOptions(field);
  if ((field.type === 'select' || field.type === 'entity') && options.length) {
    if (value === null || value === undefined || value === '') {
      return field.required ? 'Required' : '';
    }
    const optionValues = options.map((option) => String(option.value));
    if (!optionValues.includes(String(value))) {
      return 'Invalid option';
    }
  }

  return '';
}

function isActionParametersValid(actionKey, fields) {
  return fields.every((field) => !getParameterError(actionKey, field));
}

function findActionEntry(actionKey) {
  for (const group of actionGroups.value) {
    const found = group.actions.find((action) => action.key === actionKey);
    if (found) return found;
  }
  return null;
}

function addActionToTile(category, actionKey) {
  const tile = currentTile.value;
  if (!tile) return;

  const entry = findActionEntry(actionKey);
  if (!entry) return;

  if (!isActionParametersValid(actionKey, entry.parameters)) {
    expandedActions[actionKey] = true;
    markActionFieldsTouched(actionKey, entry.parameters);
    return;
  }

  if (!tile.assemblies) {
    tile.assemblies = { real: [], optimized: [] };
  }

  if (!Array.isArray(tile.assemblies.real)) {
    tile.assemblies.real = [];
  }

  if (!Array.isArray(tile.assemblies.optimized)) {
    tile.assemblies.optimized = [];
  }

  const params = { ...ensureParameterContainer(actionKey) };

  const inst = {
    category,
    action: actionKey,
    model: entry.model,
    params,
  };

  const phase = currentPhase.value;
  if (phase === 2) {
    tile.assemblies.real.push(inst);
  } else if (phase === 1) {
    tile.assemblies.optimized.push(inst);
  }

  handleAction(actionKey, tile, inst);
}

function toggleActionDetails(actionKey) {
  expandedActions[actionKey] = !expandedActions[actionKey];
}

function isActionExpanded(actionKey) {
  return !!expandedActions[actionKey];
}

function isCategoryExpanded(categoryKey) {
  return !!expandedCategories[categoryKey];
}

function toggleCategoryExpansion(categoryKey) {
  expandedCategories[categoryKey] = !isCategoryExpanded(categoryKey);
}

function humanize(text) {
  if (!text) return '';
  return text
    .replace(/_/g, ' ')
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/\s+/g, ' ')
    .trim();
}

function formatTitle(text) {
  const base = humanize(text);
  return base.replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatDelta(delta) {
  if (typeof delta === 'function') {
    return 'Dynamic';
  }
  if (Number.isFinite(delta)) {
    return delta > 0 ? `+${delta}` : `${delta}`;
  }
  if (delta === null || delta === undefined) {
    return 'N/A';
  }
  if (typeof delta === 'object') {
    return JSON.stringify(delta);
  }
  return String(delta);
}

function onParameterInput(actionKey, field, value) {
  setParameterValue(actionKey, field, value);
  markFieldTouched(actionKey, field.key);
}

function onParameterBlur(actionKey, field) {
  markFieldTouched(actionKey, field.key);
}

function shouldShowParameterError(actionKey, field) {
  return isFieldTouched(actionKey, field.key) && !!getParameterError(actionKey, field);
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
        <div v-for="group in actionGroups" :key="group.key" class="action-group">
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

          <div class="action-group-body" v-show="isCategoryExpanded(group.key)">
            <article v-for="action in group.actions" :key="action.key" class="action-card">
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
                  v-if="
                    action.description ||
                    action.parameters.length ||
                    action.requirements.functions.length ||
                    action.effects.length
                  "
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
                <div v-if="action.parameters.length" class="parameters">
                  <h5>Parameters</h5>
                  <div
                    v-for="field in action.parameters"
                    :key="`${action.key}-${field.key}`"
                    class="parameter-field"
                  >
                    <label :for="`${action.key}-${field.key}`">
                      {{ field.label }}
                      <span v-if="field.unit" class="field-unit">({{ field.unit }})</span>
                      <span v-if="field.required" class="field-required" aria-hidden="true">*</span>
                    </label>
                    <select
                      v-if="
                        field.type === 'select' ||
                        (field.type === 'entity' && getFieldOptions(field).length)
                      "
                      :id="`${action.key}-${field.key}`"
                      :value="formatParameterInputValue(action.key, field)"
                      @change="onParameterInput(action.key, field, $event.target.value)"
                      @blur="onParameterBlur(action.key, field)"
                    >
                      <option value="">
                        {{ field.required ? 'Select an option' : 'Optional' }}
                      </option>
                      <option
                        v-for="option in getFieldOptions(field)"
                        :key="`${action.key}-${field.key}-${option.value}`"
                        :value="option.value"
                      >
                        {{ option.label }}
                      </option>
                    </select>
                    <input
                      v-else-if="field.type === 'number'"
                      type="number"
                      :id="`${action.key}-${field.key}`"
                      :min="field.min"
                      :max="field.max"
                      :step="field.step ?? 'any'"
                      :placeholder="field.placeholder || ''"
                      :value="formatParameterInputValue(action.key, field)"
                      @input="onParameterInput(action.key, field, $event.target.value)"
                      @blur="onParameterBlur(action.key, field)"
                    />
                    <input
                      v-else
                      type="text"
                      :id="`${action.key}-${field.key}`"
                      :placeholder="field.placeholder || ''"
                      :value="formatParameterInputValue(action.key, field)"
                      @input="onParameterInput(action.key, field, $event.target.value)"
                      @blur="onParameterBlur(action.key, field)"
                    />
                    <p v-if="shouldShowParameterError(action.key, field)" class="field-error">
                      {{ getParameterError(action.key, field) }}
                    </p>
                    <p v-if="field.helperText" class="field-helper">{{ field.helperText }}</p>
                  </div>
                </div>
                <p v-else class="parameters-empty">No parameters required.</p>
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
                <div v-if="action.requirements.functions.length" class="requirements">
                  <h5>Required Functions</h5>
                  <div
                    v-for="fn in action.requirements.functions"
                    :key="fn.id"
                    class="requirement-item"
                  >
                    <strong>{{ fn.label }}</strong>
                    <div v-if="fn.params.length" class="requirement-params">
                      <span class="requirements-label">Params:</span>
                      <span
                        v-for="param in fn.params"
                        :key="`${fn.id}-${param.key}`"
                        class="requirement-param"
                      >
                        {{ param.label }}
                        <span v-if="param.required" class="field-required" aria-hidden="true"
                          >*</span
                        >
                        <span
                          v-if="param.type && param.type !== 'unknown'"
                          class="requirement-param-type"
                        >
                          ({{ formatTitle(param.type) }})
                        </span>
                      </span>
                    </div>
                  </div>
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

.parameters {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.parameters-empty {
  margin: 0;
  opacity: 0.7;
}

.parameter-field {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.parameter-field label {
  font-weight: 600;
  font-size: 0.85rem;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.parameter-field input,
.parameter-field select {
  padding: 6px 8px;
  border-radius: 6px;
  border: 1px solid var(--color-border);
  background: color-mix(in srgb, var(--color-background) 25%, transparent);
}

.field-error {
  color: var(--color-error, #b00020);
  margin: 0;
  font-size: 0.8rem;
}

.field-helper {
  margin: 0;
  font-size: 0.8rem;
  opacity: 0.75;
}

.field-unit {
  font-size: 0.75rem;
  font-weight: 400;
  opacity: 0.75;
}

.field-required {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-error, #b00020);
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

.requirements {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.requirements h5 {
  margin: 0 0 4px;
  font-size: 0.875rem;
}

.requirements-label {
  font-weight: 600;
  margin-right: 4px;
}

.requirement-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.requirement-params {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  font-size: 0.85rem;
}

.requirement-param {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.requirement-param-type {
  opacity: 0.7;
}

.requirements-empty {
  opacity: 0.7;
  margin: 0;
}

.hint {
  opacity: 0.8;
}
</style>
