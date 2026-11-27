import { useState, useMemo, useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getRecommendation, matchPercent, pickTiers, MATERIAL_BROWSE_URL } from '../lib/engine'
import { useCatalog } from '../lib/CatalogContext'
import type { QuizAnswers, ScoredProduct, PriceTier } from '../lib/types'
import { useLang } from '../lib/LanguageContext'
import { tr } from '../lib/i18n'
import { isSectionComplete, recordVisit, endVisit } from '../lib/session'
import { heardSummary, reasonsFor } from '../lib/advice'
import { buildSleepPlanPdf, deliverFile, usesShareSheet } from '../lib/report'
import type { ReportData } from '../lib/report'

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
        : 'text-sm px-5 py-2.5 border border-charcoal/25 text-charcoal hover:border-gold hover:text-gold bg-white/50'}`}>
      {zh ? '在 FET.com 查看這款商品' : 'See this on FET.com'}
      <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M5 2H12V9M12 2L3 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
    </a>
  )
}

function Chip({ children, tone = 'neutral' }: { children: React.ReactNode; tone?: 'neutral' | 'sage' | 'gold' }) {
  const cls = tone === 'sage' ? 'bg-sage/12 text-sage-dark' : tone === 'gold' ? 'bg-gold/15 text-gold' : 'bg-charcoal/8 text-charcoal/55'
  return <span className={`text-xs px-3 py-1 rounded-full font-medium ${cls}`}>{children}</span>
}

// ── Prescription card ────────────────────────────────────────────────────────

const TIER_LABEL: Record<PriceTier, { en: string; zh: string }> = {
  entry:   { en: 'A good place to start', zh: '入門好選擇' },
  premium: { en: 'If you want to go further', zh: '想更進一步' },
}

const STYLE_LABEL: Record<string, { en: string; zh: string }> = {
  Nature: { en: 'Nature-inspired', zh: '自然風格' }, Minimal: { en: 'Minimalist', zh: '簡約風格' },
  Playful: { en: 'Playful', zh: '主題童趣' }, Classic: { en: 'Classic luxury', zh: '經典奢華' },
}
const WINTER_NOTE = {
  en: 'This is a winter-weight comforter. No lighter option is currently available in the materials that fit your allergy and scent answers.',
  zh: '此款為冬被。符合您過敏與氣味需求的材質，目前沒有較輕薄的款式。',
}

/** Everything a recommendation shows, shared by the on-screen card and the PDF. */
function cardView(section: SectionId, top: ScoredProduct, tier: PriceTier | undefined, alternative: boolean, answers: QuizAnswers, zh: boolean) {
  const meta = SECTIONS[section]
  const p = top.product
  return {
    name: zh ? p.name_zh : p.name_en,
    altName: zh ? p.name_en : p.name_zh,
    // Fall back to the other language when a product has copy in only one.
    bullets: zh ? (p.bullets_zh.length ? p.bullets_zh : p.bullets_en) : (p.bullets_en.length ? p.bullets_en : p.bullets_zh),
    headLabel: alternative && !tier ? (zh ? '也可考慮' : 'Also consider') : (zh ? meta.cardLabel.zh : meta.cardLabel.en),
    tierLabel: tier ? (zh ? TIER_LABEL[tier].zh : TIER_LABEL[tier].en) : undefined,
    typeLabel: zh ? p.type_zh : p.type_en,
    styleLabel: p.style && STYLE_LABEL[p.style] ? (zh ? STYLE_LABEL[p.style].zh : STYLE_LABEL[p.style].en) : undefined,
    // Warm sleeper, but the allergy / scent rules left only winter-weight comforters.
    winterNote: section === 'comforter' && answers.comforterTemp === 'Hot' && !top.matched.includes('comforterTemp'),
    browseUrl: section === 'sheets' && p.material ? MATERIAL_BROWSE_URL[p.material] : null,
    // "Why this fits": one cause-and-effect sentence per criterion this product satisfies.
    reasons: reasonsFor(top, answers, zh),
  }
}

function ProductCard({ section, top, tier, alternative = false, answers, zh }: {
  section: SectionId; top: ScoredProduct; tier?: PriceTier; alternative?: boolean; answers: QuizAnswers; zh: boolean
}) {
  const meta = SECTIONS[section]
  const p = top.product
  const accentBg = meta.accent === 'gold' ? 'bg-gold/8 border-gold/20' : 'bg-sage/12 border-sage/20'
  const tone = meta.accent === 'gold' ? 'gold' : 'sage'
  const { name, altName, bullets, headLabel, tierLabel, typeLabel, styleLabel, winterNote, browseUrl, reasons } = cardView(section, top, tier, alternative, answers, zh)

  return (
    <>
      <div className="glass-card p-0 overflow-hidden">
        <div className={`${accentBg} border-b px-7 py-4 flex items-center justify-between gap-4`}>
          <div className="min-w-0">
            <p className="text-xs font-semibold tracking-widest uppercase text-charcoal/40 mb-0.5 flex flex-wrap items-center gap-2">
              <span>{headLabel}</span>
              {tierLabel && <span className="normal-case tracking-normal text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-sage/15 text-sage-dark">{tierLabel}</span>}
            </p>
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
                {typeLabel && <Chip tone={tone}>{typeLabel}</Chip>}
                {styleLabel && <Chip>{styleLabel}</Chip>}
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
              <div className="flex flex-wrap items-center gap-3">
                <ShopButton url={p.url} zh={zh} />
                {browseUrl && (
                  <a href={browseUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-charcoal/50 hover:text-gold underline underline-offset-4 transition-colors">
                    {zh ? '探索更多此材質的設計' : 'Explore more designs in this material'}
                  </a>
                )}
              </div>
              {winterNote && (
                <p className="text-xs text-charcoal/50 leading-relaxed mt-4">
                  {zh ? WINTER_NOTE.zh : WINTER_NOTE.en}
                </p>
              )}
            </div>
          </div>
          {reasons.length > 0 && (
            <div className="mt-6 pt-5 border-t border-charcoal/6">
              <p className="text-[11px] font-semibold tracking-widest uppercase text-charcoal/35 mb-2.5">{zh ? '為什麼適合您' : 'Why this fits you'}</p>
              <ul className="space-y-1.5">
                {reasons.map(r => <li key={r} className="text-sm text-charcoal/65 leading-relaxed">{r}</li>)}
              </ul>
            </div>
          )}
        </div>
      </div>

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
  nightHeat: 'Hot', skinType: 'Sensitive', careLevel: 'Careful', sensoryPref: 'Silky', designStyle: 'Nature',
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
  const { catalog, loading: catalogLoading } = useCatalog()

  const [answers] = useState<QuizAnswers>(() => {
    const raw = sessionStorage.getItem('quiz_answers')
    return raw ? JSON.parse(raw) as QuizAnswers : DUMMY_ANSWERS
  })
  // Only a real quiz is recorded, never the dev fallback answers.
  const [fromQuiz] = useState(() => Boolean(sessionStorage.getItem('quiz_answers')))
  const result = useMemo(() => getRecommendation(answers, catalog), [answers, catalog])
  const ranked: Record<SectionId, ScoredProduct[]> = { sheets: result.sheets, comforter: result.comforters, pillow: result.pillows }

  const done: Record<SectionId, boolean> = {
    sheets: isSectionComplete('sheets', answers),
    comforter: isSectionComplete('comforter', answers),
    pillow: isSectionComplete('pillow', answers),
  }
  const doneCount = SECTION_ORDER.filter(id => done[id]).length
  const anyComplete = doneCount > 0

  function startOver() {
    try { sessionStorage.removeItem('quiz_answers'); sessionStorage.removeItem('tn_saved') } catch { /* ignore */ }
    endVisit()
    navigate('/')
  }
  // ── Download (PDF) ──
  // The file is built once per language and reused after that.
  type PdfPhase = 'idle' | 'working' | 'panel' | 'shared' | 'downloaded' | 'error'
  const pdfKey = lang
  const [built, setBuilt] = useState<{ key: string; file: File } | null>(null)
  const [pdfUi, setPdfUi] = useState<{ key: string; phase: PdfPhase } | null>(null)
  const inflight = useRef<{ key: string; promise: Promise<File> } | null>(null)
  const pdfFile = built?.key === pdfKey ? built.file : null
  const phase: PdfPhase = pdfUi?.key === pdfKey ? pdfUi.phase : 'idle'
  const [viaShare] = useState(() => usesShareSheet())

  function reportData(): ReportData {
    return {
      zh,
      heard: SECTION_ORDER.filter(id => done[id])
        .map(id => ({ label: tr(SECTIONS[id].label, lang), text: heardSummary(id, answers, zh) }))
        .filter(r => r.text),
      sections: SECTION_ORDER.filter(id => done[id]).map(id => {
        const pick = pickTiers(ranked[id])
        const picks = pick ? [
          { top: pick.primary, tier: pick.primaryTier, alternative: false },
          ...(pick.secondary ? [{ top: pick.secondary, tier: pick.secondaryTier, alternative: true }] : []),
        ] : []
        return {
          label: tr(SECTIONS[id].label, lang),
          cards: picks.map(({ top, tier, alternative }) => {
            const v = cardView(id, top, tier, alternative, answers, zh)
            return {
              head: v.headLabel, tier: v.tierLabel, name: v.name, altName: v.altName,
              tags: [v.typeLabel, v.styleLabel].filter((x): x is string => Boolean(x)),
              bullets: v.bullets, reasons: v.reasons,
              note: v.winterNote ? (zh ? WINTER_NOTE.zh : WINTER_NOTE.en) : undefined,
              url: top.product.url, imageUrl: top.product.image_url, match: matchPercent(top),
            }
          }),
        }
      }),
    }
  }

  function ensureBuilt(key: string): Promise<File> {
    if (inflight.current?.key === key) return inflight.current.promise
    const promise = buildSleepPlanPdf(reportData()).then(file => { setBuilt({ key, file }); return file })
    inflight.current = { key, promise }
    promise.catch(() => { if (inflight.current?.promise === promise) inflight.current = null })
    return promise
  }

  // iPhone / iPad only open the share sheet straight from a tap, so the file is
  // prepared in the background there and the first tap can hand it over at once.
  useEffect(() => {
    if (!viaShare || !anyComplete) return
    const t = setTimeout(() => { ensureBuilt(pdfKey).catch(() => { /* retried on tap */ }) }, 600)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- rebuild only when the file's identity changes
  }, [pdfKey, viaShare, anyComplete])

  // Anonymous response for analysis: answers and picks only, no personal data.
  useEffect(() => {
    // Wait for the live catalog so the recorded picks are the ones on screen.
    if (fromQuiz && !catalogLoading) recordVisit({ lang, answers, catalog })
    // eslint-disable-next-line react-hooks/exhaustive-deps -- once per results view; recordVisit ignores repeats
  }, [catalogLoading])

  async function handOver(file: File, key: string) {
    try {
      const outcome = await deliverFile(file)
      if (outcome === 'cancelled') setPdfUi(p => (p?.phase === 'panel' ? p : null))
      else {
        setPdfUi({ key, phase: outcome })
        if (fromQuiz) recordVisit({ lang, answers, catalog, downloaded: true })
      }
    } catch {
      // The tap was too long ago for Safari: ask for one more, unmissably.
      setPdfUi({ key, phase: 'panel' })
    }
  }

  async function handleDownload() {
    if (phase === 'working') return
    const key = pdfKey
    let file = pdfFile
    if (!file) {
      setPdfUi({ key, phase: 'working' })
      try { file = await ensureBuilt(key) }
      catch (e) { console.error('Sleep plan PDF failed', e); setPdfUi({ key, phase: 'error' }); return }
    }
    await handOver(file, key)
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
          {anyComplete && (
            <motion.div variants={itemVariants} className="glass-card p-6 sm:p-7">
              <p className="text-xs font-semibold tracking-widest uppercase text-charcoal/40 mb-3">{zh ? '我們聽到的' : 'What we heard'}</p>
              <div className="space-y-3">
                {SECTION_ORDER.filter(id => done[id]).map(id => {
                  const text = heardSummary(id, answers, zh)
                  return text ? (
                    <p key={id} className="text-[15px] text-charcoal/75 leading-relaxed">
                      <span className="font-semibold text-charcoal">{tr(SECTIONS[id].label, lang)}{zh ? '：' : ': '}</span>{text}
                    </p>
                  ) : null
                })}
              </div>
              <p className="text-xs text-charcoal/40 leading-relaxed mt-4">
                {zh ? '以下的建議都是依照您的回答挑選的。若有任何一項不符合，可以隨時修改答案。' : 'Everything below was chosen from your answers. If something does not sound like you, you can edit them at any time.'}
              </p>
            </motion.div>
          )}
          {SECTION_ORDER.map(id => {
            const sec = SECTIONS[id]
            const list = ranked[id]
            const pick = pickTiers(list)
            return (
              <motion.section key={id} id={`sec-${id}`} variants={itemVariants} className="scroll-mt-6">
                {done[id] && pick ? (
                  <div className="space-y-4">
                    <ProductCard section={id} top={pick.primary} tier={pick.primaryTier} answers={answers} zh={zh} />
                    {pick.secondary && <ProductCard section={id} top={pick.secondary} tier={pick.secondaryTier} alternative answers={answers} zh={zh} />}
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

          {/* ── Download ── */}
          {anyComplete && (
            <motion.div variants={itemVariants} className={`glass-card p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${phase === 'shared' || phase === 'downloaded' ? 'ring-1 ring-sage/40' : ''}`}>
              <div className="flex items-start gap-3">
                {(phase === 'shared' || phase === 'downloaded') && (
                  <div className="w-9 h-9 rounded-full bg-sage/20 flex items-center justify-center flex-shrink-0">
                    <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M4 10L8 14L16 6" stroke="#6A8E67" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                )}
                <div>
                  <p className="text-xs font-semibold tracking-widest uppercase text-charcoal/40 mb-1">{zh ? '帶走您的睡眠計畫' : 'Take your sleep plan with you'}</p>
                  <p className={`text-sm leading-relaxed ${phase === 'shared' || phase === 'downloaded' ? 'text-charcoal font-medium' : 'text-charcoal/55'}`} aria-live="polite">
                    {phase === 'error' ? (zh ? '無法產生 PDF，請再試一次。' : 'The PDF could not be created. Please try again.')
                      : phase === 'shared' ? (zh ? '完成。若您選擇「儲存到檔案」，可以在「檔案」App 中找到您的計畫。' : 'Done. If you chose Save to Files, your plan is in the Files app.')
                      : phase === 'downloaded' ? (zh ? '您的 PDF 已下載。若沒有開始下載，請再點一次按鈕。' : 'Your PDF has been downloaded. If it did not start, press the button again.')
                      : (zh ? '將您的建議下載為 PDF，存在這台裝置上，商品連結都可以直接點選。' : 'Download your recommendations as a PDF to keep on this device, with links to each product.')}
                  </p>
                </div>
              </div>
              <motion.button onClick={handleDownload} disabled={phase === 'working'}
                className="flex-shrink-0 border border-charcoal/25 bg-white/60 text-charcoal px-6 py-3 rounded-xl text-sm font-medium hover:border-gold hover:text-gold transition-colors inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-wait"
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M8 2v8M8 10L5 7M8 10l3-3M3 13h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                {phase === 'working' ? (zh ? '準備中…' : 'Preparing…')
                  : phase === 'shared' ? (zh ? '再次儲存或分享' : 'Save or share again')
                  : phase === 'downloaded' ? (zh ? '再次下載' : 'Download again')
                  : (zh ? '下載我的計畫（PDF）' : 'Download my plan (PDF)')}
              </motion.button>
            </motion.div>
          )}

          <motion.div variants={itemVariants} className="text-center pt-2 pb-4">
            <p className="text-xs text-charcoal/25">
              TN Select · {zh ? '東妮寢飾 Pro Bar' : 'Tonia Nicole Pro Bar'} · {new Date().toLocaleDateString(zh ? 'zh-TW' : 'en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </motion.div>
        </motion.div>
      </main>

      {/* ── "Ready" panel: only when the phone needs one more tap to open the share sheet ── */}
      {phase === 'panel' && pdfFile && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-charcoal/50 backdrop-blur-sm p-4" role="dialog" aria-modal="true">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: apple }}
            className="w-full max-w-sm bg-cream rounded-3xl shadow-2xl p-7 text-center">
            <div className="w-14 h-14 rounded-full bg-sage/20 flex items-center justify-center mx-auto mb-4">
              <svg width="26" height="26" viewBox="0 0 20 20" fill="none"><path d="M4 10L8 14L16 6" stroke="#6A8E67" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <p className="font-serif text-2xl text-charcoal mb-2">{zh ? '您的計畫已準備好' : 'Your plan is ready'}</p>
            <p className="text-sm text-charcoal/60 leading-relaxed mb-6">{zh ? '點選下方按鈕，然後選擇「儲存到檔案」。' : 'Tap the button below, then choose Save to Files.'}</p>
            <button onClick={() => handOver(pdfFile, pdfKey)} className="w-full bg-charcoal text-cream py-4 rounded-2xl text-base font-semibold cursor-pointer">
              {zh ? '儲存到我的手機' : 'Save to my phone'}
            </button>
            <button onClick={() => setPdfUi(null)} className="mt-4 text-sm text-charcoal/45 cursor-pointer">{zh ? '先不要' : 'Not now'}</button>
          </motion.div>
        </div>
      )}
    </motion.div>
  )
}
