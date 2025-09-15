import './assets/main.css'
import { createApp } from 'vue'
import {createPinia} from 'pinia'
import App from './App.vue'
import { gameStore } from './stores/game.js'


const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
gameStore()
app.mount('#app')
