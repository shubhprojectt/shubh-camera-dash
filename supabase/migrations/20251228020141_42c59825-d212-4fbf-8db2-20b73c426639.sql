-- Create storage bucket for captured videos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('captured-videos', 'captured-videos', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public access to view videos
CREATE POLICY "Anyone can view captured videos"
ON storage.objects FOR SELECT
USING (bucket_id = 'captured-videos');

-- Allow anyone to upload videos (for capture pages)
CREATE POLICY "Anyone can upload videos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'captured-videos');

-- Allow anyone to delete videos (for admin cleanup)
CREATE POLICY "Anyone can delete videos"
ON storage.objects FOR DELETE
USING (bucket_id = 'captured-videos');

-- Create table to track video metadata
CREATE TABLE IF NOT EXISTS public.captured_videos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  video_url TEXT NOT NULL,
  duration_seconds INTEGER DEFAULT 5,
  captured_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  user_agent TEXT,
  ip_address TEXT
);

-- Enable RLS
ALTER TABLE public.captured_videos ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Anyone can view captured videos metadata"
ON public.captured_videos FOR SELECT
USING (true);

CREATE POLICY "Anyone can insert video metadata"
ON public.captured_videos FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can delete video metadata"
ON public.captured_videos FOR DELETE
USING (true);