import {defineStore} from 'pinia'
import {computed, ref, watch} from 'vue'

export const gameStore = defineStore('gameStore', () => {
    const log = ref([]);
    const events = ref({
        weather: [],
        market: [],
        biologic: []
    })
    const startDate = ref(new Date().toISOString().slice(0, 10))
    const currentDay = ref(0)
    const currentDate = computed(() => {
        const d = new Date(startDate.value);
        d.setDate(d.getDate() + (currentDay.value - 1));
        return d
    })
    const currentSeason = ref({label: 'Unknown', icon: ''})


    const bioromizationStage = ref(0)
    const bioromizationStages = ref(['discovery', 'design', 'deployment'])

    //turnPhase set to 3 to allow for first turn to start from phase 1
    const turnPhase = ref(-1)
    const engines = ref(['analytics', 'optimizations', 'operations'])

    const userName = ref('')
    const userAvatar = ref('')

    const difficulty = ref(1)


    return {
        log,
        startDate,
        currentDay,
        currentDate,
        currentSeason,
        userName,
        userAvatar,
        difficulty,
        bioromizationStage,
        bioromizationStages,
        turnPhase,
        engines,
        events
    }
})
