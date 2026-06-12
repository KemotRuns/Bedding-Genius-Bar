import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getRecommendation } from '../lib/engine'
import type { QuizAnswers, RecommendationResult, SheetProduct, PillowProduct, ComforterProduct, NightHeat } from '../lib/types'
import { useLang } from '../lib/LanguageContext'
import { tr } from '../lib/i18n'

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
    label:   { en: 'Sheets & Bedding', zh: '床組材質' },
    chinese: '床組材質',
    desc:    { en: 'Find your ideal fabric for temperature control and skin comfort.', zh: '找出最適合您體溫調節與膚感的床單材質。' },
  },
  {
    id: 'comforter',
    label:   { en: 'Comforter', zh: '棉被' },
    chinese: '棉被',
    desc:    { en: 'Match your comforter\'s fill and warmth to how you sleep.', zh: '依睡眠習慣選出最適合您的棉被填充與保暖度。' },
  },
  {
    id: 'pillow',
    label:   { en: 'Pillow', zh: '枕頭' },
    chinese: '枕頭',
    desc:    { en: 'Align loft and firmness to your sleep position for pain-free mornings.', zh: '依睡姿選對枕頭高度與硬度，告別晨間頸痛。' },
  },
]

const PRODUCT_TITLES: Record<string, { en: string; zh: string }> = {
  sheets:    { en: 'Sheets Prescription',    zh: '床組診斷' },
  comforter: { en: 'Comforter Prescription', zh: '棉被診斷' },
  pillow:    { en: 'Pillow Prescription',    zh: '枕頭診斷' },
}

const CARD_LABELS: Record<string, { en: string; zh: string }> = {
  sheets:    { en: 'Sheet Prescription',    zh: '床組推薦' },
  comforter: { en: 'Comforter Prescription', zh: '棉被推薦' },
  pillow:    { en: 'Pillow Prescription',    zh: '枕頭推薦' },
}

const FILL_ZH: Record<string, string> = {
  Silk: '蠶絲', Wool: '羊毛', Down: '羽絨', 'Tech Fiber': '科技纖維',
  'Memory Foam': '記憶棉', Latex: '乳膠',
}
const WARMTH_ZH: Record<string, string> = {
  'All-Season': '四季被', Winter: '冬被', Summer: '夏被',
}
const WEIGHT_ZH: Record<string, string> = {
  Light: '輕量', Medium: '中等', Heavy: '厚重',
}
const MATERIAL_ZH: Record<string, string> = {
  Cotton: '棉', 'Tencel Lyocell': '天絲', Linen: '亞麻',
  Silk: '蠶絲', Flannel: '法蘭絨', 'Nylon Fiber': '尼龍纖維',
}
const WEAVE_ZH: Record<string, string> = {
  Percale: '平織', Sateen: '緞紋', Plain: '平紋', 'N/A': '平紋',
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
  label: string; value: 1 | 2 | 3 | 4 | 5; color: string; descriptor: string
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

function MatchRing({ score, zh }: { score: number; zh: boolean }) {
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
            fill="none" stroke="#C49A6C" strokeWidth="5" strokeLinecap="round"
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
      <span className="text-xs text-charcoal/40 font-medium tracking-wide">{zh ? '匹配' : 'Match'}</span>
    </div>
  )
}

function LoftDiagram({ loft, zh }: { loft: 'Low' | 'Medium' | 'High'; zh: boolean }) {
  const heights: Record<string, number> = { Low: 12, Medium: 22, High: 34 }
  const h = heights[loft]
  const label = zh
    ? { High: '高枕', Medium: '中枕', Low: '低枕' }[loft]
    : `${loft} Loft`
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
      <span className="text-xs font-semibold text-charcoal/60 uppercase tracking-widest">{label}</span>
    </div>
  )
}

function ProfileSection({ answers, zh }: { answers: QuizAnswers; zh: boolean }) {
  const badges: { icon: React.ReactNode; label: string }[] = []

  if (answers.nightHeat) {
    const m = {
      'Very Hot': { en: 'Hot sleeper',   zh: '極易出汗' },
      Warm:       { en: 'Runs warm',     zh: '偏熱體質' },
      Neutral:    { en: 'Comfortable',   zh: '體溫適中' },
      Cold:       { en: 'Runs cold',     zh: '偏冷體質' },
    }
    const key = answers.nightHeat as keyof typeof m
    badges.push({ icon: <TempIcon temp={answers.nightHeat as NightHeat} />, label: tr(m[key], zh ? 'zh' : 'en') })
  }

  if (answers.skinType && answers.skinType !== 'None') {
    const m = {
      Sensitive:       { en: 'Sensitive skin',    zh: '敏感肌' },
      'Allergic/Eczema': { en: 'Eczema / Allergic', zh: '過敏／濕疹' },
    }
    const key = answers.skinType as keyof typeof m
    badges.push({ icon: <ShieldIcon />, label: tr(m[key], zh ? 'zh' : 'en') })
  }

  if (answers.sleepPosition) {
    const m = {
      Side:        { en: 'Side sleeper',    zh: '側睡' },
      Back:        { en: 'Back sleeper',    zh: '仰睡' },
      Stomach:     { en: 'Stomach sleeper', zh: '趴睡' },
      Combination: { en: 'Combo sleeper',   zh: '多種睡姿' },
    }
    const key = answers.sleepPosition as keyof typeof m
    badges.push({ icon: <BedIcon />, label: tr(m[key], zh ? 'zh' : 'en') })
  }

  if (answers.shoulderWidth) {
    const m = {
      Petite:  { en: 'Narrower (S/XS)', zh: '窄肩 (S/XS)' },
      Average: { en: 'Average (M/L)',   zh: '標準肩 (M/L)' },
      Broad:   { en: 'Broader (XL+)',   zh: '寬肩 (XL+)' },
    }
    const key = answers.shoulderWidth as keyof typeof m
    badges.push({ icon: <BodyIcon />, label: tr(m[key], zh ? 'zh' : 'en') })
  }

  if (answers.comforterFeel) {
    const m = {
      Heavy:     { en: 'Heavy comforter', zh: '厚實棉被' },
      Fluffy:    { en: 'Fluffy comforter', zh: '蓬鬆棉被' },
      Smooth:    { en: 'Smooth & light',  zh: '輕薄順滑' },
      Practical: { en: 'Easy care',       zh: '易於清洗' },
    }
    const key = answers.comforterFeel as keyof typeof m
    badges.push({ icon: <WashIcon />, label: tr(m[key], zh ? 'zh' : 'en') })
  }

  if (answers.pillowFeel) {
    const m = {
      Sink:     { en: 'Cushioned pillow',   zh: '包覆感枕頭' },
      Springy:  { en: 'Springy pillow',     zh: '彈力枕頭' },
      Contour:  { en: 'Contouring pillow',  zh: '貼合枕頭' },
      Balanced: { en: 'Balanced pillow',    zh: '均衡枕頭' },
    }
    const key = answers.pillowFeel as keyof typeof m
    badges.push({ icon: <PersonIcon />, label: tr(m[key], zh ? 'zh' : 'en') })
  }

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

// ── Dev fallback ──────────────────────────────────────────────────────────────

const DUMMY_ANSWERS: QuizAnswers = {
  nightHeat: 'Warm', skinType: 'Sensitive', careLevel: 'Minimal',
  sensoryPref: 'Silky', comforterTemp: 'Neutral', comforterFeel: 'Smooth',
  breathingIssues: 'No', sleepPosition: 'Side', shoulderWidth: 'Average',
  pillowFeel: 'Balanced', pillowPriority: 'Value',
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function Results() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { lang } = useLang()
  const zh = lang === 'zh'

  const product = searchParams.get('product') ?? 'sheets'

  const [{ answers, result }] = useState<{ answers: QuizAnswers; result: RecommendationResult }>(() => {
    const raw = sessionStorage.getItem('quiz_answers')
    const a: QuizAnswers = raw ? JSON.parse(raw) as QuizAnswers : DUMMY_ANSWERS
    return { answers: a, result: getRecommendation(a) }
  })

  const sheet     = result.topSheet.product    as SheetProduct
  const pillow    = result.topPillow.product   as PillowProduct
  const comforter = result.topComforter.product as ComforterProduct

  const score = product === 'comforter'
    ? matchScore(result.topComforter.score)
    : product === 'pillow'
    ? matchScore(result.topPillow.score)
    : matchScore(result.topSheet.score)

  const pageTitle   = tr(PRODUCT_TITLES[product] ?? PRODUCT_TITLES.sheets, lang)
  const cardLabel   = tr(CARD_LABELS[product]    ?? CARD_LABELS.sheets, lang)
  const otherSections = ALL_SECTIONS.filter(s => s.id !== product)

  // Descriptor helper (bilingual)
  const descriptors: Record<number, { en: string; zh: string }> = {
    1: { en: 'Minimal',  zh: '極低' },
    2: { en: 'Low',      zh: '低' },
    3: { en: 'Moderate', zh: '中等' },
    4: { en: 'High',     zh: '高' },
    5: { en: 'Excellent', zh: '極佳' },
  }
  const desc = (v: 1 | 2 | 3 | 4 | 5) => tr(descriptors[v], lang)

  // Pillow loft description
  const loftDesc = {
    High:   { en: 'Fills the gap between ear and shoulder — ideal for side sleepers with broad frames.', zh: '填補耳朵到肩膀外側的空間，適合側睡的寬肩者。' },
    Medium: { en: 'Keeps your neck in neutral alignment whether you sleep on your back or side.',        zh: '讓頸椎保持自然對齊，適合仰睡或側睡。' },
    Low:    { en: 'Prevents neck arching — the only safe loft for stomach sleepers.',                    zh: '避免頸椎過度後仰，趴睡者的最佳選擇。' },
  }

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
              <p className="text-gold-light text-xs font-semibold tracking-[0.25em] uppercase mb-1">
                {zh ? 'TN Select · 東妮寢飾 Pro Bar' : 'TN Select · Tonia Nicole Pro Bar'}
              </p>
              <h1 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight">{pageTitle}</h1>
            </div>
            <button
              onClick={() => navigate('/')}
              className="text-cream/40 hover:text-cream/80 transition-colors text-sm flex items-center gap-1.5 mt-1 cursor-pointer"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M11 7H3M3 7L6 4M3 7L6 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {zh ? '重新開始' : 'Start over'}
            </button>
          </div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <ProfileSection answers={answers} zh={zh} />
          </motion.div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-6 pb-16">
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-5 pt-5">

          {/* ══════════════════ SHEETS ══════════════════ */}
          {product === 'sheets' && (
            <>
              <motion.div variants={itemVariants} className="glass-card p-0 overflow-hidden">
                <div className="bg-sage/12 border-b border-sage/20 px-7 py-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold tracking-widest uppercase text-charcoal/40 mb-0.5">{cardLabel}</p>
                    <h2 className="text-xl font-semibold text-charcoal tracking-tight">{sheet.name}</h2>
                    {sheet.collection && <p className="text-xs text-charcoal/45 mt-0.5">{sheet.collection}</p>}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="hidden sm:flex flex-col items-end gap-1.5">
                      <span className="text-xs bg-charcoal/8 text-charcoal/55 px-3 py-1.5 rounded-full font-medium">
                        {zh ? (MATERIAL_ZH[sheet.material] ?? sheet.material) : sheet.material} · {zh ? (WEAVE_ZH[sheet.weave] ?? sheet.weave) : (sheet.weave === 'N/A' ? 'Plain Weave' : `${sheet.weave} Weave`)}
                      </span>
                      {sheet.sku && (
                        <span className="font-mono text-[11px] text-charcoal/35 bg-charcoal/6 px-2.5 py-1 rounded-md tracking-wider">{sheet.sku}</span>
                      )}
                    </div>
                    <MatchRing score={score} zh={zh} />
                  </div>
                </div>
                <div className="px-7 py-6">
                  <p className="text-charcoal/60 text-sm leading-relaxed mb-6">{zh && sheet.description_zh ? sheet.description_zh : sheet.description}</p>
                  <div className="space-y-4 mb-6">
                    <AttributeBar label={zh ? '透氣度' : 'Breathability'}    value={sheet.ratings.breathability} color="bg-sage"            descriptor={desc(sheet.ratings.breathability)} />
                    <AttributeBar label={zh ? '吸濕排汗' : 'Moisture Wicking'} value={sheet.ratings.wicking}       color="bg-blue-400/70"    descriptor={desc(sheet.ratings.wicking)} />
                    <AttributeBar label={zh ? '保暖度' : 'Warmth'}            value={sheet.ratings.warmth}         color="bg-orange-400/70"  descriptor={desc(sheet.ratings.warmth)} />
                    <AttributeBar label={zh ? '柔軟度' : 'Softness'}          value={sheet.ratings.softness}       color="bg-purple-400/70"  descriptor={desc(sheet.ratings.softness)} />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(zh && sheet.best_for_zh ? sheet.best_for_zh : sheet.best_for).map(tag => (
                      <span key={tag} className="text-xs bg-sage/12 text-sage-dark px-3 py-1 rounded-full font-medium">{tag}</span>
                    ))}
                  </div>
                </div>
              </motion.div>

              {result.allSheets.length > 1 && (
                <motion.div variants={itemVariants} className="glass-card p-5">
                  <p className="text-xs font-semibold tracking-widest uppercase text-charcoal/30 mb-3">
                    {zh ? '也可考慮' : 'Also Consider'}
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-baseline gap-2">
                        <p className="font-medium text-charcoal text-sm">{result.allSheets[1].product.name}</p>
                        {result.allSheets[1].product.sku && (
                          <span className="font-mono text-[10px] text-charcoal/30 tracking-wider">{result.allSheets[1].product.sku}</span>
                        )}
                      </div>
                      <p className="text-xs text-charcoal/45 mt-0.5">
                        {zh ? (MATERIAL_ZH[result.allSheets[1].product.material] ?? result.allSheets[1].product.material) : result.allSheets[1].product.material} — {zh && result.allSheets[1].product.description_zh ? result.allSheets[1].product.description_zh.split('。')[0] + '。' : result.allSheets[1].product.description.split('.')[0] + '.'}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-sm font-bold text-charcoal/40">{matchScore(result.allSheets[1].score)}%</div>
                      <div className="text-xs text-charcoal/30">{zh ? '匹配度' : 'match'}</div>
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
                  <p className="text-xs font-semibold tracking-widest uppercase text-charcoal/40 mb-0.5">{cardLabel}</p>
                  <h2 className="text-xl font-semibold text-charcoal tracking-tight">{comforter.name}</h2>
                  {comforter.collection && <p className="text-xs text-charcoal/45 mt-0.5">{comforter.collection}</p>}
                </div>
                <div className="flex items-center gap-3">
                  <div className="hidden sm:flex flex-col items-end gap-1.5">
                    <span className="text-xs bg-gold/15 text-gold px-3 py-1.5 rounded-full font-medium">
                      {zh ? (FILL_ZH[comforter.fill] ?? comforter.fill) : comforter.fill} · {zh ? (WARMTH_ZH[comforter.attributes.warmth] ?? comforter.attributes.warmth) : comforter.attributes.warmth}
                    </span>
                    {comforter.sku && (
                      <span className="font-mono text-[11px] text-charcoal/35 bg-charcoal/6 px-2.5 py-1 rounded-md tracking-wider">{comforter.sku}</span>
                    )}
                  </div>
                  <MatchRing score={score} zh={zh} />
                </div>
              </div>
              <div className="px-7 py-6">
                <p className="text-charcoal/60 text-sm leading-relaxed mb-6">{zh && comforter.description_zh ? comforter.description_zh : comforter.description}</p>
                <div className="space-y-4 mb-6">
                  <AttributeBar label={zh ? '保暖度' : 'Warmth'}       value={comforter.ratings.warmth}        color="bg-orange-400/70" descriptor={desc(comforter.ratings.warmth)} />
                  <AttributeBar label={zh ? '透氣度' : 'Breathability'} value={comforter.ratings.breathability} color="bg-sage"          descriptor={desc(comforter.ratings.breathability)} />
                  <AttributeBar label={zh ? '蓬鬆度' : 'Fluffiness'}    value={comforter.ratings.fluffiness}    color="bg-purple-400/70" descriptor={desc(comforter.ratings.fluffiness)} />
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {(zh && comforter.best_for_zh ? comforter.best_for_zh : comforter.best_for).map(tag => (
                    <span key={tag} className="text-xs bg-gold/10 text-gold px-3 py-1 rounded-full font-medium">{tag}</span>
                  ))}
                </div>
                <div className="flex gap-3 flex-wrap">
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${comforter.attributes.hypoallergenic ? 'bg-sage/12 text-sage-dark' : 'bg-charcoal/6 text-charcoal/40'}`}>
                    {comforter.attributes.hypoallergenic ? (zh ? '✓ 防蟎抗菌' : '✓ Hypoallergenic') : (zh ? '非低敏材質' : 'Non-hypoallergenic')}
                  </span>
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${comforter.attributes.washable ? 'bg-blue-400/12 text-blue-600/80' : 'bg-charcoal/6 text-charcoal/40'}`}>
                    {comforter.attributes.washable ? (zh ? '✓ 可機洗' : '✓ Machine washable') : (zh ? '僅限乾洗' : 'Dry-clean only')}
                  </span>
                  <span className="text-xs bg-charcoal/6 text-charcoal/40 px-3 py-1 rounded-full font-medium">
                    {zh ? (WEIGHT_ZH[comforter.attributes.weight] ?? comforter.attributes.weight) : `${comforter.attributes.weight} weight`}
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
                  <p className="text-xs font-semibold tracking-widest uppercase text-charcoal/40 mb-0.5">{cardLabel}</p>
                  <h2 className="text-xl font-semibold text-charcoal tracking-tight">{pillow.name}</h2>
                  {pillow.collection && <p className="text-xs text-charcoal/45 mt-0.5">{pillow.collection}</p>}
                </div>
                <div className="flex items-center gap-3">
                  <div className="hidden sm:flex flex-col items-end gap-1.5">
                    <span className="text-xs bg-charcoal/8 text-charcoal/55 px-3 py-1.5 rounded-full font-medium">
                      {zh ? (FILL_ZH[pillow.fill] ?? pillow.fill) : pillow.fill} · {zh
                        ? { Firm: '硬', Medium: '中', Soft: '軟' }[pillow.attributes.firmness]
                        : `${pillow.attributes.firmness} firmness`}
                    </span>
                    {pillow.sku && (
                      <span className="font-mono text-[11px] text-charcoal/35 bg-charcoal/6 px-2.5 py-1 rounded-md tracking-wider">{pillow.sku}</span>
                    )}
                  </div>
                  <MatchRing score={score} zh={zh} />
                </div>
              </div>
              <div className="px-7 py-6">
                <div className="flex items-end gap-6 mb-5">
                  <LoftDiagram loft={pillow.attributes.loft} zh={zh} />
                  <div className="text-sm text-charcoal/60 leading-relaxed flex-1">
                    {tr(loftDesc[pillow.attributes.loft], lang)}
                  </div>
                </div>
                <p className="text-sm text-charcoal/60 leading-relaxed mb-5">{zh && pillow.description_zh ? pillow.description_zh : pillow.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {(zh && pillow.best_for_zh ? pillow.best_for_zh : pillow.best_for).map(tag => (
                    <span key={tag} className="text-xs bg-sage/12 text-sage-dark px-3 py-1 rounded-full font-medium">{tag}</span>
                  ))}
                </div>
                {pillow.attributes.adjustable && (
                  <div className="flex items-center gap-2 pt-4 border-t border-charcoal/6">
                    <div className="w-1.5 h-1.5 rounded-full bg-sage" />
                    <span className="text-xs text-charcoal/50">
                      {zh ? '可調整填充量，依喜好自訂枕頭高度' : 'Adjustable fill — customise loft to your preference'}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* ── Why This Works ───────────────────────── */}
          <motion.div variants={itemVariants} className="glass-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded-full bg-sage/20 flex items-center justify-center flex-shrink-0">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6L5 9L10 3" stroke="#6A8E67" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <p className="text-xs font-semibold tracking-widest uppercase text-charcoal/40">
                {zh ? '為什麼適合您' : 'Why This Works'}
              </p>
            </div>
            <p className="text-sm text-charcoal/75 leading-relaxed">
              {zh ? result.whyText_zh : result.whyText}
            </p>
          </motion.div>

          {/* ── Also Explore ─────────────────────────── */}
          <motion.div variants={itemVariants} className="glass-card p-6 bg-sage/5">
            <p className="text-xs font-semibold tracking-widest uppercase text-charcoal/40 mb-4">
              {zh ? '探索其他品項' : 'Also Explore'}
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {otherSections.map(s => (
                <button
                  key={s.id}
                  onClick={() => navigate(`/quiz?product=${s.id}`)}
                  className="text-left p-4 rounded-xl border border-charcoal/10 bg-white/40 hover:border-gold/50 hover:bg-white/70 transition-all cursor-pointer"
                >
                  <p className="text-[10px] font-bold tracking-widest uppercase text-charcoal/35 mb-0.5">{tr(s.label, lang)}</p>
                  <p className="text-base font-semibold text-charcoal mb-1">{s.chinese}</p>
                  <p className="text-xs text-charcoal/50 leading-relaxed mb-3">{tr(s.desc, lang)}</p>
                  <div className="flex items-center gap-1.5 text-gold text-xs font-semibold">
                    {zh ? '開始' : 'Begin'}
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6h8M8 4l2 2-2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>

          {/* ── Footer ───────────────────────────────── */}
          <motion.div variants={itemVariants} className="text-center pt-2 pb-4">
            <p className="text-xs text-charcoal/25">
              TN Select · {zh ? '東妮寢飾 Pro Bar' : 'Tonia Nicole Pro Bar'} · {new Date().toLocaleDateString(zh ? 'zh-TW' : 'en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </motion.div>

        </motion.div>
      </main>
    </motion.div>
  )
}
