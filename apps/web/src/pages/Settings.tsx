import React from 'react';
import { Settings as SetIcon, Key, Shield, Download } from 'lucide-react';
import { Button, Input } from '@chotify/ui';

export function Settings() {
  const handleExportData = () => {
    const data = {
      username: 'user_dev',
      email: 'dev@chotify.com',
      theme: 'carbon',
      likedTracks: [],
      synthesisHistory: [],
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'chotify-profile-export.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return React.createElement(
    'div',
    { className: 'flex flex-col gap-ch-8' },
    React.createElement(
      'div',
      { className: 'flex flex-col gap-ch-2' },
      React.createElement(
        'h1',
        { className: 'text-2xl lg:text-3xl font-bold tracking-tight' },
        'SETTINGS CONSOLE'
      ),
      React.createElement(
        'p',
        { className: 'text-sm text-chotify-text-secondary font-mono uppercase tracking-wider' },
        'Manage credentials, layout keys, and account parameters'
      )
    ),
    React.createElement(
      'div',
      { className: 'grid grid-cols-1 lg:grid-cols-2 gap-ch-6' },
      // API credentials registry
      React.createElement(
        'div',
        {
          className:
            'p-ch-6 rounded-ch-lg bg-chotify-bg-surface border border-chotify-border-primary flex flex-col gap-ch-6',
        },
        React.createElement(
          'div',
          { className: 'flex items-center gap-ch-2 border-b border-chotify-border-secondary pb-ch-3' },
          React.createElement(Key, { className: 'w-ch-4 h-ch-4 text-chotify-aura-gold' }),
          React.createElement(
            'span',
            { className: 'text-xs font-mono font-bold tracking-widest' },
            '[ PROVDER_API_CREDS ]'
          )
        ),
        React.createElement(Input, {
          label: 'SUNO STUDIO KEY',
          type: 'password',
          placeholder: 'Enter Suno API key secret...',
        }),
        React.createElement(Input, {
          label: 'UDIO CLIENT SECRET',
          type: 'password',
          placeholder: 'Enter Udio integration client key...',
        }),
        React.createElement(
          'div',
          { className: 'flex justify-end pt-ch-2' },
          React.createElement(Button, { variant: 'secondary' }, 'Validate & Save Credentials')
        )
      ),
      // Privacy & GDPR settings
      React.createElement(
        'div',
        {
          className:
            'p-ch-6 rounded-ch-lg bg-chotify-bg-surface border border-chotify-border-primary flex flex-col justify-between gap-ch-6',
        },
        React.createElement(
          'div',
          { className: 'flex flex-col gap-ch-4' },
          React.createElement(
            'div',
            { className: 'flex items-center gap-ch-2 border-b border-chotify-border-secondary pb-ch-3' },
            React.createElement(Shield, { className: 'w-ch-4 h-ch-4 text-chotify-text-muted' }),
            React.createElement(
              'span',
              { className: 'text-xs font-mono font-bold tracking-widest' },
              '[ DATA_PRIVACY_GDPR ]'
            )
          ),
          React.createElement(
            'p',
            { className: 'text-xs text-chotify-text-secondary leading-relaxed' },
            'In accordance with global compliance regulations (GDPR / CCPA), you possess the right to export your account data or request immediate deletion from Chotify databases.'
          )
        ),
        React.createElement(
          'div',
          { className: 'flex flex-col gap-ch-3 border-t border-chotify-border-secondary pt-ch-4' },
          React.createElement(
            Button,
            { onClick: handleExportData, className: 'flex items-center justify-center gap-ch-2' },
            React.createElement(Download, { className: 'w-ch-4 h-ch-4' }),
            'EXPORT PROFILE DATA (.JSON)'
          ),
          React.createElement(
            Button,
            { variant: 'secondary', className: 'text-chotify-error hover:bg-chotify-error/10 hover:border-chotify-error' },
            'PURGE MY PROFILE (DELETE)'
          )
        )
      )
    )
  );
}
