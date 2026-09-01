-- Supabase Migration: Dynamic Add Property Form Updates
-- Run this in your Supabase SQL Editor

-- 1. Add new columns
ALTER TABLE properties 
ADD COLUMN IF NOT EXISTS property_type TEXT CHECK (property_type IN ('land', 'house')),
ADD COLUMN IF NOT EXISTS property_type_needs_review BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS acquisition_type TEXT CHECK (acquisition_type IN ('investment', 'ownership')),
ADD COLUMN IF NOT EXISTS ownership_subtype TEXT CHECK (ownership_subtype IN ('co-ownership', 'full-ownership')),
ADD COLUMN IF NOT EXISTS documentation_charges NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS price_per_slot NUMERIC,
ADD COLUMN IF NOT EXISTS payment_method TEXT CHECK (payment_method IN ('down_payment_spread', 'full_payment', 'halal_mortgage'));

-- 2. Modify existing columns to be nullable where required by new flexible paths
ALTER TABLE properties ALTER COLUMN min_investment DROP NOT NULL;
ALTER TABLE properties ALTER COLUMN returns_percent DROP NOT NULL;
ALTER TABLE properties ALTER COLUMN duration_months DROP NOT NULL;
ALTER TABLE properties ALTER COLUMN payout_style DROP NOT NULL;

-- 3. Backfill existing rows
UPDATE properties
SET 
  acquisition_type = 'investment',
  ownership_subtype = NULL,
  property_type = CASE WHEN category = 'land' THEN 'land' ELSE 'house' END,
  property_type_needs_review = CASE WHEN category IN ('commercial', 'mixed_use') THEN true ELSE false END,
  documentation_charges = 0
WHERE acquisition_type IS NULL;

-- 4. Enforce NOT NULL constraints on critical new columns
ALTER TABLE properties ALTER COLUMN property_type SET NOT NULL;
ALTER TABLE properties ALTER COLUMN property_type_needs_review SET NOT NULL;
ALTER TABLE properties ALTER COLUMN acquisition_type SET NOT NULL;
ALTER TABLE properties ALTER COLUMN documentation_charges SET NOT NULL;
