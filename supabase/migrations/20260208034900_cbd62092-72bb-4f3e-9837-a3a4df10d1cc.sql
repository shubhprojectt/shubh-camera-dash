
-- Create table for hit engine APIs
CREATE TABLE public.hit_apis (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  method TEXT NOT NULL DEFAULT 'GET',
  headers JSONB NOT NULL DEFAULT '{}'::jsonb,
  body JSONB NOT NULL DEFAULT '{}'::jsonb,
  body_type TEXT NOT NULL DEFAULT 'json',
  query_params JSONB NOT NULL DEFAULT '{}'::jsonb,
  enabled BOOLEAN NOT NULL DEFAULT true,
  proxy_enabled BOOLEAN NOT NULL DEFAULT false,
  force_proxy BOOLEAN NOT NULL DEFAULT false,
  rotation_enabled BOOLEAN NOT NULL DEFAULT false,
  residential_proxy_enabled BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.hit_apis ENABLE ROW LEVEL SECURITY;

-- Public access policies (this is an admin-password-protected feature, not auth-based)
CREATE POLICY "Anyone can read hit apis" ON public.hit_apis FOR SELECT USING (true);
CREATE POLICY "Anyone can insert hit apis" ON public.hit_apis FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update hit apis" ON public.hit_apis FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete hit apis" ON public.hit_apis FOR DELETE USING (true);

-- Auto-update updated_at
CREATE TRIGGER update_hit_apis_updated_at
  BEFORE UPDATE ON public.hit_apis
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
