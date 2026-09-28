-- Empêche la lecture publique de reviews.email (fuite RGPD via /rest/v1/reviews?select=email).
--
-- Suppositions :
--  * public.reviews existe (migration 20260315100903) et la colonne email a été ajoutée
--    directement en prod sans migration : on l'ajoute ici si elle manque, pour que
--    les environnements rejoués depuis les migrations aient le même schéma.
--  * Les rôles anon/authenticated disposent du SELECT au niveau table (privilèges par
--    défaut Supabase). La RLS filtre les lignes mais pas les colonnes : on retire donc le
--    SELECT au niveau table et on ne rend lisibles que les colonnes publiques.
--  * Le front (ReviewsSection, AdminDashboard) sélectionne explicitement ces colonnes ;
--    un select("*") par anon/authenticated échoue désormais (permission denied for column email).
--  * INSERT/UPDATE/DELETE ne sont pas modifiés : le formulaire public continue d'insérer
--    l'email, l'admin continue de modérer (policies existantes inchangées).
--  * service_role (edge functions, dashboard) garde l'accès complet, email compris.
--  * Toute nouvelle colonne devra être ajoutée au GRANT ci-dessous pour être lisible.
--
-- Idempotente : ADD COLUMN IF NOT EXISTS, REVOKE et GRANT peuvent être rejoués.

ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS email text;

REVOKE SELECT ON TABLE public.reviews FROM anon, authenticated;
REVOKE SELECT (email) ON TABLE public.reviews FROM anon, authenticated;

GRANT SELECT (id, first_name, rating, comment, approved, created_at)
  ON TABLE public.reviews TO anon, authenticated;
