# TN Select — Tonia Nicole Pro Bar

Kiosk / web sleep-consultation tool for Far Eastern Apparel (FEAC)'s Tonia Nicole bedding brand.
A customer picks a product section (bedding set, comforter, pillow), answers 5 questions, and gets a
recommended FET.com product with photo, selling points and a link, plus a runner-up.
Bilingual EN / 繁體中文.

## Stack
React 19 · TypeScript · Vite · Tailwind 3 · Framer Motion · Supabase (products + responses + admin auth).
Falls back to the bundled catalog (`src/data/catalog.json`) when Supabase is not configured or unreachable.

## Run
```bash
cp .env.example .env.local   # add VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY (optional)
npm install
npm run dev                  # http://localhost:5173
npm run build                # dist/ (Netlify deploys main)
```

## Where things live
| What | Where | Who edits |
|---|---|---|
| Products (names, link, photo, bullets, when to recommend) | Supabase `products` via `/admin`, seed in `src/data/catalog.json` | Client (FEAC) |
| Questions & answer options | `src/lib/questionData.ts` | Brainiak |
| Matching weights, bedding material rules | `src/lib/engine.ts` | Brainiak |
| Results page layout | `src/pages/Results.tsx` | Brainiak |
| Live-analysis sidebar copy | `src/components/quiz/Sidebar.tsx` | Brainiak |

## Updating the catalog seed
Edit `src/data/catalog.json`, then `npx tsx scripts/gen-seed.ts` and run `supabase/seed.sql` in the
Supabase SQL editor (upserts by FET id; leaves responses untouched). Schema: `supabase/schema.sql`.

See `BRANCHES.md` for version history and `docs/supabase-setup.md` for backend setup.
