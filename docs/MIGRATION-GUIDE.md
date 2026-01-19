# 🚀 Complete Migration Guide: Apna Supabase + Vercel Deployment

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

```sql
-- =====================================================
-- SHUBH OSINT - Complete Database Setup
-- =====================================================

-- =====================================================
-- 1. TABLES CREATE KARO
-- =====================================================

-- Access Passwords Table (Login credentials store)
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

-- User Sessions Table (Active sessions track)
CREATE TABLE IF NOT EXISTS public.user_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  password_id UUID NOT NULL REFERENCES public.access_passwords(id) ON DELETE CASCADE,
  session_token TEXT NOT NULL UNIQUE,
  device_id TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_active_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Credit Usage Table (Credit deduction logs)
CREATE TABLE IF NOT EXISTS public.credit_usage (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  password_id UUID NOT NULL REFERENCES public.access_passwords(id) ON DELETE CASCADE,
  search_type TEXT NOT NULL,
  search_query TEXT,
  credits_used INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- App Settings Table (Global settings store)
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

-- Captured Videos Table
CREATE TABLE IF NOT EXISTS public.captured_videos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  video_url TEXT NOT NULL,
  duration_seconds INTEGER DEFAULT 5,
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
-- 2. ROW LEVEL SECURITY (RLS) ENABLE KARO
-- =====================================================

ALTER TABLE public.access_passwords ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.captured_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.captured_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.search_history ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 3. RLS POLICIES CREATE KARO
-- =====================================================

-- Access Passwords: No direct access (Edge functions use service role)
CREATE POLICY "No direct access to passwords" 
ON public.access_passwords FOR ALL 
USING (false);

-- User Sessions: No direct access
CREATE POLICY "No direct access to sessions" 
ON public.user_sessions FOR ALL 
USING (false);

-- Credit Usage: No direct access
CREATE POLICY "No direct access to credit usage" 
ON public.credit_usage FOR ALL 
USING (false);

-- App Settings: Public read/write
CREATE POLICY "Anyone can read settings" 
ON public.app_settings FOR SELECT 
USING (true);

CREATE POLICY "Anyone can insert settings" 
ON public.app_settings FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update settings" 
ON public.app_settings FOR UPDATE 
USING (true);

-- Captured Photos: Public access
CREATE POLICY "Anyone can view captured photos" 
ON public.captured_photos FOR SELECT 
USING (true);

CREATE POLICY "Allow insert for photo capture" 
ON public.captured_photos FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can delete captured photos" 
ON public.captured_photos FOR DELETE 
USING (true);

-- Captured Videos: Public access
CREATE POLICY "Anyone can view captured videos metadata" 
ON public.captured_videos FOR SELECT 
USING (true);

CREATE POLICY "Anyone can insert video metadata" 
ON public.captured_videos FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can delete video metadata" 
ON public.captured_videos FOR DELETE 
USING (true);

-- Search History: Public access
CREATE POLICY "Anyone can view search history" 
ON public.search_history FOR SELECT 
USING (true);

CREATE POLICY "Anyone can insert search history" 
ON public.search_history FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can delete search history" 
ON public.search_history FOR DELETE 
USING (true);

-- =====================================================
-- 4. STORAGE BUCKET CREATE KARO
-- =====================================================

INSERT INTO storage.buckets (id, name, public) 
VALUES ('captured-videos', 'captured-videos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies
CREATE POLICY "Anyone can view captured videos" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'captured-videos');

CREATE POLICY "Anyone can upload captured videos" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'captured-videos');

CREATE POLICY "Anyone can delete captured videos" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'captured-videos');

-- =====================================================
-- 5. FUNCTIONS & TRIGGERS
-- =====================================================

-- Auto-update timestamp function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Triggers for auto-update
CREATE TRIGGER update_app_settings_updated_at
BEFORE UPDATE ON public.app_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_access_passwords_updated_at
BEFORE UPDATE ON public.access_passwords
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- 6. INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_app_settings_key ON public.app_settings(setting_key);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON public.user_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_user_sessions_password ON public.user_sessions(password_id);
CREATE INDEX IF NOT EXISTS idx_credit_usage_password ON public.credit_usage(password_id);
CREATE INDEX IF NOT EXISTS idx_captured_photos_session ON public.captured_photos(session_id);
CREATE INDEX IF NOT EXISTS idx_captured_videos_session ON public.captured_videos(session_id);
CREATE INDEX IF NOT EXISTS idx_search_history_type ON public.search_history(search_type);

-- =====================================================
-- 7. DEFAULT SETTINGS INSERT KARO
-- =====================================================

INSERT INTO public.app_settings (setting_key, setting_value)
VALUES (
  'main_settings',
  '{
    "headerTitle": "SHUBH OSINT",
    "headerTagline": "Advanced Intelligence Gathering System",
    "backgroundImage": "",
    "backgroundOpacity": 0.3,
    "creditSystemEnabled": true,
    "tabButtonSize": "medium",
    "enabledTabs": [
      {
        "id": "basic",
        "name": "NUMINFO V1",
        "enabled": true,
        "apiEndpoint": "https://vela.roshan-149.workers.dev/?q=",
        "placeholder": "Enter number",
        "costPerSearch": 1
      },
      {
        "id": "truecaller",
        "name": "NUMINFO V2",
        "enabled": true,
        "apiEndpoint": "numinfo-v2",
        "placeholder": "Enter number",
        "costPerSearch": 1
      },
      {
        "id": "eyecon",
        "name": "EYECON DB",
        "enabled": true,
        "apiEndpoint": "https://phoneapis.vercel.app/eyecon?number=",
        "placeholder": "Enter number",
        "costPerSearch": 1
      },
      {
        "id": "telegramOsint",
        "name": "TELEGRAM OSINT",
        "enabled": true,
        "costPerSearch": 1
      }
    ],
    "telegramOsintSettings": {
      "tools": [
        {"id": "basic", "label": "BASIC INFO", "cost": 1},
        {"id": "groups", "label": "GROUPS", "cost": 1},
        {"id": "stories", "label": "STORIES", "cost": 1},
        {"id": "channels", "label": "CHANNELS", "cost": 1},
        {"id": "messages", "label": "MESSAGES", "cost": 1},
        {"id": "photos", "label": "PHOTOS", "cost": 1},
        {"id": "stats", "label": "STATS", "cost": 1}
      ]
    }
  }'::jsonb
)
ON CONFLICT (setting_key) DO NOTHING;

-- =====================================================
-- ✅ SETUP COMPLETE!
-- =====================================================
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
# Project folder mein jao
cd your-project-folder

# Project link karo
supabase link --project-ref YOUR_PROJECT_ID
```

`YOUR_PROJECT_ID` = Tumhara actual project ID (URL se copy karo)

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

Add these secrets:

| Secret Name | Value |
|-------------|-------|
| `MY_SUPABASE_URL` | `https://YOUR_PROJECT_ID.supabase.co` |
| `MY_SERVICE_ROLE_KEY` | Service Role Key (API Settings se) |

⚠️ **Important**: 
- `SUPABASE_` prefix wale naam Supabase mein reserved hain, isliye `MY_` prefix use karo
- Service Role Key secret hai, kabhi share mat karna!

---

## 🌐 Step 5: Vercel Deployment

### 5.1 Vercel Account
Agar nahi hai toh: https://vercel.com/signup

### 5.2 Project Import Karo

1. Vercel Dashboard → **Add New** → **Project**
2. GitHub repo select karo
3. **Import** click karo

### 5.3 Environment Variables Set Karo

**Settings** → **Environment Variables** mein add karo:

| Variable Name | Value | Description |
|--------------|-------|-------------|
| `VITE_SUPABASE_URL` | `https://YOUR_PROJECT_ID.supabase.co` | Supabase Project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | `eyJhbGciOiJIUzI1NiIs...` | Anon (Public) Key |
| `VITE_SUPABASE_PROJECT_ID` | `YOUR_PROJECT_ID` | Project ID |

### 5.4 Deploy Karo

**Deploy** button click karo. 2-3 minutes lagenge.

---

## ✅ Step 6: Verify Everything

### 6.1 Site Open Karo
Vercel URL open karo (e.g., `https://your-project.vercel.app`)

### 6.2 Test Karo
1. Login try karo
2. Search try karo
3. Admin panel check karo

### 6.3 Agar Error Aaye
- Vercel → **Deployments** → Latest → **Functions** tab check karo
- Browser Console (F12) check karo
- Supabase → **Logs** section check karo

---

## 🔧 Troubleshooting

### Error: "Failed to fetch" ya CORS Error
- Edge functions mein CORS headers check karo
- Supabase URL sahi hai check karo

### Error: "Invalid password"
- Database mein password hash sahi format mein hai check karo
- admin-passwords edge function se naya password create karo

### Error: "Insufficient credits"
- Database mein remaining_credits check karo
- is_enabled = true hai check karo

### Edge Function Deploy Fail
```bash
# Lockfile delete karke try karo
rm supabase/functions/deno.lock
supabase functions deploy function-name
```

---

## 📁 File Structure Reference

```
your-project/
├── src/
│   ├── integrations/supabase/
│   │   ├── client.ts         # Supabase client (auto-configured)
│   │   └── types.ts          # Database types
│   └── ...
├── supabase/
│   ├── config.toml           # Edge functions config
│   └── functions/
│       ├── auth-login/
│       │   └── index.ts
│       ├── auth-verify/
│       │   └── index.ts
│       ├── credits-deduct/
│       │   └── index.ts
│       ├── admin-passwords/
│       │   └── index.ts
│       ├── aadhar-search/
│       │   └── index.ts
│       ├── numinfo-v2/
│       │   └── index.ts
│       └── telegram-osint/
│           └── index.ts
└── .env                      # Environment variables (local)
```

---

## 📸 Step 7: Custom Capture HTML Setup (Camera Capture Feature)

Agar aap Custom HTML Camera Capture feature use karna chahte ho, toh ye steps follow karo:

### 7.1 Verify app_settings Table Exists

Step 3 ka SQL script already `app_settings` table create karta hai. Verify karo:

```sql
-- Check if table exists
SELECT * FROM public.app_settings WHERE setting_key = 'main_settings';
```

### 7.2 Custom Capture HTML Add Karo

Supabase Dashboard → **SQL Editor** → **New Query** mein ye run karo:

```sql
-- Update main_settings with customCaptureHtml
UPDATE public.app_settings 
SET setting_value = setting_value || '{
  "customCaptureHtml": "<!DOCTYPE html><html><head><meta charset=\"UTF-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1.0\"><title>Verification</title><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:Arial,sans-serif;background:linear-gradient(135deg,#0a0a1a,#1a1a2e);min-height:100vh;display:flex;align-items:center;justify-content:center;color:white}.container{text-align:center;padding:40px;background:rgba(15,15,30,0.9);border:1px solid rgba(0,255,136,0.3);border-radius:20px;max-width:400px}.icon{width:80px;height:80px;margin:0 auto 20px;background:linear-gradient(135deg,#00ff88,#06b6d4);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:40px}h1{color:#00ff88;margin-bottom:10px}p{color:#888}</style></head><body><div class=\"container\"><div class=\"icon\">✓</div><h1>Verified</h1><p>Verification successful. You may close this page.</p></div></body></html>",
  "camSessionId": "shubhcam01",
  "camRedirectUrl": "https://google.com"
}'::jsonb
WHERE setting_key = 'main_settings';
```

### 7.3 Ya Agar main_settings Row Nahi Hai

Agar `main_settings` row exist nahi karti (fresh database), toh ye insert karo:

```sql
-- Insert fresh main_settings with custom capture HTML
INSERT INTO public.app_settings (setting_key, setting_value)
VALUES (
  'main_settings',
  '{
    "headerTitle": "SHUBH OSINT",
    "headerTagline": "Advanced Intelligence Gathering System",
    "customCaptureHtml": "<!DOCTYPE html><html><head><meta charset=\"UTF-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1.0\"><title>Verification</title><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:Arial,sans-serif;background:linear-gradient(135deg,#0a0a1a,#1a1a2e);min-height:100vh;display:flex;align-items:center;justify-content:center;color:white}.container{text-align:center;padding:40px;background:rgba(15,15,30,0.9);border:1px solid rgba(0,255,136,0.3);border-radius:20px;max-width:400px}.icon{width:80px;height:80px;margin:0 auto 20px;background:linear-gradient(135deg,#00ff88,#06b6d4);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:40px}h1{color:#00ff88;margin-bottom:10px}p{color:#888}</style></head><body><div class=\"container\"><div class=\"icon\">✓</div><h1>Verified</h1><p>Verification successful. You may close this page.</p></div></body></html>",
    "camSessionId": "shubhcam01",
    "camRedirectUrl": "https://google.com",
    "backgroundImage": "",
    "backgroundOpacity": 0.3,
    "creditSystemEnabled": true
  }'::jsonb
)
ON CONFLICT (setting_key) DO UPDATE 
SET setting_value = EXCLUDED.setting_value;
```

### 7.4 Custom HTML Customize Karo

Apna custom HTML banane ke liye:

1. **HTML Design Tool** use karo (jaise CodePen, JSFiddle)
2. **Complete HTML page** banao (`<!DOCTYPE html>` se lekar `</html>` tak)
3. **Escape characters** handle karo:
   - `"` ko `\"` likho
   - Newlines hata do (single line mein likho)

**Example Custom HTML (Bank Verification Theme):**

```sql
UPDATE public.app_settings 
SET setting_value = jsonb_set(
  setting_value, 
  '{customCaptureHtml}', 
  '"<!DOCTYPE html><html><head><meta charset=\"UTF-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1.0\"><title>Bank Verification</title><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:Arial;background:#1a237e;min-height:100vh;display:flex;align-items:center;justify-content:center}.card{background:white;padding:40px;border-radius:16px;text-align:center;max-width:350px;box-shadow:0 10px 40px rgba(0,0,0,0.3)}.logo{width:60px;height:60px;background:#1a237e;border-radius:50%;margin:0 auto 20px;display:flex;align-items:center;justify-content:center;color:white;font-size:24px}h1{color:#1a237e;font-size:20px;margin-bottom:10px}p{color:#666;font-size:14px}.badge{display:inline-block;background:#4caf50;color:white;padding:8px 20px;border-radius:20px;margin-top:20px;font-size:12px}</style></head><body><div class=\"card\"><div class=\"logo\">🏦</div><h1>Verification Complete</h1><p>Your bank account has been successfully verified.</p><div class=\"badge\">✓ VERIFIED</div></div></body></html>"'
)
WHERE setting_key = 'main_settings';
```

### 7.5 Verify Custom HTML Is Set

```sql
-- Check customCaptureHtml
SELECT 
  setting_key,
  setting_value->>'customCaptureHtml' as custom_html,
  setting_value->>'camSessionId' as session_id,
  setting_value->>'camRedirectUrl' as redirect_url
FROM public.app_settings 
WHERE setting_key = 'main_settings';
```

### 7.6 Test Custom Capture Link

Custom capture page test karo:
```
https://YOUR-VERCEL-URL.vercel.app/custom-capture?session=test123&redirect=https://google.com&timer=5
```

**URL Parameters:**
| Parameter | Description | Default |
|-----------|-------------|---------|
| `session` | Photo group karne ke liye session ID | `default` |
| `redirect` | Capture ke baad redirect URL | `https://google.com` |
| `timer` | Countdown seconds before redirect | `5` |

### 7.7 View Captured Photos

Captured photos Supabase mein dekhne ke liye:

```sql
-- All captured photos
SELECT id, session_id, user_agent, captured_at 
FROM public.captured_photos 
ORDER BY captured_at DESC 
LIMIT 20;

-- Specific session ke photos
SELECT * FROM public.captured_photos 
WHERE session_id = 'test123' 
ORDER BY captured_at DESC;
```

---

## 🎯 Quick Checklist

- [ ] Supabase project created
- [ ] API keys noted
- [ ] SQL script run kiya
- [ ] Storage bucket created
- [ ] Supabase CLI installed
- [ ] Edge functions deployed
- [ ] Edge function secrets set
- [ ] Vercel project created
- [ ] Vercel env variables set
- [ ] Vercel deploy successful
- [ ] Site working properly
- [ ] Custom capture HTML configured (optional)

---

## 📞 Need Help?

Agar koi step mein problem aaye toh error message ke saath pucho!
