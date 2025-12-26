-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Service role can view captured photos" ON captured_photos;
DROP POLICY IF EXISTS "Service role can delete captured photos" ON captured_photos;

-- Create new policies allowing public access
CREATE POLICY "Anyone can view captured photos" 
ON captured_photos 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can delete captured photos" 
ON captured_photos 
FOR DELETE 
USING (true);