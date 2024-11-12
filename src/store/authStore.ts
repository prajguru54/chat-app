import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  username: string;
  email: string;
  password: string;
}

interface AuthState {
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

// Dummy users data
const dummyUsers: User[] = [
  { id: '1', username: 'Arjun Kumar', email: 'arjun@example.com', password: 'pass123' },
  { id: '2', username: 'Priya Sharma', email: 'priya@example.com', password: 'pass123' },
  { id: '3', username: 'Rahul Verma', email: 'rahul@example.com', password: 'pass123' },
  { id: '4', username: 'Neha Patel', email: 'neha@example.com', password: 'pass123' },
  { id: '5', username: 'Vikram Singh', email: 'vikram@example.com', password: 'pass123' },
];

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      login: (email, password) => {
        const user = dummyUsers.find(
          (u) => u.email === email && u.password === password
        );
        if (user) {
          set({ user });
          return true;
        }
        return false;
      },
      logout: () => set({ user: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
);

export const getDummyUsers = () => dummyUsers;