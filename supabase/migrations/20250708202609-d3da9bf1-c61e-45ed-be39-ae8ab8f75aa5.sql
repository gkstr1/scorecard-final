-- Add job_id column to candidates table to link candidates to specific jobs
ALTER TABLE candidates ADD COLUMN job_id UUID REFERENCES job_descriptions(id);

-- Create an index for better performance when filtering by job
CREATE INDEX idx_candidates_job_id ON candidates(job_id);