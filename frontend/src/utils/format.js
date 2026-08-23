/* Small formatting helpers shared across pages. */

export const cToF = (c) => (c * 9) / 5 + 32

/** Format a Celsius number for display, honouring the chosen unit. */
export function formatTemp(celsius, unit = 'C', withUnit = true) {
  if (celsius == null || Number.isNaN(celsius)) return '--'
  const val = unit === 'F' ? Math.round(cToF(celsius)) : Math.round(celsius)
  if (!withUnit) return `${val}`
  return `${val}°${unit}`
}

export const inr = (n) =>
  `₹ ${Number(n || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`

export function formatDate(iso, opts = { day: 'numeric', month: 'short', year: 'numeric' }) {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('en-IN', opts)
}

export function dayName(iso, mode = 'short') {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString('en-IN', { weekday: mode })
}

export function isToday(iso) {
  const d = new Date(iso)
  const now = new Date()
  return d.toDateString() === now.toDateString()
}

export const cap = (s = '') => s.charAt(0).toUpperCase() + s.slice(1)
