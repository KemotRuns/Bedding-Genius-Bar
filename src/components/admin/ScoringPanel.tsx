import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../../lib/supabase'

interface RuleRow {
  id: string
  question_key: string; answer_value: string
  target_category: string; attribute_path: string
  operator: string; compare_value: string; points: number
  reason: string | null; reason_zh: string | null
  also_question_key: string | null; also_answer_value: string | null
  active: boolean
}
type RuleDraft = Omit<RuleRow, 'id' | 'reason' | 'reason_zh' | 'also_question_key' | 'also_answer_value'> & {
  id?: string; reason: string; reason_zh: string; also_question_key: string; also_answer_value: string
}

const OPERATORS = ['eq', 'neq', 'gte', 'lte', 'gt', 'lt']
const CATEGORIES = ['sheet', 'comforter', 'pillow']
const inputCls = 'w-full px-3 py-2 rounded-lg bg-white/70 border border-charcoal/12 text-sm text-charcoal outline-none focus:border-gold transition-colors'

const blank = (): RuleDraft => ({
  question_key: '', answer_value: '', target_category: 'sheet', attribute_path: '',
  operator: 'eq', compare_value: '', points: 0, reason: '', reason_zh: '',
  also_question_key: '', also_answer_value: '', active: true,
})

export default function ScoringPanel() {
  const [rows, setRows] = useState<RuleRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [cat, setCat] = useState<'all' | string>('all')
  const [keyFilter, setKeyFilter] = useState('all')
  const [draft, setDraft] = useState<RuleDraft | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      if (!supabase) return
      const { data, error } = await supabase.from('scoring_rules').select('*').order('question_key').order('answer_value')
      if (cancelled) return
      if (error) setError(error.message)
      else { setError(''); setRows((data ?? []) as RuleRow[]) }
      setLoading(false)
    })()
    return () => { cancelled = true }
  }, [])

  async function reload() {
    if (!supabase) return
    setLoading(true)
    const { data, error } = await supabase.from('scoring_rules').select('*').order('question_key').order('answer_value')
    if (error) setError(error.message)
    else { setError(''); setRows((data ?? []) as RuleRow[]) }
    setLoading(false)
  }

  const keys = useMemo(() => Array.from(new Set(rows.map(r => r.question_key))).sort(), [rows])
  const filtered = useMemo(() => rows.filter(r =>
    (cat === 'all' || r.target_category === cat) && (keyFilter === 'all' || r.question_key === keyFilter),
  ), [rows, cat, keyFilter])

  function edit(r: RuleRow) {
    setError('')
    setDraft({
      id: r.id, question_key: r.question_key, answer_value: r.answer_value,
      target_category: r.target_category, attribute_path: r.attribute_path,
      operator: r.operator, compare_value: r.compare_value, points: r.points,
      reason: r.reason ?? '', reason_zh: r.reason_zh ?? '',
      also_question_key: r.also_question_key ?? '', also_answer_value: r.also_answer_value ?? '',
      active: r.active,
    })
  }

  async function save() {
    if (!supabase || !draft) return
    if (!draft.question_key.trim() || !draft.answer_value.trim() || !draft.attribute_path.trim() || !draft.compare_value.trim()) {
      setError('Question key, answer value, attribute path and compare value are required.'); return
    }
    setSaving(true); setError('')
    const payload = {
      question_key: draft.question_key.trim(), answer_value: draft.answer_value.trim(),
      target_category: draft.target_category, attribute_path: draft.attribute_path.trim(),
      operator: draft.operator, compare_value: draft.compare_value.trim(), points: Number(draft.points) || 0,
      reason: draft.reason.trim() || null, reason_zh: draft.reason_zh.trim() || null,
      also_question_key: draft.also_question_key.trim() || null,
      also_answer_value: draft.also_answer_value.trim() || null,
      active: draft.active,
    }
    const res = draft.id
      ? await supabase.from('scoring_rules').update(payload).eq('id', draft.id)
      : await supabase.from('scoring_rules').insert(payload)
    setSaving(false)
    if (res.error) { setError(res.error.message); return }
    setDraft(null)
    await reload()
  }

  async function remove(r: RuleRow) {
    if (!supabase) return
    if (!confirm('Delete this scoring rule?')) return
    const { error } = await supabase.from('scoring_rules').delete().eq('id', r.id)
    if (error) { alert(error.message); return }
    setRows(prev => prev.filter(x => x.id !== r.id))
  }

  async function toggleActive(r: RuleRow) {
    if (!supabase) return
    const { error } = await supabase.from('scoring_rules').update({ active: !r.active }).eq('id', r.id)
    if (error) { alert(error.message); return }
    setRows(prev => prev.map(x => x.id === r.id ? { ...x, active: !x.active } : x))
  }

  // ── Editor ──
  if (draft) {
    const set = <K extends keyof RuleDraft>(k: K, v: RuleDraft[K]) => setDraft(d => d ? { ...d, [k]: v } : d)
    return (
      <div className="max-w-2xl">
        <button onClick={() => setDraft(null)} className="text-sm text-charcoal/50 hover:text-charcoal mb-4 cursor-pointer">← Back to rules</button>
        <h2 className="font-serif text-2xl text-charcoal mb-2">{draft.id ? 'Edit rule' : 'New rule'}</h2>
        <p className="text-xs text-charcoal/45 mb-6 leading-relaxed">
          When a user answers <strong>{draft.question_key || 'question'}</strong> = <strong>{draft.answer_value || 'value'}</strong>, and a
          {' '}<strong>{draft.target_category}</strong>’s <strong>{draft.attribute_path || 'attribute'}</strong> {draft.operator} <strong>{draft.compare_value || '…'}</strong>, add <strong>{draft.points}</strong> points.
        </p>
        {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Question key *"><input className={inputCls} value={draft.question_key} onChange={e => set('question_key', e.target.value)} /></Field>
          <Field label="Answer value *"><input className={inputCls} value={draft.answer_value} onChange={e => set('answer_value', e.target.value)} /></Field>
          <Field label="Target category">
            <select className={inputCls} value={draft.target_category} onChange={e => set('target_category', e.target.value)}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Points"><input type="number" className={inputCls} value={draft.points} onChange={e => set('points', Number(e.target.value))} /></Field>
          <Field label="Attribute path * (e.g. attributes.temperature, material, ratings.breathability)"><input className={inputCls} value={draft.attribute_path} onChange={e => set('attribute_path', e.target.value)} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Operator">
              <select className={inputCls} value={draft.operator} onChange={e => set('operator', e.target.value)}>
                {OPERATORS.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </Field>
            <Field label="Compare value *"><input className={inputCls} value={draft.compare_value} onChange={e => set('compare_value', e.target.value)} /></Field>
          </div>
        </div>

        <p className="text-xs font-semibold uppercase tracking-wider text-charcoal/40 mt-6 mb-2">Optional 2nd condition</p>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Also question key"><input className={inputCls} value={draft.also_question_key} onChange={e => set('also_question_key', e.target.value)} placeholder="e.g. shoulderWidth" /></Field>
          <Field label="Also answer value"><input className={inputCls} value={draft.also_answer_value} onChange={e => set('also_answer_value', e.target.value)} placeholder="e.g. Broad" /></Field>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mt-4">
          <Field label="Reason (internal)"><input className={inputCls} value={draft.reason} onChange={e => set('reason', e.target.value)} /></Field>
          <Field label="Reason (中)"><input className={inputCls} value={draft.reason_zh} onChange={e => set('reason_zh', e.target.value)} /></Field>
        </div>

        <label className="flex items-center gap-2 text-sm text-charcoal/70 mt-6 cursor-pointer">
          <input type="checkbox" checked={draft.active} onChange={e => set('active', e.target.checked)} /> Active
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
      <div className="flex flex-wrap items-center gap-2 mb-5">
        {(['all', ...CATEGORIES] as const).map(c => (
          <button key={c} onClick={() => setCat(c)}
            className={`text-sm px-4 py-2 rounded-full border transition-colors cursor-pointer ${cat === c ? 'bg-charcoal text-cream border-charcoal' : 'border-charcoal/15 text-charcoal/60 hover:bg-white/60'}`}>
            {c === 'all' ? 'All' : c}
          </button>
        ))}
        <select className="text-sm px-3 py-2 rounded-xl border border-charcoal/15 bg-white/70 text-charcoal/70 cursor-pointer" value={keyFilter} onChange={e => setKeyFilter(e.target.value)}>
          <option value="all">All questions</option>
          {keys.map(k => <option key={k} value={k}>{k}</option>)}
        </select>
        <div className="flex-1" />
        <span className="text-sm text-charcoal/40">{filtered.length} rules</span>
        <button onClick={() => { setError(''); setDraft(blank()) }} className="text-sm px-4 py-2 rounded-xl bg-charcoal text-cream hover:bg-charcoal/85 cursor-pointer">+ Add rule</button>
      </div>

      {loading ? <p className="text-charcoal/40 text-sm py-12 text-center">Loading…</p>
        : error ? <p className="text-red-500 text-sm py-12 text-center">{error}</p>
        : (
          <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[11px] uppercase tracking-wider text-charcoal/40 border-b border-charcoal/10">
                    <th className="px-4 py-3 font-semibold">When</th>
                    <th className="px-4 py-3 font-semibold">Target</th>
                    <th className="px-4 py-3 font-semibold">Condition</th>
                    <th className="px-4 py-3 font-semibold text-right">Pts</th>
                    <th className="px-4 py-3 font-semibold">Active</th>
                    <th className="px-4 py-3 font-semibold text-right"></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(r => (
                    <tr key={r.id} className="border-b border-charcoal/6 hover:bg-white/40">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="font-mono text-xs text-charcoal/70">{r.question_key}=<span className="text-charcoal">{r.answer_value}</span></span>
                        {r.also_question_key && <span className="font-mono text-xs text-charcoal/40"> & {r.also_question_key}={r.also_answer_value}</span>}
                      </td>
                      <td className="px-4 py-3 text-charcoal/50">{r.target_category}</td>
                      <td className="px-4 py-3 font-mono text-xs text-charcoal/60">{r.attribute_path} {r.operator} {r.compare_value}</td>
                      <td className={`px-4 py-3 text-right font-semibold ${r.points >= 0 ? 'text-sage-dark' : 'text-red-400'}`}>{r.points >= 0 ? '+' : ''}{r.points}</td>
                      <td className="px-4 py-3">
                        <button onClick={() => toggleActive(r)} className={`text-xs px-2 py-1 rounded-full cursor-pointer ${r.active ? 'bg-sage/15 text-sage-dark' : 'bg-charcoal/8 text-charcoal/40'}`}>{r.active ? 'On' : 'Off'}</button>
                      </td>
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <button onClick={() => edit(r)} className="text-xs text-charcoal/50 hover:text-charcoal cursor-pointer mr-3">Edit</button>
                        <button onClick={() => remove(r)} className="text-xs text-red-400 hover:text-red-600 cursor-pointer">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
