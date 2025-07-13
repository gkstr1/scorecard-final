import React, { useState } from 'react';
import { Search, Bot, Command } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AICommandBarProps {
  className?: string;
}

export const AICommandBar: React.FC<AICommandBarProps> = ({ className }) => {
  const [isActive, setIsActive] = useState(false);
  const [input, setInput] = useState('');

  const handleFocus = () => setIsActive(true);
  const handleBlur = () => {
    // Delay blur to allow clicking on suggestions
    setTimeout(() => setIsActive(false), 150);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      // TODO: Process AI command
      console.log('AI Command:', input);
      setInput('');
      setIsActive(false);
    }
  };

  return (
    <div className={cn("relative", className)}>
      <form onSubmit={handleSubmit} className="relative">
        <div className={cn(
          "flex items-center gap-2 px-3 py-2 bg-muted/50 border border-border rounded-lg transition-all duration-200",
          isActive && "bg-background border-primary/50 shadow-md"
        )}>
          <Bot className="h-4 w-4 text-primary" />
          <input
            type="text"
            placeholder="Ask AI to help... (e.g., 'move John to interview stage')"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className="flex-1 bg-transparent border-none outline-none text-sm placeholder:text-muted-foreground"
          />
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Command className="h-3 w-3" />
            <span>K</span>
          </div>
        </div>
      </form>

      {/* Suggestions/Results Dropdown */}
      {isActive && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-lg shadow-lg z-50">
          <div className="p-3">
            {input.trim() ? (
              <div className="space-y-2">
                <div className="text-xs text-muted-foreground mb-2">AI Suggestions:</div>
                <div className="space-y-1">
                  <div className="p-2 hover:bg-muted rounded-md cursor-pointer text-sm">
                    Process: "{input}"
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="text-xs text-muted-foreground mb-2">Quick Actions:</div>
                <div className="space-y-1 text-sm">
                  <div className="p-2 hover:bg-muted rounded-md cursor-pointer">Show all pending interviews</div>
                  <div className="p-2 hover:bg-muted rounded-md cursor-pointer">Create new job posting</div>
                  <div className="p-2 hover:bg-muted rounded-md cursor-pointer">Move candidate to next stage</div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};