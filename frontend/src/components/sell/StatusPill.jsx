import { STATUS_META } from '../../data/sellData.js'
import { useT } from '../../i18n/strings.js'

/* Maps an order status to a translated .pill variant. */
export default function StatusPill({ status }) {
  const t = useT()
  const meta = STATUS_META[status]
  if (!meta) return null
  return <span className={`pill ${meta.pill}`}>{t(meta.i18n)}</span>
}
