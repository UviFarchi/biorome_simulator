// UI-ready builder for the “Tile-by-tile diff” section
import eventBus from '@/eventBus.js';

const WATCH_PROPERTIES = [
  { path: 'soil.water', label: 'Soil water', unit: 'mm' },
  { path: 'soil.ph', label: 'Soil pH', unit: 'pH' },
  { path: 'resources.water', label: 'Resources water', unit: 'm³' },
  { path: 'resources.electricity', label: 'Electricity', unit: 'kWh' },
];

function readMeasurement(tile, path) {
  const segments = path.split('.');
  let node = tile;
  for (const segment of segments) {
    if (!node) return null;
    node = node[segment];
  }
  if (!node) return null;
  const measured = node.measured?.value;
  const optimized = node.optimized;
  return {
    measured: Number.isFinite(measured) ? Number(measured) : null,
    optimized: Number.isFinite(optimized) ? Number(optimized) : null,
    unit: node.unit || null,
  };
}

export function buildTileDiff(currentDateISO, currentGrid2D = []) {
  eventBus.emit('log', { engine: 'analytics', msg: 'Building Tile Diff Report' });
  const grid = Array.isArray(currentGrid2D) ? currentGrid2D : currentGrid2D?.value || [];
  const rows = [];

  grid.forEach((row, rIdx) => {
    row.forEach((tile, cIdx) => {
      const tileLabel = `(${rIdx + 1},${cIdx + 1})`;
      let score = 0;
      const details = [];
      WATCH_PROPERTIES.forEach((property) => {
        const result = readMeasurement(tile, property.path);
        if (!result || result.measured === null || result.optimized === null) return;
        const delta = Number(result.optimized) - Number(result.measured);
        const absDelta = Math.abs(delta);
        score += absDelta;
        if (absDelta >= 1) {
          details.push({
            property: property.label,
            delta,
            unit: property.unit || result.unit || '',
          });
        }
      });
      if (details.length) {
        rows.push({ tileLabel, scoreDelta: score, details });
      }
    });
  });

  rows.sort((a, b) => b.scoreDelta - a.scoreDelta);

  const overviewSimpleTable = {
    headers: ['Metric', 'Value'],
    rows: [
      ['Tiles analysed', rows.length],
      ['Worst Δ score', rows[0] ? rows[0].scoreDelta.toFixed(2) : '—'],
      ['Report date', currentDateISO],
    ],
  };

  const tilesExpandable = {
    headersLeft: ['Tile', 'Δ score', 'Notes'],
    columnsLeft: [
      { key: 'tileLabel', label: 'Tile', width: '20%' },
      { key: 'scoreDelta', label: 'Δ score', width: '15%' },
      { key: 'notes', label: 'Notes', width: '40%' },
    ],
    expandHeaders: ['Property', 'Δ to target'],
    rows: rows.slice(0, 10).map((row) => ({
      tileLabel: row.tileLabel,
      scoreDelta: row.scoreDelta.toFixed(2),
      notes: row.details.length ? 'Needs rebalancing' : 'On target',
      expandRows: row.details.map((detail) => [
        detail.property,
        `${detail.delta > 0 ? '+' : ''}${detail.delta.toFixed(2)} ${detail.unit}`,
      ]),
    })),
  };

  return { overviewSimpleTable, tilesExpandable };
}
