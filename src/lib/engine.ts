import type {
  QuizAnswers, Product, ScoredProduct, RecommendationResult,
  ProductCategory, BeddingMaterial, MatchSpec,
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

// Bedding sets: material tier → the answers it suits (FEAC "Bedding Materials"
// sheet, columns D/E). The design-style match comes from product.style.
export const MATERIAL_MATCH: Record<BeddingMaterial, MatchSpec> = {
  topcool:   { nightHeat: ['Very Hot'],                  skinType: [],                   careLevel: ['Minimal'],              sensoryPref: ['Cooling'] },
  tencel80:  { nightHeat: ['Warm', 'Neutral'],           skinType: ['SensitiveLux'],     careLevel: ['Minimal', 'Standard'],  sensoryPref: ['Silky'] },
  tencel60:  { nightHeat: ['Warm', 'Neutral'],           skinType: ['SensitiveRefined'], careLevel: ['Minimal', 'Standard'],  sensoryPref: ['Silky'] },
  cotton60:  { nightHeat: ['Neutral', 'Cold'],           skinType: ['Everyday'],         careLevel: ['Standard'],             sensoryPref: ['Classic'] },
  cotton40:  { nightHeat: ['Neutral', 'Cold'],           skinType: ['Everyday'],         careLevel: ['Standard'],             sensoryPref: ['Classic'] },
  cotton500: { nightHeat: ['Neutral', 'Cold'],           skinType: [],                   careLevel: ['Careful'],              sensoryPref: ['Classic'] },
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
    if (!ans) continue
    const w = QUESTION_WEIGHTS[q] ?? 1
    maxScore += w
    if (spec[q]?.includes(ans)) { score += w; matched.push(q) }
  }
  return { product: p, score, maxScore, matched }
}

function rank(products: Product[], category: ProductCategory, answers: QuizAnswers): ScoredProduct[] {
  return products
    .filter(p => p.category === category && p.active !== false)
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

/** Honest match percentage: weighted criteria satisfied / weighted criteria answered. */
export function matchPercent(s: ScoredProduct): number {
  if (s.maxScore === 0) return 0
  return Math.round((s.score / s.maxScore) * 100)
}
