-- Optimisation des accès disque (incident du 2026-09-28).
-- Le journal cron.job_run_details avait atteint 134 Mo (une ligne par minute, jamais purgé)
-- et épuisait le budget Disk IO de l'instance NANO : base injoignable plusieurs heures.
-- Correctif appliqué à la main en production le 2026-09-28 ; cette migration le rend reproductible.
-- Idempotente : peut être rejouée sans effet de bord.

-- 1. Traitement de la file d'emails toutes les 5 minutes au lieu de chaque minute.
select cron.alter_job(jobid, schedule := '*/5 * * * *', active := true)
from cron.job
where jobname = 'process-email-queue';

-- 2. Purge quotidienne du journal du cron (conserve 2 jours d'historique).
select cron.unschedule(jobid) from cron.job where jobname = 'nettoyage-journal-cron';
select cron.schedule(
  'nettoyage-journal-cron',
  '17 3 * * *',
  $$delete from cron.job_run_details where end_time < now() - interval '2 days'$$
);
