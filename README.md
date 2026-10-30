# TN Select — Tonia Nicole Pro Bar

Kiosk / web sleep-consultation tool for Far Eastern Apparel (FEAC)'s Tonia Nicole bedding brand.
A customer picks a product section (bedding set, comforter, pillow), answers 5 questions, and gets a
recommended FET.com product with photo, selling points and a link, plus a runner-up.
Bilingual EN / 繁體中文.

## Stack
React 19 · TypeScript · Vite · Tailwind 3 · Framer Motion · Firebase (Firestore products + responses, Auth for admin).
Falls back to the bundled catalog (`src/data/catalog.json`) when Firebase is not configured or unreachable.

## Run
```bash
cp .env.example .env.local   # add the VITE_FIREBASE_* values (optional)
npm install
npm run dev                  # http://localhost:5173
npm run build                # dist/ (Netlify deploys main)
```

## Where things live
| What | Where | Who edits |
|---|---|---|
| Products (names, link, photo, bullets, when to recommend) | Firestore `products` via `/admin`, seed in `src/data/catalog.json` | Client (FEAC) |
| Questions & answer options | `src/lib/questionData.ts` | Brainiak |
| Matching weights, bedding material rules | `src/lib/engine.ts` | Brainiak |
| Results page layout | `src/pages/Results.tsx` | Brainiak |
| Live-analysis sidebar copy | `src/components/quiz/Sidebar.tsx` | Brainiak |

## Updating the catalog seed
Edit `src/data/catalog.json`, then in `/admin` click **Restore built-in catalog** (upserts by FET id;
products the client added and all responses are untouched). Security rules: `firestore.rules`.

See `BRANCHES.md` for version history and `docs/firebase-setup.md` for backend setup.
