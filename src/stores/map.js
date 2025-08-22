import {defineStore} from 'pinia'
import {computed, ref} from 'vue'
import {gameStore} from '@/stores/game.js'

export const mapStore = defineStore('mapStore', () => {
    const gameState = gameStore()

    const size = computed(() => 6 * gameState.difficulty)

    const topographyConstraints = {
        elevationRange: [0, 220],
        neighborCap: 6,
        cellSize: 100
    }

    const tiles = ref(
        Array.from({length: size.value}, (_, row) =>
                Array.from({length: size.value}, (_, col) => ({
                    row,
                    col,

                    topography: {
                        elevation: {env: 0, unit: 'm', measured: {value: undefined, date: undefined}},
                        slope: {env: 0, unit: 'deg', measured: {value: undefined, date: undefined}},
                        aspect: {env: 0, unit: 'deg', measured: {value: undefined, date: undefined}},
                        waterTable: {env: 0, unit: 'm', measured: {value: undefined, date: undefined}},
                        drainageIndex: {env: 0, unit: 'index', measured: {value: undefined, date: undefined}}
                    },

                    soil: {
                        // CHEMISTRY
                        ph: {env: 7.0, unit: 'pH', measured: {value: undefined, date: undefined}},
                        ec: {env: 0, unit: 'dS/m', measured: {value: undefined, date: undefined}},
                        salinity: {env: 0, unit: 'dS/m', measured: {value: undefined, date: undefined}},
                        cec: {env: 10, unit: 'cmol(+)/kg', measured: {value: undefined, date: undefined}},
                        organicCarbon: {env: 2.0, unit: '%', measured: {value: undefined, date: undefined}},
                        //Nutrients
                        N: {env: 0, unit: 'mg/kg', measured: {value: undefined, date: undefined}},   // nitrate-N
                        NH4: {env: 0, unit: 'mg/kg', measured: {value: undefined, date: undefined}},   // ammonium-N
                        P: {env: 0, unit: 'mg/kg', measured: {value: undefined, date: undefined}},   // phosphate-P
                        K: {env: 0, unit: 'mg/kg', measured: {value: undefined, date: undefined}},   // potassium-K
                        DON: {env: 0, unit: 'mg/kg', measured: {value: undefined, date: undefined}},    // dissolved organic N
                        //Heavy metals
                        Cd: {env: 0, unit: 'mg/kg', measured: {value: undefined, date: undefined}},
                        Pb: {env: 0, unit: 'mg/kg', measured: {value: undefined, date: undefined}},
                        As: {env: 0, unit: 'mg/kg', measured: {value: undefined, date: undefined}},

                        // PHYSICS
                        water: {env: 0, unit: 'mm', measured: {value: undefined, date: undefined}},
                        infiltrationRate: {env: 15, unit: 'mm/hr', measured: {value: undefined, date: undefined}},
                        bulkDensity: {env: 1.3, unit: 'g/cm3', measured: {value: undefined, date: undefined}},
                        penetrationResistance: {env: 0.5, unit: 'MPa', measured: {value: undefined, date: undefined}},
                        aggregateStability: {env: 50, unit: '%', measured: {value: undefined, date: undefined}},
                        hydraulicConductivity: {env: 10, unit: 'mm/hr', measured: {value: undefined, date: undefined}},
                        soilTemperature: {env: 15, unit: '°C', measured: {value: undefined, date: undefined}},

                        microbialCFU_good: {env: 0, unit: 'CFU/g', measured: {value: undefined, date: undefined}},
                        microbialCFU_bad: {env: 0, unit: 'CFU/g', measured: {value: undefined, date: undefined}},
                        mycorrhizalColonization: {env: 0, unit: '%', measured: {value: undefined, date: undefined}},
                        earthwormCount: {env: 0, unit: '1/m2', measured: {value: undefined, date: undefined}}
                    },

                    plants: (row === 2 && col === 1) ?
                        [{
                        type: "tomato", icon: "🍅",
                        scientificName: "Solanum lycopersicum",
                        description: "Annual fruiting vegetable; insect-pollinated; high-yield crop in warm seasons.",
                        growthStages: ["seed", "seedling", "juvenile", "mature", "old"],
                        daysPerDevStage: [8, 12, 30, 15, 60],
                        fruiting: {
                            requiresPollination: true,
                            mode: "insect",
                            vectors: ["bee", "fly"],
                            stages: ["flowering", "green fruit", "ripe", "overripe"],
                            daysPerStage: [15, 10, 10, 5],
                            pollinated: false,
                            fruitingWindows: [
                                {startMonth: 7, startDay: 1, endMonth: 8, endDay: 15},
                                {startMonth: 9, startDay: 1, endMonth: 9, endDay: 30}
                            ]
                        },
                        health: {env: 100, unit: 'life', measured: {value: undefined, date: undefined}},
                        yield: 50000,
                        seedRate_kg_per_ha: 0.3,
                        seedlingDensity_per_ha: 30000,
                        productKey: "tomato_fruit",
                        plantMaterialKey: "waste",
                        removedWhenHarvested: true,
                        dateDeployed: "",
                        growthStage: "mature",
                        habitats: []
                    }] :
                        []
                        ,


                    animals: (row === 2 && col === 1) ?[{
                        type: 'cow',
                        icon: '🐄',
                        scientificName: 'Bos taurus',
                        description: 'A large domesticated bovine raised for meat and milk; adults weigh 500–800kg and are grazing ruminants.',
                        food: ['grass', 'clover', 'corn', 'animal_feed'],
                        health: {env: 100, unit: 'life', measured: {value: undefined, date: undefined}},
                        foodPerGrowthStage: [20, 35, 55, 45],
                        weightPerGrowthStage: [200, 500, 1200, 1100],
                        growthStages: ['calf', 'heifer', 'adult', 'old'],
                        daysPerGrowthStage: [365, 365, 1825, 730],
                        pricesPerStage: [200, 600, 1200, 600],
                        yieldPerStage: [0, 0, 50, 20],
                        product: 'milk',
                        outputFrequency: 1,
                        dateDeployed: '',
                        growthStage: 'heifer',
                        habitats: []

                    }] : [],
                    assemblies: (row === 2 && col === 1) ?
                        [

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
                            orders: ['feed','acidify']

                        }
                    ]: [],
                    resources: {
                        water: {env: 0, unit: 'm3', measured: {value: undefined, date: undefined}},
                        waste: {env: 0, unit: 'ton', measured: {value: undefined, date: undefined}},
                        electricity: {env: 0, unit: 'kW/h', measured: {value: undefined, date: undefined}},
                        food: {env: 0, unit: 'kg', measured: {value: undefined, date: undefined}}
                    }
                }))
        )
    )

    const gate = ref({animals: [], plants: [], extras: []})
    const selectedTile = ref({})

    return {tiles, gate, size, selectedTile, topographyConstraints}
})
