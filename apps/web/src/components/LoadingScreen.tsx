import React from 'react';
import { motion } from 'framer-motion';

export function LoadingScreen() {
  return React.createElement(
    'div',
    { className: 'w-full py-16 flex flex-col items-center justify-center min-h-[40vh] select-none text-center font-sans' },
    
    // Core GLORIFY container with gold accents and slow glowing pulse
    React.createElement(
      'div',
      { className: 'flex flex-col items-center gap-ch-4' },
      
      React.createElement(
        motion.div,
        {
          animate: {
            scale: [0.95, 1.05, 0.95],
            opacity: [0.6, 1, 0.6],
            boxShadow: [
              '0 0 10px rgba(212, 175, 55, 0.1)',
              '0 0 30px rgba(212, 175, 55, 0.25)',
              '0 0 10px rgba(212, 175, 55, 0.1)'
            ]
          },
          transition: {
            repeat: Infinity,
            duration: 2.2,
            ease: 'easeInOut'
          },
          className: 'w-12 h-12 rounded-full bg-glorify-accent/15 border border-glorify-accent flex items-center justify-center text-glorify-accent text-sm font-extrabold tracking-widest'
        },
        'G'
      ),
      
      React.createElement(
        motion.h2,
        {
          initial: { opacity: 0, y: 10 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6 },
          className: 'text-2xl font-bold tracking-[0.25em] text-glorify-text-primary uppercase font-sans mt-2'
        },
        'GLORIFY'
      ),
      
      React.createElement(
        motion.div,
        {
          initial: { opacity: 0 },
          animate: { opacity: 0.8 },
          transition: { delay: 0.3, duration: 0.5 },
          className: 'flex flex-col gap-1 text-xs text-glorify-text-muted mt-2 tracking-wide font-normal'
        },
        React.createElement('span', null, 'Your music.'),
        React.createElement('span', null, 'Beautifully organized.')
      )
    )
  );
}
