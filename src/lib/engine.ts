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
} from './types'
import sheetsData from '../data/products.json'
import pillowsData from '../data/pillows.json'
import comfortersData from '../data/comforters.json'

const sheets = sheetsData as SheetProduct[]
const pillows = pillowsData as PillowProduct[]
const comforters = comfortersData as ComforterProduct[]

function scoreSheet(product: SheetProduct, answers: QuizAnswers): ScoredSheet {
  const reasons: ScoreReason[] = []
  let score = 0

  const add = (points: number, reason: string) => {
    score += points
    reasons.push({ points, reason })
  }

  // Temperature rules
  if (answers.roomTemp === 'Hot' || answers.sleeperTemp === 'Warm' || answers.sleeperTemp === 'Hot Flash Prone') {
    if (product.attributes.temperature === 'Cooling') add(3, 'Cooling fabric matches warm sleep environment')
    if (product.ratings.breathability >= 4) add(2, 'High breathability for heat dissipation')
  }

  if (answers.roomTemp === 'Hot' && (answers.sleeperTemp === 'Warm' || answers.sleeperTemp === 'Hot Flash Prone')) {
    if (product.ratings.breathability >= 4) add(2, 'Maximised cooling for very warm sleeper')
  }

  if (answers.roomTemp === 'Cold' || answers.sleeperTemp === 'Always Cold') {
    if (product.attributes.temperature === 'Warming') add(3, 'Warming fabric for cold sleeper or room')
    if (product.attributes.temperature === 'Cooling') add(-2, 'Cooling fabric not ideal for cold environment')
  }

  if (answers.roomTemp === 'Moderate' && answers.sleeperTemp === 'Neutral') {
    if (product.attributes.temperature === 'Neutral') add(2, 'Neutral temperature for temperate sleeper')
  }

  // Hot-flash / night sweats
  if (answers.sleeperTemp === 'Hot Flash Prone') {
    if (product.attributes.moisture_wicking === 'High') add(3, 'High moisture-wicking for night sweats')
    if (product.attributes.moisture_wicking === 'Low') add(-2, 'Low wicking not ideal for night sweats')
  }

  // Skin sensitivity rules
  if (answers.skinSensitivity === 'Sensitive') {
    if (product.attributes.hypoallergenic) add(3, 'Hypoallergenic material for sensitive skin')
    if (product.attributes.softness === 'Ultra-Soft' || product.attributes.softness === 'Smooth') add(2, 'Smooth texture gentle on sensitive skin')
    if (product.attributes.softness === 'Textured') add(-1, 'Textured surface may irritate sensitive skin')
  }

  if (answers.skinSensitivity === 'Allergic/Eczema') {
    if (product.attributes.hypoallergenic) add(5, 'Hypoallergenic — essential for eczema/allergies')
    else add(-3, 'Non-hypoallergenic fabric not recommended for eczema')
    if (product.material === 'Silk') add(1, 'Silk protein structure is gentle on eczema-prone skin')
    if (product.attributes.softness === 'Ultra-Soft') add(2, 'Ultra-soft texture soothes sensitive skin')
    if (product.attributes.softness === 'Textured') add(-2, 'Textured surface may aggravate eczema')
  }

  // Pet owner rules
  if (answers.petStatus === 'Yes — Cats or Dogs') {
    if (product.attributes.weave_tightness === 'Tight') add(3, 'Tight weave resists pet hair and claw snags')
    if (product.attributes.weave_tightness === 'Loose') add(-2, 'Loose weave catches pet hair and claws')
    if (product.attributes.durability === 'High') add(2, 'High durability handles frequent washing with pets')
    if (product.material === 'Linen') add(-1, 'Linen open weave is vulnerable to pet claws')
  }

  // Maintenance rules
  if (answers.maintenancePref === 'Low Maintenance') {
    if (product.attributes.wrinkle_resistance === 'High') add(2, 'Wrinkle-resistant — shake dry and done')
    if (product.attributes.wrinkle_resistance === 'Low') add(-1, 'Wrinkles easily — requires ironing')
  }

  if (answers.maintenancePref === 'I Launder Frequently') {
    if (product.attributes.durability === 'High') add(1, 'Durable — handles frequent laundering well')
    if (product.attributes.durability === 'Low') add(-2, 'May degrade with very frequent washing')
  }

  return { product, score, scoreBreakdown: reasons }
}

function scorePillow(product: PillowProduct, answers: QuizAnswers): ScoredPillow {
  const reasons: ScoreReason[] = []
  let score = 0

  const add = (points: number, reason: string) => {
    score += points
    reasons.push({ points, reason })
  }

  // Sleep position × body type rules (loft)
  if (answers.sleepPosition === 'Stomach') {
    if (product.attributes.loft === 'Low') add(8, 'Low loft prevents neck arching for stomach sleepers')
    if (product.attributes.loft === 'Medium') add(-3, 'Too thick for stomach sleepers — neck strain risk')
    if (product.attributes.loft === 'High') add(-5, 'High loft causes neck arching — not safe for stomach sleepers')
  }

  if (answers.sleepPosition === 'Side') {
    if (answers.bodyType === 'Broad') {
      if (product.attributes.loft === 'High') add(6, 'High loft fills gap between ear and broad shoulder')
      if (product.attributes.loft === 'Medium') add(2, 'Medium loft may suit broad side sleepers')
      if (product.attributes.loft === 'Low') add(-4, 'Too flat for broad-shouldered side sleepers')
    } else if (answers.bodyType === 'Average') {
      if (product.attributes.loft === 'High') add(3, 'High loft supports average side sleeper')
      if (product.attributes.loft === 'Medium') add(4, 'Medium-high loft ideal for average side sleeper')
      if (product.attributes.loft === 'Low') add(-3, 'Too flat for side sleeping')
    } else if (answers.bodyType === 'Petite') {
      if (product.attributes.loft === 'Medium') add(5, 'Medium loft fills petite shoulder gap without overfilling')
      if (product.attributes.loft === 'High') add(1, 'May be slightly high for petite side sleeper')
      if (product.attributes.loft === 'Low') add(-2, 'Too flat for petite side sleeper')
    }
  }

  if (answers.sleepPosition === 'Back') {
    if (product.attributes.loft === 'Medium') add(6, 'Medium loft keeps neck in neutral alignment for back sleepers')
    if (product.attributes.loft === 'High') add(-3, 'Too thick for back sleepers — pushes neck forward')
    if (product.attributes.loft === 'Low') add(-2, 'Too flat for back sleepers — neck unsupported')
  }

  if (answers.sleepPosition === 'Combination') {
    if (product.attributes.loft === 'Medium') add(5, 'Medium loft adapts to multiple sleep positions')
    if (product.attributes.adjustable) add(3, 'Adjustable fill suits combination sleepers perfectly')
    if (product.attributes.loft === 'High') add(1, 'Can work for combination sleepers who lean toward side')
  }

  // Allergy rules
  if (answers.skinSensitivity === 'Allergic/Eczema') {
    if (product.attributes.hypoallergenic) add(4, 'Hypoallergenic fill essential for allergy sufferers')
    else add(-3, 'Non-hypoallergenic fill not suitable for allergies')
  }

  if (answers.skinSensitivity === 'Sensitive') {
    if (product.attributes.hypoallergenic) add(2, 'Hypoallergenic fill for sensitive skin')
  }

  // Temperature rules
  if (answers.roomTemp === 'Hot' || answers.sleeperTemp === 'Warm' || answers.sleeperTemp === 'Hot Flash Prone') {
    if (product.attributes.temperature === 'Cooling') add(3, 'Cooling pillow for warm sleepers')
    if (product.attributes.temperature === 'Warming') add(-2, 'Warming pillow not ideal for hot sleepers')
  }

  if (answers.roomTemp === 'Cold' || answers.sleeperTemp === 'Always Cold') {
    if (product.attributes.temperature === 'Warming') add(2, 'Warming pillow for cold sleepers')
  }

  return { product, score, scoreBreakdown: reasons }
}

function scoreComforter(product: ComforterProduct, answers: QuizAnswers): ScoredComforter {
  const reasons: ScoreReason[] = []
  let score = 0

  const add = (points: number, reason: string) => {
    score += points
    reasons.push({ points, reason })
  }

  const isHot = answers.roomTemp === 'Hot' || answers.sleeperTemp === 'Warm' || answers.sleeperTemp === 'Hot Flash Prone'
  const isCold = answers.roomTemp === 'Cold' || answers.sleeperTemp === 'Always Cold'

  // Temperature × warmth season
  if (isHot) {
    if (product.attributes.temperature === 'Cooling') add(3, 'Cooling comforter for warm sleeper')
    if (product.attributes.temperature === 'Warming') add(-2, 'Warming fill not ideal for hot sleepers')
    if (product.attributes.warmth === 'Winter') add(-1, 'Winter-weight too heavy for warm nights')
  }

  if (isCold) {
    if (product.attributes.warmth === 'Winter') add(3, 'Winter-weight comforter for cold sleeper')
    if (product.attributes.temperature === 'Warming') add(2, 'Warming fill ideal for cold sleeper')
    if (product.attributes.temperature === 'Cooling') add(-1, 'Cooling fill provides less warmth for cold nights')
  }

  if (!isHot && !isCold) {
    if (product.attributes.warmth === 'All-Season') add(2, 'All-season weight suits moderate sleeper')
  }

  // Hot flash / night sweats
  if (answers.sleeperTemp === 'Hot Flash Prone') {
    if (product.attributes.washable) add(2, 'Washable comforter for easy hot-flash maintenance')
    if (product.attributes.temperature === 'Cooling') add(2, 'Cooling fill helps manage hot flashes')
  }

  // Skin / allergy rules
  if (answers.skinSensitivity === 'Allergic/Eczema') {
    if (product.attributes.hypoallergenic) add(4, 'Hypoallergenic fill essential for allergy sufferers')
    else add(-3, 'Non-hypoallergenic fill not suitable for allergies')
  }

  if (answers.skinSensitivity === 'Sensitive') {
    if (product.attributes.hypoallergenic) add(2, 'Hypoallergenic fill gentle on sensitive skin')
  }

  // Maintenance rules
  if (answers.maintenancePref === 'Low Maintenance') {
    if (product.attributes.washable) add(3, 'Machine washable — easy care for low-maintenance lifestyle')
    else add(-1, 'Dry-clean only adds to maintenance burden')
  }

  if (answers.maintenancePref === 'I Launder Frequently') {
    if (product.attributes.washable) add(2, 'Machine washable handles frequent laundering')
  }

  return { product, score, scoreBreakdown: reasons }
}

function generateWhyText(answers: QuizAnswers, sheet: SheetProduct, pillow: PillowProduct): string {
  const parts: string[] = []

  const isHot = answers.roomTemp === 'Hot' || answers.sleeperTemp === 'Warm' || answers.sleeperTemp === 'Hot Flash Prone'
  const isCold = answers.roomTemp === 'Cold' || answers.sleeperTemp === 'Always Cold'

  if (isHot) {
    parts.push(`Since you run warm, ${sheet.name}'s ${sheet.weave === 'N/A' ? sheet.material : sheet.weave} weave maximises airflow to keep you comfortable throughout the night.`)
  } else if (isCold) {
    parts.push(`${sheet.name} adds warmth and cosy comfort for your cold sleep environment.`)
  } else {
    parts.push(`${sheet.name} strikes the perfect balance — not too hot, not too cool — for your temperate sleeping style.`)
  }

  if (answers.skinSensitivity === 'Allergic/Eczema') {
    parts.push(`Its natural hypoallergenic properties make it a safe choice for your sensitive skin and allergy concerns.`)
  } else if (answers.skinSensitivity === 'Sensitive') {
    parts.push(`Its gentle texture is soothing against sensitive skin.`)
  }

  if (answers.petStatus === 'Yes — Cats or Dogs') {
    parts.push(`The tight ${sheet.weave === 'N/A' ? sheet.material : sheet.weave} weave resists pet hair embedding and holds up to the frequent washing that pet ownership demands.`)
  }

  if (answers.maintenancePref === 'Low Maintenance') {
    parts.push(`It's wrinkle-resistant too — shake dry and you're done, no ironing needed.`)
  }

  const positionMap: Record<string, string> = {
    'Side': 'side',
    'Back': 'back',
    'Stomach': 'stomach',
    'Combination': 'combination',
  }
  const pos = answers.sleepPosition ? positionMap[answers.sleepPosition] : 'your'
  parts.push(`For your ${pos} sleeping position, the ${pillow.name} (${pillow.attributes.loft.toLowerCase()} loft) keeps your spine in neutral alignment throughout the night.`)

  return parts.join(' ')
}

function generateBundleSuggestion(answers: QuizAnswers): string {
  const isHot = answers.roomTemp === 'Hot' || answers.sleeperTemp === 'Warm' || answers.sleeperTemp === 'Hot Flash Prone'
  const isCold = answers.roomTemp === 'Cold' || answers.sleeperTemp === 'Always Cold'

  if (answers.skinSensitivity === 'Allergic/Eczema') {
    return 'Complete your sleep setup with our hypoallergenic Topcell™ Lyocell duvet cover and matching pillowcases — OEKO-TEX certified and gentle on sensitive skin.'
  }
  if (isHot) {
    return 'Round out your setup with a Topcell™ Lyocell or CoolTouch Nylon Fiber duvet cover — both deliver instant cooling and superior moisture-wicking for warm sleepers.'
  }
  if (isCold) {
    return 'Complete the warmth layer with our Brushed Flannel Cotton or Egyptian Cotton Sateen duvet cover for cosy comfort on cold nights.'
  }
  return 'Complete your sleep setup with the SUPIMA Percale duvet cover and matching pillowcases — crisp, breathable, and built to last season after season.'
}

export function getRecommendation(answers: QuizAnswers): RecommendationResult {
  const scoredSheets = sheets
    .map(p => scoreSheet(p, answers))
    .sort((a, b) => b.score - a.score)

  const scoredPillows = pillows
    .map(p => scorePillow(p, answers))
    .sort((a, b) => b.score - a.score)

  const scoredComforters = comforters
    .map(p => scoreComforter(p, answers))
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
    bundleSuggestion: generateBundleSuggestion(answers),
  }
}
