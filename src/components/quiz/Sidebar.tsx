import { motion, AnimatePresence } from 'framer-motion'
import GlassCard from '../ui/GlassCard'
import type { QuizAnswers } from '../../lib/types'
import { useLang } from '../../lib/LanguageContext'

interface SidebarProps { answers: QuizAnswers; total: number }

type T = { en: string; zh: string }
// Live-analysis copy per answer. Keep understated: it narrates what the engine
// is now favouring, never a promise about a specific SKU.
const INSIGHTS: Partial<Record<keyof QuizAnswers, Record<string, T>>> = {
  nightHeat: {
    'Very Hot': { en: 'Hot sleeper noted. TopCool cooling fibre moves to the top.', zh: '易熱體質已記錄，TopCool 涼感纖維提升為首選。' },
    Warm:       { en: 'Runs warm. Tencel™ Lyocell is favoured for breathability.', zh: '偏熱體質，天絲™萊賽爾因透氣性優先推薦。' },
    Neutral:    { en: 'Balanced temperature. Tencel™ and cotton both stay in play.', zh: '體溫適中，天絲™與棉質皆保留在推薦中。' },
    Cold:       { en: 'Runs cold. Cotton weaves are scoring higher.', zh: '偏冷體質，棉質織物分數提升。' },
  },
  skinType: {
    SensitiveLux:     { en: 'Sensitive skin, silkiest touch: 80S Tencel™ leads.', zh: '敏感肌膚、極致絲滑：80支天絲™領先。' },
    SensitiveRefined: { en: 'Sensitive skin, refined feel: 60S Tencel™ is favoured.', zh: '敏感肌膚、細膩手感：60支天絲™優先。' },
    Everyday:         { en: 'Everyday natural comfort: combed cotton stays strong.', zh: '天然親膚日常之選：精梳棉保持高分。' },
  },
  careLevel: {
    Minimal:  { en: 'Easy care. Wash-and-go fibres are boosted.', zh: '偏好簡易保養，易洗快乾材質加分。' },
    Standard: { en: 'Standard care. Most materials remain available.', zh: '標準保養習慣，大多數材質仍保留。' },
    Careful:  { en: 'Happy to care for fine fabrics: high-count cotton stays in the running.', zh: '願意細心保養，高織數棉繼續保留。' },
  },
  sensoryPref: {
    Cooling: { en: 'Cool-to-touch preference: TopCool is the primary match.', zh: '偏好清涼觸感，TopCool 為主要配對。' },
    Silky:   { en: 'Silky preference: 80S Tencel™ scores highest.', zh: '偏好絲滑膚觸，80支天絲™評分最高。' },
    Classic: { en: 'Soft cotton feel: cotton weaves are your primary match.', zh: '偏好柔質棉感，棉質織物為主要配對。' },
  },
  designStyle: {
    Nature:  { en: 'Nature-inspired style selected. Botanical prints only.', zh: '已選自然風格，僅推薦花草植物圖樣。' },
    Minimal: { en: 'Minimalist style selected. Solid colours and clean lines.', zh: '已選簡約風格，僅推薦素色與幾何。' },
    Playful: { en: 'Playful style selected. Themed and character prints.', zh: '已選主題童趣風格，推薦特殊主題圖樣。' },
    Classic: { en: 'Classic luxury selected. Embroidery, lace and jacquard.', zh: '已選經典奢華，推薦刺繡、蕾絲與緹花。' },
  },
  comforterTemp: {
    'Always Cold': { en: 'Cold sleeper. Winter-weight down and graphene fills lead.', zh: '怕冷體質，冬被（羽絨、石墨烯）優先推薦。' },
    Neutral:       { en: 'Comfortable sleeper. Silk, wool and down winter weights all fit.', zh: '體溫適中，蠶絲、羊毛、羽絨冬被皆適合。' },
    Hot:           { en: 'Warm sleeper. All-season and lightweight fills are favoured.', zh: '偏熱體質，四季被與輕量填充優先。' },
  },
  comforterFeel: {
    Heavy:  { en: 'Heavy, wrapped feel: wool and graphene fibre score highest.', zh: '偏好厚重包裹感，羊毛與石墨烯纖維評分最高。' },
    Fluffy: { en: 'Light and fluffy: down comforters lead.', zh: '偏好輕盈蓬鬆，羽絨被領先。' },
    Smooth: { en: 'Body-hugging and breathable: silk is favoured.', zh: '偏好貼身透氣，蠶絲被優先推薦。' },
  },
  comforterAllergy: {
    Washable: { en: 'Allergy-sensitive, washable required: antibacterial fibre fills only.', zh: '過敏體質、要求可水洗：僅推薦抗菌科技纖維。' },
    Natural:  { en: 'Allergy-sensitive, natural preferred: silk moves to the top.', zh: '過敏體質、偏好天然：蠶絲提升為首選。' },
    None:     { en: 'No allergy concerns. The full range is available.', zh: '無過敏問題，所有填充物皆在選項中。' },
  },
  comforterScent: {
    NoScent: { en: 'Scent-free only: silk and synthetic fills are favoured.', zh: '拒絕異味，蠶絲與科技纖維優先。' },
    MildOk:  { en: 'Mild natural scent is fine: wool and down stay in the running.', zh: '可接受些微天然氣味，羊毛與羽絨保留。' },
  },
  comforterUse: {
    Budget: { en: 'Practical household: washable fibre comforters lead.', zh: '實用導向，可水洗科技纖維被領先。' },
    Daily:  { en: 'Daily upgrade: wool and classic down are favoured.', zh: '日常升級，羊毛與經典羽絨優先。' },
    Luxury: { en: 'Premium choice: top-grade silk and down lead.', zh: '頂級之選，頂級蠶絲與羽絨領先。' },
  },
  sleepPosition: {
    Side:    { en: 'Side sleeper. Pillow height will be matched to your shoulder width.', zh: '側睡習慣，枕高將依肩寬配對。' },
    Back:    { en: 'Back sleeper. Ergonomic contour pillows are favoured.', zh: '仰睡習慣，人體工學枕優先推薦。' },
    Stomach: { en: 'Stomach sleeper. Only thin, soft pillows remain.', zh: '趴睡習慣，僅保留薄軟枕型。' },
  },
  pillowFeel: {
    Sink:     { en: 'Sink-in feel: down pillows score highest.', zh: '偏好深陷包覆，羽絨枕評分最高。' },
    Springy:  { en: 'Springy support: latex is your match.', zh: '偏好回彈支撐，乳膠枕最適合您。' },
    Contour:  { en: 'Pressure relief: memory foam is recommended.', zh: '偏好針對性釋壓，記憶枕為首選。' },
    Balanced: { en: 'Balanced resilience: synthetic fibre pillows fit well.', zh: '偏好均衡柔軟彈性，科技纖維枕適合您。' },
  },
  shoulderWidth: {
    Petite:  { en: 'Narrower frame: low pillows (8–10 cm).', zh: '窄肩體型，低枕（8–10 cm）。' },
    Average: { en: 'Average build: medium pillows (11–14 cm).', zh: '標準肩寬，中枕（11–14 cm）。' },
    Broad:   { en: 'Broad shoulders: high pillows (15 cm+).', zh: '寬肩體型，高枕（15 cm 以上）。' },
  },
  pillowAllergy: {
    Yes: { en: 'Sensitivities noted. Anti-mite, washable pillows are prioritised.', zh: '過敏需求已記錄，防螨可水洗枕優先。' },
    No:  { en: 'No sensitivities. Down and natural latex stay in play.', zh: '無過敏問題，羽絨與天然乳膠保留。' },
  },
  pillowTier: {
    Effortless: { en: 'Effortless Comfort series.', zh: '簡單舒適系列。' },
    Enhanced:   { en: 'Enhanced Support series.', zh: '功能進階系列。' },
    Luxury:     { en: 'Luxury Hotel Feel series.', zh: '奢華飯店體驗系列。' },
  },
}

export default function Sidebar({ answers, total }: SidebarProps) {
  const { lang } = useLang()
  const zh = lang === 'zh'
  const insights: { key: string; text: string }[] = []
  for (const k of Object.keys(answers) as (keyof QuizAnswers)[]) {
    const v = answers[k]
    const t = v ? INSIGHTS[k]?.[v] : undefined
    if (t) insights.push({ key: k, text: zh ? t.zh : t.en })
  }
  const count = insights.length

  return (
    <GlassCard className="p-6 lg:sticky lg:top-24">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 rounded-full bg-sage animate-pulse" />
        <p className="text-xs font-semibold text-charcoal/50 tracking-widest uppercase">{zh ? '即時分析' : 'Live Analysis'}</p>
      </div>
      {count === 0 ? (
        <p className="text-sm text-charcoal/40 leading-relaxed">
          {zh ? '您的每個回答都會即時調整推薦結果。' : 'Your answers shape the recommendation in real time as you go.'}
        </p>
      ) : (
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {insights.map(i => (
              <motion.div key={i.key} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }} className="border-l-2 border-sage/40 pl-3">
                <p className="text-sm text-charcoal/70 leading-relaxed">{i.text}</p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
      {count > 0 && (
        <div className="mt-6 pt-4 border-t border-charcoal/8">
          <p className="text-xs text-charcoal/35">
            {count < total
              ? (zh ? `已回答 ${count} / ${total} 題…` : `${count} of ${total} answered…`)
              : (zh ? '分析完成，正在產生您的推薦。' : 'Analysis complete. Generating your recommendation.')}
          </p>
        </div>
      )}
    </GlassCard>
  )
}
