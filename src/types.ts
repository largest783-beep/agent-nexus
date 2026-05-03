export enum Role {
  USER = 'user',
  MODEL = 'model',
  SYSTEM = 'system'
}

export interface Message {
  id: string;
  role: Role;
  content: string;
  timestamp: number;
}

export interface Persona {
  id: string;
  name: string;
  description: string;
  systemInstruction: string;
  avatar: string;
  accent: string;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  personaId: string;
  updatedAt: number;
}
