import React from 'react';
import { Sparkles, Play, Sliders, Music } from 'lucide-react';
import { Button } from '@chotify/ui';

export function Studio() {
  return React.createElement(
    'div',
    { className: 'flex flex-col gap-ch-8' },
    React.createElement(
      'div',
      { className: 'flex flex-col gap-ch-2' },
      React.createElement(
        'h1',
        { className: 'text-2xl lg:text-3xl font-bold tracking-tight' },
        'AI STUDIO COMPOSER'
      ),
      React.createElement(
        'p',
        { className: 'text-sm text-chotify-text-secondary font-mono uppercase tracking-wider' },
        'Synthesize and render custom audio stems'
      )
    ),
    React.createElement(
      'div',
      { className: 'grid grid-cols-1 lg:grid-cols-3 gap-ch-6' },
      // Parameters Sidebar Panel
      React.createElement(
        'div',
        {
          className:
            'lg:col-span-1 p-ch-6 rounded-ch-lg bg-chotify-bg-surface border border-chotify-border-primary flex flex-col gap-ch-6',
        },
        React.createElement(
          'div',
          { className: 'flex items-center gap-ch-2 border-b border-chotify-border-secondary pb-ch-3' },
          React.createElement(Sliders, { className: 'w-ch-4 h-ch-4 text-chotify-text-muted' }),
          React.createElement(
            'span',
            { className: 'text-xs font-mono font-bold tracking-widest' },
            '[ SYNTH_PARAMETERS ]'
          )
        ),
        // Tempo Slider
        React.createElement(
          'div',
          { className: 'flex flex-col gap-ch-2' },
          React.createElement(
            'div',
            { className: 'flex items-center justify-between text-xs font-mono text-chotify-text-secondary' },
            React.createElement('span', null, 'TEMPO (BPM)'),
            React.createElement('span', { className: 'text-chotify-aura-gold' }, '72')
          ),
          React.createElement('input', {
            type: 'range',
            min: 60,
            max: 180,
            value: 72,
            readOnly: true,
            className: 'w-full accent-chotify-aura-gold bg-chotify-bg-secondary h-1.5 rounded-full cursor-pointer',
          })
        ),
        // Key selector (mock select indicator)
        React.createElement(
          'div',
          { className: 'flex flex-col gap-ch-2' },
          React.createElement(
            'label',
            { className: 'text-xs font-mono text-chotify-text-secondary' },
            'TONAL KEY'
          ),
          React.createElement(
            'div',
            {
              className:
                'w-full px-ch-4 py-ch-3 rounded-ch-md bg-chotify-bg-secondary border border-chotify-border-secondary text-sm text-chotify-text-primary flex items-center justify-between',
            },
            React.createElement('span', null, 'A (Major)'),
            React.createElement('span', { className: 'text-[10px] text-chotify-text-muted' }, 'SHARP/FLAT')
          )
        )
      ),
      // Compose prompt workspace console
      React.createElement(
        'div',
        {
          className:
            'lg:col-span-2 p-ch-6 rounded-ch-lg bg-chotify-bg-surface border border-chotify-border-primary flex flex-col justify-between gap-ch-6',
        },
        React.createElement(
          'div',
          { className: 'flex flex-col gap-ch-4' },
          React.createElement(
            'div',
            { className: 'flex items-center gap-ch-2 border-b border-chotify-border-secondary pb-ch-3' },
            React.createElement(Sparkles, { className: 'w-ch-4 h-ch-4 text-chotify-aura-gold' }),
            React.createElement(
              'span',
              { className: 'text-xs font-mono font-bold tracking-widest' },
              '[ COMPOSER_PROMPT_DESK ]'
            )
          ),
          React.createElement(
            'div',
            { className: 'flex flex-col gap-ch-2' },
            React.createElement(
              'label',
              { className: 'text-xs font-mono text-chotify-text-muted' },
              'INPUT COMPOSITION PROMPT'
            ),
            React.createElement('textarea', {
              placeholder: 'Describe your target composition (e.g. Ambient lofi, smooth guitar, space reverb)...',
              className:
                'w-full h-32 p-ch-4 rounded-ch-md bg-chotify-bg-secondary border border-chotify-border-secondary text-sm text-chotify-text-primary placeholder:text-chotify-text-muted outline-none resize-none focus:border-chotify-aura-gold transition-colors',
            })
          )
        ),
        React.createElement(
          'div',
          { className: 'flex justify-end border-t border-chotify-border-secondary pt-ch-4' },
          React.createElement(
            Button,
            { variant: 'ai', className: 'flex items-center gap-ch-2' },
            React.createElement(Play, { className: 'w-ch-3 h-ch-3 fill-currentColor pl-0.5' }),
            'START SYNTHESIS'
          )
        )
      )
    )
  );
}
