import './assets/main.css'
import { createApp } from 'vue'
import {createPinia} from 'pinia'
import App from './App.vue'
import { gameStore } from './stores/game.js'


const app = createApp(App)
const pinia = createPinia()

app.use(pinia)

const game = gameStore()
const root = document.documentElement

function applyTheme(theme) {
  const normalized = typeof theme === 'string' ? theme.trim() : ''
  if (normalized) {
    root.dataset.theme = normalized
  } else {
    delete root.dataset.theme
  }
}

applyTheme(game.currentTheme)

game.$subscribe((_, state) => {
  applyTheme(state.currentTheme)
})

app.mount('#app')
