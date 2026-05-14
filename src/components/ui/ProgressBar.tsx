import { motion } from 'framer-motion'

interface ProgressBarProps {
  current: number
  total: number
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const pct = Math.round(((current + 1) / total) * 100)

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-charcoal/10">
      <motion.div
        className="h-full bg-sage"
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
      />
    </div>
  )
}
