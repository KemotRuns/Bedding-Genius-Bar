import GlassCard from '../ui/GlassCard'
import type { QuizAnswers } from '../../lib/types'

interface WhyCardProps {
  whyText: string
  answers: QuizAnswers
}

function answerTag(value: string | undefined, map: Record<string, string>) {
  if (!value) return null
  return map[value] ?? null
}

export default function WhyCard({ whyText, answers }: WhyCardProps) {
  const tags: string[] = []

  if (answers.roomTemp) {
    const m: Record<string, string> = { Cold: 'Cold room', Moderate: 'Moderate room', Warm: 'Warm room', Hot: 'Hot room' }
    const t = answerTag(answers.roomTemp, m)
    if (t) tags.push(t)
  }
  if (answers.sleeperTemp) {
    const m: Record<string, string> = { 'Always Cold': 'Runs cold', Neutral: 'Neutral temperature', Warm: 'Runs warm', 'Hot Flash Prone': 'Night sweats' }
    const t = answerTag(answers.sleeperTemp, m)
    if (t) tags.push(t)
  }
  if (answers.sleepPosition) {
    const m: Record<string, string> = { Side: 'Side sleeper', Back: 'Back sleeper', Stomach: 'Stomach sleeper', Combination: 'Combination sleeper' }
    const t = answerTag(answers.sleepPosition, m)
    if (t) tags.push(t)
  }
  if (answers.skinSensitivity && answers.skinSensitivity !== 'None') {
    const m: Record<string, string> = { Mild: 'Mild skin', Sensitive: 'Sensitive skin', 'Allergic/Eczema': 'Allergic / Eczema' }
    const t = answerTag(answers.skinSensitivity, m)
    if (t) tags.push(t)
  }
  if (answers.petStatus === 'Yes — Cats or Dogs') tags.push('Pet owner')
  if (answers.maintenancePref) {
    const m: Record<string, string> = { 'Low Maintenance': 'Low maintenance', 'I Launder Frequently': 'Frequent laundry' }
    const t = answerTag(answers.maintenancePref, m)
    if (t) tags.push(t)
  }
  if (answers.bodyType) {
    const m: Record<string, string> = { Petite: 'Petite frame', Average: 'Average build', Broad: 'Broad shoulders' }
    const t = answerTag(answers.bodyType, m)
    if (t) tags.push(t)
  }

  return (
    <GlassCard className="p-7">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-5 h-5 rounded-full bg-sage/20 flex items-center justify-center flex-shrink-0">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 6L5 9L10 3" stroke="#6A8E67" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h3 className="text-sm font-semibold text-charcoal/70 tracking-wide uppercase text-xs">Why this works for you</h3>
      </div>

      <p className="text-charcoal/80 leading-relaxed text-base mb-5">{whyText}</p>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map(tag => (
            <span
              key={tag}
              className="text-xs bg-sage/15 text-sage-dark px-3 py-1 rounded-full font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </GlassCard>
  )
}
