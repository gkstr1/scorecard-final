
-- Update RLS policies for job_descriptions table to allow proper access
DROP POLICY IF EXISTS "Enable insert for all users" ON public.job_descriptions;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.job_descriptions;
DROP POLICY IF EXISTS "Enable update for all users" ON public.job_descriptions;

-- Create more permissive policies for job_descriptions
CREATE POLICY "Allow all operations for anonymous users" ON public.job_descriptions
  FOR ALL USING (true) WITH CHECK (true);
