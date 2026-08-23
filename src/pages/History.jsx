import { useState } from 'react'
import { History as HistoryIcon, Bug, FlaskConical, Sprout, LineChart, Bot, Trash2 } from 'lucide-react'
import { useApp } from '../context/AppContext.jsx'
import { formatDate } from '../utils/format.js'

const META = {
  disease: { Icon: Bug, dot: 'dot-disease', label: 'Disease' },
  soil: { Icon: FlaskConical, dot: 'dot-soil', label: 'Soil' },
  advisory: { Icon: Sprout, dot: 'dot-advisory', label: 'Advisory' },
  market: { Icon: LineChart, dot: 'dot-market', label: 'Market' },
  chat: { Icon: Bot, dot: 'dot-chat', label: 'Assistant' },
}
const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'disease', label: 'Disease' },
  { key: 'soil', label: 'Soil' },
  { key: 'advisory', label: 'Advisory' },
  { key: 'market', label: 'Market' },
  { key: 'chat', label: 'Assistant' },
]

export default function History() {
  const { history, clearHistory, pushToast } = useApp()
  const [filter, setFilter] = useState('all')

  const items = history.filter((h) => filter === 'all' || h.type === filter)

  const clear = () => {
    clearHistory()
    pushToast('Activity history cleared.', 'info')
  }

  return (
    <div className="page">
      <div className="page-head">
        <div className="row-between" style={{ flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div className="page-title">
              <span className="ico"><HistoryIcon size={24} /></span>
              Activity History
            </div>
            <p className="page-sub">A timeline of your detections, soil checks, advisories and questions.</p>
          </div>
          {history.length > 0 && (
            <button className="btn btn-danger" onClick={clear}><Trash2 size={16} /> Clear all</button>
          )}
        </div>
      </div>

      <div className="chips" style={{ marginBottom: 18 }}>
        {FILTERS.map((f) => (
          <button key={f.key} className={`chip ${filter === f.key ? 'active' : ''}`} onClick={() => setFilter(f.key)}>
            {f.label}
          </button>
        ))}
      </div>

      {items.length === 0 ? (
        <div className="card empty" style={{ minHeight: 220 }}>
          <span className="empty-ico"><HistoryIcon size={26} /></span>
          <div style={{ fontWeight: 600 }}>Nothing here yet</div>
          <p className="muted">Your activity will appear here as you use the tools.</p>
        </div>
      ) : (
        <div className="card pad-lg">
          <div className="timeline">
            {items.map((h, i) => {
              const m = META[h.type] || META.market
              return (
                <div className="tl-item" key={h.id}>
                  <div className="tl-rail">
                    <span className={`tl-dot ${m.dot}`}><m.Icon size={16} /></span>
                    {i < items.length - 1 && <span className="tl-line" />}
                  </div>
                  <div className="tl-body">
                    <div className="tl-text">{h.text}</div>
                    <div className="tl-date">{m.label} · {formatDate(h.date)}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
