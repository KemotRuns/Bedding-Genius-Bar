import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import ProgressBar from '../components/ui/ProgressBar'
import IconSelector from '../components/ui/IconSelector'
import Sidebar from '../components/quiz/Sidebar'
import { QUESTIONS } from '../lib/questions'
import type { QuizAnswers } from '../lib/types'

const apple = [0.22, 1, 0.36, 1] as const

export default function Quiz() {
  const navigate = useNavigate()
  const [answers, setAnswers] = useState<QuizAnswers>({})
  const [revealed, setRevealed] = useState(1) // how many questions are visible
  const questionRefs = useRef<(HTMLDivElement | null)[]>([])
  const isComplete = Object.keys(answers).length === QUESTIONS.length

  function handleSelect(stepIndex: number, value: string) {
    const q = QUESTIONS[stepIndex]
    setAnswers(prev => ({ ...prev, [q.id]: value }))

    // Reveal next question
    if (stepIndex + 1 < QUESTIONS.length) {
      setRevealed(stepIndex + 2)
    }
  }

  // Scroll to the most recently revealed question
  useEffect(() => {
    const idx = revealed - 1
    const el = questionRefs.current[idx]
    if (!el || idx === 0) return
    // Small delay so the element is painted before scrolling
    const t = setTimeout(() => {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 80)
    return () => clearTimeout(t)
  }, [revealed])

  function handleSubmit() {
    sessionStorage.setItem('quiz_answers', JSON.stringify(answers))
    navigate('/results')
  }

  // Find the label for a selected value in a question's options
  function selectedLabel(stepIndex: number, value: string | undefined) {
    if (!value) return value
    return QUESTIONS[stepIndex].options.find(o => o.value === value)?.label ?? value
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
        current={Object.keys(answers).length - 1}
        total={QUESTIONS.length}
      />

      <div className="max-w-6xl mx-auto px-6 pt-20 pb-24">
        <div className="lg:grid lg:grid-cols-3 lg:gap-16 lg:items-start">

          {/* ── Question stack ───────────────────────────── */}
          <div className="lg:col-span-2">

            {QUESTIONS.slice(0, revealed).map((question, index) => {
              const selectedValue = answers[question.id] as string | undefined
              const isAnswered = Boolean(selectedValue) && index < revealed - 1

              return (
                <motion.div
                  key={index}
                  ref={el => { questionRefs.current[index] = el }}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, ease: apple }}
                  className="scroll-mt-24"
                >
                  {isAnswered ? (
                    /* ── Compact answered row ── */
                    <div className="flex items-center gap-3 py-4 border-b border-charcoal/6">
                      <span className="text-xs text-charcoal/25 font-medium w-5 flex-shrink-0 text-right">
                        {index + 1}
                      </span>
                      <p className="text-sm text-charcoal/45 flex-1 leading-snug">
                        {question.question}
                      </p>
                      <span className="text-xs bg-sage/15 text-sage-dark px-3 py-1.5 rounded-full font-semibold flex-shrink-0">
                        {selectedLabel(index, selectedValue)}
                      </span>
                    </div>
                  ) : (
                    /* ── Active question ── */
                    <div className="pt-8 pb-4">
                      <p className="text-xs text-charcoal/35 font-medium tracking-widest uppercase mb-3">
                        Question {index + 1} of {QUESTIONS.length}
                      </p>
                      <h2 className="text-2xl sm:text-3xl font-light text-charcoal mb-8 leading-snug tracking-tight">
                        {question.question}
                      </h2>
                      <IconSelector
                        options={question.options as { value: string; label: string; icon: React.ReactNode; sublabel?: string }[]}
                        selected={selectedValue}
                        onSelect={(value) => handleSelect(index, value)}
                        columns={question.columns}
                      />
                    </div>
                  )}
                </motion.div>
              )
            })}

            {/* ── CTA after all answered ───────────────── */}
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
                      All done — your sleep profile is ready.
                    </p>
                    <motion.button
                      onClick={handleSubmit}
                      className="bg-charcoal text-cream px-10 py-4 rounded-2xl text-base font-medium hover:bg-charcoal/85 transition-colors shadow-sm inline-flex items-center gap-2 cursor-pointer"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      transition={{ ease: apple }}
                    >
                      Get My Prescription
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
                Back to home
              </button>
            </div>
          </div>

          {/* ── Sidebar ─────────────────────────────────── */}
          <aside className="hidden lg:block mt-8">
            <Sidebar answers={answers} />
          </aside>

        </div>
      </div>
    </motion.div>
  )
}
