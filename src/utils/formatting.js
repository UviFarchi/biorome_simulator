function formatDate(iso) {
    if (!iso) return '—'
    try {
        const d = new Date(iso)
        if (Number.isNaN(d.getTime())) return String(iso)
        return d.toISOString().slice(0, 10)
    } catch {
        return String(iso)
    }
}
function formatValue(entry) {
    if (!entry) return 'No entry'
    const { value, unit } = entry
    if (typeof value === 'number' && Number.isFinite(value)) {
        return `${value.toFixed(2)}${unit ? ' ' + unit : ''}`
    }
    if (value == null) return 'No data'
    return `${String(value)}${unit ? ' ' + unit : ''}`
}

export {formatDate, formatValue}