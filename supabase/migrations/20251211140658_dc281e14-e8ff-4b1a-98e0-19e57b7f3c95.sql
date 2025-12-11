-- Create search history table
CREATE TABLE public.search_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  search_type TEXT NOT NULL,
  search_query TEXT NOT NULL,
  searched_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ip_address TEXT
);

-- Enable RLS
ALTER TABLE public.search_history ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert and view search history
CREATE POLICY "Anyone can insert search history" 
ON public.search_history 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can view search history" 
ON public.search_history 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can delete search history" 
ON public.search_history 
FOR DELETE 
USING (true);