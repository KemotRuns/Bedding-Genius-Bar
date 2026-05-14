import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getRecommendation } from '../lib/engine'
import type { QuizAnswers, RecommendationResult, SheetProduct, PillowProduct } from '../lib/types'
import FabricSimulator from '../components/results/FabricSimulator'

// ── Helpers ─────────────────────────────────────────────────────────────────

const apple = [0.22, 1, 0.36, 1] as const

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: apple } },
}

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}

// Compute a 0-100 "match score" from the top sheet's raw score
function matchScore(score: number): number {
  // scores typically range from -6 to +18; normalise to 60-100
  return Math.min(100, Math.max(60, Math.round(60 + (score / 18) * 40)))
}

// ── Sub-components ───────────────────────────────────────────────────────────

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
        {/* Pillow */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 bg-sage/25 border-2 border-sage/40 rounded-xl"
          initial={{ height: 0 }}
          animate={{ height: h }}
          transition={{ duration: 0.6, ease: apple, delay: 0.3 }}
        />
        {/* Neck line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-charcoal/20" />
      </div>
      <span className="text-xs font-semibold text-charcoal/60 uppercase tracking-widest">{loft} Loft</span>
    </div>
  )
}

function ProfileSection({ answers }: { answers: QuizAnswers }) {
  const badges: { icon: React.ReactNode; label: string }[] = []

  const roomMap: Record<string, string> = { Cold: 'Cold room', Moderate: 'Moderate room', Warm: 'Warm room', Hot: 'Hot room' }
  if (answers.roomTemp) badges.push({ icon: <TempIcon temp={answers.roomTemp} />, label: roomMap[answers.roomTemp] })

  const sleeperMap: Record<string, string> = { 'Always Cold': 'Runs cold', Neutral: 'Neutral temp', Warm: 'Runs warm', 'Hot Flash Prone': 'Night sweats' }
  if (answers.sleeperTemp) badges.push({ icon: <PersonIcon />, label: sleeperMap[answers.sleeperTemp] })

  const posMap: Record<string, string> = { Side: 'Side sleeper', Back: 'Back sleeper', Stomach: 'Stomach sleeper', Combination: 'Combo sleeper' }
  if (answers.sleepPosition) badges.push({ icon: <BedIcon />, label: posMap[answers.sleepPosition] })

  if (answers.skinSensitivity && answers.skinSensitivity !== 'None') {
    const skinMap: Record<string, string> = { Mild: 'Mild skin', Sensitive: 'Sensitive skin', 'Allergic/Eczema': 'Allergic / Eczema' }
    badges.push({ icon: <ShieldIcon />, label: skinMap[answers.skinSensitivity] })
  }

  if (answers.petStatus === 'Yes — Cats or Dogs') badges.push({ icon: <PawIcon />, label: 'Pet owner' })

  const maintMap: Record<string, string> = { 'Low Maintenance': 'Low upkeep', 'I Launder Frequently': 'Frequent wash' }
  if (answers.maintenancePref) badges.push({ icon: <WashIcon />, label: maintMap[answers.maintenancePref] })

  const bodyMap: Record<string, string> = { Petite: 'Petite frame', Average: 'Average build', Broad: 'Broad shoulders' }
  if (answers.bodyType) badges.push({ icon: <BodyIcon />, label: bodyMap[answers.bodyType] })

  return (
    <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
      {badges.map((b, i) => <ProfileBadge key={i} icon={b.icon} label={b.label} />)}
    </div>
  )
}

// Tiny inline SVG icons for profile badges
const TempIcon = ({ temp }: { temp: string }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    {temp === 'Cold' || temp === 'Always Cold'
      ? <><line x1="10" y1="2" x2="10" y2="18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="4" y1="10" x2="16" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          <circle cx="10" cy="10" r="2" fill="currentColor"/></>
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
const PawIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <circle cx="7" cy="7" r="2" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="13" cy="7" r="2" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="5" cy="12" r="1.5" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="15" cy="12" r="1.5" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M10 9c-3 0-5 2-5 5 0 1.5 1.5 2.5 3 2.5h4c1.5 0 3-1 3-2.5 0-3-2-5-5-5z" stroke="currentColor" strokeWidth="1.5"/>
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

// ── Main Page ────────────────────────────────────────────────────────────────


const DUMMY_ANSWERS: QuizAnswers = {
  roomTemp: 'Hot',
  sleeperTemp: 'Warm',
  sleepPosition: 'Side',
  skinSensitivity: 'Sensitive',
  petStatus: 'Yes — Cats or Dogs',
  maintenancePref: 'Low Maintenance',
  bodyType: 'Average',
}

export default function Results() {
  const navigate = useNavigate()

  // Lazy initializer: runs synchronously once, no effect/StrictMode issues
  const [{ answers, result }] = useState<{ answers: QuizAnswers; result: RecommendationResult }>(() => {
    const raw = sessionStorage.getItem('quiz_answers')
    const a: QuizAnswers = raw ? JSON.parse(raw) as QuizAnswers : DUMMY_ANSWERS
    return { answers: a, result: getRecommendation(a) }
  })

  const sheet = result.topSheet.product as SheetProduct
  const pillow = result.topPillow.product as PillowProduct
  const score = matchScore(result.topSheet.score)

  return (
    <motion.div
      className="min-h-screen bg-cream"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
    >
      {/* ── Report Header ─────────────────────────────────────── */}
      <div className="bg-gradient-to-br from-charcoal via-charcoal/95 to-gold text-cream">
        <div className="max-w-4xl mx-auto px-6 py-10">
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-gold-light text-xs font-semibold tracking-[0.25em] uppercase mb-1">TN Select · Tonia Nicole Pro Bar</p>
              <h1 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight">TN Pairing Report</h1>
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

            {/* ── Sheet Prescription ──────────────────────────── */}
            <motion.div variants={itemVariants} className="glass-card p-0 overflow-hidden">
              {/* Card header band */}
              <div className="bg-sage/12 border-b border-sage/20 px-7 py-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold tracking-widest uppercase text-charcoal/40 mb-0.5">Sheet Prescription</p>
                  <h2 className="text-xl font-semibold text-charcoal tracking-tight">{sheet.name}</h2>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs bg-charcoal/8 text-charcoal/55 px-3 py-1.5 rounded-full font-medium hidden sm:block">
                    {sheet.material} · {sheet.weave === 'N/A' ? 'Plain Weave' : `${sheet.weave} Weave`}
                  </span>
                  <MatchRing score={score} />
                </div>
              </div>

              <div className="px-7 py-6">
                <p className="text-charcoal/60 text-sm leading-relaxed mb-6">{sheet.description}</p>

                {/* Attribute bars */}
                <div className="space-y-4 mb-6">
                  <AttributeBar label="Breathability" value={sheet.ratings.breathability} color="bg-sage" descriptor={descriptors[sheet.ratings.breathability]} />
                  <AttributeBar label="Moisture Wicking" value={sheet.ratings.wicking} color="bg-blue-400/70" descriptor={descriptors[sheet.ratings.wicking]} />
                  <AttributeBar label="Warmth" value={sheet.ratings.warmth} color="bg-orange-400/70" descriptor={descriptors[sheet.ratings.warmth]} />
                  <AttributeBar label="Softness" value={sheet.ratings.softness} color="bg-purple-400/70" descriptor={descriptors[sheet.ratings.softness]} />
                </div>

                {/* Best-for tags */}
                <div className="flex flex-wrap gap-2">
                  {sheet.best_for.map(tag => (
                    <span key={tag} className="text-xs bg-sage/12 text-sage-dark px-3 py-1 rounded-full font-medium">{tag}</span>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* ── Why This Works + Fabric Simulator ─────────── */}
            <motion.div variants={itemVariants} className="grid sm:grid-cols-2 gap-5">
              {/* Why card */}
              <div className="glass-card p-6 flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-sage/20 flex items-center justify-center flex-shrink-0">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6L5 9L10 3" stroke="#6A8E67" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <p className="text-xs font-semibold tracking-widest uppercase text-charcoal/40">Why This Works</p>
                </div>
                <p className="text-sm text-charcoal/75 leading-relaxed flex-1">{result.whyText}</p>
              </div>

              {/* Fabric simulator */}
              <FabricSimulator product={sheet} />
            </motion.div>

            {/* ── Pillow + Bundle side-by-side ───────────────── */}
            <motion.div variants={itemVariants} className="grid sm:grid-cols-2 gap-5">
              {/* Pillow card */}
              <div className="glass-card p-6">
                <p className="text-xs font-semibold tracking-widest uppercase text-charcoal/40 mb-1">Pillow Prescription</p>
                <h3 className="text-lg font-semibold text-charcoal mb-1">{pillow.name}</h3>
                <p className="text-xs text-charcoal/45 mb-5">{pillow.fill} · {pillow.attributes.firmness} firmness</p>

                <div className="flex items-end gap-6 mb-5">
                  <LoftDiagram loft={pillow.attributes.loft} />
                  <div className="text-sm text-charcoal/60 leading-relaxed flex-1">
                    {pillow.attributes.loft === 'High' && 'Fills the gap between ear and shoulder — ideal for side sleepers with broad frames.'}
                    {pillow.attributes.loft === 'Medium' && 'Keeps your neck in neutral alignment whether you sleep on your back or side.'}
                    {pillow.attributes.loft === 'Low' && 'Prevents neck arching — the only safe loft for stomach sleepers.'}
                  </div>
                </div>

                <p className="text-sm text-charcoal/55 leading-relaxed">{pillow.description}</p>

                {pillow.attributes.adjustable && (
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-charcoal/6">
                    <div className="w-1.5 h-1.5 rounded-full bg-sage" />
                    <span className="text-xs text-charcoal/50">Adjustable fill — customise loft to your preference</span>
                  </div>
                )}
              </div>

              {/* Bundle card */}
              <div className="glass-card p-6 bg-sage/5">
                <p className="text-xs font-semibold tracking-widest uppercase text-charcoal/40 mb-4">Complete Setup</p>

                <div className="space-y-4">
                  {[
                    { label: 'Sheets', name: sheet.name, detail: sheet.material },
                    { label: 'Pillow', name: pillow.name, detail: `${pillow.attributes.loft} Loft · ${pillow.attributes.firmness}` },
                    { label: 'Duvet Cover', name: 'Climate-tuned pick', detail: result.bundleSuggestion },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-sage flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                          <path d="M2 5L4 7L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs text-charcoal/40 uppercase tracking-wide font-medium">{item.label}</p>
                        <p className="text-sm font-semibold text-charcoal">{item.name}</p>
                        <p className="text-xs text-charcoal/50 mt-0.5 leading-snug">{item.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* ── Runner-up / Also Consider ──────────────────── */}
            {result.allSheets.length > 1 && (
              <motion.div variants={itemVariants} className="glass-card p-5">
                <p className="text-xs font-semibold tracking-widest uppercase text-charcoal/30 mb-3">Also Consider</p>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <p className="font-medium text-charcoal text-sm">{result.allSheets[1].product.name}</p>
                    <p className="text-xs text-charcoal/45 mt-0.5">{result.allSheets[1].product.material} — {result.allSheets[1].product.description.split('.')[0]}.</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-sm font-bold text-charcoal/40">{matchScore(result.allSheets[1].score)}%</div>
                    <div className="text-xs text-charcoal/30">match</div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── Footer ────────────────────────────────────── */}
            <motion.div variants={itemVariants} className="text-center pt-2 pb-4">
              <p className="text-xs text-charcoal/25">TN Select · Tonia Nicole Pro Bar · {new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </motion.div>

          </motion.div>
      </main>
    </motion.div>
  )
}
