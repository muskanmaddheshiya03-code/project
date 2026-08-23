import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertTriangle, Info, CheckCircle2 } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'
import { useT } from '../../i18n/strings.js'

const TONE = {
  warn: { Icon: AlertTriangle, cls: 'alert-warn' },
  info: { Icon: Info, cls: 'alert-info' },
  success: { Icon: CheckCircle2, cls: 'alert-success' },
}

export default function AlertsCard() {
  const { notifications, markRead } = useApp()
  const t = useT()
  const navigate = useNavigate()
  const [showAll, setShowAll] = useState(false)

  const items = showAll ? notifications : notifications.slice(0, 2)

  const open = (n) => {
    markRead(n.id)
    if (n.link) navigate(n.link)
  }

  return (
    <div className="card alerts-card">
      <div className="mkt-head">
        <span className="section-title">{t('alerts.title')}</span>
        {notifications.length > 2 && (
          <button className="link-more" onClick={() => setShowAll((v) => !v)}>
            {showAll ? 'Show less' : t('common.viewAll')}
          </button>
        )}
      </div>
      <div className="alerts-list">
        {items.map((n) => {
          const tone = TONE[n.tone] || TONE.info
          return (
            <button key={n.id} className="alert-item" onClick={() => open(n)}>
              <span className={`alert-ico ${tone.cls}`}>
                <tone.Icon size={18} />
              </span>
              <span className="alert-text">
                <span className="alert-title">{n.title}</span>
                <span className="alert-body">{n.body}</span>
              </span>
              <span className="alert-time">{n.time}</span>
            </button>
          )
        })}
        {!notifications.length && <div className="muted center" style={{ padding: 16 }}>{t('notif.empty')}</div>}
      </div>
    </div>
  )
}
