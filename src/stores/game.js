import { defineStore } from 'pinia'
import {ref, watch} from 'vue'

export const gameStore = defineStore('gameStore', () => {
    const startDate = ref(new Date().toISOString().slice(0, 10))
    const currentDay = ref(0)

    const bioromizationStage = ref(0)
    const bioromizationStages = ref(['discovery', 'design', 'deployment'])

    //turnPhase set to 3 to allow for first turn to start from phase 1
    const turnPhase = ref (-1)
    const engines = ref (['analytics', 'optimizations', 'operations'])

    const userName = ref('')
    const userAvatar = ref('')

    const difficulty = ref(1)


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
