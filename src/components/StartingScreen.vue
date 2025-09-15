<script setup>
import {ref, onMounted, nextTick} from 'vue'
import eventBus from '@/eventBus.js'
import {gameStore} from '@/stores/game.js'
import generate from '@/engine/terrain/generate.js'
import {hasSavedState, loadAllStores, saveAllStores} from '@/utils/persistance.js'
import {mapStore} from '@/stores/map.js';

const game = gameStore()
const map = mapStore()
const terrainGeneration = ref(false)
const resuming = ref(false)

const name = ref('')
const avatarOptions = [
  {emoji: '😀', label: 'Smiling Face'},
  {emoji: '😎', label: 'Cool Face'},
  {emoji: '🤖', label: 'Robot'},
  {emoji: '👽', label: 'Alien'},
  {emoji: '🦊', label: 'Fox'},
  {emoji: '🐸', label: 'Frog'},
  {emoji: '🐵', label: 'Monkey'},
  {emoji: '🐙', label: 'Octopus'},
  {emoji: '🍕', label: 'Pizza'},
  {emoji: '🌵', label: 'Cactus'}
]
const avatar = ref(avatarOptions[0].emoji)
const difficultyOptions = [
  {value: 1, label: 'Easy'},
  {value: 2, label: 'Medium'},
  {value: 3, label: 'Hard'},
]
const difficulty = ref(1)


onMounted(async () => {
  if (hasSavedState()) {
    resuming.value = true            // show "Loading save…" immediately
    await nextTick()
    await new Promise(requestAnimationFrame) // let overlay paint
    // defer actual loading to next task so UI stays responsive
    setTimeout(() => {
      loadAllStores()
      eventBus.emit('nav', 'map')
    }, 0)
  }
})

async function startGame() {
  game.userName = (name.value || '').trim()
  game.userAvatar = (avatar.value || '').trim()
  const difficulty = game.difficulty;
  game.difficulty = [1, 2, 3].includes(+difficulty) ? +difficulty : 1;
  game.gold = game.gold / difficulty;
  map.size = map.size * difficulty;

  terrainGeneration.value = true
  await nextTick()
  await new Promise(requestAnimationFrame) // paint overlay before heavy work
  // run generator in the next macrotask so UI stays responsive
  await new Promise(resolve => setTimeout(() => {
    generate();
    resolve()
  }, 0))

  saveAllStores()
  terrainGeneration.value = false
  eventBus.emit('nav', 'map')
  await nextTick()
  eventBus.emit('phase', {})

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
        <input id="userName" type="text" v-model="name" autocomplete="off" autofocus placeholder="Enter your name"/>
      </div>


      <div class="form-field">
        <label for="userAvatar" class="text-bold">Profile marker</label>
        <select id="userAvatar" v-model="avatar">
          <option v-for="option in avatarOptions" :key="option.emoji" :value="option.emoji" :title="option.label">
            {{ option.label }} {{ option.emoji }}
          </option>
        </select>
      </div>

      <div class="form-field">
        <label class="text-bold" id="difficulty-label">Simulation fidelity</label>
        <div class="difficulty-options" role="radiogroup" aria-labelledby="difficulty-label">
          <label v-for="option in difficultyOptions" :key="option.value" class="difficulty-option">
            <input
                type="radio"
                name="difficulty"
                :value="option.value"
                v-model="difficulty"

            />
            {{ option.label }}
          </label>
        </div>
      </div>
      <button type="submit" class="btn btn--start start-btn" :disabled="!name">Enter console</button>
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
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
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

.difficulty-options {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.difficulty-option {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  font-weight: 500;
}

.difficulty-option input[type="radio"] {
  accent-color: var(--color-accent);
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
