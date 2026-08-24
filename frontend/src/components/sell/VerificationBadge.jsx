import { BadgeCheck, ShieldAlert, Info } from 'lucide-react'
import { useT } from '../../i18n/strings.js'

/* Explicit verification split, per requirement:
   🟢 Information Verified  vs  ⚪ Physical Quality — NOT verified.
   We never claim quality is inspected. `compact` hides the disclaimer note. */
export default function VerificationBadge({ compact = false }) {
  const t = useT()
  return (
    <div className="stack" style={{ gap: 10 }}>
      <div className="verify-badges">
        <span className="pill pill-green">
          <BadgeCheck size={13} /> {t('sell.verify.infoBadge')}
        </span>
        <span className="pill pill-gray">
          <ShieldAlert size={13} /> {t('sell.verify.qualityBadge')}
        </span>
      </div>
      {!compact && (
        <div className="disclaimer">
          <Info size={16} />
          <span>{t('sell.verify.qualityNote')}</span>
        </div>
      )}
    </div>
  )
}
