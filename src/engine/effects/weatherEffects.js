function evaporateGroundWater(_context) {
  return -1;
}

export default {
  temperature: [{ target: 'soil', property: 'water', delta: evaporateGroundWater }],
  rainfall: [{ target: 'topography', property: 'elevation', delta: -1 }],
  cloudCover: [{ target: 'plants', property: 'health', delta: -1 }],
  relHumidity: [{ target: 'animals', property: 'health', delta: -1 }],
  windSpeed: [{ target: 'resources', property: 'water', delta: -1 }],
};
