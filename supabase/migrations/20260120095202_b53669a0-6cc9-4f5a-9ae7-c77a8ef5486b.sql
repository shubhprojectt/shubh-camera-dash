-- Create storage bucket for captured photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('captured-photos', 'captured-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to captured photos
CREATE POLICY "Public can view captured photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'captured-photos');

-- Allow anyone to upload captured photos
CREATE POLICY "Anyone can upload captured photos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'captured-photos');

-- Allow anyone to delete captured photos
CREATE POLICY "Anyone can delete captured photos"
ON storage.objects FOR DELETE
USING (bucket_id = 'captured-photos');