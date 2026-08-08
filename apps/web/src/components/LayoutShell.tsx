import React, { useState, useEffect } from 'react';
import { useTheme } from '@chotify/ui';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Home, Search, Library, Heart, Download, Sparkles, Settings, Bell,
  ChevronLeft, ChevronRight, User, Menu, X 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlayerBar } from './AudioPlayer/PlayerBar.js';
import { FullscreenPlayer } from './AudioPlayer/FullscreenPlayer.js';
import { PlayerKeyboardHandler } from './AudioPlayer/PlayerKeyboardHandler.js';
import { ToastContainer } from './AudioPlayer/ToastContainer.js';

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
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

  // Close sidebar drawer on route change (for mobile)
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location]);

  const isDesktop = viewportWidth >= 1024;
  const isTablet = viewportWidth >= 768 && viewportWidth < 1024;
  const isMobile = viewportWidth < 768;

  const navigationItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Search', path: '/search', icon: Search },
    { name: 'Library', path: '/library', icon: Library },
    { name: 'Liked Songs', path: '/library?tab=liked', icon: Heart },
    { name: 'Downloads', path: '/library?tab=downloads', icon: Download },
  ];

  const secondaryItems = [
    { name: 'Glorify Labs', path: '/studio', icon: Sparkles },
    { name: 'Notifications', path: '/notifications', icon: Bell },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const isLinkActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    if (path.includes('?')) {
      const [pathPart, queryPart] = path.split('?');
      return location.pathname === pathPart && location.search.includes(queryPart);
    }
    if (path === '/library') {
      return location.pathname === '/library' && !location.search;
    }
    return location.pathname === path;
  };

  const renderNavLinks = (items: typeof navigationItems, collapsed: boolean) =>
    items.map((item) => {
      const active = isLinkActive(item.path);
      return React.createElement(
        NavLink,
        {
          key: item.name,
          to: item.path,
          className: `flex items-center gap-ch-3 pl-6 pr-4 py-2.5 rounded-full text-sm font-medium transition-all duration-300 outline-none relative hover:scale-[1.02] active:scale-[0.98] ${
            active
              ? 'text-glorify-text-primary font-semibold'
              : 'text-glorify-text-secondary hover:text-glorify-text-primary hover:bg-[#F3EFE3]/80 hover:shadow-sm dark:hover:bg-white/5'
          }`,
          title: collapsed ? item.name : undefined,
        },
        React.createElement(item.icon, { className: 'w-ch-4.5 h-ch-4.5 flex-shrink-0 relative z-10' }),
        !collapsed && React.createElement('span', { className: 'truncate relative z-10' }, item.name),
        active &&
          React.createElement(motion.div, {
            layoutId: 'activeIndicatorLine-' + (items === navigationItems ? 'nav' : 'sec'),
            className: 'absolute left-1.5 top-3.5 bottom-3.5 w-[4px] rounded-full bg-glorify-accent shadow-sm',
            transition: { type: 'spring', stiffness: 350, damping: 28 },
          })
      );
    });

  // Sidebar shared interior content
  const renderSidebarContent = (collapsed: boolean) =>
    React.createElement(
      React.Fragment,
      null,
      React.createElement(
        'div',
        { className: 'flex flex-col gap-ch-5' },
        
        // Brand Wordmark + Collapse Button
        React.createElement(
          'div',
          { className: 'flex items-center justify-between px-ch-2.5 h-10 border-b border-glorify-border-primary/10 pb-ch-2.5' },
          !collapsed &&
            React.createElement(
              'span',
              { className: 'text-sm font-bold tracking-[0.25em] text-glorify-text-primary uppercase font-sans flex items-center' },
              'GLORIFY',
              React.createElement('span', { className: 'text-glorify-accent font-extrabold ml-0.5' }, '.')
            ),
          isDesktop && React.createElement(
            'button',
            {
              onClick: () => setIsCollapsed(!isCollapsed),
              className:
                'p-1.5 rounded-full hover:bg-glorify-bg-secondary text-glorify-text-secondary hover:text-glorify-text-primary cursor-pointer outline-none focus-ring ml-auto transition-transform',
            },
            React.createElement(collapsed ? ChevronRight : ChevronLeft, { className: 'w-ch-4 h-ch-4' })
          )
        ),
        
        // Navigation items
        React.createElement(
          'nav',
          { className: 'flex flex-col gap-1' },
          renderNavLinks(navigationItems, collapsed)
        ),
        
        // Divider
        React.createElement('div', { className: 'border-t border-glorify-border-primary/10 my-1' }),
        
        // Secondary items
        React.createElement(
          'div',
          { className: 'flex flex-col gap-1' },
          renderNavLinks(secondaryItems, collapsed)
        )
      ),
      
      // Footer controls & Profile
      React.createElement(
        'div',
        { className: 'flex flex-col gap-ch-4 border-t border-glorify-border-primary/10 pt-ch-4' },
        
        // Theme Toggle
        React.createElement(
          'button',
          {
            onClick: toggleTheme,
            className:
              'w-full flex items-center justify-center gap-ch-2 px-ch-4 py-2.5 rounded-full bg-glorify-bg-surface border border-glorify-border-primary/10 text-xs font-semibold text-glorify-text-secondary hover:text-glorify-accent hover:bg-[#F3EFE3]/80 hover:shadow-sm dark:hover:bg-white/5 transition-all cursor-pointer outline-none focus-ring hover:scale-[1.02]',
            title: 'Toggle Theme',
          },
          collapsed ? theme.charAt(0).toUpperCase() : `Theme: ${theme.charAt(0).toUpperCase() + theme.slice(1)}`
        ),

        // User profile Card
        React.createElement(
          'div',
          { className: 'flex items-center gap-ch-3 px-ch-2 py-ch-1' },
          React.createElement(
            'div',
            { className: 'w-9 h-9 rounded-full bg-glorify-accent/15 text-glorify-accent flex items-center justify-center border border-glorify-accent/20 flex-shrink-0 shadow-sm' },
            React.createElement(User, { className: 'w-ch-4.5 h-ch-4.5' })
          ),
          !collapsed &&
            React.createElement(
              'div',
              { className: 'flex flex-col min-w-0' },
              React.createElement('span', { className: 'text-xs font-semibold text-glorify-text-primary truncate' }, 'Premium User'),
              React.createElement('span', { className: 'text-[9px] text-glorify-text-muted truncate' }, 'Pro Subscription')
            )
        ),
        
        // Version info
        !collapsed &&
          React.createElement(
            'div',
            { className: 'text-[9px] text-center text-glorify-text-muted/60 font-mono tracking-widest' },
            'v1.0.0 Premium'
          )
      )
    );

  // DESKTOP REGIONS LAYOUT
  if (isDesktop) {
    return React.createElement(
      React.Fragment,
      null,
      React.createElement(PlayerKeyboardHandler),
      React.createElement(FullscreenPlayer),
      React.createElement(ToastContainer),
      React.createElement(
        'div',
        { className: 'w-screen h-screen flex flex-col overflow-hidden bg-glorify-bg-primary text-glorify-text-primary font-sans select-none' },
        
        // Top Section (Sidebar + Content)
        React.createElement(
          'div',
          { className: 'flex-grow flex overflow-hidden w-full relative' },
          
          // Sidebar
          React.createElement(
            motion.aside,
            {
              animate: { width: isCollapsed ? 80 : 256 },
              transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
              className: 'h-full glass-sidebar p-4 flex flex-col justify-between overflow-x-hidden relative z-20 border-r border-glorify-border-primary/5 flex-shrink-0 bg-glorify-bg-surface/20'
            },
            renderSidebarContent(isCollapsed)
          ),
          
          // Main content workspace
          React.createElement(
            'main',
            { className: 'flex-1 h-full overflow-y-auto bg-glorify-bg-primary' },
            React.createElement(
              'div',
              { className: 'p-8 max-w-6xl w-full mx-auto pb-16 font-sans' },
              children
            )
          )
        ),
        
        // Bottom Section (Mini Player docked at the bottom under Sidebar & Content)
        React.createElement(
          'div',
          { className: 'h-[100px] w-full border-t border-glorify-border-primary/5 bg-glorify-bg-surface/85 backdrop-blur-xl relative z-30 flex-shrink-0' },
          React.createElement(PlayerBar, { isCollapsed, isDesktop: true })
        )
      )
    );
  }

  // MOBILE / TABLET FLOATING LAYOUT
  return React.createElement(
    React.Fragment,
    null,
    React.createElement(PlayerKeyboardHandler),
    React.createElement(FullscreenPlayer),
    React.createElement(ToastContainer),
    React.createElement(
      'div',
      { className: 'min-h-screen flex flex-col bg-glorify-bg-primary text-glorify-text-primary overflow-x-hidden font-sans' },
      
      // Mobile / Tablet Header Bar
      React.createElement(
        'header',
        {
          className:
            'w-full h-14 fixed top-0 left-0 right-0 z-30 bg-glorify-bg-primary/80 backdrop-blur-md border-b border-glorify-border-primary/20 px-ch-4 flex items-center justify-between',
        },
        React.createElement(
          'div',
          { className: 'flex items-center gap-ch-3' },
          React.createElement(
            'button',
            {
              onClick: () => setIsSidebarOpen(true),
              className: 'p-ch-2 rounded-full hover:bg-glorify-bg-secondary/60 text-glorify-text-primary outline-none focus-ring cursor-pointer',
            },
            React.createElement(Menu, { className: 'w-ch-5 h-ch-5' })
          ),
          React.createElement(
            'span',
            { className: 'text-sm font-bold tracking-[0.25em] font-sans text-glorify-text-primary uppercase flex items-center' },
            'GLORIFY',
            React.createElement('span', { className: 'text-glorify-accent font-extrabold ml-0.5' }, '.')
          )
        ),
        React.createElement(
          'button',
          {
            onClick: toggleTheme,
            className:
              'px-ch-3.5 py-1.5 rounded-full border border-glorify-border-primary/40 text-[10px] font-semibold hover:bg-glorify-bg-secondary outline-none focus-ring cursor-pointer',
          },
          theme.charAt(0).toUpperCase() + theme.slice(1)
        )
      ),

      // Sliding Drawer Sidebar
      React.createElement(
        AnimatePresence,
        null,
        isSidebarOpen &&
          React.createElement(
            'div',
            { className: 'fixed inset-0 z-40' },
            React.createElement(motion.div, {
              initial: { opacity: 0 },
              animate: { opacity: 0.5 },
              exit: { opacity: 0 },
              className: 'absolute inset-0 bg-black/70 backdrop-blur-sm',
              onClick: () => setIsSidebarOpen(false),
            }),
            React.createElement(
              motion.aside,
              {
                initial: { x: '-100%' },
                animate: { x: 0 },
                exit: { x: '-100%' },
                transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] },
                className:
                  'absolute top-0 bottom-0 left-0 w-64 bg-glorify-bg-surface p-ch-4 flex flex-col justify-between border-r border-glorify-border-primary/20 shadow-2xl z-10',
              },
              renderSidebarContent(false)
            )
          )
      ),

      // Mobile Content Container
      React.createElement(
        'main',
        { className: 'flex-1 pt-14 pb-24' },
        React.createElement(
          'div',
          { className: 'p-ch-4 max-w-6xl w-full mx-auto font-sans' },
          children
        )
      ),

      // Mobile Floating Player
      React.createElement(PlayerBar, { isCollapsed: false, isDesktop: false }),

      // Mobile Bottom Tab Bar (Only on mobile viewport)
      isMobile &&
        React.createElement(
          'nav',
          {
            className:
              'h-16 fixed bottom-0 left-0 right-0 z-30 bg-glorify-bg-surface/90 backdrop-blur-lg border-t border-glorify-border-primary/10 flex items-center justify-around pb-safe',
          },
          [
            { name: 'Search', path: '/search', icon: Search },
            { name: 'Home', path: '/', icon: Home },
            { name: 'Library', path: '/library', icon: Library },
            { name: 'Glorify Labs', path: '/studio', icon: Sparkles }
          ].map((item) =>
            React.createElement(
              NavLink,
              {
                key: item.name,
                to: item.path,
                className: ({ isActive }) =>
                  `flex flex-col items-center gap-1 text-[10px] font-medium transition-colors outline-none focus-ring ${
                    isActive ? 'text-glorify-accent font-semibold' : 'text-glorify-text-muted'
                  }`,
              },
              React.createElement(item.icon, { className: 'w-ch-5 h-ch-5' }),
              React.createElement('span', null, item.name)
            )
          )
        )
    )
  );
}
