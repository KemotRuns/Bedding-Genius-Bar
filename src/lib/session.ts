import type { QuizAnswers, ProductCategory } from './types'
import { getRecommendation, pickTiers, CATEGORY_QUESTIONS } from './engine'
import type { Catalog } from './engine'
import { addDoc, collection } from 'firebase/firestore'
import { db, isFirebaseConfigured } from './firebase'

// ── Storage keys ──────────────────────────────────────────────────────────────
const QUEUE_KEY    = 'tn_capture_queue'  // localStorage: responses awaiting delivery
const VISIT_KEY    = 'tn_visit'          // sessionStorage: id of the current visit
const RECORDED_KEY = 'tn_recorded'       // sessionStorage: signature of the last response written
const DOWNLOAD_KEY = 'tn_downloaded'     // sessionStorage: this visit took the PDF

// Legacy Google Apps Script endpoint (empty → Firestore or local-only).
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

// ── Response type ─────────────────────────────────────────────────────────────
export interface RecommendedItem { id: string; name: string; name_zh: string; url: string }

/** One anonymous snapshot of a visit. No name, email or other personal data. */
export interface CapturedSession {
  id: string
  visitId: string
  createdAt: string
  lang: string
  downloaded: boolean
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
const visitGet = (key: string): string | null => { try { return sessionStorage.getItem(key) } catch { return null } }
const visitSet = (key: string, value: string): void => { try { sessionStorage.setItem(key, value) } catch { /* ignore */ } }

// ── Record ────────────────────────────────────────────────────────────────────
/**
 * Record the current visit for analysis. The database is append-only (responses
 * are never updated), so each meaningful change (more sections finished, edited
 * answers, PDF taken) writes a new snapshot carrying the same visit id; the
 * admin panel shows the latest snapshot per visit. Calling this again with
 * nothing new is a no-op.
 */
export function recordVisit(input: { lang: string; answers: QuizAnswers; catalog?: Catalog; downloaded?: boolean }): void {
  const done = completedSections(input.answers)
  if (done.length === 0) return
  if (input.downloaded) visitSet(DOWNLOAD_KEY, '1')
  const downloaded = visitGet(DOWNLOAD_KEY) === '1'
  const signature = JSON.stringify([input.answers, downloaded])
  if (visitGet(RECORDED_KEY) === signature) return
  let visitId = visitGet(VISIT_KEY)
  if (!visitId) { visitId = uid(); visitSet(VISIT_KEY, visitId) }
  visitSet(RECORDED_KEY, signature)

  const rec = getRecommendation(input.answers, input.catalog)
  const pick = (list: typeof rec.sheets): RecommendedItem | undefined => {
    const top = pickTiers(list)?.primary
    return top ? { id: top.product.id, name: top.product.name_en, name_zh: top.product.name_zh, url: top.product.url } : undefined
  }
  const session: CapturedSession = {
    id: uid(),
    visitId,
    createdAt: new Date().toISOString(),
    lang: input.lang,
    downloaded,
    answers: input.answers,
    completedSections: done,
    recommendation: {
      sheet:     done.includes('sheets')    ? pick(rec.sheets)     : undefined,
      comforter: done.includes('comforter') ? pick(rec.comforters) : undefined,
      pillow:    done.includes('pillow')    ? pick(rec.pillows)    : undefined,
    },
  }
  const queue = read<CapturedSession[]>(QUEUE_KEY, [])
  queue.push(session); write(QUEUE_KEY, queue)
  void flushQueue()
}

/** "Start over": the next person on this device is a new visit. */
export function endVisit(): void {
  try { [VISIT_KEY, RECORDED_KEY, DOWNLOAD_KEY].forEach(k => sessionStorage.removeItem(k)) } catch { /* ignore */ }
}

// ── Remote delivery (with offline retry queue) ────────────────────────────────
async function deliver(session: CapturedSession): Promise<boolean> {
  if (isFirebaseConfigured && db) {
    try {
      await addDoc(collection(db, 'responses'), {
        created_at: session.createdAt,
        visit_id: session.visitId ?? null,
        downloaded: session.downloaded ?? false,
        lang: session.lang,
        answers: session.answers,
        completed_sections: session.completedSections,
        recommendation: session.recommendation,
      })
      return true
    } catch { return false }
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
  if (!isFirebaseConfigured && !ENDPOINT) return
  const queue = read<CapturedSession[]>(QUEUE_KEY, [])
  if (queue.length === 0) return
  const remaining: CapturedSession[] = []
  for (const session of queue) {
    const ok = await deliver(session).catch(() => false)
    if (!ok) remaining.push(session)
  }
  write(QUEUE_KEY, remaining)
}
