import { Link } from 'react-router-dom'
import { Droplets, CloudRain, Wind, ArrowRight } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'
import { useT } from '../../i18n/strings.js'
import { useWeather } from '../../hooks/useWeather.js'
import { formatTemp } from '../../utils/format.js'
import WeatherIcon from '../common/WeatherIcon.jsx'

export default function WeatherCard() {
  const { location, units } = useApp()
  const t = useT()
  const { data, loading, error } = useWeather(location)
  const cur = data?.current

  return (
    <div className="wcard">
      <div className="wcard-head">{t('weather.today')}</div>

      {loading && <div className="wcard-msg">Loading live weather…</div>}

      {!loading && error && (
        <div className="wcard-msg">
          Live weather unavailable right now.{' '}
          <Link to="/weather" style={{ textDecoration: 'underline' }}>
            Open Weather
          </Link>
        </div>
      )}

      {!loading && cur && (
        <>
          <div className="wcard-top">
            <div className="wcard-now">
              <WeatherIcon name={cur.icon} size={52} strokeWidth={1.6} />
              <div>
                <div className="wtemp">{formatTemp(cur.temp, units.temp)}</div>
                <div className="wcond">{cur.label}</div>
              </div>
            </div>
            <div className="wmetrics">
              <div className="wmetric">
                <Droplets size={16} />
                <span>
                  {t('weather.humidity')}
                  <b>{cur.humidity}%</b>
                </span>
              </div>
              <div className="wmetric">
                <CloudRain size={16} />
                <span>
                  {t('weather.rain')}
                  <b>{cur.rain}%</b>
                </span>
              </div>
              <div className="wmetric">
                <Wind size={16} />
                <span>
                  {t('weather.wind')}
                  <b>{cur.wind} km/h</b>
                </span>
              </div>
            </div>
          </div>

          <div className="wcard-foot">
            <span>
              {t('weather.min')}: {formatTemp(cur.min, units.temp)} &nbsp; {t('weather.max')}:{' '}
              {formatTemp(cur.max, units.temp)}
            </span>
            <Link to="/weather" className="wforecast">
              {t('weather.viewForecast')} <ArrowRight size={15} />
            </Link>
          </div>
        </>
      )}
    </div>
  )
}
