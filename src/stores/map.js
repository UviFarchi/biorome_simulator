import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { gameStore } from '@/stores/game.js';

export const mapStore = defineStore('mapStore', () => {
  const game = gameStore();

  const size = computed(() => game.size);

  const topographyConstraints = {
    elevationRange: [0, 220],
    neighborCap: 6,
    cellSize: 100,
  };

  const tiles = ref(
    Array.from({ length: size.value }, (_, row) =>
      Array.from({ length: size.value }, (_, col) => ({
        row,
        col,
        topography: {
          elevation: {
            env: 0,
            unit: 'm',
            measured: { value: null, history: [], date: null, collect: false },
            optimized: null,
          },
          slope: {
            env: 0,
            unit: 'deg',
            measured: { value: null, history: [], date: null, collect: false },
            optimized: null,
          },
          aspect: {
            env: 0,
            unit: 'deg',
            measured: { value: null, history: [], date: null, collect: false },
            optimized: null,
          },
          waterTable: {
            env: 0,
            unit: 'm',
            measured: { value: null, history: [], date: null, collect: false },
            optimized: null,
          },
          drainageIndex: {
            env: 0,
            unit: 'index',
            measured: { value: null, history: [], date: null, collect: false },
            optimized: null,
          },
        },

        soil: {
          // CHEMISTRY
          ph: {
            env: 7.0,
            unit: 'pH',
            measured: { value: null, history: [], date: null, collect: false },
            optimized: null,
          },
          ec: {
            env: 0,
            unit: 'dS/m',
            measured: { value: null, history: [], date: null, collect: false },
            optimized: null,
          },
          salinity: {
            env: 0,
            unit: 'dS/m',
            measured: { value: null, history: [], date: null, collect: false },
            optimized: null,
          },
          cec: {
            env: 10,
            unit: 'cmol(+)/kg',
            measured: { value: null, history: [], date: null, collect: false },
            optimized: null,
          },
          organicCarbon: {
            env: 2.0,
            unit: '%',
            measured: { value: null, history: [], date: null, collect: false },
            optimized: null,
          },
          //Nutrients
          N: {
            env: 0,
            unit: 'mg/kg',
            measured: { value: null, history: [], date: null, collect: false },
            optimized: null,
          }, // nitrate-N
          NH4: {
            env: 0,
            unit: 'mg/kg',
            measured: { value: null, history: [], date: null, collect: false },
            optimized: null,
          }, // ammonium-N
          P: {
            env: 0,
            unit: 'mg/kg',
            measured: { value: null, history: [], date: null, collect: false },
            optimized: null,
          }, // phosphate-P
          K: {
            env: 0,
            unit: 'mg/kg',
            measured: { value: null, history: [], date: null, collect: false },
            optimized: null,
          }, // potassium-K
          DON: {
            env: 0,
            unit: 'mg/kg',
            measured: { value: null, history: [], date: null, collect: false },
            optimized: null,
          }, // dissolved organic N
          //Heavy metals
          Cd: {
            env: 0,
            unit: 'mg/kg',
            measured: { value: null, history: [], date: null, collect: false },
            optimized: null,
          },
          Pb: {
            env: 0,
            unit: 'mg/kg',
            measured: { value: null, history: [], date: null, collect: false },
            optimized: null,
          },
          As: {
            env: 0,
            unit: 'mg/kg',
            measured: { value: null, history: [], date: null, collect: false },
            optimized: null,
          },

          // PHYSICS
          water: {
            env: 0,
            unit: 'mm',
            measured: { value: null, history: [], date: null, collect: false },
            optimized: null,
          },
          infiltrationRate: {
            env: 15,
            unit: 'mm/hr',
            measured: { value: null, history: [], date: null, collect: false },
            optimized: null,
          },
          bulkDensity: {
            env: 1.3,
            unit: 'g/cm3',
            measured: { value: null, history: [], date: null, collect: false },
            optimized: null,
          },
          penetrationResistance: {
            env: 0.5,
            unit: 'MPa',
            measured: { value: null, history: [], date: null, collect: false },
            optimized: null,
          },
          aggregateStability: {
            env: 50,
            unit: '%',
            measured: { value: null, history: [], date: null, collect: false },
            optimized: null,
          },
          hydraulicConductivity: {
            env: 10,
            unit: 'mm/hr',
            measured: { value: null, history: [], date: null, collect: false },
            optimized: null,
          },
          soilTemperature: {
            env: 15,
            unit: '°C',
            measured: { value: null, history: [], date: null, collect: false },
            optimized: null,
          },

          microbialCFU_good: {
            env: 0,
            unit: 'CFU/g',
            measured: { value: null, history: [], date: null, collect: false },
            optimized: null,
          },
          microbialCFU_bad: {
            env: 0,
            unit: 'CFU/g',
            measured: { value: null, history: [], date: null, collect: false },
            optimized: null,
          },
          mycorrhizalColonization: {
            env: 0,
            unit: '%',
            measured: { value: null, history: [], date: null, collect: false },
            optimized: null,
          },
          earthwormCount: {
            env: 0,
            unit: '1/m2',
            measured: { value: null, history: [], date: null, collect: false },
            optimized: null,
          },
        },

        plants: { real: [], optimized: [] },
        animals: { real: [], optimized: [] },
        assemblies: { real: [], optimized: [] },
        resources: {
          water: {
            env: 0,
            unit: 'm3',
            measured: { value: null, history: [], date: null, collect: false },
            optimized: null,
          },
          waste: {
            env: 0,
            unit: 'kg',
            measured: { value: null, history: [], date: null, collect: false },
            optimized: null,
          },
          electricity: {
            env: 0,
            unit: 'kW/h',
            measured: { value: null, history: [], date: null, collect: false },
            optimized: null,
          },
          feed: {
            env: 0,
            unit: 'kg',
            measured: { value: null, history: [], date: null, collect: false },
            optimized: null,
          },
          fertilizer: {
            env: 0,
            unit: 'kg',
            measured: { value: null, history: [], date: null, collect: false },
            optimized: null,
          },
          fertilizer_liquid: {
            env: 0,
            unit: 'L',
            measured: { value: null, history: [], date: null, collect: false },
            optimized: null,
          },
          compost: {
            env: 0,
            unit: 'kg',
            measured: { value: null, history: [], date: null, collect: false },
            optimized: null,
          },
          biochar: {
            env: 0,
            unit: 'kg',
            measured: { value: null, history: [], date: null, collect: false },
            optimized: null,
          },
          manure: {
            env: 0,
            unit: 'm3',
            measured: { value: null, history: [], date: null, collect: false },
            optimized: null,
          },
          harvested_crop: {
            env: 0,
            unit: 'kg',
            measured: { value: null, history: [], date: null, collect: false },
            optimized: null,
          },
          animal_products: {
            env: 0,
            unit: 'kg',
            measured: { value: null, history: [], date: null, collect: false },
            optimized: null,
          },
          plant_residue: {
            env: 0,
            unit: 'kg',
            measured: { value: null, history: [], date: null, collect: false },
            optimized: null,
          },
          biogas: {
            env: 0,
            unit: 'm3',
            measured: { value: null, history: [], date: null, collect: false },
            optimized: null,
          },
          energy_dc_kWh: {
            env: 0,
            unit: 'kWh',
            measured: { value: null, history: [], date: null, collect: false },
            optimized: null,
          },
          energy_ac_kWh: {
            env: 0,
            unit: 'kWh',
            measured: { value: null, history: [], date: null, collect: false },
            optimized: null,
          },
        },
      }))
    )
  );

  const gate = ref([]);
  const station = ref([]);
  const selectedTile = ref({});

  const currentWeather = ref({
    temperature: null,
    rainfall: null,
    cloudCover: null,
    currentLabel: null,
    windSpeed: null,
    relHumidity: null,
    weatherHistory: null,
  });
  const weatherHistory = ref([]);
  //TODO => Implement week long weather forecast by generating 7 days of weather, and then vary the forecast daily to get the real weather.
  const weatherForecast = ref([]);

  return {
    tiles,
    gate,
    size,
    selectedTile,
    topographyConstraints,
    station,
    currentWeather,
    weatherHistory,
    weatherForecast,
  };
});
