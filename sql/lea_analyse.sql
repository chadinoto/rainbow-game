-- ============================================================
-- Lea — foutenanalyse. Draai elke query apart in Supabase → SQL Editor,
-- en plak de uitkomst terug. Alles filtert op player = 'Lea'.
-- ============================================================

-- QUERY A — overzicht per oefening (niveau): hoeveel, hoe juist, hoe snel
select
  level,
  count(*)                                              as antwoorden,
  sum((is_correct)::int)                                as goed,
  round(100.0 * sum((is_correct)::int) / count(*), 0)   as pct_goed,
  round(avg(coalesce(duration_ms, 0)) / 1000.0, 1)      as sec_gemiddeld
from public.rainbow_answers
where player = 'Lea'
group by level
order by level;

-- QUERY B — welke concrete sommen gaan fout (en wat tikte ze dan?)
-- Dit toont het patroon: verwisselt ze cijfers, telt ze er 1 naast, hapert ze over de 10?
select
  level,
  exercise,
  correct_answer,
  count(*)                                                                          as keer_gemaakt,
  sum((not is_correct)::int)                                                        as keer_fout,
  string_agg(distinct case when not is_correct then given_answer::text end, ', ')   as foute_antwoorden
from public.rainbow_answers
where player = 'Lea'
group by level, exercise, correct_answer
having sum((not is_correct)::int) > 0
order by keer_fout desc, keer_gemaakt desc
limit 40;

-- QUERY C — gaat het vooruit? Juistheid per week (laatste weken onderaan)
select
  date_trunc('week', (created_at at time zone 'Europe/Brussels'))::date  as week_van,
  count(*)                                              as antwoorden,
  round(100.0 * sum((is_correct)::int) / count(*), 0)   as pct_goed
from public.rainbow_answers
where player = 'Lea'
group by 1
order by 1;
