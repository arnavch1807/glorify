import React, { useMemo } from 'react';
import { usePlayerStore } from '../../store/playerStore.js';
import { formatDuration } from '@chotify/utils';
import { 
  Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Shuffle, 
  Repeat, Heart, ListMusic, FileText, Smartphone, Settings, Maximize2 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function PlayerBar({ isCollapsed = false, isDesktop = true }: { isCollapsed?: boolean; isDesktop?: boolean }) {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    repeatMode,
    isShuffle,
    favoritedTrackIds,
    togglePlay,
    seek,
    setVolume,
    toggleMute,
    setRepeatMode,
    toggleShuffle,
    skipNext,
    skipPrevious,
    setFullscreen,
    setActivePlayerTab,
    toggleFavoriteTrack,
    downloadedTrackIds
  } = usePlayerStore();

  if (!currentTrack) return null;

  const isLiked = favoritedTrackIds.includes(currentTrack.id);
  const isDownloaded = downloadedTrackIds.includes(currentTrack.id);
  const bufferedPercent = isDownloaded ? 100 : duration ? Math.min(100, ((currentTime + (duration * 0.15)) / duration) * 100) : 0;

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

  const handleBarClick = () => {
    setActivePlayerTab('playback');
    setFullscreen(true);
  };

  const handleQuickTabClick = (e: React.MouseEvent, tab: 'lyrics' | 'queue' | 'settings') => {
    e.stopPropagation();
    setActivePlayerTab(tab);
    setFullscreen(true);
  };

  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const progressPercent = duration ? (currentTime / duration) * 100 : 0;
  const volumePercent = isMuted ? 0 : volume * 100;

  return React.createElement(
    motion.div,
    {
      layoutId: 'player-bar-container',
      onClick: handleBarClick,
      style: isDesktop ? {
        background: 'var(--glorify-player-bg)',
      } : {
        left: '16px',
        right: '16px',
        bottom: '76px',
        background: 'var(--glorify-player-bg)',
        border: '1px solid var(--glorify-player-border)',
      },
      className: isDesktop
        ? 'w-full h-full flex items-center justify-between px-6 relative cursor-pointer select-none overflow-hidden backdrop-blur-xl border-t border-glorify-border-primary/5'
        : 'fixed h-[100px] flex items-center justify-between z-30 transition-all duration-500 rounded-[22px] cursor-pointer select-none overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.12)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.4)] border border-glorify-border-primary/10 backdrop-blur-xl hover:shadow-[0_16px_48px_rgba(0,0,0,0.18)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99]',
    },
    // Dynamic blurred album artwork colors backdrop
    currentTrack.coverImage &&
      React.createElement('div', {
        className: 'absolute inset-0 -z-10 pointer-events-none transition-all duration-1000 blur-[60px] saturate-[1.6] opacity-[0.38]',
        style: {
          backgroundImage: `url(${currentTrack.coverImage})`,
          backgroundSize: '150% 150%',
          backgroundPosition: 'center',
        }
      }),

    // Left: Rotating Artwork + Track Info + Like
    React.createElement(
      'div',
      { className: 'flex items-center gap-ch-4 w-1/3 min-w-0 pl-ch-6 relative z-10' },
      currentTrack.coverImage
        ? React.createElement(motion.img, {
            src: currentTrack.coverImage,
            alt: currentTrack.title,
            layoutId: 'player-artwork',
            className: `w-12 h-12 rounded-full object-cover border border-glorify-border-secondary/20 flex-shrink-0 shadow-lg animate-rotate-art ${
              isPlaying ? '' : 'animation-paused'
            } ${isPlaying ? 'album-pulse-playing' : ''}`,
          })
        : React.createElement(
            'div',
            {
              className: `w-12 h-12 rounded-full bg-glorify-bg-secondary border border-glorify-border-secondary/20 flex items-center justify-center font-mono text-[9px] font-bold text-glorify-text-muted flex-shrink-0 shadow-lg animate-rotate-art ${
                isPlaying ? '' : 'animation-paused'
              }`,
            },
            'TRACK'
          ),
      React.createElement(
        'div',
        { className: 'flex-1 min-w-0 h-10 flex flex-col justify-center overflow-hidden relative' },
        React.createElement(
          AnimatePresence,
          { mode: 'wait' },
          React.createElement(
            motion.div,
            {
              key: currentTrack.id,
              initial: { opacity: 0, y: 4 },
              animate: { opacity: 1, y: 0 },
              exit: { opacity: 0, y: -4 },
              transition: { duration: 0.15, ease: 'easeOut' },
              className: 'flex flex-col min-w-0'
            },
            React.createElement(
              'span',
              { className: 'text-sm font-semibold text-glorify-text-primary truncate' },
              currentTrack.title
            ),
            React.createElement(
              'span',
              { className: 'text-xs text-glorify-text-muted truncate mt-0.5 font-normal' },
              currentTrack.artist
            )
          )
        )
      ),
      React.createElement(
        motion.button,
        {
          whileHover: { scale: 1.15 },
          whileTap: { scale: 0.9 },
          onClick: (e: any) => {
            stopPropagation(e);
            toggleFavoriteTrack(currentTrack.id);
          },
          className: `p-2 rounded-full hover:bg-glorify-bg-secondary/60 outline-none focus-ring cursor-pointer transition-colors flex-shrink-0 ${
            isLiked ? 'text-glorify-accent' : 'text-glorify-text-muted hover:text-glorify-copper'
          }`,
          'aria-label': 'Like this track',
        },
        React.createElement(Heart, { 
          className: 'w-ch-4.5 h-ch-4.5',
          fill: isLiked ? 'currentColor' : 'none' 
        })
      )
    ),

    // Center: Playback controls + Scrubber progress bar
    React.createElement(
      'div',
      { 
        onClick: stopPropagation,
        className: 'flex-1 max-w-xl flex flex-col items-center gap-ch-2 px-ch-4 relative z-10' 
      },
      // Buttons Row
      React.createElement(
        'div',
        { className: 'flex items-center gap-ch-5' },
        
        // Shuffle Button
        React.createElement(
          motion.button,
          {
            whileHover: { scale: 1.15 },
            onClick: toggleShuffle,
            className: `p-1.5 rounded-full cursor-pointer outline-none focus-ring relative transition-colors ${
              isShuffle ? 'text-glorify-accent' : 'text-glorify-text-muted hover:text-glorify-copper'
            }`,
            'aria-label': 'Toggle shuffle',
          },
          React.createElement(Shuffle, { className: 'w-ch-4 h-ch-4' }),
          isShuffle &&
            React.createElement('span', {
              className: 'absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-glorify-accent',
            })
        ),
        
        // Previous Button
        React.createElement(
          motion.button,
          {
            whileHover: { scale: 1.15 },
            whileTap: { scale: 0.85 },
            onClick: skipPrevious,
            className:
              'p-1.5 rounded-full text-glorify-text-secondary hover:text-glorify-copper cursor-pointer outline-none focus-ring transition-colors',
            'aria-label': 'Previous track',
          },
          React.createElement(SkipBack, { className: 'w-ch-4.5 h-ch-4.5' })
        ),
        
        // Play / Pause Circle
        React.createElement(
          motion.button,
          {
            whileHover: { scale: 1.08 },
            whileTap: { scale: 0.92 },
            onClick: togglePlay,
            className:
              'w-11 h-11 rounded-full bg-glorify-text-primary text-glorify-bg-primary flex items-center justify-center cursor-pointer outline-none focus-ring shadow-md hover:bg-glorify-copper hover:text-white transition-all',
            'aria-label': isPlaying ? 'Pause' : 'Play',
          },
          isPlaying
            ? React.createElement(Pause, { className: 'w-ch-4.5 h-ch-4.5 fill-currentColor' })
            : React.createElement(Play, { className: 'w-ch-4.5 h-ch-4.5 fill-currentColor pl-0.5' })
        ),
        
        // Next Button
        React.createElement(
          motion.button,
          {
            whileHover: { scale: 1.15 },
            whileTap: { scale: 0.85 },
            onClick: skipNext,
            className:
              'p-1.5 rounded-full text-glorify-text-secondary hover:text-glorify-copper cursor-pointer outline-none focus-ring transition-colors',
            'aria-label': 'Next track',
          },
          React.createElement(SkipForward, { className: 'w-ch-4.5 h-ch-4.5' })
        ),
        
        // Repeat Button
        React.createElement(
          motion.button,
          {
            whileHover: { scale: 1.15 },
            onClick: cycleRepeatMode,
            className: `p-1.5 rounded-full cursor-pointer outline-none focus-ring relative transition-colors ${
              repeatMode !== 'none' ? 'text-glorify-accent' : 'text-glorify-text-muted hover:text-glorify-copper'
            }`,
            'aria-label': `Repeat mode: ${repeatMode}`,
          },
          React.createElement(Repeat, { className: 'w-ch-4.5 h-ch-4.5' }),
          repeatMode !== 'none' &&
            React.createElement(
              'span',
              {
                className: 'absolute bottom-0 left-1/2 -translate-x-1/2 text-[8px] font-semibold leading-none',
              },
              repeatMode === 'one' ? '1' : '•'
            )
        )
      ),

      React.createElement(
        'div',
        { className: 'w-full flex items-center gap-ch-3 text-[10px] font-mono text-glorify-text-muted/80' },
        React.createElement('span', { className: 'w-8 text-right' }, formatDuration(currentTime)),
        React.createElement(
          'div',
          { className: 'relative w-full h-4 flex items-center group' },
          
          // Track Background
          React.createElement('div', { className: 'absolute left-0 right-0 h-1 rounded-full bg-white/10 dark:bg-white/5 pointer-events-none' }),
          
          // Buffered Track
          React.createElement('div', {
            style: { width: `${bufferedPercent}%` },
            className: 'absolute left-0 h-1 rounded-full bg-white/20 dark:bg-white/10 pointer-events-none'
          }),
          
          // Active Track
          React.createElement('div', {
            style: { width: `${progressPercent}%` },
            className: 'absolute left-0 h-1 rounded-full bg-glorify-accent pointer-events-none transition-all duration-[60ms]'
          }),
          
          // Seeker Slider Input (Draggable Seeker)
          React.createElement('input', {
            type: 'range',
            min: 0,
            max: duration || 100,
            value: currentTime,
            onChange: handleScrubChange,
            className: 'absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10',
            'aria-label': 'Playback progress scrubber',
          }),
          
          // Custom Thumb (Visible on Hover)
          React.createElement('div', {
            style: { left: `calc(${progressPercent}% - 6px)` },
            className: 'absolute w-3 h-3 rounded-full bg-glorify-accent border border-glorify-bg-surface shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none'
          })
        ),
        React.createElement('span', { className: 'w-8 text-left' }, formatDuration(duration))
      )
    ),

    // Right: Volume Slider + Quick Toggles
    React.createElement(
      'div',
      { 
        onClick: stopPropagation,
        className: 'flex items-center justify-end gap-ch-3 w-1/3 text-glorify-text-secondary pr-ch-6 relative z-10' 
      },
      
      // Quick access: Lyrics
      React.createElement(
        motion.button,
        {
          whileHover: { scale: 1.15 },
          onClick: (e: any) => handleQuickTabClick(e, 'lyrics'),
          className: 'p-1.5 rounded-full hover:bg-glorify-bg-secondary/60 text-glorify-text-muted hover:text-glorify-copper cursor-pointer outline-none focus-ring transition-colors',
          title: 'Lyrics',
        },
        React.createElement(FileText, { className: 'w-ch-4 h-ch-4' })
      ),
      
      // Quick access: Queue
      React.createElement(
        motion.button,
        {
          whileHover: { scale: 1.15 },
          onClick: (e: any) => handleQuickTabClick(e, 'queue'),
          className: 'p-1.5 rounded-full hover:bg-glorify-bg-secondary/60 text-glorify-text-muted hover:text-glorify-copper cursor-pointer outline-none focus-ring transition-colors',
          title: 'Queue',
        },
        React.createElement(ListMusic, { className: 'w-ch-4 h-ch-4' })
      ),

      // Quick access: Devices
      React.createElement(
        motion.button,
        {
          whileHover: { scale: 1.15 },
          onClick: (e: any) => handleQuickTabClick(e, 'settings'),
          className: 'p-1.5 rounded-full hover:bg-glorify-bg-secondary/60 text-glorify-text-muted hover:text-glorify-copper cursor-pointer outline-none focus-ring transition-colors',
          title: 'Devices',
        },
        React.createElement(Smartphone, { className: 'w-ch-4 h-ch-4' })
      ),

      // Volume control container
      React.createElement(
        motion.div,
        { 
          whileHover: { scale: 1.05 },
          className: 'flex items-center gap-ch-2 text-glorify-text-secondary mr-ch-1 transition-transform duration-200' 
        },
        React.createElement(
          motion.button,
          {
            whileTap: { scale: 0.95 },
            onClick: toggleMute,
            className: 'p-1.5 rounded-full hover:bg-glorify-bg-secondary/60 cursor-pointer outline-none focus-ring transition-colors',
            'aria-label': isMuted ? 'Unmute' : 'Mute',
          },
          isMuted
            ? React.createElement(VolumeX, { className: 'w-ch-4.5 h-ch-4.5 text-glorify-error' })
            : React.createElement(Volume2, { className: 'w-ch-4.5 h-ch-4.5' })
        ),
        React.createElement('input', {
          type: 'range',
          min: 0,
          max: 1,
          step: 0.02,
          value: isMuted ? 0 : volume,
          onChange: handleVolumeChange,
          style: {
            background: `linear-gradient(to right, var(--color-glorify-accent) 0%, var(--color-glorify-accent) ${volumePercent}%, var(--glorify-slider-bg) ${volumePercent}%, var(--glorify-slider-bg) 100%)`
          },
          className: 'premium-slider w-20 bg-white/10 rounded-full appearance-none outline-none transition-all glow-progress',
          'aria-label': 'Volume control',
        })
      ),

      // Quick access: Settings
      React.createElement(
        motion.button,
        {
          whileHover: { scale: 1.15 },
          onClick: (e: any) => handleQuickTabClick(e, 'settings'),
          className: 'p-1.5 rounded-full hover:bg-glorify-bg-secondary/60 text-glorify-text-muted hover:text-glorify-copper cursor-pointer outline-none focus-ring transition-colors',
          title: 'Playback Settings',
        },
        React.createElement(Settings, { className: 'w-ch-4.5 h-ch-4.5' })
      ),

      // Maximize to fullscreen overlay
      React.createElement(
        motion.button,
        {
          whileHover: { scale: 1.15 },
          whileTap: { scale: 0.95 },
          onClick: (e: any) => {
            stopPropagation(e);
            setActivePlayerTab('playback');
            setFullscreen(true);
          },
          className:
            'p-1.5 rounded-full hover:bg-glorify-bg-secondary/60 text-glorify-text-muted hover:text-glorify-copper cursor-pointer outline-none focus-ring transition-colors',
          'aria-label': 'Expand full-screen player',
          title: 'Fullscreen',
        },
        React.createElement(Maximize2, { className: 'w-ch-4.5 h-ch-4.5' })
      )
    )
  );
}
