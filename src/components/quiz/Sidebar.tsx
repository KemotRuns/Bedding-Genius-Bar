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
    Hot:     { en: 'Hot sleeper noted. TopCool and Tencel™ are favoured.', zh: '易熱體質已記錄，TopCool 與天絲™優先推薦。' },
    Neutral: { en: 'Comfortable or cool sleeper. Cotton weaves are favoured.', zh: '溫度適中或偏冷，棉質織物優先推薦。' },
  },
  skinType: {
    Sensitive: { en: 'Sensitive skin noted. Only Tencel™ and TopCool sets are shown.', zh: '敏感肌膚已記錄，僅推薦天絲™與 TopCool 床組。' },
    None:      { en: 'No skin sensitivities. The full range is available.', zh: '無敏感問題，所有材質皆在選項中。' },
  },
  careLevel: {
    Standard: { en: 'Standard care: cotton and TopCool are favoured.', zh: '標準清洗程序，棉質與 TopCool 優先。' },
    Careful:  { en: 'Happy to care for fine fabrics: high-count cotton and Tencel™ are favoured.', zh: '願意細心保養，高織數棉與天絲™優先。' },
  },
  sensoryPref: {
    Cooling: { en: 'Cooling sensation: TopCool is the primary match.', zh: '偏好清涼感，TopCool 為主要配對。' },
    Silky:   { en: 'Silky-smooth touch: Tencel™ scores highest.', zh: '偏好絲滑膚觸，天絲™評分最高。' },
    Classic: { en: 'Soft cotton feel: cotton weaves are your primary match.', zh: '偏好柔質棉感，棉質織物為主要配對。' },
  },
  designStyle: {
    Nature:  { en: 'Nature-inspired style noted. Botanical prints come first in your material.', zh: '已選自然風格，在適合您的材質中優先推薦花草植物印花。' },
    Minimal: { en: 'Minimalist style noted. Solid colours and clean lines come first in your material.', zh: '已選簡約風格，在適合您的材質中優先推薦素色與幾何。' },
    Playful: { en: 'Playful style noted. Themed prints come first in your material.', zh: '已選主題童趣風格，在適合您的材質中優先推薦主題印花。' },
    Classic: { en: 'Classic luxury noted. Embroidery, lace and jacquard come first where available.', zh: '已選經典奢華，優先推薦刺繡、蕾絲與緹花款式。' },
  },
  comforterTemp: {
    'Always Cold': { en: 'Cold sleeper. Down, wool and graphene winter fills lead.', zh: '怕冷體質，羽絨、羊毛與石墨烯冬被優先推薦。' },
    Neutral:       { en: 'Comfortable sleeper. Most fills suit you.', zh: '體溫適中，大多數材質皆適合。' },
    Hot:           { en: 'Warm sleeper. Lighter fills are favoured.', zh: '偏熱體質，較輕盈的款式優先。' },
  },
  comforterFeel: {
    Heavy:  { en: 'Cosy, enveloping feel: wool and fibre fills score highest.', zh: '偏好厚重包裹感，羊毛與科技纖維評分最高。' },
    Fluffy: { en: 'Light and fluffy: down and lofty fibre fills lead.', zh: '偏好輕盈蓬鬆，羽絨與蓬鬆纖維領先。' },
    Smooth: { en: 'Soft and gently draping: silk is favoured.', zh: '偏好貼身透氣，蠶絲被優先推薦。' },
  },
  comforterAllergy: {
    Washable: { en: 'Allergy-sensitive, easy to wash: only washable comforters are shown.', zh: '過敏體質、要求可水洗：僅推薦可水洗的棉被。' },
    Natural:  { en: 'Allergy-sensitive, natural materials: only silk comforters are shown.', zh: '過敏體質、追求天然透氣：僅推薦蠶絲被。' },
    None:     { en: 'No allergy concerns. The full range is available.', zh: '無過敏問題，所有填充物皆在選項中。' },
  },
  comforterScent: {
    NoScent: { en: 'No noticeable scent: wool and down are left out.', zh: '拒絕異味，不推薦羊毛與羽絨。' },
    MildOk:  { en: 'A mild natural scent is fine: wool and down stay in the running.', zh: '可接受些微天然氣味，羊毛與羽絨保留。' },
  },
  comforterUse: {
    Budget: { en: 'Practical household: easy-care fibre and wool comforters lead.', zh: '實用導向，好保養的科技纖維與羊毛被領先。' },
    Daily:  { en: 'Daily upgrade: fibre and down comforters are favoured.', zh: '日常升級，科技纖維與羽絨被優先。' },
    Luxury: { en: 'Premium choice: silk and top-grade down lead.', zh: '頂級之選，蠶絲與頂級羽絨領先。' },
  },
  sleepPosition: {
    Side:    { en: 'Side sleeper. Pillow height will be matched to your shoulder width.', zh: '側睡習慣，枕高將依肩寬配對。' },
    Back:    { en: 'Back sleeper. Most pillow types suit you.', zh: '仰睡習慣，大多數枕型皆適合。' },
    Stomach: { en: 'Stomach sleeper. Soft down pillows are favoured.', zh: '趴睡習慣，柔軟的羽絨枕優先。' },
  },
  pillowFeel: {
    Sink:     { en: 'Soft and cushioning: down and fibre pillows score highest.', zh: '偏好深陷包覆，羽絨枕與科技纖維枕評分最高。' },
    Springy:  { en: 'Springy support: latex is your match.', zh: '偏好回彈支撐，乳膠枕最適合您。' },
    Contour:  { en: 'Pressure relief: memory foam is recommended.', zh: '偏好針對性釋壓，記憶枕為首選。' },
    Balanced: { en: 'Balanced softness and support: fibre pillows fit well.', zh: '偏好均衡柔軟彈性，科技纖維枕適合您。' },
  },
  shoulderWidth: {
    Petite:  { en: 'Narrow shoulders noted. Pillow height will be matched to them.', zh: '窄肩體型已記錄，將為您配對合適的枕高。' },
    Average: { en: 'Average shoulders noted. Pillow height will be matched to them.', zh: '一般肩寬已記錄，將為您配對合適的枕高。' },
    Broad:   { en: 'Broad shoulders noted. Pillow height will be matched to them.', zh: '寬肩體型已記錄，將為您配對合適的枕高。' },
  },
  pillowAllergy: {
    Yes: { en: 'Sensitivities noted. Only memory foam and fibre pillows are shown.', zh: '敏感需求已記錄，僅推薦記憶枕與科技纖維枕。' },
    No:  { en: 'No sensitivities. The full range is available.', zh: '無過敏問題，所有枕型皆在選項中。' },
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
