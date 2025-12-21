-- Create access_passwords table for storing generated passwords with credits
CREATE TABLE public.access_passwords (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  password_hash TEXT NOT NULL,
  password_display TEXT NOT NULL, -- For admin to see the original password
  total_credits INTEGER NOT NULL DEFAULT 0,
  remaining_credits INTEGER NOT NULL DEFAULT 0,
  is_enabled BOOLEAN NOT NULL DEFAULT true,
  is_used BOOLEAN NOT NULL DEFAULT false,
  device_id TEXT, -- Binds to first device that uses it
  used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create sessions table for active user sessions
CREATE TABLE public.user_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  password_id UUID NOT NULL REFERENCES public.access_passwords(id) ON DELETE CASCADE,
  device_id TEXT NOT NULL,
  session_token TEXT NOT NULL UNIQUE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_active_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create credit_usage table to track all credit deductions
CREATE TABLE public.credit_usage (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  password_id UUID NOT NULL REFERENCES public.access_passwords(id) ON DELETE CASCADE,
  search_type TEXT NOT NULL,
  credits_used INTEGER NOT NULL,
  search_query TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.access_passwords ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_usage ENABLE ROW LEVEL SECURITY;

-- RLS policies - Only allow access via edge functions (service role)
-- No direct client access to these tables for security
CREATE POLICY "No direct access to passwords" ON public.access_passwords FOR ALL USING (false);
CREATE POLICY "No direct access to sessions" ON public.user_sessions FOR ALL USING (false);
CREATE POLICY "No direct access to credit usage" ON public.credit_usage FOR ALL USING (false);

-- Create indexes for performance
CREATE INDEX idx_access_passwords_hash ON public.access_passwords(password_hash);
CREATE INDEX idx_user_sessions_token ON public.user_sessions(session_token);
CREATE INDEX idx_user_sessions_password_id ON public.user_sessions(password_id);
CREATE INDEX idx_credit_usage_password_id ON public.credit_usage(password_id);

-- Add trigger for updated_at
CREATE TRIGGER update_access_passwords_updated_at
  BEFORE UPDATE ON public.access_passwords
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();