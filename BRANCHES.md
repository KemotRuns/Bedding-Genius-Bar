# Project Notes — Tonia Nicole Pro Bar

## Branch Map

| Branch | Status | Base | Description |
|--------|--------|------|-------------|
| `main` | **Stable / Live** | — | v1.1 — 7-question quiz, 3-product results (sheets, pillow, comforter) |
| `develop` | Integration | main | Mirror of main. Merge features here before promoting to main. |
| `feature/v1.2-advisory-questions` | In Review | main | 11 advisory questions split into 3 labeled sections. Not yet merged. |
| `feature/v1.3-product-sections` | In Progress | v1.2 | Landing with 3 product entry points; per-product quiz and results flows |

---

## Version History

### v1.1 — `main` (current live)
- Comforter added as third recommendation (Silk, Wool, Down, Tech Fiber)
- Shoulder width Q improved with shirt-size anchors (S/XS / M/L / XL+) and cm measurements
- Question order: sleep behaviour first (position → shoulder → temp → skin → maintenance → pets)
- Results page: renamed "Sleep Profile Report" (removed "TN Pairing"), comforter card with 3 rating bars, SKU + collection shown on all product cards
- Complete Setup bundle lists all 4 items (sheets, pillow, comforter, duvet cover)

### v1.2 — `feature/v1.2-advisory-questions`
- Replaced 7 generic questions with 11 advisory questions mapped to TN Select PDF methodology
- Questions phrased as real problem scenarios with material hints in sublabels
- Section dividers in quiz: **Sheets & Materials** (×4) / **Comforter** (×3) / **Pillows** (×4)
- New answer keys: `nightHeat`, `skinType`, `careLevel`, `sensoryPref`, `comforterTemp`, `comforterFeel`, `breathingIssues`, `sleepPosition`, `shoulderWidth`, `pillowFeel`, `pillowPriority`
- Engine scoring per category uses dedicated answer signals
- Sidebar Live Analysis and WhyCard updated to new answer keys

### v1.3 — `feature/v1.3-product-sections` *(in progress)*
- Landing page: keep logo + Chinese/English heading, replace service tiles with **3 product entry cards** (Bedding, Comforter, Pillow) each with a sleep benefit description
- Per-product quiz: user only answers questions relevant to their chosen product section
- Per-product results: focused diagnosis for selected product + links to enter other sections
- Fabric texture simulator removed from results
- Built on top of v1.2 question structure

---

## Branching Workflow

```
main  (live / Netlify deploy)
  └── develop  (integration — test merged features here first)
        └── feature/*  (individual experiments and iterations)
```

1. New work → `git checkout -b feature/my-feature` (branch from latest relevant base)
2. Build and test on the feature branch
3. When ready → open PR into `develop` for review
4. After validation → merge `develop` → `main` to deploy to Netlify

## Notes
- Netlify deploys from `main` automatically on push
- Each feature branch can get a Netlify deploy preview via the GitHub PR (enable in Netlify dashboard → Deploy previews)
