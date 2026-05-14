import { motion } from 'framer-motion'

interface GlassCardProps {
  children: React.ReactNode
  className?: string
  hoverable?: boolean
  onClick?: () => void
  as?: 'div' | 'article' | 'section'
}

export default function GlassCard({ children, className = '', hoverable = false, onClick, as: Tag = 'div' }: GlassCardProps) {
  const baseClass = `glass-card ${hoverable ? 'glass-card-hover cursor-pointer' : ''} ${className}`

  if (onClick) {
    return (
      <motion.div
        className={baseClass}
        onClick={onClick}
        whileTap={{ scale: 0.98 }}
      >
        {children}
      </motion.div>
    )
  }

  return <Tag className={baseClass}>{children}</Tag>
}
