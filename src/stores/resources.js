import { defineStore } from 'pinia'
import { ref } from 'vue'
import {gameStore} from '@/stores/game.js';

export const resourceStore = defineStore('resourceStore', () => {
const game =gameStore()
    const electricity = ref(0)
    const water = ref(0)
    const waste = ref(0)
    const gold = ref(30000/game.difficulty)



    return {
        electricity,
        water,
        waste,
        gold
    }
})
