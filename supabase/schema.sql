-- ============================================================================
--  TN Select — Supabase schema  (v2: FET.com catalog, products-only admin)
--  Run in the Supabase SQL editor. Safe to re-run.
--  v2 drops the question / scoring tables: questions, flow and matching
--  weights now live in code. The client edits products only.
-- ============================================================================

-- ── Retire v1 tables ─────────────────────────────────────────────────────────
drop table if exists scoring_rules;
drop table if exists question_options;
drop table if exists questions;
drop table if exists products;       -- v1 shape is incompatible; recreated below

-- ── Catalog: products (one row = one live FET.com listing) ───────────────────
create table products (
  id          text primary key,            -- FET.com SalePage id, e.g. '7013366'
  category    text not null check (category in ('sheet','comforter','pillow')),
  name_zh     text not null,
  name_en     text not null,
  type_zh     text,                        -- 羽絨 / 乳膠 / 蠶絲 / 80支天絲…
  type_en     text,
  url         text not null,               -- https://www.fet.com.tw/SalePage/Index/<id>
  image_url   text,                        -- defaults to the 91App CDN main photo
  price_twd   int,
  bullets_zh  jsonb not null default '[]'::jsonb,
  bullets_en  jsonb not null default '[]'::jsonb,
  match       jsonb not null default '{}'::jsonb,   -- { questionKey: [answer, …] } (pillows / comforters)
  material    text check (material is null or material in ('tencel80','tencel60','cotton60','cotton40','cotton500','topcool')),
  style       text check (style is null or style in ('Nature','Minimal','Playful','Classic')),
  sort_order  int  not null default 0,
  active      boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists products_category_idx on products (category, sort_order);

-- ── Captured responses (unchanged from v1) ───────────────────────────────────
create table if not exists responses (
  id                 uuid primary key default gen_random_uuid(),
  created_at         timestamptz not null default now(),
  name               text,
  email              text,
  lang               text,
  answers            jsonb not null default '{}'::jsonb,
  completed_sections jsonb not null default '[]'::jsonb,
  recommendation     jsonb not null default '{}'::jsonb
);
create index if not exists responses_created_idx on responses (created_at desc);

-- ── Admin allowlist ──────────────────────────────────────────────────────────
create table if not exists admins (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  email      text,
  created_at timestamptz not null default now()
);

-- ============================================================================
--  Row-level security
-- ============================================================================
create or replace function is_admin() returns boolean
  language sql security definer stable
  set search_path = public
as $$
  select exists (select 1 from admins where user_id = auth.uid());
$$;

alter table products  enable row level security;
alter table responses enable row level security;
alter table admins    enable row level security;

-- Public app reads active products; admins read everything.
drop policy if exists "read products"  on products;
create policy "read products"  on products  for select using (active or is_admin());
drop policy if exists "write products" on products;
create policy "write products" on products  for all using (is_admin()) with check (is_admin());

-- Anyone may insert a response (the kiosk is anonymous); only admins read/delete.
drop policy if exists "insert responses" on responses;
create policy "insert responses" on responses for insert with check (true);
drop policy if exists "read responses" on responses;
create policy "read responses"   on responses for select using (is_admin());
drop policy if exists "delete responses" on responses;
create policy "delete responses" on responses for delete using (is_admin());

-- Admins can see the allowlist (used by the /admin gate); nobody writes it from the app.
drop policy if exists "read admins" on admins;
create policy "read admins" on admins for select using (auth.uid() = user_id);

-- updated_at trigger
create or replace function set_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;
drop trigger if exists products_updated_at on products;
create trigger products_updated_at before update on products for each row execute function set_updated_at();
