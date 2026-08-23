import { useCallback, useEffect, useState } from 'react'
import { fetchMarketPrices, fallbackMarket } from '../api/market.js'

/** Mandi prices for a state; falls back to bundled sample rows on any failure. */
export function useMarketPrices(stateName) {
  const [data, setData] = useState({ rows: [], live: false, loading: true, error: null })

  const load = useCallback(() => {
    let alive = true
    setData((d) => ({ ...d, loading: true }))
    fetchMarketPrices({ state: stateName })
      .then((res) => {
        if (alive) setData({ ...res, loading: false, error: null })
      })
      .catch(() => {
        if (alive) setData({ ...fallbackMarket(), loading: false, error: 'offline' })
      })
    return () => {
      alive = false
    }
  }, [stateName])

  useEffect(() => {
    const cleanup = load()
    return cleanup
  }, [load])

  return { ...data, refresh: load }
}
