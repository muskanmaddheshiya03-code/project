import { Check, Clock, Circle, XCircle } from 'lucide-react'
import { ORDER_FLOW, STATUS_META, isTerminal, stepIndex } from '../../data/sellData.js'
import { useT } from '../../i18n/strings.js'
import { formatDate } from '../../utils/format.js'

/* Renders the order lifecycle using the existing .timeline/.tl-* classes.
   - Normal orders: every flow step marked done / current / todo by index.
   - Terminal orders (cancelled / unable): the steps actually reached, then a
     red terminal row. */
export default function OrderTimeline({ order }) {
  const t = useT()
  const histAt = (s) => order.history?.find((h) => h.status === s)?.at
  const terminal = isTerminal(order.status)

  const rows = []
  if (terminal) {
    ORDER_FLOW.filter((s) => order.history?.some((h) => h.status === s)).forEach((s) =>
      rows.push({ status: s, state: 'done', at: histAt(s) })
    )
    rows.push({ status: order.status, state: 'term', at: histAt(order.status) })
  } else {
    const cur = stepIndex(order.status)
    ORDER_FLOW.forEach((s, i) => {
      rows.push({
        status: s,
        state: i < cur ? 'done' : i === cur ? 'current' : 'todo',
        at: histAt(s),
      })
    })
  }

  return (
    <div className="timeline">
      {rows.map((r, i) => (
        <div className="tl-item" key={r.status + i}>
          <div className="tl-rail">
            <span className={`tl-dot ${r.state}`}>
              {r.state === 'done' ? (
                <Check size={16} />
              ) : r.state === 'current' ? (
                <Clock size={15} />
              ) : r.state === 'term' ? (
                <XCircle size={16} />
              ) : (
                <Circle size={9} />
              )}
            </span>
            {i < rows.length - 1 && <span className={`tl-line ${r.state === 'done' ? 'done' : ''}`} />}
          </div>
          <div className="tl-body">
            <div className="tl-text">{t(STATUS_META[r.status]?.i18n)}</div>
            {r.at && <div className="tl-date">{formatDate(r.at)}</div>}
          </div>
        </div>
      ))}
    </div>
  )
}
