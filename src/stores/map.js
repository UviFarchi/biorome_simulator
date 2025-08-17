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
            Array.from({length: size.value}, (_, col) => (
                {
                    row: 0,
                    col: 0,

                    topo: {
                        elevation:              { env: 0,   measured: { value: undefined, date: undefined } },
                        slopeDeg:               { env: 0,   measured: { value: undefined, date: undefined } },
                        aspectDeg:              { env: 0,   measured: { value: undefined, date: undefined } },
                        waterTable:             { env: 0,   measured: { value: undefined, date: undefined } },
                        drainageIndex:          { env: 0,   measured: { value: undefined, date: undefined } }
                    },

                    soil: {
                        // CHEMISTRY (measurable)
                        ph:                     { env: 7.0, measured: { value: undefined, date: undefined } },
                        ec_dSm:                 { env: 0,   measured: { value: undefined, date: undefined } },
                        salinity_dSm:           { env: 0,   measured: { value: undefined, date: undefined } },
                        cec_cmolkg:             { env: 10,  measured: { value: undefined, date: undefined } },
                        organicCarbonPct:       { env: 2.0, measured: { value: undefined, date: undefined } },

                        nutrients: {
                            nitrateN_mgkg:        { env: 0,   measured: { value: undefined, date: undefined } },
                            ammoniumN_mgkg:       { env: 0,   measured: { value: undefined, date: undefined } },
                            phosphateP_mgkg:      { env: 0,   measured: { value: undefined, date: undefined } },
                            potassiumK_mgkg:      { env: 0,   measured: { value: undefined, date: undefined } },
                            dissolvedOrganicN_mgkg:{ env: 0,  measured: { value: undefined, date: undefined } }
                        },

                        heavyMetals_mgkg: {
                            Cd:                   { env: 0,   measured: { value: undefined, date: undefined } },
                            Pb:                   { env: 0,   measured: { value: undefined, date: undefined } },
                            As:                   { env: 0,   measured: { value: undefined, date: undefined } }
                        },

                        // PHYSICS (measurable)
                        water:                  { env: 0,   measured: { value: undefined, date: undefined } }, // single scalar
                        infiltrationRate_mmhr:  { env: 15,  measured: { value: undefined, date: undefined } },
                        bulkDensity_gcm3:       { env: 1.3, measured: { value: undefined, date: undefined } },
                        penetrationResistance_MPa:{ env: 0.5, measured: { value: undefined, date: undefined } },
                        aggregateStability_Pct: { env: 50,  measured: { value: undefined, date: undefined } },
                        hydraulicConductivity_mmhr:{ env: 10, measured: { value: undefined, date: undefined } },
                        soilTemperature_C:      { env: 15,  measured: { value: undefined, date: undefined } },

                        // BIOLOGY (measurable, not indices)
                        microbialCFU_good_perg: { env: 0,   measured: { value: undefined, date: undefined } },
                        microbialCFU_bad_perg:  { env: 0,   measured: { value: undefined, date: undefined } },
                        mycorrhizalColonization_Pct:{ env: 0, measured: { value: undefined, date: undefined } },
                        earthwormCount_perm2:   { env: 0,   measured: { value: undefined, date: undefined } }
                    },

                    plants: [],
                    animals: [],
                    assemblies: []
                }
            ))
        )
    )

    const gate = ref({animals: [], plants: [], extras: []})
    const selectedTile = ref({})

    return {tiles, gate, size, selectedTile, topographyConstraints}
})
