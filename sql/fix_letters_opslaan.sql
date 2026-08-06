-- ============================================================
-- DE FIX — dit lost het letterspel op. Nog niet gedraaid = nog steeds stuk.
--
-- Waar: supabase.com → jouw project → SQL Editor → New query
--       → alles hieronder plakken → Run (of Ctrl/Cmd + Enter)
--
-- Waarom: given_answer en correct_answer zijn INTEGER-kolommen. Sommen
-- (7, 12, 40) passen daarin, maar het beginletter-spel stuurt een LETTER
-- ("A", "B", "K") en daar zegt Postgres nee tegen:
--     22P02  invalid input syntax for type integer: "A"
-- Elk letterantwoord van Lea wordt daarom geweigerd vóór het opgeslagen is.
--
-- Getallen die er al in staan blijven gewoon werken (7 wordt '7').
-- ============================================================

alter table public.rainbow_answers
  alter column given_answer   type text using given_answer::text,
  alter column correct_answer type text using correct_answer::text;


-- ============================================================
-- CONTROLE — draai dit ná bovenstaande. Er hoort nu 2x 'text' te staan.
-- Staat er nog 'integer'? Dan is de alter niet gelukt; stuur me dan de
-- foutmelding die de SQL Editor toont.
-- ============================================================

-- select column_name, data_type
-- from information_schema.columns
-- where table_schema = 'public'
--   and table_name = 'rainbow_answers'
--   and column_name in ('given_answer', 'correct_answer');
