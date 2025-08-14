<script setup>
import eventBus from '@/eventBus.js'
import { gameStore } from '/src/stores/game.js'
import {nextTick, onMounted, ref} from 'vue'

const gameState = gameStore()
const name = ref('')
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
  { emoji: '🌵', label: 'Cactus' }
]
const avatar = ref(avatarOptions[0].emoji)

const difficultyOptions = [
  { value: 1, label: 'Easy' },
  { value: 2, label: 'Medium' },
  { value: 3, label: 'High' }
]
const difficulty = ref(1)



function startGame() {
  const payload = {
    userName: name.value?.trim(),
    userAvatar: avatar.value?.trim(),
    difficulty: [1, 2, 3].includes(+difficulty.value) ? +difficulty.value : 1
  }
  // write first so other stores read correct difficulty on first use
  localStorage.setItem('bioromeUser', JSON.stringify(payload))
  gameState.userName = payload.userName
  gameState.userAvatar = payload.userAvatar
  gameState.difficulty = payload.difficulty

  eventBus.emit('nav', 'map')
  eventBus.emit('log', {engine:"analytics", msg: "Game started"})
}

onMounted(
    ()=>{
      const userData = localStorage.getItem('bioromeUser');
      if(userData){
       nextTick(()=>{eventBus.emit('nav', 'map')})
      }

    }
)
</script>

<template>
  <form @submit.prevent="startGame" class="start-form">
    <div>
      <label for="userName">Your Name:</label>
      <input id="userName" type="text" v-model="name" autocomplete="off" />
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