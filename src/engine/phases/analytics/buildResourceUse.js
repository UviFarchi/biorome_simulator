// UI-ready builder for the “Resource use” section
import eventBus from '@/eventBus.js'

/**
 * Sum current (measured) vs projected resource values across the grid.
 * Shows both columns regardless of phase; UI can decide which to display.
 *
 * @param {Array<Array<Object>>} currentGrid2D
 * @param {string} currentDateISO  YYYY-MM-DD
 */
export function buildResourceUse(currentGrid2D, currentDateISO) {
  eventBus.emit('log', { engine: 'analytics', msg: 'Building Resource Use Report' })

  const fmt = (n) => (Number.isFinite(n) ? n.toFixed(2) : '—')

  // totals[key] = { unit, curr:number|null, proj:number|null }
  const totals = Object.create(null)

  const eachTile = (fn) => {
    if (!Array.isArray(currentGrid2D)) return
    for (const row of currentGrid2D) {
      if (!Array.isArray(row)) continue
      for (const tile of row) fn(tile)
    }
  }

  eachTile((tile) => {
    const res = tile?.resources || {}
    for (const [key, node] of Object.entries(res)) {
      if (!node || typeof node !== 'object' || !('measured' in node)) continue
      const unit = node.unit || ''
      const curr = Number.isFinite(node.measured?.value) ? Number(node.measured.value) : null
      const proj = Number.isFinite(node.projected) ? Number(node.projected) : null

      if (!totals[key]) totals[key] = { unit, curr: 0, proj: 0, hasCurr: false, hasProj: false }
      if (curr != null) { totals[key].curr += curr; totals[key].hasCurr = true }
      if (proj != null) { totals[key].proj += proj; totals[key].hasProj = true }
      if (!totals[key].unit && unit) totals[key].unit = unit
    }
  })

  const label = (k) => k.charAt(0).toUpperCase() + k.slice(1)

  const rowsToday = Object
    .keys(totals)
    .sort((a, b) => a.localeCompare(b))
    .map((key) => {
      const { unit, curr, proj, hasCurr, hasProj } = totals[key]
      const currOut = hasCurr ? fmt(curr) + (unit ? ` ${unit}` : '') : '—'
      const projOut = hasProj ? fmt(proj) + (unit ? ` ${unit}` : '') : '—'
      let deltaOut = '—'
      if (hasCurr && hasProj) {
        const d = proj - curr
        deltaOut = d === 0 ? '0' : fmt(d) // no leading “+”
      }
      return [ `${label(key)}`, currOut, projOut, deltaOut ]
    })

    const todaySimpleTable = {
    headers: ['Resource', 'Current', 'Projected', 'Δ'],
    rows: rowsToday.length ? rowsToday : [['No resources', '—', '—', '—']]
    }

  // Simple one-line “today” trend row; history can append externally.
  const wanted = ['water', 'electricity', 'waste', 'feed', 'fertilizer']
  const trendHeaders = ['Date', ...wanted.map((k) => label(k))]
  const trendRow = [
    currentDateISO,
    ...wanted.map((k) => (totals[k]?.hasCurr ? fmt(totals[k].curr) : '—'))
  ]

    const trend7dSimpleTable = {
    headers: trendHeaders,
    rows: [trendRow]
    }

    return { todaySimpleTable, trend7dSimpleTable }
}
