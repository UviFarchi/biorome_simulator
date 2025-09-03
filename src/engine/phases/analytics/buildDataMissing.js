// src/engine/steps/buildDataMissing.js

// Which props are required to be measured
import eventBus from "@/eventBus.js";

export const REQUIRED = {
    topography: ['waterTable', 'drainageIndex', 'elevation', 'slope', 'aspect'],
    soil: [
        'ph','ec','salinity','cec','organicCarbon',
        'N','NH4','P','K','DON',
        'Cd','Pb','As',
        'water','infiltrationRate','bulkDensity','penetrationResistance',
        'aggregateStability','hydraulicConductivity','soilTemperature',
        'microbialCFU_good','microbialCFU_bad','mycorrhizalColonization','earthwormCount'
    ],
    resources: ['water','waste','electricity','feed'],
    plantHealth: true,
    animalHealth: true
}

function groupDottedProps(list) {
    const buckets = {}
    for (const dotted of list || []) {
        const [head, tail] = String(dotted).split('.', 2)
        const cat  = dotted === 'plant.health' ? 'plants'
            : dotted === 'animal.health' ? 'animals'
                : head
        const leaf = (dotted === 'plant.health' || dotted === 'animal.health')
            ? 'health'
            : (tail || head)
        if (!buckets[cat]) buckets[cat] = new Set()
        buckets[cat].add(leaf)
    }
    return Object.entries(buckets)
        .sort((a,b)=>a[0].localeCompare(b[0]))
        .map(([cat, set]) => ({ cat, items: [...set].sort() }))
}

function scanTileMissingStale(tile, todayISO) {
    const missing = [], stale = []
    const dot = (g,k) => `${g}.${k}`

    for (const g of ['topography','soil','resources']) {
        const req = REQUIRED[g] || []
        const obj = tile?.[g] || {}
        for (const k of req) {
            const m = obj[k]?.measured
            if (!m || m.value == null) { missing.push(dot(g,k)); continue }
            if (m.date && m.date < todayISO) stale.push(dot(g,k))
        }
    }

    if (REQUIRED.plantHealth && Array.isArray(tile?.plants) && tile.plants.length) {
        for (const p of tile.plants) {
            const m = p?.health?.measured
            if (!m || m.value == null) missing.push('plant.health')
            else if (m.date && m.date < todayISO) stale.push('plant.health')
        }
    }
    if (REQUIRED.animalHealth && Array.isArray(tile?.animals) && tile.animals.length) {
        for (const a of tile.animals) {
            const m = a?.health?.measured
            if (!m || m.value == null) missing.push('animal.health')
            else if (m.date && m.date < todayISO) stale.push('animal.health')
        }
    }
    return { missing, stale }
}

export function buildDataMissing(currentGrid2D, todayISO) {
    eventBus.emit('log', {engine:'analytics', msg: 'Building Missing Data Report'})
    const tilesFlat = currentGrid2D?.flat?.() || []
    const missingCounts = new Map(), staleCounts = new Map()
    const rows = []

    for (const t of tilesFlat) {
        const { missing, stale } = scanTileMissingStale(t, todayISO)
        if (!missing.length && !stale.length) continue

        for (const k of missing) missingCounts.set(k, (missingCounts.get(k) || 0) + 1)
        for (const k of stale)   staleCounts.set(k,   (staleCounts.get(k)   || 0) + 1)

        rows.push({
            rowKey: `${t.row},${t.col}`,
            row: t.row,
            col: t.col,
            tileLabel: `${t.row},${t.col}`,
            missingCount: missing.length,
            staleCount: stale.length,
            expandA: { title: 'Missing details', groups: groupDottedProps(missing) },
            expandB: { title: 'Stale details',   groups: groupDottedProps(stale) }
        })
    }

    const toArr = (m) => [...m.entries()].map(([prop,count]) => ({prop,count}))
        .sort((a,b)=>b.count - a.count).slice(0,5)
    const topMissingTokens = toArr(missingCounts).map(e => `${e.prop} (${e.count})`)
    const topStaleTokens   = toArr(staleCounts).map(e => `${e.prop} (${e.count})`)

    // --- SimpleTable payload (rows are arrays; headers included)
    const summarySimpleTable = {
        headers: ['Metric', 'Value'],
        rows: [
            ['Tiles with issues', `${rows.length} / ${tilesFlat.length}`],
            ['Total missing',     [...missingCounts.values()].reduce((a,b)=>a+b,0)],
            ['Total stale',       [...staleCounts.values()].reduce((a,b)=>a+b,0)],
            ['Top missing',       topMissingTokens.join(', ') || '—'],
            ['Top stale',         topStaleTokens.join(', ')   || '—']
        ]
    }

    // --- ExpandableTable payload (explicit headers + left columns)
    const tilesExpandable = {
        headersLeft: ['Tile', 'Missing', 'Stale', 'Missing details', 'Stale details'],
        columnsLeft: [
            { key: 'tileLabel',    label: 'Tile',    width: '12%' },
            { key: 'missingCount', label: 'Missing', width: '10%' },
            { key: 'staleCount',   label: 'Stale',   width: '10%' }
        ],
        expandHeaders: ['Group', 'Fields'],
        rows: rows.sort((a,b)=> (b.missingCount - a.missingCount) || (b.staleCount - a.staleCount))
    }

    return { summarySimpleTable, tilesExpandable }
}
