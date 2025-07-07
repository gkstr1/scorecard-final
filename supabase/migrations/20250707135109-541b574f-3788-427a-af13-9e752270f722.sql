
-- Create a clients table to store client information
CREATE TABLE public.clients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  contact_person TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for clients table
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

-- Create policies for clients table
CREATE POLICY "Enable read access for all users" ON public.clients FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON public.clients FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON public.clients FOR UPDATE USING (true);

-- Add client_id reference to job_descriptions table
ALTER TABLE public.job_descriptions 
ADD COLUMN client_id UUID REFERENCES public.clients(id);

-- Add trigger to update updated_at timestamp for clients
CREATE TRIGGER update_clients_updated_at 
  BEFORE UPDATE ON public.clients 
  FOR EACH ROW 
  EXECUTE FUNCTION public.update_updated_at_column();
