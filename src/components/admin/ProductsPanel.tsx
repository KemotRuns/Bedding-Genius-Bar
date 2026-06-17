import { Fragment, useEffect, useMemo, useState } from 'react'
import { supabase } from '../../lib/supabase'

interface ProductRow {
  id: string
  category: 'sheet' | 'comforter' | 'pillow'
  code: string
  name: string
  name_zh: string | null
  sku: string | null
  collection: string | null
  material: string | null
  weave: string | null
  thread_count: number | null
  fill: string | null
  description: string | null
  description_zh: string | null
  best_for: string[] | null
  best_for_zh: string[] | null
  attributes: Record<string, unknown>
  ratings: Record<string, number>
  sort_order: number
  active: boolean
}

type Draft = Omit<ProductRow, 'id'> & { id?: string }

const CATEGORIES = ['sheet', 'comforter', 'pillow'] as const
const CAT_LABEL: Record<string, string> = { sheet: 'Sheets', comforter: 'Comforters', pillow: 'Pillows' }

const DEFAULTS: Record<string, Pick<Draft, 'attributes' | 'ratings' | 'material' | 'weave' | 'thread_count' | 'fill'>> = {
  sheet: {
    material: 'Cotton', weave: 'Plain', thread_count: null, fill: null,
    attributes: { temperature: 'Neutral', moisture_wicking: 'Moderate', softness: 'Smooth', durability: 'Medium', hypoallergenic: false, wrinkle_resistance: 'Medium', weave_tightness: 'Medium' },
    ratings: { breathability: 3, wicking: 3, warmth: 3, softness: 3 },
  },
  comforter: {
    material: null, weave: null, thread_count: null, fill: 'Down',
    attributes: { warmth: 'All-Season', temperature: 'Neutral', hypoallergenic: false, washable: false, weight: 'Medium' },
    ratings: { warmth: 3, breathability: 3, fluffiness: 3 },
  },
  pillow: {
    material: null, weave: null, thread_count: null, fill: 'Down',
    attributes: { loft: 'Medium', firmness: 'Medium', hypoallergenic: false, temperature: 'Neutral', adjustable: false },
    ratings: {},
  },
}

function blankDraft(category: 'sheet' | 'comforter' | 'pillow'): Draft {
  return {
    category, code: '', name: '', name_zh: '', sku: '', collection: '',
    description: '', description_zh: '', best_for: [], best_for_zh: [],
    sort_order: 999, active: true,
    ...DEFAULTS[category],
  }
}

const lines = (arr: string[] | null) => (arr ?? []).join('\n')
const toArr = (s: string) => s.split('\n').map(x => x.trim()).filter(Boolean)

export default function ProductsPanel() {
  const [rows, setRows] = useState<ProductRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [cat, setCat] = useState<'all' | 'sheet' | 'comforter' | 'pillow'>('all')
  const [draft, setDraft] = useState<Draft | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      if (!supabase) return
      const { data, error } = await supabase.from('products').select('*').order('category').order('sort_order')
      if (cancelled) return
      if (error) setError(error.message)
      else { setError(''); setRows((data ?? []) as ProductRow[]) }
      setLoading(false)
    })()
    return () => { cancelled = true }
  }, [])

  async function reload() {
    if (!supabase) return
    setLoading(true)
    const { data, error } = await supabase.from('products').select('*').order('category').order('sort_order')
    if (error) setError(error.message)
    else { setError(''); setRows((data ?? []) as ProductRow[]) }
    setLoading(false)
  }

  const filtered = useMemo(() => rows.filter(r => cat === 'all' || r.category === cat), [rows, cat])

  async function save() {
    if (!supabase || !draft) return
    if (!draft.code.trim() || !draft.name.trim()) { setError('Code and name are required.'); return }
    setSaving(true)
    setError('')
    const payload = {
      category: draft.category,
      code: draft.code.trim(),
      name: draft.name.trim(),
      name_zh: draft.name_zh?.trim() || null,
      sku: draft.sku?.trim() || null,
      collection: draft.collection?.trim() || null,
      material: draft.material?.trim() || null,
      weave: draft.weave?.trim() || null,
      thread_count: draft.thread_count ?? null,
      fill: draft.fill?.trim() || null,
      description: draft.description?.trim() || null,
      description_zh: draft.description_zh?.trim() || null,
      best_for: draft.best_for ?? [],
      best_for_zh: draft.best_for_zh ?? [],
      attributes: draft.attributes,
      ratings: draft.ratings,
      sort_order: Number(draft.sort_order) || 0,
      active: draft.active,
    }
    const res = draft.id
      ? await supabase.from('products').update(payload).eq('id', draft.id)
      : await supabase.from('products').insert(payload)
    setSaving(false)
    if (res.error) { setError(res.error.message); return }
    setDraft(null)
    await reload()
  }

  async function remove(row: ProductRow) {
    if (!supabase) return
    if (!confirm(`Delete "${row.name}" permanently?`)) return
    const { error } = await supabase.from('products').delete().eq('id', row.id)
    if (error) { alert(error.message); return }
    setRows(prev => prev.filter(r => r.id !== row.id))
  }

  async function toggleActive(row: ProductRow) {
    if (!supabase) return
    const { error } = await supabase.from('products').update({ active: !row.active }).eq('id', row.id)
    if (error) { alert(error.message); return }
    setRows(prev => prev.map(r => r.id === row.id ? { ...r, active: !r.active } : r))
  }

  // ── Editor form ──
  if (draft) {
    const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setDraft(d => d ? { ...d, [k]: v } : d)
    const setAttr = (k: string, v: unknown) => setDraft(d => d ? { ...d, attributes: { ...d.attributes, [k]: v } } : d)
    const setRating = (k: string, v: number) => setDraft(d => d ? { ...d, ratings: { ...d.ratings, [k]: v } } : d)

    return (
      <div className="max-w-3xl">
        <button onClick={() => setDraft(null)} className="text-sm text-charcoal/50 hover:text-charcoal mb-4 cursor-pointer">← Back to products</button>
        <h2 className="font-serif text-2xl text-charcoal mb-1">{draft.id ? 'Edit product' : 'New product'}</h2>
        <p className="text-xs text-charcoal/40 mb-6 uppercase tracking-wider">{CAT_LABEL[draft.category]}</p>

        {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Code *"><input className={inputCls} value={draft.code} onChange={e => set('code', e.target.value)} /></Field>
          <Field label="SKU"><input className={inputCls} value={draft.sku ?? ''} onChange={e => set('sku', e.target.value)} /></Field>
          <Field label="Name *"><input className={inputCls} value={draft.name} onChange={e => set('name', e.target.value)} /></Field>
          <Field label="Name (中)"><input className={inputCls} value={draft.name_zh ?? ''} onChange={e => set('name_zh', e.target.value)} /></Field>
          <Field label="Collection"><input className={inputCls} value={draft.collection ?? ''} onChange={e => set('collection', e.target.value)} /></Field>
          <Field label="Sort order"><input type="number" className={inputCls} value={draft.sort_order} onChange={e => set('sort_order', Number(e.target.value))} /></Field>
          {draft.category === 'sheet' && <>
            <Field label="Material"><input className={inputCls} value={draft.material ?? ''} onChange={e => set('material', e.target.value)} /></Field>
            <Field label="Weave"><input className={inputCls} value={draft.weave ?? ''} onChange={e => set('weave', e.target.value)} /></Field>
            <Field label="Thread count"><input type="number" className={inputCls} value={draft.thread_count ?? ''} onChange={e => set('thread_count', e.target.value ? Number(e.target.value) : null)} /></Field>
          </>}
          {(draft.category === 'comforter' || draft.category === 'pillow') &&
            <Field label="Fill"><input className={inputCls} value={draft.fill ?? ''} onChange={e => set('fill', e.target.value)} /></Field>}
        </div>

        <Field label="Description" className="mt-4"><textarea className={`${inputCls} min-h-[80px]`} value={draft.description ?? ''} onChange={e => set('description', e.target.value)} /></Field>
        <Field label="Description (中)" className="mt-4"><textarea className={`${inputCls} min-h-[80px]`} value={draft.description_zh ?? ''} onChange={e => set('description_zh', e.target.value)} /></Field>

        <div className="grid sm:grid-cols-2 gap-4 mt-4">
          <Field label="Best for (one per line)"><textarea className={`${inputCls} min-h-[96px]`} value={lines(draft.best_for)} onChange={e => set('best_for', toArr(e.target.value))} /></Field>
          <Field label="Best for 中 (one per line)"><textarea className={`${inputCls} min-h-[96px]`} value={lines(draft.best_for_zh)} onChange={e => set('best_for_zh', toArr(e.target.value))} /></Field>
        </div>

        {/* Attributes (drive scoring) */}
        <p className="text-xs font-semibold uppercase tracking-wider text-charcoal/40 mt-6 mb-2">Attributes</p>
        <div className="grid sm:grid-cols-2 gap-3">
          {Object.entries(draft.attributes).map(([k, v]) => (
            <Field key={k} label={k}>
              {typeof v === 'boolean'
                ? <select className={inputCls} value={String(v)} onChange={e => setAttr(k, e.target.value === 'true')}>
                    <option value="true">true</option><option value="false">false</option>
                  </select>
                : <input className={inputCls} value={String(v ?? '')} onChange={e => setAttr(k, e.target.value)} />}
            </Field>
          ))}
        </div>

        {/* Ratings */}
        {Object.keys(draft.ratings).length > 0 && <>
          <p className="text-xs font-semibold uppercase tracking-wider text-charcoal/40 mt-6 mb-2">Ratings (1–5)</p>
          <div className="grid sm:grid-cols-4 gap-3">
            {Object.entries(draft.ratings).map(([k, v]) => (
              <Field key={k} label={k}>
                <input type="number" min={1} max={5} className={inputCls} value={v} onChange={e => setRating(k, Number(e.target.value))} />
              </Field>
            ))}
          </div>
        </>}

        <label className="flex items-center gap-2 text-sm text-charcoal/70 mt-6 cursor-pointer">
          <input type="checkbox" checked={draft.active} onChange={e => set('active', e.target.checked)} /> Active (shown in the app)
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
            {c === 'all' ? 'All' : CAT_LABEL[c]}
          </button>
        ))}
        <div className="flex-1" />
        <select className="text-sm px-3 py-2 rounded-xl border border-charcoal/15 bg-white/70 text-charcoal/70 cursor-pointer"
          onChange={e => { if (e.target.value) { setDraft(blankDraft(e.target.value as 'sheet')); e.target.value = '' } }} defaultValue="">
          <option value="" disabled>+ Add product…</option>
          {CATEGORIES.map(c => <option key={c} value={c}>New {CAT_LABEL[c].slice(0, -1)}</option>)}
        </select>
      </div>

      {loading ? <p className="text-charcoal/40 text-sm py-12 text-center">Loading…</p>
        : error ? <p className="text-red-500 text-sm py-12 text-center">{error}</p>
        : (
          <div className="glass-card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-wider text-charcoal/40 border-b border-charcoal/10">
                  <th className="px-4 py-3 font-semibold">Code</th>
                  <th className="px-4 py-3 font-semibold">Name</th>
                  <th className="px-4 py-3 font-semibold">Category</th>
                  <th className="px-4 py-3 font-semibold">Collection</th>
                  <th className="px-4 py-3 font-semibold">Active</th>
                  <th className="px-4 py-3 font-semibold text-right"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(r => (
                  <Fragment key={r.id}>
                    <tr className="border-b border-charcoal/6 hover:bg-white/40">
                      <td className="px-4 py-3 font-mono text-xs text-charcoal/50">{r.code}</td>
                      <td className="px-4 py-3 text-charcoal font-medium">{r.name}{r.name_zh ? <span className="text-charcoal/40 font-normal"> · {r.name_zh}</span> : null}</td>
                      <td className="px-4 py-3 text-charcoal/50">{CAT_LABEL[r.category]}</td>
                      <td className="px-4 py-3 text-charcoal/50">{r.collection || '—'}</td>
                      <td className="px-4 py-3">
                        <button onClick={() => toggleActive(r)} className={`text-xs px-2 py-1 rounded-full cursor-pointer ${r.active ? 'bg-sage/15 text-sage-dark' : 'bg-charcoal/8 text-charcoal/40'}`}>
                          {r.active ? 'Active' : 'Hidden'}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <button onClick={() => { setError(''); setDraft({ ...r }) }} className="text-xs text-charcoal/50 hover:text-charcoal cursor-pointer mr-3">Edit</button>
                        <button onClick={() => remove(r)} className="text-xs text-red-400 hover:text-red-600 cursor-pointer">Delete</button>
                      </td>
                    </tr>
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
    </>
  )
}

const inputCls = 'w-full px-3 py-2 rounded-lg bg-white/70 border border-charcoal/12 text-sm text-charcoal outline-none focus:border-gold transition-colors'

function Field({ label, children, className = '' }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={`block ${className}`}>
      <span className="block text-xs font-medium text-charcoal/50 mb-1">{label}</span>
      {children}
    </label>
  )
}
