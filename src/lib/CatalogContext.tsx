import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { defaultCatalog } from './engine'
import type { Catalog } from './engine'
import { supabase, isSupabaseConfigured } from './supabase'
import type {
  SheetProduct, PillowProduct, ComforterProduct, ScoringRule,
  ProductCategory, RuleOperator,
} from './types'

interface CatalogContextValue {
  catalog: Catalog
  loading: boolean
  source: 'bundled' | 'supabase'
}

const Ctx = createContext<CatalogContextValue>({
  catalog: defaultCatalog,
  loading: false,
  source: 'bundled',
})

// ── Row shapes (Supabase returns untyped rows) ────────────────────────────────
interface ProductRow {
  category: string; code: string; name: string
  sku: string | null; collection: string | null
  material: string | null; weave: string | null; thread_count: number | null; fill: string | null
  description: string | null; description_zh: string | null
  best_for: string[] | null; best_for_zh: string[] | null
  attributes: Record<string, unknown>; ratings: Record<string, unknown>
}
interface RuleRow {
  question_key: string; answer_value: string; target_category: string; attribute_path: string
  operator: string; compare_value: string; points: number
  reason: string | null; reason_zh: string | null
  also_question_key: string | null; also_answer_value: string | null; active: boolean
}

function mapSheet(r: ProductRow): SheetProduct {
  return {
    product_id: r.code,
    name: r.name,
    sku: r.sku ?? undefined,
    collection: r.collection ?? undefined,
    material: r.material as SheetProduct['material'],
    weave: r.weave as SheetProduct['weave'],
    thread_count: r.thread_count ?? undefined,
    attributes: r.attributes as SheetProduct['attributes'],
    best_for: r.best_for ?? [],
    best_for_zh: r.best_for_zh ?? undefined,
    ratings: r.ratings as SheetProduct['ratings'],
    description: r.description ?? '',
    description_zh: r.description_zh ?? undefined,
  }
}
function mapPillow(r: ProductRow): PillowProduct {
  return {
    product_id: r.code,
    name: r.name,
    sku: r.sku ?? undefined,
    collection: r.collection ?? undefined,
    fill: r.fill as PillowProduct['fill'],
    attributes: r.attributes as PillowProduct['attributes'],
    best_for: r.best_for ?? [],
    best_for_zh: r.best_for_zh ?? undefined,
    description: r.description ?? '',
    description_zh: r.description_zh ?? undefined,
  }
}
function mapComforter(r: ProductRow): ComforterProduct {
  return {
    product_id: r.code,
    name: r.name,
    sku: r.sku ?? undefined,
    collection: r.collection ?? undefined,
    fill: r.fill as ComforterProduct['fill'],
    attributes: r.attributes as ComforterProduct['attributes'],
    best_for: r.best_for ?? [],
    best_for_zh: r.best_for_zh ?? undefined,
    ratings: r.ratings as ComforterProduct['ratings'],
    description: r.description ?? '',
    description_zh: r.description_zh ?? undefined,
  }
}
function mapRule(r: RuleRow): ScoringRule {
  return {
    question_key: r.question_key,
    answer_value: r.answer_value,
    target_category: r.target_category as ProductCategory,
    attribute_path: r.attribute_path,
    operator: r.operator as RuleOperator,
    compare_value: r.compare_value,
    points: r.points,
    reason: r.reason ?? undefined,
    reason_zh: r.reason_zh ?? undefined,
    also_question_key: r.also_question_key,
    also_answer_value: r.also_answer_value,
    active: r.active,
  }
}

export function CatalogProvider({ children }: { children: ReactNode }) {
  const [catalog, setCatalog] = useState<Catalog>(defaultCatalog)
  const [loading, setLoading] = useState(isSupabaseConfigured)
  const [source, setSource] = useState<'bundled' | 'supabase'>('bundled')

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return
    let cancelled = false
    ;(async () => {
      try {
        const [products, rules] = await Promise.all([
          supabase.from('products').select('*').eq('active', true).order('sort_order'),
          supabase.from('scoring_rules').select('*').eq('active', true),
        ])
        if (cancelled) return
        const prows = (products.data ?? []) as ProductRow[]
        const rrows = (rules.data ?? []) as RuleRow[]
        // Only override the bundled catalog if the DB actually has products.
        if (products.error || rules.error || prows.length === 0) return
        setCatalog({
          sheets: prows.filter(p => p.category === 'sheet').map(mapSheet),
          pillows: prows.filter(p => p.category === 'pillow').map(mapPillow),
          comforters: prows.filter(p => p.category === 'comforter').map(mapComforter),
          rules: rrows.map(mapRule),
        })
        setSource('supabase')
      } catch {
        /* keep bundled catalog on any failure */
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [])

  return <Ctx.Provider value={{ catalog, loading, source }}>{children}</Ctx.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCatalog() {
  return useContext(Ctx)
}
