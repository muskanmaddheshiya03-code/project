import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Tractor, Plus, Pencil, Trash2, MapPin, Sprout, CloudSun, Layers, CalendarDays } from 'lucide-react'
import { useApp } from '../context/AppContext.jsx'
import { CROP_KB } from '../data/mockData.js'
import Modal from '../components/common/Modal.jsx'
import { formatDate } from '../utils/format.js'

const CROPS = Object.keys(CROP_KB)
const SOILS = ['Loam', 'Clay', 'Sandy', 'Silt', 'Black', 'Red', 'Alluvial']
const EMPTY = { name: '', village: '', area: '', crop: 'Wheat', soil: 'Loam', sownOn: '' }

export default function MyFarms() {
  const { farms, addFarm, updateFarm, removeFarm, pushToast } = useApp()
  const [editing, setEditing] = useState(null) // farm object or {} for new
  const [form, setForm] = useState(EMPTY)

  const openNew = () => {
    setForm(EMPTY)
    setEditing({})
  }
  const openEdit = (farm) => {
    setForm({ ...farm })
    setEditing(farm)
  }
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const save = (e) => {
    e.preventDefault()
    if (!form.name.trim()) {
      pushToast('Please enter a farm name.', 'error')
      return
    }
    if (editing.id) {
      updateFarm({ ...form, id: editing.id })
      pushToast('Farm updated.')
    } else {
      addFarm(form)
      pushToast('Farm added.')
    }
    setEditing(null)
  }

  const del = (farm) => {
    removeFarm(farm.id)
    pushToast('Farm removed.', 'info')
  }

  return (
    <div className="page">
      <div className="page-head">
        <div className="row-between" style={{ flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div className="page-title">
              <span className="ico"><Tractor size={24} /></span>
              My Farms
            </div>
            <p className="page-sub">Manage your fields — crops, soil and sowing dates are saved on this device.</p>
          </div>
          <button className="btn btn-primary" onClick={openNew}><Plus size={18} /> Add Farm</button>
        </div>
      </div>

      {farms.length === 0 ? (
        <div className="card empty" style={{ minHeight: 240 }}>
          <span className="empty-ico"><Tractor size={26} /></span>
          <div style={{ fontWeight: 600 }}>No farms yet</div>
          <p className="muted">Add your first field to get tailored advisories and weather.</p>
          <button className="btn btn-primary" onClick={openNew}><Plus size={18} /> Add Farm</button>
        </div>
      ) : (
        <div className="farm-grid">
          {farms.map((f) => (
            <div className="card farm-card" key={f.id}>
              <div className="farm-top">
                <span className="farm-ic"><Sprout size={22} /></span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontFamily: 'var(--font-head)' }}>{f.name}</div>
                  <div className="muted row" style={{ fontSize: 13, gap: 4 }}><MapPin size={13} /> {f.village || '—'}</div>
                </div>
              </div>
              <div className="farm-stats">
                <div className="farm-stat"><div className="k">Crop</div><div className="v">{f.crop}</div></div>
                <div className="farm-stat"><div className="k">Area</div><div className="v">{f.area} acre</div></div>
                <div className="farm-stat"><div className="k row" style={{ gap: 4 }}><Layers size={12} /> Soil</div><div className="v">{f.soil}</div></div>
                <div className="farm-stat"><div className="k row" style={{ gap: 4 }}><CalendarDays size={12} /> Sown</div><div className="v">{f.sownOn ? formatDate(f.sownOn) : '—'}</div></div>
              </div>
              <div className="farm-actions">
                <Link className="btn btn-soft btn-sm" to="/crop-advisory"><Sprout size={15} /> Advisory</Link>
                <Link className="btn btn-ghost btn-sm" to="/weather"><CloudSun size={15} /> Weather</Link>
                <button className="btn btn-ghost btn-sm" onClick={() => openEdit(f)} aria-label="Edit"><Pencil size={15} /></button>
                <button className="btn btn-danger btn-sm" onClick={() => del(f)} aria-label="Delete"><Trash2 size={15} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <Modal
          title={editing.id ? 'Edit Farm' : 'Add Farm'}
          onClose={() => setEditing(null)}
          footer={
            <>
              <button className="btn btn-ghost" onClick={() => setEditing(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={save}>{editing.id ? 'Save changes' : 'Add farm'}</button>
            </>
          }
        >
          <form onSubmit={save}>
            <div className="field">
              <label className="label">Farm name</label>
              <input className="input" value={form.name} onChange={set('name')} placeholder="e.g. North Field" />
            </div>
            <div className="field">
              <label className="label">Village / location</label>
              <input className="input" value={form.village} onChange={set('village')} placeholder="e.g. Kakori, Lucknow" />
            </div>
            <div className="form-grid">
              <div className="field">
                <label className="label">Crop</label>
                <select className="select" value={form.crop} onChange={set('crop')}>{CROPS.map((c) => <option key={c}>{c}</option>)}</select>
              </div>
              <div className="field">
                <label className="label">Soil type</label>
                <select className="select" value={form.soil} onChange={set('soil')}>{SOILS.map((s) => <option key={s}>{s}</option>)}</select>
              </div>
              <div className="field">
                <label className="label">Area (acres)</label>
                <input className="input" type="number" min="0.1" step="0.1" value={form.area} onChange={set('area')} placeholder="2.5" />
              </div>
              <div className="field">
                <label className="label">Sown on</label>
                <input className="input" type="date" value={form.sownOn} onChange={set('sownOn')} />
              </div>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
