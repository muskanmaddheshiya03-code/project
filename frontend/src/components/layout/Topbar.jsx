import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Menu,
  MapPin,
  Search,
  X,
  Bell,
  ChevronDown,
  Globe,
  Sun,
  Moon,
  User,
  Settings as SettingsIcon,
  AlertTriangle,
  Info,
  CheckCircle2,
  Leaf,
  Bug,
  IndianRupee,
  Loader2,
} from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'
import { useT } from '../../i18n/strings.js'
import { searchLocations } from '../../api/weather.js'
import { DISEASE_KB, COMMODITIES } from '../../data/mockData.js'

const toneIcon = { warn: AlertTriangle, info: Info, success: CheckCircle2 }
const toneColor = { warn: 'var(--warn)', info: 'var(--info)', success: 'var(--primary)' }

export default function Topbar({ onMenu }) {
  const navigate = useNavigate()
  const t = useT()
  const {
    location,
    setLocation,
    notifications,
    markRead,
    markAllRead,
    language,
    toggleLanguage,
    theme,
    toggleTheme,
    user,
    pushToast,
  } = useApp()

  const [active, setActive] = useState(null) // 'loc' | 'notif' | 'avatar'
  const [query, setQuery] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)

  const [locQuery, setLocQuery] = useState('')
  const [locResults, setLocResults] = useState([])
  const [locLoading, setLocLoading] = useState(false)

  const unread = notifications.filter((n) => !n.read).length

  const closeAll = () => {
    setActive(null)
    setSearchOpen(false)
  }
  const openMenu = (name) => {
    setActive((cur) => (cur === name ? null : name))
    setSearchOpen(false)
  }

  /* ---- global search index ---- */
  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    const pages = [
      { label: 'Disease Detection', path: '/disease-detection', kind: 'Page', Icon: Leaf },
      { label: 'Soil Nutrition', path: '/soil-nutrition', kind: 'Page', Icon: Leaf },
      { label: 'Crop Advisory', path: '/crop-advisory', kind: 'Page', Icon: Leaf },
      { label: 'Market Price', path: '/market-price', kind: 'Page', Icon: IndianRupee },
      { label: 'Weather', path: '/weather', kind: 'Page', Icon: Leaf },
      { label: 'AI Assistant', path: '/ai-assistant', kind: 'Page', Icon: Leaf },
    ]
    const diseases = DISEASE_KB.filter((d) => d.disease !== 'Healthy — No disease detected').map(
      (d) => ({ label: d.disease, path: '/disease-detection', kind: 'Disease', Icon: Bug })
    )
    const crops = COMMODITIES.map((c) => ({
      label: c,
      path: '/market-price',
      kind: 'Crop',
      Icon: IndianRupee,
    }))
    return [...pages, ...diseases, ...crops]
      .filter((r) => r.label.toLowerCase().includes(q))
      .slice(0, 7)
  }, [query])

  const goSearch = (r) => {
    setQuery('')
    setSearchOpen(false)
    navigate(r.path)
  }
  const onSearchSubmit = (e) => {
    e.preventDefault()
    if (searchResults[0]) goSearch(searchResults[0])
  }

  /* ---- location search (debounced) ---- */
  useEffect(() => {
    if (active !== 'loc') return
    const q = locQuery.trim()
    if (q.length < 2) {
      setLocResults([])
      return
    }
    setLocLoading(true)
    const id = setTimeout(() => {
      searchLocations(q)
        .then((r) => setLocResults(r))
        .catch(() => setLocResults([]))
        .finally(() => setLocLoading(false))
    }, 350)
    return () => clearTimeout(id)
  }, [locQuery, active])

  const pickLocation = (loc) => {
    setLocation(loc)
    closeAll()
    setLocQuery('')
    setLocResults([])
    pushToast(`Location set to ${loc.name}`)
  }

  const onNotif = (n) => {
    markRead(n.id)
    closeAll()
    if (n.link) navigate(n.link)
  }

  const anyOpen = active || searchOpen

  return (
    <header className="topbar">
      <button className="menu-btn" onClick={onMenu} aria-label="Menu">
        <Menu size={20} />
      </button>

      {/* Location */}
      <div className="location-picker">
        <button className="location-btn" onClick={() => openMenu('loc')}>
          <MapPin size={18} />
          <span>
            {location.admin1 || location.name}, {location.country}
          </span>
          <ChevronDown size={16} />
        </button>
        {active === 'loc' && (
          <div className="dropdown left" style={{ width: 320 }}>
            <div className="dropdown-head">Change location</div>
            <div style={{ padding: 12 }}>
              <div className="search" style={{ width: '100%' }}>
                <Search className="search-ico" size={17} />
                <input
                  autoFocus
                  placeholder="Search city or district..."
                  value={locQuery}
                  onChange={(e) => setLocQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="dropdown-body">
              {locLoading && (
                <div className="dropdown-row" style={{ justifyContent: 'center' }}>
                  <Loader2 className="spin" size={18} /> <span className="muted">Searching…</span>
                </div>
              )}
              {!locLoading &&
                locResults.map((r, i) => (
                  <button className="dropdown-row" key={i} onClick={() => pickLocation(r)}>
                    <MapPin size={18} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                    <span>
                      <div style={{ fontWeight: 600 }}>{r.name}</div>
                      <div className="muted" style={{ fontSize: 13 }}>
                        {[r.admin1, r.country].filter(Boolean).join(', ')}
                      </div>
                    </span>
                  </button>
                ))}
              {!locLoading && locQuery.length >= 2 && !locResults.length && (
                <div className="dropdown-row muted" style={{ justifyContent: 'center' }}>
                  No matches found
                </div>
              )}
              {locQuery.length < 2 && (
                <div className="dropdown-row muted" style={{ justifyContent: 'center' }}>
                  Type at least 2 letters
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Search */}
      <div className="topbar-search-wrap">
        <form className="search" onSubmit={onSearchSubmit} style={{ position: 'relative' }}>
          <Search className="search-ico" size={18} />
          <input
            placeholder={t('search.placeholder')}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setSearchOpen(true)
              setActive(null)
            }}
            onFocus={() => {
              setSearchOpen(true)
              setActive(null)
            }}
          />
          {query && (
            <button
              type="button"
              className="search-clear"
              onClick={() => setQuery('')}
              aria-label="Clear"
            >
              <X size={16} />
            </button>
          )}
          {searchOpen && searchResults.length > 0 && (
            <div className="dropdown left" style={{ top: 'calc(100% + 8px)', width: '100%' }}>
              <div className="dropdown-body">
                {searchResults.map((r, i) => (
                  <button className="dropdown-row" key={i} onClick={() => goSearch(r)}>
                    <r.Icon size={18} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                    <span style={{ flex: 1 }}>{r.label}</span>
                    <span className="pill pill-gray">{r.kind}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </form>
      </div>

      {/* Right cluster */}
      <div className="topbar-right">
        <button className="lang-toggle" onClick={toggleLanguage} title="Change language">
          <Globe size={17} />
          <span>{t('lang.switch')}</span>
        </button>

        <button
          className="icon-btn"
          onClick={toggleTheme}
          title={theme === 'light' ? 'Dark mode' : 'Light mode'}
        >
          {theme === 'light' ? <Moon size={19} /> : <Sun size={19} />}
        </button>

        {/* Notifications */}
        <div style={{ position: 'relative' }}>
          <button className="icon-btn" onClick={() => openMenu('notif')} aria-label="Notifications">
            <Bell size={19} />
            {unread > 0 && <span className="badge">{unread}</span>}
          </button>
          {active === 'notif' && (
            <div className="dropdown">
              <div className="dropdown-head">
                <span>
                  {t('notif.title')} {unread > 0 && <span className="muted">({unread})</span>}
                </span>
                {unread > 0 && (
                  <button className="link-more" onClick={markAllRead}>
                    {t('notif.markAll')}
                  </button>
                )}
              </div>
              <div className="dropdown-body">
                {notifications.length === 0 && (
                  <div className="dropdown-row muted" style={{ justifyContent: 'center' }}>
                    {t('notif.empty')}
                  </div>
                )}
                {notifications.map((n) => {
                  const TI = toneIcon[n.tone] || Info
                  return (
                    <button
                      key={n.id}
                      className={`dropdown-row ${n.read ? '' : 'unread'}`}
                      onClick={() => onNotif(n)}
                    >
                      <TI size={19} style={{ color: toneColor[n.tone] || 'var(--info)', flexShrink: 0 }} />
                      <span style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600 }}>{n.title}</div>
                        <div className="muted" style={{ fontSize: 13 }}>
                          {n.body}
                        </div>
                        <div className="soft" style={{ fontSize: 12, marginTop: 2 }}>
                          {n.time}
                        </div>
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* Avatar */}
        <div style={{ position: 'relative' }}>
          <button className="avatar-btn" onClick={() => openMenu('avatar')} aria-label="Account">
            {user.avatar ? <img src={user.avatar} alt={user.name} /> : <User size={20} />}
          </button>
          {active === 'avatar' && (
            <div className="dropdown" style={{ width: 240 }}>
              <div className="dropdown-head" style={{ display: 'block' }}>
                <div style={{ fontWeight: 700 }}>{user.name}</div>
                <div className="muted" style={{ fontSize: 13, fontWeight: 400 }}>
                  {user.email}
                </div>
              </div>
              <div className="dropdown-body">
                <button
                  className="dropdown-row"
                  onClick={() => {
                    closeAll()
                    navigate('/profile')
                  }}
                >
                  <User size={18} /> <span>Profile</span>
                </button>
                <button
                  className="dropdown-row"
                  onClick={() => {
                    closeAll()
                    navigate('/settings')
                  }}
                >
                  <SettingsIcon size={18} /> <span>Settings</span>
                </button>
                <button className="dropdown-row" onClick={toggleTheme}>
                  {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                  <span>{theme === 'light' ? 'Dark mode' : 'Light mode'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {anyOpen && <div className="backdrop" onClick={closeAll} />}
    </header>
  )
}
