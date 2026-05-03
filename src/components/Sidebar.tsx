import React from 'react';
import { Persona } from '../types';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

interface SidebarProps {
  personas: Persona[];
  currentPersona: Persona;
  onPersonaSelect: (personaId: string) => void;
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ personas, currentPersona, onPersonaSelect, className }) => {
  return (
    <aside className={cn("flex flex-col h-full bg-slate-50/50 border-r border-slate-100", className)}>
      <div className="p-8 pb-12">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-slate-900 rounded-sm flex items-center justify-center text-white font-bold text-xs italic">
            N
          </div>
          <span className="font-medium tracking-tight text-sm uppercase">Nexus</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
        <section>
          <div className="flex items-center gap-2 mb-4 px-2">
            <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold">Identity</span>
          </div>
          <div className="space-y-4">
            {personas.map((persona) => (
              <button
                key={persona.id}
                onClick={() => onPersonaSelect(persona.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-2 py-1 rounded-md transition-all duration-300 text-left relative",
                  currentPersona.id === persona.id 
                    ? "text-slate-900 font-medium" 
                    : "text-slate-400 hover:text-slate-600"
                )}
              >
                {currentPersona.id === persona.id && (
                  <motion.div 
                    layoutId="active-dot"
                    className="w-1.5 h-1.5 rounded-full bg-slate-900 shrink-0"
                  />
                )}
                <span className={cn(
                  "text-sm tracking-tight",
                  currentPersona.id !== persona.id && "ml-4"
                )}>
                  {persona.name}
                </span>
              </button>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center gap-2 mb-4 px-2">
            <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold">Library</span>
          </div>
          <div className="space-y-4 px-2">
            {['Recent Agents', 'Templates'].map((item, i) => (
              <div key={i} className="text-sm text-slate-500 hover:text-slate-700 cursor-pointer transition-colors">
                {item}
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="mt-auto p-8 border-t border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-200"></div>
          <div className="text-xs">
            <p className="font-medium text-slate-900">Sarah Jensen</p>
            <p className="text-slate-400">Pro Plan</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
