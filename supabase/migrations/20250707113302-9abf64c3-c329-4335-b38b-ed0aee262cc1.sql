
-- Drop the existing restrictive RLS policies
DROP POLICY IF EXISTS "Enable insert for all users" ON public.candidates;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.candidates;
DROP POLICY IF EXISTS "Enable update for all users" ON public.candidates;

-- Create new permissive policies that don't require authentication
CREATE POLICY "Allow all operations for anonymous users" 
  ON public.candidates 
  FOR ALL 
  USING (true) 
  WITH CHECK (true);

-- Ensure RLS is still enabled but with permissive policies
ALTER TABLE public.candidates ENABLE ROW LEVEL SECURITY;
