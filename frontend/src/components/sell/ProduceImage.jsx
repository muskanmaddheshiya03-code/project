import { Sprout } from 'lucide-react'
import { photoTileFor } from '../../data/sellData.js'

/* Shows an uploaded image if present, otherwise a crop-themed gradient tile
   (keeps localStorage light — we never persist base64 images). Children are
   rendered as overlays (badges, category chip). */
export default function ProduceImage({ crop, images = [], iconSize = 34, className = '', children }) {
  const hasImg = Array.isArray(images) && images.length > 0
  const [c1, c2] = photoTileFor(crop)
  return (
    <div
      className={`produce-thumb ${className}`}
      style={hasImg ? undefined : { background: `linear-gradient(150deg, ${c1}, ${c2})` }}
    >
      {hasImg ? <img src={images[0]} alt={crop} /> : <Sprout size={iconSize} strokeWidth={2} />}
      {children}
    </div>
  )
}
