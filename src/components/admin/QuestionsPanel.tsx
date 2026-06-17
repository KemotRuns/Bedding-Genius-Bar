import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { ICON_KEYS, getIcon } from '../../lib/icons'

interface OptionRow {
  id: string; question_id: string; value: string
  label: string; label_zh: string | null
  sublabel: string | null; sublabel_zh: string | null
  icon_key: string | null; sort_order: number
}
interface QuestionRow {
  id: string; key: string; section: string
  question: string; question_zh: string | null
  columns: number; sort_order: number; active: boolean
}

interface OptionDraft {
  value: string; label: string; label_zh: string
  sublabel: string; sublabel_zh: string; icon_key: string
}
interface QDraft {
  id?: string; key: string; section: string
  question: string; question_zh: string
  columns: number; sort_order: number; active: boolean
  options: OptionDraft[]
}

const SECTIONS = [
  { value: 'sheets', label: 'Sheets & Bedding' },
  { value: 'comforter', label: 'Comforter' },
  { value: 'pillow', label: 'Pillow' },
]
const SECTION_LABEL: Record<string, string> = { sheets: 'Sheets', comforter: 'Comforter', pillow: 'Pillow' }

const blankOption = (): OptionDraft => ({ value: '', label: '', label_zh: '', sublabel: '', sublabel_zh: '', icon_key: ICON_KEYS[0] })
const blankQuestion = (): QDraft => ({ key: '', section: 'sheets', question: '', question_zh: '', columns: 3, sort_order: 999, active: true, options: [blankOption()] })

const inputCls = 'w-full px-3 py-2 rounded-lg bg-white/70 border border-charcoal/12 text-sm text-charcoal outline-none focus:border-gold transition-colors'

export default function QuestionsPanel() {
  const [questions, setQuestions] = useState<QuestionRow[]>([])
  const [options, setOptions] = useState<OptionRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [draft, setDraft] = useState<QDraft | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      if (!supabase) return
      const [qs, opts] = await Promise.all([
        supabase.from('questions').select('*').order('sort_order'),
        supabase.from('question_options').select('*').order('sort_order'),
      ])
      if (cancelled) return
      if (qs.error || opts.error) setError(qs.error?.message || opts.error?.message || '')
      else { setError(''); setQuestions((qs.data ?? []) as QuestionRow[]); setOptions((opts.data ?? []) as OptionRow[]) }
      setLoading(false)
    })()
    return () => { cancelled = true }
  }, [])

  async function reload() {
    if (!supabase) return
    setLoading(true)
    const [qs, opts] = await Promise.all([
      supabase.from('questions').select('*').order('sort_order'),
      supabase.from('question_options').select('*').order('sort_order'),
    ])
    if (qs.error || opts.error) setError(qs.error?.message || opts.error?.message || '')
    else { setError(''); setQuestions((qs.data ?? []) as QuestionRow[]); setOptions((opts.data ?? []) as OptionRow[]) }
    setLoading(false)
  }

  function editQuestion(q: QuestionRow) {
    const opts = options.filter(o => o.question_id === q.id)
      .map<OptionDraft>(o => ({ value: o.value, label: o.label, label_zh: o.label_zh ?? '', sublabel: o.sublabel ?? '', sublabel_zh: o.sublabel_zh ?? '', icon_key: o.icon_key ?? ICON_KEYS[0] }))
    setError('')
    setDraft({ id: q.id, key: q.key, section: q.section, question: q.question, question_zh: q.question_zh ?? '', columns: q.columns, sort_order: q.sort_order, active: q.active, options: opts.length ? opts : [blankOption()] })
  }

  async function save() {
    if (!supabase || !draft) return
    if (!draft.key.trim() || !draft.question.trim()) { setError('Key and question text are required.'); return }
    if (draft.options.length === 0 || draft.options.some(o => !o.value.trim() || !o.label.trim())) {
      setError('Every option needs a value and a label.'); return
    }
    setSaving(true); setError('')

    const qPayload = {
      key: draft.key.trim(), section: draft.section,
      question: draft.question.trim(), question_zh: draft.question_zh.trim() || null,
      columns: Number(draft.columns) || 3, sort_order: Number(draft.sort_order) || 0, active: draft.active,
    }

    let qid = draft.id
    if (qid) {
      const { error } = await supabase.from('questions').update(qPayload).eq('id', qid)
      if (error) { setSaving(false); setError(error.message); return }
    } else {
      const { data, error } = await supabase.from('questions').insert(qPayload).select('id').single()
      if (error || !data) { setSaving(false); setError(error?.message || 'Insert failed'); return }
      qid = (data as { id: string }).id
    }

    // Replace options wholesale (simple + reliable).
    await supabase.from('question_options').delete().eq('question_id', qid)
    const optPayload = draft.options.map((o, i) => ({
      question_id: qid, value: o.value.trim(), label: o.label.trim(),
      label_zh: o.label_zh.trim() || null, sublabel: o.sublabel.trim() || null,
      sublabel_zh: o.sublabel_zh.trim() || null, icon_key: o.icon_key || null, sort_order: i,
    }))
    const { error: oErr } = await supabase.from('question_options').insert(optPayload)
    setSaving(false)
    if (oErr) { setError(oErr.message); return }
    setDraft(null)
    await reload()
  }

  async function remove(q: QuestionRow) {
    if (!supabase) return
    if (!confirm(`Delete question "${q.key}" and its options?`)) return
    const { error } = await supabase.from('questions').delete().eq('id', q.id) // options cascade
    if (error) { alert(error.message); return }
    setQuestions(prev => prev.filter(x => x.id !== q.id))
  }

  async function toggleActive(q: QuestionRow) {
    if (!supabase) return
    const { error } = await supabase.from('questions').update({ active: !q.active }).eq('id', q.id)
    if (error) { alert(error.message); return }
    setQuestions(prev => prev.map(x => x.id === q.id ? { ...x, active: !x.active } : x))
  }

  // ── Editor ──
  if (draft) {
    const set = <K extends keyof QDraft>(k: K, v: QDraft[K]) => setDraft(d => d ? { ...d, [k]: v } : d)
    const setOpt = (i: number, k: keyof OptionDraft, v: string) =>
      setDraft(d => d ? { ...d, options: d.options.map((o, j) => j === i ? { ...o, [k]: v } : o) } : d)
    const addOpt = () => setDraft(d => d ? { ...d, options: [...d.options, blankOption()] } : d)
    const delOpt = (i: number) => setDraft(d => d ? { ...d, options: d.options.filter((_, j) => j !== i) } : d)
    const move = (i: number, dir: -1 | 1) => setDraft(d => {
      if (!d) return d
      const j = i + dir
      if (j < 0 || j >= d.options.length) return d
      const next = [...d.options];[next[i], next[j]] = [next[j], next[i]]
      return { ...d, options: next }
    })

    return (
      <div className="max-w-3xl">
        <button onClick={() => setDraft(null)} className="text-sm text-charcoal/50 hover:text-charcoal mb-4 cursor-pointer">← Back to questions</button>
        <h2 className="font-serif text-2xl text-charcoal mb-6">{draft.id ? 'Edit question' : 'New question'}</h2>
        {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Key * (matches scoring rules, e.g. nightHeat)"><input className={inputCls} value={draft.key} onChange={e => set('key', e.target.value)} /></Field>
          <Field label="Section">
            <select className={inputCls} value={draft.section} onChange={e => set('section', e.target.value)}>
              {SECTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </Field>
          <Field label="Columns">
            <select className={inputCls} value={draft.columns} onChange={e => set('columns', Number(e.target.value))}>
              {[2, 3, 4].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </Field>
          <Field label="Sort order"><input type="number" className={inputCls} value={draft.sort_order} onChange={e => set('sort_order', Number(e.target.value))} /></Field>
        </div>

        <Field label="Question (EN)" className="mt-4"><textarea className={`${inputCls} min-h-[64px]`} value={draft.question} onChange={e => set('question', e.target.value)} /></Field>
        <Field label="Question (中)" className="mt-4"><textarea className={`${inputCls} min-h-[64px]`} value={draft.question_zh} onChange={e => set('question_zh', e.target.value)} /></Field>

        <div className="flex items-center justify-between mt-6 mb-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-charcoal/40">Options</p>
          <button onClick={addOpt} className="text-xs text-gold hover:text-charcoal cursor-pointer">+ Add option</button>
        </div>

        <div className="space-y-3">
          {draft.options.map((o, i) => (
            <div key={i} className="glass-card p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-lg bg-white/70 border border-charcoal/10 flex items-center justify-center text-charcoal/60 flex-shrink-0">
                  <span className="scale-[0.6]">{getIcon(o.icon_key)}</span>
                </div>
                <select className={inputCls} value={o.icon_key} onChange={e => setOpt(i, 'icon_key', e.target.value)}>
                  {ICON_KEYS.map(k => <option key={k} value={k}>{k}</option>)}
                </select>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={() => move(i, -1)} className="px-2 py-1 text-charcoal/40 hover:text-charcoal cursor-pointer" title="Move up">↑</button>
                  <button onClick={() => move(i, 1)} className="px-2 py-1 text-charcoal/40 hover:text-charcoal cursor-pointer" title="Move down">↓</button>
                  <button onClick={() => delOpt(i)} className="px-2 py-1 text-red-400 hover:text-red-600 cursor-pointer" title="Remove">✕</button>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <Field label="Value * (used by scoring)"><input className={inputCls} value={o.value} onChange={e => setOpt(i, 'value', e.target.value)} /></Field>
                <div />
                <Field label="Label (EN) *"><input className={inputCls} value={o.label} onChange={e => setOpt(i, 'label', e.target.value)} /></Field>
                <Field label="Label (中)"><input className={inputCls} value={o.label_zh} onChange={e => setOpt(i, 'label_zh', e.target.value)} /></Field>
                <Field label="Sublabel (EN)"><input className={inputCls} value={o.sublabel} onChange={e => setOpt(i, 'sublabel', e.target.value)} /></Field>
                <Field label="Sublabel (中)"><input className={inputCls} value={o.sublabel_zh} onChange={e => setOpt(i, 'sublabel_zh', e.target.value)} /></Field>
              </div>
            </div>
          ))}
        </div>

        <label className="flex items-center gap-2 text-sm text-charcoal/70 mt-6 cursor-pointer">
          <input type="checkbox" checked={draft.active} onChange={e => set('active', e.target.checked)} /> Active (shown in the quiz)
        </label>

        <div className="flex items-center gap-3 mt-6">
          <button onClick={save} disabled={saving} className="bg-charcoal text-cream px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-charcoal/85 disabled:opacity-50 cursor-pointer">{saving ? 'Saving…' : 'Save'}</button>
          <button onClick={() => setDraft(null)} className="text-sm text-charcoal/50 hover:text-charcoal cursor-pointer">Cancel</button>
        </div>
      </div>
    )
  }

  // ── List ──
  return (
    <>
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-charcoal/50">{questions.length} questions</p>
        <button onClick={() => { setError(''); setDraft(blankQuestion()) }} className="text-sm px-4 py-2 rounded-xl bg-charcoal text-cream hover:bg-charcoal/85 cursor-pointer">+ Add question</button>
      </div>

      {loading ? <p className="text-charcoal/40 text-sm py-12 text-center">Loading…</p>
        : error ? <p className="text-red-500 text-sm py-12 text-center">{error}</p>
        : (
          <div className="glass-card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-wider text-charcoal/40 border-b border-charcoal/10">
                  <th className="px-4 py-3 font-semibold">#</th>
                  <th className="px-4 py-3 font-semibold">Key</th>
                  <th className="px-4 py-3 font-semibold">Section</th>
                  <th className="px-4 py-3 font-semibold">Question</th>
                  <th className="px-4 py-3 font-semibold">Opts</th>
                  <th className="px-4 py-3 font-semibold">Active</th>
                  <th className="px-4 py-3 font-semibold text-right"></th>
                </tr>
              </thead>
              <tbody>
                {questions.map(q => (
                  <tr key={q.id} className="border-b border-charcoal/6 hover:bg-white/40">
                    <td className="px-4 py-3 text-charcoal/40">{q.sort_order}</td>
                    <td className="px-4 py-3 font-mono text-xs text-charcoal/60">{q.key}</td>
                    <td className="px-4 py-3 text-charcoal/50">{SECTION_LABEL[q.section] ?? q.section}</td>
                    <td className="px-4 py-3 text-charcoal/80 max-w-[320px] truncate">{q.question}</td>
                    <td className="px-4 py-3 text-charcoal/40">{options.filter(o => o.question_id === q.id).length}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => toggleActive(q)} className={`text-xs px-2 py-1 rounded-full cursor-pointer ${q.active ? 'bg-sage/15 text-sage-dark' : 'bg-charcoal/8 text-charcoal/40'}`}>
                        {q.active ? 'Active' : 'Hidden'}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <button onClick={() => editQuestion(q)} className="text-xs text-charcoal/50 hover:text-charcoal cursor-pointer mr-3">Edit</button>
                      <button onClick={() => remove(q)} className="text-xs text-red-400 hover:text-red-600 cursor-pointer">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
    </>
  )
}

function Field({ label, children, className = '' }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={`block ${className}`}>
      <span className="block text-xs font-medium text-charcoal/50 mb-1">{label}</span>
      {children}
    </label>
  )
}
