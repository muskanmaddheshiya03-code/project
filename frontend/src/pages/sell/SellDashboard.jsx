import { Link } from 'react-router-dom'
import {
  PlusCircle,
  ShoppingCart,
  ClipboardList,
  Package,
  ArrowRight,
  Sprout,
  Store,
} from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'
import { useT } from '../../i18n/strings.js'
import { formatDate } from '../../utils/format.js'
import { isTerminal } from '../../data/sellData.js'
import StatusPill from '../../components/sell/StatusPill.jsx'

const QUICK = [
  { to: '/sell/add-produce', key: 'nav.sell.addProduce', Icon: PlusCircle, ico: 'ico-green', descKey: 'sell.addProduce.sub' },
  { to: '/sell/marketplace', key: 'nav.sell.marketplace', Icon: ShoppingCart, ico: 'ico-orange', descKey: 'sell.marketplace.sub' },
  { to: '/sell/reservations', key: 'nav.sell.reservations', Icon: ClipboardList, ico: 'ico-purple', descKey: 'sell.reservations.sub' },
  { to: '/sell/orders', key: 'nav.sell.orders', Icon: Package, ico: 'ico-teal', descKey: 'sell.orders.sub' },
]

export default function SellDashboard() {
  const { sell } = useApp()
  const t = useT()

  const listingMine = (id) => sell.listings.find((l) => l.id === id)?.mine
  const myListings = sell.listings.filter((l) => l.mine)
  const incomingPending = sell.orders.filter(
    (o) => listingMine(o.listingId) && o.status === 'reservation_pending'
  )
  const myAwaiting = sell.orders.filter((o) => o.buyerMine && o.status === 'awaiting_consumer')
  const activeOrders = sell.orders.filter((o) => !isTerminal(o.status))
  const needsAction = incomingPending.length + myAwaiting.length

  const stats = [
    { val: myListings.length, lbl: t('sell.stat.listings') },
    { val: incomingPending.length, lbl: t('sell.stat.pending') },
    { val: needsAction, lbl: t('sell.stat.action') },
    { val: activeOrders.length, lbl: t('sell.stat.orders') },
  ]

  const recent = [...sell.orders]
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
    .slice(0, 5)

  return (
    <div className="page stack">
      {/* Hero */}
      <div className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            {t('sell.dash.heroTitle1')} <span className="accent">{t('sell.dash.heroTitle2')}</span>
          </h1>
          <p className="hero-desc">{t('sell.dash.heroDesc')}</p>
          <div className="row" style={{ gap: 10, flexWrap: 'wrap' }}>
            <Link className="btn btn-primary btn-lg" to="/sell/add-produce">
              <PlusCircle size={18} /> {t('sell.addProduceCta')}
            </Link>
            <Link className="btn btn-ghost btn-lg" to="/sell/marketplace">
              <ShoppingCart size={18} /> {t('sell.browseMarket')}
            </Link>
          </div>
        </div>
      </div>

      {/* Stat tiles */}
      <div className="grid-4">
        {stats.map((s, i) => (
          <div className="stat-tile" key={i}>
            <div className="stat-val">{s.val}</div>
            <div className="stat-lbl">{s.lbl}</div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div>
        <div className="section-head">
          <div className="section-title">{t('sell.dash.quickActions')}</div>
        </div>
        <div className="feature-grid">
          {QUICK.map(({ to, key, Icon, ico }) => (
            <Link className="card feature-card" key={to} to={to}>
              <span className={`feature-ico ${ico}`}>
                <Icon size={26} />
              </span>
              <div className="feature-title">{t(key)}</div>
              <div className="feature-cta">
                {t('common.getStarted')} <ArrowRight size={15} />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent activity */}
      <div className="card">
        <div className="section-head" style={{ padding: '16px 18px 0', marginBottom: 6 }}>
          <div className="section-title">{t('sell.dash.recent')}</div>
          <Link className="link-more" to="/sell/orders">
            {t('common.viewAll')} <ArrowRight size={14} />
          </Link>
        </div>
        {recent.length === 0 ? (
          <div className="empty" style={{ padding: '30px 20px' }}>
            <span className="empty-ico">
              <Store size={24} />
            </span>
            <p className="muted">{t('sell.noOrders')}</p>
          </div>
        ) : (
          <div style={{ padding: '4px 8px 10px' }}>
            {recent.map((o) => {
              const listing = sell.listings.find((l) => l.id === o.listingId)
              const who = o.buyerMine ? listing?.farmer?.name : o.buyer
              return (
                <Link className="order-row" key={o.id} to={`/sell/order/${o.id}`} style={{ borderRadius: 12 }}>
                  <span className="or-ic" style={{ background: 'var(--primary)' }}>
                    <Sprout size={20} />
                  </span>
                  <div className="or-main">
                    <div className="or-title">
                      {o.crop} · {o.quantity} {o.unit}
                    </div>
                    <div className="or-sub">
                      {(o.buyerMine ? t('sell.farmer') : t('sell.buyer')) + ': '}
                      {who} · {formatDate(o.createdAt)}
                    </div>
                  </div>
                  <StatusPill status={o.status} />
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
