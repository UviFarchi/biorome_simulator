import {defineStore} from 'pinia'
import {computed, ref} from 'vue'
import {gameStore} from '@/stores/game.js'

export const mapStore = defineStore('mapStore', () => {
    const game = gameStore()

    const size = ref(6)

    const topographyConstraints = {
        elevationRange: [0, 220],
        neighborCap: 6,
        cellSize: 100
    }
    const previousDayTiles = []

    const tiles = ref(
        Array.from({length: size.value}, (_, row) =>
            Array.from({length: size.value}, (_, col) => ({
                row,
                col,
                topography: {
                    elevation: {env: 0, unit: 'm', measured: {value: null, date: null, collect: false}, projected: null},
                    slope: {env: 0, unit: 'deg', measured: {value: null, date: null, collect: false}, projected: null},
                    aspect: {env: 0, unit: 'deg', measured: {value: null, date: null, collect: false}, projected: null},
                    waterTable: {env: 0, unit: 'm', measured: {value: null, date: null, collect: false}, projected: null},
                    drainageIndex: {
                        env: 0,
                        unit: 'index',
                        measured: {value: null, date: null, collect: false},
                        projected: null
                    }
                },

                soil: {
                    // CHEMISTRY
                    ph: {env: 7.0, unit: 'pH', measured: {value: null, date: null, collect: false}, projected: null},
                    ec: {env: 0, unit: 'dS/m', measured: {value: null, date: null, collect: false}, projected: null},
                    salinity: {env: 0, unit: 'dS/m', measured: {value: null, date: null, collect: false}, projected: null},
                    cec: {
                        env: 10,
                        unit: 'cmol(+)/kg',
                        measured: {value: null, date: null, collect: false},
                        projected: null
                    },
                    organicCarbon: {
                        env: 2.0,
                        unit: '%',
                        measured: {value: null, date: null, collect: false},
                        projected: null
                    },
                    //Nutrients
                    N: {env: 0, unit: 'mg/kg', measured: {value: null, date: null, collect: false}, projected: null},   // nitrate-N
                    NH4: {env: 0, unit: 'mg/kg', measured: {value: null, date: null, collect: false}, projected: null},   // ammonium-N
                    P: {env: 0, unit: 'mg/kg', measured: {value: null, date: null, collect: false}, projected: null},   // phosphate-P
                    K: {env: 0, unit: 'mg/kg', measured: {value: null, date: null, collect: false}, projected: null},   // potassium-K
                    DON: {env: 0, unit: 'mg/kg', measured: {value: null, date: null, collect: false}, projected: null},    // dissolved organic N
                    //Heavy metals
                    Cd: {env: 0, unit: 'mg/kg', measured: {value: null, date: null, collect: false}, projected: null},
                    Pb: {env: 0, unit: 'mg/kg', measured: {value: null, date: null, collect: false}, projected: null},
                    As: {env: 0, unit: 'mg/kg', measured: {value: null, date: null, collect: false}, projected: null},

                    // PHYSICS
                    water: {env: 0, unit: 'mm', measured: {value: null, date: null, collect: false}, projected: null},
                    infiltrationRate: {
                        env: 15,
                        unit: 'mm/hr',
                        measured: {value: null, date: null, collect: false},
                        projected: null
                    },
                    bulkDensity: {
                        env: 1.3,
                        unit: 'g/cm3',
                        measured: {value: null, date: null, collect: false},
                        projected: null
                    },
                    penetrationResistance: {
                        env: 0.5,
                        unit: 'MPa',
                        measured: {value: null, date: null, collect: false},
                        projected: null
                    },
                    aggregateStability: {
                        env: 50,
                        unit: '%',
                        measured: {value: null, date: null, collect: false},
                        projected: null
                    },
                    hydraulicConductivity: {
                        env: 10,
                        unit: 'mm/hr',
                        measured: {value: null, date: null, collect: false},
                        projected: null
                    },
                    soilTemperature: {
                        env: 15,
                        unit: '°C',
                        measured: {value: null, date: null, collect: false},
                        projected: null
                    },

                    microbialCFU_good: {
                        env: 0,
                        unit: 'CFU/g',
                        measured: {value: null, date: null, collect: false},
                        projected: null
                    },
                    microbialCFU_bad: {
                        env: 0,
                        unit: 'CFU/g',
                        measured: {value: null, date: null, collect: false},
                        projected: null
                    },
                    mycorrhizalColonization: {
                        env: 0,
                        unit: '%',
                        measured: {value: null, date: null, collect: false},
                        projected: null
                    },
                    earthwormCount: {
                        env: 0,
                        unit: '1/m2',
                        measured: {value: null, date: null, collect: false},
                        projected: null
                    }
                },

                plants: {real: [], projected: []},
                animals: {real: [], projected: []},
                assemblies: [],
                resources: {
                    water: {env: 0, unit: 'm3', measured: {value: null, date: null, collect: false}, projected: null},
                    waste: {env: 0, unit: 'kg', measured: {value: null, date: null, collect: false}, projected: null},
                    electricity: {env: 0, unit: 'kW/h', measured: {value: null, date: null, collect: false}, projected: null},
                    feed: {env: 0, unit: 'kg', measured: {value: null, date: null, collect: false}, projected: null},
                    fertilizer: {env: 0, unit: 'kg', measured: {value: null, date: null, collect: false}, projected: null},
                }
            }))
        )
    )

    const gate = ref({animals: [], plants: [], extras: []})
    const selectedTile = ref({})

    return {tiles, gate, size, selectedTile, topographyConstraints, previousDayTiles}
})
