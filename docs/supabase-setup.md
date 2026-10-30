# Supabase setup

This app uses Supabase for: storing user responses, serving the product catalog,
and powering the products-only admin panel.

## 1. Create the project
1. Go to [supabase.com](https://supabase.com) → **New project**.
2. Name it (e.g. `tn-select`), set a strong database password (save it), pick a region close to your users.
3. Wait ~2 min for it to provision.

## 2. Create the schema
1. Dashboard → **SQL Editor → New query**.
2. Paste the entire contents of [`supabase/schema.sql`](../supabase/schema.sql) and **Run**.
3. You should see the tables under **Table Editor**: `products`, `responses`, `admins`.
   (v2: questions and scoring rules live in code, not in the database.)

## 3. Get the API keys
1. Dashboard → **Project Settings → API**.
2. Copy the **Project URL** and the **anon / public** key.
   - The anon key is safe in the client — row-level security controls access.
   - **Never** put the `service_role` key in the app or repo.

## 4. Point the app at it
```bash
cp .env.example .env.local   # if you haven't already
```
Edit `.env.local`:
```
VITE_SUPABASE_URL=https://xxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...your-anon-key...
```
Restart `npm run dev` so Vite picks up the vars. For Netlify, add the same two
variables under **Site settings → Environment variables**.

## 5. Seed the catalog
Run [`supabase/seed.sql`](../supabase/seed.sql) in the SQL Editor. It upserts the
45 FET.com products (bedding sets, comforters, pillows) the app reads at runtime
and that the client edits in `/admin`. Safe to re-run; leaves `responses` untouched.

> Regenerate it any time `src/data/catalog.json` changes: `npx tsx scripts/gen-seed.ts`.

After seeding, the app loads the catalog from Supabase; until then it falls back
to the bundled data, so nothing breaks if the seed hasn't run yet.

## 6. Create an admin user (Phase 2)
1. Dashboard → **Authentication → Users → Add user** (email + password).
2. Copy that user's **UID**.
3. SQL Editor:
   ```sql
   insert into admins (user_id, email) values ('<paste-uid>', 'you@example.com');
   ```
4. That account can now log into `/admin`.
