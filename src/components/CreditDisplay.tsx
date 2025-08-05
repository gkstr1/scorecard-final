import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Coins, Plus, History, TrendingUp } from 'lucide-react';
import { UserCredits, CreditTransaction } from '@/hooks/useCredits';
import { formatDistanceToNow } from 'date-fns';

interface CreditDisplayProps {
  credits: UserCredits | null;
  transactions: CreditTransaction[];
  loading: boolean;
  onPurchaseCredits?: () => void;
}

export const CreditDisplay: React.FC<CreditDisplayProps> = ({
  credits,
  transactions,
  loading,
  onPurchaseCredits
}) => {
  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Credit Balance Card */}
      <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Coins className="h-5 w-5 text-primary" />
            <span>Credit Balance</span>
          </CardTitle>
          <CardDescription>
            Use credits to reveal contact information for candidates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">
                {credits?.credits_balance || 0}
              </div>
              <div className="text-sm text-muted-foreground">Available Credits</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-semibold text-foreground">
                {credits?.total_credits_purchased || 0}
              </div>
              <div className="text-sm text-muted-foreground">Total Purchased</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-semibold text-foreground">
                {credits?.total_credits_used || 0}
              </div>
              <div className="text-sm text-muted-foreground">Total Used</div>
            </div>
          </div>
          
          <div className="mt-6 flex justify-center">
            <Button 
              onClick={onPurchaseCredits}
              className="bg-primary hover:bg-primary/90"
              disabled // Will enable when Stripe is added
            >
              <Plus className="h-4 w-4 mr-2" />
              Purchase Credits (Coming Soon)
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <History className="h-5 w-5 text-primary" />
            <span>Recent Activity</span>
          </CardTitle>
          <CardDescription>
            Your credit transaction history
          </CardDescription>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No transactions yet</p>
              <p className="text-sm">Start using credits to reveal contact information</p>
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.slice(0, 10).map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      transaction.transaction_type === 'usage' 
                        ? 'bg-red-100 text-red-600' 
                        : transaction.transaction_type === 'purchase'
                        ? 'bg-green-100 text-green-600'
                        : 'bg-blue-100 text-blue-600'
                    }`}>
                      {transaction.transaction_type === 'usage' ? '-' : '+'}
                    </div>
                    <div>
                      <p className="font-medium text-sm">
                        {transaction.description || 
                          `${transaction.transaction_type.charAt(0).toUpperCase() + transaction.transaction_type.slice(1)}`}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(transaction.created_at), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge 
                      variant={transaction.credits_amount > 0 ? "default" : "destructive"}
                      className="text-xs"
                    >
                      {transaction.credits_amount > 0 ? '+' : ''}{Math.abs(transaction.credits_amount)} credit{Math.abs(transaction.credits_amount) !== 1 ? 's' : ''}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};