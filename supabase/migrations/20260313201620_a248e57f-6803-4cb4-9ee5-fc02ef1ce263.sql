-- Orders table for retail purchases
CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  email text NOT NULL,
  customer_name text NOT NULL,
  stripe_session_id text,
  stripe_payment_intent text,
  status text NOT NULL DEFAULT 'pending',
  items jsonb NOT NULL DEFAULT '[]'::jsonb,
  total_amount integer NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'eur',
  shipping_address jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own orders" ON public.orders
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage orders" ON public.orders
  FOR ALL TO service_role
  USING (true) WITH CHECK (true);

-- Pre-orders table for professional bulk orders
CREATE TABLE public.pre_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name text NOT NULL,
  contact_name text NOT NULL,
  email text NOT NULL,
  phone text,
  morel_type text NOT NULL,
  quantity_kg numeric(10,2) NOT NULL,
  total_amount numeric(10,2) NOT NULL,
  stripe_session_id text,
  stripe_payment_intent text,
  status text NOT NULL DEFAULT 'pending',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.pre_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create pre-orders" ON public.pre_orders
  FOR INSERT TO public
  WITH CHECK (true);

CREATE POLICY "Service role can manage pre-orders" ON public.pre_orders
  FOR ALL TO service_role
  USING (true) WITH CHECK (true);