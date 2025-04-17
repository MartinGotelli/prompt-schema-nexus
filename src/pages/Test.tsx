
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Send } from 'lucide-react';
import { toast } from "sonner";

interface Message {
  role: 'user' | 'assistant';
  content: string;
  extractedData?: Record<string, any>;
  timestamp: Date;
}

const members = ['Shotgun', 'CSR', 'Analyst', 'Help'];
const actions = ['converse', 'extract', 'converse and extract'];
const conversePromptTypes = ['greeting', 'followup', 'closing'];
const extractPromptTypes = ['contact', 'request', 'feedback'];
const schemaNames = ['contact_info', 'support_request', 'feedback_form'];

const Test = () => {
  const [step, setStep] = useState<'setup' | 'chat'>('setup');
  const [selectedMember, setSelectedMember] = useState('');
  const [selectedAction, setSelectedAction] = useState('');
  const [selectedConverseType, setSelectedConverseType] = useState('');
  const [selectedExtractType, setSelectedExtractType] = useState('');
  const [selectedSchema, setSelectedSchema] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');

  const handleSubmitSetup = () => {
    if (!selectedMember || !selectedAction) {
      toast.error("Please select required fields");
      return;
    }

    if (selectedAction === 'converse' && !selectedConverseType) {
      toast.error("Please select a converse prompt type");
      return;
    }

    if (selectedAction === 'extract' && (!selectedExtractType || !selectedSchema)) {
      toast.error("Please select extract prompt type and schema");
      return;
    }

    if (selectedAction === 'converse and extract' && 
        (!selectedConverseType || !selectedExtractType || !selectedSchema)) {
      toast.error("Please select all required fields");
      return;
    }

    setStep('chat');
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const userMessage: Message = {
      role: 'user',
      content: newMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);

    // Simulate AI response based on action type
    setTimeout(() => {
      const aiMessage: Message = {
        role: 'assistant',
        content: selectedAction !== 'extract' ? `${selectedMember} AI response: "${newMessage}"` : '',
        extractedData: selectedAction !== 'converse' ? {
          schema: selectedSchema,
          type: selectedExtractType,
          data: {
            sample: "Extracted data would appear here",
            userInput: newMessage
          }
        } : undefined,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
    }, 1000);

    setNewMessage('');
  };

  const renderMessage = (message: Message) => {
    if (message.role === 'user') {
      return (
        <div key={message.timestamp.getTime()} className="ml-auto">
          <div className="bg-primary text-primary-foreground rounded-lg px-3 py-2 text-sm max-w-[80%]">
            {message.content}
          </div>
        </div>
      );
    }

    return (
      <div key={message.timestamp.getTime()} className="space-y-2">
        {message.content && (
          <div className="bg-muted rounded-lg px-3 py-2 text-sm max-w-[80%]">
            {message.content}
          </div>
        )}
        {message.extractedData && (
          <div className="bg-muted rounded-lg px-3 py-2 text-sm max-w-[80%] font-mono">
            <pre className="whitespace-pre-wrap break-words">
              {JSON.stringify(message.extractedData, null, 2)}
            </pre>
          </div>
        )}
      </div>
    );
  };

  if (step === 'setup') {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Test AI Member</h1>
        <Card>
          <CardHeader>
            <CardTitle>Setup Test Parameters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="member">AI Member</Label>
              <Select value={selectedMember} onValueChange={setSelectedMember}>
                <SelectTrigger id="member">
                  <SelectValue placeholder="Select member" />
                </SelectTrigger>
                <SelectContent>
                  {members.map(member => (
                    <SelectItem key={member} value={member}>
                      {member}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="action">Action</Label>
              <Select value={selectedAction} onValueChange={setSelectedAction}>
                <SelectTrigger id="action">
                  <SelectValue placeholder="Select action" />
                </SelectTrigger>
                <SelectContent>
                  {actions.map(action => (
                    <SelectItem key={action} value={action}>
                      {action}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {(selectedAction === 'converse' || selectedAction === 'converse and extract') && (
              <div className="space-y-2">
                <Label htmlFor="converseType">Converse Prompt Type</Label>
                <Select value={selectedConverseType} onValueChange={setSelectedConverseType}>
                  <SelectTrigger id="converseType">
                    <SelectValue placeholder="Select converse type" />
                  </SelectTrigger>
                  <SelectContent>
                    {conversePromptTypes.map(type => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {(selectedAction === 'extract' || selectedAction === 'converse and extract') && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="extractType">Extract Prompt Type</Label>
                  <Select value={selectedExtractType} onValueChange={setSelectedExtractType}>
                    <SelectTrigger id="extractType">
                      <SelectValue placeholder="Select extract type" />
                    </SelectTrigger>
                    <SelectContent>
                      {extractPromptTypes.map(type => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="schema">Schema</Label>
                  <Select value={selectedSchema} onValueChange={setSelectedSchema}>
                    <SelectTrigger id="schema">
                      <SelectValue placeholder="Select schema" />
                    </SelectTrigger>
                    <SelectContent>
                      {schemaNames.map(schema => (
                        <SelectItem key={schema} value={schema}>
                          {schema}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            <Button onClick={handleSubmitSetup} className="w-full">
              Start Test
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="px-6 py-4 border-b">
        <h1 className="text-xl font-semibold">Testing with {selectedMember}</h1>
        <p className="text-sm text-muted-foreground">
          {selectedAction === 'converse' && `Converse Type: ${selectedConverseType}`}
          {selectedAction === 'extract' && `Extract Type: ${selectedExtractType}, Schema: ${selectedSchema}`}
          {selectedAction === 'converse and extract' && 
            `Converse Type: ${selectedConverseType}, Extract Type: ${selectedExtractType}, Schema: ${selectedSchema}`}
        </p>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map(message => renderMessage(message))}
        </div>
      </ScrollArea>

      <form onSubmit={handleSendMessage} className="p-4 border-t">
        <div className="flex gap-4">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
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

export default Test;
