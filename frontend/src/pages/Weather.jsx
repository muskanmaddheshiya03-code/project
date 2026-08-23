import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import {
  CloudSun,
  Droplets,
  Wind,
  CloudRain,
  Thermometer,
  Sunrise,
  Sunset,
  Sprout,
  AlertTriangle,
} from 'lucide-react'
import { useApp } from '../context/AppContext.jsx'
import { useWeather } from '../hooks/useWeather.js'
import { formatTemp, dayName, isToday } from '../utils/format.js'
import WeatherIcon from '../components/common/WeatherIcon.jsx'

const timeOnly = (iso) => (iso ? new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--')

const chartColors = (dark) => ({
  grid: dark ? '#253128' : '#e6ebe6',
  axis: dark ? '#a2b3a8' : '#6b7c74',
  line: '#2f9e5b',
})

function buildTips(data, unit) {
  if (!data) return []
  const c = data.current
  const tips = []
  const rainSoon = data.days.slice(0, 2).some((d) => d.rain >= 60) || c.rain >= 60
  if (rainSoon) tips.push({ tone: 'warn', text: 'Rain likely in the next 48h — postpone spraying and nitrogen top-dressing until the field dries.' })
  if (c.temp >= 35) tips.push({ tone: 'warn', text: `High heat (${formatTemp(c.temp, unit)}) — irrigate in the early morning or evening to cut evaporation.` })
  if (c.temp <= 8) tips.push({ tone: 'warn', text: 'Cold spell — watch for frost on sensitive crops; light evening irrigation can protect them.' })
  if (c.humidity >= 80) tips.push({ tone: 'warn', text: 'High humidity — scout for fungal diseases like rust and blight, and improve airflow.' })
  if (c.wind >= 25) tips.push({ tone: 'warn', text: `Windy (${c.wind} km/h) — avoid pesticide/herbicide spraying to prevent drift.` })
  if (!rainSoon && c.temp < 33 && c.humidity < 75) tips.push({ tone: 'good', text: 'Weather looks favourable for field work, sowing and light irrigation.' })
  tips.push({ tone: 'good', text: 'Always check the 7-day outlook before scheduling irrigation or harvest.' })
  return tips
}

export default function Weather() {
  const { location, units } = useApp()
  const { data, loading, error } = useWeather(location)
  const { grid, axis, line } = chartColors(document.documentElement.dataset.theme === 'dark')

  const title = `${location.name}${location.admin1 ? ', ' + location.admin1 : ''}`

  return (
    <div className="page">
      <div className="page-head">
        <div className="page-title">
          <span className="ico"><CloudSun size={24} /></span>
          Weather
        </div>
        <p className="page-sub">Live forecast for {title} — powered by Open-Meteo.</p>
      </div>

      {loading && (
        <div className="card empty" style={{ minHeight: 200 }}>
          <div className="spinner dark" /> <span className="muted">Loading live weather…</span>
        </div>
      )}

      {!loading && error && (
        <div className="card empty" style={{ minHeight: 200 }}>
          <span className="empty-ico"><CloudSun size={26} /></span>
          <div style={{ fontWeight: 600 }}>Live weather unavailable</div>
          <p className="muted">Please check your connection and try again.</p>
        </div>
      )}

      {!loading && data && (
        <div className="stack" style={{ gap: 20 }}>
          {/* Current */}
          <div className="wx-current">
            <div className="wx-hero">
              <div className="row-between">
                <div>
                  <div className="soft" style={{ color: '#c7e6d3', fontSize: 13 }}>{title}</div>
                  <div className="big">{formatTemp(data.current.temp, units.temp)}</div>
                  <div style={{ color: '#e9f6ee' }}>{data.current.label}</div>
                </div>
                <WeatherIcon name={data.current.icon} size={76} strokeWidth={1.4} color="#ffe08a" />
              </div>
              <div className="row" style={{ gap: 18, marginTop: 18, color: '#c7e6d3', flexWrap: 'wrap' }}>
                <span className="row" style={{ gap: 6 }}><Thermometer size={16} /> Feels {formatTemp(data.current.feels, units.temp)}</span>
                <span className="row" style={{ gap: 6 }}><Sunrise size={16} /> {timeOnly(data.current.sunrise)}</span>
                <span className="row" style={{ gap: 6 }}><Sunset size={16} /> {timeOnly(data.current.sunset)}</span>
              </div>
            </div>

            <div className="wx-stats">
              <div className="wx-stat"><span className="ic"><Droplets size={20} /></span><div><div className="muted" style={{ fontSize: 12.5 }}>Humidity</div><div style={{ fontWeight: 700, fontSize: 20 }}>{data.current.humidity}%</div></div></div>
              <div className="wx-stat"><span className="ic"><CloudRain size={20} /></span><div><div className="muted" style={{ fontSize: 12.5 }}>Rain chance</div><div style={{ fontWeight: 700, fontSize: 20 }}>{data.current.rain}%</div></div></div>
              <div className="wx-stat"><span className="ic"><Wind size={20} /></span><div><div className="muted" style={{ fontSize: 12.5 }}>Wind</div><div style={{ fontWeight: 700, fontSize: 20 }}>{data.current.wind} km/h</div></div></div>
              <div className="wx-stat"><span className="ic"><Thermometer size={20} /></span><div><div className="muted" style={{ fontSize: 12.5 }}>Min / Max</div><div style={{ fontWeight: 700, fontSize: 20 }}>{formatTemp(data.current.min, units.temp, false)}° / {formatTemp(data.current.max, units.temp, false)}°</div></div></div>
            </div>
          </div>

          {/* Hourly chart */}
          <div className="card pad-lg">
            <div className="section-title" style={{ marginBottom: 4 }}>Next 24 hours</div>
            <div className="muted" style={{ fontSize: 13, marginBottom: 12 }}>Temperature ({units.temp === 'F' ? '°F' : '°C'})</div>
            <div className="chart-box">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.hourly.map((h) => ({ ...h, t: units.temp === 'F' ? Math.round((h.temp * 9) / 5 + 32) : h.temp }))} margin={{ top: 8, right: 12, left: 4, bottom: 0 }}>
                  <CartesianGrid stroke={grid} vertical={false} />
                  <XAxis dataKey="label" stroke={axis} tickLine={false} axisLine={false} fontSize={12} interval={2} />
                  <YAxis stroke={axis} tickLine={false} axisLine={false} fontSize={12} width={38} tickFormatter={(v) => `${v}°`} />
                  <Tooltip
                    contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10 }}
                    formatter={(v) => [`${v}°`, 'Temp']}
                  />
                  <Line type="monotone" dataKey="t" stroke={line} strokeWidth={2} dot={false} activeDot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 7-day */}
          <div className="card pad-lg">
            <div className="section-title" style={{ marginBottom: 14 }}>7-day forecast</div>
            <div className="day-grid">
              {data.days.map((d) => (
                <div className={`day-card ${isToday(d.date) ? 'today' : ''}`} key={d.date}>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{isToday(d.date) ? 'Today' : dayName(d.date)}</div>
                  <WeatherIcon name={d.icon} size={30} strokeWidth={1.7} />
                  <div className="day-temp">{formatTemp(d.max, units.temp, false)}°</div>
                  <div className="soft" style={{ fontSize: 12 }}>{formatTemp(d.min, units.temp, false)}°</div>
                  <div className="pill pill-teal" style={{ fontSize: 11, padding: '2px 8px' }}><CloudRain size={11} /> {d.rain}%</div>
                </div>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="card pad-lg">
            <div className="section-title" style={{ marginBottom: 6 }}>Farming tips for this weather</div>
            <div>
              {buildTips(data, units.temp).map((tip, i) => (
                <div className="tip-item" key={i}>
                  <span className="ic" style={tip.tone === 'warn' ? { background: 'var(--amber-soft)', color: 'var(--amber)' } : undefined}>
                    {tip.tone === 'warn' ? <AlertTriangle size={16} /> : <Sprout size={16} />}
                  </span>
                  <div style={{ alignSelf: 'center' }}>{tip.text}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
