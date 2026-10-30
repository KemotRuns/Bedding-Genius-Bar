import type { Product } from './types'

// Supabase `products` row (v2 schema) → Product
export interface ProductRow {
  id: string; category: string
  name_zh: string; name_en: string
  type_zh: string | null; type_en: string | null
  url: string; image_url: string | null
  price_twd: number | null
  bullets_zh: string[] | null; bullets_en: string[] | null
  match: Record<string, string[]> | null
  material: string | null; style: string | null
  sort_order: number; active: boolean
}

export function imageUrlFor(url: string): string {
  const m = url.match(/SalePage\/Index\/(\d+)/)
  return m ? `https://img.91app.com/webapi/imagesV3/Original/SalePage/${m[1]}/0/0?v=1` : ''
}

export function rowToProduct(r: ProductRow): Product {
  return {
    id: r.id,
    category: r.category as Product['category'],
    name_zh: r.name_zh,
    name_en: r.name_en,
    type_zh: r.type_zh ?? '',
    type_en: r.type_en ?? '',
    url: r.url,
    image_url: r.image_url || imageUrlFor(r.url),
    price_twd: r.price_twd,
    bullets_zh: r.bullets_zh ?? [],
    bullets_en: r.bullets_en ?? [],
    match: (r.match ?? {}) as Product['match'],
    material: (r.material ?? undefined) as Product['material'],
    style: (r.style ?? undefined) as Product['style'],
    sort_order: r.sort_order,
    active: r.active,
  }
}
