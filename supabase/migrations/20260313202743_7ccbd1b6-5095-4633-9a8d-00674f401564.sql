-- Function to notify on order status change
CREATE OR REPLACE FUNCTION public.notify_order_status_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  payload jsonb;
  edge_function_url text;
  service_role_key text;
BEGIN
  -- Only fire when status actually changes
  IF OLD.status = NEW.status THEN
    RETURN NEW;
  END IF;

  -- Don't notify for pending
  IF NEW.status = 'pending' THEN
    RETURN NEW;
  END IF;

  payload := jsonb_build_object(
    'type', 'order',
    'record', row_to_json(NEW),
    'old_status', OLD.status
  );

  edge_function_url := 'https://eozbnwvirdilwslqnkab.supabase.co/functions/v1/notify-order-status';

  SELECT decrypted_secret INTO service_role_key
  FROM vault.decrypted_secrets
  WHERE name = 'SUPABASE_SERVICE_ROLE_KEY'
  LIMIT 1;

  PERFORM net.http_post(
    url := edge_function_url,
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || service_role_key
    ),
    body := payload
  );

  RETURN NEW;
END;
$$;

-- Function to notify on pre-order status change
CREATE OR REPLACE FUNCTION public.notify_preorder_status_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  payload jsonb;
  edge_function_url text;
  service_role_key text;
BEGIN
  IF OLD.status = NEW.status THEN
    RETURN NEW;
  END IF;

  IF NEW.status = 'pending' THEN
    RETURN NEW;
  END IF;

  payload := jsonb_build_object(
    'type', 'preorder',
    'record', row_to_json(NEW),
    'old_status', OLD.status
  );

  edge_function_url := 'https://eozbnwvirdilwslqnkab.supabase.co/functions/v1/notify-order-status';

  SELECT decrypted_secret INTO service_role_key
  FROM vault.decrypted_secrets
  WHERE name = 'SUPABASE_SERVICE_ROLE_KEY'
  LIMIT 1;

  PERFORM net.http_post(
    url := edge_function_url,
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || service_role_key
    ),
    body := payload
  );

  RETURN NEW;
END;
$$;

-- Triggers
CREATE TRIGGER on_order_status_change
  AFTER UPDATE OF status ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_order_status_change();

CREATE TRIGGER on_preorder_status_change
  AFTER UPDATE OF status ON public.pre_orders
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_preorder_status_change();