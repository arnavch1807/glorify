import { create } from 'zustand';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'info' | 'success' | 'favorite' | 'download' | 'queue' | 'error';
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastState {
  toasts: ToastMessage[];
  addToast: (message: string, type?: ToastMessage['type'], action?: ToastMessage['action']) => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  addToast: (message, type = 'info', action) => {
    const id = Math.random().toString(36).substring(2, 9);
    set((state) => ({ toasts: [...state.toasts, { id, message, type, action }] }));
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, 4000); // 4 seconds for interactive toasts so user has time to click
  },
  removeToast: (id) => {
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
  }
}));
