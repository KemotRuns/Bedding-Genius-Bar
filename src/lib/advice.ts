import type { QuizAnswers, ScoredProduct } from './types'
import { QUESTION_SEED, QUESTION_WEIGHTS } from './questionData'

// Customer-side framing for the Sleep Plan: what we heard from the answers, what
// that points to, and why each product fits. Copy stays at comfort level: it
// describes feel and fit, never a health or medical outcome.

type T = { en: string; zh: string }
type Q = keyof QuizAnswers
type Table = Partial<Record<Q, Record<string, T>>>
export type SectionId = 'sheets' | 'comforter' | 'pillow'

// What the customer told us, as a clause.
const HEARD: Table = {
  nightHeat: {
    Hot:     { en: 'you tend to run warm at night', zh: '您夜間容易覺得悶熱' },
    Neutral: { en: 'you sleep at a comfortable temperature, or slightly cool', zh: '您睡覺時溫度適中或稍微怕冷' },
  },
  skinType: {
    Sensitive: { en: 'your skin is sensitive', zh: '肌膚比較敏感' },
  },
  comforterTemp: {
    'Always Cold': { en: 'you often feel cold under the covers', zh: '您在被窩裡常覺得冷' },
    Neutral:       { en: 'you are usually comfortable under the covers', zh: '您在被窩裡通常覺得剛好' },
    Hot:           { en: 'you often get too warm under the covers', zh: '您在被窩裡常覺得太熱' },
  },
  comforterAllergy: {
    Washable: { en: 'allergies mean you need a comforter that is easy to wash', zh: '因為過敏，需要方便清洗的棉被' },
    Natural:  { en: 'allergies mean you prefer natural, breathable materials', zh: '因為過敏，偏好天然透氣的材質' },
  },
  sleepPosition: {
    Side:    { en: 'you sleep on your side', zh: '您習慣側睡' },
    Back:    { en: 'you sleep on your back', zh: '您習慣仰睡' },
    Stomach: { en: 'you sleep on your stomach', zh: '您習慣趴睡' },
  },
  pillowAllergy: {
    Yes: { en: 'you are sensitive to some materials or odours', zh: '對某些材質或氣味比較敏感' },
  },
}

// What that points to, as a noun phrase.
const NEEDS: Table = {
  nightHeat: {
    Hot:     { en: 'fabrics that release heat and stay dry', zh: '能散熱、保持乾爽的布料' },
    Neutral: { en: 'breathable fabrics with a gentle warmth', zh: '溫和保暖又透氣的布料' },
  },
  skinType: {
    Sensitive: { en: 'gentle, skin-friendly fibres', zh: '溫和親膚的纖維' },
  },
  sensoryPref: {
    Cooling: { en: 'a surface that feels cool to the touch', zh: '接觸時帶有涼感的表面' },
    Silky:   { en: 'a silky-smooth surface', zh: '絲滑柔順的觸感' },
    Classic: { en: 'a soft cotton feel', zh: '柔軟的棉質觸感' },
  },
  comforterTemp: {
    'Always Cold': { en: 'a fill that holds warmth well', zh: '保暖力佳的填充' },
    Neutral:       { en: 'a fill with balanced warmth', zh: '保暖度均衡的填充' },
    Hot:           { en: 'a lighter fill that lets heat escape', zh: '較輕盈、不悶熱的填充' },
  },
  comforterFeel: {
    Heavy:  { en: 'a cosy, enveloping weight', zh: '有份量的包覆感' },
    Fluffy: { en: 'a light, lofty feel', zh: '輕盈蓬鬆的感受' },
    Smooth: { en: 'a soft drape that follows the body', zh: '柔軟貼身的垂墜感' },
  },
  comforterScent: {
    NoScent: { en: 'materials with no noticeable scent', zh: '沒有明顯氣味的材質' },
  },
  shoulderWidth: {
    Petite:  { en: 'a pillow height matched to your shoulder width', zh: '符合您肩寬的枕頭高度' },
    Average: { en: 'a pillow height matched to your shoulder width', zh: '符合您肩寬的枕頭高度' },
    Broad:   { en: 'a pillow height matched to your shoulder width', zh: '符合您肩寬的枕頭高度' },
  },
  pillowFeel: {
    Sink:     { en: 'a soft, cushioning feel', zh: '柔軟包覆的感受' },
    Springy:  { en: 'springy, responsive support', zh: '有彈性的回彈支撐' },
    Contour:  { en: 'pressure relief that moulds to your neck', zh: '貼合頸部的釋壓感' },
    Balanced: { en: 'a balance of softness and support', zh: '軟硬均衡的支撐' },
  },
  pillowAllergy: {
    Yes: { en: 'materials suited to sensitive sleepers', zh: '適合敏感體質的材質' },
  },
}

// Why a product fits, one sentence per criterion it satisfies. `{label}` is
// replaced with the customer's own answer label.
const REASONS: Table = {
  nightHeat: {
    Hot:     { en: 'This fabric releases heat and moisture, which helps when you run warm at night.', zh: '這款布料能散熱排濕，適合夜間容易悶熱的您。' },
    Neutral: { en: 'Cotton holds a gentle, even warmth and still breathes, which suits how you sleep.', zh: '棉質溫和保暖又透氣，適合溫度適中或怕冷的您。' },
  },
  skinType: {
    Sensitive: { en: 'The fibre is smooth and gentle, a reassuring choice for sensitive skin.', zh: '纖維柔滑溫和，敏感肌膚也能安心使用。' },
  },
  careLevel: {
    Standard: { en: 'It washes well on a standard routine, following the care label.', zh: '依照洗標正常清洗即可，保養不費力。' },
    Careful:  { en: 'It is a finer fabric that rewards the extra care you are happy to give.', zh: '細緻的布料，值得您多花一點心思保養。' },
  },
  sensoryPref: {
    Cooling: { en: 'It feels cool to the touch the moment you get into bed.', zh: '一躺下就有清涼的觸感。' },
    Silky:   { en: 'It has the silky-smooth surface you find relaxing.', zh: '擁有您喜歡的絲滑膚觸。' },
    Classic: { en: 'It has the soft, familiar cotton feel you find relaxing.', zh: '擁有您喜歡的柔軟棉質觸感。' },
  },
  designStyle: {
    '*': { en: 'The design matches the style you chose: {label}.', zh: '設計符合您選擇的風格：{label}。' },
  },
  comforterTemp: {
    'Always Cold': { en: 'Its fill holds warmth well, for nights when you feel cold.', zh: '填充保暖力佳，適合怕冷的您。' },
    Neutral:       { en: 'Its warmth is balanced, which suits a sleeper who is usually comfortable.', zh: '保暖度均衡，適合體溫適中的您。' },
    Hot:           { en: 'It is a lighter fill that lets heat escape, for nights when you get too warm.', zh: '填充較輕盈、不易悶熱，適合容易發熱的您。' },
  },
  comforterFeel: {
    Heavy:  { en: 'It has the cosy, enveloping weight you prefer.', zh: '有您喜歡的厚實包覆感。' },
    Fluffy: { en: 'It is light and lofty, the feel you prefer.', zh: '輕盈蓬鬆，正是您喜歡的感受。' },
    Smooth: { en: 'It drapes softly and follows the body, the feel you prefer.', zh: '柔軟貼身又透氣，正是您喜歡的感受。' },
  },
  comforterAllergy: {
    Washable: { en: 'It is washable, so you can clean it as often as you need.', zh: '可以水洗，方便您定期清潔。' },
    Natural:  { en: 'It is a natural, breathable fill, as you asked.', zh: '採用天然透氣的材質，符合您的需求。' },
  },
  comforterScent: {
    NoScent: { en: 'It has no noticeable material scent.', zh: '沒有明顯的材質氣味。' },
    MildOk:  { en: 'It may carry a mild natural scent at first, which you said is fine.', zh: '初期可能有些微天然氣味，在您可接受的範圍內。' },
  },
  comforterUse: {
    Budget: { en: 'It is practical and easy to care for, a good fit for a busy household.', zh: '實用好保養，適合忙碌的家庭。' },
    Daily:  { en: 'It is a step up in everyday comfort.', zh: '讓每天的睡眠更舒適一些。' },
    Luxury: { en: 'It is a premium fill, for those happy to give it extra care.', zh: '頂級材質，值得用心呵護。' },
  },
  sleepPosition: {
    Side:    { en: 'It suits side sleepers, who need the space between ear and shoulder filled.', zh: '適合側睡：能填補耳朵到肩膀之間的空隙。' },
    Back:    { en: 'It suits back sleepers, supporting the natural curve of the neck.', zh: '適合仰睡：能支撐頸部的自然曲線。' },
    Stomach: { en: 'It is soft enough for stomach sleepers, letting the neck stay relaxed.', zh: '夠柔軟，趴睡時頸部也能放鬆。' },
  },
  pillowFeel: {
    Sink:     { en: 'It gives the soft, cushioning feel you prefer.', zh: '有您喜歡的柔軟包覆感。' },
    Springy:  { en: 'It gives the springy, responsive support you prefer.', zh: '有您喜歡的彈性回彈支撐。' },
    Contour:  { en: 'It moulds to your neck for the pressure relief you prefer.', zh: '能貼合頸部曲線，帶來您喜歡的釋壓感。' },
    Balanced: { en: 'It balances softness and support, as you prefer.', zh: '軟硬均衡，正是您喜歡的感受。' },
  },
  shoulderWidth: {
    Petite:  { en: 'Its height suits narrow shoulders.', zh: '高度適合窄肩的您。' },
    Average: { en: 'Its height suits average shoulders.', zh: '高度適合一般肩寬的您。' },
    Broad:   { en: 'Its height suits broad shoulders.', zh: '高度適合寬肩的您。' },
  },
  pillowAllergy: {
    Yes: { en: 'Its materials are among those suited to sensitive sleepers.', zh: '材質適合對材質或氣味敏感的您。' },
  },
  pillowTier: {
    '*': { en: 'It belongs to the series you chose: {label}.', zh: '屬於您選擇的系列：{label}。' },
  },
}

const SECTION_HEARD: Record<SectionId, Q[]> = {
  sheets: ['nightHeat', 'skinType'],
  comforter: ['comforterTemp', 'comforterAllergy'],
  pillow: ['sleepPosition', 'pillowAllergy'],
}
const SECTION_NEEDS: Record<SectionId, Q[]> = {
  sheets: ['nightHeat', 'skinType', 'sensoryPref'],
  comforter: ['comforterTemp', 'comforterFeel', 'comforterScent'],
  pillow: ['shoulderWidth', 'pillowFeel', 'pillowAllergy'],
}

function phrases(table: Table, keys: Q[], answers: QuizAnswers, zh: boolean): string[] {
  const a = answers as Record<string, string | undefined>
  const out: string[] = []
  for (const k of keys) {
    const t = a[k] ? table[k]?.[a[k]!] : undefined
    if (t) out.push(zh ? t.zh : t.en)
  }
  return out
}

function joinEn(parts: string[]): string {
  if (parts.length <= 1) return parts.join('')
  return parts.slice(0, -1).join(', ') + ' and ' + parts[parts.length - 1]
}
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

/** "What we heard" for one completed section: what they said, and what it points to. */
export function heardSummary(section: SectionId, answers: QuizAnswers, zh: boolean): string {
  const heard = phrases(HEARD, SECTION_HEARD[section], answers, zh)
  const needs = phrases(NEEDS, SECTION_NEEDS[section], answers, zh)
  if (heard.length === 0 || needs.length === 0) return ''
  return zh
    ? `${heard.join('，')}。因此適合您的是${needs.join('、')}。`
    : `${cap(joinEn(heard))}. That points to ${joinEn(needs)}.`
}

/** Cause-and-effect reasons a product fits, strongest criteria first. */
export function reasonsFor(s: ScoredProduct, answers: QuizAnswers, zh: boolean, max = 4): string[] {
  const a = answers as Record<string, string | undefined>
  const out: string[] = []
  const ordered = [...s.matched].sort((x, y) => (QUESTION_WEIGHTS[y] ?? 1) - (QUESTION_WEIGHTS[x] ?? 1))
  for (const q of ordered) {
    const ans = a[q]
    if (!ans) continue
    const t = REASONS[q]?.[ans] ?? REASONS[q]?.['*']
    if (!t) continue
    const opt = QUESTION_SEED.find(x => x.id === q)?.options.find(o => o.value === ans)
    const label = opt ? (zh ? opt.label_zh : opt.label) : ans
    out.push((zh ? t.zh : t.en).replace('{label}', label))
    if (out.length >= max) break
  }
  return out
}
