<script setup>
import eventBus from '@/eventBus.js'
import { gameStore } from '@/stores/game.js'
import generateTerrain from '@/calc/generateTerrain.js'
import { loadAllStores, saveAllStores } from '@/utils.js'
import { ref, onMounted } from 'vue'

const game = gameStore()

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

const terrainLoading = ref(false);

onMounted(() => {
  // resume path
  Promise.resolve().then(() => {
    if (loadAllStores()) {
      eventBus.emit('nav', 'map')
    }
  })
})


function startGame () {
  game.userName   = name.value?.trim() || ''
  game.userAvatar = avatar.value?.trim() || ''
  game.difficulty = [1,2,3].includes(+difficulty.value) ? +difficulty.value : 1

  // new game bootstrap
  generateTerrain()      // builds map tiles using current game.difficulty
  saveAllStores()        // persist fresh state
  eventBus.emit('nav', 'map')
}
</script>


<template>
  <form @submit.prevent="startGame" class="start-form">
    <div>
      <label for="userName">Your Name:</label>
      <input id="userName" type="text" v-model="name" autocomplete="off"/>
    </div>

    <div>
      <label for="userAvatar">Choose Your Avatar:</label>
      <select id="userAvatar" v-model="avatar">
        <option v-for="option in avatarOptions" :key="option.emoji" :value="option.emoji" :title="option.label">
          {{ option.emoji }}
        </option>
      </select>
    </div>

    <div>
      <label>Difficulty:</label>
      <div class="difficulty-options">
        <label v-for="option in difficultyOptions" :key="option.value">
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
    <div v-if="terrainLoading" class="terrain-overlay">Generating terrain…</div>

    <button type="submit" class="btn start-btn" :disabled="!name">Start</button>
  </form>
</template>

<style scoped>
.start-form {
  max-width: 300px;
  margin: 2rem auto;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.start-form label {
  font-weight: bold;
}

.difficulty-options {
  display: flex;
  gap: 1.2rem;
}

.start-btn {
  margin-top: 1rem;
  font-size: 1.1em;
  padding: 0.5em 1.2em;
  background: #82c91e;
  color: #fff;
}

.start-btn:disabled {
  background: grey;
  cursor: not-allowed;
}

.start-btn:hover {
  background: #5c940d;
}
</style>
