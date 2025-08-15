import {defineStore} from 'pinia'
import {computed, ref} from 'vue'
import {gameStore} from '@/stores/game.js'

export const mapStore = defineStore('mapStore', () => {
    const gameState = gameStore()

    const size = computed(() => {
        console.log('difficulty', gameState.difficulty);
        return 6 * (gameState.difficulty);
    })
    const topographyConstraints = {
        elevationRange: [0, 220],
        neighborCap: 6,   // max Δelev meters between neighbors
        cellSize: 100
    }
    console.log('difficulty', gameState.difficulty, 'size:', size.value);
    const tiles = ref(
        Array.from({length: size.value}, (_, row) =>
            Array.from({length: size.value}, (_, col) => ({
                row,
                col,
                surveyed: false,

                // static terrain baseline; generator will fill .env later
                topo: {
                    elevation: {env: 0, measured: {value: undefined, date: undefined}},
                    slopeDeg: {env: 0, measured: {value: undefined, date: undefined}},
                    aspectDeg: {env: 0, measured: {value: undefined, date: undefined}},
                    waterTable: {env: 0, measured: {value: undefined, date: undefined}},
                    drainageIndex: {env: 0, measured: {value: undefined, date: undefined}}
                },

                // legacy soil kept, now measurement-shaped
                soil: {
                    health: {env: 100, measured: {value: undefined, date: undefined}},
                    water: {env: 0, measured: {value: undefined, date: undefined}},
                    fertility: {env: 0, measured: {value: undefined, date: undefined}},
                    nutrients: {
                        N: {env: 0, measured: {value: undefined, date: undefined}},
                        P: {env: 0, measured: {value: undefined, date: undefined}},
                        K: {env: 0, measured: {value: undefined, date: undefined}}
                    },
                    salinityDsM: {env: 0, measured: {value: undefined, date: undefined}},
                    recoveryRate: {env: 5, measured: {value: undefined, date: undefined}},
                    compaction: {env: 0, measured: {value: undefined, date: undefined}},
                    ph: {env: 7, measured: {value: undefined, date: undefined}},
                    ec: {env: 0, measured: {value: undefined, date: undefined}}
                },

                // dynamic environment
                atmosphere: {
                    moisturePct: {env: 0, measured: {value: undefined, date: undefined}},
                    tempC: {env: 0, measured: {value: undefined, date: undefined}},
                },

                plant: null,
                animal: null,
                pests: 0,
                weeds: 0,
                pollination: 0,
                defense: 0,
                assemblies: []
            }))
        )
    )

    const gate = ref({animals: [], plants: [], extras: []})
    const selectedTile = ref({})

    return {tiles, gate, size, selectedTile, topographyConstraints}
})
