-- Supabase Migration: Add is_published column to properties table
-- Run this in your Supabase SQL Editor to support direct column queries

ALTER TABLE public.properties 
ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT true;

-- Update existing records to ensure all active properties are published
UPDATE public.properties 
SET is_published = true 
WHERE is_published IS NULL;

-- Create index for faster frontend queries
CREATE INDEX IF NOT EXISTS idx_properties_is_published ON public.properties(is_published);
