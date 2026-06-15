import type { ScoringRule, ProductCategory, RuleOperator } from './types'

// Canonical scoring rules — a faithful, data-driven transcription of the
// imperative logic that previously lived in engine.ts. This is the seed source
// for the Supabase `scoring_rules` table and the fallback when the DB is empty.

type Also = [string, string]
function r(
  question_key: string,
  answer_value: string,
  target_category: ProductCategory,
  attribute_path: string,
  operator: RuleOperator,
  compare_value: string,
  points: number,
  reason: string,
  also?: Also,
): ScoringRule {
  return {
    question_key, answer_value, target_category,
    attribute_path, operator, compare_value, points, reason,
    also_question_key: also ? also[0] : null,
    also_answer_value: also ? also[1] : null,
  }
}

export const SCORING_RULES: ScoringRule[] = [
  // ════════════ SHEETS ════════════
  // Q1 nightHeat
  r('nightHeat', 'Very Hot', 'sheet', 'attributes.temperature', 'eq', 'Cooling', 4, 'Cooling fabric ideal for hot sleepers'),
  r('nightHeat', 'Very Hot', 'sheet', 'ratings.breathability', 'gte', '4', 3, 'High breathability handles night sweats'),
  r('nightHeat', 'Very Hot', 'sheet', 'attributes.moisture_wicking', 'eq', 'High', 2, 'High wicking for night sweats'),
  r('nightHeat', 'Very Hot', 'sheet', 'attributes.temperature', 'eq', 'Warming', -3, 'Warming fabric not suitable for hot sleepers'),
  r('nightHeat', 'Warm', 'sheet', 'attributes.temperature', 'eq', 'Cooling', 3, 'Cooling fabric for warm sleeper'),
  r('nightHeat', 'Warm', 'sheet', 'ratings.breathability', 'gte', '4', 2, 'Breathable weave for warm nights'),
  r('nightHeat', 'Cold', 'sheet', 'attributes.temperature', 'eq', 'Warming', 4, 'Warming fabric for cold sleeper'),
  r('nightHeat', 'Cold', 'sheet', 'attributes.temperature', 'eq', 'Cooling', -2, 'Cooling fabric not ideal for cold sleeper'),
  r('nightHeat', 'Neutral', 'sheet', 'attributes.temperature', 'eq', 'Neutral', 2, 'Neutral temperature for balanced sleeper'),
  // Q2 skinType
  r('skinType', 'Allergic/Eczema', 'sheet', 'attributes.hypoallergenic', 'eq', 'true', 5, 'Hypoallergenic — essential for eczema or allergies'),
  r('skinType', 'Allergic/Eczema', 'sheet', 'attributes.hypoallergenic', 'eq', 'false', -3, 'Non-hypoallergenic fabric not recommended for eczema'),
  r('skinType', 'Allergic/Eczema', 'sheet', 'material', 'eq', 'Silk', 1, 'Silk protein is gentle on eczema-prone skin'),
  r('skinType', 'Allergic/Eczema', 'sheet', 'attributes.softness', 'eq', 'Ultra-Soft', 2, 'Ultra-soft texture soothes sensitive skin'),
  r('skinType', 'Allergic/Eczema', 'sheet', 'attributes.softness', 'eq', 'Textured', -2, 'Textured surface may aggravate eczema'),
  r('skinType', 'Sensitive', 'sheet', 'attributes.hypoallergenic', 'eq', 'true', 3, 'Hypoallergenic material for sensitive skin'),
  r('skinType', 'Sensitive', 'sheet', 'attributes.softness', 'eq', 'Ultra-Soft', 2, 'Smooth texture gentle on sensitive skin'),
  r('skinType', 'Sensitive', 'sheet', 'attributes.softness', 'eq', 'Smooth', 2, 'Smooth texture gentle on sensitive skin'),
  r('skinType', 'Sensitive', 'sheet', 'attributes.softness', 'eq', 'Textured', -1, 'Textured surface may irritate sensitive skin'),
  // Q3 careLevel
  r('careLevel', 'Minimal', 'sheet', 'attributes.wrinkle_resistance', 'eq', 'High', 3, 'Wrinkle-resistant for wash-and-go lifestyle'),
  r('careLevel', 'Minimal', 'sheet', 'attributes.wrinkle_resistance', 'eq', 'Low', -2, 'Wrinkles easily — requires ironing'),
  r('careLevel', 'Minimal', 'sheet', 'attributes.durability', 'eq', 'High', 1, 'Durable for frequent low-fuss washing'),
  r('careLevel', 'Minimal', 'sheet', 'material', 'eq', 'Silk', -2, 'Silk requires delicate care, not ideal for minimal upkeep'),
  r('careLevel', 'Standard', 'sheet', 'attributes.durability', 'eq', 'High', 1, 'Durable for regular machine washing'),
  r('careLevel', 'Careful', 'sheet', 'material', 'eq', 'Silk', 2, 'Silk rewards careful hand-washing'),
  r('careLevel', 'Careful', 'sheet', 'material', 'eq', 'Tencel Lyocell', 1, 'Tencel benefits from careful wash routine'),
  // Q4 sensoryPref
  r('sensoryPref', 'Cooling', 'sheet', 'material', 'eq', 'Nylon Fiber', 4, 'Nylon delivers instant cool-to-touch sensation'),
  r('sensoryPref', 'Cooling', 'sheet', 'attributes.temperature', 'eq', 'Cooling', 2, 'Cooling fabric matches sensory preference'),
  r('sensoryPref', 'Cooling', 'sheet', 'ratings.breathability', 'gte', '4', 2, 'High breathability for a cool, crisp feel'),
  r('sensoryPref', 'Silky', 'sheet', 'material', 'eq', 'Silk', 5, 'Silk is the ultimate in silky, lustrous texture'),
  r('sensoryPref', 'Silky', 'sheet', 'material', 'eq', 'Tencel Lyocell', 3, 'Tencel offers silky smooth natural sheen'),
  r('sensoryPref', 'Silky', 'sheet', 'attributes.softness', 'eq', 'Ultra-Soft', 2, 'Ultra-soft surface for silky preference'),
  r('sensoryPref', 'Classic', 'sheet', 'material', 'eq', 'Cotton', 4, 'Cotton delivers the classic, familiar soft feel'),
  r('sensoryPref', 'Classic', 'sheet', 'weave', 'eq', 'Sateen', 2, 'Sateen weave for classic elegance'),
  r('sensoryPref', 'Classic', 'sheet', 'material', 'eq', 'Flannel', 2, 'Flannel is the classic cosy comfort choice'),

  // ════════════ COMFORTER ════════════
  // Q5 comforterTemp
  r('comforterTemp', 'Always Cold', 'comforter', 'attributes.warmth', 'eq', 'Winter', 5, 'Winter weight delivers the warmth cold sleepers need'),
  r('comforterTemp', 'Always Cold', 'comforter', 'attributes.temperature', 'eq', 'Warming', 3, 'Warming fill for cold nights'),
  r('comforterTemp', 'Always Cold', 'comforter', 'attributes.temperature', 'eq', 'Cooling', -2, 'Cooling fill provides less warmth for cold nights'),
  r('comforterTemp', 'Hot', 'comforter', 'attributes.warmth', 'eq', 'All-Season', 4, 'All-season weight ideal for hot sleeper'),
  r('comforterTemp', 'Hot', 'comforter', 'attributes.temperature', 'eq', 'Cooling', 4, 'Cooling fill for hot sleeper'),
  r('comforterTemp', 'Hot', 'comforter', 'attributes.warmth', 'eq', 'Winter', -4, 'Winter weight too heavy for hot sleeper'),
  r('comforterTemp', 'Hot', 'comforter', 'attributes.temperature', 'eq', 'Warming', -3, 'Warming fill not ideal for hot sleeper'),
  r('comforterTemp', 'Neutral', 'comforter', 'attributes.warmth', 'eq', 'All-Season', 4, 'All-season weight suits comfortable sleeper'),
  r('comforterTemp', 'Neutral', 'comforter', 'attributes.warmth', 'eq', 'Winter', 1, 'Winter weight available for extra warmth'),
  // Q6 comforterFeel
  r('comforterFeel', 'Heavy', 'comforter', 'fill', 'eq', 'Wool', 5, 'Wool delivers heavy, cocooned warmth'),
  r('comforterFeel', 'Heavy', 'comforter', 'attributes.weight', 'eq', 'Heavy', 3, 'Heavy weight matches preference'),
  r('comforterFeel', 'Fluffy', 'comforter', 'fill', 'eq', 'Down', 5, 'Down delivers light, cloud-like loft'),
  r('comforterFeel', 'Fluffy', 'comforter', 'ratings.fluffiness', 'gte', '4', 2, 'High fluffiness rating matches preference'),
  r('comforterFeel', 'Smooth', 'comforter', 'fill', 'eq', 'Silk', 5, 'Silk delivers smooth, body-hugging breathable comfort'),
  r('comforterFeel', 'Smooth', 'comforter', 'attributes.hypoallergenic', 'eq', 'true', 2, 'Hypoallergenic bonus for smooth, skin-friendly preference'),
  r('comforterFeel', 'Practical', 'comforter', 'fill', 'eq', 'Tech Fiber', 5, 'Tech fiber is practical, washable, and resilient'),
  r('comforterFeel', 'Practical', 'comforter', 'attributes.washable', 'eq', 'true', 3, 'Machine washable for easy-care households'),
  // Q7 breathingIssues
  r('breathingIssues', 'Yes', 'comforter', 'attributes.hypoallergenic', 'eq', 'true', 5, 'Hypoallergenic fill — essential for breathing sensitivities'),
  r('breathingIssues', 'Yes', 'comforter', 'attributes.washable', 'eq', 'true', 3, 'Machine washable removes allergens effectively'),
  r('breathingIssues', 'Yes', 'comforter', 'fill', 'eq', 'Down', -4, 'Down can trigger respiratory sensitivities'),
  r('breathingIssues', 'Yes', 'comforter', 'fill', 'eq', 'Wool', -2, 'Wool may carry natural scents that affect breathing'),
  // skinType → comforter
  r('skinType', 'Allergic/Eczema', 'comforter', 'attributes.hypoallergenic', 'eq', 'true', 3, 'Hypoallergenic fill for allergy-prone skin'),
  r('skinType', 'Allergic/Eczema', 'comforter', 'attributes.hypoallergenic', 'eq', 'false', -2, 'Non-hypoallergenic fill not ideal for allergies'),
  r('skinType', 'Sensitive', 'comforter', 'attributes.hypoallergenic', 'eq', 'true', 2, 'Hypoallergenic fill gentle on sensitive skin'),
  // careLevel → comforter
  r('careLevel', 'Minimal', 'comforter', 'attributes.washable', 'eq', 'true', 3, 'Machine washable for low-maintenance preference'),
  r('careLevel', 'Minimal', 'comforter', 'attributes.washable', 'eq', 'false', -1, 'Dry-clean only adds to maintenance burden'),
  r('careLevel', 'Standard', 'comforter', 'attributes.washable', 'eq', 'true', 2, 'Machine washable for standard care preference'),

  // ════════════ PILLOW ════════════
  // Q8 sleepPosition — Stomach
  r('sleepPosition', 'Stomach', 'pillow', 'attributes.loft', 'eq', 'Low', 8, 'Low loft prevents neck arching for stomach sleepers'),
  r('sleepPosition', 'Stomach', 'pillow', 'attributes.loft', 'eq', 'Medium', -3, 'Too thick for stomach sleepers — neck strain risk'),
  r('sleepPosition', 'Stomach', 'pillow', 'attributes.loft', 'eq', 'High', -5, 'High loft causes neck arching — not safe for stomach sleepers'),
  // Side × shoulderWidth (Q8 + Q9)
  r('sleepPosition', 'Side', 'pillow', 'attributes.loft', 'eq', 'High', 6, 'High loft fills gap between ear and broad shoulder', ['shoulderWidth', 'Broad']),
  r('sleepPosition', 'Side', 'pillow', 'attributes.loft', 'eq', 'Medium', 2, 'Medium loft may suit broad side sleeper', ['shoulderWidth', 'Broad']),
  r('sleepPosition', 'Side', 'pillow', 'attributes.loft', 'eq', 'Low', -4, 'Too flat for broad-shouldered side sleeper', ['shoulderWidth', 'Broad']),
  r('sleepPosition', 'Side', 'pillow', 'attributes.loft', 'eq', 'High', 3, 'High loft supports average side sleeper', ['shoulderWidth', 'Average']),
  r('sleepPosition', 'Side', 'pillow', 'attributes.loft', 'eq', 'Medium', 4, 'Medium loft ideal for average side sleeper', ['shoulderWidth', 'Average']),
  r('sleepPosition', 'Side', 'pillow', 'attributes.loft', 'eq', 'Low', -3, 'Too flat for side sleeping', ['shoulderWidth', 'Average']),
  r('sleepPosition', 'Side', 'pillow', 'attributes.loft', 'eq', 'Medium', 5, 'Medium loft fills petite shoulder gap without overfilling', ['shoulderWidth', 'Petite']),
  r('sleepPosition', 'Side', 'pillow', 'attributes.loft', 'eq', 'High', 1, 'Slightly high for petite frame', ['shoulderWidth', 'Petite']),
  r('sleepPosition', 'Side', 'pillow', 'attributes.loft', 'eq', 'Low', -2, 'Too flat for petite side sleeper', ['shoulderWidth', 'Petite']),
  // Back
  r('sleepPosition', 'Back', 'pillow', 'attributes.loft', 'eq', 'Medium', 6, 'Medium loft keeps neck in neutral alignment for back sleepers'),
  r('sleepPosition', 'Back', 'pillow', 'attributes.loft', 'eq', 'High', -3, 'Too thick for back sleepers — pushes neck forward'),
  r('sleepPosition', 'Back', 'pillow', 'attributes.loft', 'eq', 'Low', -2, 'Too flat for back sleepers — neck unsupported'),
  // Combination
  r('sleepPosition', 'Combination', 'pillow', 'attributes.loft', 'eq', 'Medium', 5, 'Medium loft adapts to multiple sleep positions'),
  r('sleepPosition', 'Combination', 'pillow', 'attributes.adjustable', 'eq', 'true', 3, 'Adjustable fill is perfect for combination sleepers'),
  r('sleepPosition', 'Combination', 'pillow', 'attributes.loft', 'eq', 'High', 1, 'Can work for combination sleepers who lean toward side'),
  // Q10 pillowFeel
  r('pillowFeel', 'Sink', 'pillow', 'fill', 'eq', 'Down', 5, 'Down delivers deeply cushioned, fluffy enveloping feel'),
  r('pillowFeel', 'Sink', 'pillow', 'attributes.firmness', 'eq', 'Soft', 3, 'Soft firmness for sink-in preference'),
  r('pillowFeel', 'Sink', 'pillow', 'attributes.loft', 'eq', 'High', 1, 'High loft adds to plush, cushioned feel'),
  r('pillowFeel', 'Springy', 'pillow', 'fill', 'eq', 'Latex', 5, 'Latex delivers resilient, springy responsive support'),
  r('pillowFeel', 'Springy', 'pillow', 'attributes.firmness', 'eq', 'Medium', 2, 'Medium firmness for responsive feel'),
  r('pillowFeel', 'Contour', 'pillow', 'fill', 'eq', 'Memory Foam', 5, 'Memory foam contours precisely to neck and head shape'),
  r('pillowFeel', 'Contour', 'pillow', 'attributes.firmness', 'eq', 'Firm', 2, 'Firm support ideal for contouring preference'),
  r('pillowFeel', 'Balanced', 'pillow', 'fill', 'eq', 'Tech Fiber', 5, 'Tech fiber delivers balanced support and easy care'),
  r('pillowFeel', 'Balanced', 'pillow', 'attributes.firmness', 'eq', 'Medium', 1, 'Medium firmness for balanced feel'),
  // Q11 pillowPriority
  r('pillowPriority', 'Allergies', 'pillow', 'attributes.hypoallergenic', 'eq', 'true', 5, 'Hypoallergenic fill essential for allergy protection'),
  r('pillowPriority', 'Allergies', 'pillow', 'fill', 'eq', 'Down', -4, 'Down not recommended for allergy sufferers'),
  r('pillowPriority', 'Value', 'pillow', 'fill', 'eq', 'Tech Fiber', 4, 'Tech fiber offers the best comfort-to-cost ratio'),
  r('pillowPriority', 'Premium', 'pillow', 'fill', 'eq', 'Down', 3, 'Down is the premium choice for cloud-like comfort'),
  r('pillowPriority', 'Premium', 'pillow', 'fill', 'eq', 'Latex', 2, 'Latex is a premium natural material'),
  // skinType → pillow
  r('skinType', 'Allergic/Eczema', 'pillow', 'attributes.hypoallergenic', 'eq', 'true', 3, 'Hypoallergenic fill for allergy-prone skin'),
  r('skinType', 'Allergic/Eczema', 'pillow', 'attributes.hypoallergenic', 'eq', 'false', -2, 'Non-hypoallergenic fill not suitable for allergies'),
  r('skinType', 'Sensitive', 'pillow', 'attributes.hypoallergenic', 'eq', 'true', 2, 'Hypoallergenic fill gentle on sensitive skin'),
  // nightHeat → pillow
  r('nightHeat', 'Very Hot', 'pillow', 'attributes.temperature', 'eq', 'Cooling', 2, 'Cooling pillow for warm sleeper'),
  r('nightHeat', 'Very Hot', 'pillow', 'attributes.temperature', 'eq', 'Warming', -2, 'Warming pillow not ideal for hot sleeper'),
  r('nightHeat', 'Warm', 'pillow', 'attributes.temperature', 'eq', 'Cooling', 2, 'Cooling pillow for warm sleeper'),
  r('nightHeat', 'Warm', 'pillow', 'attributes.temperature', 'eq', 'Warming', -2, 'Warming pillow not ideal for hot sleeper'),
  r('nightHeat', 'Cold', 'pillow', 'attributes.temperature', 'eq', 'Warming', 2, 'Warming pillow for cold sleeper'),
]
