import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Command } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Message, Role, Persona } from '../types';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface ChatInterfaceProps {
  messages: Message[];
  persona: Persona;
  onSendMessage: (content: string) => void;
  isLoading: boolean;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  messages, 
  persona, 
  onSendMessage,
  isLoading 
}) => {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  return (
    <div className="flex flex-col h-full bg-white relative overflow-hidden">
      <header className="h-20 border-b border-slate-100 px-10 flex items-center justify-between z-10">
        <h1 className="text-xl font-light tracking-tight text-slate-900">{persona.name} — Session</h1>
        <div className="flex gap-3">
          <button className="px-4 py-2 text-xs font-medium border border-slate-200 rounded-md hover:bg-slate-50 transition-colors">Draft</button>
          <button className="px-6 py-2 text-xs font-medium bg-slate-900 text-white rounded-md shadow-lg shadow-slate-200 hover:bg-slate-800 transition-all">Deploy Agent</button>
        </div>
      </header>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-10 space-y-12 custom-scrollbar relative z-10"
      >
        <div className="max-w-2xl mx-auto space-y-8">
          <AnimatePresence>
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} persona={persona} />
            ))}
          </AnimatePresence>
          {isLoading && (
            <div className="flex gap-4 animate-pulse">
               <div className="w-8 h-8 rounded-full bg-slate-100 shrink-0" />
               <div className="space-y-2 flex-1">
                 <div className="h-4 w-32 bg-slate-50 rounded-md" />
                 <div className="h-4 w-full bg-slate-50 rounded-md" />
               </div>
            </div>
          )}
        </div>
      </div>

      <div className="p-10 z-10">
        <form 
          onSubmit={handleSubmit}
          className="max-w-2xl mx-auto relative"
        >
          <div className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Test your agent..."
              className="w-full bg-white border border-slate-200 rounded-full px-6 py-4 text-sm pr-14 focus:outline-none focus:border-slate-400 transition-colors shadow-sm"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            <button 
              type="submit"
              disabled={!input.trim() || isLoading}
              className={cn(
                "absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full transition-all",
                input.trim() && !isLoading ? "text-slate-900 bg-slate-100" : "text-slate-300"
              )}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <p className="text-center text-[10px] text-slate-400 mt-4 uppercase tracking-[0.2em] font-bold">
            Secure Terminal Link Established
          </p>
        </form>
      </div>
    </div>
  );
};

const MessageBubble: React.FC<{ message: Message; persona: Persona }> = ({ message, persona }) => {
  const isUser = message.role === Role.USER;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex flex-col space-y-2",
        isUser ? "items-start" : "items-start"
      )}
    >
      <div className="flex items-center gap-2 mb-1">
        <span className={cn(
          "text-[10px] uppercase tracking-widest font-bold",
          isUser ? "text-slate-400" : "text-slate-500 italic"
        )}>
          {isUser ? 'User' : persona.name}
        </span>
      </div>
      
      <div className={cn(
        "p-5 rounded-xl text-sm leading-relaxed shadow-sm transition-all",
        isUser 
          ? "bg-white border border-slate-100 text-slate-800" 
          : "bg-slate-900 text-white shadow-xl shadow-slate-200"
      )}>
        {isUser ? (
          <p className="whitespace-pre-wrap">{message.content}</p>
        ) : (
          <div className={cn(
            "markdown-body prose prose-sm max-w-none",
            !isUser && "prose-invert"
          )}>
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        )}
      </div>
    </motion.div>
  );
};
