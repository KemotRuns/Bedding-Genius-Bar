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
  fill: 'Down' | 'Memory Foam' | 'Latex' | 'Buckwheat'
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

// ---- Quiz Types ----

export type RoomTemp = 'Cold' | 'Moderate' | 'Warm' | 'Hot'
export type SleeperTemp = 'Always Cold' | 'Neutral' | 'Warm' | 'Hot Flash Prone'
export type SleepPosition = 'Side' | 'Back' | 'Stomach' | 'Combination'
export type SkinSensitivity = 'None' | 'Mild' | 'Sensitive' | 'Allergic/Eczema'
export type PetStatus = 'No Pets' | 'Yes — Cats or Dogs'
export type MaintenancePref = 'Low Maintenance' | 'I Launder Frequently'
export type BodyType = 'Petite' | 'Average' | 'Broad'

export interface QuizAnswers {
  roomTemp?: RoomTemp
  sleeperTemp?: SleeperTemp
  sleepPosition?: SleepPosition
  skinSensitivity?: SkinSensitivity
  petStatus?: PetStatus
  maintenancePref?: MaintenancePref
  bodyType?: BodyType
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

export interface RecommendationResult {
  topSheet: ScoredSheet
  topPillow: ScoredPillow
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
}
