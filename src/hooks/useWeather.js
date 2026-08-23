import { useEffect, useState } from 'react'
import { fetchWeather } from '../api/weather.js'

/** Live weather for a location, with loading/error state. */
export function useWeather(location) {
  const [state, setState] = useState({ data: null, loading: true, error: null })

  useEffect(() => {
    let alive = true
    setState((s) => ({ ...s, loading: true, error: null }))
    fetchWeather(location)
      .then((data) => {
        if (alive) setState({ data, loading: false, error: null })
      })
      .catch((e) => {
        if (alive) setState({ data: null, loading: false, error: e.message || 'error' })
      })
    return () => {
      alive = false
    }
  }, [location.lat, location.lon])

  return state
}
