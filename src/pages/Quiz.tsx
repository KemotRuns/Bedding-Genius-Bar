import { useState, useRef, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import ProgressBar from '../components/ui/ProgressBar'
import IconSelector from '../components/ui/IconSelector'
import Sidebar from '../components/quiz/Sidebar'
import { QUESTIONS } from '../lib/questions'
import type { QuizAnswers } from '../lib/types'
import { useLang } from '../lib/LanguageContext'

const apple = [0.22, 1, 0.36, 1] as const

const SECTION_MAP: Record<string, string> = {
  sheets:    'Sheets & Materials',
  comforter: 'Comforter',
  pillow:    'Pillows',
}

const SECTION_TITLE_BILINGUAL: Record<string, { en: string; zh: string }> = {
  sheets:    { en: 'Sheets & Bedding', zh: '床組材質' },
  comforter: { en: 'Comforter',        zh: '棉被' },
  pillow:    { en: 'Pillow',           zh: '枕頭' },
}

export default function Quiz() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { lang } = useLang()
  const zh = lang === 'zh'

  const product = searchParams.get('product') ?? 'sheets'
  const sectionName = SECTION_MAP[product] ?? 'Sheets & Materials'
  const sectionTitleObj = SECTION_TITLE_BILINGUAL[product] ?? SECTION_TITLE_BILINGUAL.sheets
  const sectionTitle = zh ? sectionTitleObj.zh : sectionTitleObj.en

  const sectionQuestions = QUESTIONS.filter(q => q.section === sectionName)

  const [answers, setAnswers] = useState<QuizAnswers>(() => {
    const raw = sessionStorage.getItem('quiz_answers')
    if (!raw) return {}
    const all = JSON.parse(raw) as QuizAnswers
    const sectionKeys = new Set(sectionQuestions.map(q => q.id as string))
    return Object.fromEntries(
      Object.entries(all).filter(([k]) => sectionKeys.has(k))
    ) as QuizAnswers
  })

  const [revealed, setRevealed] = useState(() => {
    const raw = sessionStorage.getItem('quiz_answers')
    if (!raw) return 1
    const all = JSON.parse(raw) as QuizAnswers
    const answered = sectionQuestions.filter(q => all[q.id as keyof QuizAnswers]).length
    return Math.min(sectionQuestions.length, Math.max(1, answered + 1))
  })

  const questionRefs = useRef<(HTMLDivElement | null)[]>([])
  const answeredCount = sectionQuestions.filter(q => answers[q.id]).length
  const isComplete = answeredCount === sectionQuestions.length

  function handleSelect(stepIndex: number, value: string) {
    const q = sectionQuestions[stepIndex]
    setAnswers(prev => ({ ...prev, [q.id]: value }))
    if (stepIndex + 1 < sectionQuestions.length) {
      setRevealed(stepIndex + 2)
    }
  }

  useEffect(() => {
    const idx = revealed - 1
    const el = questionRefs.current[idx]
    if (!el || idx === 0) return
    const t = setTimeout(() => {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 80)
    return () => clearTimeout(t)
  }, [revealed])

  function handleSubmit() {
    const existing: QuizAnswers = (() => {
      const raw = sessionStorage.getItem('quiz_answers')
      return raw ? JSON.parse(raw) as QuizAnswers : {}
    })()
    sessionStorage.setItem('quiz_answers', JSON.stringify({ ...existing, ...answers }))
    navigate(`/results?product=${product}`)
  }

  function selectedLabel(stepIndex: number, value: string | undefined) {
    if (!value) return value
    const q = sectionQuestions[stepIndex]
    const opt = q.options.find(o => o.value === value)
    if (!opt) return value
    return zh && opt.label_zh ? opt.label_zh : opt.label
  }

  return (
    <motion.div
      className="min-h-screen bg-cream"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <ProgressBar
        current={answeredCount - 1}
        total={sectionQuestions.length}
      />

      <div className="max-w-6xl mx-auto px-6 pt-20 pb-24">
        <div className="lg:grid lg:grid-cols-3 lg:gap-16 lg:items-start">

          {/* ── Question stack ─────────────────────────── */}
          <div className="lg:col-span-2">

            {sectionQuestions.slice(0, revealed).map((question, index) => {
              const selectedValue = answers[question.id] as string | undefined
              const isAnswered = Boolean(selectedValue) && index < revealed - 1
              const questionText = zh && question.question_zh ? question.question_zh : question.question

              // Build bilingual options
              const bilingualOptions = question.options.map(opt => ({
                ...opt,
                label:    zh && opt.label_zh    ? opt.label_zh    : opt.label,
                sublabel: zh && opt.sublabel_zh ? opt.sublabel_zh : opt.sublabel,
              }))

              return (
                <motion.div
                  key={index}
                  ref={el => { questionRefs.current[index] = el }}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, ease: apple }}
                  className="scroll-mt-24"
                >
                  {/* Section label — shown once at top */}
                  {index === 0 && (
                    <div className="flex items-center gap-4 mb-1">
                      <div className="h-px flex-1 bg-charcoal/10" />
                      <span className="text-[10px] font-semibold text-charcoal/30 tracking-[0.22em] uppercase px-1">
                        {sectionTitle}
                      </span>
                      <div className="h-px flex-1 bg-charcoal/10" />
                    </div>
                  )}

                  {isAnswered ? (
                    /* ── Compact answered row ── */
                    <div className="flex items-center gap-3 py-4 border-b border-charcoal/6">
                      <span className="text-xs text-charcoal/25 font-medium w-5 flex-shrink-0 text-right">
                        {index + 1}
                      </span>
                      <p className="text-sm text-charcoal/45 flex-1 leading-snug">{questionText}</p>
                      <span className="text-xs bg-sage/15 text-sage-dark px-3 py-1.5 rounded-full font-semibold flex-shrink-0">
                        {selectedLabel(index, selectedValue)}
                      </span>
                    </div>
                  ) : (
                    /* ── Active question ── */
                    <div className="pt-8 pb-4">
                      <p className="text-xs text-charcoal/35 font-medium tracking-widest uppercase mb-3">
                        {zh
                          ? `第 ${index + 1} 題，共 ${sectionQuestions.length} 題`
                          : `Question ${index + 1} of ${sectionQuestions.length}`}
                      </p>
                      <h2 className="text-2xl sm:text-3xl font-light text-charcoal mb-8 leading-snug tracking-tight">
                        {questionText}
                      </h2>
                      <IconSelector
                        options={bilingualOptions as { value: string; label: string; icon: React.ReactNode; sublabel?: string }[]}
                        selected={selectedValue}
                        onSelect={(value) => handleSelect(index, value)}
                        columns={question.columns}
                      />
                    </div>
                  )}
                </motion.div>
              )
            })}

            {/* ── CTA after all answered ─────────────── */}
            <AnimatePresence>
              {isComplete && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: apple, delay: 0.2 }}
                  className="pt-10 pb-4"
                >
                  <div className="glass-card p-8 text-center">
                    <div className="w-10 h-10 rounded-full bg-sage/20 flex items-center justify-center mx-auto mb-4">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M4 10L8 14L16 6" stroke="#6A8E67" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <p className="text-charcoal/50 text-sm mb-6">
                      {zh
                        ? `完成！您的${sectionTitleObj.zh}診斷已準備好。`
                        : `All done — your ${sectionTitleObj.en.toLowerCase()} prescription is ready.`}
                    </p>
                    <motion.button
                      onClick={handleSubmit}
                      className="bg-charcoal text-cream px-10 py-4 rounded-2xl text-base font-medium hover:bg-charcoal/85 transition-colors shadow-sm inline-flex items-center gap-2 cursor-pointer"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      transition={{ ease: apple }}
                    >
                      {zh ? '查看診斷結果' : 'Get My Prescription'}
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Back to home */}
            <div className="pt-6">
              <button
                onClick={() => navigate('/')}
                className="text-sm text-charcoal/35 hover:text-charcoal/60 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M11 7H3M3 7L6 4M3 7L6 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {zh ? '返回首頁' : 'Back to home'}
              </button>
            </div>
          </div>

          {/* ── Sidebar ─────────────────────────────── */}
          <aside className="hidden lg:block mt-8">
            <Sidebar answers={answers} />
          </aside>

        </div>
      </div>
    </motion.div>
  )
}
