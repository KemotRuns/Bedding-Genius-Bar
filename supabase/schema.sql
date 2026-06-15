-- ============================================================================
--  TN Select — Supabase schema
--  Run this in the Supabase SQL editor (Dashboard → SQL Editor → New query).
--  Safe to re-run: uses "if not exists" / "or replace" where possible.
-- ============================================================================

-- ── Catalog: products ────────────────────────────────────────────────────────
create table if not exists products (
  id             uuid primary key default gen_random_uuid(),
  category       text not null check (category in ('sheet','comforter','pillow')),
  code           text not null,                    -- e.g. P001 / PL001 / C001
  name           text not null,
  name_zh        text,
  sku            text,
  collection     text,
  material       text,                             -- sheets: top-level scoring field
  weave          text,                             -- sheets
  thread_count   int,                              -- sheets
  fill           text,                             -- pillows / comforters
  description    text,
  description_zh text,
  best_for       jsonb not null default '[]'::jsonb,
  best_for_zh    jsonb not null default '[]'::jsonb,
  attributes     jsonb not null default '{}'::jsonb,  -- material, weave, temperature, fill, loft, firmness, warmth, washable, hypoallergenic, weight…
  ratings        jsonb not null default '{}'::jsonb,  -- breathability, wicking, warmth, softness, fluffiness
  sort_order     int  not null default 0,
  active         boolean not null default true,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
create index if not exists products_category_idx on products (category, sort_order);

-- ── Questions & options ──────────────────────────────────────────────────────
create table if not exists questions (
  id          uuid primary key default gen_random_uuid(),
  key         text not null unique,               -- e.g. nightHeat (matches answer keys + scoring)
  section     text not null check (section in ('sheets','comforter','pillow')),
  question    text not null,
  question_zh text,
  columns     int  not null default 4 check (columns in (2,3,4)),
  sort_order  int  not null default 0,
  active      boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists questions_section_idx on questions (section, sort_order);

create table if not exists question_options (
  id          uuid primary key default gen_random_uuid(),
  question_id uuid not null references questions(id) on delete cascade,
  value       text not null,                      -- e.g. 'Very Hot'
  label       text not null,
  label_zh    text,
  sublabel    text,
  sublabel_zh text,
  icon_key    text,                               -- references the icon registry in code
  sort_order  int  not null default 0
);
create index if not exists question_options_q_idx on question_options (question_id, sort_order);

-- ── Scoring rules (data-driven engine) ───────────────────────────────────────
create table if not exists scoring_rules (
  id              uuid primary key default gen_random_uuid(),
  question_key    text not null,                  -- which answer triggers this (matches questions.key)
  answer_value    text not null,                  -- the option value
  target_category text not null check (target_category in ('sheet','comforter','pillow')),
  attribute_path  text not null,                  -- e.g. attributes.temperature | ratings.breathability | attributes.material
  operator        text not null check (operator in ('eq','neq','gte','lte','gt','lt')),
  compare_value   text not null,                  -- compared as number when both sides are numeric, else as string
  points          int  not null,
  reason          text,
  reason_zh       text,
  also_question_key text,                          -- optional 2nd condition: rule fires only if this answer also matches
  also_answer_value text,
  active          boolean not null default true,
  created_at      timestamptz not null default now()
);
create index if not exists scoring_rules_lookup_idx on scoring_rules (question_key, answer_value, target_category);

-- ── Captured responses ───────────────────────────────────────────────────────
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

alter table products         enable row level security;
alter table questions        enable row level security;
alter table question_options enable row level security;
alter table scoring_rules    enable row level security;
alter table responses        enable row level security;
alter table admins           enable row level security;

-- Public app reads catalog / questions / rules; admins read everything incl. inactive.
drop policy if exists "read products"  on products;
create policy "read products"  on products  for select using (active or is_admin());
drop policy if exists "read questions" on questions;
create policy "read questions" on questions for select using (active or is_admin());
drop policy if exists "read options"   on question_options;
create policy "read options"   on question_options for select using (true);
drop policy if exists "read rules"     on scoring_rules;
create policy "read rules"     on scoring_rules for select using (active or is_admin());

-- Only admins write catalog / questions / rules.
drop policy if exists "write products"  on products;
create policy "write products"  on products  for all using (is_admin()) with check (is_admin());
drop policy if exists "write questions" on questions;
create policy "write questions" on questions for all using (is_admin()) with check (is_admin());
drop policy if exists "write options"   on question_options;
create policy "write options"   on question_options for all using (is_admin()) with check (is_admin());
drop policy if exists "write rules"     on scoring_rules;
create policy "write rules"     on scoring_rules for all using (is_admin()) with check (is_admin());

-- Responses: anyone (anon public app) can insert; only admins can read / delete.
drop policy if exists "insert responses" on responses;
create policy "insert responses" on responses for insert with check (true);
drop policy if exists "read responses"   on responses;
create policy "read responses"   on responses for select using (is_admin());
drop policy if exists "delete responses" on responses;
create policy "delete responses" on responses for delete using (is_admin());

-- Admins table readable only by admins.
drop policy if exists "read admins" on admins;
create policy "read admins" on admins for select using (is_admin());
