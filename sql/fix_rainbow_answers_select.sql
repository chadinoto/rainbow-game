-- ============================================================
-- FIX: de kalender toont niets, terwijl er WEL antwoorden in de tabel staan.
-- Oorzaak: rainbow_answers heeft RLS aan met een INSERT-policy (schrijven lukt),
-- maar GEEN SELECT-policy → de app mag z'n eigen rijen niet teruglezen.
--
-- Draai dit in Supabase → SQL Editor → New query → Run.
-- ============================================================

-- 1) DIAGNOSE: welke policies bestaan er nu op de tabel?
--    Zie je hier geen regel met cmd = 'SELECT', dan is dat precies het probleem.
select policyname, cmd, qual
from pg_policies
where schemaname = 'public' and tablename = 'rainbow_answers';

-- 2) FIX: zorg dat de tabel leesbaar is voor de eigenaar van de rijen.
alter table public.rainbow_answers enable row level security;

grant select on public.rainbow_answers to authenticated;

drop policy if exists "rainbow_answers_select_own" on public.rainbow_answers;
create policy "rainbow_answers_select_own"
  on public.rainbow_answers for select
  using (auth.uid() = user_id);

-- 3) CONTROLE: dit hoort nu jouw eigen rijen terug te geven (draai als ingelogde app,
--    of check via de app). In de SQL-editor draai je als beheerder, dus deze telt alles:
-- select player, count(*) from public.rainbow_answers group by player;
