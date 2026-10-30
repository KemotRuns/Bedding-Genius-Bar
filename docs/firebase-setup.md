# Firebase setup (v2.1)

The app uses Firebase for two things: the product catalog the client edits in
`/admin` (Firestore `products`) and captured sleep plans (Firestore `responses`),
plus Firebase Auth (email + password) for the admin login. Free Spark plan; no
billing account needed; projects never pause.

## 1. Project + web app
Firebase console → Add project (e.g. `tn-select`) → Project settings → *Your apps*
→ Web app. Copy the config into `.env.local` (and Netlify → Site configuration →
Environment variables):
```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=<project>.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_APP_ID=
VITE_ADMIN_EMAILS=tom@brainiakconsulting.com
```
Or from the CLI: `npx firebase-tools apps:sdkconfig WEB --project <id>`.

## 2. Firestore + rules
Console → Build → Firestore Database → Create (production mode, region
`asia-east1` Taiwan). Then deploy the rules from this repo:
```bash
npx firebase-tools login
npx firebase-tools deploy --only firestore:rules --project <id>
```
`firestore.rules` holds the admin allowlist (emails). Adding an admin = add the
email there, redeploy rules, and add it to `VITE_ADMIN_EMAILS`.

## 3. Admin login
Console → Build → Authentication → Get started → Sign-in method → enable
**Email/Password**. Then Users → Add user (the admin email + a password).

## 4. Seed the catalog
Open `/admin`, sign in, Products tab → **Import built-in catalog**. That writes
the 45 products from `src/data/catalog.json` into Firestore. The same button
later restores the built-in set (products the client added are kept).

Until the import runs, the kiosk serves the bundled catalog, so nothing breaks.

## Data shapes
- `products/{fetId}`: `category, name_zh, name_en, type_zh, type_en, url,
  image_url, price_twd, bullets_zh[], bullets_en[], match{}, material, style,
  sort_order, active`
- `responses/{auto}`: `created_at (ISO), name, email, lang, answers{},
  completed_sections[], recommendation{sheet,comforter,pillow}`
