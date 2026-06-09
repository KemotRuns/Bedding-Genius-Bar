import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const apple = [0.22, 1, 0.36, 1] as const
const base = import.meta.env.BASE_URL

const PRODUCTS = [
  {
    id: 'sheets',
    label: 'Sheets & Bedding',
    chinese: '床組材質',
    desc: 'The fabric against your skin for 8 hours controls moisture, temperature, and how your skin recovers. Find the weave that fits your body.',
  },
  {
    id: 'comforter',
    label: 'Comforter',
    chinese: '棉被',
    desc: 'Fill type determines warmth, weight, and breathability. The right comforter keeps you at an even temperature through the night.',
  },
  {
    id: 'pillow',
    label: 'Pillow',
    chinese: '枕頭',
    desc: 'Loft and firmness follow your sleep position. The right fit keeps your neck in neutral alignment and eliminates morning tension.',
  },
]

export default function Landing() {
  const navigate = useNavigate()

  return (
    <motion.div
      className="min-h-screen bg-cream flex flex-col items-center justify-center px-6 py-10 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Subtle background blobs */}
      <div className="absolute top-1/4 left-1/5 w-80 h-80 rounded-full blur-3xl pointer-events-none animate-blob" style={{ backgroundColor: 'rgba(196,154,108,0.12)' }} />
      <div className="absolute bottom-1/4 right-1/5 w-64 h-64 rounded-full blur-3xl pointer-events-none animate-blob-delay" style={{ backgroundColor: 'rgba(122,154,119,0.12)' }} />

      <motion.div
        className="w-full max-w-3xl"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: apple, delay: 0.1 }}
      >
        {/* ── Logo ── */}
        <div className="flex justify-center mb-4">
          <img
            src={`${base}ProBar - logo-01.png`}
            alt="Pro Bar"
            className="h-28 w-auto"
            style={{ mixBlendMode: 'multiply' }}
          />
        </div>

        {/* ── Tagline ── */}
        <div className="text-center mb-6">
          <p className="font-semibold text-charcoal text-sm tracking-wide">提升您的睡眠品質</p>
          <p className="font-semibold text-charcoal text-sm tracking-wide">Enhancing your sleep performance</p>
        </div>

        {/* ── Divider ── */}
        <div className="border-t border-charcoal/20 mb-8" />

        {/* ── Product entry cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {PRODUCTS.map((product, i) => (
            <ProductCard
              key={product.id}
              product={product}
              delay={i * 0.07}
              onClick={() => navigate(`/quiz?product=${product.id}`)}
            />
          ))}
        </div>

        {/* ── Brand footer ── */}
        <p className="text-center text-xs text-charcoal/30 mt-8 tracking-widest uppercase">Tonia Nicole · 東妮寢飾</p>
      </motion.div>
    </motion.div>
  )
}

// ── Icons ─────────────────────────────────────────────────────────────────────

function SheetsIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <rect x="2" y="4" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M2 9h18" stroke="currentColor" strokeWidth="1.5" />
      <path d="M6 13h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M6 16h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function ComforterIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path d="M3 13c0-3.314 2.686-6 6-6h4c3.314 0 6 2.686 6 6v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 7V6a3 3 0 0 1 6 0v1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="8.5" cy="12" r="0.75" fill="currentColor" />
      <circle cx="11" cy="12" r="0.75" fill="currentColor" />
      <circle cx="13.5" cy="12" r="0.75" fill="currentColor" />
    </svg>
  )
}

function PillowIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <rect x="2" y="7" width="18" height="8" rx="4" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7 11c0-1.105.895-2 2-2h4a2 2 0 0 1 0 4H9a2 2 0 0 1-2-2z" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

const ICONS: Record<string, React.ReactNode> = {
  sheets: <SheetsIcon />,
  comforter: <ComforterIcon />,
  pillow: <PillowIcon />,
}

// ── ProductCard ───────────────────────────────────────────────────────────────

interface Product {
  id: string
  label: string
  chinese: string
  desc: string
}

function ProductCard({ product, delay, onClick }: { product: Product; delay: number; onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      className="w-full text-left p-6 rounded-2xl border bg-white/70 backdrop-blur-md border-gold/40 shadow-glass cursor-pointer hover:border-gold hover:shadow-glass-hover transition-all duration-200"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: apple, delay: 0.2 + delay }}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Icon */}
      <div className="w-10 h-10 rounded-xl bg-gold/12 flex items-center justify-center text-gold mb-4">
        {ICONS[product.id]}
      </div>

      {/* Category label */}
      <p className="text-[10px] font-bold tracking-widest uppercase text-charcoal/40 mb-1">{product.label}</p>

      {/* Chinese name */}
      <p className="text-xl font-semibold text-charcoal mb-2">{product.chinese}</p>

      {/* Description */}
      <p className="text-xs text-charcoal/55 leading-relaxed mb-4">{product.desc}</p>

      {/* CTA */}
      <div className="flex items-center gap-1.5 text-gold text-xs font-semibold">
        Start
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2 6h8M8 4l2 2-2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </motion.button>
  )
}
