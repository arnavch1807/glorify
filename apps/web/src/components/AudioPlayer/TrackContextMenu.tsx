import React, { useState, useEffect, useRef } from 'react';
import { Track } from '@chotify/types';
import { usePlayerStore } from '../../store/playerStore.js';
import { StaticMusicRepository } from '../../repositories/musicRepository.js';
import { Play, ListPlus, Heart, Info, Disc, Users, Plus } from 'lucide-react';

interface TrackContextMenuProps {
  track: Track;
  x: number;
  y: number;
  onClose: () => void;
  onGoToAlbum?: (id: string) => void;
  onGoToArtist?: (id: string) => void;
}

export function TrackContextMenu({
  track,
  x,
  y,
  onClose,
  onGoToAlbum,
  onGoToArtist,
}: TrackContextMenuProps) {
  const {
    playlists,
    favoritedTrackIds,
    playTrack,
    playNext,
    playLast,
    addTrackToPlaylist,
    toggleFavoriteTrack,
  } = usePlayerStore();

  const [showPlaylistSubmenu, setShowPlaylistSubmenu] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isFavorited = favoritedTrackIds.includes(track.id);

  // Close context menu on click outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [onClose]);

  const handlePlay = () => {
    playTrack(track);
    onClose();
  };

  const handlePlayNext = () => {
    playNext(track);
    onClose();
  };

  const handlePlayLast = () => {
    playLast(track);
    onClose();
  };

  const handleAddPlaylist = (playlistId: string) => {
    addTrackToPlaylist(playlistId, track);
    onClose();
  };

  const handleFavorite = () => {
    toggleFavoriteTrack(track.id);
    onClose();
  };

  const handleGoToAlbum = async () => {
    if (onGoToAlbum && track.album) {
      const albums = await StaticMusicRepository.getAlbums();
      const album = albums.find((al) => al.title === track.album);
      if (album) {
        onGoToAlbum(album.id);
      }
    }
    onClose();
  };

  const handleGoToArtist = async () => {
    if (onGoToArtist) {
      const artists = await StaticMusicRepository.getArtists();
      const artist = artists.find((ar) => ar.name === track.artist);
      if (artist) {
        onGoToArtist(artist.id);
      }
    }
    onClose();
  };

  return React.createElement(
    'div',
    null,
    // Backdrop focus reset wrapper
    React.createElement(
      'div',
      {
        ref: menuRef,
        style: { top: y, left: x },
        className:
          'fixed z-50 min-w-44 bg-chotify-bg-surface border border-chotify-border-primary rounded-ch-md shadow-lg py-ch-1 flex flex-col text-xs font-sans select-none',
      },
      React.createElement(
        'button',
        {
          onClick: handlePlay,
          className:
            'w-full text-left px-ch-4 py-ch-2 hover:bg-chotify-bg-secondary text-chotify-text-primary flex items-center gap-ch-2.5 cursor-pointer outline-none',
        },
        React.createElement(Play, { className: 'w-ch-3.5 h-ch-3.5 text-chotify-text-muted' }),
        'Play Now'
      ),
      React.createElement(
        'button',
        {
          onClick: handlePlayNext,
          className:
            'w-full text-left px-ch-4 py-ch-2 hover:bg-chotify-bg-secondary text-chotify-text-primary flex items-center gap-ch-2.5 cursor-pointer outline-none',
        },
        React.createElement(ListPlus, { className: 'w-ch-3.5 h-ch-3.5 text-chotify-text-muted' }),
        'Play Next'
      ),
      React.createElement(
        'button',
        {
          onClick: handlePlayLast,
          className:
            'w-full text-left px-ch-4 py-ch-2 hover:bg-chotify-bg-secondary text-chotify-text-primary flex items-center gap-ch-2.5 cursor-pointer outline-none',
        },
        React.createElement(Plus, { className: 'w-ch-3.5 h-ch-3.5 text-chotify-text-muted' }),
        'Add to Queue'
      ),
      // Add to playlist submenu trigger
      React.createElement(
        'div',
        {
          onMouseEnter: () => setShowPlaylistSubmenu(true),
          onMouseLeave: () => setShowPlaylistSubmenu(false),
          className: 'relative',
        },
        React.createElement(
          'button',
          {
            className:
              'w-full text-left px-ch-4 py-ch-2 hover:bg-chotify-bg-secondary text-chotify-text-primary flex items-center justify-between gap-ch-2.5 cursor-pointer outline-none',
          },
          React.createElement(
            'div',
            { className: 'flex items-center gap-ch-2.5' },
            React.createElement(ListPlus, { className: 'w-ch-3.5 h-ch-3.5 text-chotify-text-muted' }),
            React.createElement('span', null, 'Add to Playlist')
          ),
          React.createElement('span', { className: 'text-[9px] font-mono text-chotify-text-muted' }, '▶')
        ),
        // Submenu list of playlists
        showPlaylistSubmenu &&
          React.createElement(
            'div',
            {
              className:
                'absolute top-0 left-full ml-0.5 min-w-40 bg-chotify-bg-surface border border-chotify-border-primary rounded-ch-md shadow-lg py-ch-1 flex flex-col',
            },
            playlists.length === 0
              ? React.createElement(
                  'div',
                  { className: 'px-ch-4 py-ch-2 text-[10px] text-chotify-text-muted font-mono' },
                  'NO_PLAYLISTS_FOUND'
                )
              : playlists.map((p) =>
                  React.createElement(
                    'button',
                    {
                      key: p.id,
                      onClick: () => handleAddPlaylist(p.id),
                      className:
                        'w-full text-left px-ch-4 py-ch-2 hover:bg-chotify-bg-secondary text-chotify-text-primary truncate cursor-pointer outline-none',
                    },
                    p.name
                  )
                )
          )
      ),
      track.album &&
        React.createElement(
          'button',
          {
            onClick: handleGoToAlbum,
            className:
              'w-full text-left px-ch-4 py-ch-2 hover:bg-chotify-bg-secondary text-chotify-text-primary flex items-center gap-ch-2.5 cursor-pointer outline-none',
          },
          React.createElement(Disc, { className: 'w-ch-3.5 h-ch-3.5 text-chotify-text-muted' }),
          'Go to Album'
        ),
      React.createElement(
        'button',
        {
          onClick: handleGoToArtist,
          className:
            'w-full text-left px-ch-4 py-ch-2 hover:bg-chotify-bg-secondary text-chotify-text-primary flex items-center gap-ch-2.5 cursor-pointer outline-none',
        },
        React.createElement(Users, { className: 'w-ch-3.5 h-ch-3.5 text-chotify-text-muted' }),
        'Go to Artist'
      ),
      React.createElement(
        'button',
        {
          onClick: handleFavorite,
          className:
            'w-full text-left px-ch-4 py-ch-2 hover:bg-chotify-bg-secondary text-chotify-text-primary flex items-center gap-ch-2.5 cursor-pointer outline-none',
        },
        React.createElement(Heart, {
          className: `w-ch-3.5 h-ch-3.5 ${isFavorited ? 'text-chotify-error fill-currentColor' : 'text-chotify-text-muted'}`,
        }),
        isFavorited ? 'Remove Favorite' : 'Favorite'
      ),
      React.createElement(
        'button',
        {
          onClick: () => setShowDetailsModal(true),
          className:
            'w-full text-left px-ch-4 py-ch-2 hover:bg-chotify-bg-secondary text-chotify-text-primary flex items-center gap-ch-2.5 cursor-pointer outline-none border-t border-chotify-border-primary/50 mt-1',
        },
        React.createElement(Info, { className: 'w-ch-3.5 h-ch-3.5 text-chotify-text-muted' }),
        'Track Info'
      )
    ),
    // Details Metadata Modal Dialog
    showDetailsModal &&
      React.createElement(
        'div',
        { className: 'fixed inset-0 z-50 flex items-center justify-center p-ch-4 bg-[#0b0b0a]/70 backdrop-blur-xs' },
        React.createElement(
          'div',
          { className: 'bg-chotify-bg-surface border border-chotify-border-primary rounded-ch-lg p-ch-6 max-w-sm w-full flex flex-col gap-ch-4 text-left font-sans' },
          React.createElement('div', { className: 'text-xs font-mono text-chotify-aura-gold tracking-widest' }, '[ STEM_DETAILS_TELEMETRY ]'),
          React.createElement(
            'div',
            { className: 'flex flex-col gap-ch-1' },
            React.createElement('div', { className: 'text-xs text-chotify-text-muted' }, 'Track Title'),
            React.createElement('div', { className: 'text-sm font-semibold text-chotify-text-primary' }, track.title),
            React.createElement('div', { className: 'text-xs text-chotify-text-muted mt-ch-3' }, 'AI Prompts Metadata'),
            React.createElement(
              'div',
              { className: 'p-ch-3 bg-chotify-bg-secondary border border-chotify-border-secondary text-xs text-chotify-text-secondary leading-relaxed font-mono rounded-ch-sm' },
              track.prompt || 'No algorithmic generation prompt loaded for this standard catalog file.'
            )
          ),
          React.createElement(
            'button',
            {
              onClick: () => {
                setShowDetailsModal(false);
                onClose();
              },
              className: 'mt-ch-4 py-ch-2 bg-chotify-text-primary text-chotify-bg-primary rounded-ch-sm text-xs font-semibold hover:opacity-90 outline-none',
            },
            'Dismiss Log'
          )
        )
      )
  );
}
