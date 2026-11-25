import type { Product } from './types'

// Catalog revision. Bump when the question set or matching rules change in a way
// that makes products stored under the previous revision unusable (rev 2 = FEAC
// 1123 workbook: new answer values, hard exclusions, price tiers). The kiosk
// ignores database products from an older revision and uses the built-in
// catalog until an admin updates the database from /admin.
export const CATALOG_REV = 2
export const isCurrentRev = (r: { rev?: number | null }) => (r.rev ?? 1) >= CATALOG_REV

// Firestore `products/{id}` document (+ id) → Product
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
  rev?: number | null
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
