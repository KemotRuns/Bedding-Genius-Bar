import GlassCard from '../ui/GlassCard'
import type { QuizAnswers } from '../../lib/types'

interface WhyCardProps {
  whyText: string
  answers: QuizAnswers
}

export default function WhyCard({ whyText, answers }: WhyCardProps) {
  const tags: string[] = []

  if (answers.nightHeat) {
    const m: Record<string, string> = { 'Very Hot': 'Hot sleeper', Warm: 'Runs warm', Neutral: 'Comfortable temp', Cold: 'Runs cold' }
    if (m[answers.nightHeat]) tags.push(m[answers.nightHeat])
  }
  if (answers.skinType && answers.skinType !== 'None') {
    const m: Record<string, string> = { Sensitive: 'Sensitive skin', 'Allergic/Eczema': 'Eczema / Allergic' }
    if (m[answers.skinType]) tags.push(m[answers.skinType])
  }
  if (answers.sleepPosition) {
    const m: Record<string, string> = { Side: 'Side sleeper', Back: 'Back sleeper', Stomach: 'Stomach sleeper', Combination: 'Combination sleeper' }
    if (m[answers.sleepPosition]) tags.push(m[answers.sleepPosition])
  }
  if (answers.shoulderWidth) {
    const m: Record<string, string> = { Petite: 'Narrower frame', Average: 'Average build', Broad: 'Broad shoulders' }
    if (m[answers.shoulderWidth]) tags.push(m[answers.shoulderWidth])
  }
  if (answers.sensoryPref) {
    const m: Record<string, string> = { Cooling: 'Cool & crisp feel', Silky: 'Silky smooth feel', Classic: 'Classic comfort' }
    if (m[answers.sensoryPref]) tags.push(m[answers.sensoryPref])
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
            <span key={tag} className="text-xs bg-sage/15 text-sage-dark px-3 py-1 rounded-full font-medium">
              {tag}
            </span>
          ))}
        </div>
      )}
    </GlassCard>
  )
}
