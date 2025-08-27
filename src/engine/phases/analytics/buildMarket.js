// UI-ready builder for the “Market” section
import eventBus from '@/eventBus.js'

export function buildMarket(currentEventsMarket = [], currentDateISO) {
    eventBus.emit('log', { engine: 'analytics', msg: 'Building Market Report' })

    // Placeholder summary until market phase is implemented
    const summarySimpleTable = {
        headers: ['Metric', 'Value'],
        rows: [
            ['Offers', 0],
            ['Contracts', 0]
        ]
    }

    // Normalize events → both object list and simpleTable rows
    const events = (currentEventsMarket || []).map(ev => ({
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
