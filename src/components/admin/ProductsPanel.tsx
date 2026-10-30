import { useEffect, useMemo, useState } from 'react'
import { collection, deleteDoc, doc, getDocs, setDoc, updateDoc, writeBatch } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import catalogSeed from '../../data/catalog.json'
import { imageUrlFor } from '../../lib/products'
import type { ProductRow } from '../../lib/products'
import { QUESTION_SEED, SECTION_LONG_TO_SHORT } from '../../lib/questionData'
import type { ProductCategory } from '../../lib/types'

// ── Client-facing product editor ─────────────────────────────────────────────
// Deliberately simple: paste the FET.com link, fill names + 3 bullets, then tick
// the answers this product should be recommended for. Bedding sets pick a
// material tier + design style instead of ticking answers.

type Draft = Omit<ProductRow, 'id'> & { id?: string }

const CATEGORIES: ProductCategory[] = ['sheet', 'comforter', 'pillow']
const CAT_LABEL: Record<ProductCategory, string> = { sheet: 'Bedding sets 床組', comforter: 'Comforters 棉被', pillow: 'Pillows 枕頭' }
const CAT_SECTION: Record<ProductCategory, string> = { sheet: 'sheets', comforter: 'comforter', pillow: 'pillow' }

const MATERIALS: { value: string; label: string }[] = [
  { value: 'tencel80',  label: '80S Tencel™ Lyocell · 80支天絲' },
  { value: 'tencel60',  label: '60S Tencel™ Lyocell · 60支天絲' },
  { value: 'cotton60',  label: '60S Cotton · 60支精梳棉' },
  { value: 'cotton40',  label: '40S Cotton · 40支精梳棉' },
  { value: 'cotton500', label: '500/600TC High-count Cotton · 高織數棉' },
  { value: 'topcool',   label: 'TopCool cooling fibre · TopCool 涼感' },
]
const STYLES: { value: string; label: string }[] = [
  { value: 'Nature',  label: 'Nature-inspired · 自然風格' },
  { value: 'Minimal', label: 'Minimalist & solid · 簡約風格' },
  { value: 'Playful', label: 'Playful & thematic · 主題童趣' },
  { value: 'Classic', label: 'Classic luxury · 經典奢華' },
]
const TYPE_PRESETS: Record<ProductCategory, { zh: string; en: string }[]> = {
  sheet: [],
  comforter: [{ zh: '羽絨', en: 'Down' }, { zh: '蠶絲', en: 'Silk' }, { zh: '羊毛', en: 'Wool' }, { zh: '科技纖維', en: 'Synthetic Fiber' }],
  pillow: [{ zh: '羽絨', en: 'Down' }, { zh: '乳膠', en: 'Latex' }, { zh: '記憶棉', en: 'Memory Foam' }, { zh: '科技纖維', en: 'Synthetic Fiber' }, { zh: '凝膠', en: 'Gel' }],
}

function blankDraft(category: ProductCategory): Draft {
  return {
    category, name_zh: '', name_en: '', type_zh: '', type_en: '', url: '', image_url: '', price_twd: null,
    bullets_zh: [], bullets_en: [], match: {}, material: category === 'sheet' ? 'tencel80' : null, style: category === 'sheet' ? 'Nature' : null,
    sort_order: 999, active: true,
  }
}
const lines = (arr: string[] | null) => (arr ?? []).join('\n')
const toArr = (s: string) => s.split('\n').map(x => x.trim()).filter(Boolean)
const idFromUrl = (url: string) => url.match(/SalePage\/Index\/(\d+)/)?.[1] ?? ''

export default function ProductsPanel() {
  const [rows, setRows] = useState<ProductRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [cat, setCat] = useState<'all' | ProductCategory>('all')
  const [draft, setDraft] = useState<Draft | null>(null)
  const [saving, setSaving] = useState(false)

  async function fetchRows(): Promise<ProductRow[]> {
    if (!db) return []
    const snap = await getDocs(collection(db, 'products'))
    const order: Record<string, number> = { sheet: 0, comforter: 1, pillow: 2 }
    return snap.docs
      .map(d => ({ id: d.id, ...(d.data() as Omit<ProductRow, 'id'>) }))
      .sort((a, b) => (order[a.category] ?? 9) - (order[b.category] ?? 9) || (a.sort_order ?? 0) - (b.sort_order ?? 0))
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

  // One-click seed: writes the bundled catalog (src/data/catalog.json) into Firestore.
  // Used on first setup and to restore defaults; existing ids are overwritten.
  async function importBundled() {
    if (!db) return
    if (rows.length > 0 && !confirm(`Overwrite ${catalogSeed.length} built-in products in the database? Products you added yourself are kept.`)) return
    setSaving(true); setError('')
    try {
      const batch = writeBatch(db)
      for (const p of catalogSeed) {
        const { id, ...data } = p
        batch.set(doc(db, 'products', id), data)
      }
      await batch.commit()
      setLoading(true); await load()
    } catch (e) { setError((e as Error).message) }
    setSaving(false)
  }

  const filtered = useMemo(() => rows.filter(r => cat === 'all' || (r.category as ProductCategory) === cat), [rows, cat])

  async function save() {
    if (!db || !draft) return
    const id = draft.id ?? idFromUrl(draft.url)
    if (!draft.url.trim() || !id) { setError('Please paste a valid FET.com product link (…/SalePage/Index/12345).'); return }
    if (!draft.name_zh.trim()) { setError('Chinese product name is required.'); return }
    setSaving(true); setError('')
    const payload = {
      category: draft.category,
      name_zh: draft.name_zh.trim(),
      name_en: draft.name_en.trim() || draft.name_zh.trim(),
      type_zh: draft.type_zh?.trim() || null,
      type_en: draft.type_en?.trim() || null,
      url: draft.url.trim(),
      image_url: draft.image_url?.trim() || imageUrlFor(draft.url.trim()),
      price_twd: draft.price_twd ?? null,
      bullets_zh: draft.bullets_zh ?? [],
      bullets_en: draft.bullets_en ?? [],
      match: draft.category === 'sheet' ? {} : (draft.match ?? {}),
      material: draft.category === 'sheet' ? draft.material : null,
      style: draft.category === 'sheet' ? draft.style : null,
      sort_order: Number(draft.sort_order) || 0,
      active: draft.active,
    }
    try {
      await setDoc(doc(db, 'products', id), payload, { merge: true })
    } catch (e) { setSaving(false); setError((e as Error).message); return }
    setSaving(false)
    setDraft(null)
    setLoading(true); await load()
  }

  async function remove(row: ProductRow) {
    if (!db) return
    if (!confirm(`Delete "${row.name_zh}" permanently? (You can also just set it to Hidden.)`)) return
    try { await deleteDoc(doc(db, 'products', row.id)) } catch (e) { alert((e as Error).message); return }
    setRows(prev => prev.filter(r => r.id !== row.id))
  }
  async function toggleActive(row: ProductRow) {
    if (!db) return
    try { await updateDoc(doc(db, 'products', row.id), { active: !row.active }) } catch (e) { alert((e as Error).message); return }
    setRows(prev => prev.map(r => r.id === row.id ? { ...r, active: !r.active } : r))
  }

  // ── Editor ──
  if (draft) {
    const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setDraft(d => d ? { ...d, [k]: v } : d)
    const toggleMatch = (q: string, value: string) => setDraft(d => {
      if (!d) return d
      const cur = new Set(d.match?.[q] ?? [])
      if (cur.has(value)) cur.delete(value); else cur.add(value)
      return { ...d, match: { ...(d.match ?? {}), [q]: [...cur] } }
    })
    const dcat = draft.category as ProductCategory
    const sectionQs = QUESTION_SEED.filter(q => SECTION_LONG_TO_SHORT[q.section] === CAT_SECTION[dcat])
    const preview = draft.image_url?.trim() || imageUrlFor(draft.url)

    return (
      <div className="max-w-3xl">
        <button onClick={() => setDraft(null)} className="text-sm text-charcoal/50 hover:text-charcoal mb-4 cursor-pointer">← Back to products</button>
        <h2 className="font-serif text-2xl text-charcoal mb-1">{draft.id ? 'Edit product' : 'New product'}</h2>
        <p className="text-xs text-charcoal/40 mb-6 uppercase tracking-wider">{CAT_LABEL[dcat]}</p>
        {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

        {/* 1. Link */}
        <Section n="1" title="FET.com product link">
          <input className={inputCls} placeholder="https://www.fet.com.tw/SalePage/Index/12345" value={draft.url} disabled={Boolean(draft.id)}
            onChange={e => set('url', e.target.value)} />
          <p className="text-xs text-charcoal/40 mt-1.5">The product photo is taken from this page automatically. {draft.id ? 'The link cannot be changed after saving; add a new product instead.' : ''}</p>
          {preview && (
            <div className="flex items-center gap-4 mt-3">
              <img src={preview} alt="" className="w-24 h-24 rounded-xl border border-charcoal/10 object-cover bg-white" onError={e => { (e.currentTarget as HTMLImageElement).style.opacity = '0.2' }} />
              <div className="text-xs text-charcoal/50">
                <p>Photo preview. To use a different photo, paste an image address below.</p>
                <input className={`${inputCls} mt-2`} placeholder="Optional: custom image URL" value={draft.image_url ?? ''} onChange={e => set('image_url', e.target.value)} />
              </div>
            </div>
          )}
        </Section>

        {/* 2. Names */}
        <Section n="2" title="Names & type">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Product name 中文 *"><input className={inputCls} value={draft.name_zh} onChange={e => set('name_zh', e.target.value)} /></Field>
            <Field label="Product name English"><input className={inputCls} value={draft.name_en} onChange={e => set('name_en', e.target.value)} /></Field>
            {draft.category === 'sheet' ? (
              <>
                <Field label="Material tier 材質">
                  <select className={inputCls} value={draft.material ?? ''} onChange={e => set('material', e.target.value)}>
                    {MATERIALS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                  </select>
                </Field>
                <Field label="Design style 風格">
                  <select className={inputCls} value={draft.style ?? ''} onChange={e => set('style', e.target.value)}>
                    {STYLES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </Field>
              </>
            ) : (
              <>
                <Field label="Type 類型 中文">
                  <input className={inputCls} list={`types-zh-${dcat}`} value={draft.type_zh ?? ''} onChange={e => {
                    const preset = TYPE_PRESETS[dcat].find(t => t.zh === e.target.value)
                    setDraft(d => d ? { ...d, type_zh: e.target.value, type_en: preset ? preset.en : d.type_en } : d)
                  }} />
                  <datalist id={`types-zh-${dcat}`}>{TYPE_PRESETS[dcat].map(t => <option key={t.zh} value={t.zh} />)}</datalist>
                </Field>
                <Field label="Type English"><input className={inputCls} value={draft.type_en ?? ''} onChange={e => set('type_en', e.target.value)} /></Field>
              </>
            )}
            <Field label="Sort order (lower shows first on ties)"><input type="number" className={inputCls} value={draft.sort_order} onChange={e => set('sort_order', Number(e.target.value))} /></Field>
            <Field label="Price NT$ (optional, not shown to customers)"><input type="number" className={inputCls} value={draft.price_twd ?? ''} onChange={e => set('price_twd', e.target.value ? Number(e.target.value) : null)} /></Field>
          </div>
        </Section>

        {/* 3. Bullets */}
        <Section n="3" title="Selling points (one per line, 3 recommended)">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="中文"><textarea className={`${inputCls} min-h-[110px]`} value={lines(draft.bullets_zh)} onChange={e => set('bullets_zh', toArr(e.target.value))} /></Field>
            <Field label="English"><textarea className={`${inputCls} min-h-[110px]`} value={lines(draft.bullets_en)} onChange={e => set('bullets_en', toArr(e.target.value))} /></Field>
          </div>
        </Section>

        {/* 4. Matching */}
        {draft.category === 'sheet' ? (
          <Section n="4" title="When to recommend">
            <p className="text-sm text-charcoal/55">Bedding sets are matched automatically from the material tier and design style above. Nothing else to set.</p>
          </Section>
        ) : (
          <Section n="4" title="Recommend this product when the customer answers…">
            <p className="text-xs text-charcoal/45 mb-4">Tick every answer this product suits. The more ticks a product collects from a customer's answers, the higher it ranks.</p>
            <div className="space-y-5">
              {sectionQs.map(q => (
                <div key={q.id}>
                  <p className="text-xs font-semibold text-charcoal/60 mb-2">{q.admin_label} <span className="font-normal text-charcoal/35">· {q.question_zh}</span></p>
                  <div className="flex flex-wrap gap-2">
                    {q.options.map(o => {
                      const on = draft.match?.[q.id]?.includes(o.value) ?? false
                      return (
                        <button key={o.value} type="button" onClick={() => toggleMatch(q.id, o.value)}
                          className={`text-xs px-3 py-1.5 rounded-full border transition-colors cursor-pointer ${on ? 'bg-sage/15 border-sage text-sage-dark font-medium' : 'border-charcoal/15 text-charcoal/55 hover:bg-white/60'}`}>
                          {on ? '✓ ' : ''}{o.label_zh} · {o.label}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}

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
        <button onClick={importBundled} disabled={saving} title="Writes the built-in catalog shipped with the app into the database"
          className="text-xs px-3 py-2 rounded-xl border border-charcoal/15 text-charcoal/50 hover:bg-white/60 disabled:opacity-50 cursor-pointer">
          {saving ? 'Importing…' : rows.length === 0 ? `Import built-in catalog (${catalogSeed.length})` : 'Restore built-in catalog'}
        </button>
        <select className="text-sm px-3 py-2 rounded-xl border border-charcoal/15 bg-white/70 text-charcoal/70 cursor-pointer"
          onChange={e => { if (e.target.value) { setError(''); setDraft(blankDraft(e.target.value as ProductCategory)); e.target.value = '' } }} defaultValue="">
          <option value="" disabled>+ Add product…</option>
          {CATEGORIES.map(c => <option key={c} value={c}>New: {CAT_LABEL[c]}</option>)}
        </select>
      </div>

      {loading ? <p className="text-charcoal/40 text-sm py-12 text-center">Loading…</p>
        : error ? <p className="text-red-500 text-sm py-12 text-center">{error}</p>
        : rows.length === 0 ? <p className="text-charcoal/40 text-sm py-12 text-center">No products in the database yet. The app is using the built-in catalog. Click “Import built-in catalog” above to start editing it here.</p>
        : (
          <div className="glass-card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-wider text-charcoal/40 border-b border-charcoal/10">
                  <th className="px-4 py-3 font-semibold w-14"></th>
                  <th className="px-4 py-3 font-semibold">Product</th>
                  <th className="px-4 py-3 font-semibold">Type</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold text-right"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(r => (
                  <tr key={r.id} className="border-b border-charcoal/6 hover:bg-white/40">
                    <td className="px-4 py-2"><img src={r.image_url || imageUrlFor(r.url)} alt="" className="w-10 h-10 rounded-lg object-cover border border-charcoal/8 bg-white" /></td>
                    <td className="px-4 py-3">
                      <p className="text-charcoal font-medium leading-snug">{r.name_zh}</p>
                      <p className="text-xs text-charcoal/40">{r.name_en}{r.price_twd ? ` · NT$${r.price_twd.toLocaleString()}` : ''}</p>
                    </td>
                    <td className="px-4 py-3 text-charcoal/50 text-xs">
                      {r.category === 'sheet'
                        ? `${MATERIALS.find(m => m.value === r.material)?.label.split(' · ')[0] ?? r.material} · ${STYLES.find(s => s.value === r.style)?.label.split(' · ')[0] ?? r.style}`
                        : `${r.type_zh ?? ''} ${r.type_en ?? ''}`}
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => toggleActive(r)} className={`text-xs px-2 py-1 rounded-full cursor-pointer ${r.active ? 'bg-sage/15 text-sage-dark' : 'bg-charcoal/8 text-charcoal/40'}`}>{r.active ? 'Active' : 'Hidden'}</button>
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-xs text-charcoal/40 hover:text-gold mr-3">FET ↗</a>
                      <button onClick={() => { setError(''); setDraft({ ...r }) }} className="text-xs text-charcoal/50 hover:text-charcoal cursor-pointer mr-3">Edit</button>
                      <button onClick={() => remove(r)} className="text-xs text-red-400 hover:text-red-600 cursor-pointer">Delete</button>
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

const inputCls = 'w-full px-3 py-2 rounded-lg bg-white/70 border border-charcoal/12 text-sm text-charcoal outline-none focus:border-gold transition-colors disabled:opacity-60'

function Field({ label, children, className = '' }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={`block ${className}`}>
      <span className="block text-xs font-medium text-charcoal/50 mb-1">{label}</span>
      {children}
    </label>
  )
}
function Section({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <div className="glass-card p-5 mb-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-charcoal/40 mb-3"><span className="text-gold mr-2">{n}</span>{title}</p>
      {children}
    </div>
  )
}
