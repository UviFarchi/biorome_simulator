import { defineStore } from 'pinia'
import {ref, watch} from 'vue'

export const gameStore = defineStore('gameStore', () => {
    const startDate = ref(new Date().toISOString().slice(0, 10))
    const currentDay = ref(0)

    const bioromizationStage = ref(0)
    const bioromizationStages = ref(["discovery", "design", "deployment"])

    //turnPhase set to 3 to allow for first turn to start from phase 1
    const turnPhase = ref (-1)
    const engines = ref (["analytics", "optimizations", "operations"])

    const userName = ref('')
    const userAvatar = ref('')

    const difficulty = ref(1)

    if (localStorage.getItem('bioromeUser')) {
        const data = JSON.parse(localStorage.getItem('bioromeUser'))
        userName.value = data.userName || ''
        userAvatar.value = data.userAvatar || ''
        difficulty.value = data.difficulty || 1
    }
    watch([userName, userAvatar, difficulty], () => {
        localStorage.setItem('bioromeUser', JSON.stringify({
            userName: userName.value,
            userAvatar: userAvatar.value,
            difficulty: difficulty.value
        }))
    })

    return {
        startDate,
       currentDay,
        userName,
        userAvatar,
        difficulty,
        bioromizationStage,
        bioromizationStages,
        turnPhase,
        engines
    }
})
