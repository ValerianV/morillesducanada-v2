# Déploiement — runbook

Toute mise en production est **validée par le fondateur**. Ordre impératif :
secrets → base de données → edge functions → site. Le front récent parle un format que les
anciennes fonctions ne comprennent pas : **ne jamais déployer le site avant les fonctions.**

## 0. Pré-requis

- Branche à livrer : build, tsc, vitest et `deno check` verts (voir `CLAUDE.md`).
- Accès Supabase opérationnel (MCP authentifié ou dashboard).

## 1. Secrets et vault

```bash
supabase secrets list --project-ref oeweykyazadobobjncfg
```
Doivent exister : voir `docs/tech/acces.md`. `SEND_EMAIL_HOOK_SECRET` se copie depuis
Dashboard → Authentication → Hooks → Send Email. **Le poser AVANT de déployer `auth-email-hook`**,
sinon les emails d'inscription et de réinitialisation échouent.

```sql
select name, left(decrypted_secret, 3) from vault.decrypted_secrets where name = 'SUPABASE_SERVICE_ROLE_KEY';
-- doit renvoyer 'eyJ'
select proname, position('eozbnwvirdilwslqnkab' in prosrc) > 0 as ancien_projet
from pg_proc where proname like 'notify_%';
-- si ancien_projet = true : régénérer la clé service_role, puis mettre à jour le vault
```

## 2. Migrations

**Ne pas lancer `supabase db push` si `supabase migration list` montre des migrations Lovable
non appliquées** : elles contiennent l'URL de l'ancien projet. Appliquer à la main, dans l'ordre
(SQL Editor ou `psql`), puis marquer comme appliquées :

| Ordre | Fichier | Objet |
|---|---|---|
| 1 | `20260928090000_notification_dedup.sql` | déduplication des notifications |
| 2 | `20260928090100_reviews_hide_email.sql` | email des avis invisible publiquement |
| 3 | `20260928090200_triggers_new_project.sql` | triggers vers le bon projet, clé lue dans le vault |
| 4 | `20260928100000_pro_leads.sql` | table des leads pros |
| 5 | `20260928110000_pre_orders_2027.sql` | précommande 2027 |

```bash
supabase migration repair --status applied 20260928090000 20260928090100 20260928090200 20260928100000 20260928110000 --project-ref oeweykyazadobobjncfg
```
Toutes les migrations sont idempotentes (rejouables sans effet de bord).

## 3. Edge functions

```bash
supabase functions deploy create-checkout create-preorder-checkout stripe-webhook submit-pro-lead \
  notify-order-status notify-contact auth-email-hook generate-invoice --project-ref oeweykyazadobobjncfg
```
`submit-pro-lead` et `create-*` : `verify_jwt = false` (voir `supabase/config.toml`).

## 4. Site (Vercel)

- Réglages projet : build command `npm run build` (inclut le prérendu), output `dist`,
  variables `VITE_SUPABASE_URL` et `VITE_SUPABASE_PUBLISHABLE_KEY` disponibles **au build**.
- Pousser la branche → vérifier la **preview** → fusionner dans `main` → production automatique.
- Domaine : `morillesducanada.com` doit rediriger en **308** vers `www`.

## 5. Contrôles après déploiement

```bash
ANON=<clé anon publique>
# prix envoyé par le client refusé → 400
curl -s -X POST https://oeweykyazadobobjncfg.supabase.co/functions/v1/create-checkout \
  -H "apikey: $ANON" -H "Authorization: Bearer $ANON" -H 'Content-Type: application/json' \
  -d '{"lineItems":[{"quantity":10,"unitAmountCents":1}]}'
# notify-order-status sans admin → 401/403
curl -s -X POST https://oeweykyazadobobjncfg.supabase.co/functions/v1/notify-order-status \
  -H "Authorization: Bearer $ANON" -d '{"type":"order","id":"x"}'
# auth-email-hook sans signature → 401
curl -s -X POST https://oeweykyazadobobjncfg.supabase.co/functions/v1/auth-email-hook -d '{}'
# email des avis illisible → erreur de permission
curl -s "https://oeweykyazadobobjncfg.supabase.co/rest/v1/reviews?select=email" -H "apikey: $ANON"
# prérendu présent
curl -s https://www.morillesducanada.com/professionnels | grep -c canonical
```

Puis : un devis test et une demande d'échantillon (arrivée sur contact@, reply-to correct,
ligne dans l'admin), un achat réel de petit montant (adresse enregistrée dans `orders`),
aucun « Catalog/Stripe price mismatch » dans les logs de `create-checkout`.

## 6. Après la mise en ligne

Google Search Console : propriété de domaine, soumettre `/sitemap.xml`, demander l'indexation
de `/`, `/professionnels`, `/produits`, `/precommande-2027`. Idem Bing Webmaster Tools.
Rich Results Test sur `/professionnels` et une fiche produit.

## Retour arrière

- Site : Vercel → Deployments → « Promote to production » sur le déploiement précédent.
- Fonctions : redéployer depuis le commit précédent (`git checkout <sha> -- supabase/functions/<nom>`).
- Migrations : additives et idempotentes ; ne pas supprimer de colonne en urgence.
