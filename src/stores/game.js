import {defineStore} from 'pinia'
import {computed, ref, watch} from 'vue'

export const gameStore = defineStore('gameStore', () => {
    const log = ref([]);
    const currentEvents = ref({
        weather: [],
        market: [],
        biologic: []
    })
    const stageChangeCalendar = [];
    const startDate = ref(new Date().toISOString().slice(0, 10))
    const currentTurn = ref(0)
    const currentDate = computed(() => {
        const d = new Date(startDate.value);
        d.setDate(d.getDate() + (currentTurn.value - 1));
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
       currentTurn,
        currentDate,
        currentSeason,
        userName,
        userAvatar,
        difficulty,
        bioromizationStage,
        bioromizationStages,
        turnPhase,
        engines,
        currentEvents,
        stageChangeCalendar
    }
})
