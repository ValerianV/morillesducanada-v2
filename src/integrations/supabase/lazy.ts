// Chargement différé du client Supabase : il sort du bundle initial des pages
// qui n'en ont besoin qu'après le premier rendu (session de la barre de navigation, paiement).
export const loadSupabase = () => import("./client").then((module) => module.supabase);
