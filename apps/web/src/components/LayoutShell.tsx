import React, { useState, useEffect } from 'react';
import { useTheme } from '@chotify/ui';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Compass, Sparkles, Library, Settings, Command, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlayerBar } from './AudioPlayer/PlayerBar.js';
import { FullscreenPlayer } from './AudioPlayer/FullscreenPlayer.js';
import { PlayerKeyboardHandler } from './AudioPlayer/PlayerKeyboardHandler.js';

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1024
  );
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  // Watch viewport resizing
  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close sidebar drawer on route change
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location]);

  const isDesktop = viewportWidth >= 1024;
  const isTablet = viewportWidth >= 768 && viewportWidth < 1024;
  const isMobile = viewportWidth < 768;

  const navigationItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Explore', path: '/explore', icon: Compass },
    { name: 'AI Studio', path: '/studio', icon: Sparkles },
    { name: 'Library', path: '/library', icon: Library },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  // Render navigation lists
  const renderNavLinks = () =>
    navigationItems.map((item) =>
      React.createElement(
        NavLink,
        {
          key: item.name,
          to: item.path,
          className: ({ isActive }) =>
            `flex items-center gap-ch-3 px-ch-4 py-ch-3 rounded-ch-md text-sm font-medium transition-all focus-ring ${
              isActive
                ? 'bg-chotify-bg-secondary text-chotify-text-primary border-l-2 border-chotify-aura-gold'
                : 'text-chotify-text-secondary hover:text-chotify-text-primary hover:bg-chotify-bg-secondary/40'
            }`,
        },
        React.createElement(item.icon, { className: 'w-ch-4 h-ch-4' }),
        React.createElement('span', null, item.name)
      )
    );

  return React.createElement(
    React.Fragment,
    null,
    React.createElement(PlayerKeyboardHandler),
    React.createElement(FullscreenPlayer),
    React.createElement(
      'div',
      {
        className:
          'min-h-screen flex flex-col bg-chotify-bg-primary text-chotify-text-primary overflow-x-hidden font-sans',
      },
      // Desktop layout shell
      React.createElement(
        'div',
        { className: 'flex-1 flex relative' },
        isDesktop &&
          React.createElement(
            'aside',
            {
              className:
                'w-64 fixed top-0 bottom-0 left-0 border-r border-chotify-border-primary bg-chotify-bg-surface p-ch-4 flex flex-col justify-between z-10',
            },
            React.createElement(
              'div',
              { className: 'flex flex-col gap-ch-6' },
              // Brand Wordmark
              React.createElement(
                'div',
                { className: 'flex items-center justify-between px-ch-2' },
                React.createElement(
                  'span',
                  { className: 'text-lg font-bold font-mono tracking-widest text-chotify-text-primary' },
                  'CHOTIFY'
                ),
                React.createElement(
                  'span',
                  {
                    className:
                      'text-[10px] font-mono text-chotify-aura-gold bg-chotify-aura-glow px-1.5 py-0.5 rounded-sm border border-chotify-aura-gold/20',
                  },
                  'AI'
                )
              ),
              // Navigation Links
              React.createElement('nav', { className: 'flex flex-col gap-ch-1' }, renderNavLinks())
            ),
            // Footer section (Theme toggle and Command indicator)
            React.createElement(
              'div',
              { className: 'flex flex-col gap-ch-3' },
              // Command Palette Helper
              React.createElement(
                'div',
                {
                  className:
                    'flex items-center justify-between px-ch-3 py-ch-2 rounded-ch-sm bg-chotify-bg-secondary/60 border border-chotify-border-secondary text-xs text-chotify-text-muted font-mono',
                },
                React.createElement('span', null, 'CMD Palette'),
                React.createElement('span', null, 'Ctrl+K')
              ),
              // Theme toggle button
              React.createElement(
                'button',
                {
                  onClick: toggleTheme,
                  className:
                    'w-full flex items-center justify-center gap-ch-2 px-ch-4 py-ch-2.5 rounded-ch-md border border-chotify-border-primary text-xs font-mono tracking-wider hover:bg-chotify-bg-secondary transition-colors cursor-pointer outline-none focus-ring',
                },
                `THEME: ${theme.toUpperCase()}`
              )
            )
          ),
        // Mobile / Tablet Header Bar
        !isDesktop &&
          React.createElement(
            'header',
            {
              className:
                'w-full h-14 fixed top-0 left-0 right-0 z-20 bg-chotify-bg-surface/80 backdrop-blur-md border-b border-chotify-border-primary px-ch-4 flex items-center justify-between',
            },
            React.createElement(
              'div',
              { className: 'flex items-center gap-ch-3' },
              !isDesktop &&
                !isMobile &&
                React.createElement(
                  'button',
                  {
                    onClick: () => setIsSidebarOpen(true),
                    className: 'p-ch-1 rounded-ch-sm hover:bg-chotify-bg-secondary text-chotify-text-primary outline-none focus-ring cursor-pointer',
                  },
                  React.createElement(Menu, { className: 'w-ch-4 h-ch-4' })
                ),
              React.createElement(
                'span',
                { className: 'text-base font-bold font-mono tracking-widest' },
                'CHOTIFY'
              )
            ),
            React.createElement(
              'button',
              {
                onClick: toggleTheme,
                className:
                  'px-ch-3 py-1.5 rounded-ch-sm border border-chotify-border-primary text-[10px] font-mono hover:bg-chotify-bg-secondary outline-none focus-ring cursor-pointer',
              },
              theme.toUpperCase()
            )
          ),
        // Sliding sidebar drawer for tablet/mobile
        React.createElement(
          AnimatePresence,
          null,
          isSidebarOpen &&
            !isDesktop &&
            React.createElement(
              'div',
              { className: 'fixed inset-0 z-30' },
              // Backdrop
              React.createElement(motion.div, {
                initial: { opacity: 0 },
                animate: { opacity: 0.5 },
                exit: { opacity: 0 },
                className: 'absolute inset-0 bg-[#0b0b0a]/70 backdrop-blur-xs',
                onClick: () => setIsSidebarOpen(false),
              }),
              // Drawer view
              React.createElement(
                motion.aside,
                {
                  initial: { x: '-100%' },
                  animate: { x: 0 },
                  exit: { x: '-100%' },
                  transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] },
                  className:
                    'absolute top-0 bottom-0 left-0 w-64 bg-chotify-bg-surface border-r border-chotify-border-primary p-ch-4 flex flex-col justify-between',
                },
                React.createElement(
                  'div',
                  { className: 'flex flex-col gap-ch-6' },
                  React.createElement(
                    'div',
                    { className: 'flex items-center justify-between px-ch-2' },
                    React.createElement(
                      'span',
                      { className: 'text-base font-bold font-mono tracking-widest' },
                      'CHOTIFY'
                    ),
                    React.createElement(
                      'button',
                      {
                        onClick: () => setIsSidebarOpen(false),
                        className: 'p-ch-1 rounded-ch-sm hover:bg-chotify-bg-secondary outline-none focus-ring cursor-pointer',
                      },
                      React.createElement(X, { className: 'w-ch-4 h-ch-4' })
                    )
                  ),
                  React.createElement('nav', { className: 'flex flex-col gap-ch-1' }, renderNavLinks())
                ),
                React.createElement(
                  'div',
                  { className: 'flex flex-col gap-ch-3' },
                  React.createElement(
                    'button',
                    {
                      onClick: toggleTheme,
                      className:
                        'w-full py-ch-2.5 rounded-ch-md border border-chotify-border-primary text-xs font-mono hover:bg-chotify-bg-secondary outline-none focus-ring cursor-pointer',
                    },
                    `THEME: ${theme.toUpperCase()}`
                  )
                )
              )
            )
        ),
        // Main workspace content layout
        React.createElement(
          'main',
          {
            className: `flex-1 min-h-screen flex flex-col justify-between ${
              isDesktop ? 'pl-64' : 'pt-14 pb-20'
            }`,
          },
          React.createElement(
            'div',
            { className: 'flex-1 p-ch-4 lg:p-ch-6 max-w-7xl w-full mx-auto' },
            children
          ),
          // Persistent Music Player Dock Component
          React.createElement(PlayerBar)
        )
      ),
      // Mobile Bottom Tab Bar
      isMobile &&
        React.createElement(
          'nav',
          {
            className:
              'h-14 fixed bottom-0 left-0 right-0 z-20 bg-chotify-bg-surface/95 border-t border-chotify-border-primary flex items-center justify-around',
          },
          navigationItems.map((item) =>
            React.createElement(
              NavLink,
              {
                key: item.name,
                to: item.path,
                className: ({ isActive }) =>
                  `flex flex-col items-center gap-0.5 text-[9px] font-mono tracking-wider outline-none focus-ring ${
                    isActive ? 'text-chotify-aura-gold font-bold' : 'text-chotify-text-muted'
                  }`,
              },
              React.createElement(item.icon, { className: 'w-ch-4 h-ch-4' }),
              React.createElement('span', null, item.name.toUpperCase())
            )
          )
        )
    )
  );
}
