export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
}

export interface ChatState {
  messages: Message[];
  isTyping: boolean;
  isConnected: boolean;
}