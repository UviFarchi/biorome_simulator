import './assets/main.css'
import { createApp } from 'vue'
import {createPinia} from 'pinia'
import App from './App.vue'
import {piniaReady} from "@/utils.js";

const app = createApp(App)
const pinia = createPinia()


app.use(pinia)
piniaReady.value = true
app.mount('#app')
