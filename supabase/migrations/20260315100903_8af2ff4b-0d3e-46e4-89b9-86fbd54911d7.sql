
CREATE TABLE public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  approved BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Anyone can read approved reviews
CREATE POLICY "Anyone can read approved reviews"
ON public.reviews FOR SELECT
USING (approved = true);

-- Anyone can insert reviews
CREATE POLICY "Anyone can insert reviews"
ON public.reviews FOR INSERT
WITH CHECK (true);

-- Only admins can update reviews
CREATE POLICY "Admins can update reviews"
ON public.reviews FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Only admins can delete reviews
CREATE POLICY "Admins can delete reviews"
ON public.reviews FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Admin can read all reviews (including non-approved)
CREATE POLICY "Admins can read all reviews"
ON public.reviews FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
