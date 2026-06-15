import type {
  QuizAnswers,
  SheetProduct,
  PillowProduct,
  ComforterProduct,
  ScoredSheet,
  ScoredPillow,
  ScoredComforter,
  ScoreReason,
  RecommendationResult,
  ScoringRule,
  ProductCategory,
  RuleOperator,
} from './types'
import sheetsData from '../data/products.json'
import pillowsData from '../data/pillows.json'
import comfortersData from '../data/comforters.json'
import { SCORING_RULES } from './scoringRules'

const sheets = sheetsData as SheetProduct[]
const pillows = pillowsData as PillowProduct[]
const comforters = comfortersData as ComforterProduct[]

// A Catalog bundles the products + scoring rules the engine evaluates. Defaults
// to the bundled JSON + canonical rules; the app passes a Supabase-sourced
// catalog at runtime.
export interface Catalog {
  sheets: SheetProduct[]
  pillows: PillowProduct[]
  comforters: ComforterProduct[]
  rules: ScoringRule[]
}

export const defaultCatalog: Catalog = { sheets, pillows, comforters, rules: SCORING_RULES }

// ── Data-driven scorer ────────────────────────────────────────────────────────
function getPath(obj: unknown, path: string): unknown {
  return path.split('.').reduce<unknown>(
    (o, k) => (o && typeof o === 'object' ? (o as Record<string, unknown>)[k] : undefined),
    obj,
  )
}

function matches(actual: unknown, op: RuleOperator, expected: string): boolean {
  if (op === 'eq' || op === 'neq') {
    const eq = typeof actual === 'boolean'
      ? actual === (expected === 'true')
      : String(actual) === expected
    return op === 'eq' ? eq : !eq
  }
  const a = typeof actual === 'number' ? actual : Number(actual)
  const e = Number(expected)
  if (Number.isNaN(a) || Number.isNaN(e)) return false
  switch (op) {
    case 'gte': return a >= e
    case 'lte': return a <= e
    case 'gt':  return a > e
    case 'lt':  return a < e
  }
  return false
}

function scoreByRules<T extends object>(
  product: T,
  category: ProductCategory,
  answers: QuizAnswers,
  rules: ScoringRule[],
): { product: T; score: number; scoreBreakdown: ScoreReason[] } {
  const a = answers as Record<string, string | undefined>
  let score = 0
  const scoreBreakdown: ScoreReason[] = []
  for (const rule of rules) {
    if (rule.active === false) continue
    if (rule.target_category !== category) continue
    if (a[rule.question_key] !== rule.answer_value) continue
    if (rule.also_question_key && a[rule.also_question_key] !== rule.also_answer_value) continue
    if (matches(getPath(product, rule.attribute_path), rule.operator, rule.compare_value)) {
      score += rule.points
      scoreBreakdown.push({ points: rule.points, reason: rule.reason ?? '' })
    }
  }
  return { product, score, scoreBreakdown }
}

function generateWhyText(answers: QuizAnswers, sheet: SheetProduct, pillow: PillowProduct): string {
  const parts: string[] = []

  if (answers.nightHeat === 'Very Hot') {
    parts.push(`Since you run hot and may experience night sweats, ${sheet.name}'s ${sheet.weave === 'N/A' ? sheet.material : sheet.weave} construction maximises airflow and moisture-wicking to keep you comfortable all night.`)
  } else if (answers.nightHeat === 'Warm') {
    parts.push(`Since you run warm, ${sheet.name}'s breathable structure keeps you cool without feeling cold.`)
  } else if (answers.nightHeat === 'Cold') {
    parts.push(`${sheet.name} adds warmth and cosy comfort for your cold sleep preference.`)
  } else {
    parts.push(`${sheet.name} strikes the perfect balance for your comfortable, temperate sleeping style.`)
  }

  if (answers.skinType === 'Allergic/Eczema') {
    parts.push(`Its hypoallergenic properties are essential for your allergy and eczema concerns.`)
  } else if (answers.skinType === 'Sensitive') {
    parts.push(`Its gentle texture is soothing for sensitive skin.`)
  }

  if (answers.sensoryPref === 'Silky') {
    parts.push(`You'll love the silky, lustrous feel the moment you get into bed.`)
  } else if (answers.sensoryPref === 'Cooling') {
    parts.push(`The cool-to-touch sensation delivers exactly the refreshing first touch you prefer.`)
  }

  const posMap: Record<string, string> = { Side: 'side', Back: 'back', Stomach: 'stomach', Combination: 'combination' }
  const pos = answers.sleepPosition ? posMap[answers.sleepPosition] : 'your'
  parts.push(`For your ${pos} sleeping position, the ${pillow.name} (${pillow.attributes.loft.toLowerCase()} loft) keeps your spine in neutral alignment throughout the night.`)

  return parts.join(' ')
}

function generateWhyText_zh(answers: QuizAnswers, sheet: SheetProduct, pillow: PillowProduct): string {
  const parts: string[] = []

  if (answers.nightHeat === 'Very Hot') {
    parts.push(`您容易夜間出汗，${sheet.name}的透氣結構能有效排濕散熱，讓您整夜舒適。`)
  } else if (answers.nightHeat === 'Warm') {
    parts.push(`您偏熱體質，${sheet.name}的透氣材質能保持清涼，不讓您感到悶熱。`)
  } else if (answers.nightHeat === 'Cold') {
    parts.push(`${sheet.name}提供充足的保暖感，非常適合偏冷體質的您。`)
  } else {
    parts.push(`${sheet.name}溫度調節均衡，非常適合體溫適中的您。`)
  }

  if (answers.skinType === 'Allergic/Eczema') {
    parts.push(`其低敏抗菌特性對有過敏或濕疹困擾的您尤為重要。`)
  } else if (answers.skinType === 'Sensitive') {
    parts.push(`其溫和觸感對敏感肌膚十分呵護。`)
  }

  if (answers.sensoryPref === 'Silky') {
    parts.push(`您一定會愛上滑入被窩那一瞬間的絲滑奢華觸感。`)
  } else if (answers.sensoryPref === 'Cooling') {
    parts.push(`清涼接觸感完美符合您對第一觸感的期待。`)
  }

  const posMap: Record<string, string> = { Side: '側睡', Back: '仰睡', Stomach: '趴睡', Combination: '混合' }
  const loftMap: Record<string, string> = { High: '高枕', Medium: '中枕', Low: '低枕' }
  const pos = answers.sleepPosition ? posMap[answers.sleepPosition] : '您的'
  const loft = loftMap[pillow.attributes.loft] ?? pillow.attributes.loft
  parts.push(`針對您的${pos}睡姿，${pillow.name}（${loft}）能讓脊椎保持自然對齊，助您一夜好眠。`)

  return parts.join('')
}

function generateBundleSuggestion(answers: QuizAnswers): string {
  const isHot = answers.nightHeat === 'Very Hot' || answers.nightHeat === 'Warm'
  const isCold = answers.nightHeat === 'Cold'

  if (answers.skinType === 'Allergic/Eczema') {
    return 'Complete your sleep setup with our hypoallergenic Topcell™ Lyocell duvet cover and matching pillowcases — OEKO-TEX certified and gentle on sensitive skin.'
  }
  if (answers.sensoryPref === 'Silky') {
    return 'Complete the luxury layer with our Silk 22MM duvet cover — the same mulberry silk that makes your sheets exceptional.'
  }
  if (isHot) {
    return 'Round out your setup with a Topcell™ Lyocell or CoolTouch Nylon Fiber duvet cover — instant cooling and superior moisture-wicking for warm sleepers.'
  }
  if (isCold) {
    return 'Complete the warmth layer with our Brushed Flannel Cotton or Egyptian Cotton Sateen duvet cover for cosy comfort on cold nights.'
  }
  return 'Complete your sleep setup with the SUPIMA Percale duvet cover and matching pillowcases — crisp, breathable, and built to last season after season.'
}

export function getRecommendation(answers: QuizAnswers, catalog: Catalog = defaultCatalog): RecommendationResult {
  const scoredSheets = catalog.sheets
    .map(p => scoreByRules(p, 'sheet', answers, catalog.rules) as ScoredSheet)
    .sort((a, b) => b.score - a.score)

  const scoredPillows = catalog.pillows
    .map(p => scoreByRules(p, 'pillow', answers, catalog.rules) as ScoredPillow)
    .sort((a, b) => b.score - a.score)

  const scoredComforters = catalog.comforters
    .map(p => scoreByRules(p, 'comforter', answers, catalog.rules) as ScoredComforter)
    .sort((a, b) => b.score - a.score)

  const topSheet = scoredSheets[0]
  const topPillow = scoredPillows[0]
  const topComforter = scoredComforters[0]

  return {
    topSheet,
    topPillow,
    topComforter,
    allSheets: scoredSheets,
    whyText: generateWhyText(answers, topSheet.product, topPillow.product),
    whyText_zh: generateWhyText_zh(answers, topSheet.product, topPillow.product),
    bundleSuggestion: generateBundleSuggestion(answers),
  }
}

