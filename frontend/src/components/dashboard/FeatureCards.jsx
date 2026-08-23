import { Link } from 'react-router-dom'
import { Leaf, FlaskConical, IndianRupee, Sprout, ArrowRight, Upload } from 'lucide-react'
import { useT } from '../../i18n/strings.js'

const FEATURES = [
  { key: 'disease', to: '/disease-detection', Icon: Leaf, cls: 'ico-green', cta: Upload },
  { key: 'soil', to: '/soil-nutrition', Icon: FlaskConical, cls: 'ico-purple', cta: ArrowRight },
  { key: 'market', to: '/market-price', Icon: IndianRupee, cls: 'ico-orange', cta: ArrowRight },
  { key: 'advisory', to: '/crop-advisory', Icon: Sprout, cls: 'ico-green', cta: ArrowRight },
]

export default function FeatureCards() {
  const t = useT()
  return (
    <div className="feature-grid">
      {FEATURES.map(({ key, to, Icon, cls, cta: Cta }) => (
        <div className="feature-card card" key={key}>
          <div className={`feature-ico ${cls}`}>
            <Icon size={26} />
          </div>
          <div className="feature-title">{t(`feature.${key}.title`)}</div>
          <div className="feature-desc">{t(`feature.${key}.desc`)}</div>
          <Link to={to} className="feature-cta">
            {t(`feature.${key}.cta`)} <Cta size={16} />
          </Link>
        </div>
      ))}
    </div>
  )
}
