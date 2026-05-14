import { motion } from 'framer-motion'
import GlassCard from './GlassCard'

interface IconOption {
  value: string
  label: string
  icon: React.ReactNode
  sublabel?: string
}

interface IconSelectorProps {
  options: IconOption[]
  selected: string | undefined
  onSelect: (value: string) => void
  columns?: 2 | 3 | 4
}

const colClass: Record<number, string> = {
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-2 sm:grid-cols-4',
}

export default function IconSelector({ options, selected, onSelect, columns = 4 }: IconSelectorProps) {
  return (
    <div className={`grid ${colClass[columns]} gap-3`} role="radiogroup">
      {options.map((opt) => {
        const isSelected = selected === opt.value
        return (
          <motion.div
            key={opt.value}
            whileHover={{ y: -2 }}
            transition={{ duration: 0.15 }}
          >
            <GlassCard
              hoverable
              onClick={() => onSelect(opt.value)}
              className={`p-4 text-center transition-all duration-200 ${
                isSelected
                  ? 'border-sage ring-2 ring-sage/30 bg-sage/10 !border-sage'
                  : ''
              }`}
            >
              <div
                role="radio"
                aria-checked={isSelected}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    onSelect(opt.value)
                  }
                }}
                className="outline-none"
              >
                <div className={`flex justify-center mb-3 transition-colors duration-200 ${isSelected ? 'text-sage-dark' : 'text-charcoal/50'}`}>
                  {opt.icon}
                </div>
                <p className={`text-sm font-medium transition-colors duration-200 ${isSelected ? 'text-charcoal' : 'text-charcoal/70'}`}>
                  {opt.label}
                </p>
                {opt.sublabel && (
                  <p className="text-xs text-charcoal/40 mt-0.5">{opt.sublabel}</p>
                )}
              </div>
            </GlassCard>
          </motion.div>
        )
      })}
    </div>
  )
}
