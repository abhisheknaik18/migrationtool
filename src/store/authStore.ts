import { create } from 'zustand';
import type { User } from '../types';
import { authApi } from '../lib/api';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    email: string;
    password: string;
    fullName: string;
    company?: string;
  }) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

// Demo user for testing without authentication
const DEMO_USER: User = {
  id: 'demo-user',
  email: 'demo@example.com',
  fullName: 'Demo User',
  company: 'Demo Company',
};

export const useAuthStore = create<AuthState>((set) => ({
  user: DEMO_USER, // Set demo user by default
  token: localStorage.getItem('token'),
  isLoading: false,
  error: null,

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authApi.login({ email, password });
      localStorage.setItem('token', response.token);
      set({ user: response.user, token: response.token, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.error || 'Login failed',
        isLoading: false,
      });
      throw error;
    }
  },

  register: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authApi.register(data);
      localStorage.setItem('token', response.token);
      set({ user: response.user, token: response.token, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.error || 'Registration failed',
        isLoading: false,
      });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null });
  },

  checkAuth: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      set({ user: null, token: null });
      return;
    }

    try {
      const user = await authApi.getMe();
      set({ user, token });
    } catch (error) {
      localStorage.removeItem('token');
      set({ user: null, token: null });
    }
  },
}));

