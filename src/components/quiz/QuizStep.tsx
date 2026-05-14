import { motion } from 'framer-motion'
import IconSelector from '../ui/IconSelector'
import type { QuestionConfig } from '../../lib/types'

interface QuizStepProps {
  question: QuestionConfig
  selected: string | undefined
  onSelect: (value: string) => void
  stepIndex: number
  total: number
}

const slideVariants = {
  enter: (dir: number) => ({ x: dir * 60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir * -60, opacity: 0 }),
}

const apple = [0.22, 1, 0.36, 1] as const

export default function QuizStep({ question, selected, onSelect, stepIndex, total }: QuizStepProps) {
  return (
    <motion.div
      key={stepIndex}
      custom={1}
      variants={slideVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.35, ease: apple }}
    >
      <div className="mb-2">
        <p className="text-xs text-charcoal/40 font-medium tracking-widest uppercase">
          Question {stepIndex + 1} of {total}
        </p>
      </div>

      <h2 className="text-2xl sm:text-3xl font-light text-charcoal mb-8 leading-snug tracking-tight">
        {question.question}
      </h2>

      <IconSelector
        options={question.options as { value: string; label: string; icon: React.ReactNode; sublabel?: string }[]}
        selected={selected}
        onSelect={onSelect}
        columns={question.columns}
      />
    </motion.div>
  )
}
