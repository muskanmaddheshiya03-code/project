import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'

const ICON = { success: CheckCircle2, error: AlertTriangle, info: Info }

export default function ToastHost() {
  const { toasts, removeToast } = useApp()
  if (!toasts.length) return null
  return (
    <div className="toast-wrap">
      {toasts.map((t) => {
        const Icon = ICON[t.tone] || CheckCircle2
        return (
          <div key={t.id} className={`toast ${t.tone}`}>
            <Icon className="toast-ico" size={20} />
            <span style={{ flex: 1, fontSize: 14 }}>{t.text}</span>
            <button
              onClick={() => removeToast(t.id)}
              aria-label="Dismiss"
              style={{ background: 'none', border: 'none', color: 'var(--text-soft)' }}
            >
              <X size={16} />
            </button>
          </div>
        )
      })}
    </div>
  )
}
