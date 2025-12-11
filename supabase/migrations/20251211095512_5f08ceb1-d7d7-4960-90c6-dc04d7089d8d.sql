-- Create table for storing captured photos
CREATE TABLE public.captured_photos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  image_data TEXT NOT NULL,
  user_agent TEXT,
  ip_address TEXT,
  captured_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for faster session lookups
CREATE INDEX idx_captured_photos_session_id ON public.captured_photos(session_id);

-- Enable RLS
ALTER TABLE public.captured_photos ENABLE ROW LEVEL SECURITY;

-- Allow public insert (for capture links)
CREATE POLICY "Anyone can insert captured photos"
ON public.captured_photos
FOR INSERT
WITH CHECK (true);

-- Allow public select by session_id (for viewing photos)
CREATE POLICY "Anyone can view captured photos"
ON public.captured_photos
FOR SELECT
USING (true);

-- Allow public delete (for clearing photos)
CREATE POLICY "Anyone can delete captured photos"
ON public.captured_photos
FOR DELETE
USING (true);