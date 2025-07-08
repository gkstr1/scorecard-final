
-- Add new fields to clients table for enhanced profile information
ALTER TABLE public.clients 
ADD COLUMN industry TEXT,
ADD COLUMN company_size TEXT,
ADD COLUMN website TEXT,
ADD COLUMN description TEXT,
ADD COLUMN location TEXT;

-- Create client_notes table for notes system
CREATE TABLE public.client_notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  note_text TEXT NOT NULL,
  created_by TEXT, -- For future user attribution
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for client_notes table
ALTER TABLE public.client_notes ENABLE ROW LEVEL SECURITY;

-- Create policies for client_notes table
CREATE POLICY "Enable read access for all users" ON public.client_notes FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON public.client_notes FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON public.client_notes FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON public.client_notes FOR DELETE USING (true);

-- Add trigger to update updated_at timestamp for client_notes
CREATE TRIGGER update_client_notes_updated_at 
  BEFORE UPDATE ON public.client_notes 
  FOR EACH ROW 
  EXECUTE FUNCTION public.update_updated_at_column();
