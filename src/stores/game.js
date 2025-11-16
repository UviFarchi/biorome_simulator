import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { formatDate } from '@/utils/formatting.js';

export const gameStore = defineStore('gameStore', () => {
  const money = ref(300000);
  const log = ref([]);
  const currentEvents = ref({
    weather: [],
    market: [],
    ecosystem: [],
  });
  const analyticsReport = ref({});
  const stationAssemblies = ref([
    {
      id: 'survey-wing-drone',
      modules: [
        { type: 'transport', subtype: 'flying', role: 'transport' },
        { type: 'sensor', subtype: 'lidar3d', role: 'sensor' },
        { type: 'camera', subtype: 'camera_rgb', role: 'sensor' },
      ],
      name: 'Surveyor Wing',
      deployed: false,
      built: true,
      moves: 2,
      actions: 1,
      orders: [],
      description: 'Fixed-wing reconnaissance drone equipped with LiDAR and optical cameras.',
      starter: true,
    },
  ]);
  const ownedModules = ref({ station: [], assemblies: [] });
  const stats = ref({
    reportsGenerated: 0,
    assembliesSaved: 0,
    assembliesDeployed: 0,
    cccDeployed: 0,
    stationHubDeployed: 0,
  });
  const stageChangeCalendar = [];
  const startDate = ref(formatDate(new Date()));
  const currentTurn = ref(0);
  const currentDate = computed(() => {
    const d = new Date(startDate.value);
    d.setDate(d.getDate() + (currentTurn.value - 1));
    return d;
  });
  const currentSeason = ref({ label: 'Unknown', icon: '' });

  const bioromizationStage = ref(0);
  const bioromizationStages = ref(['discovery', 'design', 'deployment']);

  //phase set to 3 to allow for first turn to start from phase 1
  const phase = ref(-1);
  const engines = ref(['analytics', 'optimizations', 'operations']);

  const userName = ref('');
  const userAvatar = ref('');

  const size = ref(10);
  const currentTheme = ref('dark');

  return {
    money,
    log,
    startDate,
    currentTurn,
    currentDate,
    currentSeason,
    userName,
    userAvatar,
    size,
    currentTheme,
    bioromizationStage,
    bioromizationStages,
    phase,
    engines,
    currentEvents,
    stageChangeCalendar,
    stationAssemblies,
    analyticsReport,
    ownedModules,
    stats,
  };
});
