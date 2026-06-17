/* eslint-disable react-refresh/only-export-components */
import type { QuestionConfig } from './types'
import { getIcon } from './icons'
import { QUESTION_SEED } from './questionData'

export { SECTION_LONG_TO_SHORT, SECTION_SHORT_TO_LONG } from './questionData'

// Bundled fallback QuestionConfig[] (icons resolved from the registry).
export const QUESTIONS: QuestionConfig[] = QUESTION_SEED.map(q => ({
  id: q.id,
  section: q.section,
  question: q.question,
  question_zh: q.question_zh,
  columns: q.columns,
  options: q.options.map(o => ({
    value: o.value,
    label: o.label,
    label_zh: o.label_zh,
    sublabel: o.sublabel,
    sublabel_zh: o.sublabel_zh,
    icon: getIcon(o.icon_key),
  })),
}))
