function calculateThirstDamage(_context) {
  return -1;
}

export default {
  water: [{ target: 'animals', property: 'health', delta: calculateThirstDamage }],
  electricity: [{ target: 'animals', property: 'health', delta: 1 }],
  waste: [{ target: 'animals', property: 'health', delta: -1 }],
  fertilizer: [
    { target: 'soil', property: 'N', delta: 1 },
    { target: 'soil', property: 'P', delta: 0.2 },
    { target: 'soil', property: 'K', delta: 0.2 },
    { target: 'soil', property: 'organicCarbon', delta: 0.01 },
  ],
  feed: [{ target: 'animals', property: 'health', delta: -1 }],
};
