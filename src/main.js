import './assets/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

const storedTheme = localStorage.getItem('theme') || 'dark'
document.documentElement.dataset.theme = storedTheme

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.mount('#app')

