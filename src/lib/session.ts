import type { QuizAnswers } from './types'
import { getRecommendation } from './engine'

// ── Storage keys ──────────────────────────────────────────────────────────────
const SESSIONS_KEY = 'tn_sessions'       // full local history of finalized sessions
const QUEUE_KEY    = 'tn_capture_queue'  // sessions awaiting POST to the remote endpoint

// Remote endpoint (Google Apps Script Web App URL). Empty → local-only capture.
const ENDPOINT = (import.meta.env.VITE_CAPTURE_ENDPOINT as string | undefined)?.trim() || ''

// ── Section completeness ──────────────────────────────────────────────────────
const SECTION_KEYS: Record<string, (keyof QuizAnswers)[]> = {
  sheets:    ['nightHeat', 'skinType', 'careLevel', 'sensoryPref'],
  comforter: ['comforterTemp', 'comforterFeel', 'breathingIssues'],
  pillow:    ['sleepPosition', 'shoulderWidth', 'pillowFeel', 'pillowPriority'],
}

export function isSectionComplete(product: string, answers: QuizAnswers): boolean {
  const keys = SECTION_KEYS[product]
  if (!keys) return false
  return keys.every(k => Boolean(answers[k]))
}

export function completedSections(answers: QuizAnswers): string[] {
  return Object.keys(SECTION_KEYS).filter(s => isSectionComplete(s, answers))
}

// ── Session type ──────────────────────────────────────────────────────────────
export interface CapturedSession {
  id: string
  createdAt: string
  name: string
  email?: string
  lang: string
  answers: QuizAnswers
  completedSections: string[]
  recommendation: {
    sheet: string
    sheetSku?: string
    comforter: string
    comforterSku?: string
    pillow: string
    pillowSku?: string
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function uid(): string {
  return 'tn-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8)
}

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function write(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* storage full or unavailable — fail silently */
  }
}

// ── Build / save ──────────────────────────────────────────────────────────────
export function buildSession(input: {
  name: string
  email?: string
  lang: string
  answers: QuizAnswers
}): CapturedSession {
  const rec = getRecommendation(input.answers)
  return {
    id: uid(),
    createdAt: new Date().toISOString(),
    name: input.name.trim(),
    email: input.email?.trim() || undefined,
    lang: input.lang,
    answers: input.answers,
    completedSections: completedSections(input.answers),
    recommendation: {
      sheet: rec.topSheet.product.name,
      sheetSku: rec.topSheet.product.sku,
      comforter: rec.topComforter.product.name,
      comforterSku: rec.topComforter.product.sku,
      pillow: rec.topPillow.product.name,
      pillowSku: rec.topPillow.product.sku,
    },
  }
}

export function saveSession(session: CapturedSession): void {
  const all = read<CapturedSession[]>(SESSIONS_KEY, [])
  all.push(session)
  write(SESSIONS_KEY, all)

  const queue = read<CapturedSession[]>(QUEUE_KEY, [])
  queue.push(session)
  write(QUEUE_KEY, queue)

  void flushQueue()
}

export function getSessions(): CapturedSession[] {
  return read<CapturedSession[]>(SESSIONS_KEY, [])
}

// ── Remote flush (with offline retry queue) ───────────────────────────────────
export async function flushQueue(): Promise<void> {
  if (!ENDPOINT) return
  const queue = read<CapturedSession[]>(QUEUE_KEY, [])
  if (queue.length === 0) return

  const remaining: CapturedSession[] = []
  for (const session of queue) {
    try {
      // text/plain avoids a CORS preflight; no-cors lets the request reach the
      // Apps Script endpoint (which doesn't return CORS headers) without the
      // browser rejecting the opaque response.
      await fetch(ENDPOINT, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(session),
      })
    } catch {
      remaining.push(session) // offline / network error → retry next time
    }
  }
  write(QUEUE_KEY, remaining)
}
