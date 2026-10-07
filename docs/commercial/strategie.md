# Stratégie commerciale

Depuis le 2026-09-28, **le site est réservé aux professionnels** (SIRET demandé à la commande) :
aucune vente aux particuliers. Voir `docs/business/offre.md`.

## Cibles (par priorité)

| Segment | Qui | Pourquoi | Volume typique |
|---|---|---|---|
| B | Épiceries fines premium, crèmeries | Stock de fêtes en oct.–nov. ; achètent le vrac sous vide (sachets de 250 g) et le reconditionnent sous leur marque | 1–5 kg, parfois 5–15 kg |
| D | Traiteurs et fabricants haut de gamme (pâté en croûte, boudin blanc, fromages aux morilles) | Consommation régulière et volumes de fêtes | 5–15 kg |
| C | Tables gastronomiques / étoilées ayant la morille à la carte, chefs « cueillette » | Sensibles au récit, payent le mieux, achètent peu | 1–3 kg |
| A | Distributeurs premium pour chefs | Rares, doivent revendre cher | variable |

**Exclus** : grossistes de volume, brasseries, bouchons, restauration à prix moyen,
industriels (Picard, Thiriet, Saint Jean…). Hors France : pas de pros tant qu'une solution TVA/douane
n'est pas définie.

Écouler ≈ 45 kg demande 10 à 15 clients pros qui commandent réellement.

## Fichiers

- `prospects.csv` — base de prospects (contacts **publics** professionnels uniquement ;
  jamais d'email personnel deviné). Colonnes : nom, segment, ville, site, contact_public,
  type_contact, fit, priorite, volume_estime, source_url.
- `emails-prospection.md` — séquences par segment (J0, J+5, J+12), script d'appel, règles.
- `vague1.md` — première vague prête (10 emails, segments B et D, priorité 1).

## Processus

1. `/prospect-b2b` prépare une vague (10–30 prospects), personnalisée à partir d'un fait
   vérifiable sur l'établissement (carte, rayon, produit).
2. **Validation du fondateur** sur la vague entière avant tout envoi.
3. Envoi via Resend depuis `valerian@pro.morillesducanada.com` (sous-domaine dédié,
   ne pas utiliser le domaine principal pour la prospection), `reply-to: contact@morillesducanada.com`.
   Rythme : ≤ 20 emails/jour au démarrage. Désinscription « STOP » honorée immédiatement.
4. Les prospects sans email public : appel du fondateur (script dans `emails-prospection.md`).
5. Relances J+5 et J+12, puis arrêt.
6. Chaque réponse → statut dans `prospects.csv` (colonne à ajouter) ; chaque lead du site → table `pro_leads`.
7. Revue hebdomadaire `/suivi-commercial`.

## Cadre légal (B2B, CNIL)

Prospection B2B par email autorisée si le message concerne l'activité professionnelle du destinataire,
identifie clairement l'expéditeur et propose une désinscription simple.

## Offre à mettre en avant

Stock disponible (argument fêtes) + remise en main propre d'un pot de 30 g (zones et dates du calendrier ; envoi possible au cas par cas après échange, jamais sur simple demande) + sachets sous vide de 250 g
+ devis sous 48 h ouvrées + précommande 2027 (réservée aux pros) dans les relances.
Prix : voir `docs/business/offre.md`. Ne jamais citer le prix plancher.

## Règle de démarchage (2026-10-07)

**On démarche pour obtenir un rendez-vous ; on ne visite jamais sans rendez-vous.** Le pot de 30 g est remis pendant
le rendez-vous. Cibles : restaurants de qualité, traiteurs, chefs à domicile ; pas de fromagers ni d'épiceries.

Ordre des canaux pour un prospect :
1. **Email court** si une adresse professionnelle est publiée (modèle : `demande-rdv.md`, section 3).
2. **WhatsApp** si un mobile est publié comme numéro de l'établissement : tout de suite s'il n'y a pas d'email,
   sinon 4 jours après un email resté sans réponse (jamais le même jour).
3. **Téléphone** (15 h – 17 h, par le fondateur) pour les numéros fixes et les priorités 1 sans réponse.
4. **Instagram** en dernier recours.

Règles WhatsApp (décision du 2026-10-07) : envoi par WhatsApp Web dans le Chrome du fondateur, uniquement des numéros
publiés pour l'établissement, un seul message par prospect, jamais de relance WhatsApp sans réponse, 10 messages par jour
au plus, chaque liste validée par le fondateur avant envoi. Le numéro personnel du fondateur est en jeu : un prospect
qui signale le message peut faire bloquer le compte.

## Suivi : le carnet de démarchage est la seule source de vérité

- Carnet : https://claude.ai/artifact/R9M8EhDc4rVHk6GQ5UQFiT (base de l'artifact, collection `prospects`). Statuts : À contacter → RDV demandé → RDV pris →
  Visité, pot remis → Client, ou Pas intéressé / STOP. Chaque envoi, réponse et visite y est noté le jour même.
- Export de sauvegarde : `docs/interne/prospection/carnet-export-AAAA-MM-JJ.csv` (non versionné, données de contact).
- `docs/commercial/prospects.csv` et `vagueN.md` sont des archives du 28/09 au 01/10 : ne plus les mettre à jour.
