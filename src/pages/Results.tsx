import { useState, useMemo, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getRecommendation, matchPercent } from '../lib/engine'
import { useCatalog } from '../lib/CatalogContext'
import type { QuizAnswers, ScoredProduct } from '../lib/types'
import { useLang } from '../lib/LanguageContext'
import { tr } from '../lib/i18n'
import { buildSession, saveSession, isSectionComplete } from '../lib/session'

const SECTION_ORDER = ['sheets', 'comforter', 'pillow'] as const
type SectionId = typeof SECTION_ORDER[number]

const apple = [0.22, 1, 0.36, 1] as const
const itemVariants = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: apple } } }
const containerVariants = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } }

const SECTIONS: Record<SectionId, { label: { en: string; zh: string }; desc: { en: string; zh: string }; cardLabel: { en: string; zh: string }; accent: string }> = {
  sheets:    { label: { en: 'Bedding Sets', zh: '床組' }, desc: { en: 'Find your ideal fabric and design for temperature control and skin comfort.', zh: '找出最適合您體溫調節、膚感與風格的床組。' }, cardLabel: { en: 'Bedding Set Recommendation', zh: '床組推薦' }, accent: 'sage' },
  comforter: { label: { en: 'Comforter', zh: '棉被' }, desc: { en: 'Match your comforter\'s fill and warmth to how you sleep.', zh: '依睡眠習慣選出最適合您的棉被填充與保暖度。' }, cardLabel: { en: 'Comforter Recommendation', zh: '棉被推薦' }, accent: 'gold' },
  pillow:    { label: { en: 'Pillow', zh: '枕頭' }, desc: { en: 'Align height and feel to your sleep position for pain-free mornings.', zh: '依睡姿選對枕頭高度與觸感，告別晨間頸痛。' }, cardLabel: { en: 'Pillow Recommendation', zh: '枕頭推薦' }, accent: 'sage' },
}

// ── Sub-components ────────────────────────────────────────────────────────────

function MatchRing({ score, zh }: { score: number; zh: boolean }) {
  const radius = 28
  const circumference = 2 * Math.PI * radius
  const dash = (score / 100) * circumference
  return (
    <div className="flex flex-col items-center gap-1 flex-shrink-0">
      <div className="relative w-20 h-20">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 72 72">
          <circle cx="36" cy="36" r={radius} fill="none" stroke="rgba(26,26,26,0.08)" strokeWidth="5" />
          <motion.circle cx="36" cy="36" r={radius} fill="none" stroke="#C49A6C" strokeWidth="5" strokeLinecap="round"
            strokeDasharray={circumference} initial={{ strokeDashoffset: circumference }} animate={{ strokeDashoffset: circumference - dash }}
            transition={{ duration: 1, ease: apple, delay: 0.4 }} />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center"><span className="text-lg font-bold text-charcoal">{score}%</span></div>
      </div>
      <span className="text-xs text-charcoal/40 font-medium tracking-wide">{zh ? '匹配' : 'Match'}</span>
    </div>
  )
}

function ProductImage({ src, alt, className = '' }: { src: string; alt: string; className?: string }) {
  const [failed, setFailed] = useState(false)
  if (!src || failed) {
    return <div className={`bg-charcoal/5 flex items-center justify-center text-charcoal/25 text-xs ${className}`}>No photo</div>
  }
  return <img src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} className={`object-cover ${className}`} />
}

function ShopButton({ url, zh, small = false }: { url: string; zh: boolean; small?: boolean }) {
  return (
    <a href={url} target="_blank" rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 rounded-xl font-medium transition-colors cursor-pointer ${small
        ? 'text-xs px-3 py-1.5 border border-charcoal/15 text-charcoal/60 hover:border-gold hover:text-gold'
        : 'text-sm px-5 py-2.5 bg-charcoal text-cream hover:bg-charcoal/85 shadow-sm'}`}>
      {zh ? '前往 FET.com 選購' : 'View on FET.com'}
      <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M5 2H12V9M12 2L3 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
    </a>
  )
}

function Chip({ children, tone = 'neutral' }: { children: React.ReactNode; tone?: 'neutral' | 'sage' | 'gold' }) {
  const cls = tone === 'sage' ? 'bg-sage/12 text-sage-dark' : tone === 'gold' ? 'bg-gold/15 text-gold' : 'bg-charcoal/8 text-charcoal/55'
  return <span className={`text-xs px-3 py-1 rounded-full font-medium ${cls}`}>{children}</span>
}

// ── Prescription card ────────────────────────────────────────────────────────

function ProductCard({ section, top, runnerUp, answers, zh }: {
  section: SectionId; top: ScoredProduct; runnerUp?: ScoredProduct; answers: QuizAnswers; zh: boolean
}) {
  const { questions } = useCatalog()
  const meta = SECTIONS[section]
  const p = top.product
  const accentBg = meta.accent === 'gold' ? 'bg-gold/8 border-gold/20' : 'bg-sage/12 border-sage/20'
  const tone = meta.accent === 'gold' ? 'gold' : 'sage'
  const name = zh ? p.name_zh : p.name_en
  const altName = zh ? p.name_en : p.name_zh
  const bullets = zh ? p.bullets_zh : p.bullets_en

  // "Why this fits": the option labels of every criterion this product satisfied.
  const matchedLabels = top.matched.map(q => {
    const qc = questions.find(x => x.id === q)
    const opt = qc?.options.find(o => o.value === answers[q])
    return opt ? (zh && opt.label_zh ? opt.label_zh : opt.label) : null
  }).filter((x): x is string => Boolean(x))

  return (
    <>
      <div className="glass-card p-0 overflow-hidden">
        <div className={`${accentBg} border-b px-7 py-4 flex items-center justify-between gap-4`}>
          <div className="min-w-0">
            <p className="text-xs font-semibold tracking-widest uppercase text-charcoal/40 mb-0.5">{zh ? meta.cardLabel.zh : meta.cardLabel.en}</p>
            <h2 className="text-xl font-semibold text-charcoal tracking-tight leading-snug">{name}</h2>
            {altName && <p className="text-xs text-charcoal/45 mt-0.5 truncate">{altName}</p>}
          </div>
          <MatchRing score={matchPercent(top)} zh={zh} />
        </div>
        <div className="px-7 py-6">
          <div className="flex flex-col sm:flex-row gap-6">
            <a href={p.url} target="_blank" rel="noopener noreferrer" className="flex-shrink-0 block w-full sm:w-44">
              <ProductImage src={p.image_url} alt={name} className="w-full aspect-square rounded-xl border border-charcoal/8 bg-white" />
            </a>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap gap-2 mb-4">
                {(zh ? p.type_zh : p.type_en) && <Chip tone={tone}>{zh ? p.type_zh : p.type_en}</Chip>}
                {p.style && <Chip>{{ Nature: zh ? '自然風格' : 'Nature-inspired', Minimal: zh ? '簡約風格' : 'Minimalist', Playful: zh ? '主題童趣' : 'Playful', Classic: zh ? '經典奢華' : 'Classic luxury' }[p.style]}</Chip>}
              </div>
              {bullets.length > 0 && (
                <ul className="space-y-2 mb-5">
                  {bullets.map((b, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-charcoal/70 leading-relaxed">
                      <svg className="mt-1 flex-shrink-0" width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7L6 10L11 4" stroke="#567A53" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              )}
              <ShopButton url={p.url} zh={zh} />
            </div>
          </div>
          {matchedLabels.length > 0 && (
            <div className="mt-6 pt-5 border-t border-charcoal/6">
              <p className="text-[11px] font-semibold tracking-widest uppercase text-charcoal/35 mb-2">{zh ? '符合您的需求' : 'Why this fits you'}</p>
              <div className="flex flex-wrap gap-2">{matchedLabels.map(l => <Chip key={l} tone="sage">{l}</Chip>)}</div>
            </div>
          )}
        </div>
      </div>

      {runnerUp && runnerUp.score > 0 && (
        <div className="glass-card p-5 mt-4">
          <p className="text-xs font-semibold tracking-widest uppercase text-charcoal/30 mb-3">{zh ? '也可考慮' : 'Also consider'}</p>
          <div className="flex items-center gap-4">
            <a href={runnerUp.product.url} target="_blank" rel="noopener noreferrer" className="flex-shrink-0">
              <ProductImage src={runnerUp.product.image_url} alt={zh ? runnerUp.product.name_zh : runnerUp.product.name_en} className="w-16 h-16 rounded-lg border border-charcoal/8 bg-white" />
            </a>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-charcoal text-sm leading-snug">{zh ? runnerUp.product.name_zh : runnerUp.product.name_en}</p>
              <p className="text-xs text-charcoal/45 mt-0.5">{zh ? runnerUp.product.type_zh : runnerUp.product.type_en}</p>
              <div className="mt-2"><ShopButton url={runnerUp.product.url} zh={zh} small /></div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-sm font-bold text-charcoal/40">{matchPercent(runnerUp)}%</div>
              <div className="text-xs text-charcoal/30">{zh ? '匹配度' : 'match'}</div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// ── Profile badges (header) ──────────────────────────────────────────────────

const PROFILE_KEYS: (keyof QuizAnswers)[] = ['nightHeat', 'skinType', 'designStyle', 'comforterTemp', 'comforterFeel', 'sleepPosition', 'shoulderWidth', 'pillowFeel']

function ProfileSection({ answers, zh }: { answers: QuizAnswers; zh: boolean }) {
  const { questions } = useCatalog()
  const badges = PROFILE_KEYS.map(k => {
    const v = answers[k]; if (!v) return null
    const opt = questions.find(q => q.id === k)?.options.find(o => o.value === v)
    return opt ? (zh && opt.label_zh ? opt.label_zh : opt.label) : null
  }).filter((x): x is string => Boolean(x))
  if (badges.length === 0) return null
  return (
    <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
      {badges.map(b => <span key={b} className="text-xs font-medium text-charcoal/75 px-3.5 py-2 bg-white/50 backdrop-blur-sm border border-white/60 rounded-2xl">{b}</span>)}
    </div>
  )
}

// ── Dev fallback (no quiz in session) ────────────────────────────────────────
const DUMMY_ANSWERS: QuizAnswers = {
  nightHeat: 'Warm', skinType: 'SensitiveLux', careLevel: 'Standard', sensoryPref: 'Silky', designStyle: 'Nature',
  comforterTemp: 'Neutral', comforterFeel: 'Smooth', comforterAllergy: 'Natural', comforterScent: 'NoScent', comforterUse: 'Luxury',
  sleepPosition: 'Side', shoulderWidth: 'Average', pillowFeel: 'Contour', pillowAllergy: 'Yes', pillowTier: 'Enhanced',
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function Results() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { lang } = useLang()
  const zh = lang === 'zh'
  const product = searchParams.get('product') ?? 'sheets'
  const { catalog } = useCatalog()

  const [answers] = useState<QuizAnswers>(() => {
    const raw = sessionStorage.getItem('quiz_answers')
    return raw ? JSON.parse(raw) as QuizAnswers : DUMMY_ANSWERS
  })
  const result = useMemo(() => getRecommendation(answers, catalog), [answers, catalog])
  const ranked: Record<SectionId, ScoredProduct[]> = { sheets: result.sheets, comforter: result.comforters, pillow: result.pillows }

  const done: Record<SectionId, boolean> = {
    sheets: isSectionComplete('sheets', answers),
    comforter: isSectionComplete('comforter', answers),
    pillow: isSectionComplete('pillow', answers),
  }
  const doneCount = SECTION_ORDER.filter(id => done[id]).length
  const anyComplete = doneCount > 0

  // ── Save ──
  const savedInit = (() => { try { return JSON.parse(sessionStorage.getItem('tn_saved') || 'null') as { name: string; email: string } | null } catch { return null } })()
  const [name, setName] = useState(savedInit?.name ?? '')
  const [email, setEmail] = useState(savedInit?.email ?? '')
  const [saved, setSaved] = useState(Boolean(savedInit))
  const [nameError, setNameError] = useState(false)

  function handleFinalize() {
    if (!name.trim()) { setNameError(true); return }
    saveSession(buildSession({ name, email, lang, answers, catalog }))
    try { sessionStorage.setItem('tn_saved', JSON.stringify({ name: name.trim(), email: email.trim() })) } catch { /* ignore */ }
    setSaved(true)
  }
  function startOver() {
    try { sessionStorage.removeItem('quiz_answers'); sessionStorage.removeItem('tn_saved') } catch { /* ignore */ }
    navigate('/')
  }
  function scrollToSection(id: string) { document.getElementById(`sec-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }

  useEffect(() => {
    const el = document.getElementById(`sec-${product}`)
    if (el) { const t = setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 200); return () => clearTimeout(t) }
  }, [product])

  return (
    <motion.div className="min-h-screen bg-cream" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>
      {/* ── Header ── */}
      <div className="bg-gradient-to-br from-charcoal via-charcoal/95 to-gold text-cream">
        <div className="max-w-4xl mx-auto px-6 py-10">
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-gold-light text-xs font-semibold tracking-[0.25em] uppercase mb-1">{zh ? 'TN Select · 東妮寢飾 Pro Bar' : 'TN Select · Tonia Nicole Pro Bar'}</p>
              <h1 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight">{zh ? '您的睡眠計畫' : 'Your Sleep Plan'}</h1>
              <p className="text-cream/55 text-sm mt-1">{zh ? `已完成 ${doneCount} / 3 項` : `${doneCount} of 3 complete`}</p>
            </div>
            <button onClick={startOver} className="text-cream/40 hover:text-cream/80 transition-colors text-sm flex items-center gap-1.5 mt-1 cursor-pointer">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M11 7H3M3 7L6 4M3 7L6 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              {zh ? '重新開始' : 'Start over'}
            </button>
          </div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <ProfileSection answers={answers} zh={zh} />
          </motion.div>
          <div className="flex flex-wrap gap-2 mt-5">
            {SECTION_ORDER.map(id => (
              <button key={id} onClick={() => scrollToSection(id)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-colors cursor-pointer flex items-center gap-1.5 ${done[id] ? 'bg-cream/15 border-cream/30 text-cream' : 'border-cream/15 text-cream/45 hover:text-cream/70'}`}>
                <span>{done[id] ? '✓' : '○'}</span>{tr(SECTIONS[id].label, lang)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-6 pb-16">
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6 pt-6">
          {SECTION_ORDER.map(id => {
            const sec = SECTIONS[id]
            const list = ranked[id]
            return (
              <motion.section key={id} id={`sec-${id}`} variants={itemVariants} className="scroll-mt-6">
                {done[id] && list[0] ? (
                  <div className="space-y-2">
                    <ProductCard section={id} top={list[0]} runnerUp={list[1]} answers={answers} zh={zh} />
                    <div className="flex justify-end">
                      <button onClick={() => navigate(`/quiz?product=${id}&edit=1`)} className="text-xs font-medium text-charcoal/45 hover:text-gold transition-colors flex items-center gap-1.5 cursor-pointer">
                        <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M9.5 2.5l2 2L5 11l-2.5.5L3 9l6.5-6.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg>
                        {zh ? '修改我的答案' : 'Edit answers'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => navigate(`/quiz?product=${id}`)} className="w-full text-left p-6 rounded-2xl border-2 border-dashed border-charcoal/15 bg-white/30 hover:border-gold/50 hover:bg-white/60 transition-all cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-bold tracking-widest uppercase text-charcoal/35 mb-0.5">{tr(sec.label, lang)}</p>
                        <p className="text-lg font-semibold text-charcoal mb-1">{zh ? '尚未完成' : 'Not done yet'}</p>
                        <p className="text-xs text-charcoal/50 leading-relaxed max-w-md">{tr(sec.desc, lang)}</p>
                      </div>
                      <div className="flex items-center gap-1.5 text-gold text-sm font-semibold flex-shrink-0 ml-4">
                        {zh ? '開始' : 'Start'}
                        <svg width="14" height="14" viewBox="0 0 12 12" fill="none"><path d="M2 6h8M8 4l2 2-2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </div>
                    </div>
                  </button>
                )}
              </motion.section>
            )
          })}

          {/* ── Save ── */}
          {anyComplete && (
            <motion.div variants={itemVariants} className="glass-card p-6">
              {saved ? (
                <div className="text-center py-2">
                  <div className="w-10 h-10 rounded-full bg-sage/20 flex items-center justify-center mx-auto mb-3">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 10L8 14L16 6" stroke="#6A8E67" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                  <p className="text-sm font-semibold text-charcoal mb-1">{zh ? `已儲存，${name}！` : `Saved, ${name}!`}</p>
                  <p className="text-xs text-charcoal/50 leading-relaxed">
                    {email ? (zh ? `我們會將您的睡眠計畫寄送至 ${email}。` : `We'll send your sleep plan to ${email}.`) : (zh ? '您的睡眠檔案已儲存。' : 'Your sleep profile has been saved.')}
                  </p>
                  <button onClick={() => setSaved(false)} className="text-xs text-charcoal/40 hover:text-gold mt-3 cursor-pointer">{zh ? '以最新答案重新儲存' : 'Re-save with latest answers'}</button>
                </div>
              ) : (
                <>
                  <p className="text-xs font-semibold tracking-widest uppercase text-charcoal/40 mb-1">{zh ? '儲存您的睡眠計畫' : 'Save your sleep plan'}</p>
                  <p className="text-sm text-charcoal/55 leading-relaxed mb-4">
                    {zh ? '留下您的姓名以儲存目前的推薦結果，並可選填 Email 以接收完整報告。' : 'Add your name to save everything you\'ve completed, and an optional email to receive your full report.'}
                  </p>
                  <div className="grid sm:grid-cols-2 gap-3 mb-4">
                    <div>
                      <input type="text" value={name} onChange={e => { setName(e.target.value); if (nameError) setNameError(false) }} placeholder={zh ? '姓名（必填）' : 'Name (required)'}
                        className={`w-full px-4 py-3 rounded-xl bg-white/60 border text-sm text-charcoal placeholder:text-charcoal/35 outline-none focus:border-gold transition-colors ${nameError ? 'border-red-300' : 'border-charcoal/12'}`} />
                      {nameError && <p className="text-xs text-red-400 mt-1 pl-1">{zh ? '請輸入您的姓名' : 'Please enter your name'}</p>}
                    </div>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder={zh ? 'Email（選填）' : 'Email (optional)'}
                      className="w-full px-4 py-3 rounded-xl bg-white/60 border border-charcoal/12 text-sm text-charcoal placeholder:text-charcoal/35 outline-none focus:border-gold transition-colors" />
                  </div>
                  <motion.button onClick={handleFinalize} className="bg-charcoal text-cream px-8 py-3 rounded-xl text-sm font-medium hover:bg-charcoal/85 transition-colors shadow-sm inline-flex items-center gap-2 cursor-pointer" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                    {zh ? '儲存我的計畫' : 'Save my plan'}
                    <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </motion.button>
                </>
              )}
            </motion.div>
          )}

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
