-- ============================================================
-- "Lea heeft vandaag méér geoefend dan die ene diamant" — waar bleef de rest?
-- Draai in Supabase → SQL Editor → New query → Run.
-- (Daar geldt RLS niet, dus je ziet ALLE rijen — precies wat we willen.)
--
-- UITKOMST RONDE 1: er staan vandaag maar 12 antwoorden in de database,
-- allemaal rond 12u. De kalender toont dus eerlijk wat er ís — het probleem
-- zit ervóór: de antwoorden komen niet meer aan. Onderstaande queries
-- zoeken uit wanneer en waarom het stopte.
-- ============================================================

-- QUERY A — speelde ze misschien onder een ander profiel of ander account?
-- Als hier een ándere speler (of user_id) met veel rijen van vandaag staat,
-- is er niets kwijt: het staat gewoon op de verkeerde naam.
select
  player,
  user_id,
  count(*)                                          as antwoorden,
  min(created_at at time zone 'Europe/Brussels')    as van,
  max(created_at at time zone 'Europe/Brussels')    as tot
from public.rainbow_answers
where (created_at at time zone 'Europe/Brussels')::date
      = (now() at time zone 'Europe/Brussels')::date
group by player, user_id
order by antwoorden desc;

-- QUERY B — DE BESLISSENDE: wat zeggen de sessies van vandaag?
-- Een sessie wordt pas weggeschreven aan het EIND van een regenboog, met de
-- eigen telling van goed/fout. Staan hier veel meer 'goed' dan de 12 antwoorden
-- uit ronde 1, dan was de app gewoon online en faalde specifiek het wegschrijven
-- van de losse antwoorden. Staat hier óók niets, dan lag de hele verbinding plat
-- (offline, of de login was verlopen).
select
  player,
  level_name,
  started_at at time zone 'Europe/Brussels'   as gestart,
  ended_at   at time zone 'Europe/Brussels'   as geëindigd,
  correct                                     as goed,
  wrong                                       as fout,
  completed                                   as diamant,
  round(duration_ms / 60000.0, 1)             as minuten
from public.rainbow_sessions
where (started_at at time zone 'Europe/Brussels')::date
      = (now() at time zone 'Europe/Brussels')::date
order by started_at;

-- QUERY C — wanneer viel het stil? De laatste 20 antwoorden van Lea,
-- nieuwste bovenaan. Kijk naar het gat: daar stopte het loggen.
select
  created_at at time zone 'Europe/Brussels'  as tijdstip,
  level_name,
  exercise,
  given_answer,
  is_correct,
  duration_ms
from public.rainbow_answers
where player = 'Lea'
order by created_at desc
limit 20;

-- QUERY D — is dit vandaag begonnen of sluimert het al langer?
-- Per dag: antwoorden uit rainbow_answers naast het aantal goed/fout dat de
-- sessies van die dag beweren. Lopen die twee uit elkaar, dan gingen er die
-- dag antwoorden verloren.
with a as (
  select (created_at at time zone 'Europe/Brussels')::date as dag, count(*) as antwoorden
  from public.rainbow_answers where player = 'Lea' group by 1
),
s as (
  select (started_at at time zone 'Europe/Brussels')::date as dag,
         count(*) as sessies, sum(correct + wrong) as sessie_antwoorden
  from public.rainbow_sessions where player = 'Lea' group by 1
)
select coalesce(a.dag, s.dag) as dag,
       a.antwoorden, s.sessies, s.sessie_antwoorden,
       s.sessie_antwoorden - a.antwoorden as verschil
from a full join s on a.dag = s.dag
order by 1 desc;
