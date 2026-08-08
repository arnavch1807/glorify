import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';
import { usePlayerStore } from './playerStore.js';

interface User {
  id: string;
  username: string;
  email: string;
  displayName: string;
  avatar?: string;
  bio?: string;
  theme: 'sand' | 'carbon';
  subscription: 'free' | 'premium';
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  setAccessToken: (token: string | null) => void;
  login: (email: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string, displayName?: string) => Promise<boolean>;
  logout: () => Promise<void>;
  getCurrentUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      loading: false,
      error: null,

      setAccessToken: (token) => {
        set({ accessToken: token });
      },

      login: async (email, password) => {
        set({ loading: true, error: null });
        try {
          const response = await axios.post('http://localhost:5000/api/auth/login', { email, password }, { withCredentials: true });
          const { accessToken, user } = response.data.data;
          set({
            user,
            accessToken,
            isAuthenticated: true,
            loading: false,
          });
          return true;
        } catch (err: any) {
          const errMsg = err.response?.data?.message || 'Login failed';
          set({ error: errMsg, loading: false });
          return false;
        }
      },

      register: async (username, email, password, displayName) => {
        set({ loading: true, error: null });
        try {
          const response = await axios.post('http://localhost:5000/api/auth/register', {
            username,
            email,
            password,
            displayName,
          }, { withCredentials: true });
          const { accessToken, user } = response.data.data;
          set({
            user,
            accessToken,
            isAuthenticated: true,
            loading: false,
          });
          return true;
        } catch (err: any) {
          const errMsg = err.response?.data?.message || 'Registration failed';
          set({ error: errMsg, loading: false });
          return false;
        }
      },

      logout: async () => {
        set({ loading: true });
        try {
          await axios.post('http://localhost:5000/api/auth/logout', {}, { withCredentials: true });
        } catch (err) {
          console.error('Logout error on server:', err);
        } finally {
          usePlayerStore.getState().clearCloudData();
          set({
            user: null,
            accessToken: null,
            isAuthenticated: false,
            loading: false,
            error: null,
          });
        }
      },

      getCurrentUser: async () => {
        const token = get().accessToken;
        if (!token) return;
        set({ loading: true });
        try {
          const response = await axios.get('http://localhost:5000/api/auth/me', {
            headers: {
              Authorization: `Bearer ${token}`
            },
            withCredentials: true
          });
          const { user } = response.data.data;
          set({ user, isAuthenticated: true, loading: false });
        } catch (err) {
          set({ loading: false });
        }
      },
    }),
    {
      name: 'glorify-auth',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
