-- ============================================================
-- DE OORZAAK: het letterspel kan niet opgeslagen worden.
--
-- given_answer en correct_answer zijn INTEGER-kolommen. Zolang Lea
-- rekende ging dat goed (7, 12, 40...). Maar sinds het beginletter-spel
-- (4 augustus) stuurt de app een LETTER als antwoord — "A", "B", "K" —
-- en daar zegt Postgres botweg nee tegen:
--
--     22P02  invalid input syntax for type integer: "A"
--
-- De app slikte die fout stil in, dus alles zag er normaal uit terwijl
-- élk letterantwoord bij de database van de stoep werd gestuurd.
-- Daarom stonden er van 5 augustus maar 12 rijen: dat waren de sommen
-- van rond 12u. Alles wat ze daarna met letters deed, is geweigerd.
--
-- Draai dit in Supabase → SQL Editor → New query → Run.
-- ============================================================

-- 1) DIAGNOSE: zo zien de kolommen er nu uit (given_answer/correct_answer = integer)
select column_name, data_type
from information_schema.columns
where table_schema = 'public' and table_name = 'rainbow_answers'
order by ordinal_position;

-- 2) DE FIX: maak er tekstkolommen van. Getallen blijven gewoon werken
--    (7 wordt '7'), en letters passen er voortaan ook in.
alter table public.rainbow_answers
  alter column given_answer   type text using given_answer::text,
  alter column correct_answer type text using correct_answer::text;

-- 3) CONTROLE: staat er nu 'text' bij allebei? Dan is het opgelost.
select column_name, data_type
from information_schema.columns
where table_schema = 'public'
  and table_name = 'rainbow_answers'
  and column_name in ('given_answer', 'correct_answer');

-- 4) Zijn er nog andere hindernissen op de tabel (check-constraints op level,
--    NOT NULL op een kolom die de app niet meestuurt)? Hier hoort niets
--    te staan dat niveau 19 in de weg zit.
select conname, pg_get_constraintdef(oid) as regel
from pg_constraint
where conrelid = 'public.rainbow_answers'::regclass
  and contype in ('c', 'f');

-- 5) NA DE FIX — controle dat het letterspel binnenkomt.
--    Laat Lea één regenboog met letters spelen en draai dan dit:
select
  created_at at time zone 'Europe/Brussels' as tijdstip,
  exercise, given_answer, correct_answer, is_correct
from public.rainbow_answers
where player = 'Lea' and level = 19
order by created_at desc
limit 20;
