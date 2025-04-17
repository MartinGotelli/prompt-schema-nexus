
import React, { useState } from 'react';
import { toast } from "sonner";
import { SetupForm } from '@/components/test/SetupForm';
import { ChatInterface } from '@/components/test/ChatInterface';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  extractedData?: Record<string, any>;
  timestamp: Date;
}

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

  if (step === 'setup') {
    return (
      <SetupForm
        selectedMember={selectedMember}
        selectedAction={selectedAction}
        selectedConverseType={selectedConverseType}
        selectedExtractType={selectedExtractType}
        selectedSchema={selectedSchema}
        onMemberChange={setSelectedMember}
        onActionChange={setSelectedAction}
        onConverseTypeChange={setSelectedConverseType}
        onExtractTypeChange={setSelectedExtractType}
        onSchemaChange={setSelectedSchema}
        onSubmit={handleSubmitSetup}
      />
    );
  }

  return (
    <div>
      <div className="px-6 py-4 border-b">
        <h1 className="text-xl font-semibold">Testing with {selectedMember}</h1>
        <p className="text-sm text-muted-foreground">
          {selectedAction === 'converse' && `Converse Type: ${selectedConverseType}`}
          {selectedAction === 'extract' && `Extract Type: ${selectedExtractType}, Schema: ${selectedSchema}`}
          {selectedAction === 'converse and extract' && 
            `Converse Type: ${selectedConverseType}, Extract Type: ${selectedExtractType}, Schema: ${selectedSchema}`}
        </p>
      </div>

      <ChatInterface
        messages={messages}
        newMessage={newMessage}
        selectedAction={selectedAction}
        onSendMessage={handleSendMessage}
        onMessageChange={(e) => setNewMessage(e.target.value)}
      />
    </div>
  );
};

export default Test;
