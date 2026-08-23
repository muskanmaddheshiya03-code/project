import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Bug, FlaskConical, Sprout } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'
import { useT } from '../../i18n/strings.js'
import { formatDate } from '../../utils/format.js'
import ReportModal from '../common/ReportModal.jsx'

const THUMB = {
  disease: { cls: 'thumb-disease', Icon: Bug, tag: 'Disease', pill: 'pill-amber', verb: 'Detected on' },
  soil: { cls: 'thumb-soil', Icon: FlaskConical, tag: 'Soil', pill: 'pill-purple', verb: 'Tested on' },
  advisory: { cls: 'thumb-advisory', Icon: Sprout, tag: 'Advisory', pill: 'pill-green', verb: 'Generated on' },
}

export default function RecentReports() {
  const { savedReports } = useApp()
  const t = useT()
  const [selected, setSelected] = useState(null)
  const items = savedReports.slice(0, 3)

  return (
    <section>
      <div className="section-head">
        <span className="section-title">{t('reports.recent')}</span>
        <Link to="/saved-reports" className="link-more">
          {t('common.viewAll')}
        </Link>
      </div>

      <div className="reports-grid">
        {items.map((r) => {
          const m = THUMB[r.type] || THUMB.advisory
          return (
            <div className="card report-card" key={r.id}>
              <div className={`report-thumb ${m.cls}`}>
                <m.Icon size={30} />
              </div>
              <div className="report-body">
                <span className={`pill ${m.pill}`}>{m.tag}</span>
                <div className="report-title">{r.title}</div>
                <div className="report-meta">
                  {m.verb} {formatDate(r.date)}
                </div>
                <div className="report-sub">{r.summary}</div>
                <button className="feature-cta" onClick={() => setSelected(r)}>
                  {t('common.viewReport')} <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {selected && <ReportModal report={selected} onClose={() => setSelected(null)} />}
    </section>
  )
}
