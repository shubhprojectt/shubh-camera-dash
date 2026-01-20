-- Create storage bucket for background images
INSERT INTO storage.buckets (id, name, public)
VALUES ('backgrounds', 'backgrounds', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to backgrounds
CREATE POLICY "Public can view backgrounds"
ON storage.objects FOR SELECT
USING (bucket_id = 'backgrounds');

-- Allow authenticated users to upload backgrounds (or use anon for simple case)
CREATE POLICY "Anyone can upload backgrounds"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'backgrounds');

-- Allow anyone to update their uploads
CREATE POLICY "Anyone can update backgrounds"
ON storage.objects FOR UPDATE
USING (bucket_id = 'backgrounds');

-- Allow anyone to delete backgrounds
CREATE POLICY "Anyone can delete backgrounds"
ON storage.objects FOR DELETE
USING (bucket_id = 'backgrounds');