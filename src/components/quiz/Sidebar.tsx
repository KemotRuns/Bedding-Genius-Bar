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

  if (answers.nightHeat) {
    const map: Record<string, string> = {
      'Very Hot': "Night sweats detected. Cooling fibres (Nylon, Tencel, Silk) are ranked highest.",
      'Warm': "You run warm. Cooling and breathable materials are moving up.",
      'Neutral': "Balanced temperature — a wide range of fabrics works well for you.",
      'Cold': "You run cold. Warming materials (Flannel, Cotton) are scoring higher.",
    }
    insights.push({ key: 'nightHeat', text: map[answers.nightHeat] })
  }

  if (answers.skinType) {
    const map: Record<string, string> = {
      'Allergic/Eczema': "Eczema or allergies noted. Only hypoallergenic materials remain in your top picks.",
      'Sensitive': "Sensitive skin noted. Hypoallergenic and ultra-smooth fabrics are favoured.",
      'None': "No skin concerns — the full fabric range is available to you.",
    }
    insights.push({ key: 'skinType', text: map[answers.skinType] })
  }

  if (answers.careLevel) {
    const map: Record<string, string> = {
      'Minimal': "Minimal care preference. Wrinkle-resistant, durable fabrics are boosted.",
      'Standard': "Standard care noted. Most options remain available.",
      'Careful': "You're happy to care for delicate fabrics — Silk and Tencel stay in the running.",
    }
    insights.push({ key: 'careLevel', text: map[answers.careLevel] })
  }

  if (answers.sensoryPref) {
    const map: Record<string, string> = {
      'Cooling': "Cool & crisp preference. Nylon and breathable weaves are now top picks.",
      'Silky': "Silky smooth preference. Silk and Tencel are scoring highest.",
      'Classic': "Classic comfort preference. Cotton weaves are your primary match.",
    }
    insights.push({ key: 'sensoryPref', text: map[answers.sensoryPref] })
  }

  if (answers.comforterTemp) {
    const map: Record<string, string> = {
      'Always Cold': "Cold sleeper — Winter-weight comforters (Down, Wool) are prioritised.",
      'Neutral': "Comfortable sleeper — All-season weight is your sweet spot.",
      'Hot': "Hot sleeper — lightweight and cooling fills are recommended.",
    }
    insights.push({ key: 'comforterTemp', text: map[answers.comforterTemp] })
  }

  if (answers.comforterFeel) {
    const map: Record<string, string> = {
      'Heavy': "Heavy wrapped feel — Wool comforter scores highest for you.",
      'Fluffy': "Light fluffy feel — Down comforter scores highest.",
      'Smooth': "Smooth and light — Silk comforter is recommended.",
      'Practical': "Easy care priority — Tech Fiber comforter is your best fit.",
    }
    insights.push({ key: 'comforterFeel', text: map[answers.comforterFeel] })
  }

  if (answers.breathingIssues === 'Yes') {
    insights.push({ key: 'breathingIssues', text: "Breathing sensitivities noted. Washable, hypoallergenic fills are essential." })
  }

  if (answers.sleepPosition) {
    const map: Record<string, string> = {
      'Side': "Side sleeper — pillow loft will be matched to your shoulder width.",
      'Back': "Back sleeper — medium loft keeps your spine in neutral alignment.",
      'Stomach': "Stomach sleeper — only low-loft pillows prevent neck strain for you.",
      'Combination': "Combination sleeper — adjustable or medium-loft pillows are your match.",
    }
    insights.push({ key: 'sleepPosition', text: map[answers.sleepPosition] })
  }

  if (answers.shoulderWidth) {
    const map: Record<string, string> = {
      'Petite': "Narrower frame — medium loft fills your shoulder gap without overfilling.",
      'Average': "Average build — medium-to-high loft is your pillow sweet spot.",
      'Broad': "Broad shoulders — high loft is essential to fill the ear-to-shoulder gap.",
    }
    insights.push({ key: 'shoulderWidth', text: map[answers.shoulderWidth] })
  }

  if (answers.pillowFeel) {
    const map: Record<string, string> = {
      'Sink': "Cushioned sink-in feel — Down pillow scores highest.",
      'Springy': "Responsive support — Latex pillow is your match.",
      'Contour': "Pressure-relieving contour — Memory Foam is recommended.",
      'Balanced': "Balanced feel — Tech Fiber pillow is a great all-round choice.",
    }
    insights.push({ key: 'pillowFeel', text: map[answers.pillowFeel] })
  }

  if (answers.pillowPriority) {
    const map: Record<string, string> = {
      'Allergies': "Allergy protection is key — Latex and Tech Fiber are prioritised.",
      'Value': "Value-focused — Tech Fiber offers the best comfort per dollar.",
      'Premium': "Premium priority — Down and Latex are your top options.",
    }
    insights.push({ key: 'pillowPriority', text: map[answers.pillowPriority] })
  }

  return insights
}

export default function Sidebar({ answers }: SidebarProps) {
  const insights = buildInsights(answers)
  const count = Object.keys(answers).length
  const total = 11

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
            {count < total
              ? `Refining across ${Math.max(2, total - count * 2)} candidates…`
              : 'Analysis complete — generating your prescription.'}
          </p>
        </div>
      )}
    </GlassCard>
  )
}
