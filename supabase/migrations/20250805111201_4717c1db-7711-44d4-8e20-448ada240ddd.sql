-- Fix security warning: Update function with proper search_path
CREATE OR REPLACE FUNCTION public.handle_new_user_credits()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO public.user_credits (user_id, credits_balance)
  VALUES (NEW.id, 10); -- Give 10 free credits to new users
  RETURN NEW;
END;
$$;