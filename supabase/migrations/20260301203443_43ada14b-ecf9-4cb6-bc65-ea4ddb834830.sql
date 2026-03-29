
CREATE TABLE public.recipes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  chef_name TEXT NOT NULL,
  chef_title TEXT,
  difficulty TEXT NOT NULL DEFAULT 'Intermédiaire',
  prep_time INTEGER NOT NULL DEFAULT 15,
  cook_time INTEGER NOT NULL DEFAULT 30,
  servings INTEGER NOT NULL DEFAULT 4,
  image_url TEXT,
  ingredients JSONB NOT NULL DEFAULT '[]'::jsonb,
  steps JSONB NOT NULL DEFAULT '[]'::jsonb,
  tips TEXT,
  tags TEXT[] DEFAULT '{}',
  published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- RLS: public read for published recipes (SEO)
ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read published recipes"
  ON public.recipes
  FOR SELECT
  USING (published = true);
