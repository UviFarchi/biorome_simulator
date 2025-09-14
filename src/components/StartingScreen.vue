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
  <div>
    <h1>Biorome - The Game</h1>
    <h2>Agrobots' LandOS Simulator</h2>
  <form @submit.prevent="startGame" class="start-form" v-if="!resuming && !terrainGeneration">
    <div>
      <label for="userName" class="text-bold">Your Name:</label>
      <input id="userName" type="text" v-model="name" autocomplete="off" autofocus/>
    </div>

    <div>
      <label for="userAvatar" class="text-bold">Choose Your Avatar:</label>
      <select id="userAvatar" v-model="avatar">
        <option v-for="option in avatarOptions" :key="option.emoji" :value="option.emoji" :title="option.label">
          {{ option.emoji }}
        </option>
      </select>
    </div>

    <div>
      <label class="text-bold">Difficulty:</label>
      <div class="difficulty-options">
        <label v-for="option in difficultyOptions" :key="option.value" class="text-bold">
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
    <button type="submit" class="btn btn--start start-btn" :disabled="!name">Start</button>
  </form>
  <div v-if="resuming" class="terrain-overlay">Loading save…</div>
  <div v-else-if="terrainGeneration" class="terrain-overlay">Generating terrain…</div>
  </div>
</template>

<style scoped>
.start-form {
  max-width: 300px;
  margin: 2rem auto;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.difficulty-options {
  display: flex;
  gap: 1.2rem;
}

.start-btn {
  margin-top: 1rem;
  font-size: 1.1em;
  padding: 0.5em 1.2em;
}

.start-btn:disabled {
  cursor: not-allowed;
}

h1 ,h2 {text-align: center;}
</style>
