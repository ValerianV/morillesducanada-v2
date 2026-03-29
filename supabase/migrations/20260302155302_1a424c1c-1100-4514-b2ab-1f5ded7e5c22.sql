
CREATE OR REPLACE FUNCTION public.notify_contact_message()
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
  payload := jsonb_build_object('record', row_to_json(NEW));
  
  edge_function_url := 'https://eozbnwvirdilwslqnkab.supabase.co/functions/v1/notify-contact';
  
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

CREATE TRIGGER on_contact_message_inserted
  AFTER INSERT ON public.contact_messages
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_contact_message();
