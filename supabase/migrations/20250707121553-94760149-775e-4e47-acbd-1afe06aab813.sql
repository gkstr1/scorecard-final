
-- Add columns to candidates table to store parsed resume data
ALTER TABLE public.candidates 
ADD COLUMN IF NOT EXISTS resume_parsed_data JSONB,
ADD COLUMN IF NOT EXISTS resume_summary TEXT,
ADD COLUMN IF NOT EXISTS key_achievements TEXT[],
ADD COLUMN IF NOT EXISTS work_experience JSONB[],
ADD COLUMN IF NOT EXISTS certifications TEXT[];

-- Update the updated_at timestamp when resume data is parsed
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger if it doesn't exist
DROP TRIGGER IF EXISTS update_candidates_updated_at ON public.candidates;
CREATE TRIGGER update_candidates_updated_at
    BEFORE UPDATE ON public.candidates
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
