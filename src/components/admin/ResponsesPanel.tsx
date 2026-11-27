import { Fragment, useEffect, useMemo, useState } from 'react'
import { collection, deleteDoc, doc, getDocs, orderBy, query as fsQuery } from 'firebase/firestore'
import { db } from '../../lib/firebase'

interface ResponseRow {
  id: string
  created_at: string
  visit_id?: string | null
  downloaded?: boolean
  /** Every database document behind this row (a visit can write several snapshots). */
  docIds: string[]
  lang: string | null
  answers: Record<string, string>
  completed_sections: string[]
  recommendation: { sheet?: Rec | string; comforter?: Rec | string; pillow?: Rec | string }
}
type Rec = { id: string; name: string; name_zh: string; url: string }
const recName = (r?: Rec | string) => (typeof r === 'string' ? r : r?.name_zh ?? '')

const ANSWER_KEYS = [
  'nightHeat', 'skinType', 'careLevel', 'sensoryPref', 'designStyle',
  'comforterTemp', 'comforterFeel', 'comforterAllergy', 'comforterScent', 'comforterUse',
  'sleepPosition', 'pillowFeel', 'shoulderWidth', 'pillowAllergy', 'pillowTier',
]

function csvCell(v: unknown): string {
  const s = v == null ? '' : String(v)
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

/**
 * The kiosk writes a new snapshot whenever a visit changes (more sections done,
 * edited answers, PDF taken). Show one row per visit: its latest snapshot, marked
 * as downloaded if any snapshot was. Rows saved before visit ids existed stand alone.
 * Expects rows newest first.
 */
function collapseVisits(rows: ResponseRow[]): ResponseRow[] {
  const byVisit = new Map<string, ResponseRow>()
  const out: ResponseRow[] = []
  for (const r of rows) {
    const seen = r.visit_id ? byVisit.get(r.visit_id) : undefined
    if (seen) {
      seen.docIds.push(...r.docIds)
      seen.downloaded = Boolean(seen.downloaded || r.downloaded)
      continue
    }
    const row = { ...r, docIds: [...r.docIds] }
    if (r.visit_id) byVisit.set(r.visit_id, row)
    out.push(row)
  }
  return out
}

function toCsv(rows: ResponseRow[]): string {
  const header = ['created_at', 'lang', 'downloaded_pdf', 'completed_sections', 'sheet', 'comforter', 'pillow', ...ANSWER_KEYS]
  const lines = rows.map(r => [
    r.created_at, r.lang ?? '', r.downloaded ? 'yes' : 'no',
    (r.completed_sections ?? []).join(' | '),
    recName(r.recommendation?.sheet), recName(r.recommendation?.comforter), recName(r.recommendation?.pillow),
    ...ANSWER_KEYS.map(k => r.answers?.[k] ?? ''),
  ].map(csvCell).join(','))
  return [header.join(','), ...lines].join('\n')
}

export default function ResponsesPanel() {
  const [rows, setRows] = useState<ResponseRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [downloadedOnly, setDownloadedOnly] = useState(false)
  const [expanded, setExpanded] = useState<string | null>(null)

  // Awaits first, so no setState runs synchronously inside the mount effect.
  async function fetchRows(): Promise<ResponseRow[]> {
    if (!db) return []
    const snap = await getDocs(fsQuery(collection(db, 'responses'), orderBy('created_at', 'desc')))
    return collapseVisits(snap.docs.map(d => ({ ...(d.data() as Omit<ResponseRow, 'id' | 'docIds'>), id: d.id, docIds: [d.id] })))
  }
  async function load() {
    try { setRows(await fetchRows()); setError('') } catch (e) { setError((e as Error).message) }
    setLoading(false)
  }

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const r = await fetchRows()
        if (cancelled) return
        setRows(r); setError('')
      } catch (e) { if (!cancelled) setError((e as Error).message) }
      if (!cancelled) setLoading(false)
    })()
    return () => { cancelled = true }
  }, [])

  const filtered = useMemo(() => rows.filter(r => !downloadedOnly || r.downloaded), [rows, downloadedOnly])
  const downloadedCount = useMemo(() => rows.filter(r => r.downloaded).length, [rows])

  async function handleDelete(id: string) {
    if (!db) return
    if (!confirm('Delete this response permanently?')) return
    const row = rows.find(r => r.id === id)
    try { for (const docId of row?.docIds ?? [id]) await deleteDoc(doc(db, 'responses', docId)) } catch (e) { alert((e as Error).message); return }
    setRows(prev => prev.filter(r => r.id !== id))
  }

  function handleExport() {
    const blob = new Blob([toCsv(filtered)], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `tn-select-responses-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const fmtDate = (s: string) => new Date(s).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })

  return (
    <>
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <p className="flex-1 min-w-[200px] text-sm text-charcoal/60">
            {loading ? '' : `${rows.length} response${rows.length === 1 ? '' : 's'} · ${downloadedCount} downloaded the PDF`}
          </p>
          <label className="flex items-center gap-2 text-sm text-charcoal/60 cursor-pointer select-none">
            <input type="checkbox" checked={downloadedOnly} onChange={e => setDownloadedOnly(e.target.checked)} />
            Downloaded PDF only
          </label>
          <button onClick={() => { setLoading(true); void load() }} className="text-sm px-4 py-2.5 rounded-xl border border-charcoal/15 text-charcoal/70 hover:bg-white/60 transition-colors cursor-pointer">Refresh</button>
          <button onClick={handleExport} disabled={filtered.length === 0} className="text-sm px-4 py-2.5 rounded-xl bg-charcoal text-cream hover:bg-charcoal/85 transition-colors disabled:opacity-40 cursor-pointer">Export CSV ({filtered.length})</button>
        </div>

        {loading ? (
          <p className="text-charcoal/40 text-sm py-12 text-center">Loading…</p>
        ) : error ? (
          <p className="text-red-500 text-sm py-12 text-center">{error}</p>
        ) : filtered.length === 0 ? (
          <p className="text-charcoal/40 text-sm py-12 text-center">No responses{rows.length > 0 ? ' match your filter' : ' yet'}.</p>
        ) : (
          <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[11px] uppercase tracking-wider text-charcoal/40 border-b border-charcoal/10">
                    <th className="px-4 py-3 font-semibold">Date</th>
                    <th className="px-4 py-3 font-semibold">Language</th>
                    <th className="px-4 py-3 font-semibold">PDF</th>
                    <th className="px-4 py-3 font-semibold">Sections</th>
                    <th className="px-4 py-3 font-semibold">Recommendation</th>
                    <th className="px-4 py-3 font-semibold"></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(r => (
                    <Fragment key={r.id}>
                      <tr className="border-b border-charcoal/6 hover:bg-white/40">
                        <td className="px-4 py-3 text-charcoal/60 whitespace-nowrap">{fmtDate(r.created_at)}</td>
                        <td className="px-4 py-3 text-charcoal/60">{r.lang === 'zh' ? '中文' : r.lang === 'en' ? 'English' : '—'}</td>
                        <td className="px-4 py-3 text-charcoal/60">{r.downloaded ? 'Downloaded' : '—'}</td>
                        <td className="px-4 py-3 text-charcoal/50">{(r.completed_sections ?? []).join(', ') || '—'}</td>
                        <td className="px-4 py-3 text-charcoal/60">
                          <span className="text-xs">{[recName(r.recommendation?.sheet), recName(r.recommendation?.comforter), recName(r.recommendation?.pillow)].filter(Boolean).join(' · ') || '—'}</span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-right">
                          <button onClick={() => setExpanded(expanded === r.id ? null : r.id)} className="text-xs text-charcoal/45 hover:text-charcoal cursor-pointer mr-3">
                            {expanded === r.id ? 'Hide' : 'Answers'}
                          </button>
                          <button onClick={() => handleDelete(r.id)} className="text-xs text-red-400 hover:text-red-600 cursor-pointer">Delete</button>
                        </td>
                      </tr>
                      {expanded === r.id && (
                        <tr className="bg-white/30 border-b border-charcoal/6">
                          <td colSpan={6} className="px-4 py-3">
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-1.5">
                              {ANSWER_KEYS.map(k => (
                                <div key={k} className="text-xs">
                                  <span className="text-charcoal/40">{k}: </span>
                                  <span className="text-charcoal/75">{r.answers?.[k] ?? '—'}</span>
                                </div>
                              ))}
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
    </>
  )
}
