# État du moment — Morilles du Canada

**À lire en premier** par chaque tâche planifiée et chaque session, avant les skills.
**À mettre à jour** par toute session qui apprend un fait ou une décision (stock, zone, canal, ton, envoi fait),
dans la même session, en remplaçant la ligne périmée et en datant le changement. Les décisions durables vont aussi
dans `docs/decisions.md`. Chiffres confidentiels (stock par propriétaire, prix d'achat, plancher) :
`docs/interne/confidentiel.md`, jamais ici.

Dernière mise à jour : 2026-11-27 (matin).

## Où écrire quoi

| Fait | Fichier |
|---|---|
| État du moment (ce fichier) | `docs/etat-courant.md` |
| Décision durable | `docs/decisions.md` |
| Prospect, envoi, réponse, relance due | carnet https://claude.ai/artifact/R9M8EhDc4rVHk6GQ5UQFiT (collection `prospects`) |
| Confidentiel (stock par propriétaire, coûts) | `docs/interne/confidentiel.md` (non versionné) |
| Leçon tirée d'un résultat | `docs/commercial/apprentissages.md` |
| Prompts des tâches planifiées | `~/.claude/scheduled-tasks/<id>/SKILL.md` |

## Situation

- Clientèle : **professionnels uniquement** (restaurants, traiteurs, chefs à domicile ; grossistes pour un lot).
- Stock communicable : **23 kg** de morilles de feu séchées (2026-11-26). Vérifier ce fichier avant de citer un chiffre.
  Les « jumbos » ne sont jamais vendus à part (lot non trié).
- Valérian est en formation de moniteur de ski et se déplace entre stations des Alpes : **Maurienne en décembre 2026**.
  Aucune visite, aucun rendez-vous sur place.
- **Échantillon** (2026-11-26) : plus aucun pot offert. Le pot de 30 g est vendu 20 € + frais de port ; si le client
  commande ensuite 1 kg ou plus, les 20 € sont déduits de la commande. Montant du port de l'échantillon : non fixé, ne pas l'annoncer.
- Expédition depuis la Provence (Aubignan), sous 5 jours ouvrés.

## Prospection

- Zone : toutes les Alpes françaises, un secteur par semaine (liste dans la tâche « Nouveaux prospects »).
- Canal : **écrit d'abord** (email ; WhatsApp avec les contacts déjà en échange sur WhatsApp) ; **appel seulement après une réponse**.
- Ton : chaleureux et personnel, comme un message tapé par Valérian ; **vouvoiement**, sauf si le client tutoie en premier.
  Signature email en 4 lignes (voir `docs/decisions.md`, 2026-10-07).
- Relances : écrites, dans le même fil, à J+5 puis J+12 (dates `relance_j5` et `relance_j12` du carnet).

## En cours

- 2026-11-26 : 7 restaurants des Alpes écrits par email (Hameau Albert 1er, Auberge du Bois Prin, Le Saint-Nicolas,
  Le Chabichou, L'Atelier, La Chamade, L'Auberge du Choucas) : **relance le 2026-12-01** (champ `relance_j5` du carnet).
- 2026-11-26 : Barbara (Gaudineto) a répondu, Valérian lui a répondu ; Sven (Simple Simon) relancé sur WhatsApp.
- 2026-11-21 : 9 grossistes écrits pour le lot ; relances le 26/11 et routine cloud de contrôle le 28/11.
- 2026-11-27 : aucune réponse humaine aux 7 emails des Alpes ; Auberge du Bois Prin fermée jusqu'au 04/12 (réponse automatique). Maison Masse silencieuse depuis le 22/11 (brouillon dans le courrier du 27/11, à valider).
- 2026-11-27 : 5 relances par email (Le Delas, Thiercelin, Le Goût du Sud, Maison Masse, Le Goût du Jour) et 1 WhatsApp (Sourcé / Yume) envoyés vers 18 h après validation de Valérian ; relances J+12 des 3 grossistes sans réponse le 03/12.
- 2026-11-27 : Prospection : toujours depuis valerian@morillesducanada.com via Resend, jamais le Gmail perso. Échantillon : pot 30 g à 20 € + 6,90 € de port, déduit dès 1 kg.
- 2026-11-27 : Précommande 2027 : mêmes prix que la vente directe. 350 €/kg dès 1 kg, 330 € dès 3 kg, 310 € dès 5 kg, 290 € dès 10 kg. Acompte de 50 %.
- 2026-11-27 : Le site parle toujours au « je ».
- 2026-11-27 : Positionnement : du premium pour des passionnés de cuisine et de champignons.
- 2026-11-27 : Toujours proposer deux moyens de paiement : Stripe et virement.
