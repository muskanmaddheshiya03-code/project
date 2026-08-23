import { useState } from 'react'
import { User, Save, MapPin, CalendarDays, Sprout, Tractor, Bookmark } from 'lucide-react'
import { useApp } from '../context/AppContext.jsx'
import { INDIAN_STATES } from '../data/mockData.js'

export default function Profile() {
  const { user, farms, savedReports, setUser, pushToast } = useApp()
  const [form, setForm] = useState({ ...user, crops: user.crops.join(', ') })

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))
  const initials = form.name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()

  const save = (e) => {
    e.preventDefault()
    setUser({
      ...form,
      crops: form.crops.split(',').map((c) => c.trim()).filter(Boolean),
    })
    pushToast('Profile updated.')
  }

  return (
    <div className="page">
      <div className="page-head">
        <div className="page-title">
          <span className="ico"><User size={24} /></span>
          Profile
        </div>
        <p className="page-sub">Your details are stored on this device and personalise advisories.</p>
      </div>

      <div className="profile-grid">
        <div className="card profile-card">
          <div className="profile-avatar">{initials || 'U'}</div>
          <div style={{ fontWeight: 700, fontFamily: 'var(--font-head)', fontSize: 19 }}>{user.name}</div>
          <div className="muted row" style={{ justifyContent: 'center', gap: 5, marginTop: 4 }}>
            <MapPin size={14} /> {user.district}, {user.state}
          </div>
          <div className="muted row" style={{ justifyContent: 'center', gap: 5, marginTop: 4, fontSize: 13 }}>
            <CalendarDays size={13} /> Member since {user.memberSince}
          </div>

          <div className="grid-3" style={{ gap: 10, marginTop: 20 }}>
            <div className="stat-tile"><Tractor size={18} style={{ color: 'var(--primary)' }} /><div style={{ fontWeight: 700, fontSize: 18 }}>{farms.length}</div><div className="soft" style={{ fontSize: 11.5 }}>Farms</div></div>
            <div className="stat-tile"><Bookmark size={18} style={{ color: 'var(--primary)' }} /><div style={{ fontWeight: 700, fontSize: 18 }}>{savedReports.length}</div><div className="soft" style={{ fontSize: 11.5 }}>Reports</div></div>
            <div className="stat-tile"><Sprout size={18} style={{ color: 'var(--primary)' }} /><div style={{ fontWeight: 700, fontSize: 18 }}>{user.crops.length}</div><div className="soft" style={{ fontSize: 11.5 }}>Crops</div></div>
          </div>
        </div>

        <form className="card pad-lg" onSubmit={save}>
          <div className="section-title" style={{ marginBottom: 16 }}>Edit details</div>
          <div className="form-grid">
            <div className="field">
              <label className="label">Full name</label>
              <input className="input" value={form.name} onChange={set('name')} />
            </div>
            <div className="field">
              <label className="label">Phone</label>
              <input className="input" value={form.phone} onChange={set('phone')} />
            </div>
            <div className="field">
              <label className="label">Email</label>
              <input className="input" type="email" value={form.email} onChange={set('email')} />
            </div>
            <div className="field">
              <label className="label">Farm size (acres)</label>
              <input className="input" value={form.farmSize} onChange={set('farmSize')} />
            </div>
            <div className="field">
              <label className="label">State</label>
              <select className="select" value={form.state} onChange={set('state')}>
                {INDIAN_STATES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="field">
              <label className="label">District</label>
              <input className="input" value={form.district} onChange={set('district')} />
            </div>
          </div>
          <div className="field">
            <label className="label">Crops (comma separated)</label>
            <input className="input" value={form.crops} onChange={set('crops')} placeholder="Wheat, Paddy, Mustard" />
          </div>
          <button className="btn btn-primary" type="submit"><Save size={18} /> Save changes</button>
        </form>
      </div>
    </div>
  )
}
