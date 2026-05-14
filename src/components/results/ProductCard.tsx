import GlassCard from '../ui/GlassCard'
import RatingBar from '../ui/RatingBar'
import type { SheetProduct, PillowProduct } from '../../lib/types'

interface SheetCardProps {
  product: SheetProduct
  type: 'sheet'
}

interface PillowCardProps {
  product: PillowProduct
  type: 'pillow'
}

type ProductCardProps = SheetCardProps | PillowCardProps

const loftVisual: Record<string, number> = { Low: 1, Medium: 3, High: 5 }
const firmnessVisual: Record<string, number> = { Soft: 2, Medium: 3, Firm: 5 }

export default function ProductCard(props: ProductCardProps) {
  const { product, type } = props

  return (
    <GlassCard className="p-7">
      <div className="flex items-start justify-between mb-5 gap-4">
        <div>
          <p className="text-xs font-semibold tracking-widest uppercase text-charcoal/40 mb-1">
            {type === 'sheet' ? 'Your Sheet Recommendation' : 'Your Pillow Recommendation'}
          </p>
          <h2 className="text-2xl font-semibold text-charcoal tracking-tight">{product.name}</h2>
        </div>
        <span className="text-xs bg-charcoal/8 text-charcoal/60 px-3 py-1.5 rounded-full font-medium flex-shrink-0 self-start">
          {type === 'sheet'
            ? (product as SheetProduct).material
            : (product as PillowProduct).fill}
        </span>
      </div>

      <p className="text-charcoal/60 text-sm leading-relaxed mb-6">{product.description}</p>

      {type === 'sheet' ? (
        <div className="space-y-3 mb-6">
          <RatingBar label="Breathability" value={(product as SheetProduct).ratings.breathability} />
          <RatingBar label="Moisture Wicking" value={(product as SheetProduct).ratings.wicking} colorClass="bg-blue-400/70" />
          <RatingBar label="Warmth" value={(product as SheetProduct).ratings.warmth} colorClass="bg-orange-400/70" />
          <RatingBar label="Softness" value={(product as SheetProduct).ratings.softness} colorClass="bg-purple-400/70" />
        </div>
      ) : (
        <div className="space-y-3 mb-6">
          <RatingBar
            label="Pillow Loft"
            value={loftVisual[(product as PillowProduct).attributes.loft] as 1 | 2 | 3 | 4 | 5}
          />
          <RatingBar
            label="Firmness"
            value={firmnessVisual[(product as PillowProduct).attributes.firmness] as 1 | 2 | 3 | 4 | 5}
            colorClass="bg-charcoal/40"
          />
          {(product as PillowProduct).attributes.adjustable && (
            <div className="flex items-center gap-2 mt-2">
              <div className="w-1.5 h-1.5 rounded-full bg-sage" />
              <span className="text-xs text-charcoal/50">Adjustable fill level</span>
            </div>
          )}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {product.best_for.map(tag => (
          <span key={tag} className="text-xs bg-charcoal/6 text-charcoal/55 px-3 py-1 rounded-full">
            {tag}
          </span>
        ))}
      </div>
    </GlassCard>
  )
}
