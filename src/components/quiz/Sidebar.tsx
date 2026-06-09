import { motion, AnimatePresence } from 'framer-motion'
import GlassCard from '../ui/GlassCard'
import type { QuizAnswers } from '../../lib/types'
import { useLang } from '../../lib/LanguageContext'
import { tr } from '../../lib/i18n'

interface SidebarProps {
  answers: QuizAnswers
}

interface Insight {
  key: string
  text: string
}

function buildInsights(answers: QuizAnswers, zh: boolean): Insight[] {
  const insights: Insight[] = []

  if (answers.nightHeat) {
    const map: Record<string, { en: string; zh: string }> = {
      'Very Hot': { en: 'Night sweats detected. Cooling fibres (Nylon, Tencel, Silk) are ranked highest.', zh: '偵測到盜汗傾向，涼感纖維（尼龍、天絲、蠶絲）已列為優先推薦。' },
      'Warm':     { en: 'You run warm. Cooling and breathable materials are moving up.', zh: '偏熱體質，涼感透氣材質已提升排名。' },
      'Neutral':  { en: 'Balanced temperature — a wide range of fabrics works well for you.', zh: '體溫適中，大多數材質均適合您。' },
      'Cold':     { en: 'You run cold. Warming materials (Flannel, Cotton) are scoring higher.', zh: '偏冷體質，保暖材質（法蘭絨、棉）已提升分數。' },
    }
    insights.push({ key: 'nightHeat', text: tr(map[answers.nightHeat], zh ? 'zh' : 'en') })
  }

  if (answers.skinType) {
    const map: Record<string, { en: string; zh: string }> = {
      'Allergic/Eczema': { en: 'Eczema or allergies noted. Only hypoallergenic materials remain in your top picks.', zh: '過敏或濕疹需求已記錄，僅低敏材質保留在推薦清單中。' },
      'Sensitive':       { en: 'Sensitive skin noted. Hypoallergenic and ultra-smooth fabrics are favoured.', zh: '敏感肌需求已記錄，低敏與超柔材質優先推薦。' },
      'None':            { en: 'No skin concerns — the full fabric range is available to you.', zh: '無皮膚問題，所有材質均在選項中。' },
    }
    insights.push({ key: 'skinType', text: tr(map[answers.skinType], zh ? 'zh' : 'en') })
  }

  if (answers.careLevel) {
    const map: Record<string, { en: string; zh: string }> = {
      'Minimal':  { en: 'Minimal care preference. Wrinkle-resistant, durable fabrics are boosted.', zh: '偏好簡易保養，抗皺耐用材質已提升排名。' },
      'Standard': { en: 'Standard care noted. Most options remain available.', zh: '標準保養習慣，大多數選項仍保留。' },
      'Careful':  { en: 'You\'re happy to care for delicate fabrics — Silk and Tencel stay in the running.', zh: '願意細心保養，蠶絲與天絲繼續保留在推薦清單中。' },
    }
    insights.push({ key: 'careLevel', text: tr(map[answers.careLevel], zh ? 'zh' : 'en') })
  }

  if (answers.sensoryPref) {
    const map: Record<string, { en: string; zh: string }> = {
      'Cooling': { en: 'Cool & crisp preference. Nylon and breathable weaves are now top picks.', zh: '偏好清涼觸感，尼龍及透氣織物已成為首選。' },
      'Silky':   { en: 'Silky smooth preference. Silk and Tencel are scoring highest.', zh: '偏好絲滑觸感，蠶絲與天絲評分最高。' },
      'Classic': { en: 'Classic comfort preference. Cotton weaves are your primary match.', zh: '偏好經典棉質感，棉質織物為您的最佳搭配。' },
    }
    insights.push({ key: 'sensoryPref', text: tr(map[answers.sensoryPref], zh ? 'zh' : 'en') })
  }

  if (answers.comforterTemp) {
    const map: Record<string, { en: string; zh: string }> = {
      'Always Cold': { en: 'Cold sleeper — Winter-weight comforters (Down, Wool) are prioritised.', zh: '怕冷體質，冬被（羽絨、羊毛）優先推薦。' },
      'Neutral':     { en: 'Comfortable sleeper — All-season weight is your sweet spot.', zh: '體溫適中，四季被是您的最佳選擇。' },
      'Hot':         { en: 'Hot sleeper — lightweight and cooling fills are recommended.', zh: '偏熱體質，輕薄涼感填充物優先推薦。' },
    }
    insights.push({ key: 'comforterTemp', text: tr(map[answers.comforterTemp], zh ? 'zh' : 'en') })
  }

  if (answers.comforterFeel) {
    const map: Record<string, { en: string; zh: string }> = {
      'Heavy':     { en: 'Heavy wrapped feel — Wool comforter scores highest for you.', zh: '偏好厚實包覆感，羊毛被為您評分最高。' },
      'Fluffy':    { en: 'Light fluffy feel — Down comforter scores highest.', zh: '偏好輕盈蓬鬆感，羽絨被為您評分最高。' },
      'Smooth':    { en: 'Smooth and light — Silk comforter is recommended.', zh: '偏好輕薄順滑，蠶絲被為您首選推薦。' },
      'Practical': { en: 'Easy care priority — Tech Fiber comforter is your best fit.', zh: '重視易洗易乾，科技纖維被最適合您。' },
    }
    insights.push({ key: 'comforterFeel', text: tr(map[answers.comforterFeel], zh ? 'zh' : 'en') })
  }

  if (answers.breathingIssues === 'Yes') {
    insights.push({
      key: 'breathingIssues',
      text: zh ? '呼吸敏感需求已記錄，可機洗低敏填充物為必要條件。' : 'Breathing sensitivities noted. Washable, hypoallergenic fills are essential.',
    })
  }

  if (answers.sleepPosition) {
    const map: Record<string, { en: string; zh: string }> = {
      'Side':        { en: 'Side sleeper — pillow loft will be matched to your shoulder width.', zh: '側睡習慣，枕頭高度將依您的肩寬進行配對。' },
      'Back':        { en: 'Back sleeper — medium loft keeps your spine in neutral alignment.', zh: '仰睡習慣，中等枕高能維持脊椎自然對齊。' },
      'Stomach':     { en: 'Stomach sleeper — only low-loft pillows prevent neck strain for you.', zh: '趴睡習慣，僅低枕能避免頸椎受壓。' },
      'Combination': { en: 'Combination sleeper — adjustable or medium-loft pillows are your match.', zh: '多種睡姿，可調整或中等枕高為您的最佳選擇。' },
    }
    insights.push({ key: 'sleepPosition', text: tr(map[answers.sleepPosition], zh ? 'zh' : 'en') })
  }

  if (answers.shoulderWidth) {
    const map: Record<string, { en: string; zh: string }> = {
      'Petite':  { en: 'Narrower frame — medium loft fills your shoulder gap without overfilling.', zh: '窄肩體型，中等枕高能填補肩頸空間而不過高。' },
      'Average': { en: 'Average build — medium-to-high loft is your pillow sweet spot.', zh: '標準肩寬，中至高枕是您的理想枕高範圍。' },
      'Broad':   { en: 'Broad shoulders — high loft is essential to fill the ear-to-shoulder gap.', zh: '寬肩體型，高枕為填補耳肩間距所必需。' },
    }
    insights.push({ key: 'shoulderWidth', text: tr(map[answers.shoulderWidth], zh ? 'zh' : 'en') })
  }

  if (answers.pillowFeel) {
    const map: Record<string, { en: string; zh: string }> = {
      'Sink':     { en: 'Cushioned sink-in feel — Down pillow scores highest.', zh: '偏好陷入包覆感，羽絨枕評分最高。' },
      'Springy':  { en: 'Responsive support — Latex pillow is your match.', zh: '偏好彈力回彈，乳膠枕最適合您。' },
      'Contour':  { en: 'Pressure-relieving contour — Memory Foam is recommended.', zh: '偏好貼合頸部，記憶棉枕為首選推薦。' },
      'Balanced': { en: 'Balanced feel — Tech Fiber pillow is a great all-round choice.', zh: '偏好均衡輕盈，科技纖維枕為全方位優質選擇。' },
    }
    insights.push({ key: 'pillowFeel', text: tr(map[answers.pillowFeel], zh ? 'zh' : 'en') })
  }

  if (answers.pillowPriority) {
    const map: Record<string, { en: string; zh: string }> = {
      'Allergies': { en: 'Allergy protection is key — Latex and Tech Fiber are prioritised.', zh: '防過敏為首要需求，乳膠枕與科技纖維枕優先推薦。' },
      'Value':     { en: 'Value-focused — Tech Fiber offers the best comfort per dollar.', zh: '重視CP值，科技纖維枕提供最佳舒適性價比。' },
      'Premium':   { en: 'Premium priority — Down and Latex are your top options.', zh: '追求優質體驗，羽絨枕與乳膠枕為您的頂級之選。' },
    }
    insights.push({ key: 'pillowPriority', text: tr(map[answers.pillowPriority], zh ? 'zh' : 'en') })
  }

  return insights
}

export default function Sidebar({ answers }: SidebarProps) {
  const { lang } = useLang()
  const zh = lang === 'zh'
  const insights = buildInsights(answers, zh)
  const count = Object.keys(answers).length
  const total = 11

  return (
    <GlassCard className="p-6 lg:sticky lg:top-24">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 rounded-full bg-sage animate-pulse" />
        <p className="text-xs font-semibold text-charcoal/50 tracking-widest uppercase">
          {zh ? '即時分析' : 'Live Analysis'}
        </p>
      </div>

      {count === 0 ? (
        <p className="text-sm text-charcoal/40 leading-relaxed">
          {zh
            ? '您的每個回答都會即時優化您的診斷結果。'
            : 'Your answers will shape your prescription in real-time as you go.'}
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
            {zh
              ? count < total
                ? `正在比較 ${Math.max(2, total - count * 2)} 個候選品項…`
                : '分析完成，正在生成您的診斷結果。'
              : count < total
              ? `Refining across ${Math.max(2, total - count * 2)} candidates…`
              : 'Analysis complete — generating your prescription.'}
          </p>
        </div>
      )}
    </GlassCard>
  )
}
