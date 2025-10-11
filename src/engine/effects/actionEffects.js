const DEFAULT_HARVEST_BASE_KG = 100;

export default {
  irrigate_drip: [
    {
      target: 'soil',
      property: 'water',
      mode: 'increment',
      unit: 'mm',
      delta: ({ params }) => Number(params.waterVolumeLiters ?? 0),
    },
    {
      target: 'resources',
      property: 'water',
      mode: 'decrement',
      unit: 'm3',
      delta: ({ params }) => Number(params.waterVolumeLiters ?? 0) / 1000,
    },
  ],
  move_assembly: [
    {
      target: 'assemblies',
      apply: ({ params, instance }) => {
        const outcome = {
          action: 'move_assembly',
          assemblyId: params.assemblyId ?? null,
          destinationTileId: params.destinationTileId ?? null,
          travelMode: params.travelMode ?? 'ground',
          recordedAt: Date.now(),
        };
        instance.outcome = outcome;
        return outcome;
      },
    },
  ],
  harvest_crop: [
    {
      target: 'resources',
      property: 'harvested_crop',
      mode: 'increment',
      unit: 'kg',
      delta: ({ params }) => {
        const percentage = Number(params.harvestPercentage ?? 0);
        const baseYield = Number.isFinite(Number(params.estimatedYieldKg))
          ? Number(params.estimatedYieldKg)
          : DEFAULT_HARVEST_BASE_KG;
        return (percentage / 100) * baseYield;
      },
    },
    {
      target: 'plants',
      apply: ({ params, instance }) => {
        const record = {
          action: 'harvest_crop',
          plantId: params.targetPlantId ?? null,
          harvestedPercentage: Number(params.harvestPercentage ?? 0),
          destinationStorageId: params.destinationStorageId ?? null,
        };
        instance.outcome = { ...(instance.outcome || {}), harvest: record };
        return record;
      },
    },
  ],
  collect_manure: [
    {
      target: 'resources',
      property: 'manure',
      mode: 'increment',
      unit: 'm3',
      delta: ({ params }) => Number(params.volumeCubicMeters ?? 0),
    },
    {
      target: 'resources',
      property: 'waste',
      mode: 'decrement',
      unit: 'm3',
      delta: ({ params }) => Number(params.volumeCubicMeters ?? 0),
    },
  ],
};
