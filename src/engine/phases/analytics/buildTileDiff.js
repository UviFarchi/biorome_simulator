// UI-ready builder stub for the “Tile-by-tile diff” section
import eventBus from '@/eventBus.js'


export function buildTileDiff() {
    eventBus.emit('log', { engine: 'analytics', msg: 'Building Tile Diff Report (stub)' })

    // Simple overview table for the UI (SimpleTable.vue)
    const overviewSimpleTable = {
        headers: ['Metric', 'Value'],
        rows: [
            ['Not implemented', '—']
        ]
    }

    // Optional: pre-shape an expandable block for when diffs exist
    const tilesExpandable = {
        headersLeft: ['Tile', 'Δ score', 'Notes', 'Missing vs Target', 'Excess vs Target'],
        columnsLeft: [
            { key: 'tileLabel',  label: 'Tile',     width: '14%' },
            { key: 'scoreDelta', label: 'Δ score',  width: '12%' },
            { key: 'notes',      label: 'Notes',    width: '20%' }
        ],
        expandHeaders: ['Property', 'Δ to target'],
        rows: [] // to be filled when optimization phase is available
    }

    return { overviewSimpleTable, tilesExpandable }
}
