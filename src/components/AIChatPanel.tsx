import React, { useState } from 'react';
import { Bot, Send, X, MessageCircle } from 'lucide-react';
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

  return (
    <>
      {/* Floating Bubble Button */}
      <div className={cn("fixed bottom-6 right-6 z-40", className)}>
        <Button
          onClick={() => setIsOpen(!isOpen)}
          size="icon"
          className="h-16 w-16 rounded-full bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <MessageCircle className="h-7 w-7 text-primary-foreground" />
        </Button>
      </div>

      {/* Chat Window Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-end p-6">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/20" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Chat Window */}
          <Card className="relative w-96 h-[600px] bg-background border-2 border-primary shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
            <CardHeader className="p-4 bg-primary/5 border-b border-primary/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Bot className="h-5 w-5 text-primary" />
                  <span className="font-medium">AI Assistant</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-0 flex flex-col h-[calc(600px-80px)]">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
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
                        "max-w-[80%] p-3 rounded-lg text-sm",
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
                <div className="px-4 pb-3">
                  <div className="text-xs text-muted-foreground mb-2">Quick actions:</div>
                  <div className="flex flex-wrap gap-2">
                    {quickActions.map((action, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="text-xs h-7 px-3"
                        onClick={() => setInput(action)}
                      >
                        {action}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input */}
              <div className="border-t border-border p-4">
                <form onSubmit={handleSubmit} className="flex space-x-2">
                  <Input
                    placeholder="Ask me to help with tasks..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="text-sm"
                  />
                  <Button type="submit" size="icon" className="shrink-0">
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};