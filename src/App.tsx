import React, { useState, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { ChatInterface } from './components/ChatInterface';
import { Message, Role, Persona } from './types';
import { PERSONAS, INITIAL_MESSAGE } from './constants';
import { sendMessage } from './services/geminiService';

const App: React.FC = () => {
  const [currentPersona, setCurrentPersona] = useState<Persona>(PERSONAS[0]);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: Role.MODEL,
      content: INITIAL_MESSAGE,
      timestamp: Date.now()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = useCallback(async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: Role.USER,
      content,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Temporary message ID for streaming
      const assistantMessageId = (Date.now() + 1).toString();
      
      const assistantMessage: Message = {
        id: assistantMessageId,
        role: Role.MODEL,
        content: '',
        timestamp: Date.now()
      };
      
      setMessages(prev => [...prev, assistantMessage]);

      const history = messages.filter(m => m.id !== 'welcome');
      
      const fullResponse = await sendMessage(
        content,
        history,
        currentPersona.systemInstruction,
        (chunk) => {
          setMessages(prev => prev.map(m => 
            m.id === assistantMessageId 
              ? { ...m, content: m.content + chunk } 
              : m
          ));
        }
      );

      // Final update to ensure content is synced
      setMessages(prev => prev.map(m => 
        m.id === assistantMessageId 
          ? { ...m, content: fullResponse } 
          : m
      ));
    } catch (error) {
      console.error('AI error:', error);
      setMessages(prev => [...prev, {
        id: 'error-' + Date.now(),
        role: Role.MODEL,
        content: "Error in neural link. Systems integrity compromised. Please check API configuration.",
        timestamp: Date.now()
      }]);
    } finally {
      setIsLoading(false);
    }
  }, [messages, currentPersona]);

  const handlePersonaSelect = (personaId: string) => {
    const selected = PERSONAS.find(p => p.id === personaId);
    if (selected) {
      setCurrentPersona(selected);
      // Reset chat or keep history? Let's reset for clarity of context
      setMessages([{
        id: 'reset-' + Date.now(),
        role: Role.MODEL,
        content: `Persona changed to **${selected.name}**. System instructions updated.`,
        timestamp: Date.now()
      }]);
    }
  };

  return (
    <div className="flex h-screen w-full bg-white">
      <Sidebar 
        className="w-72 hidden md:flex" 
        personas={PERSONAS}
        currentPersona={currentPersona} 
        onPersonaSelect={handlePersonaSelect} 
      />
      <main className="flex-1 h-full min-w-0">
        <ChatInterface 
          messages={messages} 
          persona={currentPersona} 
          onSendMessage={handleSendMessage} 
          isLoading={isLoading}
        />
      </main>
    </div>
  );
};

export default App;
