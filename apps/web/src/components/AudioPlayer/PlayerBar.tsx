import React from 'react';
import { usePlayerStore } from '../../store/playerStore.js';
import { formatDuration } from '@chotify/utils';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Shuffle, Repeat, Maximize2, Heart } from 'lucide-react';

export function PlayerBar() {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    repeatMode,
    isShuffle,
    togglePlay,
    seek,
    setVolume,
    toggleMute,
    setRepeatMode,
    toggleShuffle,
    skipNext,
    skipPrevious,
    setPlayerExpanded,
  } = usePlayerStore();

  if (!currentTrack) return null;

  const handleScrubChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    seek(parseFloat(e.target.value));
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value));
  };

  const cycleRepeatMode = () => {
    if (repeatMode === 'none') setRepeatMode('all');
    else if (repeatMode === 'all') setRepeatMode('one');
    else setRepeatMode('none');
  };

  return React.createElement(
    'div',
    {
      className:
        'w-full bg-chotify-bg-surface/95 backdrop-blur-md border-t border-chotify-border-primary p-ch-4 flex flex-col md:flex-row items-center gap-ch-4 justify-between z-10 transition-colors duration-200',
    },
    // Left side: Track Info
    React.createElement(
      'div',
      { className: 'w-full md:w-auto flex items-center justify-between md:justify-start gap-ch-3' },
      React.createElement(
        'div',
        { className: 'flex items-center gap-ch-3' },
        currentTrack.coverImage
          ? React.createElement('img', {
              src: currentTrack.coverImage,
              alt: currentTrack.title,
              className:
                'w-11 h-11 rounded-ch-sm object-cover border border-chotify-border-secondary',
            })
          : React.createElement(
              'div',
              {
                className:
                  'w-11 h-11 rounded-ch-sm bg-chotify-bg-secondary border border-chotify-border-secondary flex items-center justify-center font-mono text-[10px] font-bold text-chotify-text-muted',
              },
              '[SYNTH]'
            ),
        React.createElement(
          'div',
          null,
          React.createElement(
            'div',
            { className: 'text-xs font-semibold text-chotify-text-primary' },
            currentTrack.title
          ),
          React.createElement(
            'div',
            { className: 'text-[10px] text-chotify-text-muted font-mono uppercase tracking-wider' },
            currentTrack.artist
          )
        )
      ),
      // Track metadata interactions
      React.createElement(
        'div',
        { className: 'flex items-center gap-ch-2' },
        React.createElement(
          'button',
          {
            className:
              'p-ch-2 rounded-full text-chotify-text-secondary hover:text-chotify-aura-gold hover:bg-chotify-bg-secondary transition-colors cursor-pointer outline-none focus-ring',
            'aria-label': 'Like this track',
          },
          React.createElement(Heart, { className: 'w-ch-4 h-ch-4' })
        )
      )
    ),
    // Center side: Timeline and controls
    React.createElement(
      'div',
      { className: 'flex-1 max-w-xl w-full flex flex-col items-center gap-ch-2' },
      // Playback Buttons Row
      React.createElement(
        'div',
        { className: 'flex items-center gap-ch-6' },
        // Shuffle Mode
        React.createElement(
          'button',
          {
            onClick: toggleShuffle,
            className: `p-ch-2 rounded-full cursor-pointer outline-none focus-ring relative transition-colors ${
              isShuffle ? 'text-chotify-aura-gold' : 'text-chotify-text-muted hover:text-chotify-text-primary'
            }`,
            'aria-label': 'Toggle shuffle',
          },
          React.createElement(Shuffle, { className: 'w-ch-4 h-ch-4' }),
          isShuffle &&
            React.createElement('span', {
              className: 'absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-chotify-aura-gold',
            })
        ),
        // Previous track
        React.createElement(
          'button',
          {
            onClick: skipPrevious,
            className:
              'p-ch-2 rounded-full text-chotify-text-secondary hover:text-chotify-text-primary cursor-pointer outline-none focus-ring active:scale-90 transition-transform',
            'aria-label': 'Previous track',
          },
          React.createElement(SkipBack, { className: 'w-ch-4 h-ch-4' })
        ),
        // Play / Pause Circle
        React.createElement(
          'button',
          {
            onClick: togglePlay,
            className:
              'w-9 h-9 rounded-full bg-chotify-text-primary text-chotify-bg-primary border border-chotify-border-primary flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer outline-none focus-ring',
            'aria-label': isPlaying ? 'Pause' : 'Play',
          },
          isPlaying
            ? React.createElement(Pause, { className: 'w-ch-3 h-ch-3 fill-currentColor' })
            : React.createElement(Play, { className: 'w-ch-3 h-ch-3 fill-currentColor pl-0.5' })
        ),
        // Next track
        React.createElement(
          'button',
          {
            onClick: skipNext,
            className:
              'p-ch-2 rounded-full text-chotify-text-secondary hover:text-chotify-text-primary cursor-pointer outline-none focus-ring active:scale-90 transition-transform',
            'aria-label': 'Next track',
          },
          React.createElement(SkipForward, { className: 'w-ch-4 h-ch-4' })
        ),
        // Repeat Mode
        React.createElement(
          'button',
          {
            onClick: cycleRepeatMode,
            className: `p-ch-2 rounded-full cursor-pointer outline-none focus-ring relative transition-colors ${
              repeatMode !== 'none' ? 'text-chotify-aura-gold' : 'text-chotify-text-muted hover:text-chotify-text-primary'
            }`,
            'aria-label': `Repeat mode: ${repeatMode}`,
          },
          React.createElement(Repeat, { className: 'w-ch-4 h-ch-4' }),
          repeatMode !== 'none' &&
            React.createElement(
              'span',
              {
                className: 'absolute bottom-1 left-1/2 -translate-x-1/2 text-[8px] font-mono font-bold leading-none',
              },
              repeatMode === 'one' ? '1' : '•'
            )
        )
      ),
      // Scrubber Track Row
      React.createElement(
        'div',
        { className: 'w-full flex items-center gap-ch-3 text-[10px] font-mono text-chotify-text-muted' },
        React.createElement('span', null, formatDuration(currentTime)),
        React.createElement('input', {
          type: 'range',
          min: 0,
          max: duration || 100,
          value: currentTime,
          onChange: handleScrubChange,
          className:
            'w-full h-1 bg-chotify-border-primary hover:bg-chotify-border-primary/80 rounded-full appearance-none cursor-pointer accent-chotify-aura-gold outline-none',
          'aria-label': 'Playback progress scrubber',
        }),
        React.createElement('span', null, formatDuration(duration))
      )
    ),
    // Right side: Volume and Expand UI
    React.createElement(
      'div',
      { className: 'w-full md:w-auto flex items-center justify-between md:justify-end gap-ch-4' },
      React.createElement(
        'div',
        { className: 'flex items-center gap-ch-2 text-chotify-text-secondary' },
        React.createElement(
          'button',
          {
            onClick: toggleMute,
            className: 'p-ch-1 rounded-ch-sm hover:bg-chotify-bg-secondary cursor-pointer outline-none focus-ring',
            'aria-label': isMuted ? 'Unmute' : 'Mute',
          },
          isMuted
            ? React.createElement(VolumeX, { className: 'w-ch-4 h-ch-4 text-chotify-error' })
            : React.createElement(Volume2, { className: 'w-ch-4 h-ch-4' })
        ),
        React.createElement('input', {
          type: 'range',
          min: 0,
          max: 1,
          step: 0.05,
          value: isMuted ? 0 : volume,
          onChange: handleVolumeChange,
          className: 'w-20 h-1 bg-chotify-border-primary rounded-full appearance-none cursor-pointer accent-chotify-aura-gold outline-none',
          'aria-label': 'Volume control',
        })
      ),
      // Maximize to fullscreen overlay
      React.createElement(
        'button',
        {
          onClick: () => setPlayerExpanded(true),
          className:
            'p-ch-2 rounded-full text-chotify-text-secondary hover:text-chotify-text-primary hover:bg-chotify-bg-secondary cursor-pointer outline-none focus-ring',
          'aria-label': 'Expand full-screen player',
        },
        React.createElement(Maximize2, { className: 'w-ch-4 h-ch-4' })
      )
    )
  );
}
