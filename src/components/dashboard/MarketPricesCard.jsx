import { Link } from 'react-router-dom'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { useT } from '../../i18n/strings.js'
import { DASHBOARD_MARKET } from '../../data/mockData.js'
import { inr } from '../../utils/format.js'

export default function MarketPricesCard() {
  const t = useT()
  return (
    <div className="card mkt-card">
      <div className="mkt-head">
        <span className="section-title">{t('market.title')}</span>
        <Link to="/market-price" className="link-more">
          {t('common.viewAll')}
        </Link>
      </div>
      <table className="table mkt-table">
        <thead>
          <tr>
            <th>{t('market.crop')}</th>
            <th>{t('market.price')}</th>
            <th style={{ textAlign: 'right' }}>{t('market.trend')}</th>
          </tr>
        </thead>
        <tbody>
          {DASHBOARD_MARKET.map((row) => {
            const up = row.trend >= 0
            return (
              <tr key={row.commodity}>
                <td style={{ fontWeight: 600 }}>{row.commodity}</td>
                <td className="num">{inr(row.modal)}</td>
                <td style={{ textAlign: 'right' }}>
                  <span className={`trend ${up ? 'up' : 'down'}`}>
                    {up ? <TrendingUp size={15} /> : <TrendingDown size={15} />}
                    {Math.abs(row.trend).toFixed(2)}%
                  </span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <div className="mkt-foot">
        <Link to="/market-price" className="btn btn-primary btn-block">
          {t('market.checkAll')}
        </Link>
      </div>
    </div>
  )
}
