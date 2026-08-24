import { Link } from 'react-router-dom'
import { MapPin, BadgeCheck } from 'lucide-react'
import ProduceImage from './ProduceImage.jsx'
import { useApp } from '../../context/AppContext.jsx'
import { useT } from '../../i18n/strings.js'
import { inr, formatDate } from '../../utils/format.js'
import { remainingQty } from '../../data/sellData.js'

/* Card used in the Marketplace and My Produce grids. Reuses .card. */
export default function ProduceCard({ listing }) {
  const { sell } = useApp()
  const t = useT()
  const harvested = listing.status === 'harvested' && listing.harvest
  const price = harvested ? listing.harvest.finalPrice : listing.price
  const grade = harvested ? listing.harvest.grade : listing.grade
  const remaining = remainingQty(listing, sell.orders)

  return (
    <div className="card produce-card">
      <ProduceImage crop={listing.crop} images={listing.images}>
        <span className="pt-badge pill pill-green">
          <BadgeCheck size={12} /> {t('sell.verify.infoBadge')}
        </span>
        <span className="pt-cat pill pill-gray">{listing.category}</span>
      </ProduceImage>
      <div className="produce-body">
        <div className="produce-title">{listing.crop}</div>
        <div className="produce-farmer">
          <MapPin size={12} /> {listing.farmer.name} · {listing.location}
        </div>
        <div className="row-between">
          <span className="produce-price">
            {inr(price)}
            <span className="muted" style={{ fontSize: 12, fontWeight: 500 }}>
              {' '}
              /{listing.unit}
            </span>
          </span>
          <span className="pill pill-gray">
            {t('sell.gradePrefix')} {grade}
          </span>
        </div>
        <div className="muted" style={{ fontSize: 12.5 }}>
          {harvested ? (
            <>
              {t('sell.harvested')} · {t('sell.remaining')} {remaining} {listing.unit}
            </>
          ) : (
            <>
              {t('sell.expectedHarvest')}: {formatDate(listing.harvestDate)}
            </>
          )}
        </div>
        <div className="produce-foot">
          {listing.mine ? (
            <Link className="btn btn-ghost btn-sm btn-block" to={`/sell/product/${listing.id}`}>
              {t('sell.manageListing')}
            </Link>
          ) : (
            <Link className="btn btn-primary btn-sm btn-block" to={`/sell/product/${listing.id}`}>
              {t('sell.viewDetails')}
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
