import { motion, AnimatePresence } from 'framer-motion'
import GlassCard from '../ui/GlassCard'
import type { QuizAnswers } from '../../lib/types'

interface SidebarProps {
  answers: QuizAnswers
}

interface Insight {
  key: string
  text: string
}

function buildInsights(answers: QuizAnswers): Insight[] {
  const insights: Insight[] = []

  if (answers.roomTemp) {
    const map: Record<string, string> = {
      Cold: "Cool room detected. We're prioritising warming fabrics.",
      Moderate: "Moderate room temperature. Neutral or breathable fabrics score highest.",
      Warm: "Warm room noted. Cooling fabrics are moving to the top.",
      Hot: "Hot room detected. We're narrowing to the 4 most breathable fabrics.",
    }
    insights.push({ key: 'roomTemp', text: map[answers.roomTemp] })
  }

  if (answers.sleeperTemp) {
    const map: Record<string, string> = {
      'Always Cold': "You run cold. Flannel and warming options are scoring higher.",
      Neutral: "Neutral sleep temperature — a wide range of fabrics will work for you.",
      Warm: "You run warm. We're filtering for cooling and wicking materials.",
      'Hot Flash Prone': "Night sweats noted. High-wicking fabrics (Bamboo, Tencel) are now top priority.",
    }
    insights.push({ key: 'sleeperTemp', text: map[answers.sleeperTemp] })
  }

  if (answers.sleepPosition) {
    const map: Record<string, string> = {
      Side: "Side sleeper — we'll match your pillow loft to your shoulder width.",
      Back: "Back sleeper — a medium-loft pillow will keep your spine neutral.",
      Stomach: "Stomach sleeper — only low-loft pillows prevent neck strain for you.",
      Combination: "Combination sleeper — adjustable or medium-loft pillows are your match.",
    }
    insights.push({ key: 'sleepPosition', text: map[answers.sleepPosition] })
  }

  if (answers.skinSensitivity) {
    const map: Record<string, string> = {
      None: "No skin concerns — the full range is available to you.",
      Mild: "Mildly sensitive skin — we're slightly favouring softer weaves.",
      Sensitive: "Sensitive skin noted. Hypoallergenic fabrics (Bamboo, Tencel, Silk) are ranked higher.",
      'Allergic/Eczema': "Eczema or allergies — only hypoallergenic materials remain in your top picks.",
    }
    insights.push({ key: 'skinSensitivity', text: map[answers.skinSensitivity] })
  }

  if (answers.petStatus) {
    if (answers.petStatus === 'Yes — Cats or Dogs') {
      insights.push({ key: 'petStatus', text: "Pets on the bed! Tight-weave fabrics that resist hair and claws are scoring +3." })
    } else {
      insights.push({ key: 'petStatus', text: "No pets — the full weave range remains on the table." })
    }
  }

  if (answers.maintenancePref) {
    const map: Record<string, string> = {
      'Low Maintenance': "Low maintenance preference — wrinkle-resistant fabrics get a boost.",
      'I Launder Frequently': "Frequent laundering — we're prioritising high-durability materials.",
    }
    insights.push({ key: 'maintenancePref', text: map[answers.maintenancePref] })
  }

  if (answers.bodyType) {
    const map: Record<string, string> = {
      Petite: "Petite frame — your ideal pillow loft is medium to fill the shoulder gap perfectly.",
      Average: "Average build — medium-to-high loft pillows are your sweet spot.",
      Broad: "Broad shoulders — only high-loft pillows provide the support you need.",
    }
    insights.push({ key: 'bodyType', text: map[answers.bodyType] })
  }

  return insights
}

export default function Sidebar({ answers }: SidebarProps) {
  const insights = buildInsights(answers)
  const count = Object.keys(answers).length

  return (
    <GlassCard className="p-6 lg:sticky lg:top-24">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 rounded-full bg-sage animate-pulse" />
        <p className="text-xs font-semibold text-charcoal/50 tracking-widest uppercase">Live Analysis</p>
      </div>

      {count === 0 ? (
        <p className="text-sm text-charcoal/40 leading-relaxed">
          Your answers will shape your prescription in real-time as you go.
        </p>
      ) : (
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {insights.map((insight) => (
              <motion.div
                key={insight.key}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="border-l-2 border-sage/40 pl-3"
              >
                <p className="text-sm text-charcoal/70 leading-relaxed">{insight.text}</p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {count > 0 && (
        <div className="mt-6 pt-4 border-t border-charcoal/8">
          <p className="text-xs text-charcoal/35">
            {8 - count > 0
              ? `Refining across ${Math.max(2, 8 - count * 2)} fabric candidates…`
              : 'Analysis complete — generating your prescription.'}
          </p>
        </div>
      )}
    </GlassCard>
  )
}
