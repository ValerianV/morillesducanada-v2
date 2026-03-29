-- Role enum and user_roles table
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles (avoids RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Admins can read user_roles
CREATE POLICY "Admins can read user_roles" ON public.user_roles
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Admins can read ALL orders
CREATE POLICY "Admins can read all orders" ON public.orders
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Admins can update orders
CREATE POLICY "Admins can update orders" ON public.orders
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Admins can read all pre_orders
CREATE POLICY "Admins can read all pre_orders" ON public.pre_orders
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Admins can update pre_orders
CREATE POLICY "Admins can update pre_orders" ON public.pre_orders
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));