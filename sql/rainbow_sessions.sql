-- ============================================================
-- rainbow_sessions — één rij per oefensessie (één regenboog-poging)
-- Registreert exact: starttijd, eindtijd, duur, niveau, goed/fout,
-- of er een diamant verdiend is en of er een cadeautje behaald is.
--
-- ▶ HOE TOEPASSEN: plak deze hele tekst in je Supabase-project onder
--   "SQL Editor" → "New query" → Run. Dat maakt de tabel + beveiliging aan.
--   Je hoeft dit maar één keer te doen. Bestaat de tabel al, dan doet
--   "if not exists" niets kwaad.
-- ============================================================

create table if not exists public.rainbow_sessions (
  id           bigint generated always as identity primary key,
  user_id      uuid not null default auth.uid() references auth.users (id) on delete cascade,
  player       text not null,
  level        int,
  level_name   text,
  started_at   timestamptz not null,
  ended_at     timestamptz not null default now(),
  duration_ms  int not null default 0,     -- actieve oefentijd (per antwoord gemeten, weglopen telt niet mee)
  correct      int not null default 0,
  wrong        int not null default 0,
  completed    boolean not null default false, -- regenboog vol → een diamant verdiend
  gift_name    text,                        -- naam van het cadeautje als dat deze sessie behaald werd
  gift_art     text,                        -- bijhorend tekeningetje (icecream, lolly, …)
  created_at   timestamptz not null default now()
);

-- Beveiliging: iedereen ziet/schrijft enkel z'n eigen rijen (net als rainbow_answers)
alter table public.rainbow_sessions enable row level security;

drop policy if exists "rainbow_sessions_select_own" on public.rainbow_sessions;
create policy "rainbow_sessions_select_own"
  on public.rainbow_sessions for select
  using (auth.uid() = user_id);

drop policy if exists "rainbow_sessions_insert_own" on public.rainbow_sessions;
create policy "rainbow_sessions_insert_own"
  on public.rainbow_sessions for insert
  with check (auth.uid() = user_id);

-- Nodig zodat de app (ingelogde gebruiker) de tabel mag benaderen
grant select, insert on public.rainbow_sessions to authenticated;

-- Sneller ophalen per speler / op datum
create index if not exists rainbow_sessions_user_player_started_idx
  on public.rainbow_sessions (user_id, player, started_at);
