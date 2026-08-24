import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar.jsx'
import Topbar from './Topbar.jsx'
import ToastHost from '../common/ToastHost.jsx'
import { useApp } from '../../context/AppContext.jsx'

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { mode, setMode } = useApp()
  const { pathname } = useLocation()

  // Keep the persisted mode in sync with the URL (single source of truth),
  // so deep-links and reloads land in the correct mode.
  useEffect(() => {
    const urlMode = pathname.startsWith('/sell') ? 'sell' : 'farmer'
    if (urlMode !== mode) setMode(urlMode)
  }, [pathname, mode, setMode])

  return (
    <div className="app-shell">
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
      <div
        className={`scrim ${menuOpen ? 'show' : ''}`}
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      />
      <div className="main">
        <Topbar onMenu={() => setMenuOpen((v) => !v)} />
        <main className="content">
          <Outlet />
        </main>
      </div>
      <ToastHost />
    </div>
  )
}
