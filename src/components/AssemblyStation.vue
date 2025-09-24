<script setup>
import { computed, reactive, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import eventBus from '@/eventBus.js';
import { moduleTypes } from '@/dict/moduleModels.js';
import { actionRequirements } from '@/dict/actionRequirements.js';
import { gameStore } from '@/stores/game.js';

const numberFormatter = new Intl.NumberFormat('en-US');

const game = gameStore();
const { money, ownedModules } = storeToRefs(game);

if (!ownedModules.value) {
  ownedModules.value = { station: [], assemblies: [] };
}

const moduleCards = computed(() =>
  moduleTypes.map(module => {
    const functionEntries = Object.entries(module.exposedFunctions || {});
    return {
      ...module,
      exposedFunctionEntries: functionEntries.map(([functionKey, details]) => ({
        key: functionKey,
        params: details?.params ?? {},
        caps: details?.caps ?? {}
      })),
      exposedFunctionKeys: functionEntries.map(([functionKey]) => functionKey)
    };
  })
);

const currentAssembly = ref([])

const stationInventory = computed(() => ownedModules.value?.station ?? [])
const assemblyInventory = computed(() => ownedModules.value?.assemblies ?? [])

function buildCountMap(list = []) {
  return list.reduce((acc, key) => {
    acc[key] = (acc[key] || 0) + 1
    return acc
  }, {})
}

const stationModuleCounts = computed(() => buildCountMap(stationInventory.value))
const ownedModuleCounts = computed(() =>
  buildCountMap([
    ...stationInventory.value,
    ...assemblyInventory.value
  ])
)

const currentAssemblySummary = computed(() => {
  const summary = new Map()
  currentAssembly.value.forEach(module => {
    const existing = summary.get(module.key)
    if (existing) {
      existing.count += 1
    } else {
      summary.set(module.key, { module, count: 1 })
    }
  })
  return Array.from(summary.values())
})

const formattedmoney = computed(() => numberFormatter.format(money.value ?? 0))

const DEFAULT_ACTION_CATEGORY = 'General';

const actionGroups = computed(() => {
  const groups = new Map();

  Object.entries(actionRequirements || {}).forEach(([actionKey, definition = {}]) => {
    const categories = Array.isArray(definition.categories) && definition.categories.length
      ? definition.categories
      : [DEFAULT_ACTION_CATEGORY];

    const actionEntry = {
      key: actionKey,
      name: definition.displayName || formatTitle(actionKey),
      description: definition.description || '',
      requires: Array.isArray(definition.requires) ? definition.requires : []
    };

    categories.forEach(category => {
      const groupKey = category || DEFAULT_ACTION_CATEGORY;
      if (!groups.has(groupKey)) {
        groups.set(groupKey, { target: groupKey, actions: [] });
      }
      groups.get(groupKey).actions.push(actionEntry);
    });
  });

  return Array.from(groups.values())
    .map(group => ({
      target: group.target,
      actions: group.actions
        .slice()
        .sort((a, b) => a.name.localeCompare(b.name))
    }))
    .sort((a, b) => a.target.localeCompare(b.target));
});

const selectedModuleKey = ref('');
const selectedActionKey = ref('');
const expandedActions = reactive({});
const hasInitializedActionSelection = ref(false);

const flatActions = computed(() =>
  actionGroups.value.flatMap(group =>
    group.actions.map(action => ({
      key: action.key,
      action,
      title: action.name,
      target: group.target,
      targetTitle: formatTitle(group.target || DEFAULT_ACTION_CATEGORY)
    }))
  )
);

const selectedAction = computed(() =>
  flatActions.value.find(entry => entry.key === selectedActionKey.value) || null
);

const selectedActionRequirements = computed(() => selectedAction.value?.action?.requires ?? []);

const filteredModuleCards = computed(() => {
  const requirements = selectedActionRequirements.value;

  return moduleCards.value
    .map(module => {
      const matchingFunctions = module.exposedFunctionKeys.filter(functionKey => requirements.includes(functionKey));
      return {
        ...module,
        matchingFunctions
      };
    })
    .filter(module => !requirements.length || module.matchingFunctions.length);
});

const selectedActionLabel = computed(() => {
  const entry = selectedAction.value;
  if (!entry) return 'None selected';
  const parts = [
    `Category (${entry.targetTitle})`,
    `Action (${entry.title || entry.action.key})`
  ];
  return parts.join(' - ');
});

const isActionFilterActive = computed(() => !!selectedActionKey.value);

watch(
  filteredModuleCards,
  cards => {
    if (!cards.length) {
      selectedModuleKey.value = '';
      return;
    }

    if (!cards.some(module => module.key === selectedModuleKey.value)) {
      selectedModuleKey.value = cards[0].key;
    }
  },
  { immediate: true }
);

watch(
  flatActions,
  actions => {
    if (actions.length && !hasInitializedActionSelection.value) {
      selectedActionKey.value = actions[0].key;
      hasInitializedActionSelection.value = true;
    }
  },
  { immediate: true }
);

function selectAction(actionKey) {
  selectedActionKey.value = actionKey;
  hasInitializedActionSelection.value = true;
}

function toggleActionExpansion(actionKey) {
  selectAction(actionKey);
  expandedActions[actionKey] = !expandedActions[actionKey];
}

function isActionExpanded(actionKey) {
  return !!expandedActions[actionKey];
}

const totalActionCount = computed(() => Object.keys(actionRequirements || {}).length);

function selectModule(moduleKey) {
  selectedModuleKey.value = moduleKey;
}

function clearActionSelection() {
  selectedActionKey.value = '';
  hasInitializedActionSelection.value = true;
}

function stationCountFor(moduleKey) {
  return stationModuleCounts.value[moduleKey] ?? 0;
}

function ownedCountFor(moduleKey) {
  return ownedModuleCounts.value[moduleKey] ?? 0;
}

function canBuyModule(module) {
  const cost = Number(module.cost ?? 0);
  if (!Number.isFinite(cost)) {
    return false;
  }
  return cost <= (money.value ?? 0);
}

function buyModule(module) {
  const cost = Number(module.cost ?? 0);
  if (!Number.isFinite(cost)) {
    return;
  }
  if (cost > (money.value ?? 0)) {
    return;
  }

  if (cost > 0) {
    money.value -= cost;
  }

  if (!ownedModules.value) {
    ownedModules.value = { station: [], assemblies: [] };
  }

  if (!Array.isArray(ownedModules.value.station)) {
    ownedModules.value.station = [];
  }

  ownedModules.value.station.push(module.key);
}

function canAddToAssembly(module) {
  return stationCountFor(module.key) > 0;
}

function addModuleToAssembly(module) {
  if (!ownedModules.value) {
    return;
  }

  const stationList = ownedModules.value.station;
  const assemblyList = ownedModules.value.assemblies;

  if (!Array.isArray(stationList) || !Array.isArray(assemblyList)) {
    return;
  }

  const stationIndex = stationList.findIndex(key => key === module.key);
  if (stationIndex === -1) {
    return;
  }

  const [key] = stationList.splice(stationIndex, 1);
  assemblyList.push(key);

  currentAssembly.value.push(module);
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
  return base.replace(/\b\w/g, letter => letter.toUpperCase());
}

function formatObject(value) {
  if (!value || (typeof value === 'object' && !Object.keys(value).length)) {
    return 'None';
  }
  return JSON.stringify(value, (_key, val) => {
    if (val === Number) {
      return 'Number';
    }
    if (typeof val === 'function') {
      return val.name || 'Function';
    }
    return val;
  }, 2);
}
</script>

<template>
  <div class="assembly-station">
    <header class="station-header">
      <div class="resource-banner">
        <span>Money available</span>
        <strong>{{ formattedmoney }}</strong>
      </div>
        <h1 class="station-title">Assembly Station</h1>
        <button class="nav-btn" @click="eventBus.emit('nav', 'map')">Back to map</button>
    </header>

    <section class="action-menu">
      <div class="section-title">
        <h2>Action Requirements</h2>
        <span class="section-count">{{ totalActionCount }} actions across {{ actionGroups.length }} targets</span>
      </div>
      <div class="action-scroll">
        <article v-for="group in actionGroups" :key="group.target" class="card action-card">
          <header class="card-header">
            <div>
              <h3>{{ formatTitle(group.target) }}</h3>
              <p class="card-subtitle">{{ group.actions.length }} actions</p>
            </div>
          </header>

          <div class="actions-stack">
            <div
              v-for="action in group.actions"
              :key="action.key"
              :class="['action-entry', { selected: selectedActionKey === action.key }]"
              @click="selectAction(action.key)"
              @keydown.enter.prevent="selectAction(action.key)"
              @keydown.space.prevent="selectAction(action.key)"
              tabindex="0"
              role="button"
            >
              <div class="action-entry-header">
                <div class="action-header-main">
                  <h4>{{ action.name }}</h4>
                  <p v-if="action.description" class="action-description">{{ action.description }}</p>
                  <span class="action-meta">{{ action.requires.length }} required functions</span>
                </div>
                <button
                  type="button"
                  class="toggle-requirements"
                  v-if="action.requires.length"
                  @click.stop="toggleActionExpansion(action.key)"
                >
                  {{ isActionExpanded(action.key) ? 'Hide required functions' : 'Show required functions' }}
                </button>
              </div>
              <template v-if="isActionExpanded(action.key)">
                <ul class="requirements-list" v-if="action.requires.length">
                  <li v-for="requirement in action.requires" :key="requirement" class="requirement">
                    <div class="requirement-head">
                      <span class="req-type">{{ requirement }}</span>
                    </div>
                  </li>
                </ul>
                <p v-else class="requirements-empty">No required functions listed.</p>
              </template>
            </div>
          </div>
        </article>
      </div>
    </section>

    <aside class="module-sidebar">
      <div class="section-title">
        <h2>Module Catalog</h2>
      </div>
      <div v-if="isActionFilterActive" >
        <button type="button" class="filter-clear" @click="clearActionSelection">
          Remove action filter (<span class="section-count">{{ filteredModuleCards.length }} modules</span>)
        </button>

      </div>
      <div class="module-scroll">
        <p v-if="!filteredModuleCards.length" class="requirements-empty">No modules match the selected action.</p>
        <article
          v-for="module in filteredModuleCards"
          :key="module.key"
          :class="['card module-card', { selected: selectedModuleKey === module.key }]"
          @click="selectModule(module.key)"
          @keydown.enter.prevent="selectModule(module.key)"
          @keydown.space.prevent="selectModule(module.key)"
          role="button"
          tabindex="0"
        >
          <header class="card-header">
            <div>
              <h3>{{ module.name }}</h3>
              <p class="card-subtitle">
                {{ module.type }}
                <span v-if="module.subtype"> · {{ module.subtype }}</span>
              </p>
            </div>
            <span class="card-key">{{ module.key }}</span>
          </header>

          <div class="module-inventory">
            <span>Owned: {{ ownedCountFor(module.key) }}</span>
            <span>Available: {{ stationCountFor(module.key) }}</span>
          </div>

          <div v-if="module.matchingFunctions && module.matchingFunctions.length" class="module-matches">
            <span class="match-label">Matches</span>
            <span class="match-values">{{ module.matchingFunctions.map(formatTitle).join(', ') }}</span>
          </div>

          <dl class="module-stats">
            <div class="stat-row">
              <dt>Mass</dt>
              <dd>{{ module.mass }} kg</dd>
            </div>
            <div class="stat-row">
              <dt>Volume</dt>
              <dd>{{ module.volume }}</dd>
            </div>
            <div class="stat-row">
              <dt>Cost</dt>
              <dd>{{ module.cost }}</dd>
            </div>
            <div class="stat-row">
              <dt>Electricity</dt>
              <dd>{{ module.electricity }}</dd>
            </div>
            <div class="stat-row">
              <dt>Capacity</dt>
              <dd>{{ module.capacity }}</dd>
            </div>
            <div class="stat-row">
              <dt>Slots</dt>
              <dd>{{ module.slots }}</dd>
            </div>
            <div class="stat-row">
              <dt>Parent Slots Used</dt>
              <dd>{{ module.parentSlotsUsed }}</dd>
            </div>
          </dl>

          <section v-if="module.exposedFunctionEntries.length" class="card-section">
            <h4>Exposed Functions</h4>
            <div v-for="fn in module.exposedFunctionEntries" :key="fn.key" class="function-entry">
              <div class="function-title">{{ fn.key }}</div>
              <div class="code-block">
                <span class="code-label">Params</span>
                <pre>{{ formatObject(fn.params) }}</pre>
              </div>
              <div class="code-block">
                <span class="code-label">Caps</span>
                <pre>{{ formatObject(fn.caps) }}</pre>
              </div>
            </div>
          </section>

          <div class="module-actions">
            <button
              type="button"
              class="module-btn"
              @click.stop.prevent="buyModule(module)"
              :disabled="!canBuyModule(module)"
            >
              Buy
            </button>
            <button
              type="button"
              class="module-btn"
              @click.stop.prevent="addModuleToAssembly(module)"
              :disabled="!canAddToAssembly(module)"
            >
              Add to assembly
            </button>
          </div>
        </article>
      </div>
    </aside>

    <section class="assembly-area">
      <div class="section-title">
        <h2>Assembly Workspace</h2>
        <span class="section-count">{{ currentAssembly.length }} modules</span>
      </div>
      <div class="assembly-board">
        <p v-if="!currentAssembly.length" class="assembly-empty">
          No modules in the current assembly yet. Buy and add modules from the catalog to get started.
        </p>
        <div v-else class="assembly-grid">
          <article v-for="entry in currentAssemblySummary" :key="entry.module.key" class="card assembly-card">
            <header class="card-header">
              <div>
                <h3>{{ entry.module.name }}</h3>
                <p class="card-subtitle">
                  {{ entry.module.type }}
                  <span v-if="entry.module.subtype"> · {{ entry.module.subtype }}</span>
                </p>
              </div>
              <span class="assembly-count">×{{ entry.count }}</span>
            </header>

            <dl class="module-stats compact">
              <div class="stat-row">
                <dt>Mass</dt>
                <dd>{{ entry.module.mass }} kg</dd>
              </div>
              <div class="stat-row">
                <dt>Volume</dt>
                <dd>{{ entry.module.volume }}</dd>
              </div>
              <div class="stat-row">
                <dt>Electricity</dt>
                <dd>{{ entry.module.electricity }}</dd>
              </div>
              <div class="stat-row">
                <dt>Slots</dt>
                <dd>{{ entry.module.slots }}</dd>
              </div>
            </dl>
          </article>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>

.assembly-station {
  display: grid;
  grid-template-columns: minmax(280px, 340px) 1fr;
  grid-template-rows: auto auto 1fr;
  grid-template-areas:
    'header header'
    'catalog actions'
    'catalog assembly';
  gap: 1.5rem;
padding: 1.5rem;
  height: 100%;
  box-sizing: border-box;
  color: var(--color-text);

}

.station-header {
  grid-area: header;
  display: flex;
  flex-direction: row;
  gap: 1rem;
  align-items: center;
  justify-content: space-between;
  justify-self: center;
width: 100%;

  margin:0;

}



.station-title {
  margin: 0;
  font-size: clamp(1.75rem, 2vw + 1rem, 2.4rem);
  flex: 0 0 auto;
}

.station-top-row .resource-banner {
  flex: 0 0 auto;
}

.station-top-row .nav-btn {
  flex: 0 0 auto;
}

.nav-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--color-accent);
  color: var(--color-surface);
  border: none;
  border-radius: var(--radius);
  padding: 0.5rem 1rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: var(--shadow-action-button);
  transition: transform 120ms ease, filter 120ms ease;
}

.nav-btn:hover {
  filter: brightness(1.05);
  transform: translateY(-1px);
}

.nav-btn:active {
  transform: translateY(0);
}

.section-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.section-title h2 {
  margin: 0;
}

.section-count {
  font-size: 0.875rem;
  font-weight: 600;
  opacity: 0.7;
}

.card {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: 1rem;
  box-shadow: var(--shadow-surface);
}

.module-sidebar {
  grid-area: catalog;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-height: 0;
}

.resource-banner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  padding: 0.6rem 0.75rem;
  border-radius: calc(var(--radius) / 1.1);
  border: 1px solid color-mix(in srgb, var(--color-border) 80%, transparent);
  background: color-mix(in srgb, var(--color-highlight) 10%, var(--color-surface));
  font-weight: 600;
  box-shadow: var(--shadow-surface);
}

.action-menu {
  grid-area: actions;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-width: 0;
}

.action-scroll {
  display: flex;
  flex-direction: row;
  gap: 1rem;
  overflow-x: auto;
  width: 100%;
  max-width: 100%;
  min-width: 0;
  padding-bottom: 0.5rem;
  padding-right: 0.25rem;
  scroll-snap-type: x proximity;
}

.filter-banner {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 0.75rem 0.85rem;
  border: 1px solid color-mix(in srgb, var(--color-border) 80%, transparent);
  border-radius: calc(var(--radius) / 1.1);
  background: color-mix(in srgb, var(--color-accent) 12%, var(--color-surface));
  box-shadow: var(--shadow-surface);
}

.filter-clear {
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  color: inherit;
  border-radius: calc(var(--radius) / 1.5);
  padding: 0.35rem 0.7rem;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 120ms ease, border-color 120ms ease;
  margin: 0 1rem;
}

.filter-clear:hover {
  background: color-mix(in srgb, var(--color-border) 25%, transparent);
}

.filter-clear:focus-visible {
  outline: 2px solid var(--color-highlight);
  outline-offset: 2px;
}

.module-scroll {
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
  padding-right: 0.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.module-card {
  flex: 0 0 auto;
  cursor: pointer;
  transition: border-color 120ms ease, box-shadow 120ms ease, background 120ms ease;
  border-color: color-mix(in srgb, var(--color-border) 85%, transparent);
}

.module-card.selected {
  border-color: var(--color-highlight);
  background: color-mix(in srgb, var(--color-highlight) 15%, var(--color-surface));
  box-shadow: 0 0 0 1px color-mix(in srgb, var(--color-highlight) 50%, transparent) inset, var(--shadow-surface);
}

.module-card:focus-visible {
  outline: 2px solid var(--color-highlight);
  outline-offset: 2px;
}

.assembly-area {
  grid-area: assembly;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-height: 0;
}

.assembly-board {
  flex: 1 1 auto;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.assembly-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1rem;
  row-gap: 1.25rem;
  align-content: start;
  overflow-y: auto;
  padding-right: 0.25rem;
  flex: 1 1 auto;
  min-height: 0;
}

.assembly-card {
  gap: 0.75rem;
}

.assembly-count {
  font-size: 1.15rem;
  font-weight: 700;
  background: color-mix(in srgb, var(--metrics-selected-bg, rgba(37, 99, 235, 0.16)) 40%, transparent);
  color: var(--color-text);
  padding: 0.3rem 0.6rem;
  border-radius: calc(var(--radius) / 1.2);
  align-self: flex-start;
}

.assembly-empty {
  margin: 0;
  font-size: 0.95rem;
  font-style: italic;
  opacity: 0.75;
}

.action-card {
  flex: 0 0 auto;
  width: max-content;
  padding: 0.75rem;
  gap: 0.65rem;
}

.actions-stack {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  gap: 0.75rem;
  padding-bottom: 0.35rem;
}

.action-entry {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  padding: 0.5rem 0.55rem;
  border-radius: calc(var(--radius) / 1.5);
  background: color-mix(in srgb, var(--metrics-delta-bg, rgba(148, 163, 184, 0.12)) 35%, transparent);
  border: 1px solid transparent;
  cursor: pointer;
  transition: border-color 120ms ease, background 120ms ease;
  flex: 0 0 auto;
  min-width: 220px;
}

.action-entry.selected {
  border-color: var(--color-highlight);
  background: color-mix(in srgb, var(--metrics-delta-bg, rgba(148, 163, 184, 0.18)) 55%, var(--color-surface) 45%);
}

.action-entry:focus-visible {
  outline: 2px solid var(--color-highlight);
  outline-offset: 2px;
}

.action-entry-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}

.action-header-main {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.action-entry-header h4 {
  margin: 0;
}

.action-meta {
  font-size: 0.8rem;
  font-weight: 600;
  opacity: 0.65;
  white-space: nowrap;
}

.toggle-requirements {
  border: 1px solid var(--color-border);
  background: transparent;
  color: var(--color-text);
  border-radius: calc(var(--radius) / 1.5);
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 0.3rem 0.65rem;
  cursor: pointer;
  transition: background 120ms ease, border-color 120ms ease;
}

.toggle-requirements:hover {
  background: color-mix(in srgb, var(--color-border) 25%, transparent);
}

.toggle-requirements:focus-visible {
  outline: 2px solid var(--color-highlight);
  outline-offset: 2px;
}

.requirements-empty {
  margin: 0;
  font-size: 0.85rem;
  font-style: italic;
  opacity: 0.7;
}

.card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.75rem;
}

.card-header h3 {
  margin: 0;
}

.card-subtitle {
  margin: 0;
  font-size: 0.875rem;
  opacity: 0.7;
}

.card-key {
  font-size: 0.75rem;
  font-weight: 600;
  background: var(--metrics-delta-bg, rgba(148, 163, 184, 0.12));
  color: var(--color-text);
  padding: 0.25rem 0.5rem;
  border-radius: calc(var(--radius) / 1.5);
  white-space: nowrap;
}

.module-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 0.75rem;
  margin: 0;
}

.module-stats.compact {
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
}

.module-inventory {
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
  font-weight: 600;
  font-size: 0.85rem;
  flex-wrap: wrap;
}

.module-matches {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  flex-wrap: wrap;
  font-size: 0.8rem;
  font-weight: 600;
  color: inherit;
  background: color-mix(in srgb, var(--metrics-selected-bg, rgba(37, 99, 235, 0.16)) 45%, transparent);
  border-radius: calc(var(--radius) / 1.4);
  padding: 0.35rem 0.5rem;
}

.match-label {
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-size: 0.72rem;
  opacity: 0.7;
}

.match-values {
  font-size: 0.8rem;
}

.module-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.75rem;
}

.module-btn {
  flex: 1 1 auto;
  border: 1px solid var(--color-border);
  border-radius: calc(var(--radius) / 1.3);
  padding: 0.45rem 0.6rem;
  font-weight: 600;
  font-size: 0.85rem;
  background: var(--color-surface);
  color: inherit;
  cursor: pointer;
  transition: background 120ms ease, border-color 120ms ease, transform 120ms ease;
}

.module-btn:hover:not(:disabled) {
  background: color-mix(in srgb, var(--color-border) 20%, transparent);
  transform: translateY(-1px);
}

.module-btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.module-btn:focus-visible {
  outline: 2px solid var(--color-highlight);
  outline-offset: 2px;
}

.stat-row {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.stat-row dt {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  opacity: 0.65;
  margin: 0;
}

.stat-row dd {
  margin: 0;
  font-weight: 600;
}

.card-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.card-section h4 {
  margin: 0;
}

.function-entry {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  padding: 0.5rem;
  border-radius: calc(var(--radius) / 1.5);
  background: color-mix(in srgb, var(--metrics-delta-bg, rgba(148, 163, 184, 0.12)) 60%, transparent);
}

.function-title {
  font-weight: 600;
}

.code-block {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.code-label {
  font-size: 0.75rem;
  font-weight: 600;
  opacity: 0.65;
  text-transform: uppercase;
}

.code-block pre {
  margin: 0;
  font-family: 'Source Code Pro', monospace;
  font-size: 0.75rem;
  background: color-mix(in srgb, var(--color-border) 40%, transparent);
  border-radius: calc(var(--radius) / 2);
  padding: 0.5rem;
  white-space: pre-wrap;
}

.requirements-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.requirement {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0.4rem;
  border-radius: calc(var(--radius) / 1.5);
  background: color-mix(in srgb, var(--metrics-selected-bg, rgba(37, 99, 235, 0.12)) 40%, transparent);
}

.requirement-head {
  display: flex;
  gap: 0.5rem;
  font-weight: 600;
  align-items: baseline;
}

.req-subtype {
  opacity: 0.7;
}

.requirement-detail {
  display: flex;
  gap: 0.3rem;
  font-size: 0.82rem;
  align-items: baseline;
}

.detail-key {
  font-weight: 600;
  opacity: 0.75;
}

.detail-value {
  word-break: break-word;
}



</style>
