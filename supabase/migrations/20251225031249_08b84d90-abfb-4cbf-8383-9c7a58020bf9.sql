-- Fix PUBLIC_DATA_EXPOSURE: Restrict captured_photos to service_role only
-- This prevents direct client access while allowing Edge Functions to manage photos

-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Anyone can view captured photos" ON captured_photos;
DROP POLICY IF EXISTS "Anyone can insert captured photos" ON captured_photos;
DROP POLICY IF EXISTS "Anyone can delete captured photos" ON captured_photos;

-- Create restrictive policies that only allow service_role access
-- The Capture page uses the anon key, but we'll keep INSERT open since photos 
-- are captured from public links. However, SELECT and DELETE should be restricted.

-- Only service_role (Edge Functions/admin) can view photos
CREATE POLICY "Service role can view captured photos" 
ON captured_photos FOR SELECT 
USING (false);

-- Allow public inserts for camera capture (needed for public links)
-- Session ID provides minimal identification
CREATE POLICY "Allow insert for photo capture" 
ON captured_photos FOR INSERT 
WITH CHECK (true);

-- Only service_role can delete photos
CREATE POLICY "Service role can delete captured photos" 
ON captured_photos FOR DELETE 
USING (false);