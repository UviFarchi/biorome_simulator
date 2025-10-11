function formatDate(d) {
  if (!d) return '';
  try {
    const date = new Date(d);
    if (Number.isNaN(date.getTime())) return String(d);
    return date.toISOString().slice(0, 10);
  } catch {
    return String(d);
  }
}

function formatDateLocale(d, locale = 'en-GB') {
  return new Date(d).toLocaleDateString(locale);
}

function formatDateTime(d) {
  return new Date(d).toISOString().slice(0, 10);
}

function formatNumber(n, digits = 0) {
  if (typeof n !== 'number' || !Number.isFinite(n)) return '—';
  return digits > 0 ? Number(n).toFixed(digits) : String(Math.round(n));
}

function formatMoney(n) {
  if (typeof n !== 'number' || !Number.isFinite(n)) return '—';
  return `${Math.round(n)}💰`;
}

function formatValue(entry) {
  if (!entry) return 'No entry';
  const { value, unit } = entry;
  if (typeof value === 'number' && Number.isFinite(value)) {
    return `${value.toFixed(2)}${unit ? ' ' + unit : ''}`;
  }
  if (value == null) return 'No data';
  return `${String(value)}${unit ? ' ' + unit : ''}`;
}

const roundN = (x, decimals = 3) => {
  const v = Number(x);
  if (!Number.isFinite(v)) return v;
  const f = Math.pow(10, decimals);
  return Math.round(v * f) / f;
};
export {
  formatDate,
  formatDateLocale,
  formatDateTime,
  formatNumber,
  formatMoney,
  formatValue,
  roundN,
};
