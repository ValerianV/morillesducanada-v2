-- Recettes : retrait du goût « fumé » (non validé par le fondateur), des superlatifs creux,
-- de l'« or liquide », de la truffe et des « queues » de morilles (nos morilles sont équeutées).
-- Données seulement, aucune structure. Idempotente : chaque UPDATE réécrit une valeur fixe,
-- et les étapes ne sont remplacées que si leur texte contient encore l'ancienne formulation.

UPDATE public.recipes SET description = 'Un risotto crémeux aux morilles de feu : les morilles réhydratées et leur jus de trempage filtré parfument le bouillon.'
  WHERE slug = 'risotto-cremeux-morilles';
UPDATE public.recipes SET description = 'Une entrée de saison : velouté de morilles de feu à la crème légère, quelques morilles entières pour le dressage.'
  WHERE slug = 'veloute-morilles-creme';
UPDATE public.recipes SET description = 'Le classique filet de bœuf et sa sauce aux morilles de feu, montée au jus de trempage et à la crème.'
  WHERE slug = 'filet-boeuf-sauce-morilles';
UPDATE public.recipes SET description = 'Des tagliatelles fraîches, une sauce crème aux morilles de feu et du parmesan : un plat prêt en 30 minutes.'
  WHERE slug = 'tagliatelles-morilles-parmesan';
UPDATE public.recipes SET description = 'Un poulet fermier mijoté à la crème et aux morilles de feu, pour un repas en famille.'
  WHERE slug = 'poulet-creme-morilles';
UPDATE public.recipes SET description = 'Une sauce forestière pour viandes, volailles et pâtes : réhydratation lente, morilles saisies, jus de trempage réduit.'
  WHERE slug = 'sauce-forestiere-morilles';
UPDATE public.recipes SET description = 'La sauce forestière sans produit animal : le lait de coco remplace la crème autour des morilles de feu.'
  WHERE slug = 'sauce-forestiere-vegan-morilles';
UPDATE public.recipes SET description = 'La fondue savoyarde aux morilles de feu : les morilles infusent dans le vin blanc avant d''être ajoutées au fromage.'
  WHERE slug = 'fondue-savoyarde-morilles';
UPDATE public.recipes SET description = 'Un risotto végétal aux morilles de feu : le lait de coco et la levure nutritionnelle remplacent le beurre et le parmesan.'
  WHERE slug = 'risotto-vegan-morilles-coco';
UPDATE public.recipes SET description = 'Un velouté végétal de topinambours, doux et légèrement noisette, avec des morilles de feu.'
  WHERE slug = 'veloute-vegan-topinambours-morilles';

UPDATE public.recipes SET tips = 'Une ou deux cuillères d''eau de cuisson dans la sauce la rendent plus soyeuse.'
  WHERE slug = 'tagliatelles-morilles-parmesan';
UPDATE public.recipes SET tips = 'Utiliser du lait de coco entier (pas allégé) : sa teneur en matière grasse lie la sauce. Pour une sauce plus concentrée, remplacer la moitié du bouillon de légumes par le jus de trempage filtré des morilles.'
  WHERE slug = 'sauce-forestiere-vegan-morilles';
UPDATE public.recipes SET tips = 'La levure nutritionnelle est l''ingrédient clé de ce risotto végétal : ne pas la remplacer. Garder le jus de trempage filtré pour mouiller le riz en fin de cuisson.'
  WHERE slug = 'risotto-vegan-morilles-coco';
UPDATE public.recipes SET tips = 'Les topinambours s''oxydent vite une fois épluchés : les plonger dans de l''eau citronnée au fur et à mesure. La pomme de terre lie le velouté.'
  WHERE slug = 'veloute-vegan-topinambours-morilles';

-- Étapes : remplacement ciblé (index de l'étape dans le tableau JSON), seulement si l'ancien texte est présent.
UPDATE public.recipes
  SET steps = jsonb_set(steps, '{0,description}', to_jsonb('Plonger les morilles séchées dans 300 ml d''eau tiède (30 à 40 °C) pendant 25 minutes. Les soulever délicatement, filtrer le jus de trempage à travers un linge fin et le réserver pour le risotto.'::text))
  WHERE slug = 'risotto-cremeux-morilles' AND steps -> 0 ->> 'description' LIKE '%or liquide%';

UPDATE public.recipes
  SET steps = jsonb_set(steps, '{1,description}', to_jsonb('Dans une grande casserole à fond épais, chauffer 2 c.s. d''huile d''olive à feu vif. Ajouter les morilles égouttées et les saisir 3 à 4 minutes sans les remuer, pour qu''elles colorent légèrement. Réserver les morilles.'::text))
  WHERE slug = 'risotto-vegan-morilles-coco' AND steps -> 1 ->> 'description' LIKE '%fum%';

UPDATE public.recipes
  SET steps = jsonb_set(steps, '{0,description}', to_jsonb('Verser 250 ml d''eau tiède (environ 35 °C) sur les morilles : l''eau bouillante altère leur texture. Laisser tremper 30 minutes à couvert. Filtrer à travers un linge fin, presser légèrement les morilles et conserver tout le jus de trempage.'::text))
  WHERE slug = 'sauce-forestiere-morilles' AND steps -> 0 ->> 'description' LIKE '%fum%';
UPDATE public.recipes
  SET steps = jsonb_set(steps, '{1,description}', to_jsonb('Dans une sauteuse, chauffer le beurre à feu vif jusqu''à ce qu''il mousse. Ajouter les morilles égouttées et les faire sauter 3 à 4 minutes sans les remuer au début, pour qu''elles colorent légèrement.'::text))
  WHERE slug = 'sauce-forestiere-morilles' AND steps -> 1 ->> 'description' LIKE '%fum%';
UPDATE public.recipes
  SET steps = jsonb_set(steps, '{5,description}', to_jsonb('Goûter et rectifier l''assaisonnement : la sauce doit être ronde et nappante. Si elle manque de corps, la réduire encore 2 à 3 minutes à feu vif. Napper viandes ou pâtes et servir aussitôt.'::text))
  WHERE slug = 'sauce-forestiere-morilles' AND steps -> 5 ->> 'description' LIKE '%fum%';

UPDATE public.recipes
  SET steps = jsonb_set(steps, '{1,description}', to_jsonb('Dans une sauteuse, chauffer l''huile d''olive à feu vif. Ajouter les morilles égouttées et les saisir 3 à 4 minutes sans les remuer au début, pour qu''elles colorent légèrement.'::text))
  WHERE slug = 'sauce-forestiere-vegan-morilles' AND steps -> 1 ->> 'description' LIKE '%fum%';
UPDATE public.recipes
  SET steps = jsonb_set(steps, '{5,description}', to_jsonb('La sauce doit être dorée et crémeuse. Si elle manque de corps, ajouter quelques gouttes de sauce soja. Servir sur des pâtes, un risotto végétal, des légumes rôtis ou du tofu grillé.'::text))
  WHERE slug = 'sauce-forestiere-vegan-morilles' AND steps -> 5 ->> 'description' LIKE '%fum%';

UPDATE public.recipes
  SET steps = jsonb_set(steps, '{4,description}', to_jsonb('Mixer 2 minutes à pleine puissance, puis passer au chinois. Remettre sur feu doux et incorporer le lait de coco ou la crème d''avoine. Ajouter le jus de citron, puis assaisonner de sel, de poivre blanc et de muscade.'::text))
  WHERE slug = 'veloute-vegan-topinambours-morilles' AND steps -> 4 ->> 'description' LIKE '%parfaitement%';
