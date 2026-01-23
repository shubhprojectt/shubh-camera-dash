-- Add delete policy for ig_panel_submissions (for edge function with service role)
CREATE POLICY "Allow delete through service role"
ON public.ig_panel_submissions
FOR DELETE
USING (true);