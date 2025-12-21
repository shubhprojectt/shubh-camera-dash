-- Add is_unlimited column to access_passwords table
ALTER TABLE public.access_passwords 
ADD COLUMN is_unlimited BOOLEAN NOT NULL DEFAULT false;