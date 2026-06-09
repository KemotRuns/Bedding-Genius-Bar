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
  const add = (points: number, reason: string) => { score += points; reasons.push({ points, reason }) }

  // Q1: nightHeat — temperature tendency
  if (answers.nightHeat === 'Very Hot') {
    if (product.attributes.temperature === 'Cooling') add(4, 'Cooling fabric ideal for hot sleepers')
    if (product.ratings.breathability >= 4) add(3, 'High breathability handles night sweats')
    if (product.attributes.moisture_wicking === 'High') add(2, 'High wicking for night sweats')
    if (product.attributes.temperature === 'Warming') add(-3, 'Warming fabric not suitable for hot sleepers')
  }
  if (answers.nightHeat === 'Warm') {
    if (product.attributes.temperature === 'Cooling') add(3, 'Cooling fabric for warm sleeper')
    if (product.ratings.breathability >= 4) add(2, 'Breathable weave for warm nights')
  }
  if (answers.nightHeat === 'Cold') {
    if (product.attributes.temperature === 'Warming') add(4, 'Warming fabric for cold sleeper')
    if (product.attributes.temperature === 'Cooling') add(-2, 'Cooling fabric not ideal for cold sleeper')
  }
  if (answers.nightHeat === 'Neutral') {
    if (product.attributes.temperature === 'Neutral') add(2, 'Neutral temperature for balanced sleeper')
  }

  // Q2: skinType — skin sensitivity
  if (answers.skinType === 'Allergic/Eczema') {
    if (product.attributes.hypoallergenic) add(5, 'Hypoallergenic — essential for eczema or allergies')
    else add(-3, 'Non-hypoallergenic fabric not recommended for eczema')
    if (product.material === 'Silk') add(1, 'Silk protein is gentle on eczema-prone skin')
    if (product.attributes.softness === 'Ultra-Soft') add(2, 'Ultra-soft texture soothes sensitive skin')
    if (product.attributes.softness === 'Textured') add(-2, 'Textured surface may aggravate eczema')
  }
  if (answers.skinType === 'Sensitive') {
    if (product.attributes.hypoallergenic) add(3, 'Hypoallergenic material for sensitive skin')
    if (product.attributes.softness === 'Ultra-Soft' || product.attributes.softness === 'Smooth') add(2, 'Smooth texture gentle on sensitive skin')
    if (product.attributes.softness === 'Textured') add(-1, 'Textured surface may irritate sensitive skin')
  }

  // Q3: careLevel — maintenance preference
  if (answers.careLevel === 'Minimal') {
    if (product.attributes.wrinkle_resistance === 'High') add(3, 'Wrinkle-resistant for wash-and-go lifestyle')
    if (product.attributes.wrinkle_resistance === 'Low') add(-2, 'Wrinkles easily — requires ironing')
    if (product.attributes.durability === 'High') add(1, 'Durable for frequent low-fuss washing')
    if (product.material === 'Silk') add(-2, 'Silk requires delicate care, not ideal for minimal upkeep')
  }
  if (answers.careLevel === 'Standard') {
    if (product.attributes.durability === 'High') add(1, 'Durable for regular machine washing')
  }
  if (answers.careLevel === 'Careful') {
    if (product.material === 'Silk') add(2, 'Silk rewards careful hand-washing')
    if (product.material === 'Tencel Lyocell') add(1, 'Tencel benefits from careful wash routine')
  }

  // Q4: sensoryPref — first-touch sensation
  if (answers.sensoryPref === 'Cooling') {
    if (product.material === 'Nylon Fiber') add(4, 'Nylon delivers instant cool-to-touch sensation')
    if (product.attributes.temperature === 'Cooling') add(2, 'Cooling fabric matches sensory preference')
    if (product.ratings.breathability >= 4) add(2, 'High breathability for a cool, crisp feel')
  }
  if (answers.sensoryPref === 'Silky') {
    if (product.material === 'Silk') add(5, 'Silk is the ultimate in silky, lustrous texture')
    if (product.material === 'Tencel Lyocell') add(3, 'Tencel offers silky smooth natural sheen')
    if (product.attributes.softness === 'Ultra-Soft') add(2, 'Ultra-soft surface for silky preference')
  }
  if (answers.sensoryPref === 'Classic') {
    if (product.material === 'Cotton') add(4, 'Cotton delivers the classic, familiar soft feel')
    if (product.weave === 'Sateen') add(2, 'Sateen weave for classic elegance')
    if (product.material === 'Flannel') add(2, 'Flannel is the classic cosy comfort choice')
  }

  return { product, score, scoreBreakdown: reasons }
}

function scoreComforter(product: ComforterProduct, answers: QuizAnswers): ScoredComforter {
  const reasons: ScoreReason[] = []
  let score = 0
  const add = (points: number, reason: string) => { score += points; reasons.push({ points, reason }) }

  // Q5: comforterTemp — warmth under covers
  if (answers.comforterTemp === 'Always Cold') {
    if (product.attributes.warmth === 'Winter') add(5, 'Winter weight delivers the warmth cold sleepers need')
    if (product.attributes.temperature === 'Warming') add(3, 'Warming fill for cold nights')
    if (product.attributes.temperature === 'Cooling') add(-2, 'Cooling fill provides less warmth for cold nights')
  }
  if (answers.comforterTemp === 'Hot') {
    if (product.attributes.warmth === 'All-Season') add(4, 'All-season weight ideal for hot sleeper')
    if (product.attributes.temperature === 'Cooling') add(4, 'Cooling fill for hot sleeper')
    if (product.attributes.warmth === 'Winter') add(-4, 'Winter weight too heavy for hot sleeper')
    if (product.attributes.temperature === 'Warming') add(-3, 'Warming fill not ideal for hot sleeper')
  }
  if (answers.comforterTemp === 'Neutral') {
    if (product.attributes.warmth === 'All-Season') add(4, 'All-season weight suits comfortable sleeper')
    if (product.attributes.warmth === 'Winter') add(1, 'Winter weight available for extra warmth')
  }

  // Q6: comforterFeel — weight and sensation preference
  if (answers.comforterFeel === 'Heavy') {
    if (product.fill === 'Wool') add(5, 'Wool delivers heavy, cocooned warmth')
    if (product.attributes.weight === 'Heavy') add(3, 'Heavy weight matches preference')
  }
  if (answers.comforterFeel === 'Fluffy') {
    if (product.fill === 'Down') add(5, 'Down delivers light, cloud-like loft')
    if (product.ratings.fluffiness >= 4) add(2, 'High fluffiness rating matches preference')
  }
  if (answers.comforterFeel === 'Smooth') {
    if (product.fill === 'Silk') add(5, 'Silk delivers smooth, body-hugging breathable comfort')
    if (product.attributes.hypoallergenic) add(2, 'Hypoallergenic bonus for smooth, skin-friendly preference')
  }
  if (answers.comforterFeel === 'Practical') {
    if (product.fill === 'Tech Fiber') add(5, 'Tech fiber is practical, washable, and resilient')
    if (product.attributes.washable) add(3, 'Machine washable for easy-care households')
  }

  // Q7: breathingIssues — allergies or asthma
  if (answers.breathingIssues === 'Yes') {
    if (product.attributes.hypoallergenic) add(5, 'Hypoallergenic fill — essential for breathing sensitivities')
    if (product.attributes.washable) add(3, 'Machine washable removes allergens effectively')
    if (product.fill === 'Down') add(-4, 'Down can trigger respiratory sensitivities')
    if (product.fill === 'Wool') add(-2, 'Wool may carry natural scents that affect breathing')
  }

  // Skintype also influences comforter
  if (answers.skinType === 'Allergic/Eczema') {
    if (product.attributes.hypoallergenic) add(3, 'Hypoallergenic fill for allergy-prone skin')
    else add(-2, 'Non-hypoallergenic fill not ideal for allergies')
  }
  if (answers.skinType === 'Sensitive') {
    if (product.attributes.hypoallergenic) add(2, 'Hypoallergenic fill gentle on sensitive skin')
  }

  // careLevel influences comforter care
  if (answers.careLevel === 'Minimal') {
    if (product.attributes.washable) add(3, 'Machine washable for low-maintenance preference')
    else add(-1, 'Dry-clean only adds to maintenance burden')
  }
  if (answers.careLevel === 'Standard') {
    if (product.attributes.washable) add(2, 'Machine washable for standard care preference')
  }

  return { product, score, scoreBreakdown: reasons }
}

function scorePillow(product: PillowProduct, answers: QuizAnswers): ScoredPillow {
  const reasons: ScoreReason[] = []
  let score = 0
  const add = (points: number, reason: string) => { score += points; reasons.push({ points, reason }) }

  // Q8 × Q9: sleepPosition × shoulderWidth — loft selection
  if (answers.sleepPosition === 'Stomach') {
    if (product.attributes.loft === 'Low') add(8, 'Low loft prevents neck arching for stomach sleepers')
    if (product.attributes.loft === 'Medium') add(-3, 'Too thick for stomach sleepers — neck strain risk')
    if (product.attributes.loft === 'High') add(-5, 'High loft causes neck arching — not safe for stomach sleepers')
  }
  if (answers.sleepPosition === 'Side') {
    if (answers.shoulderWidth === 'Broad') {
      if (product.attributes.loft === 'High') add(6, 'High loft fills gap between ear and broad shoulder')
      if (product.attributes.loft === 'Medium') add(2, 'Medium loft may suit broad side sleeper')
      if (product.attributes.loft === 'Low') add(-4, 'Too flat for broad-shouldered side sleeper')
    } else if (answers.shoulderWidth === 'Average') {
      if (product.attributes.loft === 'High') add(3, 'High loft supports average side sleeper')
      if (product.attributes.loft === 'Medium') add(4, 'Medium loft ideal for average side sleeper')
      if (product.attributes.loft === 'Low') add(-3, 'Too flat for side sleeping')
    } else if (answers.shoulderWidth === 'Petite') {
      if (product.attributes.loft === 'Medium') add(5, 'Medium loft fills petite shoulder gap without overfilling')
      if (product.attributes.loft === 'High') add(1, 'Slightly high for petite frame')
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
    if (product.attributes.adjustable) add(3, 'Adjustable fill is perfect for combination sleepers')
    if (product.attributes.loft === 'High') add(1, 'Can work for combination sleepers who lean toward side')
  }

  // Q10: pillowFeel — sink vs support preference
  if (answers.pillowFeel === 'Sink') {
    if (product.fill === 'Down') add(5, 'Down delivers deeply cushioned, fluffy enveloping feel')
    if (product.attributes.firmness === 'Soft') add(3, 'Soft firmness for sink-in preference')
    if (product.attributes.loft === 'High') add(1, 'High loft adds to plush, cushioned feel')
  }
  if (answers.pillowFeel === 'Springy') {
    if (product.fill === 'Latex') add(5, 'Latex delivers resilient, springy responsive support')
    if (product.attributes.firmness === 'Medium') add(2, 'Medium firmness for responsive feel')
  }
  if (answers.pillowFeel === 'Contour') {
    if (product.fill === 'Memory Foam') add(5, 'Memory foam contours precisely to neck and head shape')
    if (product.attributes.firmness === 'Firm') add(2, 'Firm support ideal for contouring preference')
  }
  if (answers.pillowFeel === 'Balanced') {
    if (product.fill === 'Tech Fiber') add(5, 'Tech fiber delivers balanced support and easy care')
    if (product.attributes.firmness === 'Medium') add(1, 'Medium firmness for balanced feel')
  }

  // Q11: pillowPriority — allergy, value, or premium
  if (answers.pillowPriority === 'Allergies') {
    if (product.attributes.hypoallergenic) add(5, 'Hypoallergenic fill essential for allergy protection')
    if (product.fill === 'Down') add(-4, 'Down not recommended for allergy sufferers')
  }
  if (answers.pillowPriority === 'Value') {
    if (product.fill === 'Tech Fiber') add(4, 'Tech fiber offers the best comfort-to-cost ratio')
  }
  if (answers.pillowPriority === 'Premium') {
    if (product.fill === 'Down') add(3, 'Down is the premium choice for cloud-like comfort')
    if (product.fill === 'Latex') add(2, 'Latex is a premium natural material')
  }

  // skinType also affects pillow
  if (answers.skinType === 'Allergic/Eczema') {
    if (product.attributes.hypoallergenic) add(3, 'Hypoallergenic fill for allergy-prone skin')
    else add(-2, 'Non-hypoallergenic fill not suitable for allergies')
  }
  if (answers.skinType === 'Sensitive') {
    if (product.attributes.hypoallergenic) add(2, 'Hypoallergenic fill gentle on sensitive skin')
  }

  // nightHeat affects pillow temperature
  if (answers.nightHeat === 'Very Hot' || answers.nightHeat === 'Warm') {
    if (product.attributes.temperature === 'Cooling') add(2, 'Cooling pillow for warm sleeper')
    if (product.attributes.temperature === 'Warming') add(-2, 'Warming pillow not ideal for hot sleeper')
  }
  if (answers.nightHeat === 'Cold') {
    if (product.attributes.temperature === 'Warming') add(2, 'Warming pillow for cold sleeper')
  }

  return { product, score, scoreBreakdown: reasons }
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
