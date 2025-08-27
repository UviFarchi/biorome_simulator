// UI-ready builder stub for the “Resource use” section
import eventBus from '@/eventBus.js'

/**
 * Resource accounting depends on the operations phase.
 * Return placeholders with a stable shape for the UI.
 *
 * @param {Array<Array<Object>>} currentGrid2D
 * @param {string} currentDateISO  YYYY-MM-DD
 */
export function buildResourceUse(currentGrid2D, currentDateISO) {
    eventBus.emit('log', { engine: 'analytics', msg: 'Building Resource Use Report (stub)' })

    // "Today" table for SimpleTable.vue
    const todaySimpleTable = {
        headers: ['Metric', 'Value'],
        rows: [
            ['Not implemented', '—']
        ]
    }

    // Optional: 7-day trend table placeholder
    const trend7dSimpleTable = {
        headers: ['Date', 'Water (m³)', 'Electricity (kWh)', 'Waste (t)'],
        rows: [] // to be filled once resource tracking exists
    }

    return { todaySimpleTable, trend7dSimpleTable }
}
