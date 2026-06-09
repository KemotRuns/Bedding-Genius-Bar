import type { ReactNode } from 'react'

// ---- Product Types ----

export type TemperatureRating = 'Cooling' | 'Neutral' | 'Warming'
export type WeaveName = 'Percale' | 'Sateen' | 'Jersey' | 'Waffle' | 'Plain' | 'Twill' | 'N/A'
export type MaterialName =
  | 'Cotton'
  | 'Tencel Lyocell'
  | 'Linen'
  | 'Silk'
  | 'Flannel'
  | 'Nylon Fiber'

export interface SheetProduct {
  product_id: string
  name: string
  sku?: string
  collection?: string
  material: MaterialName
  weave: WeaveName
  thread_count?: number
  attributes: {
    temperature: TemperatureRating
    moisture_wicking: 'High' | 'Moderate' | 'Low'
    softness: 'Ultra-Soft' | 'Smooth' | 'Crisp' | 'Textured'
    durability: 'High' | 'Medium' | 'Low'
    hypoallergenic: boolean
    wrinkle_resistance: 'High' | 'Medium' | 'Low'
    weave_tightness: 'Tight' | 'Medium' | 'Loose'
  }
  best_for: string[]
  ratings: {
    breathability: 1 | 2 | 3 | 4 | 5
    wicking: 1 | 2 | 3 | 4 | 5
    warmth: 1 | 2 | 3 | 4 | 5
    softness: 1 | 2 | 3 | 4 | 5
  }
  description: string
  weave_texture_image?: string
}

export type LoftLevel = 'High' | 'Medium' | 'Low'
export type FirmnessLevel = 'Firm' | 'Medium' | 'Soft'

export interface PillowProduct {
  product_id: string
  name: string
  sku?: string
  collection?: string
  fill: 'Down' | 'Memory Foam' | 'Latex' | 'Tech Fiber'
  attributes: {
    loft: LoftLevel
    firmness: FirmnessLevel
    hypoallergenic: boolean
    temperature: TemperatureRating
    adjustable: boolean
  }
  best_for: string[]
  description: string
}

export interface ComforterProduct {
  product_id: string
  name: string
  sku?: string
  collection?: string
  fill: 'Silk' | 'Wool' | 'Down' | 'Tech Fiber'
  attributes: {
    warmth: 'Summer' | 'All-Season' | 'Winter'
    temperature: TemperatureRating
    hypoallergenic: boolean
    washable: boolean
    weight: 'Light' | 'Medium' | 'Heavy'
  }
  best_for: string[]
  description: string
  ratings: {
    warmth: 1 | 2 | 3 | 4 | 5
    breathability: 1 | 2 | 3 | 4 | 5
    fluffiness: 1 | 2 | 3 | 4 | 5
  }
}

// ---- Quiz Types ----

export type NightHeat = 'Very Hot' | 'Warm' | 'Neutral' | 'Cold'
export type SkinType = 'Allergic/Eczema' | 'Sensitive' | 'None'
export type CareLevel = 'Minimal' | 'Standard' | 'Careful'
export type SensoryPref = 'Cooling' | 'Silky' | 'Classic'
export type ComforterTemp = 'Always Cold' | 'Neutral' | 'Hot'
export type ComforterFeel = 'Heavy' | 'Fluffy' | 'Smooth' | 'Practical'
export type BreathingIssues = 'Yes' | 'No'
export type SleepPosition = 'Side' | 'Back' | 'Stomach' | 'Combination'
export type ShoulderWidth = 'Petite' | 'Average' | 'Broad'
export type PillowFeel = 'Sink' | 'Springy' | 'Contour' | 'Balanced'
export type PillowPriority = 'Allergies' | 'Value' | 'Premium'

export interface QuizAnswers {
  // Sheets & Materials
  nightHeat?: NightHeat
  skinType?: SkinType
  careLevel?: CareLevel
  sensoryPref?: SensoryPref
  // Comforter
  comforterTemp?: ComforterTemp
  comforterFeel?: ComforterFeel
  breathingIssues?: BreathingIssues
  // Pillows
  sleepPosition?: SleepPosition
  shoulderWidth?: ShoulderWidth
  pillowFeel?: PillowFeel
  pillowPriority?: PillowPriority
}

// ---- Engine Types ----

export interface ScoreReason {
  reason: string
  points: number
}

export interface ScoredSheet {
  product: SheetProduct
  score: number
  scoreBreakdown: ScoreReason[]
}

export interface ScoredPillow {
  product: PillowProduct
  score: number
  scoreBreakdown: ScoreReason[]
}

export interface ScoredComforter {
  product: ComforterProduct
  score: number
  scoreBreakdown: ScoreReason[]
}

export interface RecommendationResult {
  topSheet: ScoredSheet
  topPillow: ScoredPillow
  topComforter: ScoredComforter
  allSheets: ScoredSheet[]
  whyText: string
  bundleSuggestion: string
}

// ---- Quiz UI Types ----

export interface IconOption<T extends string = string> {
  value: T
  label: string
  icon: ReactNode
  sublabel?: string
}

export interface QuestionConfig {
  id: keyof QuizAnswers
  question: string
  options: IconOption[]
  columns: 2 | 3 | 4
  section?: string
}
