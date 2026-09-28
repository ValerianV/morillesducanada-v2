-- Déduplication des emails de statut (notify-order-status).
--
-- Contexte : un changement de statut peut être notifié deux fois, par le trigger SQL
-- (notify_order_status_change / notify_preorder_status_change) et par l'appel explicite
-- de l'AdminDashboard. La fonction edge « réserve » une clé
-- `<type>:<id>:<status>:<updated_at>` avant d'envoyer ; le second appel est ignoré.
--
-- Idempotente : peut être rejouée sans erreur.
-- Si cette migration n'est pas appliquée, notify-order-status envoie quand même
-- (sans déduplication) et journalise un avertissement.

CREATE TABLE IF NOT EXISTS public.notification_dedup (
  key text PRIMARY KEY,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.notification_dedup ENABLE ROW LEVEL SECURITY;
-- Aucune policy : seules les fonctions SECURITY DEFINER / service_role y accèdent.
REVOKE ALL ON public.notification_dedup FROM anon, authenticated;

CREATE OR REPLACE FUNCTION public.claim_notification(_key text, _window interval DEFAULT interval '10 minutes')
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  claimed text;
BEGIN
  DELETE FROM public.notification_dedup WHERE created_at < now() - interval '30 days';

  INSERT INTO public.notification_dedup AS d (key, created_at)
  VALUES (_key, now())
  ON CONFLICT (key) DO UPDATE
    SET created_at = now()
    WHERE d.created_at < now() - _window
  RETURNING d.key INTO claimed;

  RETURN claimed IS NOT NULL;
END;
$$;

REVOKE ALL ON FUNCTION public.claim_notification(text, interval) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.claim_notification(text, interval) TO service_role;
