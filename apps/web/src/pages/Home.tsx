import React from 'react';
import { Sparkles, Play, Terminal, ChevronRight, Cpu } from 'lucide-react';
import { Button } from '@chotify/ui';
import { usePlayerStore } from '../store/playerStore.js';

export function Home() {
  const { playTrack } = usePlayerStore();

  const handlePlaySample = () => {
    playTrack({
      id: 'sample_01',
      title: 'SoundHelix Song 1 (Lofi Remix)',
      artist: 'SoundHelix Composer',
      album: 'Helix Test Stems',
      genre: 'lofi',
      duration: 372,
      audioUrl: '/sample.mp3', // points to public/sample.mp3
      isGenerated: true,
      prompt: 'Lofi piano keys with ambient record static clicks and warm sub-bass loops'
    }, [
      {
        id: 'sample_01',
        title: 'SoundHelix Song 1 (Lofi Remix)',
        artist: 'SoundHelix Composer',
        album: 'Helix Test Stems',
        genre: 'lofi',
        duration: 372,
        audioUrl: '/sample.mp3',
        isGenerated: true,
        prompt: 'Lofi piano keys with ambient record static clicks and warm sub-bass loops'
      },
      {
        id: 'sample_02',
        title: 'SoundHelix Song 2 (Ambient Drift)',
        artist: 'SoundHelix Composer',
        album: 'Helix Stems',
        genre: 'ambient',
        duration: 423,
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
        isGenerated: true,
        prompt: 'Washed out ambient pads, slow granular cloud textures'
      }
    ]);
  };

  const providers = [
    { name: 'Suno API', status: 'NOT_CONNECTED' },
    { name: 'Udio API', status: 'NOT_CONNECTED' },
    { name: 'Gemini AI', status: 'NOT_CONNECTED' },
    { name: 'OpenAI Studio', status: 'NOT_CONNECTED' },
  ];

  return React.createElement(
    'div',
    { className: 'flex flex-col gap-ch-8' },
    // Hero Title Block
    React.createElement(
      'div',
      { className: 'flex flex-col gap-ch-2' },
      React.createElement(
        'h1',
        { className: 'text-2xl lg:text-3xl font-bold tracking-tight' },
        'AURA WORKSPACE'
      ),
      React.createElement(
        'p',
        { className: 'text-sm text-chotify-text-secondary font-mono uppercase tracking-wider' },
        'AI-Native Music Composition Suite'
      )
    ),
    // Two Column layout
    React.createElement(
      'div',
      { className: 'grid grid-cols-1 lg:grid-cols-3 gap-ch-6' },
      // Column 1 & 2: Sandbox Composer Console
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
            { className: 'flex items-center gap-ch-3 border-b border-chotify-border-secondary pb-ch-3' },
            React.createElement(Sparkles, { className: 'w-ch-4 h-ch-4 text-chotify-aura-gold' }),
            React.createElement(
              'span',
              { className: 'text-xs font-mono font-bold tracking-widest text-chotify-text-primary' },
              '[ COMPOSE_CONSOLE_SANDBOX ]'
            )
          ),
          React.createElement(
            'div',
            { className: 'flex flex-col gap-ch-2' },
            React.createElement(
              'label',
              { className: 'text-xs font-mono text-chotify-text-muted' },
              'COMPOSITION PROMPT'
            ),
            React.createElement('textarea', {
              readOnly: true,
              value: 'A warm acoustic guitar progression with desert sand textures, low-frequency sub-bass hum, and slow lo-fi keys...',
              className:
                'w-full h-24 p-ch-4 rounded-ch-md bg-chotify-bg-secondary border border-chotify-border-secondary text-sm text-chotify-text-secondary outline-none resize-none font-sans',
            })
          ),
          // Parameters metadata row
          React.createElement(
            'div',
            { className: 'grid grid-cols-2 md:grid-cols-4 gap-ch-4 pt-ch-2' },
            [
              { label: 'TEMPO', val: '72 BPM' },
              { label: 'KEY', val: 'A MINOR' },
              { label: 'SCALE', val: 'PHRYGIAN' },
              { label: 'DURATION', val: '120s' },
            ].map((param) =>
              React.createElement(
                'div',
                {
                  key: param.label,
                  className:
                    'p-ch-3 rounded-ch-sm bg-chotify-bg-secondary/40 border border-chotify-border-primary text-center',
                },
                React.createElement(
                  'div',
                  { className: 'text-[9px] font-mono text-chotify-text-muted mb-0.5' },
                  param.label
                ),
                React.createElement(
                  'div',
                  { className: 'text-xs font-mono font-bold text-chotify-text-primary' },
                  param.val
                )
              )
            )
          )
        ),
        React.createElement(
          'div',
          { className: 'flex justify-end border-t border-chotify-border-secondary pt-ch-4' },
          React.createElement(
            Button,
            { onClick: handlePlaySample, variant: 'ai', className: 'flex items-center gap-ch-2' },
            React.createElement(Play, { className: 'w-ch-3 h-ch-3 fill-currentColor pl-0.5' }),
            'RUN SYNTHESIS & PLAY'
          )
        )
      ),
      // Column 3: Providers keys connection statuses
      React.createElement(
        'div',
        { className: 'flex flex-col gap-ch-6' },
        // Command palette shortcut hint card
        React.createElement(
          'div',
          {
            className:
              'p-ch-4 rounded-ch-lg bg-chotify-bg-surface border border-chotify-border-primary flex flex-col gap-ch-2',
          },
          React.createElement(
            'div',
            { className: 'text-xs font-mono text-chotify-text-muted tracking-widest' },
            'WORKSPACE CMD SHORTCUT'
          ),
          React.createElement(
            'div',
            { className: 'text-sm font-semibold flex items-center justify-between' },
            React.createElement('span', null, 'Open Commands'),
            React.createElement(
              'kbd',
              {
                className:
                  'px-2 py-1 rounded-sm bg-chotify-bg-secondary text-[10px] font-mono border border-chotify-border-secondary text-chotify-text-primary',
              },
              'Ctrl + K'
            )
          )
        ),
        // Keys panel
        React.createElement(
          'div',
          {
            className:
              'p-ch-6 rounded-ch-lg bg-chotify-bg-surface border border-chotify-border-primary flex flex-col gap-ch-4',
          },
          React.createElement(
            'div',
            { className: 'flex items-center gap-ch-2' },
            React.createElement(Cpu, { className: 'w-ch-4 h-ch-4 text-chotify-text-muted' }),
            React.createElement(
              'h2',
              { className: 'text-xs font-mono font-bold tracking-widest' },
              '[ KEY_REGISTRY ]'
            )
          ),
          React.createElement(
            'div',
            { className: 'flex flex-col gap-ch-3' },
            providers.map((p) =>
              React.createElement(
                'div',
                {
                  key: p.name,
                  className:
                    'flex items-center justify-between p-ch-3 rounded-ch-sm bg-chotify-bg-secondary/40 border border-chotify-border-secondary',
                },
                React.createElement(
                  'span',
                  { className: 'text-xs font-medium text-chotify-text-secondary' },
                  p.name
                ),
                React.createElement(
                  'span',
                  { className: 'text-[9px] font-mono font-bold text-chotify-aura-gold' },
                  p.status
                )
              )
            )
          )
        )
      )
    )
  );
}
