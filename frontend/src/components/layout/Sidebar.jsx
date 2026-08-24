import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  ScanLine,
  FlaskConical,
  Sprout,
  Sparkles,
  LineChart,
  CloudSun,
  Bot,
  Tractor,
  History as HistoryIcon,
  Bookmark,
  User,
  Settings as SettingsIcon,
  Leaf,
  ChevronDown,
  Store,
  PackageOpen,
  PlusCircle,
  ShoppingCart,
  ClipboardList,
  Package,
} from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'
import { useT } from '../../i18n/strings.js'

const NAV = [
  { to: '/', key: 'nav.dashboard', Icon: LayoutDashboard, end: true },
  { to: '/disease-detection', key: 'nav.disease', Icon: ScanLine },
  { to: '/soil-nutrition', key: 'nav.soil', Icon: FlaskConical },
  { to: '/crop-advisory', key: 'nav.advisory', Icon: Sprout },
  { to: '/crop-recommendation', key: 'nav.recommend', Icon: Sparkles },
  { to: '/market-price', key: 'nav.market', Icon: LineChart },
  { to: '/weather', key: 'nav.weather', Icon: CloudSun },
  { to: '/ai-assistant', key: 'nav.assistant', Icon: Bot },
  { to: '/my-farms', key: 'nav.farms', Icon: Tractor },
  { to: '/history', key: 'nav.history', Icon: HistoryIcon },
  { to: '/saved-reports', key: 'nav.reports', Icon: Bookmark },
  { to: '/profile', key: 'nav.profile', Icon: User },
  { to: '/settings', key: 'nav.settings', Icon: SettingsIcon },
]

const SELL_NAV = [
  { to: '/sell', key: 'nav.sell.dashboard', Icon: Store, end: true },
  { to: '/sell/my-produce', key: 'nav.sell.myProduce', Icon: PackageOpen },
  { to: '/sell/add-produce', key: 'nav.sell.addProduce', Icon: PlusCircle },
  { to: '/sell/marketplace', key: 'nav.sell.marketplace', Icon: ShoppingCart },
  { to: '/sell/reservations', key: 'nav.sell.reservations', Icon: ClipboardList },
  { to: '/sell/orders', key: 'nav.sell.orders', Icon: Package },
]

export default function Sidebar({ open, onClose }) {
  const { user, setMode } = useApp()
  const t = useT()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const mode = pathname.startsWith('/sell') ? 'sell' : 'farmer'
  const navItems = mode === 'sell' ? SELL_NAV : NAV

  const switchMode = (next) => {
    if (next === mode) return
    setMode(next)
    navigate(next === 'sell' ? '/sell' : '/')
    onClose?.()
  }

  const initials = user.name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')

  return (
    <aside className={`sidebar ${open ? 'open' : ''}`}>
      <div className="sidebar-header">
        <div className="brand">
          <div className="brand-logo">
            <Leaf size={24} strokeWidth={2.4} />
          </div>
          <div>
            <div className="brand-name">GramMitr</div>
            <div className="brand-sub">{t(mode === 'sell' ? 'brand.sub.sell' : 'brand.sub')}</div>
          </div>
        </div>

        <div className="mode-switch" role="tablist" aria-label={t('mode.switch')}>
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'farmer'}
            className={mode === 'farmer' ? 'on' : ''}
            onClick={() => switchMode('farmer')}
          >
            🌾 {t('mode.farmer')}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'sell'}
            className={mode === 'sell' ? 'on' : ''}
            onClick={() => switchMode('sell')}
          >
            🛒 {t('mode.sell')}
          </button>
        </div>
      </div>

      <nav className="nav">
        {navItems.map(({ to, key, Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            onClick={onClose}
          >
            <Icon />
            <span>{t(key)}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <NavLink to="/profile" className="user-chip" onClick={onClose}>
          {user.avatar ? (
            <img className="user-avatar" src={user.avatar} alt={user.name} />
          ) : (
            <span className="user-avatar">{initials}</span>
          )}
          <span className="user-meta">
            <span className="user-name">{user.name}</span>
            <br />
            <span className="user-loc">
              {user.district}, {user.state}
            </span>
          </span>
          <ChevronDown className="chev" size={16} />
        </NavLink>
      </div>
    </aside>
  )
}
