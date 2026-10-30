import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { defaultCatalog } from './engine'
import type { Catalog } from './engine'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db, isFirebaseConfigured } from './firebase'
import { QUESTIONS } from './questions'
import type { QuestionConfig } from './types'
import { rowToProduct } from './products'
import type { ProductRow } from './products'

interface CatalogContextValue {
  catalog: Catalog
  questions: QuestionConfig[]
  loading: boolean
  source: 'bundled' | 'firestore'
}

const Ctx = createContext<CatalogContextValue>({ catalog: defaultCatalog, questions: QUESTIONS, loading: false, source: 'bundled' })

export function CatalogProvider({ children }: { children: ReactNode }) {
  const [catalog, setCatalog] = useState<Catalog>(defaultCatalog)
  const [loading, setLoading] = useState(isFirebaseConfigured)
  const [source, setSource] = useState<'bundled' | 'firestore'>('bundled')

  useEffect(() => {
    if (!isFirebaseConfigured || !db) return
    let cancelled = false
    ;(async () => {
      try {
        // Public reads must filter active == true (see firestore.rules).
        const snap = await getDocs(query(collection(db, 'products'), where('active', '==', true)))
        if (cancelled) return
        const rows = snap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<ProductRow, 'id'>) }))
        // Only override the bundled catalog when Firestore actually has products.
        if (rows.length > 0) {
          rows.sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
          setCatalog({ products: rows.map(rowToProduct) })
          setSource('firestore')
        }
      } catch { /* keep bundled */ } finally { if (!cancelled) setLoading(false) }
    })()
    return () => { cancelled = true }
  }, [])

  return <Ctx.Provider value={{ catalog, questions: QUESTIONS, loading, source }}>{children}</Ctx.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCatalog() { return useContext(Ctx) }
