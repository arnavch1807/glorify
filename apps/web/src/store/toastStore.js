import { create } from 'zustand';
export const useToastStore = create((set) => ({
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
//# sourceMappingURL=toastStore.js.map