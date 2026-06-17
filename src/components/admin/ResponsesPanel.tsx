import { Fragment, useEffect, useMemo, useState } from 'react'
import { supabase } from '../../lib/supabase'

interface ResponseRow {
  id: string
  created_at: string
  name: string | null
  email: string | null
  lang: string | null
  answers: Record<string, string>
  completed_sections: string[]
  recommendation: { sheet?: string; comforter?: string; pillow?: string }
}

const ANSWER_KEYS = [
  'nightHeat', 'skinType', 'careLevel', 'sensoryPref',
  'comforterTemp', 'comforterFeel', 'breathingIssues',
  'sleepPosition', 'shoulderWidth', 'pillowFeel', 'pillowPriority',
]

function csvCell(v: unknown): string {
  const s = v == null ? '' : String(v)
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

function toCsv(rows: ResponseRow[]): string {
  const header = ['created_at', 'name', 'email', 'lang', 'completed_sections', 'sheet', 'comforter', 'pillow', ...ANSWER_KEYS]
  const lines = rows.map(r => [
    r.created_at, r.name ?? '', r.email ?? '', r.lang ?? '',
    (r.completed_sections ?? []).join(' | '),
    r.recommendation?.sheet ?? '', r.recommendation?.comforter ?? '', r.recommendation?.pillow ?? '',
    ...ANSWER_KEYS.map(k => r.answers?.[k] ?? ''),
  ].map(csvCell).join(','))
  return [header.join(','), ...lines].join('\n')
}

export default function ResponsesPanel() {
  const [rows, setRows] = useState<ResponseRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [emailOnly, setEmailOnly] = useState(false)
  const [expanded, setExpanded] = useState<string | null>(null)

  // Awaits first, so no setState runs synchronously inside the mount effect.
  async function load() {
    if (!supabase) return
    const { data, error } = await supabase
      .from('responses')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) setError(error.message)
    else { setError(''); setRows((data ?? []) as ResponseRow[]) }
    setLoading(false)
  }

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      if (!supabase) return
      const { data, error } = await supabase
        .from('responses')
        .select('*')
        .order('created_at', { ascending: false })
      if (cancelled) return
      if (error) setError(error.message)
      else { setError(''); setRows((data ?? []) as ResponseRow[]) }
      setLoading(false)
    })()
    return () => { cancelled = true }
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return rows.filter(r => {
      if (emailOnly && !r.email) return false
      if (!q) return true
      return (r.name ?? '').toLowerCase().includes(q) || (r.email ?? '').toLowerCase().includes(q)
    })
  }, [rows, query, emailOnly])

  async function handleDelete(id: string) {
    if (!supabase) return
    if (!confirm('Delete this response permanently?')) return
    const { error } = await supabase.from('responses').delete().eq('id', id)
    if (error) { alert(error.message); return }
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
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search name or email…"
            className="flex-1 min-w-[200px] px-4 py-2.5 rounded-xl bg-white/70 border border-charcoal/12 text-sm text-charcoal outline-none focus:border-gold transition-colors"
          />
          <label className="flex items-center gap-2 text-sm text-charcoal/60 cursor-pointer select-none">
            <input type="checkbox" checked={emailOnly} onChange={e => setEmailOnly(e.target.checked)} />
            Has email
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
                    <th className="px-4 py-3 font-semibold">Name</th>
                    <th className="px-4 py-3 font-semibold">Email</th>
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
                        <td className="px-4 py-3 text-charcoal font-medium">{r.name || '—'}</td>
                        <td className="px-4 py-3 text-charcoal/60">{r.email || '—'}</td>
                        <td className="px-4 py-3 text-charcoal/50">{(r.completed_sections ?? []).join(', ') || '—'}</td>
                        <td className="px-4 py-3 text-charcoal/60">
                          <span className="text-xs">{[r.recommendation?.sheet, r.recommendation?.comforter, r.recommendation?.pillow].filter(Boolean).join(' · ') || '—'}</span>
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
