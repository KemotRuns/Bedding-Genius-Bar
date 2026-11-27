// Downloadable Sleep Plan (PDF), built entirely in the browser.
//
// Each A4 page is drawn on a canvas with the device's own fonts (so Chinese
// renders everywhere without shipping a CJK font), then wrapped as a JPEG page
// in a small hand-written PDF with clickable product links. No dependencies.

export interface ReportCard {
  head: string
  tier?: string
  name: string
  altName?: string
  tags: string[]
  bullets: string[]
  reasons: string[]
  note?: string
  url: string
  imageUrl: string
  match: number
}

export interface ReportData {
  zh: boolean
  customer?: string
  heard: { label: string; text: string }[]
  sections: { label: string; cards: ReportCard[] }[]
}

// ── Page geometry (PDF points, A4) ───────────────────────────────────────────
const W = 595, H = 842, M = 40, CW = W - 2 * M
const SCALE = 2.5
const TOP = 40, BOTTOM = H - 50

const SANS = '"Inter","PingFang TC","Noto Sans TC","Noto Sans CJK TC","Microsoft JhengHei","Heiti TC",sans-serif'
const SERIF = '"Playfair Display",Georgia,serif'
const INK = '#2A1F14', GOLD = '#A9794A', SAGE = '#567A53', CREAM = '#FAF7F0'
const ink = (a: number) => `rgba(42,31,20,${a})`

type Ctx = CanvasRenderingContext2D
interface Link { x: number; y: number; w: number; h: number; url: string }
interface Page { canvas: HTMLCanvasElement; ctx: Ctx; links: Link[] }
interface Block { h: number; draw: (page: Page, y: number) => void }

const font = (size: number, weight = 400, family = SANS) => `${weight} ${size}px ${family}`

// ── Text ─────────────────────────────────────────────────────────────────────
const CJK = '⺀-鿿豈-﫿＀-￯　-〿'
const TOKEN = new RegExp(`[${CJK}]|[^\\s${CJK}]+|\\s+`, 'g')
const NO_LINE_START = /^[，。、：；！？）」』】％,.:;!?)]$/

/** Greedy line wrap: Latin breaks at spaces, CJK may break between any two characters. */
function wrap(ctx: Ctx, text: string, f: string, maxW: number): string[] {
  ctx.font = f
  const lines: string[] = []
  let line = ''
  for (const tok of text.match(TOKEN) ?? []) {
    if (/^\s+$/.test(tok)) { if (line) line += ' '; continue }
    if (!line || NO_LINE_START.test(tok) || ctx.measureText(line + tok).width <= maxW) { line += tok; continue }
    lines.push(line.trimEnd())
    line = tok
  }
  if (line.trim()) lines.push(line.trimEnd())
  return lines
}

interface Para { h: number; draw: (ctx: Ctx, x: number, y: number) => void }

function para(ctx: Ctx, text: string, f: string, color: string, lh: number, maxW: number): Para {
  const lines = text ? wrap(ctx, text, f, maxW) : []
  return {
    h: lines.length * lh,
    draw(c, x, y) {
      c.font = f; c.fillStyle = color; c.textBaseline = 'alphabetic'; c.textAlign = 'left'
      lines.forEach((l, i) => c.fillText(l, x, y + i * lh + lh * 0.76))
    },
  }
}

function roundRect(ctx: Ctx, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

// ── Images ───────────────────────────────────────────────────────────────────
// Product photos live on a host that sends no CORS headers, and a canvas that
// has drawn such an image cannot be exported. They are fetched through a
// same-origin proxy path instead (public/_redirects in production, the Vite dev
// server proxy locally). Any other host is tried directly; on failure the card
// is drawn without a photo.
function proxied(url: string): string {
  try {
    const u = new URL(url)
    if (u.hostname === 'img.91app.com') return `/img91${u.pathname}${u.search}`
  } catch { /* fall through */ }
  return url
}

function loadImage(url: string): Promise<HTMLImageElement | null> {
  if (!url) return Promise.resolve(null)
  return new Promise(resolve => {
    const img = new Image()
    const timer = setTimeout(() => resolve(null), 10000)
    img.crossOrigin = 'anonymous'
    img.onload = () => { clearTimeout(timer); resolve(img.naturalWidth > 0 ? img : null) }
    img.onerror = () => { clearTimeout(timer); resolve(null) }
    img.src = proxied(url)
  })
}

// ── Blocks ───────────────────────────────────────────────────────────────────
function heardBlock(ctx: Ctx, data: ReportData): Block {
  const pad = 18, innerW = CW - 2 * pad
  const title = data.zh ? '我們聽到的' : 'WHAT WE HEARD'
  const rows = data.heard.map(r => ({
    label: para(ctx, r.label, font(9.5, 600), INK, 14, innerW),
    text: para(ctx, r.text, font(10, 400), ink(0.78), 15, innerW),
  }))
  const h = pad + 14 + rows.reduce((s, r) => s + r.label.h + r.text.h + 8, 0) + pad - 8
  return {
    h: h + 14,
    draw(page, y) {
      const c = page.ctx
      roundRect(c, M, y, CW, h, 10); c.fillStyle = CREAM; c.fill()
      c.strokeStyle = ink(0.1); c.lineWidth = 0.75; c.stroke()
      c.font = font(7.5, 600); c.fillStyle = ink(0.45); c.textAlign = 'left'; c.textBaseline = 'alphabetic'
      c.fillText(title, M + pad, y + pad + 7)
      let yy = y + pad + 14
      for (const r of rows) {
        r.label.draw(c, M + pad, yy); yy += r.label.h
        r.text.draw(c, M + pad, yy); yy += r.text.h + 8
      }
    },
  }
}

function sectionHeading(label: string): Block {
  return {
    h: 26,
    draw(page, y) {
      const c = page.ctx
      c.font = font(11, 600); c.fillStyle = GOLD; c.textAlign = 'left'; c.textBaseline = 'alphabetic'
      c.fillText(label, M, y + 14)
      const w = c.measureText(label).width
      c.strokeStyle = ink(0.12); c.lineWidth = 0.75
      c.beginPath(); c.moveTo(M + w + 10, y + 10.5); c.lineTo(M + CW, y + 10.5); c.stroke()
    },
  }
}

function cardBlock(ctx: Ctx, card: ReportCard, img: HTMLImageElement | null, zh: boolean): Block {
  const pad = 16, imgSize = 92, gap = 14
  const rightX = M + pad + imgSize + gap
  const rightW = CW - 2 * pad - imgSize - gap
  const fullW = CW - 2 * pad

  const head = [card.head.toUpperCase(), card.tier].filter(Boolean).join('  ·  ')
  const matchText = zh ? `匹配 ${card.match}%` : `${card.match}% match`
  const name = para(ctx, card.name, font(13, 600), INK, 17, rightW)
  const alt = para(ctx, card.altName ?? '', font(8.5, 400), ink(0.5), 12, rightW)
  const tags = para(ctx, card.tags.join('  ·  '), font(8.5, 600), SAGE, 13, rightW)
  const bullets = card.bullets.map(b => para(ctx, b, font(9.5, 400), ink(0.75), 14, rightW - 12))
  const rightH = 14 + name.h + (alt.h ? alt.h + 2 : 0) + (tags.h ? tags.h + 4 : 0) + (bullets.length ? 4 : 0) + bullets.reduce((s, b) => s + b.h + 2, 0)

  const reasons = card.reasons.map(r => para(ctx, r, font(9.5, 400), ink(0.72), 14, fullW))
  const note = para(ctx, card.note ?? '', font(8.5, 400), ink(0.55), 12.5, fullW)
  const reasonsH = reasons.length ? 12 + 14 + reasons.reduce((s, r) => s + r.h + 3, 0) : 0
  const noteH = note.h ? note.h + 8 : 0
  const linkLabel = zh ? '在 FET.com 查看這款商品' : 'See this on FET.com'
  const shortUrl = card.url.replace(/^https?:\/\/(www\.)?/, '')
  const linkH = 26

  const topH = Math.max(imgSize, rightH)
  const h = pad + topH + reasonsH + noteH + linkH + pad - 6

  return {
    h: h + 12,
    draw(page, y) {
      const c = page.ctx
      roundRect(c, M, y, CW, h, 10); c.fillStyle = CREAM; c.fill()
      c.strokeStyle = ink(0.1); c.lineWidth = 0.75; c.stroke()

      // Photo
      const ix = M + pad, iy = y + pad
      c.save()
      roundRect(c, ix, iy, imgSize, imgSize, 8); c.clip()
      c.fillStyle = '#FFFFFF'; c.fillRect(ix, iy, imgSize, imgSize)
      if (img) {
        const s = Math.max(imgSize / img.naturalWidth, imgSize / img.naturalHeight)
        const dw = img.naturalWidth * s, dh = img.naturalHeight * s
        c.drawImage(img, ix + (imgSize - dw) / 2, iy + (imgSize - dh) / 2, dw, dh)
      }
      c.restore()
      roundRect(c, ix, iy, imgSize, imgSize, 8); c.strokeStyle = ink(0.1); c.lineWidth = 0.75; c.stroke()
      page.links.push({ x: ix, y: iy, w: imgSize, h: imgSize, url: card.url })

      // Head line + match
      c.textBaseline = 'alphabetic'
      c.font = font(8.5, 600); c.fillStyle = GOLD; c.textAlign = 'right'
      c.fillText(matchText, M + CW - pad, iy + 8)
      const matchW = c.measureText(matchText).width
      c.textAlign = 'left'
      const headLine = wrap(c, head, font(7.5, 600), rightW - matchW - 10)[0] ?? ''
      c.font = font(7.5, 600); c.fillStyle = ink(0.45)
      c.fillText(headLine, rightX, iy + 8)

      let yy = iy + 14
      name.draw(c, rightX, yy); yy += name.h
      if (alt.h) { yy += 2; alt.draw(c, rightX, yy); yy += alt.h }
      if (tags.h) { yy += 4; tags.draw(c, rightX, yy); yy += tags.h }
      if (bullets.length) yy += 4
      for (const b of bullets) {
        c.fillStyle = SAGE; c.beginPath(); c.arc(rightX + 3, yy + 7.5, 1.8, 0, Math.PI * 2); c.fill()
        b.draw(c, rightX + 12, yy); yy += b.h + 2
      }

      yy = y + pad + topH
      if (reasons.length) {
        yy += 12
        c.strokeStyle = ink(0.08); c.lineWidth = 0.75
        c.beginPath(); c.moveTo(M + pad, yy); c.lineTo(M + CW - pad, yy); c.stroke()
        c.font = font(7.5, 600); c.fillStyle = ink(0.45); c.textAlign = 'left'
        c.fillText(zh ? '為什麼適合您' : 'WHY THIS FITS YOU', M + pad, yy + 14)
        yy += 14 + 6
        for (const r of reasons) { r.draw(c, M + pad, yy - 3); yy += r.h + 3 }
        yy -= 6
      }
      if (note.h) { yy += 8; note.draw(c, M + pad, yy); yy += note.h }

      // Link line
      yy += 10
      c.font = font(9.5, 600); c.fillStyle = GOLD; c.textAlign = 'left'
      c.fillText(linkLabel, M + pad, yy + 9)
      const lw = c.measureText(linkLabel).width
      c.strokeStyle = GOLD; c.lineWidth = 0.6
      c.beginPath(); c.moveTo(M + pad, yy + 11.5); c.lineTo(M + pad + lw, yy + 11.5); c.stroke()
      c.font = font(8, 400); c.fillStyle = ink(0.45)
      c.fillText(shortUrl, M + pad + lw + 10, yy + 9)
      const uw = c.measureText(shortUrl).width
      page.links.push({ x: M + pad - 2, y: yy - 3, w: lw + 10 + uw + 4, h: 18, url: card.url })
    },
  }
}

// ── Pages ────────────────────────────────────────────────────────────────────
function newPage(): Page {
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(W * SCALE); canvas.height = Math.round(H * SCALE)
  const ctx = canvas.getContext('2d')!
  ctx.scale(SCALE, SCALE)
  ctx.fillStyle = '#FFFFFF'; ctx.fillRect(0, 0, W, H)
  return { canvas, ctx, links: [] }
}

function drawHeader(page: Page, data: ReportData, dateText: string): number {
  const c = page.ctx, bandH = 108
  const g = c.createLinearGradient(0, 0, W, bandH)
  g.addColorStop(0, '#2A1F14'); g.addColorStop(0.6, '#3A2B1C'); g.addColorStop(1, '#C49A6C')
  c.fillStyle = g; c.fillRect(0, 0, W, bandH)
  c.textAlign = 'left'; c.textBaseline = 'alphabetic'
  c.font = font(8, 600); c.fillStyle = '#E3C7A2'
  c.fillText(data.zh ? 'TN SELECT · 東妮寢飾 PRO BAR' : 'TN SELECT · TONIA NICOLE PRO BAR', M, 36)
  c.font = data.zh ? font(25, 500) : font(27, 400, SERIF); c.fillStyle = '#FAF7F0'
  c.fillText(data.zh ? '您的睡眠計畫' : 'Your Sleep Plan', M, 68)
  const who = data.customer ? (data.zh ? `${data.customer} 的專屬計畫 · ` : `Prepared for ${data.customer} · `) : ''
  c.font = font(9.5, 400); c.fillStyle = 'rgba(250,247,240,0.7)'
  c.fillText(who + dateText, M, 88)
  return bandH + 22
}

function drawFooter(page: Page, data: ReportData, dateText: string, n: number, total: number) {
  const c = page.ctx
  c.font = font(7.5, 400); c.fillStyle = ink(0.4); c.textBaseline = 'alphabetic'
  c.textAlign = 'left'
  c.fillText(`TN Select · ${data.zh ? '東妮寢飾 Pro Bar' : 'Tonia Nicole Pro Bar'} · ${dateText}`, M, H - 28)
  c.textAlign = 'right'
  c.fillText(`${n} / ${total}`, W - M, H - 28)
  c.textAlign = 'left'
}

function toJpeg(canvas: HTMLCanvasElement): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(b => {
      if (!b) { reject(new Error('Could not encode the page')); return }
      b.arrayBuffer().then(buf => resolve(new Uint8Array(buf)), reject)
    }, 'image/jpeg', 0.9)
  })
}

// ── PDF container ────────────────────────────────────────────────────────────
export interface PdfPage { jpeg: Uint8Array; pxW: number; pxH: number; links: Link[] }

/** Minimal PDF 1.4: one full-page JPEG per page plus URI link annotations. */
export function buildPdf(pages: PdfPage[], title = 'TN Select Sleep Plan'): Uint8Array {
  const enc = new TextEncoder()
  const chunks: Uint8Array[] = []
  const offsets: number[] = []
  let length = 0
  const push = (part: string | Uint8Array) => {
    const bytes = typeof part === 'string' ? enc.encode(part) : part
    chunks.push(bytes); length += bytes.length
  }
  const obj = (id: number, body: string, stream?: Uint8Array) => {
    offsets[id] = length
    push(`${id} 0 obj\n${body}\n`)
    if (stream) { push('stream\n'); push(stream); push('\nendstream\n') }
    push('endobj\n')
  }
  const esc = (s: string) => s.replace(/[\\()]/g, m => `\\${m}`)

  push('%PDF-1.4\n')
  push(new Uint8Array([0x25, 0xe2, 0xe3, 0xcf, 0xd3, 0x0a]))

  // Object ids: 1 catalog, 2 page tree, 3 info, then per page: page, content, image, annotations.
  let next = 4
  const pageIds: number[] = []
  const plan = pages.map(p => {
    const page = next++, content = next++, image = next++
    const annots = p.links.map(() => next++)
    pageIds.push(page)
    return { page, content, image, annots }
  })

  obj(1, '<< /Type /Catalog /Pages 2 0 R >>')
  obj(2, `<< /Type /Pages /Kids [${pageIds.map(id => `${id} 0 R`).join(' ')}] /Count ${pages.length} >>`)
  obj(3, `<< /Title (${esc(title)}) /Producer (TN Select Pro Bar) >>`)

  pages.forEach((p, i) => {
    const ids = plan[i]
    const content = enc.encode(`q ${W} 0 0 ${H} 0 0 cm /Im0 Do Q`)
    obj(ids.page, `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${W} ${H}] /Resources << /XObject << /Im0 ${ids.image} 0 R >> >> /Contents ${ids.content} 0 R /Annots [${ids.annots.map(id => `${id} 0 R`).join(' ')}] >>`)
    obj(ids.content, `<< /Length ${content.length} >>`, content)
    obj(ids.image, `<< /Type /XObject /Subtype /Image /Width ${p.pxW} /Height ${p.pxH} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${p.jpeg.length} >>`, p.jpeg)
    p.links.forEach((l, k) => {
      const r = [l.x, H - l.y - l.h, l.x + l.w, H - l.y].map(v => v.toFixed(1)).join(' ')
      obj(ids.annots[k], `<< /Type /Annot /Subtype /Link /Rect [${r}] /Border [0 0 0] /A << /S /URI /URI (${esc(encodeURI(l.url))}) >> >>`)
    })
  })

  const xref = length
  push(`xref\n0 ${next}\n0000000000 65535 f \n`)
  for (let id = 1; id < next; id++) push(`${String(offsets[id]).padStart(10, '0')} 00000 n \n`)
  push(`trailer\n<< /Size ${next} /Root 1 0 R /Info 3 0 R >>\nstartxref\n${xref}\n%%EOF\n`)

  const out = new Uint8Array(length)
  let at = 0
  for (const ch of chunks) { out.set(ch, at); at += ch.length }
  return out
}

// ── Public API ───────────────────────────────────────────────────────────────
export async function buildSleepPlanPdf(data: ReportData): Promise<File> {
  // Make sure the web fonts are ready before measuring text on the canvas.
  try {
    await Promise.all([
      document.fonts.load(font(10, 400)), document.fonts.load(font(10, 600)),
      document.fonts.load(font(27, 400, SERIF)),
    ])
  } catch { /* system fonts will do */ }

  const cards = data.sections.flatMap(s => s.cards)
  const images = new Map<ReportCard, HTMLImageElement | null>()
  await Promise.all(cards.map(async c => { images.set(c, await loadImage(c.imageUrl)) }))

  const now = new Date()
  const dateText = now.toLocaleDateString(data.zh ? 'zh-TW' : 'en-GB', { year: 'numeric', month: 'long', day: 'numeric' })

  const pages: Page[] = [newPage()]
  let page = pages[0]
  let y = drawHeader(page, data, dateText)
  const place = (blocks: Block[]) => {
    // Keep a group together (a section heading never sits alone at the foot of a page).
    const total = blocks.reduce((s, b) => s + b.h, 0)
    if (y + total > BOTTOM && y > TOP) { page = newPage(); pages.push(page); y = TOP }
    for (const b of blocks) { b.draw(page, y); y += b.h }
  }

  const measure = page.ctx
  if (data.heard.length) place([heardBlock(measure, data)])
  for (const s of data.sections) {
    if (!s.cards.length) continue
    y += 4
    s.cards.forEach((c, i) => {
      const block = cardBlock(measure, c, images.get(c) ?? null, data.zh)
      place(i === 0 ? [sectionHeading(s.label), block] : [block])
    })
  }
  pages.forEach((p, i) => drawFooter(p, data, dateText, i + 1, pages.length))

  const pdfPages: PdfPage[] = []
  for (const p of pages) {
    pdfPages.push({ jpeg: await toJpeg(p.canvas), pxW: p.canvas.width, pxH: p.canvas.height, links: p.links })
  }
  const stamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
  const bytes = buildPdf(pdfPages)
  return new File([bytes.buffer as ArrayBuffer], `TN-Select-Sleep-Plan-${stamp}.pdf`, { type: 'application/pdf' })
}

const isIOS = () =>
  /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)

/** True where the system share sheet ("Save to Files") is the dependable way to keep a file. */
export function usesShareSheet(file?: File): boolean {
  if (!isIOS() || typeof navigator.share !== 'function' || typeof navigator.canShare !== 'function') return false
  try { return navigator.canShare({ files: [file ?? new File([''], 'plan.pdf', { type: 'application/pdf' })] }) }
  catch { return false }
}

export function downloadFile(file: File) {
  const url = URL.createObjectURL(file)
  const a = document.createElement('a')
  a.href = url; a.download = file.name; a.rel = 'noopener'
  document.body.appendChild(a); a.click(); a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 60000)
}

export type Delivery = 'shared' | 'downloaded' | 'cancelled'

/**
 * Hand the file to the user. iPhone / iPad: the share sheet, which Safari only
 * opens from a fresh tap, so this rejects with NotAllowedError when called too
 * long after one. Everything else: a normal browser download.
 */
export async function deliverFile(file: File): Promise<Delivery> {
  if (usesShareSheet(file)) {
    try { await navigator.share({ files: [file] }); return 'shared' }
    catch (e) {
      const name = (e as DOMException)?.name
      if (name === 'AbortError') return 'cancelled'   // user closed the sheet
      if (name === 'NotAllowedError') throw e         // needs another tap
    }
  }
  downloadFile(file)
  return 'downloaded'
}
