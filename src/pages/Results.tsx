import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getRecommendation } from '../lib/engine'
import type { QuizAnswers, RecommendationResult, SheetProduct, PillowProduct, ComforterProduct, NightHeat } from '../lib/types'

// ── Helpers ──────────────────────────────────────────────────────────────────

const apple = [0.22, 1, 0.36, 1] as const

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: apple } },
}

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}

function matchScore(score: number): number {
  return Math.min(100, Math.max(60, Math.round(60 + (score / 18) * 40)))
}

const ALL_SECTIONS = [
  {
    id: 'sheets',
    label: 'Sheets & Bedding',
    chinese: '床組材質',
    desc: 'Find your ideal fabric for temperature control and skin comfort.',
  },
  {
    id: 'comforter',
    label: 'Comforter',
    chinese: '棉被',
    desc: 'Match your comforter\'s fill and warmth to how you sleep.',
  },
  {
    id: 'pillow',
    label: 'Pillow',
    chinese: '枕頭',
    desc: 'Align loft and firmness to your sleep position for pain-free mornings.',
  },
]

const PRODUCT_TITLES: Record<string, string> = {
  sheets: 'Sheets Prescription',
  comforter: 'Comforter Prescription',
  pillow: 'Pillow Prescription',
}

// ── Sub-components ────────────────────────────────────────────────────────────

function ProfileBadge({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5 px-4 py-3 bg-white/50 backdrop-blur-sm border border-white/60 rounded-2xl">
      <div className="text-sage-dark">{icon}</div>
      <span className="text-xs font-medium text-charcoal/70 text-center leading-tight">{label}</span>
    </div>
  )
}

function AttributeBar({ label, value, color, descriptor }: {
  label: string
  value: 1 | 2 | 3 | 4 | 5
  color: string
  descriptor: string
}) {
  const pct = (value / 5) * 100
  return (
    <div className="grid grid-cols-[120px_1fr_64px] items-center gap-4">
      <span className="text-sm text-charcoal/55 text-right">{label}</span>
      <div className="h-2 bg-charcoal/8 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: apple, delay: 0.2 }}
        />
      </div>
      <span className="text-xs font-semibold text-charcoal/50">{descriptor}</span>
    </div>
  )
}

const descriptors: Record<number, string> = { 1: 'Minimal', 2: 'Low', 3: 'Moderate', 4: 'High', 5: 'Excellent' }

function MatchRing({ score }: { score: number }) {
  const radius = 28
  const circumference = 2 * Math.PI * radius
  const dash = (score / 100) * circumference

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative w-20 h-20">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 72 72">
          <circle cx="36" cy="36" r={radius} fill="none" stroke="rgba(26,26,26,0.08)" strokeWidth="5" />
          <motion.circle
            cx="36" cy="36" r={radius}
            fill="none"
            stroke="#C49A6C"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference - dash }}
            transition={{ duration: 1, ease: apple, delay: 0.4 }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold text-charcoal">{score}%</span>
        </div>
      </div>
      <span className="text-xs text-charcoal/40 font-medium tracking-wide">Match</span>
    </div>
  )
}

function LoftDiagram({ loft }: { loft: 'Low' | 'Medium' | 'High' }) {
  const heights: Record<string, number> = { Low: 12, Medium: 22, High: 34 }
  const h = heights[loft]
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-24" style={{ height: 44 }}>
        <motion.div
          className="absolute bottom-0 left-0 right-0 bg-sage/25 border-2 border-sage/40 rounded-xl"
          initial={{ height: 0 }}
          animate={{ height: h }}
          transition={{ duration: 0.6, ease: apple, delay: 0.3 }}
        />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-charcoal/20" />
      </div>
      <span className="text-xs font-semibold text-charcoal/60 uppercase tracking-widest">{loft} Loft</span>
    </div>
  )
}

function ProfileSection({ answers }: { answers: QuizAnswers }) {
  const badges: { icon: React.ReactNode; label: string }[] = []

  const heatMap: Record<string, string> = { 'Very Hot': 'Hot sleeper', Warm: 'Runs warm', Neutral: 'Comfortable', Cold: 'Runs cold' }
  if (answers.nightHeat) badges.push({ icon: <TempIcon temp={answers.nightHeat as NightHeat} />, label: heatMap[answers.nightHeat] })

  if (answers.skinType && answers.skinType !== 'None') {
    const skinMap: Record<string, string> = { Sensitive: 'Sensitive skin', 'Allergic/Eczema': 'Eczema / Allergic' }
    badges.push({ icon: <ShieldIcon />, label: skinMap[answers.skinType] })
  }

  const posMap: Record<string, string> = { Side: 'Side sleeper', Back: 'Back sleeper', Stomach: 'Stomach sleeper', Combination: 'Combo sleeper' }
  if (answers.sleepPosition) badges.push({ icon: <BedIcon />, label: posMap[answers.sleepPosition] })

  const shoulderMap: Record<string, string> = { Petite: 'Narrower (S/XS)', Average: 'Average (M/L)', Broad: 'Broader (XL+)' }
  if (answers.shoulderWidth) badges.push({ icon: <BodyIcon />, label: shoulderMap[answers.shoulderWidth] })

  const feelMap: Record<string, string> = { Heavy: 'Heavy comforter', Fluffy: 'Fluffy comforter', Smooth: 'Smooth & light', Practical: 'Easy care' }
  if (answers.comforterFeel) badges.push({ icon: <WashIcon />, label: feelMap[answers.comforterFeel] })

  const pillowMap: Record<string, string> = { Sink: 'Cushioned pillow', Springy: 'Springy pillow', Contour: 'Contouring pillow', Balanced: 'Balanced pillow' }
  if (answers.pillowFeel) badges.push({ icon: <PersonIcon />, label: pillowMap[answers.pillowFeel] })

  if (badges.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
      {badges.map((b, i) => <ProfileBadge key={i} icon={b.icon} label={b.label} />)}
    </div>
  )
}

// ── Inline SVG icons ──────────────────────────────────────────────────────────

const TempIcon = ({ temp }: { temp: NightHeat }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    {temp === 'Cold'
      ? <><line x1="10" y1="2" x2="10" y2="18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="4" y1="10" x2="16" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          <circle cx="10" cy="10" r="2" fill="currentColor"/></>
      : temp === 'Very Hot'
      ? <><path d="M10 3C10 3 13.5 7 13.5 11C13.5 12.8 12.8 13.8 11.8 14.5C12 13.5 11.8 12.5 11 11.5C11 11.5 10 12.5 9 11.5C8 10.5 8 9 8 9C8 9 6.5 11 8 13.5C7 12.8 6.5 11.5 6.5 11C6.5 7 10 3 10 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
          <path d="M10 18C12 18 13.5 16.5 13.5 14.5C13.5 12.5 10 10 10 10C10 10 6.5 12.5 6.5 14.5C6.5 16.5 8 18 10 18Z" stroke="currentColor" strokeWidth="1.5"/></>
      : <><rect x="7.5" y="3" width="5" height="11" rx="2.5" stroke="currentColor" strokeWidth="1.5"/>
          <circle cx="10" cy="15" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
          <rect x="9" y="5" width="2" height="7" rx="1" fill="currentColor"/></>
    }
  </svg>
)
const PersonIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <circle cx="10" cy="5" r="3" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M5 18v-6a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
)
const BedIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <rect x="2" y="8" width="16" height="8" rx="2" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M2 12h16" stroke="currentColor" strokeWidth="1.5"/>
    <rect x="4" y="5" width="5" height="4" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
    <rect x="11" y="5" width="5" height="4" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
)
const ShieldIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M10 2L3 5v7c0 4 3.5 6 7 7s7-3 7-7V5l-7-3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
  </svg>
)
const WashIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <rect x="3" y="4" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="10" cy="12" r="3.5" stroke="currentColor" strokeWidth="1.5"/>
    <line x1="6" y1="7" x2="9" y2="7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="12" cy="7" r="1" fill="currentColor"/>
    <circle cx="14" cy="7" r="1" fill="currentColor"/>
  </svg>
)
const BodyIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <circle cx="10" cy="4" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M10 7v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M10 10l-4 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M10 10l4 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M10 15l-2 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M10 15l2 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
)

// ── Dummy answers for dev fallback ────────────────────────────────────────────

const DUMMY_ANSWERS: QuizAnswers = {
  nightHeat: 'Warm',
  skinType: 'Sensitive',
  careLevel: 'Minimal',
  sensoryPref: 'Silky',
  comforterTemp: 'Neutral',
  comforterFeel: 'Smooth',
  breathingIssues: 'No',
  sleepPosition: 'Side',
  shoulderWidth: 'Average',
  pillowFeel: 'Balanced',
  pillowPriority: 'Value',
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function Results() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const product = searchParams.get('product') ?? 'sheets'

  const [{ answers, result }] = useState<{ answers: QuizAnswers; result: RecommendationResult }>(() => {
    const raw = sessionStorage.getItem('quiz_answers')
    const a: QuizAnswers = raw ? JSON.parse(raw) as QuizAnswers : DUMMY_ANSWERS
    return { answers: a, result: getRecommendation(a) }
  })

  const sheet = result.topSheet.product as SheetProduct
  const pillow = result.topPillow.product as PillowProduct
  const comforter = result.topComforter.product as ComforterProduct

  const score = product === 'comforter'
    ? matchScore(result.topComforter.score)
    : product === 'pillow'
    ? matchScore(result.topPillow.score)
    : matchScore(result.topSheet.score)

  const pageTitle = PRODUCT_TITLES[product] ?? 'Sleep Prescription'
  const otherSections = ALL_SECTIONS.filter(s => s.id !== product)

  return (
    <motion.div
      className="min-h-screen bg-cream"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
    >
      {/* ── Report Header ────────────────────────────────────────── */}
      <div className="bg-gradient-to-br from-charcoal via-charcoal/95 to-gold text-cream">
        <div className="max-w-4xl mx-auto px-6 py-10">
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-gold-light text-xs font-semibold tracking-[0.25em] uppercase mb-1">TN Select · Tonia Nicole Pro Bar</p>
              <h1 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight">{pageTitle}</h1>
            </div>
            <button
              onClick={() => navigate('/')}
              className="text-cream/40 hover:text-cream/80 transition-colors text-sm flex items-center gap-1.5 mt-1 cursor-pointer"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M11 7H3M3 7L6 4M3 7L6 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Start over
            </button>
          </div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <ProfileSection answers={answers} />
          </motion.div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-6 pb-16">
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-5 pt-5">

          {/* ══════════════════ SHEETS ══════════════════ */}
          {product === 'sheets' && (
            <>
              {/* Sheet Prescription */}
              <motion.div variants={itemVariants} className="glass-card p-0 overflow-hidden">
                <div className="bg-sage/12 border-b border-sage/20 px-7 py-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold tracking-widest uppercase text-charcoal/40 mb-0.5">Sheet Prescription</p>
                    <h2 className="text-xl font-semibold text-charcoal tracking-tight">{sheet.name}</h2>
                    {sheet.collection && (
                      <p className="text-xs text-charcoal/45 mt-0.5">{sheet.collection}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="hidden sm:flex flex-col items-end gap-1.5">
                      <span className="text-xs bg-charcoal/8 text-charcoal/55 px-3 py-1.5 rounded-full font-medium">
                        {sheet.material} · {sheet.weave === 'N/A' ? 'Plain Weave' : `${sheet.weave} Weave`}
                      </span>
                      {sheet.sku && (
                        <span className="font-mono text-[11px] text-charcoal/35 bg-charcoal/6 px-2.5 py-1 rounded-md tracking-wider">
                          {sheet.sku}
                        </span>
                      )}
                    </div>
                    <MatchRing score={score} />
                  </div>
                </div>

                <div className="px-7 py-6">
                  <p className="text-charcoal/60 text-sm leading-relaxed mb-6">{sheet.description}</p>

                  <div className="space-y-4 mb-6">
                    <AttributeBar label="Breathability" value={sheet.ratings.breathability} color="bg-sage" descriptor={descriptors[sheet.ratings.breathability]} />
                    <AttributeBar label="Moisture Wicking" value={sheet.ratings.wicking} color="bg-blue-400/70" descriptor={descriptors[sheet.ratings.wicking]} />
                    <AttributeBar label="Warmth" value={sheet.ratings.warmth} color="bg-orange-400/70" descriptor={descriptors[sheet.ratings.warmth]} />
                    <AttributeBar label="Softness" value={sheet.ratings.softness} color="bg-purple-400/70" descriptor={descriptors[sheet.ratings.softness]} />
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {sheet.best_for.map(tag => (
                      <span key={tag} className="text-xs bg-sage/12 text-sage-dark px-3 py-1 rounded-full font-medium">{tag}</span>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Also Consider runner-up */}
              {result.allSheets.length > 1 && (
                <motion.div variants={itemVariants} className="glass-card p-5">
                  <p className="text-xs font-semibold tracking-widest uppercase text-charcoal/30 mb-3">Also Consider</p>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-baseline gap-2">
                        <p className="font-medium text-charcoal text-sm">{result.allSheets[1].product.name}</p>
                        {result.allSheets[1].product.sku && (
                          <span className="font-mono text-[10px] text-charcoal/30 tracking-wider">{result.allSheets[1].product.sku}</span>
                        )}
                      </div>
                      <p className="text-xs text-charcoal/45 mt-0.5">{result.allSheets[1].product.material} — {result.allSheets[1].product.description.split('.')[0]}.</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-sm font-bold text-charcoal/40">{matchScore(result.allSheets[1].score)}%</div>
                      <div className="text-xs text-charcoal/30">match</div>
                    </div>
                  </div>
                </motion.div>
              )}
            </>
          )}

          {/* ══════════════════ COMFORTER ══════════════════ */}
          {product === 'comforter' && (
            <motion.div variants={itemVariants} className="glass-card p-0 overflow-hidden">
              <div className="bg-gold/8 border-b border-gold/20 px-7 py-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold tracking-widest uppercase text-charcoal/40 mb-0.5">Comforter Prescription</p>
                  <h2 className="text-xl font-semibold text-charcoal tracking-tight">{comforter.name}</h2>
                  {comforter.collection && (
                    <p className="text-xs text-charcoal/45 mt-0.5">{comforter.collection}</p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <div className="hidden sm:flex flex-col items-end gap-1.5">
                    <span className="text-xs bg-gold/15 text-gold px-3 py-1.5 rounded-full font-medium">
                      {comforter.fill} · {comforter.attributes.warmth}
                    </span>
                    {comforter.sku && (
                      <span className="font-mono text-[11px] text-charcoal/35 bg-charcoal/6 px-2.5 py-1 rounded-md tracking-wider">
                        {comforter.sku}
                      </span>
                    )}
                  </div>
                  <MatchRing score={score} />
                </div>
              </div>

              <div className="px-7 py-6">
                <p className="text-charcoal/60 text-sm leading-relaxed mb-6">{comforter.description}</p>

                <div className="space-y-4 mb-6">
                  <AttributeBar label="Warmth" value={comforter.ratings.warmth} color="bg-orange-400/70" descriptor={descriptors[comforter.ratings.warmth]} />
                  <AttributeBar label="Breathability" value={comforter.ratings.breathability} color="bg-sage" descriptor={descriptors[comforter.ratings.breathability]} />
                  <AttributeBar label="Fluffiness" value={comforter.ratings.fluffiness} color="bg-purple-400/70" descriptor={descriptors[comforter.ratings.fluffiness]} />
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {comforter.best_for.map(tag => (
                    <span key={tag} className="text-xs bg-gold/10 text-gold px-3 py-1 rounded-full font-medium">{tag}</span>
                  ))}
                </div>

                <div className="flex gap-3 flex-wrap">
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${comforter.attributes.hypoallergenic ? 'bg-sage/12 text-sage-dark' : 'bg-charcoal/6 text-charcoal/40'}`}>
                    {comforter.attributes.hypoallergenic ? '✓ Hypoallergenic' : 'Non-hypoallergenic'}
                  </span>
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${comforter.attributes.washable ? 'bg-blue-400/12 text-blue-600/80' : 'bg-charcoal/6 text-charcoal/40'}`}>
                    {comforter.attributes.washable ? '✓ Machine washable' : 'Dry-clean only'}
                  </span>
                  <span className="text-xs bg-charcoal/6 text-charcoal/40 px-3 py-1 rounded-full font-medium">
                    {comforter.attributes.weight} weight
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          {/* ══════════════════ PILLOW ══════════════════ */}
          {product === 'pillow' && (
            <motion.div variants={itemVariants} className="glass-card p-0 overflow-hidden">
              <div className="bg-sage/12 border-b border-sage/20 px-7 py-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold tracking-widest uppercase text-charcoal/40 mb-0.5">Pillow Prescription</p>
                  <h2 className="text-xl font-semibold text-charcoal tracking-tight">{pillow.name}</h2>
                  {pillow.collection && (
                    <p className="text-xs text-charcoal/45 mt-0.5">{pillow.collection}</p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <div className="hidden sm:flex flex-col items-end gap-1.5">
                    <span className="text-xs bg-charcoal/8 text-charcoal/55 px-3 py-1.5 rounded-full font-medium">
                      {pillow.fill} · {pillow.attributes.firmness}
                    </span>
                    {pillow.sku && (
                      <span className="font-mono text-[11px] text-charcoal/35 bg-charcoal/6 px-2.5 py-1 rounded-md tracking-wider">
                        {pillow.sku}
                      </span>
                    )}
                  </div>
                  <MatchRing score={score} />
                </div>
              </div>

              <div className="px-7 py-6">
                <div className="flex items-end gap-6 mb-5">
                  <LoftDiagram loft={pillow.attributes.loft} />
                  <div className="text-sm text-charcoal/60 leading-relaxed flex-1">
                    {pillow.attributes.loft === 'High' && 'Fills the gap between ear and shoulder — ideal for side sleepers with broad frames.'}
                    {pillow.attributes.loft === 'Medium' && 'Keeps your neck in neutral alignment whether you sleep on your back or side.'}
                    {pillow.attributes.loft === 'Low' && 'Prevents neck arching — the only safe loft for stomach sleepers.'}
                  </div>
                </div>

                <p className="text-sm text-charcoal/60 leading-relaxed mb-5">{pillow.description}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {pillow.best_for.map(tag => (
                    <span key={tag} className="text-xs bg-sage/12 text-sage-dark px-3 py-1 rounded-full font-medium">{tag}</span>
                  ))}
                </div>

                {pillow.attributes.adjustable && (
                  <div className="flex items-center gap-2 pt-4 border-t border-charcoal/6">
                    <div className="w-1.5 h-1.5 rounded-full bg-sage" />
                    <span className="text-xs text-charcoal/50">Adjustable fill — customise loft to your preference</span>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* ── Why This Works ─────────────────────────── */}
          <motion.div variants={itemVariants} className="glass-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded-full bg-sage/20 flex items-center justify-center flex-shrink-0">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6L5 9L10 3" stroke="#6A8E67" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <p className="text-xs font-semibold tracking-widest uppercase text-charcoal/40">Why This Works</p>
            </div>
            <p className="text-sm text-charcoal/75 leading-relaxed">{result.whyText}</p>
          </motion.div>

          {/* ── Also Explore ───────────────────────────── */}
          <motion.div variants={itemVariants} className="glass-card p-6 bg-sage/5">
            <p className="text-xs font-semibold tracking-widest uppercase text-charcoal/40 mb-4">Also Explore</p>
            <div className="grid sm:grid-cols-2 gap-4">
              {otherSections.map(s => (
                <button
                  key={s.id}
                  onClick={() => navigate(`/quiz?product=${s.id}`)}
                  className="text-left p-4 rounded-xl border border-charcoal/10 bg-white/40 hover:border-gold/50 hover:bg-white/70 transition-all cursor-pointer"
                >
                  <p className="text-[10px] font-bold tracking-widest uppercase text-charcoal/35 mb-0.5">{s.label}</p>
                  <p className="text-base font-semibold text-charcoal mb-1">{s.chinese}</p>
                  <p className="text-xs text-charcoal/50 leading-relaxed mb-3">{s.desc}</p>
                  <div className="flex items-center gap-1.5 text-gold text-xs font-semibold">
                    Begin
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6h8M8 4l2 2-2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>

          {/* ── Footer ────────────────────────────────── */}
          <motion.div variants={itemVariants} className="text-center pt-2 pb-4">
            <p className="text-xs text-charcoal/25">TN Select · Tonia Nicole Pro Bar · {new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </motion.div>

        </motion.div>
      </main>
    </motion.div>
  )
}
