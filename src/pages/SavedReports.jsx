import { useState } from 'react'
import { Bookmark, Bug, FlaskConical, Sprout, Trash2, Eye, Printer, ArrowRight } from 'lucide-react'
import { useApp } from '../context/AppContext.jsx'
import { formatDate } from '../utils/format.js'
import ReportModal from '../components/common/ReportModal.jsx'

const THUMB = {
  disease: { cls: 'thumb-disease', Icon: Bug, pill: 'pill-amber', label: 'Disease' },
  soil: { cls: 'thumb-soil', Icon: FlaskConical, pill: 'pill-purple', label: 'Soil' },
  advisory: { cls: 'thumb-advisory', Icon: Sprout, pill: 'pill-green', label: 'Advisory' },
}
const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'disease', label: 'Disease' },
  { key: 'soil', label: 'Soil' },
  { key: 'advisory', label: 'Advisory' },
]

export default function SavedReports() {
  const { savedReports, removeReport, pushToast } = useApp()
  const [filter, setFilter] = useState('all')
  const [selected, setSelected] = useState(null)

  const items = savedReports.filter((r) => filter === 'all' || r.type === filter)

  const del = (r) => {
    removeReport(r.id)
    pushToast('Report deleted.', 'info')
  }

  return (
    <div className="page">
      <div className="page-head">
        <div className="row-between" style={{ flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div className="page-title">
              <span className="ico"><Bookmark size={24} /></span>
              Saved Reports
            </div>
            <p className="page-sub">Your saved disease diagnoses, soil health checks and crop advisories.</p>
          </div>
          <button className="btn btn-ghost" onClick={() => window.print()}><Printer size={16} /> Print</button>
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
          <span className="empty-ico"><Bookmark size={26} /></span>
          <div style={{ fontWeight: 600 }}>No saved reports</div>
          <p className="muted">Run a disease scan, soil check or advisory and tap Save to keep it here.</p>
        </div>
      ) : (
        <div className="reports-grid">
          {items.map((r) => {
            const m = THUMB[r.type] || THUMB.advisory
            return (
              <div className="card report-card" key={r.id}>
                <div className={`report-thumb ${m.cls}`}><m.Icon size={30} /></div>
                <div className="report-body">
                  <span className={`pill ${m.pill}`}>{m.label}</span>
                  <div className="report-title">{r.title}</div>
                  <div className="report-meta">{formatDate(r.date)}</div>
                  <div className="report-sub">{r.summary}</div>
                  <div className="row" style={{ gap: 8, marginTop: 6 }}>
                    <button className="btn btn-soft btn-sm" onClick={() => setSelected(r)}><Eye size={15} /> View</button>
                    <button className="btn btn-danger btn-sm" onClick={() => del(r)} aria-label="Delete"><Trash2 size={15} /></button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {selected && <ReportModal report={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
