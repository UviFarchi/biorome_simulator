// UI-ready builder for the “Ecological events” section
import eventBus from '@/eventBus.js'

export function buildEcology(currentEventsEcology = [], currentDateISO) {
    eventBus.emit('log', { engine: 'analytics', msg: 'Building Ecology Report' })

    // Placeholder summary until ecology phase is implemented
    const summarySimpleTable = {
        headers: ['Metric', 'Value'],
        rows: [
            ['Pests', 0],
            ['Beneficial', 0],
            ['Predators', 0]
        ]
    }

    // Normalize events → both object list and simpleTable rows
    const events = (currentEventsEcology || []).map(ev => ({
        id: ev?.id,
        headline: ev?.headline ?? null,
        remaining: ev?.remaining ?? null
    }))

    const eventsSimpleTable = {
        headers: ['Event', 'Days remaining'],
        rows: events.map(e => [e.headline || e.id || '—', e.remaining ?? '—'])
    }

    return {
        summarySimpleTable,
        events,              // object list
        eventsSimpleTable    // table-ready
    }
}
