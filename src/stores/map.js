import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { gameStore } from '@/stores/game.js';

const TOTAL_AREA_HA = 100;
const DEFAULT_GRID_SIZE = 10;

export const mapStore = defineStore('mapStore', () => {
  const game = gameStore();

  const size = computed(() => clampGridSize(game.size ?? DEFAULT_GRID_SIZE));

  const topographyConstraints = {
    elevationRange: [0, 220],
    neighborCap: 6,
    cellSize: 100,
  };

  const tileAreaHa = ref(calculateTileArea(size.value, TOTAL_AREA_HA));
  const tiles = ref(createTiles(size.value, tileAreaHa.value));

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
  const weatherForecast = ref([]);

  function resetTiles(nextSize = size.value) {
    const normalizedSize = clampGridSize(nextSize ?? size.value);
    const area = calculateTileArea(normalizedSize, TOTAL_AREA_HA);
    tiles.value = createTiles(normalizedSize, area);
    tileAreaHa.value = area;
    if (game.size !== normalizedSize) {
      game.size = normalizedSize;
    }
  }

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
    tileAreaHa,
    totalAreaHa: TOTAL_AREA_HA,
    resetTiles,
  };
});

function clampGridSize(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return DEFAULT_GRID_SIZE;
  return Math.max(1, Math.min(20, Math.round(parsed)));
}

function calculateTileArea(gridSize, totalAreaHa) {
  const divisor = Math.max(1, gridSize * gridSize);
  return Math.round((totalAreaHa / divisor) * 100) / 100;
}

function createTiles(size, tileAreaHa) {
  return Array.from({ length: size }, (_, row) =>
    Array.from({ length: size }, (_, col) => ({
      row,
      col,
      areaHa: tileAreaHa,
      metadata: { surveyed: false },
      topography: {
        elevation: createMeasuredField(0, 'm'),
        slope: createMeasuredField(0, 'deg'),
        aspect: createMeasuredField(0, 'deg'),
        waterTable: createMeasuredField(0, 'm'),
        drainageIndex: createMeasuredField(0, 'index'),
      },
      soil: {
        ph: createMeasuredField(7, 'pH'),
        ec: createMeasuredField(0, 'dS/m'),
        salinity: createMeasuredField(0, 'dS/m'),
        cec: createMeasuredField(10, 'cmol(+)/kg'),
        organicCarbon: createMeasuredField(2, '%'),
        N: createMeasuredField(0, 'mg/kg'),
        NH4: createMeasuredField(0, 'mg/kg'),
        P: createMeasuredField(0, 'mg/kg'),
        K: createMeasuredField(0, 'mg/kg'),
        DON: createMeasuredField(0, 'mg/kg'),
        Cd: createMeasuredField(0, 'mg/kg'),
        Pb: createMeasuredField(0, 'mg/kg'),
        As: createMeasuredField(0, 'mg/kg'),
        water: createMeasuredField(0, 'mm'),
        infiltrationRate: createMeasuredField(15, 'mm/hr'),
        bulkDensity: createMeasuredField(1.3, 'g/cm3'),
        penetrationResistance: createMeasuredField(0.5, 'MPa'),
        aggregateStability: createMeasuredField(50, '%'),
        hydraulicConductivity: createMeasuredField(10, 'mm/hr'),
        soilTemperature: createMeasuredField(15, '°C'),
        microbialCFU_good: createMeasuredField(0, 'CFU/g'),
        microbialCFU_bad: createMeasuredField(0, 'CFU/g'),
        mycorrhizalColonization: createMeasuredField(0, '%'),
        earthwormCount: createMeasuredField(0, '1/m2'),
      },
      plants: { real: [], optimized: [] },
      animals: { real: [], optimized: [] },
      assemblies: { real: [], optimized: [] },
      resources: {
        water: createMeasuredField(0, 'm3'),
        waste: createMeasuredField(0, 'kg'),
        electricity: createMeasuredField(0, 'kW/h'),
        feed: createMeasuredField(0, 'kg'),
        fertilizer: createMeasuredField(0, 'kg'),
        fertilizer_liquid: createMeasuredField(0, 'L'),
        compost: createMeasuredField(0, 'kg'),
        biochar: createMeasuredField(0, 'kg'),
        manure: createMeasuredField(0, 'm3'),
        harvested_crop: createMeasuredField(0, 'kg'),
        animal_products: createMeasuredField(0, 'kg'),
        plant_residue: createMeasuredField(0, 'kg'),
        biogas: createMeasuredField(0, 'm3'),
        energy_dc_kWh: createMeasuredField(0, 'kWh'),
        energy_ac_kWh: createMeasuredField(0, 'kWh'),
      },
    }))
  );
}

function createMeasuredField(env = 0, unit = '') {
  return {
    env,
    unit,
    measured: { value: null, history: [], date: null, collect: false },
    optimized: null,
  };
}
