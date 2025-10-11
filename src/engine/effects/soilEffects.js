function ecReading(_context) {
  return 1;
}

export default {
  // CHEMISTRY
  ph: [{ target: 'resources', property: 'waste', delta: 1 }],
  ec: [{ target: 'resources', property: 'waste', delta: ecReading }],
  salinity: [{ target: 'resources', property: 'waste', delta: 1 }],
  cec: [{ target: 'resources', property: 'waste', delta: 1 }],
  organicCarbon: [{ target: 'resources', property: 'waste', delta: 1 }],
  N: [{ target: 'resources', property: 'waste', delta: 1 }],
  NH4: [{ target: 'resources', property: 'waste', delta: 1 }],
  P: [{ target: 'resources', property: 'waste', delta: 1 }],
  K: [{ target: 'resources', property: 'waste', delta: 1 }],
  DON: [{ target: 'resources', property: 'waste', delta: 1 }],
  Cd: [{ target: 'resources', property: 'waste', delta: 1 }],
  Pb: [{ target: 'resources', property: 'waste', delta: 1 }],
  As: [{ target: 'resources', property: 'waste', delta: 1 }],

  // PHYSICS
  water: [{ target: 'resources', property: 'waste', delta: 1 }],
  infiltrationRate: [{ target: 'resources', property: 'waste', delta: 1 }],
  bulkDensity: [{ target: 'resources', property: 'waste', delta: 1 }],
  penetrationResistance: [{ target: 'resources', property: 'waste', delta: 1 }],
  aggregateStability: [{ target: 'resources', property: 'waste', delta: 1 }],
  hydraulicConductivity: [{ target: 'resources', property: 'waste', delta: 1 }],
  soilTemperature: [{ target: 'resources', property: 'waste', delta: 1 }],

  microbialCFU_good: [{ target: 'resources', property: 'waste', delta: 1 }],
  microbialCFU_bad: [{ target: 'resources', property: 'waste', delta: 1 }],
  mycorrhizalColonization: [{ target: 'resources', property: 'waste', delta: 1 }],
  earthwormCount: [{ target: 'resources', property: 'waste', delta: 1 }],
};
