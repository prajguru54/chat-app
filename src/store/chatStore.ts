import { create } from 'zustand';

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
}

interface ChatState {
  messages: Message[];
  isTyping: boolean;
  isConnected: boolean;
  addMessage: (message: Message) => void;
  setTyping: (typing: boolean) => void;
  setConnected: (connected: boolean) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  isTyping: false,
  isConnected: false,
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  setTyping: (typing) => set({ isTyping: typing }),
  setConnected: (connected) => set({ isConnected: connected }),
}));