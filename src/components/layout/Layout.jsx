import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar.jsx'
import Topbar from './Topbar.jsx'
import ToastHost from '../common/ToastHost.jsx'

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false)

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
