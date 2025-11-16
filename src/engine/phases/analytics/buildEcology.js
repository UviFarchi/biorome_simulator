// UI-ready builder for the “Ecological events” section
import eventBus from '@/eventBus.js';
import { mapStore } from '@/stores/map.js';

export function buildEcology(currentEventsEcology = [], _currentDateISO) {
  eventBus.emit('log', { engine: 'analytics', msg: 'Building Ecology Report' });
  const map = mapStore();
  const tiles = Array.isArray(map.tiles) ? map.tiles : map.tiles?.value || [];

  let plantCount = 0;
  let animalCount = 0;
  let stressedPlants = 0;
  let stressedAnimals = 0;
  const alerts = [];

  tiles.forEach((row, rIdx) => {
    row.forEach((tile, cIdx) => {
      const tileLabel = `(${rIdx + 1},${cIdx + 1})`;
      const plants = tile?.plants?.real || [];
      const animals = tile?.animals?.real || [];
      plantCount += plants.length;
      animalCount += animals.length;

      plants.forEach((plant) => {
        const value = plant?.health?.measured?.value;
        if (Number.isFinite(value) && value < 70) {
          stressedPlants += 1;
          alerts.push({ tileLabel, type: 'Plant', detail: `${plant.type} health ${value}` });
        }
      });

      animals.forEach((animal) => {
        const value = animal?.health?.measured?.value;
        if (Number.isFinite(value) && value < 70) {
          stressedAnimals += 1;
          alerts.push({ tileLabel, type: 'Animal', detail: `${animal.type} health ${value}` });
        }
      });
    });
  });

  const summarySimpleTable = {
    headers: ['Metric', 'Value'],
    rows: [
      ['Plants on terrain', plantCount],
      ['Animals on terrain', animalCount],
      ['Stressed plants (<70 health)', stressedPlants],
      ['Stressed animals (<70 health)', stressedAnimals],
    ],
  };

  const alertsTable = {
    headers: ['Tile', 'Type', 'Detail'],
    rows: alerts.length
      ? alerts.map((a) => [a.tileLabel, a.type, a.detail])
      : [['—', '—', 'All populations nominal']],
  };

  const eventsSimpleTable = {
    headers: ['Event', 'Days remaining'],
    rows: currentEventsEcology.map((ev) => [ev?.headline || ev?.id || '—', ev?.remaining ?? '—']),
  };

  return {
    summarySimpleTable,
    alertsTable,
    eventsSimpleTable,
  };
}
