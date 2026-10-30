# TN Select — Report page design export

Everything needed to iterate on the **Sleep Plan / report** page design.

## Files
- **`report-page.html`** — ⭐ the one to hand over. Fully self-contained: Google Fonts link + all compiled CSS inlined + the report markup with realistic dummy content (a warm/sensitive-skin sleeper, all 3 sections complete). Open it in any browser and it renders exactly like the live report page.
- `report-styles.css` — the raw compiled CSS on its own (Tailwind utilities + custom tokens), if a tool wants CSS separately.
- `report-body.html` — just the report markup (no `<head>`/CSS), if a tool wants markup separately.

## How it's styled
Built with **Tailwind CSS** (utility classes in the markup). The CSS in `report-styles.css` is Tailwind's compiled output — so restyling means either editing utility classes in the markup or overriding these tokens.

## Design tokens
Colors:
| Token | Hex | Use |
|---|---|---|
| cream | `#FAF7F0` | page background |
| charcoal | `#2A1F14` | text, dark header, primary buttons |
| sage | `#7A9A77` | accents, sheet/pillow cards |
| sage-dark | `#567A53` | badge text/icons |
| sage-light | `#B8D4B5` | — |
| gold | `#C49A6C` | comforter accent, match ring, CTAs |
| gold-light | `#E8D5B7` | header eyebrow text |

Fonts:
- Headings: **Playfair Display** (serif)
- Body/UI: **Inter** (sans)

Signature surface — the frosted "glass-card":
```css
.glass-card {
  background: rgba(255,255,255,0.6);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255,255,255,0.8);
  box-shadow: 0 4px 24px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.8);
  border-radius: 1rem;
}
```

## Page structure (top → bottom)
1. Dark charcoal→gold gradient **header**: brand eyebrow, "Your Sleep Plan" title, "X of 3 complete", Start-over link, profile badges, and clickable section tracker pills.
2. **Three prescription cards** (Sheets, Comforter, Pillow) — each: colored header strip with product name + collection + material/SKU tags + circular **match ring**, then description, horizontal **attribute bars**, and best-for tag chips. Each card has an "Edit answers" link.
   - Pending sections (not shown in this snapshot) render as a dashed "Not done yet — Start →" card instead.
3. **Save card** — name + optional email + "Save my plan".
4. Footer.

## Notes for the designer
- The real page animates in with Framer Motion (fade/slide); the snapshot is static.
- Bilingual EN / 繁中 in production — keep layouts tolerant of longer/CJK strings.
- It's a retail **kiosk/iPad** tool, so it should read well on tablet screens.
