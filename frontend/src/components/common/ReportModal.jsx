import { Leaf, FlaskConical, Sprout, Bug } from 'lucide-react'
import Modal from './Modal.jsx'
import { formatDate } from '../../utils/format.js'

const TYPE_META = {
  disease: { label: 'Disease', Icon: Bug, cls: 'pill-amber' },
  soil: { label: 'Soil', Icon: FlaskConical, cls: 'pill-purple' },
  advisory: { label: 'Advisory', Icon: Sprout, cls: 'pill-green' },
}

function List({ items }) {
  return (
    <ul className="bullet-list">
      {items.map((x, i) => (
        <li key={i}>{x}</li>
      ))}
    </ul>
  )
}

export default function ReportModal({ report, onClose }) {
  if (!report) return null
  const meta = TYPE_META[report.type] || { label: 'Report', Icon: Leaf, cls: 'pill-gray' }
  const d = report.detail || {}

  return (
    <Modal
      title={report.title}
      onClose={onClose}
      footer={
        <button className="btn btn-primary" onClick={onClose}>
          Close
        </button>
      }
    >
      <div className="row" style={{ marginBottom: 16, gap: 10 }}>
        <span className={`pill ${meta.cls}`}>{meta.label}</span>
        <span className="muted">
          {report.crop && report.crop !== 'General' ? `${report.crop} · ` : ''}
          {formatDate(report.date)}
        </span>
      </div>

      {report.type === 'disease' && (
        <div className="stack" style={{ gap: 14 }}>
          <div>
            <div className="label">Detected disease</div>
            <div style={{ fontWeight: 700, fontSize: 18 }}>{d.disease}</div>
          </div>
          {report.confidence != null && (
            <div>
              <div className="row-between">
                <span className="label" style={{ margin: 0 }}>
                  Confidence
                </span>
                <strong>{report.confidence}%</strong>
              </div>
              <div className="meter">
                <span style={{ width: `${report.confidence}%` }} />
              </div>
            </div>
          )}
          {d.cause && (
            <div>
              <div className="label">Cause</div>
              <p>{d.cause}</p>
            </div>
          )}
          {d.symptoms && (
            <div>
              <div className="label">Symptoms</div>
              <List items={d.symptoms} />
            </div>
          )}
          {d.treatment && (
            <div>
              <div className="label">Recommended treatment</div>
              <List items={d.treatment} />
            </div>
          )}
        </div>
      )}

      {report.type === 'soil' && (
        <div className="stack" style={{ gap: 14 }}>
          <div className="grid-4" style={{ gap: 10 }}>
            {[
              ['Nitrogen', d.n],
              ['Phosphorus', d.p],
              ['Potassium', d.k],
              ['pH', d.ph],
            ].map(([k, v]) => (
              <div className="stat-tile" key={k}>
                <div className="soft" style={{ fontSize: 12 }}>
                  {k}
                </div>
                <div style={{ fontWeight: 700, fontSize: 18 }}>{v}</div>
              </div>
            ))}
          </div>
          {d.recommendation && (
            <div>
              <div className="label">Recommendations</div>
              <List items={d.recommendation} />
            </div>
          )}
        </div>
      )}

      {report.type === 'advisory' && (
        <div className="stack" style={{ gap: 14 }}>
          {d.stage && (
            <div>
              <div className="label">Crop stage</div>
              <p style={{ fontWeight: 600 }}>{d.stage}</p>
            </div>
          )}
          {d.nextIrrigation && (
            <div>
              <div className="label">Next irrigation</div>
              <p style={{ fontWeight: 600 }}>{d.nextIrrigation}</p>
            </div>
          )}
          {d.advice && (
            <div>
              <div className="label">Advisory</div>
              <List items={d.advice} />
            </div>
          )}
        </div>
      )}

      {!['disease', 'soil', 'advisory'].includes(report.type) && <p>{report.summary}</p>}
    </Modal>
  )
}
