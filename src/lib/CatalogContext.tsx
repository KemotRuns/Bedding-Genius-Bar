import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { defaultCatalog } from './engine'
import type { Catalog } from './engine'
import { supabase, isSupabaseConfigured } from './supabase'
import { QUESTIONS } from './questions'
import type { QuestionConfig } from './types'
import { rowToProduct } from './products'
import type { ProductRow } from './products'

interface CatalogContextValue {
  catalog: Catalog
  questions: QuestionConfig[]
  loading: boolean
  source: 'bundled' | 'supabase'
}

const Ctx = createContext<CatalogContextValue>({ catalog: defaultCatalog, questions: QUESTIONS, loading: false, source: 'bundled' })

export function CatalogProvider({ children }: { children: ReactNode }) {
  const [catalog, setCatalog] = useState<Catalog>(defaultCatalog)
  const [loading, setLoading] = useState(isSupabaseConfigured)
  const [source, setSource] = useState<'bundled' | 'supabase'>('bundled')

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return
    let cancelled = false
    ;(async () => {
      try {
        const { data, error } = await supabase.from('products').select('*').eq('active', true).order('sort_order')
        if (cancelled) return
        const rows = (data ?? []) as ProductRow[]
        // Only override the bundled catalog when the DB actually has the v2 shape + rows.
        if (!error && rows.length > 0 && 'url' in rows[0]) {
          setCatalog({ products: rows.map(rowToProduct) })
          setSource('supabase')
        }
      } catch { /* keep bundled */ } finally { if (!cancelled) setLoading(false) }
    })()
    return () => { cancelled = true }
  }, [])

  return <Ctx.Provider value={{ catalog, questions: QUESTIONS, loading, source }}>{children}</Ctx.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCatalog() { return useContext(Ctx) }
