import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const apple = [0.22, 1, 0.36, 1] as const
const base = import.meta.env.BASE_URL

const SERVICES = [
  {
    id: 'select',
    icon: `${base}tn-select.png`,
    name: 'TN SELECT',
    chinese: '「選」得好眠',
    desc: '親身體驗，選配最適合您的材質',
    active: true,
  },
  {
    id: 'care',
    icon: `${base}tn-care.png`,
    name: 'TN CARE',
    chinese: '「惜」物如新',
    desc: '專業保養，細心呵護舒適觸感',
    active: false,
  },
  {
    id: 'pairing',
    icon: `${base}tn-pairing.png`,
    name: 'TN PAIRING',
    chinese: '「搭」出美感',
    desc: 'AI 智能模擬，搭出完美居家風格',
    active: false,
  },
  {
    id: 'customization',
    icon: `${base}tn-customization.png`,
    name: 'TN CUSTOMIZATION',
    chinese: '「配」您所愛',
    desc: '訂製服務，打造專屬理想家',
    active: false,
  },
  {
    id: 'hygiene',
    icon: `${base}tn-hygiene.png`,
    name: 'TN HYGIENE',
    chinese: '「安心」深睡',
    desc: '國際認證的純淨防護，給您無憂的睡眠',
    active: false,
  },
]

export default function Landing() {
  const navigate = useNavigate()
  const [toast, setToast] = useState(false)

  function handleServiceClick(active: boolean) {
    if (active) {
      navigate('/quiz')
    } else {
      setToast(true)
      setTimeout(() => setToast(false), 2200)
    }
  }

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

        {/* ── Top row: 3 cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          {SERVICES.slice(0, 3).map((svc, i) => (
            <ServiceCard key={svc.id} svc={svc} delay={i * 0.06} onClick={() => handleServiceClick(svc.active)} />
          ))}
        </div>

        {/* ── Bottom row: 2 cards centered ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:px-[16.67%]">
          {SERVICES.slice(3).map((svc, i) => (
            <ServiceCard key={svc.id} svc={svc} delay={(i + 3) * 0.06} onClick={() => handleServiceClick(svc.active)} />
          ))}
        </div>

        {/* ── Brand footer ── */}
        <p className="text-center text-xs text-charcoal/30 mt-8 tracking-widest uppercase">Tonia Nicole · 東妮寢飾</p>
      </motion.div>

      {/* ── Coming soon toast ── */}
      <AnimatePresence>
        {toast && (
          <motion.div
            className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-charcoal text-cream text-sm px-5 py-3 rounded-2xl shadow-lg font-medium whitespace-nowrap"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.25 }}
          >
            Coming soon — stay tuned
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ── ServiceCard ───────────────────────────────────────────────────────────────

interface Svc {
  id: string
  icon: string
  name: string
  chinese: string
  desc: string
  active: boolean
}

function ServiceCard({ svc, delay, onClick }: { svc: Svc; delay: number; onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      className={[
        'w-full text-left p-5 rounded-2xl border transition-all duration-200',
        svc.active
          ? 'bg-white/70 backdrop-blur-md border-gold/60 shadow-glass cursor-pointer hover:border-gold hover:shadow-glass-hover'
          : 'bg-white/35 backdrop-blur-sm border-charcoal/10 cursor-pointer hover:bg-white/50',
      ].join(' ')}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: 0.2 + delay }}
      whileHover={{ y: svc.active ? -2 : 0 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Icon row + badge */}
      <div className="flex items-start justify-between mb-3">
        <img
          src={svc.icon}
          alt={svc.name}
          className="w-10 h-10 object-contain"
          style={{
            mixBlendMode: 'multiply',
            opacity: svc.active ? 1 : 0.25,
          }}
        />
        {svc.active
          ? <span className="text-[10px] font-semibold text-gold bg-gold/10 px-2 py-0.5 rounded-full tracking-wide uppercase">Start</span>
          : <span className="text-[10px] font-semibold text-charcoal/30 bg-charcoal/6 px-2 py-0.5 rounded-full tracking-wide uppercase">Soon</span>
        }
      </div>

      {/* Service name */}
      <p className={[
        'font-bold text-xs tracking-widest uppercase mb-0.5',
        svc.active ? 'text-charcoal' : 'text-charcoal/35',
      ].join(' ')}>
        {svc.name}
      </p>

      {/* Chinese subtitle */}
      <p className={[
        'text-base font-semibold mb-1.5',
        svc.active ? 'text-charcoal' : 'text-charcoal/30',
      ].join(' ')}>
        {svc.chinese}
      </p>

      {/* Description */}
      <p className={[
        'text-xs leading-relaxed',
        svc.active ? 'text-charcoal/60' : 'text-charcoal/25',
      ].join(' ')}>
        {svc.desc}
      </p>
    </motion.button>
  )
}
