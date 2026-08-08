import React from 'react';
import { useToastStore } from '../../store/toastStore.js';
import { motion, AnimatePresence } from 'framer-motion';

export function ToastContainer() {
  const { toasts } = useToastStore();

  return React.createElement(
    'div',
    { className: 'fixed top-6 right-6 z-[10000] flex flex-col gap-3 pointer-events-none' },
    React.createElement(
      AnimatePresence,
      null,
      toasts.map((toast) => {
        let icon = '🔔';
        if (toast.type === 'favorite') icon = '❤️';
        else if (toast.type === 'download') icon = '⬇️';
        else if (toast.type === 'queue') icon = '🎵';
        else if (toast.type === 'error') icon = '❌';

        return React.createElement(
          motion.div,
          {
            key: toast.id,
            initial: { opacity: 0, y: -20, scale: 0.9 },
            animate: { opacity: 1, y: 0, scale: 1 },
            exit: { opacity: 0, scale: 0.85, transition: { duration: 0.2 } },
            className: 'pointer-events-auto flex items-center gap-3 px-5 py-3.5 rounded-[18px] bg-chotify-bg-surface/85 backdrop-blur-xl border border-chotify-border-primary/10 shadow-[0_12px_32px_rgba(0,0,0,0.12)] text-xs font-semibold text-chotify-text-primary'
          },
          React.createElement('span', { className: 'text-sm' }, icon),
          React.createElement('span', null, toast.message),
          toast.action &&
            React.createElement(
              'button',
              {
                onClick: (e) => {
                  e.stopPropagation();
                  toast.action?.onClick();
                  useToastStore.getState().removeToast(toast.id);
                },
                className: 'ml-3 px-3 py-1 bg-glorify-accent text-glorify-carbon-950 hover:scale-105 active:scale-95 rounded-full text-[10px] font-bold cursor-pointer transition-all border border-transparent shadow-sm'
              },
              toast.action.label
            )
        );
      })
    )
  );
}
