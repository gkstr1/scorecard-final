import React, { useState } from 'react';
import { Bot, Send, Minimize2, Maximize2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface Message {
  id: number;
  type: 'ai' | 'user';
  content: string;
}

interface AIChatPanelProps {
  className?: string;
}

export const AIChatPanel: React.FC<AIChatPanelProps> = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: 'ai',
      content: "Hi! I'm your AI assistant. I can help you manage candidates, schedule interviews, and perform various tasks. Try asking me to 'move John to interview stage' or 'show pending interviews'."
    }
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      // Add user message
      const userMessage: Message = {
        id: messages.length + 1,
        type: 'user',
        content: input
      };
      
      // Add AI response (placeholder for now)
      const aiResponse: Message = {
        id: messages.length + 2,
        type: 'ai',
        content: `I understand you want to: "${input}". This feature is coming soon! For now, I can help you navigate the system.`
      };
      
      setMessages(prev => [...prev, userMessage, aiResponse]);
      setInput('');
    }
  };

  const quickActions = [
    "Show pending interviews",
    "Create new job posting", 
    "Move candidate to next stage",
    "Schedule interview"
  ];

  if (!isOpen) {
    return (
      <div className={cn("fixed bottom-4 right-4 z-50", className)}>
        <Button
          onClick={() => setIsOpen(true)}
          className="h-12 w-12 rounded-full bg-primary hover:bg-primary/90 shadow-lg"
          size="icon"
        >
          <Bot className="h-6 w-6" />
        </Button>
      </div>
    );
  }

  return (
    <div className={cn("fixed bottom-4 right-4 z-50", className)}>
      <Card className={cn(
        "w-80 bg-background border-2 border-primary shadow-xl",
        isMinimized ? "h-12" : "h-96"
      )}>
        <CardHeader className="flex flex-row items-center justify-between p-3 bg-primary/5 border-b border-primary/20">
          <div className="flex items-center space-x-2">
            <Bot className="h-5 w-5 text-primary" />
            <span className="font-medium text-sm">AI Assistant</span>
          </div>
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => setIsMinimized(!isMinimized)}
            >
              {isMinimized ? <Maximize2 className="h-3 w-3" /> : <Minimize2 className="h-3 w-3" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="p-0 flex flex-col h-80">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex",
                    message.type === 'user' ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[80%] p-2 rounded-lg text-sm",
                      message.type === 'user'
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground"
                    )}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            {messages.length === 1 && (
              <div className="px-3 pb-2">
                <div className="text-xs text-muted-foreground mb-2">Quick actions:</div>
                <div className="flex flex-wrap gap-1">
                  {quickActions.map((action, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="text-xs h-6 px-2"
                      onClick={() => setInput(action)}
                    >
                      {action}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="border-t border-border p-3">
              <form onSubmit={handleSubmit} className="flex space-x-2">
                <Input
                  placeholder="Ask me to help with tasks..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="text-sm h-8"
                />
                <Button type="submit" size="icon" className="h-8 w-8 shrink-0">
                  <Send className="h-3 w-3" />
                </Button>
              </form>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};