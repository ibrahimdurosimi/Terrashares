-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'investor' CHECK (role IN ('investor', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Properties Table
CREATE TABLE IF NOT EXISTS public.properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  location TEXT NOT NULL,
  description TEXT NOT NULL,
  image_urls TEXT[] DEFAULT '{}',
  min_investment NUMERIC NOT NULL,
  returns_percent NUMERIC NOT NULL,
  duration_months INT NOT NULL,
  payout_style TEXT NOT NULL CHECK (payout_style IN ('after_maturity', 'monthly')),
  category TEXT NOT NULL CHECK (category IN ('residential', 'commercial', 'land', 'mixed_use')),
  type_details JSONB NOT NULL DEFAULT '{}',
  is_fractional BOOLEAN NOT NULL DEFAULT false,
  unit_value NUMERIC,
  total_units INT,
  units_sold INT DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'closed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Property Valuations Table
CREATE TABLE IF NOT EXISTS public.property_valuations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  recorded_date DATE NOT NULL DEFAULT CURRENT_DATE,
  value NUMERIC NOT NULL,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Investments Table
CREATE TABLE IF NOT EXISTS public.investments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE RESTRICT,
  amount NUMERIC NOT NULL,
  units_purchased INT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'matured')),
  invested_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  matures_at TIMESTAMPTZ
);

-- Leads Table
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'converted')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- FAQs Table
CREATE TABLE IF NOT EXISTS public.faqs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Row Level Security (RLS) setup

-- First, drop all existing policies on users to ensure a clean slate
DO $BODY$
DECLARE
    pol record;
BEGIN
    FOR pol IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'users' AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.users', pol.policyname);
    END LOOP;
END
$BODY$;

-- Helper function to check admin status securely
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $BODY$
DECLARE
  is_admin_user boolean;
BEGIN
  -- First try to get it from JWT to avoid DB queries entirely
  IF (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin' THEN
    RETURN true;
  END IF;

  -- Fallback: Use a direct query securely
  SELECT role = 'admin' INTO is_admin_user 
  FROM public.users 
  WHERE id = auth.uid()
  LIMIT 1;
  
  RETURN COALESCE(is_admin_user, false);
END;
$BODY$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 1. Users
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile" 
ON public.users FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON public.users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all users" 
ON public.users FOR SELECT USING (public.is_admin());

CREATE POLICY "Admins can insert users" 
ON public.users FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update all users" 
ON public.users FOR UPDATE USING (public.is_admin());

CREATE POLICY "Admins can delete users" 
ON public.users FOR DELETE USING (public.is_admin());

-- 2. Properties
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Properties are publicly viewable" ON public.properties FOR SELECT USING (true);
CREATE POLICY "Admins can manage properties" ON public.properties FOR ALL USING (public.is_admin());

-- 3. Property Valuations
ALTER TABLE public.property_valuations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Property valuations are publicly viewable" ON public.property_valuations FOR SELECT USING (true);
CREATE POLICY "Admins can manage property valuations" ON public.property_valuations FOR ALL USING (public.is_admin());

-- 4. Investments
ALTER TABLE public.investments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Investors can view their own investments" ON public.investments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage investments" ON public.investments FOR ALL USING (public.is_admin());

-- 5. Leads
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Leads can be inserted by anyone" ON public.leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view and manage leads" ON public.leads FOR ALL USING (public.is_admin());

-- 6. FAQs
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "FAQs are publicly viewable" ON public.faqs FOR SELECT USING (true);
CREATE POLICY "Admins can manage FAQs" ON public.faqs FOR ALL USING (public.is_admin());

-- Trigger to automatically create a user profile when a new auth user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $BODY$
BEGIN
  INSERT INTO public.users (id, email, full_name, role)
  VALUES (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'full_name', 
    COALESCE(new.raw_user_meta_data->>'role', 'investor')
  );
  RETURN new;
EXCEPTION WHEN OTHERS THEN
  RAISE LOG 'Error in handle_new_user: %', SQLERRM;
  RETURN new;
END;
$BODY$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
