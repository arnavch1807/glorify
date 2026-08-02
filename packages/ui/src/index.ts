import React, { createContext, useContext, useState, useEffect } from 'react';

// Theme Configuration
export type Theme = 'sand' | 'carbon';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({
  children,
  defaultTheme = 'sand',
}: {
  children: React.ReactNode;
  defaultTheme?: Theme;
}) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('glorify-theme') as Theme;
      return saved || defaultTheme;
    }
    return defaultTheme;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('sand', 'carbon');
    root.classList.add(theme);
    localStorage.setItem('glorify-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setThemeState((prev: Theme) => (prev === 'sand' ? 'carbon' : 'sand'));
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  return React.createElement(
    ThemeContext.Provider,
    { value: { theme, toggleTheme, setTheme } },
    children
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// Reusable Premium Button Component
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ai';
  isLoading?: boolean;
}

export function Button({
  children,
  variant = 'primary',
  isLoading = false,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  let baseClass = 'px-ch-4 py-ch-3 text-base font-medium rounded-ch-md transition-all active:scale-[0.98] outline-none focus:outline-none focus-visible:ring-1.5 focus-visible:ring-glorify-aura-gold focus-visible:ring-offset-2 disabled:opacity-40 disabled:pointer-events-none cursor-pointer ';

  if (variant === 'primary') {
    baseClass += 'bg-glorify-carbon-950 text-glorify-platinum-50 hover:bg-glorify-carbon-900 dark:bg-glorify-platinum-50 dark:text-glorify-carbon-950 dark:hover:bg-glorify-platinum-400 border-none';
  } else if (variant === 'secondary') {
    baseClass += 'bg-transparent border border-glorify-border-primary text-glorify-text-primary hover:bg-glorify-bg-secondary';
  } else if (variant === 'ai') {
    baseClass += 'bg-glorify-accent text-glorify-carbon-950 hover:shadow-ch-glow border-none';
  }

  return React.createElement(
    'button',
    {
      disabled: disabled || isLoading,
      className: `${baseClass} ${className}`.trim(),
      ...props,
    },
    isLoading ? '...' : children
  );
}

// Reusable Premium Input Component
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  label?: string;
}

export function Input({
  error = false,
  label,
  className = '',
  id,
  ...props
}: InputProps) {
  const inputId = id || 'input-' + Math.random().toString(36).substring(2, 9);
  const baseInputClass = `w-full px-ch-4 py-3 text-sm rounded-[16px] bg-glorify-bg-secondary/60 border border-glorify-border-primary/10 text-glorify-text-primary placeholder:text-glorify-text-muted/60 outline-none focus:border-glorify-accent/40 focus-ring transition-all ${
    error
      ? 'border-glorify-error focus:border-glorify-error'
      : 'border-glorify-border-primary/10 focus:border-glorify-accent/40'
  } ${className}`.trim();

  const inputEl = React.createElement('input', {
    id: inputId,
    className: baseInputClass,
    ...props,
  });

  if (label) {
    return React.createElement(
      'div',
      { className: 'w-full flex flex-col gap-ch-2' },
      React.createElement(
        'label',
        {
          htmlFor: inputId,
          className: 'text-xs font-mono text-glorify-ink-600 dark:text-glorify-platinum-600',
        },
        label
      ),
      inputEl
    );
  }

  return inputEl;
}
