import React, { useState } from 'react';
import { Track } from '@chotify/types';
import { usePlayerStore } from '../../store/playerStore.js';
import { formatDuration } from '@chotify/utils';
import { Play, Pause, MoreHorizontal, Plus } from 'lucide-react';
import { TrackContextMenu } from '../AudioPlayer/TrackContextMenu.js';

interface TrackCardProps {
  track: Track;
  index: number;
  queueContext?: Track[];
  onGoToAlbum?: (id: string) => void;
  onGoToArtist?: (id: string) => void;
}

export function TrackCard({
  track,
  index,
  queueContext,
  onGoToAlbum,
  onGoToArtist,
}: TrackCardProps) {
  const { currentTrack, isPlaying, playTrack, togglePlay, addToQueue } = usePlayerStore();
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);

  const isCurrent = currentTrack?.id === track.id;

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isCurrent) {
      togglePlay();
    } else {
      playTrack(track, queueContext);
    }
  };

  const handleQueueClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToQueue(track);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  const handleOptionsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  return React.createElement(
    'div',
    {
      onDoubleClick: () => playTrack(track, queueContext),
      onContextMenu: handleContextMenu,
      className:
        'group flex items-center justify-between px-ch-4 py-ch-3 rounded-ch-md hover:bg-chotify-bg-secondary/40 transition-colors duration-200 cursor-default select-none border border-transparent focus-ring relative',
    },
    // Left section: index/indicator, title, metadata
    React.createElement(
      'div',
      { className: 'flex items-center gap-ch-4 flex-1 min-w-0' },
      React.createElement(
        'div',
        { className: 'w-ch-6 flex items-center justify-center' },
        React.createElement(
          'span',
          {
            className: `text-xs font-mono group-hover:hidden ${
              isCurrent ? 'text-chotify-aura-gold font-bold' : 'text-chotify-text-muted'
            }`,
          },
          String(index + 1).padStart(2, '0')
        ),
        React.createElement(
          'button',
          {
            onClick: handlePlayClick,
            className:
              'hidden group-hover:flex p-ch-1 rounded-full text-chotify-text-primary hover:text-chotify-aura-gold outline-none focus-ring cursor-pointer',
          },
          isCurrent && isPlaying
            ? React.createElement(Pause, { className: 'w-ch-3.5 h-ch-3.5 fill-currentColor' })
            : React.createElement(Play, { className: 'w-ch-3.5 h-ch-3.5 fill-currentColor pl-0.5' })
        )
      ),
      React.createElement(
        'div',
        { className: 'flex-1 min-w-0' },
        React.createElement(
          'div',
          {
            className: `text-xs font-semibold truncate ${
              isCurrent ? 'text-chotify-aura-gold' : 'text-chotify-text-primary'
            }`,
          },
          track.title
        ),
        React.createElement(
          'div',
          { className: 'text-[10px] text-chotify-text-muted font-mono uppercase tracking-wider mt-0.5' },
          track.artist
        )
      )
    ),
    // Middle section: Album (visible on tablet/desktop)
    track.album &&
      React.createElement(
        'div',
        { className: 'hidden md:block flex-1 text-xs text-chotify-text-secondary truncate px-ch-4' },
        track.album
      ),
    // Right section: duration & options
    React.createElement(
      'div',
      { className: 'flex items-center gap-ch-4 text-chotify-text-secondary' },
      React.createElement(
        'span',
        { className: 'text-[10px] font-mono text-chotify-text-muted' },
        formatDuration(track.duration)
      ),
      React.createElement(
        'div',
        { className: 'flex items-center gap-ch-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200' },
        React.createElement(
          'button',
          {
            onClick: handleQueueClick,
            className: 'p-ch-1 rounded-ch-sm hover:bg-chotify-bg-secondary hover:text-chotify-text-primary cursor-pointer outline-none focus-ring',
            title: 'Add to queue',
          },
          React.createElement(Plus, { className: 'w-ch-3.5 h-ch-3.5' })
        ),
        React.createElement(
          'button',
          {
            onClick: handleOptionsClick,
            className: 'p-ch-1 rounded-ch-sm hover:bg-chotify-bg-secondary hover:text-chotify-text-primary cursor-pointer outline-none focus-ring',
            'aria-label': 'More options',
          },
          React.createElement(MoreHorizontal, { className: 'w-ch-3.5 h-ch-3.5' })
        )
      )
    ),
    // Render absolute context menu
    contextMenu &&
      React.createElement(TrackContextMenu, {
        track: track,
        x: contextMenu.x,
        y: contextMenu.y,
        onClose: () => setContextMenu(null),
        onGoToAlbum: onGoToAlbum,
        onGoToArtist: onGoToArtist,
      })
  );
}
