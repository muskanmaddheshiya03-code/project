import { Link } from 'react-router-dom'
import { ArrowRight, MessageCircle } from 'lucide-react'
import { useT } from '../../i18n/strings.js'

function FarmScene() {
  return (
    <svg className="hero-scene" viewBox="0 0 260 200" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#bfe9cd" />
          <stop offset="1" stopColor="#e9f7ee" />
        </linearGradient>
      </defs>
      <circle cx="205" cy="52" r="26" fill="#ffe08a" />
      <circle cx="205" cy="52" r="26" fill="#ffd257" opacity="0.5" />
      {/* hills */}
      <path d="M0 150 Q70 110 140 145 T260 140 V200 H0 Z" fill="#3fae6b" />
      <path d="M0 168 Q80 138 160 165 T260 162 V200 H0 Z" fill="#2f9457" />
      {/* wheat stalks */}
      {[40, 70, 100, 130, 160, 190].map((x, i) => (
        <g key={i} stroke="#1f7a45" strokeWidth="2.4" strokeLinecap="round">
          <line x1={x} y1={185} x2={x} y2={150 - (i % 3) * 6} stroke="#d9a441" />
          <path
            d={`M${x} ${150 - (i % 3) * 6} l-7 -8 M${x} ${150 - (i % 3) * 6} l7 -8 M${x} ${
              156 - (i % 3) * 6
            } l-7 -8 M${x} ${156 - (i % 3) * 6} l7 -8`}
            stroke="#e2b64f"
          />
        </g>
      ))}
    </svg>
  )
}

export default function Hero() {
  const t = useT()
  return (
    <section className="hero">
      <img
        className="hero-bg"
        src="https://images.unsplash.com/photo-1630992866107-e3265545dc39?auto=format&fit=crop&w=1600&q=70"
        alt=""
        aria-hidden="true"
        loading="lazy"
        onError={(e) => {
          e.currentTarget.style.display = 'none'
        }}
      />
      <div className="hero-overlay" aria-hidden="true" />
      <div className="hero-content">
        <h1 className="hero-title">
          {t('hero.title1')} <span className="accent">{t('hero.title2')}</span>
        </h1>
        <p className="hero-desc">{t('hero.desc')}</p>
        <Link to="/disease-detection" className="btn btn-primary btn-lg">
          {t('common.getStarted')} <ArrowRight size={18} />
        </Link>
      </div>

      <div className="hero-art">
        <FarmScene />
        <div className="help-card">
          <div className="help-title">{t('help.title')}</div>
          <div className="help-sub">{t('help.sub')}</div>
          <div className="help-actions">
            <Link to="/ai-assistant" className="btn btn-primary btn-sm">
              {t('help.chat')}
            </Link>
            <Link to="/ai-assistant" className="help-chat-ico" aria-label="Chat">
              <MessageCircle size={18} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
