-- Redirige les triggers de notification vers le projet actuel oeweykyazadobobjncfg.
--
-- Contexte : les migrations 20260302155302 et 20260313202743 codaient en dur l'URL de
-- l'ancien projet Lovable (eozbnwvirdilwslqnkab). Rejouées sur ce projet, elles envoyaient
-- chaque message de contact et chaque changement de statut vers l'ancien projet, avec la
-- clé service_role de CE projet dans l'en-tête Authorization.
--
-- Suppositions :
--  * Extensions pg_net (schéma net) et supabase_vault disponibles (déjà utilisées).
--  * Le vault contient un secret name = 'SUPABASE_SERVICE_ROLE_KEY' égal à la clé
--    service_role (JWT « legacy ») du projet oeweykyazadobobjncfg, c'est-à-dire la même
--    valeur que la variable SUPABASE_SERVICE_ROLE_KEY des edge functions.
--    notify-order-status compare le jeton à cette variable, et verify_jwt = true exige un JWT :
--    une clé « sb_secret_... » serait refusée (401).
--  * Aucune clé n'est écrite ici : elle est lue dans le vault à chaque exécution.
--  * L'URL du projet n'est pas un secret ; elle est fixée ici pour le projet de production.
--  * Un échec d'appel HTTP ne doit jamais bloquer l'insert/update d'origine : les erreurs
--    sont converties en WARNING.
--  * Les doublons avec les appels directs (AdminDashboard, formulaires) sont absorbés par
--    claim_notification (migration 20260928090000) dans les edge functions.
--
-- Idempotente : CREATE OR REPLACE FUNCTION, DROP TRIGGER IF EXISTS puis CREATE TRIGGER.

CREATE OR REPLACE FUNCTION public.notify_contact_message()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  service_role_key text;
BEGIN
  SELECT decrypted_secret INTO service_role_key
  FROM vault.decrypted_secrets
  WHERE name = 'SUPABASE_SERVICE_ROLE_KEY'
  LIMIT 1;

  IF service_role_key IS NULL THEN
    RAISE WARNING 'notify_contact_message: vault secret SUPABASE_SERVICE_ROLE_KEY introuvable, notification ignorée';
    RETURN NEW;
  END IF;

  BEGIN
    PERFORM net.http_post(
      url := 'https://oeweykyazadobobjncfg.supabase.co/functions/v1/notify-contact',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || service_role_key
      ),
      body := jsonb_build_object('record', row_to_json(NEW))
    );
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'notify_contact_message: appel notify-contact impossible: %', SQLERRM;
  END;

  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.notify_order_status_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  service_role_key text;
BEGIN
  IF OLD.status IS NOT DISTINCT FROM NEW.status OR NEW.status = 'pending' THEN
    RETURN NEW;
  END IF;

  SELECT decrypted_secret INTO service_role_key
  FROM vault.decrypted_secrets
  WHERE name = 'SUPABASE_SERVICE_ROLE_KEY'
  LIMIT 1;

  IF service_role_key IS NULL THEN
    RAISE WARNING 'notify_order_status_change: vault secret SUPABASE_SERVICE_ROLE_KEY introuvable, notification ignorée';
    RETURN NEW;
  END IF;

  -- notify-order-status relit la commande en base : seul l'identifiant est transmis.
  BEGIN
    PERFORM net.http_post(
      url := 'https://oeweykyazadobobjncfg.supabase.co/functions/v1/notify-order-status',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || service_role_key
      ),
      body := jsonb_build_object('type', 'order', 'id', NEW.id, 'old_status', OLD.status)
    );
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'notify_order_status_change: appel notify-order-status impossible: %', SQLERRM;
  END;

  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.notify_preorder_status_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  service_role_key text;
BEGIN
  IF OLD.status IS NOT DISTINCT FROM NEW.status OR NEW.status = 'pending' THEN
    RETURN NEW;
  END IF;

  SELECT decrypted_secret INTO service_role_key
  FROM vault.decrypted_secrets
  WHERE name = 'SUPABASE_SERVICE_ROLE_KEY'
  LIMIT 1;

  IF service_role_key IS NULL THEN
    RAISE WARNING 'notify_preorder_status_change: vault secret SUPABASE_SERVICE_ROLE_KEY introuvable, notification ignorée';
    RETURN NEW;
  END IF;

  BEGIN
    PERFORM net.http_post(
      url := 'https://oeweykyazadobobjncfg.supabase.co/functions/v1/notify-order-status',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || service_role_key
      ),
      body := jsonb_build_object('type', 'preorder', 'id', NEW.id, 'old_status', OLD.status)
    );
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'notify_preorder_status_change: appel notify-order-status impossible: %', SQLERRM;
  END;

  RETURN NEW;
END;
$$;

-- Ces fonctions ne doivent être exécutées que par les triggers.
REVOKE ALL ON FUNCTION public.notify_contact_message() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.notify_order_status_change() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.notify_preorder_status_change() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS on_contact_message_inserted ON public.contact_messages;
CREATE TRIGGER on_contact_message_inserted
  AFTER INSERT ON public.contact_messages
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_contact_message();

DROP TRIGGER IF EXISTS on_order_status_change ON public.orders;
CREATE TRIGGER on_order_status_change
  AFTER UPDATE OF status ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_order_status_change();

DROP TRIGGER IF EXISTS on_preorder_status_change ON public.pre_orders;
CREATE TRIGGER on_preorder_status_change
  AFTER UPDATE OF status ON public.pre_orders
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_preorder_status_change();
