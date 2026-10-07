-- Budget d'E/S disque (alerte Supabase du 07/10/2026) : la tâche process-email-queue appelait la fonction
-- d'envoi toutes les 5 minutes, même file vide (≈ 290 appels par jour, chacun écrivant dans
-- cron.job_run_details et net._http_response). Elle n'appelle plus la fonction que si un email attend
-- dans l'une des deux files (y compris un message en attente de nouvel essai). Appliquée en production
-- le 07/10/2026. Idempotente : ne fait rien si la tâche n'existe pas.
do $$
declare
  v_job bigint;
begin
  select jobid into v_job from cron.job where jobname = 'process-email-queue';
  if v_job is null then
    return;
  end if;
  perform cron.alter_job(
    job_id := v_job,
    command := $cmd$
SELECT net.http_post(
  url := 'https://oeweykyazadobobjncfg.supabase.co/functions/v1/process-email-queue',
  headers := jsonb_build_object(
    'Content-Type', 'application/json',
    'Authorization', 'Bearer ' || (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'SUPABASE_SERVICE_ROLE_KEY' LIMIT 1)
  ),
  body := '{}'::jsonb
)
WHERE EXISTS (SELECT 1 FROM pgmq.q_auth_emails) OR EXISTS (SELECT 1 FROM pgmq.q_transactional_emails)
$cmd$
  );
end
$$;
