import { useCallback, useRef, useState } from 'react'
import {
  ScanLine,
  UploadCloud,
  Loader2,
  Bug,
  CheckCircle2,
  RefreshCw,
  Save,
  Sparkles,
  ShieldCheck,
} from 'lucide-react'
import { useApp } from '../context/AppContext.jsx'
import { DISEASE_KB } from '../data/mockData.js'
import { formatDate } from '../utils/format.js'

const SEV_PILL = { High: 'pill-amber', Medium: 'pill-teal', Low: 'pill-purple', None: 'pill-green' }
const today = () => new Date().toISOString().slice(0, 10)

/* Deterministic string hash so the same image always yields the same result. */
function hashStr(s) {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0
  return h
}

export default function DiseaseDetection() {
  const { addReport, addHistory, addNotification, pushToast } = useApp()
  const inputRef = useRef(null)
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState('')
  const [drag, setDrag] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState(null)
  const [saved, setSaved] = useState(false)

  const pickFile = useCallback((f) => {
    if (!f || !f.type.startsWith('image/')) {
      pushToast('Please choose an image file (JPG / PNG).', 'error')
      return
    }
    setResult(null)
    setSaved(false)
    setFile(f)
    setPreview((old) => {
      if (old) URL.revokeObjectURL(old)
      return URL.createObjectURL(f)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onDrop = (e) => {
    e.preventDefault()
    setDrag(false)
    pickFile(e.dataTransfer.files?.[0])
  }

  const analyze = () => {
    if (!file) return
    setAnalyzing(true)
    setResult(null)
    setSaved(false)
    const seed = hashStr(`${file.name}:${file.size}`)
    setTimeout(() => {
      const hit = DISEASE_KB[seed % DISEASE_KB.length]
      const confidence = hit.severity === 'None' ? 90 + (seed % 8) : 85 + (seed % 13)
      setResult({ ...hit, confidence })
      setAnalyzing(false)
    }, 1600)
  }

  const reset = () => {
    if (preview) URL.revokeObjectURL(preview)
    setFile(null)
    setPreview('')
    setResult(null)
    setSaved(false)
  }

  const save = () => {
    if (!result) return
    const healthy = result.severity === 'None'
    addReport({
      type: 'disease',
      title: `${result.crop} · ${result.disease}`,
      crop: result.crop,
      date: today(),
      summary: `Confidence: ${result.confidence}%`,
      confidence: result.confidence,
      detail: {
        disease: result.disease,
        cause: result.cause,
        symptoms: result.symptoms,
        treatment: result.treatment,
      },
    })
    addHistory({ type: 'disease', text: `Analyzed ${result.crop} leaf — ${result.disease} (${result.confidence}%)`, date: today() })
    if (!healthy) {
      addNotification({
        tone: 'warn',
        title: `${result.disease} detected`,
        body: `On your ${result.crop} sample. Tap to review treatment.`,
        time: 'just now',
        link: '/saved-reports',
      })
    }
    setSaved(true)
    pushToast('Report saved to Saved Reports.')
  }

  const healthy = result?.severity === 'None'

  return (
    <div className="page">
      <div className="page-head">
        <div className="page-title">
          <span className="ico"><ScanLine size={24} /></span>
          Disease Detection
        </div>
        <p className="page-sub">
          Upload a photo of an affected leaf and get an instant diagnosis with treatment steps.
        </p>
      </div>

      <div className="grid-2" style={{ alignItems: 'start' }}>
        {/* Upload */}
        <div className="card pad-lg">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => pickFile(e.target.files?.[0])}
          />
          {!preview ? (
            <div
              className={`dropzone ${drag ? 'drag' : ''}`}
              onClick={() => inputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault()
                setDrag(true)
              }}
              onDragLeave={() => setDrag(false)}
              onDrop={onDrop}
            >
              <span className="dz-ico"><UploadCloud size={30} /></span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 16 }}>Drop leaf image here</div>
                <div className="muted" style={{ fontSize: 13.5 }}>or click to browse (JPG, PNG)</div>
              </div>
            </div>
          ) : (
            <div className="stack" style={{ gap: 14 }}>
              <img className="preview-img" src={preview} alt="Leaf preview" />
              <div className="row" style={{ gap: 10 }}>
                <button className="btn btn-primary" onClick={analyze} disabled={analyzing}>
                  {analyzing ? <span className="spinner" /> : <Sparkles size={18} />}
                  {analyzing ? 'Analyzing…' : 'Analyze Image'}
                </button>
                <button className="btn btn-ghost" onClick={() => inputRef.current?.click()} disabled={analyzing}>
                  <RefreshCw size={16} /> Change
                </button>
              </div>
            </div>
          )}
          <div className="note mt-16">
            <Sparkles size={14} /> AI diagnosis is simulated on-device from a curated knowledge base — no image leaves your browser.
          </div>
        </div>

        {/* Result */}
        <div className="card pad-lg">
          {!result && !analyzing && (
            <div className="empty" style={{ padding: '40px 20px' }}>
              <span className="empty-ico"><Bug size={26} /></span>
              <div style={{ fontWeight: 600 }}>No analysis yet</div>
              <p className="muted" style={{ fontSize: 14 }}>Upload a leaf image and press Analyze to see the diagnosis.</p>
            </div>
          )}

          {analyzing && (
            <div className="empty" style={{ padding: '40px 20px' }}>
              <Loader2 size={34} className="spin" style={{ color: 'var(--primary)' }} />
              <div style={{ fontWeight: 600 }}>Scanning leaf patterns…</div>
              <p className="muted" style={{ fontSize: 14 }}>Matching symptoms against the disease library.</p>
            </div>
          )}

          {result && !analyzing && (
            <div className="stack" style={{ gap: 16 }}>
              <div className="result-head">
                <span className={`result-badge ${healthy ? 'alert-success' : 'alert-warn'}`}>
                  {healthy ? <CheckCircle2 size={24} /> : <Bug size={24} />}
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 18 }}>{result.disease}</div>
                  <div className="muted" style={{ fontSize: 13.5 }}>{result.crop} · analyzed {formatDate(today())}</div>
                </div>
                <span className={`pill ${SEV_PILL[result.severity] || 'pill-gray'}`}>{result.severity}</span>
              </div>

              <div>
                <div className="row-between">
                  <span className="label" style={{ margin: 0 }}>Confidence</span>
                  <strong>{result.confidence}%</strong>
                </div>
                <div className="meter"><span style={{ width: `${result.confidence}%` }} /></div>
              </div>

              <div>
                <div className="label">Cause</div>
                <p>{result.cause}</p>
              </div>
              <div>
                <div className="label">Symptoms</div>
                <ul className="bullet-list">{result.symptoms.map((s, i) => <li key={i}>{s}</li>)}</ul>
              </div>
              <div>
                <div className="label">{healthy ? 'Recommended care' : 'Recommended treatment'}</div>
                <ul className="bullet-list">{result.treatment.map((s, i) => <li key={i}>{s}</li>)}</ul>
              </div>
              <div>
                <div className="label"><ShieldCheck size={14} style={{ verticalAlign: -2 }} /> Prevention</div>
                <ul className="bullet-list">{result.prevention.map((s, i) => <li key={i}>{s}</li>)}</ul>
              </div>

              <div className="row" style={{ gap: 10 }}>
                <button className="btn btn-primary" onClick={save} disabled={saved}>
                  {saved ? <CheckCircle2 size={18} /> : <Save size={18} />} {saved ? 'Saved' : 'Save Report'}
                </button>
                <button className="btn btn-ghost" onClick={reset}>Analyze another</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
