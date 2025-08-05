import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { User } from '@supabase/supabase-js';

export interface UserCredits {
  id: string;
  user_id: string;
  credits_balance: number;
  total_credits_purchased: number;
  total_credits_used: number;
  created_at: string;
  updated_at: string;
}

export interface CreditTransaction {
  id: string;
  user_id: string;
  transaction_type: 'purchase' | 'usage' | 'refund';
  credits_amount: number;
  description: string | null;
  stripe_payment_intent_id: string | null;
  metadata: any;
  created_at: string;
}

export const useCredits = (user: User | null) => {
  const [credits, setCredits] = useState<UserCredits | null>(null);
  const [transactions, setTransactions] = useState<CreditTransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Fetch user credits
  const fetchCredits = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_credits')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
        console.error('Error fetching credits:', error);
        return;
      }

      if (data) {
        setCredits(data);
      } else {
        // Create initial credit record if it doesn't exist
        const { data: newCredits, error: insertError } = await supabase
          .from('user_credits')
          .insert([{ user_id: user.id, credits_balance: 10 }])
          .select()
          .single();

        if (insertError) {
          console.error('Error creating initial credits:', insertError);
        } else {
          setCredits(newCredits);
        }
      }
    } catch (error) {
      console.error('Error in fetchCredits:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch credit transactions
  const fetchTransactions = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('credit_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching transactions:', error);
        return;
      }

      setTransactions((data || []) as CreditTransaction[]);
    } catch (error) {
      console.error('Error in fetchTransactions:', error);
    }
  };

  // Use credits for contact reveal
  const useCreditsForReveal = async (contactInfo: any): Promise<boolean> => {
    if (!user || !credits) return false;

    if (credits.credits_balance < 1) {
      toast({
        title: "Insufficient Credits",
        description: "You need at least 1 credit to reveal contact information. Purchase more credits to continue.",
        variant: "destructive",
      });
      return false;
    }

    try {
      // Start a transaction to deduct credits and log the usage
      const { error: transactionError } = await supabase
        .from('credit_transactions')
        .insert([{
          user_id: user.id,
          transaction_type: 'usage',
          credits_amount: -1,
          description: 'Contact information revealed',
          metadata: {
            contact_name: contactInfo.name,
            contact_email: contactInfo.email,
            revealed_at: new Date().toISOString()
          }
        }]);

      if (transactionError) {
        console.error('Error logging transaction:', transactionError);
        return false;
      }

      // Update user credits
      const { error: updateError } = await supabase
        .from('user_credits')
        .update({
          credits_balance: credits.credits_balance - 1,
          total_credits_used: credits.total_credits_used + 1,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (updateError) {
        console.error('Error updating credits:', updateError);
        return false;
      }

      // Refresh credits
      await fetchCredits();
      await fetchTransactions();

      toast({
        title: "Contact Revealed",
        description: `Contact information revealed. 1 credit used. ${credits.credits_balance - 1} credits remaining.`,
      });

      return true;
    } catch (error) {
      console.error('Error using credits:', error);
      toast({
        title: "Error",
        description: "Failed to use credits. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    if (user) {
      fetchCredits();
      fetchTransactions();
    }
  }, [user]);

  return {
    credits,
    transactions,
    loading,
    fetchCredits,
    fetchTransactions,
    useCreditsForReveal,
    refetch: () => {
      fetchCredits();
      fetchTransactions();
    }
  };
};