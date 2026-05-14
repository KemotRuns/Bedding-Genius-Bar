import { motion } from 'framer-motion'

interface RatingBarProps {
  label: string
  value: 1 | 2 | 3 | 4 | 5
  colorClass?: string
}

export default function RatingBar({ label, value, colorClass = 'bg-sage' }: RatingBarProps) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-charcoal/60 w-28 flex-shrink-0">{label}</span>
      <div className="flex gap-1 flex-1">
        {Array.from({ length: 5 }, (_, i) => (
          <motion.div
            key={i}
            className={`h-1.5 flex-1 rounded-full ${i < value ? colorClass : 'bg-charcoal/10'}`}
            initial={i < value ? { scaleX: 0 } : {}}
            animate={{ scaleX: 1 }}
            transition={{ delay: i * 0.08, duration: 0.3, ease: 'easeOut' }}
            style={{ transformOrigin: 'left' }}
          />
        ))}
      </div>
      <span className="text-sm font-medium text-charcoal w-4 text-right">{value}</span>
    </div>
  )
}
