import type { QuizAnswers, ProductCategory } from './types'
import { getRecommendation, CATEGORY_QUESTIONS } from './engine'
import type { Catalog } from './engine'
import { supabase, isSupabaseConfigured } from './supabase'

// ── Storage keys ──────────────────────────────────────────────────────────────
const SESSIONS_KEY = 'tn_sessions'       // full local history of finalized sessions
const QUEUE_KEY    = 'tn_capture_queue'  // sessions awaiting delivery

// Legacy Google Apps Script endpoint (empty → Supabase or local-only).
const ENDPOINT = (import.meta.env.VITE_CAPTURE_ENDPOINT as string | undefined)?.trim() || ''

// ── Section completeness ──────────────────────────────────────────────────────
const SECTION_CATEGORY: Record<string, ProductCategory> = { sheets: 'sheet', comforter: 'comforter', pillow: 'pillow' }

export function isSectionComplete(section: string, answers: QuizAnswers): boolean {
  const cat = SECTION_CATEGORY[section]
  if (!cat) return false
  return CATEGORY_QUESTIONS[cat].every(k => Boolean(answers[k]))
}

export function completedSections(answers: QuizAnswers): string[] {
  return Object.keys(SECTION_CATEGORY).filter(s => isSectionComplete(s, answers))
}

// ── Session type ──────────────────────────────────────────────────────────────
export interface RecommendedItem { id: string; name: string; name_zh: string; url: string }

export interface CapturedSession {
  id: string
  createdAt: string
  name: string
  email?: string
  lang: string
  answers: QuizAnswers
  completedSections: string[]
  recommendation: {
    sheet?: RecommendedItem
    comforter?: RecommendedItem
    pillow?: RecommendedItem
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function uid(): string {
  return 'tn-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8)
}
function read<T>(key: string, fallback: T): T {
  try { const raw = localStorage.getItem(key); return raw ? (JSON.parse(raw) as T) : fallback } catch { return fallback }
}
function write(key: string, value: unknown): void {
  try { localStorage.setItem(key, JSON.stringify(value)) } catch { /* storage unavailable */ }
}

// ── Build / save ──────────────────────────────────────────────────────────────
export function buildSession(input: { name: string; email?: string; lang: string; answers: QuizAnswers; catalog?: Catalog }): CapturedSession {
  const rec = getRecommendation(input.answers, input.catalog)
  const done = completedSections(input.answers)
  const pick = (list: typeof rec.sheets): RecommendedItem | undefined => {
    const top = list[0]
    return top ? { id: top.product.id, name: top.product.name_en, name_zh: top.product.name_zh, url: top.product.url } : undefined
  }
  return {
    id: uid(),
    createdAt: new Date().toISOString(),
    name: input.name.trim(),
    email: input.email?.trim() || undefined,
    lang: input.lang,
    answers: input.answers,
    completedSections: done,
    recommendation: {
      sheet:     done.includes('sheets')    ? pick(rec.sheets)     : undefined,
      comforter: done.includes('comforter') ? pick(rec.comforters) : undefined,
      pillow:    done.includes('pillow')    ? pick(rec.pillows)    : undefined,
    },
  }
}

export function saveSession(session: CapturedSession): void {
  const all = read<CapturedSession[]>(SESSIONS_KEY, [])
  all.push(session); write(SESSIONS_KEY, all)
  const queue = read<CapturedSession[]>(QUEUE_KEY, [])
  queue.push(session); write(QUEUE_KEY, queue)
  void flushQueue()
}

export function getSessions(): CapturedSession[] {
  return read<CapturedSession[]>(SESSIONS_KEY, [])
}

// ── Remote delivery (with offline retry queue) ────────────────────────────────
async function deliver(session: CapturedSession): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from('responses').insert({
      created_at: session.createdAt,
      name: session.name,
      email: session.email ?? null,
      lang: session.lang,
      answers: session.answers,
      completed_sections: session.completedSections,
      recommendation: session.recommendation,
    })
    return !error
  }
  if (ENDPOINT) {
    try {
      await fetch(ENDPOINT, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(session) })
      return true
    } catch { return false }
  }
  return false
}

export async function flushQueue(): Promise<void> {
  if (!isSupabaseConfigured && !ENDPOINT) return
  const queue = read<CapturedSession[]>(QUEUE_KEY, [])
  if (queue.length === 0) return
  const remaining: CapturedSession[] = []
  for (const session of queue) {
    const ok = await deliver(session).catch(() => false)
    if (!ok) remaining.push(session)
  }
  write(QUEUE_KEY, remaining)
}
