import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'customer';
}

interface AuthState {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  fetchUser: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  loading: true,
  setUser: (user) => set({ user, loading: false }),
  fetchUser: async () => {
    try {
      const res = await fetch('/api/auth/me');
      const { user } = await res.json();
      set({ user, loading: false });
    } catch {
      set({ user: null, loading: false });
    }
  },
  logout: async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    set({ user: null });
  },
}));