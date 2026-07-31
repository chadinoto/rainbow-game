-- ============================================================
-- Wat zou de kalender voor Lea moeten tonen? Cijfers per dag.
-- Draai in Supabase → SQL Editor → Run, en plak me de uitkomst.
-- ============================================================

select
  (created_at at time zone 'Europe/Brussels')::date            as dag,
  count(*)                                                       as antwoorden,
  sum((is_correct)::int)                                        as goed,
  count(duration_ms)                                            as met_duur,     -- moet = antwoorden zijn
  round(sum(coalesce(duration_ms, 0)) / 60000.0, 1)            as minuten,      -- 0 => duration_ms is leeg
  array_agg(distinct level order by level)                      as niveaus
from public.rainbow_answers
where player = 'Lea'
group by 1
order by 1 desc;
