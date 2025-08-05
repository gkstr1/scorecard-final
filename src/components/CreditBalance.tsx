import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Coins } from 'lucide-react';

interface CreditBalanceProps {
  balance: number;
  size?: 'sm' | 'md' | 'lg';
  showButton?: boolean;
  onPurchaseClick?: () => void;
}

export const CreditBalance: React.FC<CreditBalanceProps> = ({
  balance,
  size = 'md',
  showButton = false,
  onPurchaseClick
}) => {
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-2'
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  return (
    <div className="flex items-center space-x-2">
      <Badge 
        variant={balance > 0 ? "default" : "destructive"} 
        className={`${sizeClasses[size]} bg-primary/10 text-primary border-primary/30 hover:bg-primary/20`}
      >
        <Coins className={`${iconSizes[size]} mr-1`} />
        {balance} credit{balance !== 1 ? 's' : ''}
      </Badge>
      
      {showButton && balance < 5 && (
        <Button
          size="sm"
          variant="outline"
          onClick={onPurchaseClick}
          className="text-xs"
          disabled // Will enable when Stripe is ready
        >
          Buy More
        </Button>
      )}
    </div>
  );
};