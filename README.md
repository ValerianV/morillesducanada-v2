# morillesducanada.com

Site e-commerce pour Morilles du Canada — morilles de feu sauvages séchées,
récoltées en Colombie-Britannique et au Yukon, commercialisées en France.

## Stack technique

- Frontend : Vite + React + TypeScript
- Styling : Tailwind CSS + shadcn/ui + Radix UI
- Backend : Supabase (PostgreSQL, Auth, Edge Functions)
- Paiements : Stripe
- Email : Resend (via Edge Functions Supabase)
- Hébergement : Vercel
- Domaine : morillesducanada.com

## Développement local

Prérequis : Node.js 20+ et npm.

```bash
git clone https://github.com/ValerianV/morillesducanada-v2.git
cd morillesducanada-v2
npm install
npm run dev
```

Créer un fichier `.env.local` avec les variables Supabase / Stripe publiques.

## Scripts disponibles

- `npm run dev` : serveur de développement local
- `npm run build` : build de production
- `npm run preview` : prévisualisation du build
- `npm run lint` : vérification ESLint

## Déploiement

Déploiement automatique sur Vercel à chaque push sur la branche principale.

## Licence

Code propriétaire — tous droits réservés.
