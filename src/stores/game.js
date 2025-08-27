import {defineStore} from 'pinia'
import {computed, ref, watch} from 'vue'

export const gameStore = defineStore('gameStore', () => {
    const gold = ref(300000)
    const log = ref([]);
    const currentEvents = ref({
        weather: [],
        market: [],
        ecosystem: []
    })
    const analyticsReport = ref({})
    const stationAssemblies = ref([
        {
            id: 'af97e85f-4696-4ff2-8f43-3b3e742b94c2',
            modules: [
                {type: 'transport', subtype: 'ground'},
                {type: 'arm', subtype: 'medium'},
                {type: 'tool', subtype: 'seeder'},
                {type: 'tool', subtype: 'borer'}
            ],
            name: 'Seed Planter',
            deployed: false,
            built: false,
            moves: 1,
            actions: 1,
            orders: []

        }
    ])
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
        gold,
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
        stageChangeCalendar,
        stationAssemblies,
        analyticsReport
    }
})
