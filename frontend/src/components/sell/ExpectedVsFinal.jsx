import { useT } from '../../i18n/strings.js'
import { inr } from '../../utils/format.js'

/* Side-by-side Expected (at listing time) vs Final/Confirmed (at harvest).
   Used at consumer reconfirmation and on the order detail page. */
export default function ExpectedVsFinal({ order, harvest, unit }) {
  const t = useT()
  return (
    <div className="exp-final">
      <div className="exp-col">
        <h4>{t('sell.expected')}</h4>
        <div className="exp-row">
          <span className="k">{t('sell.expectedPrice')}</span>
          <span className="v">
            {inr(order.expectedPrice)}/{unit}
          </span>
        </div>
        <div className="exp-row">
          <span className="k">{t('sell.reservedQuantity')}</span>
          <span className="v">
            {order.quantity} {unit}
          </span>
        </div>
      </div>
      <div className="exp-col final">
        <h4>{t('sell.final')}</h4>
        {harvest ? (
          <>
            <div className="exp-row">
              <span className="k">{t('sell.finalPriceLabel')}</span>
              <span className="v">
                {inr(harvest.finalPrice)}/{unit}
              </span>
            </div>
            <div className="exp-row">
              <span className="k">{t('sell.availableGradeLabel')}</span>
              <span className="v">
                {t('sell.gradePrefix')} {harvest.grade}
              </span>
            </div>
            <div className="exp-row">
              <span className="k">{t('sell.actualQuantity')}</span>
              <span className="v">
                {harvest.actualQuantity} {unit}
              </span>
            </div>
          </>
        ) : (
          <div className="muted" style={{ fontSize: 13 }}>
            —
          </div>
        )}
      </div>
    </div>
  )
}
