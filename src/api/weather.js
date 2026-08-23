import { WEATHER_CODES } from '../data/mockData.js'

const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast'
const GEO_URL = 'https://geocoding-api.open-meteo.com/v1/search'

export function codeInfo(code) {
  return WEATHER_CODES[code] || { label: 'Unknown', icon: 'cloud' }
}

/** Live current + 7-day + next-24h forecast from Open-Meteo (free, no key). */
export async function fetchWeather({ lat, lon }) {
  const params = new URLSearchParams({
    latitude: lat,
    longitude: lon,
    current:
      'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m',
    hourly: 'temperature_2m,precipitation_probability,weather_code',
    daily:
      'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max,sunrise,sunset',
    timezone: 'auto',
    forecast_days: '7',
  })
  const res = await fetch(`${FORECAST_URL}?${params.toString()}`)
  if (!res.ok) throw new Error('Weather request failed')
  return normalizeWeather(await res.json())
}

function normalizeWeather(d) {
  const c = d.current || {}
  const daily = d.daily || {}
  const days = (daily.time || []).map((t, i) => ({
    date: t,
    code: daily.weather_code[i],
    ...codeInfo(daily.weather_code[i]),
    max: Math.round(daily.temperature_2m_max[i]),
    min: Math.round(daily.temperature_2m_min[i]),
    rain: daily.precipitation_probability_max?.[i] ?? 0,
    wind: Math.round(daily.wind_speed_10m_max?.[i] ?? 0),
    sunrise: daily.sunrise?.[i],
    sunset: daily.sunset?.[i],
  }))

  const now = new Date()
  const hourly = []
  if (d.hourly?.time) {
    for (let i = 0; i < d.hourly.time.length && hourly.length < 24; i++) {
      const t = new Date(d.hourly.time[i])
      if (t >= now) {
        hourly.push({
          time: d.hourly.time[i],
          label: t.toLocaleTimeString([], { hour: 'numeric' }),
          temp: Math.round(d.hourly.temperature_2m[i]),
          rain: d.hourly.precipitation_probability?.[i] ?? 0,
        })
      }
    }
  }

  return {
    current: {
      temp: Math.round(c.temperature_2m ?? 0),
      feels: Math.round(c.apparent_temperature ?? 0),
      humidity: Math.round(c.relative_humidity_2m ?? 0),
      wind: Math.round(c.wind_speed_10m ?? 0),
      code: c.weather_code,
      ...codeInfo(c.weather_code),
      rain: daily.precipitation_probability_max?.[0] ?? 0,
      min: Math.round(daily.temperature_2m_min?.[0] ?? 0),
      max: Math.round(daily.temperature_2m_max?.[0] ?? 0),
      sunrise: daily.sunrise?.[0],
      sunset: daily.sunset?.[0],
    },
    days,
    hourly,
  }
}

/** Geocoding search for the location picker (free, no key). */
export async function searchLocations(query) {
  const params = new URLSearchParams({
    name: query,
    count: '6',
    language: 'en',
    format: 'json',
  })
  const res = await fetch(`${GEO_URL}?${params.toString()}`)
  if (!res.ok) throw new Error('Location search failed')
  const data = await res.json()
  return (data.results || []).map((r) => ({
    name: r.name,
    admin1: r.admin1 || '',
    country: r.country || '',
    lat: r.latitude,
    lon: r.longitude,
  }))
}
