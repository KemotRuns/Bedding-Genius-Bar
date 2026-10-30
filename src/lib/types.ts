import type { ReactNode } from 'react'

// ─── Catalog (v2: real FET.com products) ─────────────────────────────────────
//
// A product is a live FET.com listing. Matching is set-based: for every quiz
// question, `match` lists the answer values this product suits (taken from
// FEAC's "List of matched products" columns). Bedding sets instead carry a
// material tier + design style; the engine derives their answer matches from
// MATERIAL_MATCH in engine.ts so the client only has to pick two dropdowns.

export type ProductCategory = 'sheet' | 'comforter' | 'pillow'

export type BeddingMaterial = 'tencel80' | 'tencel60' | 'cotton60' | 'cotton40' | 'cotton500' | 'topcool'
export type DesignStyle = 'Nature' | 'Minimal' | 'Playful' | 'Classic'

/** question key → answer values this product should be recommended for */
export type MatchSpec = Partial<Record<keyof QuizAnswers, string[]>>

export interface Product {
  id: string                 // FET.com SalePage id, e.g. "7013366"
  category: ProductCategory
  name_zh: string
  name_en: string
  type_zh: string            // 羽絨 / 乳膠 / 蠶絲 / 80支天絲…
  type_en: string            // Down / Latex / Silk / 80S Tencel…
  url: string                // FET.com product page
  image_url: string          // main product photo (91App CDN)
  price_twd?: number | null
  bullets_zh: string[]
  bullets_en: string[]
  match: MatchSpec
  material?: BeddingMaterial // sheets only
  style?: DesignStyle        // sheets only
  sort_order: number
  active: boolean
}

// ─── Quiz answers (v2 question set, 1020 spreadsheet) ───────────────────────

export type NightHeat = 'Very Hot' | 'Warm' | 'Neutral' | 'Cold'
export type SkinType = 'SensitiveLux' | 'SensitiveRefined' | 'Everyday'
export type CareLevel = 'Minimal' | 'Standard' | 'Careful'
export type SensoryPref = 'Cooling' | 'Silky' | 'Classic'

export type ComforterTemp = 'Always Cold' | 'Neutral' | 'Hot'
export type ComforterFeel = 'Heavy' | 'Fluffy' | 'Smooth'
export type ComforterAllergy = 'Washable' | 'Natural' | 'None'
export type ComforterScent = 'NoScent' | 'MildOk'
export type ComforterUse = 'Budget' | 'Daily' | 'Luxury'

export type SleepPosition = 'Side' | 'Back' | 'Stomach'
export type PillowFeel = 'Sink' | 'Springy' | 'Contour' | 'Balanced'
export type ShoulderWidth = 'Petite' | 'Average' | 'Broad'
export type PillowAllergy = 'Yes' | 'No'
export type PillowTier = 'Effortless' | 'Enhanced' | 'Luxury'

export interface QuizAnswers {
  // Bedding sets
  nightHeat?: NightHeat
  skinType?: SkinType
  careLevel?: CareLevel
  sensoryPref?: SensoryPref
  designStyle?: DesignStyle
  // Comforter
  comforterTemp?: ComforterTemp
  comforterFeel?: ComforterFeel
  comforterAllergy?: ComforterAllergy
  comforterScent?: ComforterScent
  comforterUse?: ComforterUse
  // Pillow
  sleepPosition?: SleepPosition
  pillowFeel?: PillowFeel
  shoulderWidth?: ShoulderWidth
  pillowAllergy?: PillowAllergy
  pillowTier?: PillowTier
}

// ─── Engine output ───────────────────────────────────────────────────────────

export interface ScoredProduct {
  product: Product
  score: number
  maxScore: number           // sum of weights of the answered questions for this category
  matched: (keyof QuizAnswers)[]
}

export interface RecommendationResult {
  sheets: ScoredProduct[]
  comforters: ScoredProduct[]
  pillows: ScoredProduct[]
}

// ─── Quiz UI ─────────────────────────────────────────────────────────────────

export interface IconOption<T extends string = string> {
  value: T
  label: string
  label_zh?: string
  icon: ReactNode
  sublabel?: string
  sublabel_zh?: string
}

export interface QuestionConfig {
  id: keyof QuizAnswers
  question: string
  question_zh?: string
  options: IconOption[]
  columns: 2 | 3 | 4
  section?: string
}
