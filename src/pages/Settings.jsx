import { useState } from 'react'
import { Settings as SettingsIcon, Sun, Moon, Languages, Thermometer, MapPin, Trash2, Bell } from 'lucide-react'
import { useApp } from '../context/AppContext.jsx'
import Modal from '../components/common/Modal.jsx'

function Switch({ checked, onChange }) {
  return (
    <label className="switch">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="track" />
    </label>
  )
}

const NOTIF_ROWS = [
  ['notifications', 'All notifications', 'Master switch for in-app alerts'],
  ['priceAlerts', 'Price alerts', 'Notify on notable mandi price moves'],
  ['weatherAlerts', 'Weather alerts', 'Rain, heat and frost warnings'],
  ['diseaseAlerts', 'Disease alerts', 'Outbreak warnings for your crops'],
]

export default function Settings() {
  const { theme, language, units, settings, location, setTheme, setLanguage, setUnits, setSettings, resetAll, pushToast } = useApp()
  const [confirm, setConfirm] = useState(false)

  const doReset = () => {
    resetAll()
    setConfirm(false)
    pushToast('All data reset to defaults.', 'info')
  }

  return (
    <div className="page">
      <div className="page-head">
        <div className="page-title">
          <span className="ico"><SettingsIcon size={24} /></span>
          Settings
        </div>
        <p className="page-sub">Personalise appearance, language, units and notifications. Changes apply instantly.</p>
      </div>

      <div className="stack" style={{ gap: 18, maxWidth: 760 }}>
        {/* Appearance */}
        <div className="card pad-lg">
          <div className="section-title" style={{ marginBottom: 6 }}>Appearance</div>
          <div className="set-row">
            <div><div className="k">Theme</div><div className="d">Switch between light and dark mode</div></div>
            <div className="segmented">
              <button className={theme === 'light' ? 'on' : ''} onClick={() => setTheme('light')}><Sun size={15} style={{ verticalAlign: -2 }} /> Light</button>
              <button className={theme === 'dark' ? 'on' : ''} onClick={() => setTheme('dark')}><Moon size={15} style={{ verticalAlign: -2 }} /> Dark</button>
            </div>
          </div>
          <div className="set-row">
            <div><div className="k"><Languages size={15} style={{ verticalAlign: -2 }} /> Language</div><div className="d">Interface language</div></div>
            <div className="segmented">
              <button className={language === 'en' ? 'on' : ''} onClick={() => setLanguage('en')}>English</button>
              <button className={language === 'hi' ? 'on' : ''} onClick={() => setLanguage('hi')}>हिंदी</button>
            </div>
          </div>
          <div className="set-row">
            <div><div className="k"><Thermometer size={15} style={{ verticalAlign: -2 }} /> Temperature unit</div><div className="d">Used across weather</div></div>
            <div className="segmented">
              <button className={units.temp === 'C' ? 'on' : ''} onClick={() => setUnits({ temp: 'C' })}>°C</button>
              <button className={units.temp === 'F' ? 'on' : ''} onClick={() => setUnits({ temp: 'F' })}>°F</button>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="card pad-lg">
          <div className="section-title" style={{ marginBottom: 6 }}><Bell size={16} style={{ verticalAlign: -2 }} /> Notifications</div>
          {NOTIF_ROWS.map(([key, title, desc]) => (
            <div className="set-row" key={key}>
              <div><div className="k">{title}</div><div className="d">{desc}</div></div>
              <Switch
                checked={key === 'notifications' ? settings.notifications : settings.notifications && settings[key]}
                onChange={(v) => setSettings({ [key]: v })}
              />
            </div>
          ))}
        </div>

        {/* Location + data */}
        <div className="card pad-lg">
          <div className="section-title" style={{ marginBottom: 6 }}>Location & data</div>
          <div className="set-row">
            <div><div className="k"><MapPin size={15} style={{ verticalAlign: -2 }} /> Default location</div><div className="d">Change it from the location picker in the top bar</div></div>
            <span className="pill pill-green">{location.name}{location.admin1 ? `, ${location.admin1}` : ''}</span>
          </div>
          <div className="set-row">
            <div><div className="k">Reset all data</div><div className="d">Restore seed data and clear your saved reports, farms and history</div></div>
            <button className="btn btn-danger" onClick={() => setConfirm(true)}><Trash2 size={16} /> Reset</button>
          </div>
        </div>
      </div>

      {confirm && (
        <Modal
          title="Reset all data?"
          onClose={() => setConfirm(false)}
          footer={
            <>
              <button className="btn btn-ghost" onClick={() => setConfirm(false)}>Cancel</button>
              <button className="btn btn-danger" onClick={doReset}><Trash2 size={16} /> Reset everything</button>
            </>
          }
        >
          <p>This will clear your saved reports, farms, history and profile changes, and restore the original sample data. This cannot be undone.</p>
        </Modal>
      )}
    </div>
  )
}
