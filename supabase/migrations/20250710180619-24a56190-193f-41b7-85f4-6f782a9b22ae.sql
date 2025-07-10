-- Create interviews table to track scheduled interviews
CREATE TABLE public.interviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  candidate_id UUID NOT NULL,
  scheduled_date TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  meeting_link TEXT,
  meeting_type TEXT DEFAULT 'video_call',
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
  interviewer_name TEXT,
  interviewer_email TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create interview_questions table for AI-generated questions
CREATE TABLE public.interview_questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  interview_id UUID NOT NULL,
  question_text TEXT NOT NULL,
  question_type TEXT DEFAULT 'technical' CHECK (question_type IN ('technical', 'behavioral', 'cultural', 'experience')),
  difficulty_level TEXT DEFAULT 'medium' CHECK (difficulty_level IN ('easy', 'medium', 'hard')),
  expected_answer TEXT,
  candidate_answer TEXT,
  interviewer_notes TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  order_index INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create interview_notes table for real-time note-taking
CREATE TABLE public.interview_notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  interview_id UUID NOT NULL,
  note_text TEXT NOT NULL,
  note_type TEXT DEFAULT 'general' CHECK (note_type IN ('general', 'technical', 'behavioral', 'concern', 'highlight')),
  timestamp_in_interview INTEGER, -- Minutes into the interview
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create interview_scorecards table for structured assessment
CREATE TABLE public.interview_scorecards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  interview_id UUID NOT NULL,
  technical_skills_score INTEGER CHECK (technical_skills_score >= 1 AND technical_skills_score <= 10),
  problem_solving_score INTEGER CHECK (problem_solving_score >= 1 AND problem_solving_score <= 10),
  communication_score INTEGER CHECK (communication_score >= 1 AND communication_score <= 10),
  cultural_fit_score INTEGER CHECK (cultural_fit_score >= 1 AND cultural_fit_score <= 10),
  leadership_score INTEGER CHECK (leadership_score >= 1 AND leadership_score <= 10),
  overall_recommendation TEXT CHECK (overall_recommendation IN ('strong_hire', 'hire', 'no_hire', 'strong_no_hire')),
  strengths TEXT[],
  areas_for_improvement TEXT[],
  final_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add foreign key constraints
ALTER TABLE public.interviews 
ADD CONSTRAINT fk_interviews_candidate 
FOREIGN KEY (candidate_id) REFERENCES public.candidates(id) ON DELETE CASCADE;

ALTER TABLE public.interview_questions 
ADD CONSTRAINT fk_questions_interview 
FOREIGN KEY (interview_id) REFERENCES public.interviews(id) ON DELETE CASCADE;

ALTER TABLE public.interview_notes 
ADD CONSTRAINT fk_notes_interview 
FOREIGN KEY (interview_id) REFERENCES public.interviews(id) ON DELETE CASCADE;

ALTER TABLE public.interview_scorecards 
ADD CONSTRAINT fk_scorecards_interview 
FOREIGN KEY (interview_id) REFERENCES public.interviews(id) ON DELETE CASCADE;

-- Enable Row Level Security
ALTER TABLE public.interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interview_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interview_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interview_scorecards ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for interviews
CREATE POLICY "Enable all operations for interviews" 
ON public.interviews FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Enable all operations for interview_questions" 
ON public.interview_questions FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Enable all operations for interview_notes" 
ON public.interview_notes FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Enable all operations for interview_scorecards" 
ON public.interview_scorecards FOR ALL USING (true) WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX idx_interviews_candidate_id ON public.interviews(candidate_id);
CREATE INDEX idx_interviews_scheduled_date ON public.interviews(scheduled_date);
CREATE INDEX idx_interviews_status ON public.interviews(status);
CREATE INDEX idx_interview_questions_interview_id ON public.interview_questions(interview_id);
CREATE INDEX idx_interview_notes_interview_id ON public.interview_notes(interview_id);
CREATE INDEX idx_interview_scorecards_interview_id ON public.interview_scorecards(interview_id);

-- Create trigger for updated_at timestamps
CREATE TRIGGER update_interviews_updated_at
  BEFORE UPDATE ON public.interviews
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_interview_notes_updated_at
  BEFORE UPDATE ON public.interview_notes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_interview_scorecards_updated_at
  BEFORE UPDATE ON public.interview_scorecards
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add transcription fields to technical_assessments table
ALTER TABLE public.technical_assessments 
ADD COLUMN transcription_text TEXT,
ADD COLUMN transcription_url TEXT,
ADD COLUMN interview_duration_minutes INTEGER,
ADD COLUMN interview_recording_url TEXT;