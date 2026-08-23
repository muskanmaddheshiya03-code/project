import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  ScanLine,
  FlaskConical,
  Sprout,
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
} from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'
import { useT } from '../../i18n/strings.js'

const NAV = [
  { to: '/', key: 'nav.dashboard', Icon: LayoutDashboard, end: true },
  { to: '/disease-detection', key: 'nav.disease', Icon: ScanLine },
  { to: '/soil-nutrition', key: 'nav.soil', Icon: FlaskConical },
  { to: '/crop-advisory', key: 'nav.advisory', Icon: Sprout },
  { to: '/market-price', key: 'nav.market', Icon: LineChart },
  { to: '/weather', key: 'nav.weather', Icon: CloudSun },
  { to: '/ai-assistant', key: 'nav.assistant', Icon: Bot },
  { to: '/my-farms', key: 'nav.farms', Icon: Tractor },
  { to: '/history', key: 'nav.history', Icon: HistoryIcon },
  { to: '/saved-reports', key: 'nav.reports', Icon: Bookmark },
  { to: '/profile', key: 'nav.profile', Icon: User },
  { to: '/settings', key: 'nav.settings', Icon: SettingsIcon },
]

export default function Sidebar({ open, onClose }) {
  const { user } = useApp()
  const t = useT()
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
            <div className="brand-sub">{t('brand.sub')}</div>
          </div>
        </div>
      </div>

      <nav className="nav">
        {NAV.map(({ to, key, Icon, end }) => (
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
