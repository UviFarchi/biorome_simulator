<script setup>
import { ref, onMounted, nextTick, computed } from 'vue';
import eventBus from '@/eventBus.js';
import { gameStore } from '@/stores/game.js';
import generate from '@/engine/terrain/generate.js';
import { hasSavedState, loadAllStores, saveAllStores } from '@/utils/persistance.js';
import { mapStore } from '@/stores/map.js';

const game = gameStore();
const map = mapStore();

const TOTAL_AREA_HA = 100;

const terrainGeneration = ref(false);
const resuming = ref(false);

const name = ref('');
const avatarOptions = [
  { emoji: '😀', label: 'Smiling Face' },
  { emoji: '😎', label: 'Cool Face' },
  { emoji: '🤖', label: 'Robot' },
  { emoji: '👽', label: 'Alien' },
  { emoji: '🦊', label: 'Fox' },
  { emoji: '🐸', label: 'Frog' },
  { emoji: '🐵', label: 'Monkey' },
  { emoji: '🐙', label: 'Octopus' },
  { emoji: '🍕', label: 'Pizza' },
  { emoji: '🌵', label: 'Cactus' },
];
const avatar = ref(avatarOptions[0].emoji);

const resolutionOptions = [
  {
    size: 10,
    label: '10 × 10 grid',
    description: '1 ha tiles for the highest fidelity during discovery.',
  },
  {
    size: 5,
    label: '5 × 5 grid',
    description: '4 ha tiles that cover more area per action.',
  },
].map((option) => {
  const tileCount = option.size * option.size;
  const tileAreaHa = TOTAL_AREA_HA / tileCount;
  return { ...option, tileCount, tileAreaHa };
});
const allowedGridSizes = resolutionOptions.map((option) => option.size);

function resolveGridSize(candidate) {
  const numeric = Number(candidate);
  return allowedGridSizes.includes(numeric) ? numeric : allowedGridSizes[0];
}

const gridSize = ref(resolveGridSize(game.size));
const selectedResolution = computed(
  () => resolutionOptions.find((option) => option.size === gridSize.value) ?? resolutionOptions[0]
);
const totalTiles = computed(() => selectedResolution.value.tileCount);
const tileAreaHa = computed(() => selectedResolution.value.tileAreaHa);

onMounted(async () => {
  if (hasSavedState()) {
    resuming.value = true; // show "Loading save…" immediately
    await nextTick();
    await new Promise(requestAnimationFrame); // let overlay paint
    // defer actual loading to next task so UI stays responsive
    setTimeout(() => {
      loadAllStores();
      eventBus.emit('nav', 'map');
    }, 0);
  }
});

async function startGame() {
  game.userName = (name.value || '').trim();
  game.userAvatar = (avatar.value || '').trim();
  const selectedSize = resolveGridSize(gridSize.value);
  game.size = selectedSize;
  map.resetTiles(selectedSize);

  terrainGeneration.value = true;
  await nextTick();
  await new Promise(requestAnimationFrame); // paint overlay before heavy work
  // run generator in the next macrotask so UI stays responsive
  await new Promise((resolve) =>
    setTimeout(() => {
      generate();
      resolve();
    }, 1000)
  );

  saveAllStores();
  terrainGeneration.value = false;
  eventBus.emit('nav', 'map');
  await nextTick();
  game.phase = 2;
  eventBus.emit('phase', {});
}

function formatArea(value) {
  if (Number.isInteger(value)) return value.toString();
  return value.toFixed(2);
}
</script>

<template>
  <div class="starting-screen">
    <header class="starting-screen__header">
      <h1>Biorome Simulator</h1>
      <p class="starting-screen__subtitle">Operational Control Console</p>
    </header>

    <form @submit.prevent="startGame" class="start-form" v-if="!resuming && !terrainGeneration">
      <div class="form-field">
        <label for="userName" class="text-bold">Operator name</label>
        <input
          id="userName"
          type="text"
          v-model="name"
          autocomplete="off"
          autofocus
          placeholder="Enter your name"
        />
      </div>

      <div class="form-field">
        <label for="userAvatar" class="text-bold">Profile marker</label>
        <select id="userAvatar" v-model="avatar">
          <option
            v-for="option in avatarOptions"
            :key="option.emoji"
            :value="option.emoji"
            :title="option.label"
          >
            {{ option.label }} {{ option.emoji }}
          </option>
        </select>
      </div>

      <div class="form-field">
        <span class="text-bold">Map resolution</span>
        <p class="field-hint">
          The simulation always covers {{ TOTAL_AREA_HA }} ha. Choose tile resolution.
        </p>
        <div class="resolution-options">
          <label
            v-for="option in resolutionOptions"
            :key="option.size"
            class="resolution-card"
            :class="{ 'resolution-card--selected': option.size === gridSize }"
          >
            <input
              type="radio"
              name="gridResolution"
              :value="option.size"
              v-model.number="gridSize"
              :aria-label="option.label"
            />
            <div class="resolution-card__header">
              <span class="resolution-card__label">{{ option.label }}</span>
              <span class="resolution-card__tiles">{{ option.tileCount }} tiles</span>
            </div>
            <p class="resolution-card__meta">{{ formatArea(option.tileAreaHa) }} ha per tile</p>
            <p class="resolution-card__description">{{ option.description }}</p>
          </label>
        </div>
        <p class="resolution-summary">
          Selected grid: {{ totalTiles }} tiles · {{ formatArea(tileAreaHa) }} ha each ·
          {{ TOTAL_AREA_HA }} ha total.
        </p>
      </div>
      <button type="submit" class="btn btn--start start-btn" :disabled="!name">
        Enter console
      </button>
      <img src="../assets/small_drone_blue.gif" alt="small drone" />
    </form>
    <div v-if="resuming" class="terrain-overlay">Loading saved configuration…</div>
    <div v-else-if="terrainGeneration" class="terrain-overlay">Preparing operational map…</div>
  </div>
</template>

<style scoped>
.starting-screen {
  margin: 8vh auto;
  padding: 2.5rem 2.75rem;
  max-width: 480px;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  box-shadow: 0 18px 40px color-mix(in srgb, var(--color-shadow-neutral) 8%, transparent);
}

.starting-screen__header {
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.starting-screen__header h1 {
  margin: 0;
  font-size: 1.8rem;
  font-weight: 600;
  color: var(--color-text);
}

.starting-screen__subtitle {
  margin: 0;
  font-size: 1rem;
  color: color-mix(in srgb, var(--color-text) 70%, var(--color-background));
}

.start-form {
  display: flex;
  flex-direction: column;
  gap: 1.4rem;
  background: var(--color-surface);
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.field-hint {
  margin: 0;
  font-size: 0.85rem;
  color: color-mix(in srgb, var(--color-text) 60%, var(--color-background));
}

.start-form input,
.start-form select {
  width: 100%;
  padding: 0.6rem 0.75rem;
  border-radius: var(--radius);
  border: 1px solid var(--color-border);
  background: var(--color-background);
  color: var(--color-text);
  font-size: 0.95rem;
}

.size-options {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.size-option {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  font-weight: 500;
}

.size-option input[type='radio'] {
  accent-color: var(--color-accent);
}

.resolution-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 0.8rem;
}

.resolution-card {
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: 0.75rem 0.9rem;
  background: color-mix(in srgb, var(--color-background) 95%, transparent);
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  cursor: pointer;
  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease;
}

.resolution-card input[type='radio'] {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.resolution-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
}

.resolution-card__label {
  font-weight: 600;
}

.resolution-card__tiles {
  font-size: 0.85rem;
  color: color-mix(in srgb, var(--color-text) 65%, var(--color-background));
}

.resolution-card__meta {
  margin: 0;
  font-size: 0.9rem;
  font-weight: 500;
}

.resolution-card__description {
  margin: 0;
  font-size: 0.85rem;
  color: color-mix(in srgb, var(--color-text) 60%, var(--color-background));
}

.resolution-card--selected {
  border-color: color-mix(in srgb, var(--color-accent) 60%, var(--color-border));
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--color-accent) 30%, transparent);
}

.resolution-card:hover {
  border-color: color-mix(in srgb, var(--color-accent) 40%, var(--color-border));
}

.resolution-summary {
  margin: 0;
  font-size: 0.9rem;
  color: color-mix(in srgb, var(--color-text) 70%, var(--color-background));
}

.start-btn {
  align-self: flex-end;
  font-size: 1rem;
  padding: 0.65rem 1.6rem;
}

.terrain-overlay {
  text-align: center;
  padding: 1rem 1.2rem;
  background: color-mix(in srgb, var(--color-accent) 10%, var(--color-background));
  border-radius: var(--radius);
  border: 1px solid color-mix(in srgb, var(--color-border), var(--color-accent) 35%);
  color: color-mix(in srgb, var(--color-text) 85%, var(--color-background));
}

@media (max-width: 600px) {
  .starting-screen {
    margin: 4vh 1.5rem;
    padding: 2rem 1.5rem;
  }
}
</style>
