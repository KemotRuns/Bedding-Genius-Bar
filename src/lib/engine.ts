import type {
  QuizAnswers, Product, ScoredProduct, RecommendationResult,
  ProductCategory, BeddingMaterial, MatchSpec, TieredPick,
} from './types'
import catalogData from '../data/catalog.json'
import { QUESTION_SEED, QUESTION_WEIGHTS, SECTION_LONG_TO_SHORT } from './questionData'

export interface Catalog { products: Product[] }

export const defaultCatalog: Catalog = { products: catalogData as Product[] }

// Which questions belong to which category (drives maxScore + section completeness).
const CATEGORY_OF_SECTION: Record<string, ProductCategory> = { sheets: 'sheet', comforter: 'comforter', pillow: 'pillow' }
export const CATEGORY_QUESTIONS: Record<ProductCategory, (keyof QuizAnswers)[]> = { sheet: [], comforter: [], pillow: [] }
for (const q of QUESTION_SEED) {
  CATEGORY_QUESTIONS[CATEGORY_OF_SECTION[SECTION_LONG_TO_SHORT[q.section]]].push(q.id)
}

// Bedding sets: material tier → the answers it suits (FEAC 1123 workbook,
// "Bedding Materials" rows 5-13). The design-style match comes from product.style.
const TENCEL: MatchSpec  = { nightHeat: ['Hot'],     skinType: ['Sensitive'], careLevel: ['Careful'],  sensoryPref: ['Silky'] }
const COTTON: MatchSpec  = { nightHeat: ['Neutral'], skinType: [],            careLevel: ['Standard'], sensoryPref: ['Classic'] }
export const MATERIAL_MATCH: Record<BeddingMaterial, MatchSpec> = {
  topcool:   { nightHeat: ['Hot'],     skinType: ['Sensitive'], careLevel: ['Standard'], sensoryPref: ['Cooling'] },
  tencel80:  TENCEL,
  tencel60:  TENCEL,
  cotton60:  COTTON,
  cotton40:  COTTON,
  cotton500: { nightHeat: ['Neutral'], skinType: [],            careLevel: ['Careful'],  sensoryPref: ['Classic'] },
}

// "Explore more designs" category pages per material (workbook D20:D26).
const CATEGORY_URL = 'https://www.fet.com.tw/v2/official/SalePageCategory/'
export const MATERIAL_BROWSE_URL: Record<BeddingMaterial, string> = {
  cotton40:  CATEGORY_URL + '379140?sortMode=Newest',
  cotton60:  CATEGORY_URL + '379142?sortMode=Curator',
  cotton500: CATEGORY_URL + '508628?sortMode=Curator',
  tencel60:  CATEGORY_URL + '379138?sortMode=Newest',
  tencel80:  CATEGORY_URL + '519884?sortMode=Curator',
  topcool:   CATEGORY_URL + '518862?sortMode=Newest',
}

// Hard exclusions, in priority order (FEAC "Priority 1 / 2"). When the customer
// gives one of these answers, every product not listed for that answer is
// removed, from the main pick and from the second option alike.
export const HARD_FILTERS: { question: keyof QuizAnswers; answers: string[] }[] = [
  { question: 'skinType',         answers: ['Sensitive'] },            // bedding, Priority 1
  { question: 'pillowAllergy',    answers: ['Yes'] },                  // pillows, Priority 1
  { question: 'comforterAllergy', answers: ['Washable', 'Natural'] },  // comforters, Priority 1
  { question: 'comforterScent',   answers: ['NoScent'] },              // comforters, Priority 2
]

// Neutral answers: every product qualifies, so the question is left out of the score.
export const NEUTRAL_ANSWERS: Partial<Record<keyof QuizAnswers, string[]>> = {
  skinType: ['None'],
  pillowAllergy: ['No'],
  comforterAllergy: ['None'],
}

/** Effective match spec: explicit `match` plus (for bedding) material + style. */
export function effectiveMatch(p: Product): MatchSpec {
  if (p.category !== 'sheet') return p.match ?? {}
  const base: MatchSpec = p.material ? { ...MATERIAL_MATCH[p.material] } : {}
  if (p.style) base.designStyle = [p.style]
  return { ...base, ...(p.match ?? {}) }
}

function scoreProduct(p: Product, answers: QuizAnswers): ScoredProduct {
  const spec = effectiveMatch(p)
  const a = answers as Record<string, string | undefined>
  let score = 0, maxScore = 0
  const matched: (keyof QuizAnswers)[] = []
  for (const q of CATEGORY_QUESTIONS[p.category]) {
    const ans = a[q]
    if (!ans || NEUTRAL_ANSWERS[q]?.includes(ans)) continue
    const w = QUESTION_WEIGHTS[q] ?? 1
    maxScore += w
    if (spec[q]?.includes(ans)) { score += w; matched.push(q) }
  }
  return { product: p, score, maxScore, matched }
}

function applyHardFilters(products: Product[], answers: QuizAnswers): Product[] {
  const a = answers as Record<string, string | undefined>
  let pool = products
  for (const f of HARD_FILTERS) {
    const ans = a[f.question]
    if (!ans || !f.answers.includes(ans)) continue
    const kept = pool.filter(p => effectiveMatch(p)[f.question]?.includes(ans))
    // Never filter down to nothing: a lower-priority rule gives way first.
    if (kept.length > 0) pool = kept
  }
  return pool
}

function rank(products: Product[], category: ProductCategory, answers: QuizAnswers): ScoredProduct[] {
  const active = products.filter(p => p.category === category && p.active !== false)
  return applyHardFilters(active, answers)
    .map(p => scoreProduct(p, answers))
    .sort((x, y) => y.score - x.score || x.product.sort_order - y.product.sort_order)
}

export function getRecommendation(answers: QuizAnswers, catalog: Catalog = defaultCatalog): RecommendationResult {
  return {
    sheets:     rank(catalog.products, 'sheet', answers),
    comforters: rank(catalog.products, 'comforter', answers),
    pillows:    rank(catalog.products, 'pillow', answers),
  }
}

const priceOf = (s: ScoredProduct) => s.product.price_twd ?? null

/**
 * The picks to display for one ranked list: an entry-level option and a premium
 * upgrade whenever two suitable products sit at different price points.
 *  1. If the best-matching products (tied on score) span more than one price,
 *     show the cheapest and the most expensive of them.
 *  2. Otherwise show the best match plus the next-best product; they are
 *     labelled entry / premium only when their prices differ.
 */
export function pickTiers(list: ScoredProduct[]): TieredPick | null {
  const top = list[0]
  if (!top) return null
  const tied = list.filter(s => s.score === top.score && priceOf(s) !== null)
  if (tied.length > 1) {
    const entry = tied.reduce((a, b) => (priceOf(b)! < priceOf(a)! ? b : a))
    const premium = tied.reduce((a, b) => (priceOf(b)! > priceOf(a)! ? b : a))
    if (priceOf(entry)! < priceOf(premium)!) {
      return { primary: entry, secondary: premium, primaryTier: 'entry', secondaryTier: 'premium' }
    }
  }
  const next = list.find(s => s !== top && s.score > 0)
  if (!next) return { primary: top }
  const a = priceOf(top), b = priceOf(next)
  if (a === null || b === null || a === b) return { primary: top, secondary: next }
  return a < b
    ? { primary: top, secondary: next, primaryTier: 'entry', secondaryTier: 'premium' }
    : { primary: top, secondary: next, primaryTier: 'premium', secondaryTier: 'entry' }
}

/** Honest match percentage: weighted criteria satisfied / weighted criteria answered. */
export function matchPercent(s: ScoredProduct): number {
  if (s.maxScore === 0) return 100
  return Math.round((s.score / s.maxScore) * 100)
}
