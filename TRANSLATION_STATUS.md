# Translation Status — morillesducanada.com

i18n infrastructure: `src/i18n/fr.ts`, `src/i18n/en.ts`, `src/i18n/context.tsx`
Toggle: Navbar FR/EN switch (already in place)

---

## Done

| Page / Component | Status | Notes |
|---|---|---|
| Homepage sections (Hero, Origin, About, Products, Why, Process, Gallery, Professional, FAQ, Contact, Footer) | Full FR + EN | Via existing keys in `fr.ts` / `en.ts` |
| `PreOrder.tsx` | Full FR + EN | Keys added under `preorder.*` — all visible labels, headings, form fields, success/error messages |
| `ProductsSection.tsx` | Full FR + EN | Already used `useI18n()` |
| `fr.ts` / `en.ts` professional section | Updated | Variety names corrected (Blonde & Grise), VAT notice added |

---

## To do (priority order)

| Page | Priority | Notes |
|---|---|---|
| `ProductDetail.tsx` | HIGH | Product descriptions already in `products.ts` with `descriptionEn`. Headings, CTAs, rehydration guide still hardcoded FR |
| `Produits.tsx` | HIGH | Listing page — headings, filters hardcoded FR |
| `GuideMorellesDeFeu.tsx` | MEDIUM | Long SEO page, mostly static content |
| `CGV.tsx` | MEDIUM | Legal text — add EN disclaimer at top per brief |
| `Livraison.tsx` | MEDIUM | Shipping info |
| `MentionsLegales.tsx` | LOW | Legal — add EN disclaimer at top per brief |
| `Recettes.tsx` / `RecetteDetail.tsx` | LOW | Recipe content from Supabase — would need EN content in DB |
| `Galerie.tsx` | LOW | Minimal text |
| `Journal.tsx` | LOW | Blog posts from Supabase — would need EN content in DB |
| `Auth.tsx` / `ResetPassword.tsx` / `Profil.tsx` | LOW | Account pages |
| `PaymentSuccess.tsx` / `PreOrderSuccess.tsx` | LOW | Confirmation pages |
| `FicheTechnique.tsx` | LOW | B2B doc, primarily FR audience |
| `PlaquettePro.tsx` | LOWEST | Explicitly flagged as low priority in brief |

---

## Notes

- Legal pages (CGV, MentionsLegales, Livraison) EN version should open with:
  *"The French version of these terms is legally binding. This English translation is provided for convenience only."*
- Recipe and blog content in EN would require adding EN fields to Supabase tables.
- `t()` function resolves dot-separated keys from `fr.ts` / `en.ts` objects.
