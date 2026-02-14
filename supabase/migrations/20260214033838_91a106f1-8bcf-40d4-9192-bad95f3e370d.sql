
-- Table for scheduled API hit jobs
CREATE TABLE public.scheduled_hits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  phone_number TEXT NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  interval_seconds INTEGER NOT NULL DEFAULT 60,
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_executed_at TIMESTAMP WITH TIME ZONE,
  next_execution_at TIMESTAMP WITH TIME ZONE,
  total_hits INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.scheduled_hits ENABLE ROW LEVEL SECURITY;

-- Public access policies (matching existing app pattern - no auth)
CREATE POLICY "Anyone can read scheduled hits" ON public.scheduled_hits FOR SELECT USING (true);
CREATE POLICY "Anyone can insert scheduled hits" ON public.scheduled_hits FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update scheduled hits" ON public.scheduled_hits FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete scheduled hits" ON public.scheduled_hits FOR DELETE USING (true);

-- Trigger for updated_at
CREATE TRIGGER update_scheduled_hits_updated_at
  BEFORE UPDATE ON public.scheduled_hits
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for live status updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.scheduled_hits;
