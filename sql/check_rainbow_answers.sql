-- ============================================================
-- DIAGNOSE + FIX voor "de kalender toont niets bij Lea"
-- Draai dit in Supabase → SQL Editor → New query → Run.
-- (Daar geldt de RLS-afscherming niet, dus je ziet ALLE rijen.)
-- ============================================================

-- 1) Staan er überhaupt antwoorden per speler? En hebben ze een datum?
--    with_ts moet gelijk zijn aan total. Is with_ts = 0 terwijl total > 0,
--    dan is created_at leeg (NULL) → dát is waarom de kalender niets toont.
select player,
       count(*)            as total,
       count(created_at)   as with_ts,
       min(created_at)     as eerste,
       max(created_at)     as laatste
from public.rainbow_answers
group by player
order by player;

-- 2) FIX voor de toekomst: geef created_at een standaardwaarde,
--    zodat nieuwe antwoorden altijd een tijd krijgen (ook los van de app-fix).
alter table public.rainbow_answers
  alter column created_at set default now();

-- 3) NOODOPLOSSING voor bestaande rijen zónder tijd:
--    echte tijden zijn niet meer te achterhalen, maar om te vermijden dat
--    gisteren volledig "verdwijnt", kun je de lege rijen op vandaag zetten.
--    ▶ Alleen uitvoeren als stap 1 liet zien dat with_ts = 0 (haal de -- weg):
-- update public.rainbow_answers set created_at = now() where created_at is null;
