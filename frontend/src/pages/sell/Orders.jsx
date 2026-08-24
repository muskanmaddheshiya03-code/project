import { Link } from 'react-router-dom'
import { Package, Sprout, PackageOpen } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'
import { useT } from '../../i18n/strings.js'
import { inr, formatDate } from '../../utils/format.js'
import StatusPill from '../../components/sell/StatusPill.jsx'

export default function Orders() {
  const { sell } = useApp()
  const t = useT()

  const listingOf = (id) => sell.listings.find((l) => l.id === id)
  const orders = sell.orders

  return (
    <div className="page">
      <div className="page-head">
        <div className="page-title">
          <span className="ico">
            <Package size={24} />
          </span>
          {t('sell.orders.title')}
        </div>
        <p className="page-sub">{t('sell.orders.sub')}</p>
      </div>

      {orders.length === 0 ? (
        <div className="card empty" style={{ minHeight: 220 }}>
          <span className="empty-ico">
            <PackageOpen size={26} />
          </span>
          <p className="muted">{t('sell.noOrders')}</p>
        </div>
      ) : (
        <div className="card" style={{ padding: '6px 8px' }}>
          {orders.map((o) => {
            const listing = listingOf(o.listingId)
            const who = o.buyerMine ? listing?.farmer?.name : o.buyer
            const roleLabel = o.buyerMine ? t('sell.farmer') : t('sell.buyer')
            const amount = o.finalPrice ?? o.expectedPrice
            return (
              <Link className="order-row" key={o.id} to={`/sell/order/${o.id}`}>
                <span className="or-ic" style={{ background: o.buyerMine ? 'var(--primary)' : 'var(--teal)' }}>
                  <Sprout size={20} />
                </span>
                <div className="or-main">
                  <div className="or-title">
                    {o.crop} · {o.quantity} {o.unit}
                  </div>
                  <div className="or-sub">
                    {roleLabel}: {who || '—'} · {inr(amount)}/{o.unit} · {formatDate(o.createdAt)}
                  </div>
                </div>
                <div className="order-actions">
                  <StatusPill status={o.status} />
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
