import React, { useState, useEffect, useRef } from 'react';
import { useKeyPress } from '@chotify/hooks';
import { useTheme } from '@chotify/ui';
import { useNavigate } from 'react-router-dom';
import { Search, Moon, Sun, Settings, Music, Sparkles, Terminal } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
export function CommandPalette() {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const inputRef = useRef(null);
    // Shortcut triggers toggle CMD+K
    useEffect(() => {
        const handleKeyDown = (event) => {
            if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
                event.preventDefault();
                setIsOpen((prev) => !prev);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);
    // Listen to Escape to close
    useKeyPress('Escape', () => {
        if (isOpen) {
            setIsOpen(false);
        }
    });
    const commands = [
        {
            id: 'toggle-theme',
            title: `Switch to ${theme === 'carbon' ? 'Sand (Light)' : 'Carbon (Dark)'} Theme`,
            icon: theme === 'carbon' ? Sun : Moon,
            action: () => {
                toggleTheme();
                setIsOpen(false);
            },
        },
        {
            id: 'go-home',
            title: 'Navigate to Home Dashboard',
            icon: Music,
            action: () => {
                navigate('/');
                setIsOpen(false);
            },
        },
        {
            id: 'go-studio',
            title: 'Open AI Studio Composer',
            icon: Sparkles,
            action: () => {
                navigate('/studio');
                setIsOpen(false);
            },
        },
        {
            id: 'go-settings',
            title: 'Open Settings Console',
            icon: Settings,
            action: () => {
                navigate('/settings');
                setIsOpen(false);
            },
        },
    ];
    const filteredCommands = commands.filter((cmd) => cmd.title.toLowerCase().includes(search.toLowerCase()));
    // Reset selection index on search change
    useEffect(() => {
        setSelectedIndex(0);
    }, [search]);
    // Handle arrows and Enter
    useEffect(() => {
        if (!isOpen)
            return;
        const handleNav = (e) => {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex((prev) => (prev + 1) % filteredCommands.length);
            }
            else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length);
            }
            else if (e.key === 'Enter') {
                e.preventDefault();
                if (filteredCommands[selectedIndex]) {
                    filteredCommands[selectedIndex].action();
                }
            }
        };
        window.addEventListener('keydown', handleNav);
        return () => window.removeEventListener('keydown', handleNav);
    }, [isOpen, selectedIndex, filteredCommands]);
    // Focus input on open
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 50);
            setSearch('');
        }
    }, [isOpen]);
    return React.createElement(AnimatePresence, null, isOpen &&
        React.createElement('div', { className: 'fixed inset-0 z-40' }, 
        // Backdrop overlay
        React.createElement(motion.div, {
            initial: { opacity: 0 },
            animate: { opacity: 0.6 },
            exit: { opacity: 0 },
            className: 'absolute inset-0 bg-[#0B0B0A]/85 backdrop-blur-xs',
            onClick: () => setIsOpen(false),
        }), 
        // Dialog container
        React.createElement('div', { className: 'fixed inset-0 flex items-start justify-center pt-24 px-ch-4 pointer-events-none' }, React.createElement(motion.div, {
            initial: { opacity: 0, scale: 0.97, y: -8 },
            animate: { opacity: 1, scale: 1, y: 0 },
            exit: { opacity: 0, scale: 0.97, y: -8 },
            transition: { duration: 0.2, ease: 'easeOut' },
            className: 'w-full max-w-lg rounded-ch-lg overflow-hidden bg-chotify-bg-surface border border-chotify-border-primary shadow-ch-glow pointer-events-auto flex flex-col',
        }, 
        // Search Input Row
        React.createElement('div', {
            className: 'flex items-center gap-ch-3 px-ch-4 py-ch-3 border-b border-chotify-border-primary',
        }, React.createElement(Search, {
            className: 'w-ch-4 h-ch-4 text-chotify-text-muted',
        }), React.createElement('input', {
            ref: inputRef,
            type: 'text',
            placeholder: 'Type a command or query...',
            value: search,
            onChange: (e) => setSearch(e.target.value),
            className: 'w-full bg-transparent border-none outline-none text-sm text-chotify-text-primary placeholder:text-chotify-text-muted',
        }), React.createElement('span', {
            className: 'text-[10px] font-mono px-1.5 py-0.5 rounded-sm bg-chotify-bg-secondary text-chotify-text-muted border border-chotify-border-secondary',
        }, 'ESC')), 
        // Results list
        React.createElement('div', { className: 'max-h-60 overflow-y-auto p-ch-2 flex flex-col gap-ch-1' }, filteredCommands.length === 0
            ? React.createElement('div', {
                className: 'text-center py-ch-6 text-sm text-chotify-text-muted font-mono flex flex-col items-center gap-ch-2',
            }, React.createElement(Terminal, { className: 'w-ch-4 h-ch-4' }), 'No commands matched index')
            : filteredCommands.map((cmd, index) => {
                const isSelected = index === selectedIndex;
                return React.createElement('button', {
                    key: cmd.id,
                    onClick: cmd.action,
                    onMouseEnter: () => setSelectedIndex(index),
                    className: `w-full flex items-center gap-ch-3 px-ch-3 py-ch-2.5 rounded-ch-md text-left text-sm font-medium transition-colors cursor-pointer outline-none ${isSelected
                        ? 'bg-chotify-bg-secondary text-chotify-text-primary'
                        : 'bg-transparent text-chotify-text-secondary'}`,
                }, React.createElement(cmd.icon, {
                    className: `w-ch-4 h-ch-4 ${isSelected ? 'text-chotify-aura-gold' : 'text-chotify-text-muted'}`,
                }), React.createElement('span', { className: 'flex-1' }, cmd.title), isSelected &&
                    React.createElement('span', {
                        className: 'text-[10px] font-mono text-chotify-text-muted',
                    }, 'ENTER'));
            }))))));
}
//# sourceMappingURL=CommandPalette.js.map