-- =====================================================
-- SHUBH OSINT - Complete Supabase Setup Script
-- Copy and paste this entire script in Supabase SQL Editor
-- =====================================================

-- 1. Create app_settings table
CREATE TABLE IF NOT EXISTS public.app_settings (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    setting_key TEXT NOT NULL UNIQUE,
    setting_value JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 2. Create captured_photos table
CREATE TABLE IF NOT EXISTS public.captured_photos (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id TEXT NOT NULL,
    image_data TEXT NOT NULL,
    user_agent TEXT,
    ip_address TEXT,
    captured_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 3. Create search_history table
CREATE TABLE IF NOT EXISTS public.search_history (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    search_type TEXT NOT NULL,
    search_query TEXT NOT NULL,
    ip_address TEXT,
    searched_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- =====================================================
-- Enable Row Level Security on all tables
-- =====================================================

ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.captured_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.search_history ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- RLS Policies for app_settings
-- =====================================================

CREATE POLICY "Anyone can read settings" 
ON public.app_settings 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can insert settings" 
ON public.app_settings 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update settings" 
ON public.app_settings 
FOR UPDATE 
USING (true);

-- =====================================================
-- RLS Policies for captured_photos
-- =====================================================

CREATE POLICY "Anyone can view captured photos" 
ON public.captured_photos 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can insert captured photos" 
ON public.captured_photos 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can delete captured photos" 
ON public.captured_photos 
FOR DELETE 
USING (true);

-- =====================================================
-- RLS Policies for search_history
-- =====================================================

CREATE POLICY "Anyone can view search history" 
ON public.search_history 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can insert search history" 
ON public.search_history 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can delete search history" 
ON public.search_history 
FOR DELETE 
USING (true);

-- =====================================================
-- Create update_updated_at function for timestamps
-- =====================================================

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- =====================================================
-- Create trigger for app_settings updated_at
-- =====================================================

CREATE TRIGGER update_app_settings_updated_at
    BEFORE UPDATE ON public.app_settings
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- Create indexes for better performance
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_app_settings_key ON public.app_settings(setting_key);
CREATE INDEX IF NOT EXISTS idx_captured_photos_session ON public.captured_photos(session_id);
CREATE INDEX IF NOT EXISTS idx_search_history_type ON public.search_history(search_type);
CREATE INDEX IF NOT EXISTS idx_search_history_searched_at ON public.search_history(searched_at DESC);

-- =====================================================
-- Setup Complete! 
-- =====================================================
