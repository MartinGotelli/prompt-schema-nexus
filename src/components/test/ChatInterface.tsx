
import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { Message } from './Message';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  extractedData?: Record<string, any>;
  timestamp: Date;
}

interface ChatInterfaceProps {
  messages: ChatMessage[];
  newMessage: string;
  selectedAction: string;
  onSendMessage: (e: React.FormEvent) => void;
  onMessageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  newMessage,
  selectedAction,
  onSendMessage,
  onMessageChange,
}) => {
  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <Message
              key={message.timestamp.getTime()}
              role={message.role}
              content={message.content}
              extractedData={message.extractedData}
              showExtractedDataExpanded={selectedAction === 'extract'}
            />
          ))}
        </div>
      </ScrollArea>

      <form onSubmit={onSendMessage} className="p-4 border-t">
        <div className="flex gap-4">
          <Input
            value={newMessage}
            onChange={onMessageChange}
            placeholder="Type your message..."
            className="flex-1"
          />
          <Button type="submit" size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};
