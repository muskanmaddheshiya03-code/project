import { Minus, Plus } from 'lucide-react'

/* [-] n [+] stepper used for reserving produce. Clamped to [min, max]. */
export default function QuantityStepper({ value, onChange, min = 1, max = Infinity, step = 1, unit }) {
  const dec = () => onChange(Math.max(min, value - step))
  const inc = () => onChange(Math.min(max, value + step))
  return (
    <div className="row" style={{ gap: 0 }}>
      <div className="qty-stepper">
        <button type="button" onClick={dec} disabled={value <= min} aria-label="Decrease quantity">
          <Minus size={16} />
        </button>
        <span className="qty-val">{value}</span>
        <button type="button" onClick={inc} disabled={value >= max} aria-label="Increase quantity">
          <Plus size={16} />
        </button>
      </div>
      {unit && <span className="qty-unit">{unit}</span>}
    </div>
  )
}
