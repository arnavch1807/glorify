import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  return React.createElement(
    AnimatePresence,
    {
      onExitComplete: onComplete,
    },
    isVisible &&
      React.createElement(
        motion.div,
        {
          initial: { opacity: 1 },
          exit: { opacity: 0 },
          transition: { duration: 0.4, ease: 'easeInOut' },
          className:
            'fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#090909] text-[#FAFAF9] font-sans selection:bg-transparent',
        },
        React.createElement(
          'div',
          { className: 'flex flex-col items-center gap-ch-4' },
          // Animated Aura Gold Indicator dot
          React.createElement(
            motion.div,
            {
              initial: { scale: 0.8, opacity: 0.5 },
              animate: { scale: [0.8, 1.2, 0.8], opacity: [0.5, 1, 0.5] },
              transition: { repeat: Infinity, duration: 1.5, ease: 'easeInOut' },
              className: 'w-ch-4.5 h-ch-4.5 rounded-full bg-[#D4AF37] shadow-ch-glow',
            }
          ),
          React.createElement(
            motion.h1,
            {
              initial: { opacity: 0, y: 10 },
              animate: { opacity: 1, y: 0 },
              transition: { delay: 0.2, duration: 0.5 },
              className:
                'text-3xl font-bold tracking-[0.25em] font-sans uppercase bg-gradient-to-r from-[#FAFAF9] via-[#FAFAF9] to-[#D4AF37] bg-clip-text text-transparent',
            },
            'GLORIFY'
          ),
          React.createElement(
            motion.span,
            {
              initial: { opacity: 0 },
              animate: { opacity: 0.4 },
              transition: { delay: 0.5, duration: 0.3 },
              className: 'text-xs font-mono tracking-widest uppercase',
            },
            'AI Audio Workspace'
          )
        )
      )
  );
}
