# Audit technique — morillesducanada-v2

Date : 2026-09-28. Commit audité : `b821c68` (main, working tree propre).
Méthode : lecture seule du code, des migrations, des edge functions et de l'historique git. Commandes lancées : `npx tsc --noEmit`, `npm run lint`, `npm run build` (et un build avec sourcemaps dans le scratchpad pour mesurer le bundle), `curl -I` sur le site en production.

Ce qui n'a pas pu être vérifié : les MCP Supabase et Vercel demandent une authentification (indisponible dans cette session) et aucune clé Stripe n'était accessible. L'état réel de la base de prod, le mode Stripe et les secrets des fonctions restent donc **à confirmer**. Les requêtes de vérification sont indiquées pour chaque point concerné.

Légende : **P0** = bloquant ou sécurité · **P1** = impact direct sur les ventes pro · **P2** = qualité.

---

## Synthèse

| # | Prio | Sujet | Fichier |
|---|------|-------|---------|
| S1 | P0 | Prix modifiable par le client dans `create-checkout` (montant, frais de port, priceId) | `supabase/functions/create-checkout/index.ts:28,61-94` |
| S2 | P0 | `notify-order-status` sans authentification : relais d'emails HTML vers n'importe quelle adresse depuis votre domaine | `supabase/config.toml:8-9`, `notify-order-status/index.ts:108` |
| S3 | P0 | `auth-email-hook` sans vérification de signature : même relais, avec un faux email « réinitialisation du mot de passe » | `supabase/config.toml:4-5`, `auth-email-hook/index.ts:62-106` |
| S4 | P0 | Emails des auteurs d'avis lisibles publiquement (`select("*")` sur `reviews`) | `src/components/ReviewsSection.tsx:41-45` |
| S5 | P0 (à vérifier) | Les triggers SQL appellent l'ancien projet Lovable `eozbnwvirdilwslqnkab` avec la clé `service_role` du projet actuel | `migrations/20260302155302…sql:15-27`, `20260313202743…sql:29,75` |
| S6 | P0 (à vérifier) | Mode Stripe test ou live impossible à déduire du code : à confirmer avant toute prospection | `src/lib/products.ts:43-90` |
| B1 | P1 | Aucun vrai tunnel B2B : les leads pro atterrissent en texte libre dans `contact_messages` et n'apparaissent pas dans l'admin | `PreOrder.tsx:92-103`, `AdminDashboard.tsx:89-91` |
| B2 | P1 | Page pré-commande périmée (« saison 2026 », « avant cueillette ») alors qu'il y a 45 kg en stock | `PreOrder.tsx`, `i18n/fr.ts:113-115` |
| B3 | P1 | TVA contradictoire : 5,5 % HT dans la plaquette pro, franchise 293 B partout ailleurs | `PlaquettePro.tsx:13-15,321,541,701` |
| B4 | P1 | Notification de lead sans Reply-To, typage « Particulier » erroné, envoi « fire-and-forget » | `process-email-queue/index.ts:25-31`, `notify-contact/index.ts:30`, `ContactSection.tsx:24` |
| B5 | P1 | Facture client fausse (prix unitaire ×100) et non conforme pour un acheteur pro | `generate-invoice/index.ts:30-33,131-137` |
| B6 | P1 | Adresse de livraison probablement jamais enregistrée (API Stripe « basil ») | `stripe-webhook/index.ts:276` |
| B7 | P1 | `cancel_url` renvoie vers une route inexistante (404) | `create-checkout/index.ts:105`, `App.tsx` |
| B8 | P1 | Liens de confirmation et de reset password cassés via le hook email | `auth-email-hook/index.ts:84` |
| B9 | P1 | SEO : canonical apex contre www, pages pro canonisées vers la home, OG image cassée, SPA sans prérendu | `index.html:17-26`, `public/sitemap.xml` |
| … | P2 | Voir le détail plus bas | |

---

## 1. Sécurité

### S1 — P0 — Le client fixe lui-même le prix payé
- **Fichier** : `supabase/functions/create-checkout/index.ts:28`, `:61-78`, `:81-94` ; côté front `src/components/CartDrawer.tsx:19-34`.
- **Problème** :
  - Si un `lineItem` n'a pas de `priceId`, la fonction crée un `price_data` avec `unit_amount: item.unitAmountCents` envoyé par le navigateur. Un simple `curl` avec `{"lineItems":[{"quantity":10,"unitAmountCents":1,"name":"Morilles"}]}` produit une session Stripe à 0,10 €. Le webhook l'enregistre ensuite comme commande `paid`.
  - `subtotalCents` vient aussi du client : envoyer `subtotalCents: 999999` supprime les frais de port.
  - N'importe quel `priceId` du compte Stripe est accepté, y compris les anciens prix encore actifs.
- **Impact** : des commandes « payées » à prix arbitraire apparaissent dans l'admin et risquent d'être expédiées. Il y a une perte directe sur un stock limité à 45 kg.
- **Correctif** : le serveur doit être la seule source des prix. Le client n'envoie que `{productId, weightGrams?, quantity}`.
  ```ts
  // supabase/functions/_shared/catalog.ts (source unique, importée aussi par le front via un JSON partagé)
  export const CATALOG = {
    "morilles-12g": { priceId: "price_…", cents: 1200 },
    "morilles-30g": { priceId: "price_…", cents: 2300 },
    "morilles-45g": { priceId: "price_…", cents: 2900 },
    "morilles-sous-vide": { byWeight: { 100: {priceId:"price_…",cents:5900}, 200: {...}, 500: {...}, 1000: {...} } },
  };
  // create-checkout
  const body = z.object({ items: z.array(z.object({
    productId: z.enum(Object.keys(CATALOG)), weightGrams: z.number().optional(),
    quantity: z.number().int().min(1).max(50) })).min(1).max(20) }).parse(await req.json());
  const resolved = body.items.map(resolveFromCatalog);      // lève une erreur si la combinaison est inconnue
  const subtotal = resolved.reduce((s, r) => s + r.cents * r.quantity, 0);
  const line_items = resolved.map(r => ({ price: r.priceId, quantity: r.quantity }));
  // frais de port : shipping_options Stripe (cf. P-3), jamais calculés à partir d'une valeur envoyée par le client
  ```
  Autres mesures : supprimer entièrement la branche `price_data`, restreindre CORS à `https://www.morillesducanada.com`, archiver dans Stripe les anciens prix (`price_1TAc7*`, `price_1TK10*`, `price_1TCOG*`).

### S2 — P0 — `notify-order-status` est un relais d'emails ouvert
- **Fichier** : `supabase/config.toml:8-9` (`verify_jwt = false`) ; `supabase/functions/notify-order-status/index.ts:108-181`.
- **Problème** : la fonction n'a aucune authentification. Elle prend `record.email`, `record.customer_name`, `record.tracking_url`, etc. dans le corps de la requête et met en file un email HTML non échappé envoyé depuis `noreply@morillesducanada.com`. N'importe qui peut donc envoyer à n'importe quelle adresse un faux email « Votre commande est expédiée » avec un bouton « Suivre mon colis » qui pointe vers un site de phishing. Il suffit d'un POST, l'URL de la fonction étant publique.
- **Impact** : phishing sous votre marque et réputation du domaine détruite. Resend peut suspendre le compte, ce qui coupe **aussi** toutes les notifications de leads et de commandes.
- **Correctif** :
  - La fonction doit relire l'enregistrement en base et ignorer celui du body :
    ```ts
    const { type, id } = await req.json();
    // auth : soit service_role (trigger), soit JWT utilisateur admin
    const jwt = req.headers.get("Authorization")?.replace("Bearer ", "");
    const { data: { user } } = await anon.auth.getUser(jwt);
    const isAdmin = user && (await admin.rpc("has_role", { _user_id: user.id, _role: "admin" })).data;
    if (!isAdmin && !isServiceRole(jwt)) return new Response("Forbidden", { status: 403 });
    const record = await admin.from(type === "order" ? "orders" : "pre_orders").select("*").eq("id", id).single();
    ```
  - Remettre `verify_jwt = true`.
  - Échapper tout le HTML avec une fonction `escapeHtml()`.
  - Valider `tracking_url` : `https:` uniquement, et idéalement une liste blanche de transporteurs.
  - Garder **un seul** déclencheur. Aujourd'hui le trigger SQL **et** `AdminDashboard.tsx:124,156,172` appellent la fonction, ce qui peut produire des doublons.

### S3 — P0 — `auth-email-hook` n'authentifie pas l'appelant
- **Fichier** : `supabase/config.toml:4-5` ; `supabase/functions/auth-email-hook/index.ts:62-106`.
- **Problème** : le hook « Send Email » de Supabase signe ses requêtes (Standard Webhooks, secret `v1,whsec_…`), mais la signature n'est jamais vérifiée. Un POST `{"user":{"email":"victime@x.fr"},"email_data":{"email_action_type":"recovery","redirect_to":"https://phishing.example"}}` envoie un email officiel « Réinitialisation du mot de passe » avec un lien arbitraire.
- **Impact** : identique à S2, avec en plus un vecteur de vol d'identifiants.
- **Correctif** :
  ```ts
  import { Webhook } from "npm:standardwebhooks@1";
  const wh = new Webhook(Deno.env.get("SEND_EMAIL_HOOK_SECRET")!.replace("v1,whsec_", ""));
  const payload = await req.text();
  const { user, email_data } = wh.verify(payload, Object.fromEntries(req.headers)) as HookPayload; // lève une erreur si la signature est invalide
  ```
  Voir aussi B8 : le lien de confirmation est mal construit.

### S4 — P0 — Emails des auteurs d'avis exposés publiquement
- **Fichier** : `src/components/ReviewsSection.tsx:41-45` (`select("*")`) et `:61-66` (insert avec `email`). La colonne `email` a été ajoutée directement en base (message du commit `0503fd2`) mais **aucune migration n'est commitée**. `src/integrations/supabase/types.ts:326-352` ne la connaît pas.
- **Problème** : la RLS filtre les lignes, pas les colonnes. La policy `"Anyone can read approved reviews"` (`migrations/20260315100903…sql:14-16`) permet donc à n'importe qui, avec la clé anon présente dans le bundle, d'exécuter `GET /rest/v1/reviews?select=email`.
- **Impact** : fuite de données personnelles (RGPD) alors que le formulaire promet que l'email n'est « non affiché publiquement ».
- **Correctif** (migration) :
  ```sql
  REVOKE SELECT ON public.reviews FROM anon, authenticated;
  GRANT SELECT (id, first_name, rating, comment, created_at, approved) ON public.reviews TO anon, authenticated;
  -- ou bien : une vue public.reviews_public sans email, et le front lit la vue
  ALTER TABLE public.reviews ALTER COLUMN approved SET DEFAULT false;   -- cf. P2-5
  ```
  Côté front : `select("id, first_name, rating, comment, created_at")`.

### S5 — P0 (à vérifier) — Triggers câblés sur l'ancien projet Lovable
- **Fichiers** :
  - `supabase/migrations/20260302155302_…sql:15` (`notify_contact_message`)
  - `supabase/migrations/20260313202743_…sql:29` et `:75` (triggers de statut)
  - Ils pointent tous vers `https://eozbnwvirdilwslqnkab.supabase.co/functions/v1/...`, alors que le projet actuel est `oeweykyazadobobjncfg` (`supabase/config.toml:1`, `.mcp.json`).
- **Problème** : si ces migrations ont été rejouées telles quelles sur le nouveau projet, chaque message de contact et chaque changement de statut envoie un POST vers l'**ancien projet (infrastructure Lovable)** avec `Authorization: Bearer <service_role du nouveau projet>` (lu depuis `vault.decrypted_secrets`, alimenté d'après le commit `33512ad`).
- **Impact** : la clé `service_role` partirait vers un tiers, et les notifications passeraient par l'ancien projet ou échoueraient. C'est probablement pour cela que le front appelle `notify-contact` en direct (commit initial `366ed70` : « Fix emails : appel direct à notify-contact »).
- **Vérification** (SQL editor) :
  ```sql
  select proname, position('eozbnwvirdilwslqnkab' in prosrc) > 0 as old_project
  from pg_proc where proname in ('notify_contact_message','notify_order_status_change','notify_preorder_status_change');
  select * from net._http_response order by created desc limit 20;  -- statut des appels sortants
  ```
- **Correctif** : si `old_project = true`, régénérer immédiatement la clé `service_role` (JWT secret, ou passer aux nouvelles clés `sb_secret_`). Réécrire les fonctions pour lire l'URL depuis le vault (`select decrypted_secret from vault.decrypted_secrets where name='project_url'`), puis supprimer soit le trigger soit l'appel front, pour n'en garder qu'un. Committer une migration qui reflète l'état réel de la prod (dérive de schéma : `reviews.email`, `recipes.sort_order`, cf. P2-1).

### S6 — P0 (à vérifier) — Mode Stripe
- **Fichier** : `src/lib/products.ts:43,57,72,87-90`.
- **Constat** : un price ID Stripe (`price_1TMj…`) **n'encode pas** le mode test ou live, contrairement aux clés (`sk_live_`, `pk_test_`). L'historique git donne des indices :
  - `8524463` (08/04) : « replace live Stripe price IDs with test mode equivalents » (`TAc7*` live remplacés par `TK10*` test).
  - `88bcc96` : « switch to live price IDs » (retour aux `TAc7*` et ajout des `TCOG*`).
  - `f369865` (16/04) : nouveaux IDs `TMj*` créés avec la grille 2026, **mode inconnu**.
  - Aucune clé secrète n'est présente dans le code ni dans l'historique. Le mode dépend uniquement du secret `STRIPE_SECRET_KEY` des edge functions.
- **Impact** : si les IDs `TMj*` ont été créés en test alors que la clé est live (ou l'inverse), `create-checkout` renvoie une erreur 500 `No such price` et **aucune vente en ligne n'est possible**. Si tout est en test, les clients « paient » sans être débités.
- **Vérification** : Dashboard Stripe → basculer « Test mode » off → rechercher `price_1TMjYzEQBCcpAKNI4vXm39ml`. Ou bien `stripe prices retrieve price_1TMjYz… --live`. Ou regarder le préfixe du secret dans Supabase → Edge Functions → Secrets.
- **Correctif durable** : dans `create-checkout`, logguer `stripe.prices.retrieve()` au démarrage (cold start) et échouer explicitement si `price.livemode !== Deno.env.get("STRIPE_LIVEMODE") === "true"`.

### Autres points sécurité
- **P1 — `pre_orders` accepte des insertions anonymes arbitraires.** `migrations/20260313201620…sql:48-50` : `FOR INSERT TO public WITH CHECK (true)`. N'importe qui peut insérer une pré-commande `status='paid'` avec un `total_amount` libre, qui apparaîtra dans l'admin. Correctif : `DROP POLICY "Anyone can create pre-orders"`, puisque les insertions passent par l'edge function en service_role.
- **P1 — `notify-contact` est public** (`config.toml:6-7`). Il permet d'envoyer du spam HTML non échappé (`notify-contact/index.ts:53-69`) vers contact@, avec un risque de phishing interne. Correctif : ne plus appeler la fonction depuis le front. L'insertion en base (ou la future fonction `submit-pro-lead`) déclenche la notification côté serveur. Ajouter `escapeHtml` et un honeypot.
- **P2 — Webhook Stripe.**
  - La signature est bien vérifiée (`stripe-webhook/index.ts:222-241`).
  - L'idempotence repose sur un « select puis insert » sans contrainte (`:252-261`), ce qui laisse passer des doublons en cas de retry concurrent. Ajouter `create unique index on orders(stripe_session_id)` et un `insert … on conflict do nothing`.
  - `payment_status` n'est pas vérifié : pour les moyens de paiement asynchrones, il faut gérer `checkout.session.async_payment_succeeded`.
  - `supabase.auth.admin.listUsers()` (`:295`) ne lit que la première page (50 utilisateurs). Il faut une recherche par email via une RPC.
  - Les pré-commandes (`metadata.pre_order_id`) ne sont pas traitées : elles créeraient une ligne `orders` et le `pre_orders.status` ne passerait jamais à `paid`.
- **P2 — `create-preorder-checkout` est du code mort mais déployé.** Il n'est appelé nulle part dans `src/`, mais reste appelable avec la clé anon et crée des clients Stripe et des lignes `pre_orders` à volonté. À supprimer, ou à réécrire dans le cadre du tunnel B2B.
- **P2 — `process-email-queue` lit le JWT sans le vérifier** (`process-email-queue/index.ts:60-101`). C'est acceptable seulement parce que `verify_jwt` vaut true par défaut (absent de `config.toml`). Il faut l'écrire explicitement dans `config.toml` pour ne pas le perdre lors d'un déploiement.
- **P2 — XSS dans la facture.** `generate-invoice` injecte `customer_name`, l'adresse et les noms d'articles sans échappement (`generate-invoice/index.ts:24,93-94`). `Profil.tsx:119-121` ouvre ensuite ce HTML en `blob:`, **dans l'origine du site**, là où se trouve le token Supabase en localStorage. Aujourd'hui l'impact se limite à une auto-XSS, mais il faut échapper les valeurs.
- **P2 — CORS `*`** sur toutes les fonctions : restreindre à `https://www.morillesducanada.com` (et localhost en dev).
- **P2 — Bucket `avatars`** : une policy SELECT publique sur `storage.objects` (`migrations/20260301204212…sql:34-37`) permet de lister tous les fichiers. Un bucket public n'a pas besoin de cette policy pour servir les fichiers.
- **P2 — Aucun en-tête de sécurité** dans `vercel.json` : ajouter CSP, `X-Frame-Options: DENY`, `Referrer-Policy`, `Permissions-Policy`.
- **OK — Secrets.** `git log -p | grep -iE "sk_live|sk_test|whsec|sbp_|ghp_|re_…|service_role"` ne remonte **aucune clé secrète**. Le seul élément trouvé est un `.env` commité puis retiré (`366ed70` puis `5e25784`). Il contenait `VITE_SUPABASE_PUBLISHABLE_KEY` (clé **anon**, publique par nature) de l'**ancien** projet `eozbnwvirdilwslqnkab`. Le risque est faible et aucune réécriture d'historique n'est nécessaire. `.env` est bien dans `.gitignore`. `.mcp.json` ne contient qu'un `project_ref`, ce qui n'est pas un secret.

---

## 2. Paiement

### P-1 — P0 : prix contrôlés par le client, voir S1.

### P-2 — P0 (à vérifier) : mode test/live, voir S6.

### P-3 — P1 — Frais de port incohérents avec la page Livraison
- **Fichiers** : `create-checkout/index.ts:11-13,81-94` (6,90 €, gratuit dès 50 €, **tous pays confondus**) ; `src/pages/Livraison.tsx:11,17` (France : 6,90 €, offert dès 50 € ; Europe : **9,90 €, offert dès 80 €**) ; `CartDrawer.tsx:73,84` (barre « offerte dès 50 € », puis « Livraison offerte » affiché seulement à partir de **80 €**, donc rien ne s'affiche entre 50 et 80 €). Le total du panier n'inclut pas les frais de port.
- **Impact** : les commandes européennes sont sous-facturées, l'affichage est incohérent et le client découvre les frais seulement chez Stripe.
- **Correctif** : utiliser `shipping_options` Stripe (Shipping Rates créés dans le dashboard) calculés **côté serveur** à partir du sous-total recalculé, et limiter les pays selon l'offre :
  ```ts
  const shipping_options = subtotal >= 5000 ? [{ shipping_rate: RATE_FR_FREE }] : [{ shipping_rate: RATE_FR_690 }];
  // Pour l'UE : créer une session par zone (sélecteur de pays dans le panier), ou utiliser l'update dynamique
  // des frais de port de Checkout (permissions.update_shipping_details + checkout.sessions.update)
  ```
  Côté front : une seule constante `FREE_SHIPPING_THRESHOLD`, et la ligne « Livraison » affichée dans le panier.

### P-4 — P1 — Produit sous vide à poids variable
- **Fichiers** : `src/lib/products.ts:79-106`, `ProductsSection.tsx:19-20`, `ProductDetail.tsx:39-49`, `CartDrawer.tsx:20-24`.
- **Constat** : il s'agit en réalité de 4 formats fixes (100/200/500/1000 g), chacun avec un price ID. La résolution du prix fonctionne : `priceId` est `undefined` pour ce produit, donc `weightPriceIds[g]` est bien utilisé. En revanche, `unitPrice` est stocké dans le panier persistant (`cartStore.ts:40,88-90`), avec l'objet `product` complet. Après une modification de prix, un panier ancien affiche l'ancien prix alors que Stripe facture le nouveau. Le stock est décrémenté d'une unité quel que soit le poids (commentaire `products.ts:95-97`), et en pratique aucun décrément n'existe (le stock est codé en dur).
- **Correctif** : ne persister que `{productId, weightGrams, quantity}` et recalculer prix et libellés depuis le catalogue à la lecture. Ajouter une table `inventory(sku, grams_available)` décrémentée par le webhook en grammes.

### P-5 — P1 — Cohérence des prix affichés
- La cohérence entre le front (`products.ts` : 12/23/29 €, sous vide 59/110/240/420 €) et les montants des prix Stripe **n'est pas vérifiable sans accès Stripe**. Recommandation : un script `scripts/check-stripe-prices.ts` (lecture seule, clé restreinte) qui compare `CATALOG[].cents` à `price.unit_amount` et échoue en CI s'ils divergent.
- Le JSON-LD statique de `index.html:62-67` affiche `lowPrice 14.90` et `highPrice 89.90` (anciens prix), en doublon avec `JsonLdSchemas.tsx`. Google Merchant et les rich results peuvent le signaler comme prix trompeur. Supprimer le bloc de `index.html`.
- Tarifs pro (`PreOrder.tsx:41-46` et `create-preorder-checkout/index.ts:14-19`) dupliqués à la main. À centraliser (voir le plan B2B).

### P-6 — P1 — Checkout pas adapté aux acheteurs pro
- **Fichier** : `create-checkout/index.ts:96-106`.
- **Problème** : pas de `tax_id_collection`, pas de `billing_address_collection: "required"`, pas de `phone_number_collection`, pas de `invoice_creation`, pas de `metadata`. Un restaurant ne peut pas saisir sa raison sociale ni son numéro de TVA, et ne reçoit pas de facture Stripe conforme.
- **Correctif** :
  ```ts
  tax_id_collection: { enabled: true },
  billing_address_collection: "required",
  phone_number_collection: { enabled: true },
  invoice_creation: { enabled: true, invoice_data: { footer: "TVA non applicable, art. 293 B du CGI — SIRET 802 861 948 00023" } },
  metadata: { source: "site", cart_hash },
  ```

---

## 3. Parcours B2B

### État des lieux
| Brique | Existe ? | Où | Commentaire |
|---|---|---|---|
| Formulaire de devis pro | Partiel | `PreOrder.tsx` (`/pre-commande`) | Formulaire de **pré-commande saison** : société, contact, email, téléphone, variété, kg (1 à 20), notes. Le devis « générique » renvoie vers `#contact`. |
| Commande au kg | Non en ligne | `create-preorder-checkout` (code mort) | Plus de paiement en ligne au kg. Le sous vide 1 kg (420 €) est au prix public B2C. |
| Demande d'échantillon | **Non** | — | Seul le pot 12 g « format d'évaluation » payant existe (`products.ts:39`). |
| Espace ou grille pro | Partiel | `/plaquette-pro` (page imprimable), `/fiche-technique` | Grille kg présente mais en « HT + TVA 5,5 % » (faux, voir B3). **Aucun prix revendeur** pour les épiceries (« sur devis », `PlaquettePro.tsx:541-542`). Pas de compte pro. |
| Stockage des leads | Oui, mal structuré | `contact_messages` (`name`, `email`, `type`, `message` texte libre) | Société, kg et variété sont concaténés dans `message` (`PreOrder.tsx:82-99`). Pas de statut, pas de source/UTM. |
| Visibilité admin | **Non** | `AdminDashboard.tsx:89-91` | L'admin charge `orders`, `pre_orders` et `reviews`, mais **pas `contact_messages`**, et aucune policy SELECT admin n'existe sur cette table. `pre_orders` n'est plus alimentée. **Les leads ne sont visibles que dans la boîte mail.** |
| Notification email | Oui, fragile | `notify-contact` → pgmq → cron → `process-email-queue` → Resend → `contact@morillesducanada.com` (codé en dur, `notify-contact/index.ts:92`) | Voir B4. |

### B1 — P1 — Les leads pro ne sont ni structurés ni visibles dans l'admin
- **Fichiers** : `PreOrder.tsx:92-103`, `ContactSection.tsx:18-26`, `AdminDashboard.tsx:89-91`, `migrations/20260301174836…sql:13-14` (insert anonyme uniquement).
- **Impact** : pas de pipeline commercial, pas de relance possible et aucun chiffre sur les 45 kg (combien de kg demandés, par quel canal). Si l'email n'arrive pas, le lead est **perdu sans trace visible**.
- **Correctif** : créer une table `pro_leads` et un onglet « Leads » dans l'admin (voir le plan en fin de document).

### B2 — P1 — Offre pro périmée
- **Fichiers** :
  - `PreOrder.tsx:149-174` (« Réservation avant cueillette », « Délai 6 à 8 semaines »), `:265-270` (« Paiement intégral à la réservation », « Aucun réassort… »)
  - `i18n/fr.ts:113-115` (« Sourcing direct saison 2026 », « Pré-commander pour l'été 2026 »), `fr.ts:149` (option « Pré-commande saison 2026 »)
  - `sitemap.xml` (`/pre-commande` en priorité 0,9)
  - Commentaire `products.ts:1-6` (« 70 kg à la pré-commande pro »)
- **Impact** : fin septembre, un acheteur lit qu'il doit réserver avant une cueillette déjà passée et attendre 6 à 8 semaines, alors que le produit est **en stock et expédiable sous 48 h**. C'est le principal frein à l'écoulement des 45 kg.
- **Correctif** : transformer `/pre-commande` en `/pro` avec « Stock disponible saison 2026 — 45 kg — expédition 48/72 h », une grille dégressive au kg, les boutons « Demander un devis » et « Recevoir un échantillon », et une redirection 301 de `/pre-commande` vers `/pro` (dans `vercel.json`).

### B3 — P1 — TVA contradictoire dans la plaquette pro
- **Fichiers** : `PlaquettePro.tsx:13-15` (`VAT = 0.055`, `ht = ttc/1.055`), `:321` (« Tarifs HT (TVA 5,5 %) »), `:398`, `:541`, `:701`. Ailleurs : franchise en base, art. 293 B (`MentionsLegales.tsx:29,86`, `ProductsSection.tsx:77`, `ProductDetail.tsx:156`, `fr.ts:180`, `generate-invoice/index.ts:136`).
- **Impact** : un chef ou un grossiste qui compte récupérer 5,5 % de TVA sur la plaquette découvre une facture sans TVA. C'est un risque juridique (affichage de prix) et un risque de confiance, juste au moment de signer.
- **Correctif** : supprimer `VAT`/`ht()`, afficher des « Prix nets — TVA non applicable, art. 293 B du CGI » et calculer les €/kg sur le net. À surveiller : avec environ 45 kg à environ 350 €/kg (environ 16 k€), le seuil de franchise « ventes de marchandises » n'est pas en jeu, mais le suivi est à faire avec le comptable.

### B4 — P1 — Fiabilité des notifications de lead vers contact@morillesducanada.com
Réponse courte : **oui en théorie, la destination est bien `contact@morillesducanada.com`**, mais la chaîne comporte 6 maillons non surveillés et plusieurs défauts :
1. **Pas de Reply-To** : `process-email-queue/index.ts:25-31` n'envoie à Resend que `from/to/subject/html/text`. Répondre à une notification de lead part vers `noreply@`. Correctif : ajouter `reply_to` au payload (`notify-contact`) et le transmettre à Resend (`reply_to: payload.reply_to`).
2. **Mauvais type** : `notify-contact/index.ts:30` ne reconnaît que `professionnel`. Le type `precommande-2026` (`ContactSection.tsx:107`) arrive donc étiqueté « 👤 Particulier ».
3. **Appel front « fire-and-forget »** : `ContactSection.tsx:24` et `PreOrder.tsx:103` utilisent `.catch(() => {})`. Si l'invocation échoue, l'utilisateur voit « Merci » et personne n'est notifié (pas de SELECT admin, voir B1). Le trigger SQL (S5) peut en plus provoquer un doublon, ou un appel vers l'ancien projet.
4. **Mise en file à TTL court** : 60 min pour `transactional_emails` (`process-email-queue/index.ts:10,183-197`). Si le cron ou Resend est bloqué plus d'une heure, le lead part en DLQ **sans alerte**.
5. L'expéditeur `noreply@morillesducanada.com` suppose un domaine vérifié chez Resend (SPF, DKIM, DMARC). `SENDER_DOMAIN = notify.morillesducanada.com` n'est pas utilisé par Resend. À vérifier dans le dashboard Resend.
6. Sujet peu exploitable : « 📩 Nouveau message de X (👤 Particulier) ». Le sujet devrait contenir le type, les kg et la ville.
- **Vérification rapide** (SQL) : `select template_name,status,count(*) from email_send_log where created_at > now()-interval '30 days' group by 1,2;` et `select * from pgmq.q_transactional_emails_dlq limit 20;`.

### B5 — P1 — Factures fausses et non conformes pour un pro
- **Fichiers** :
  - `generate-invoice/index.ts:30,33` : `item.price || item.unit_amount` affiché en euros, alors que le webhook stocke `unit_amount` **en centimes** (`stripe-webhook/index.ts:271`). Un pot à 23 € apparaît à « 2300.00 € » (le total, lui, est juste car divisé par 100).
  - `notify-order-status/index.ts:36` : même problème avec `item.price` (undefined), qui donne « 0.00 € » par ligne.
  - Numérotation `FAC-AAAA-<8 caractères de l'UUID>` (`:195`) : ni chronologique ni continue, contrairement à ce qu'exige l'article 242 nonies A de l'annexe II du CGI.
  - Il manque SIRET, adresse du vendeur, mention exacte « TVA non applicable, art. 293 B du CGI », raison sociale et adresse de facturation du client, et date de livraison.
- **Correctif** : `unit_amount / 100`, une séquence Postgres `invoice_seq` (numéro attribué au passage à `paid`), les mentions légales, et idéalement déléguer la facturation à `invoice_creation` Stripe (P-6).

### B6 — P1 — Adresse de livraison probablement jamais enregistrée
- **Fichier** : `stripe-webhook/index.ts:276` (`session.shipping_details`) avec `apiVersion: "2025-08-27.basil"` (`:6`).
- **Problème** : depuis l'API `2025-03-31.basil`, l'adresse de livraison d'une Checkout Session se trouve dans `session.collected_information.shipping_details`. Le champ `shipping_details` de premier niveau n'est plus renvoyé. `shippingAddress` vaut donc très probablement `null` pour chaque commande : rien dans `orders.shipping_address`, rien dans l'email de confirmation ni sur la facture.
- **Vérification** : `select id, shipping_address from orders order by created_at desc limit 5;`
- **Correctif** : `const shipping = session.collected_information?.shipping_details ?? (session as any).shipping_details;`

### B7 — P1 — Annulation de paiement renvoyant vers une 404
- `create-checkout/index.ts:105` : `cancel_url: /paiement-annule`. Aucune route correspondante dans `src/App.tsx:74-95`, donc NotFound. Même chose pour `create-preorder-checkout` → `/pre-commande` (qui fonctionne) et `/precommande-confirmee` (existe).
- **Correctif** : route `/paiement-annule` → page « Paiement interrompu — votre panier est conservé » avec un bouton de retour au panier et un lien « Besoin d'un devis pro ? ».

### B8 — P1 — Liens de confirmation d'inscription et de reset cassés
- **Fichier** : `auth-email-hook/index.ts:84` : `confirmationUrl: email_data.redirect_to || SITE_URL`.
- **Problème** : le hook doit construire `${SUPABASE_URL}/auth/v1/verify?token=${email_data.token_hash}&type=${email_action_type}&redirect_to=${redirect_to}`. En l'état, le bouton renvoie simplement vers le site **sans jeton**. Un compte n'est jamais confirmé, et `/reset-password` n'a pas de session (`Auth.tsx:67-68`).
- **Correctif** : construire l'URL de vérification ci-dessus (en utilisant `email_data.site_url` comme base si elle est fournie). À vérifier : le hook est-il bien activé (Dashboard → Auth → Hooks) ?

### B9 — P1 — Parcours pro invisible depuis la home
- `HeroSection.tsx:73-80` : CTA « Produits » et « Origine » uniquement. `FloatingCTA.tsx:19` renvoie vers `#produits` (B2C). La nav mène à `#professionnels`, en bas de page. Il n'y a **aucun lien pro au-dessus de la ligne de flottaison**.
- **Correctif** : second CTA dans le hero, « Chefs & épiceries : tarifs au kg », et un FloatingCTA contextuel (pro si UTM `?src=pro` ou visite de `/pro`).

---

## 4. Bugs, build, TypeScript, lint, i18n

### Build
- `npm run build` : **OK**, en 2 s. Avertissement : `dist/assets/index-BXI_xKXt.js` fait **717,28 kB** (224,66 kB gzip), au-delà du seuil de 700 kB (voir 5-4).

### TypeScript (`npx tsc --noEmit -p tsconfig.app.json`) : 2 erreurs
Le build Vite ne vérifie pas les types, d'où l'absence de blocage.
- `src/pages/Recettes.tsx:65` : `.catch` sur un `PromiseLike` (le builder PostgREST). Cela marche à l'exécution, mais c'est fragile. Correctif : `async/await` avec `try/catch`.
- `src/pages/RecetteDetail.tsx:54` : cast `Json` vers `Recipe`. Correctif : `as unknown as Recipe`, ou mieux un parseur zod.
- Le mode `strict: false` et `strictNullChecks: false` (`tsconfig.app.json`, `tsconfig.json`) masque la plupart des bugs de type (par exemple l'insert `reviews.email`, absent des types, passe sans erreur).

### Lint (`npm run lint`) : 32 problèmes (22 erreurs, 10 avertissements)
- `no-explicit-any` : `i18n/context.tsx:20,40`, `Profil.tsx:25,382`, `auth-email-hook:29,51`, `generate-invoice:10,21`, `notify-order-status:22,27`, `stripe-webhook:18,23,59,142,144`.
- `no-require-imports` : `tailwind.config.ts:90`.
- `react-hooks/exhaustive-deps` : `AdminDashboard.tsx:74`, `Profil.tsx:72`.
- Bruit dans `components/ui/*` (react-refresh). À ignorer dans la config.

### Formulaires qui échouent en silence
- **P1** — `ContactSection.tsx:24` et `PreOrder.tsx:103` : notification avalée par `.catch` (voir B4).
- **P1** — `ReviewsSection.tsx:61-66` : l'insert inclut `email`. Si la colonne n'existe pas en prod (migration non commitée), **tous les avis échouent**. Si elle existe, on retombe sur S4. Dans les deux cas, il faut committer la migration.
- **P2** — `Recettes.tsx:59` : `order("sort_order")` sur une colonne absente de `types.ts` et des migrations (même dérive). Si elle manque en prod, la liste des recettes est vide avec une simple ligne `console.error`.
- **P2** — `AdminDashboard.tsx:118-128` : l'email de statut part même si l'update échoue partiellement, et en double avec le trigger (S2/S5).
- **P2** — Le commit `b821c68` a retiré `.select().single()` après les inserts. C'est correct, puisque sans policy SELECT le `RETURNING` échouait.

### Routes
- **P1** — `/paiement-annule` manquante (B7).
- **P2** — `vercel.json` réécrit **tout** vers `index.html`, y compris `/og-image.jpg` qui n'existe pas (le serveur renvoie du HTML avec un statut 200, vérifié avec curl). Toute URL inconnue donne donc un 200 (« soft 404 »). Ajouter `"cleanUrls": true` et une réécriture qui exclut les extensions de fichiers.
- **P2** — `/precommande-confirmee` et `create-preorder-checkout` sont orphelins.

### i18n FR/EN
- Parité des clés FR/EN : **OK** (215 clés, aucune manquante, 122 clés utilisées, toutes résolues).
- En revanche, **28 fichiers sur 43** n'utilisent pas `useI18n` et sont en français codé en dur, notamment :
  - `CartDrawer.tsx` (« Votre Panier », « Payer maintenant », « Livraison offerte dès 50 € »)
  - `ReviewsSection.tsx`, `ProductDetail.tsx`, `Produits.tsx`, `PlaquettePro.tsx`, `FicheTechnique.tsx`, `Livraison.tsx`, `CGV.tsx`, `PaymentSuccess.tsx`, `Auth.tsx`, `Profil.tsx`, `NotFound.tsx`
  - la **moitié de `PreOrder.tsx`** : tableau des variétés `:11-39`, étapes `:149-174`, conditions `:265-270`, entêtes de tableaux, toasts `:71,75,108`, alors que `TRANSLATION_STATUS.md` annonce « Full FR + EN ».
  - Tous les emails (confirmation, statut, auth) sont en français uniquement.
- `html lang` n'est mis à jour qu'au changement de langue (`context.tsx:34`), pas au chargement lorsque `locale=en` est déjà stocké.
- Il n'y a pas d'URL par langue (`/en/...`) : la version EN est invisible pour Google et impossible à partager avec un prospect étranger.
- Priorité pour le B2B : traduire `/pro` (ex-PreOrder), `PlaquettePro`, `FicheTechnique` et `CartDrawer`. Le reste est en P2.

---

## 5. SEO et performance

### 5-1 — P1 — Canonical et domaine incohérents
- En production, `https://morillesducanada.com/` renvoie un **307 (redirection temporaire)** vers `https://www.morillesducanada.com/` (vérifié avec curl).
- Pourtant `index.html:17,20`, `public/sitemap.xml` (8 URL), `robots.txt`, `JsonLdSchemas.tsx:3`, `GuideMorellesDeFeu.tsx`, `Galerie.tsx` et `Recettes.tsx` déclarent le domaine **apex**, tandis que `ProductDetail.tsx` et `Produits.tsx` déclarent **www**.
- Le `<link rel="canonical" href="https://morillesducanada.com/">` **statique** de `index.html:17` reste présent sur toutes les routes. Helmet ajoute un second canonical sur 7 pages, et les pages sans Helmet (`/pre-commande`, `/plaquette-pro`, `/fiche-technique`, `/livraison`, `/cgv`, `/mentions-legales`) **se canonisent vers la home**. Elles ne seront donc pas indexées, alors que `/pre-commande` est en priorité 0,9 dans le sitemap.
- **Correctif** : tout passer en `https://www.` ; retirer le canonical, les OG et les JSON-LD statiques de `index.html` et laisser Helmet les gérer page par page ; ajouter Helmet (title, description, canonical, OG) sur les 14 pages qui n'en ont pas ; passer la redirection apex vers www en 308 (Vercel → Domains → « Permanent »).

### 5-2 — P1 — Aperçu de lien cassé pour la prospection
- `og:image` = `https://morillesducanada.com/og-image.jpg` (`index.html:21,26`). **Ce fichier n'existe pas** : la réécriture SPA renvoie du HTML. Tout lien envoyé par email, LinkedIn ou WhatsApp à un chef s'affiche sans image.
- Le site est une SPA **sans prérendu** : les robots des réseaux sociaux ne lisent pas les balises ajoutées par Helmet, donc chaque lien, y compris `/plaquette-pro` et `/produits/...`, affiche le titre et la description de la home.
- **Correctif** : ajouter `public/og-image.jpg` (1200×630) et des OG par page, puis **prérendre** les routes publiques au build (`vite-plugin-prerender` ou `vite-react-ssg`), ou à défaut un middleware Vercel qui injecte les meta pour les user-agents de bots.

### 5-3 — P2 — Sitemap, robots et JSON-LD
- `sitemap.xml` : il manque `/produits`, `/produits/{4 slugs}`, `/recettes/{slug}`, `/fiche-technique` et la future page `/pro`. Il faut le générer au build depuis `products.ts` et la liste des routes.
- `robots.txt` : ajouter `Disallow: /admin`, `/profil`, `/auth`, `/paiement-*`.
- JSON-LD : Product et Organization sont en doublon (`index.html` et `JsonLdSchemas.tsx`), avec des prix obsolètes (P-5). `SearchAction` pointe vers `/recettes?q=`, qui n'implémente pas la recherche : à supprimer. `Organization.logo` = `favicon.ico` : utiliser un PNG carré d'au moins 112 px. Pour le B2B, ajouter `Offer` avec `eligibleCustomerType: Business`, `priceSpecification` par kg et `areaServed` UE.

### 5-4 — P2 — Bundle principal de 717 kB
Composition approximative du chunk `index` (sources non minifiées, via sourcemap) : `motion-dom` + `framer-motion` ≈ 450 kB, `@supabase/*` ≈ 510 kB, `react-router` + `@remix-run/router` ≈ 300 kB, `react-dom` 131 kB, `tailwind-merge` 72 kB, `@tanstack/query-core` 54 kB, `sonner` et `@radix-ui/react-toast` (**deux systèmes de toast**), i18n FR et EN chargés ensemble.
- Causes :
  - `Navbar` (eager) importe `supabase` (session) et `CartDrawer`, qui l'importe aussi.
  - `HeroSection` (eager) importe `framer-motion` complet.
  - `App.tsx:70-71` monte deux Toasters.
  - `QueryClientProvider` est inutilisé (aucun `useQuery` trouvé).
- **Correctifs** :
  - `LazyMotion` + `m` avec `domAnimation` (économise environ 100 kB minifié) ;
  - `import("@/integrations/supabase/client")` dynamique dans les handlers (checkout, auth) et chargement de la session après l'idle ;
  - un seul toaster (sonner) ;
  - suppression de React Query ;
  - chargement de `en.ts` à la demande ;
  - `build.rollupOptions.output.manualChunks = { react: [...], supabase: [...], motion: [...] }` pour le cache long terme.
  - Objectif : un index sous 250 kB minifié.

### 5-5 — P2 — Images et médias
- `public/favicon.png` fait **672 kB** et se charge sur chaque page (`index.html:5`). Il faut une version 32×32 et 180×180 de moins de 10 kB.
- `public/images/nees-du-feu-hero.jpg` fait 727 kB (fallback) et le `.webp` 391 kB (`OriginSection.tsx:76-78`). Il faut un `srcset` 640/1280/1920 et viser moins de 150 kB.
- Fichiers de `public/images` qui ne sont **référencés nulle part** mais déployés :
  - `cueillette-ambiance.mp4` (**9,7 Mo**)
  - `morilles-main-cueilleur.webp` (448 kB)
  - `morilles-trio-charbon.webp`
  - `portrait-valerian.webp`
  - `placeholder.svg`
  - Ils sont à supprimer ou à utiliser.
- Les images de la galerie, d'environ 100 à 200 kB chacune (`dist/assets`), passent par `lib/galleryPhotos.ts` : vérifier qu'elles sont chargées en lazy.
- Le lazy-loading des routes et des sections de la home est **correct** (`App.tsx:12-30`, `Index.tsx:8-19`). Le hero utilise `fetchPriority="high"`, c'est bien.

---

## 6. Qualité (P2) — liste courte
- **P2-1 — Dérive de schéma.** Les colonnes `reviews.email` et `recipes.sort_order` ainsi que l'alimentation du vault n'ont pas de migration. `types.ts` est obsolète. Il faut lancer `supabase db pull` puis `supabase gen types typescript --project-id oeweykyazadobobjncfg > src/integrations/supabase/types.ts`, et committer.
- **P2-2** — `tsconfig` en mode strict désactivé. Activer `strictNullChecks` progressivement.
- **P2-3** — Tests : il n'existe que `src/test/example.test.ts`. Ajouter au minimum des tests sur le calcul de prix et de port côté serveur (`_shared/catalog.ts`) et sur le webhook (payload fixture).
- **P2-4** — Emails : HTML non échappé partout. Créer une fonction `escapeHtml` partagée dans `_shared/`.
- **P2-5** — `reviews.approved DEFAULT true` (`migrations/20260315100903…sql:7`), alors que l'interface annonce « publié après validation » : n'importe qui publie instantanément sur la home. Passer le défaut à `false` et ajouter un captcha ou un honeypot.
- **P2-6** — Stock codé en dur (`products.ts:47,61,76,98`), sans lien avec les 45 kg réels. Commentaire d'allocation obsolète (`:1-6`).
- **P2-7** — Admin : export CSV sans protection contre l'injection de formules (`AdminDashboard.tsx:194-198`). Préfixer par `'` les cellules qui commencent par `= + - @`.
- **P2-8** — Désactivation du clic droit sur les images (`App.tsx:43-57`) : c'est inutile et cela gêne les acheteurs pros qui veulent enregistrer un visuel pour leur carte. À retirer, ou à remplacer par un kit presse téléchargeable.
- **P2-9** — `README.md` et `.lovable/plan.md` sont obsolètes (projet Lovable).

---

## 7. Plan d'implémentation recommandé

### Étape 0 — Correctifs P0 (1 jour, avant tout envoi de prospection)
1. Vérifier le mode Stripe (S6) et les triggers (S5). Régénérer la clé `service_role` si elle a fuité.
2. `create-checkout` : prix côté serveur uniquement (S1), avec les options B2B `tax_id_collection` et `invoice_creation` (P-6), et une route `/paiement-annule` (B7).
3. Verrouiller `notify-order-status` (S2), `notify-contact` et `auth-email-hook` (S3, signature + URL de vérification B8). Retirer les appels `functions.invoke("notify-*")` du front.
4. Migration `reviews` : restreindre les colonnes lisibles et passer `approved` à false par défaut (S4). Supprimer la policy d'insert anonyme sur `pre_orders`.
5. Webhook : lire `collected_information.shipping_details` (B6), index unique sur `stripe_session_id`, `unit_amount/100` dans la facture et l'email (B5).

### Étape 1 — Tunnel B2B « devis au kg + échantillon + notification » (2 à 3 jours)

**1. Base de données (migration `…_pro_leads.sql`)**
```sql
create type lead_kind as enum ('quote','sample','order');
create type lead_status as enum ('new','contacted','quoted','sample_sent','won','lost');
create table public.pro_leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  kind lead_kind not null,
  status lead_status not null default 'new',
  company_name text not null check (length(company_name) between 2 and 120),
  contact_name text not null check (length(contact_name) between 2 and 120),
  email text not null check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  phone text,
  business_type text not null check (business_type in ('restaurant','epicerie','grossiste','traiteur','autre')),
  siret text, vat_number text,
  city text, country text not null default 'FR',
  variety text check (variety in ('brune','blonde-grise','mix','verte')),
  quantity_kg numeric(6,2) check (quantity_kg is null or quantity_kg between 0.1 and 45),
  frequency text,                       -- ponctuel / mensuel / saison
  needed_by date,
  shipping_address jsonb,               -- pour les échantillons
  indicative_price_per_kg integer,      -- centimes, calculé côté serveur
  indicative_total integer,
  message text check (length(message) <= 4000),
  locale text default 'fr',
  utm jsonb, referrer text, ip_hash text,
  admin_notes text, quoted_price_per_kg integer
);
alter table public.pro_leads enable row level security;
create policy "admin read"   on public.pro_leads for select to authenticated using (has_role(auth.uid(),'admin'));
create policy "admin update" on public.pro_leads for update to authenticated using (has_role(auth.uid(),'admin'));
-- pas de policy d'insert : l'insertion passe par l'edge function en service_role
create unique index pro_leads_one_sample_per_company on public.pro_leads (lower(email)) where kind = 'sample';
-- + policy SELECT admin sur contact_messages (qui n'en a aucune aujourd'hui)
```

**2. Grille tarifaire unique (`supabase/functions/_shared/proPricing.ts`, copiée ou générée dans `src/lib/proPricing.ts`)**
```ts
export const PRO_TIERS = [ // €/kg nets, TVA non applicable 293 B
  { minKg: 1,  brune: 360, blonde: 390 },
  { minKg: 5,  brune: 340, blonde: 370 },
  { minKg: 10, brune: 320, blonde: 350 },   // à valider commercialement : palier « grossiste » pour écouler le volume
];
export const SAMPLE = { grams: 20, maxPerCompany: 1, freeIfBusinessWithSiret: true };
export function quote(variety, kg) { const t = [...PRO_TIERS].reverse().find(t => kg >= t.minKg); return { perKg: t[variety], total: Math.round(kg * t[variety] * 100) }; }
```
La plaquette, la page `/pro`, le JSON-LD et l'edge function importent tous cette même grille.

**3. Edge function `submit-pro-lead`** (`verify_jwt = true`, appelable avec la clé anon)
- Validation zod, honeypot (`website` doit rester vide) et contrôle d'un délai minimal de remplissage (supérieur à 3 s).
- Limitation de débit : 5 demandes par heure par `ip_hash` (sha256 de l'IP + sel) via un `count` sur `pro_leads`.
- Recalcul serveur de `indicative_price_per_kg` et de `indicative_total`. Contrôle SIRET optionnel (format sur 14 chiffres, avec en option un appel à l'API Sirene pour préremplir la raison sociale).
- `insert` dans `pro_leads`, puis `enqueue_email` × 2 :
  - **admin** → `contact@morillesducanada.com`, avec `reply_to` = email du lead. Sujet : `[DEVIS] 5 kg brune — Restaurant X (Lyon)` ou `[ÉCHANTILLON] Épicerie Y (Paris)`. Le corps contient un tableau récapitulatif, un lien vers `/admin?lead=<id>` et un bouton `tel:`.
  - **prospect** : accusé de réception FR/EN (délai de réponse de 24 h, lien vers la plaquette et la fiche technique, numéro direct).
- Réponse `{ id }`. Le front n'affiche le succès **qu'après** le 200. En cas d'échec, afficher le téléphone et l'email à contacter directement.
- Sécurité supplémentaire : un fallback d'envoi direct à Resend si `enqueue_email` échoue, et un cron quotidien qui alerte (email ou SMS) si la DLQ n'est pas vide.

**4. Front**
- Nouvelle route `/pro` (qui remplace `/pre-commande`, avec une redirection 301 dans `vercel.json`). Elle comprend :
  - un bandeau « Stock disponible : 45 kg — récolte 2026 — expédition 48/72 h » ;
  - la grille dégressive ;
  - 2 onglets : **Devis au kg** (type d'établissement, variété, kg via un slider de 1 à 45 avec prix indicatif en direct, fréquence, date souhaitée) et **Échantillon gratuit** (SIRET, adresse de livraison, usage prévu) ;
  - un lien « Commander maintenant » vers le sous vide 500 g ou 1 kg pour les petites quantités.
- Le code des formulaires est partagé (`react-hook-form` + zod, déjà dans les dépendances). Chaque formulaire récupère les UTM stockés en `sessionStorage` au premier chargement.
- CTA « Espace pro — tarifs au kg » dans le hero, la nav et le FloatingCTA. `ContactSection` : si le type choisi est « professionnel », rediriger vers `/pro`.
- Page traduite FR/EN avec Helmet (title, description, canonical www, OG avec une image dédiée), et ajoutée au sitemap.
- Événement analytics `generate_lead` (kind, kg).

**5. Admin**
- Onglet « Leads pro » : liste `pro_leads` et `contact_messages`, filtres par statut et type, changement de statut, notes, bouton « Envoyer le devis » (email prérempli avec `quoted_price_per_kg`, puis passage au statut `quoted`) et export CSV sécurisé.
- KPI : kg demandés, kg gagnés, kg restants sur les 45.

**6. Recette et mise en production**
- Tests unitaires `quote()` et validation zod. Test de la fonction avec `supabase functions serve` et un `curl` par cas (valide, honeypot, rate-limit, champs invalides).
- Vérifier la réception réelle sur contact@ (et Reply-To), puis relire une ligne `email_send_log`.
- Déploiement : migration, puis fonction, puis front (preview Vercel, puis production), et enfin mise à jour de la plaquette PDF avec des prix nets.

### Étape 2 — P1 restants (1 à 2 jours)
- Mettre la plaquette en prix nets (B3), mettre à jour les textes de saison (B2), corriger les frais de port UE (P-3), les factures conformes (B5) et le hook d'authentification (B8).
- SEO : canonical www, suppression des meta statiques, Helmet sur toutes les pages, `og-image`, sitemap généré, prérendu des routes publiques (5-1, 5-2).

### Étape 3 — P2 (au fil de l'eau)
- Réduction du bundle (5-4), images (5-5), régénération des types et `db pull` (P2-1), lint, tests, en-têtes de sécurité, traduction EN des pages restantes.
