import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Track } from '@chotify/types';
import { usePlayerStore } from '../../store/playerStore.js';
import { useToastStore } from '../../store/toastStore.js';
import { StaticMusicRepository } from '../../repositories/musicRepository.js';
import { MetadataEditorModal } from '../Library/MetadataEditorModal.js';
import { LyricsEditorModal } from '../Library/LyricsEditorModal.js';
import { AddToPlaylistModal } from '../Library/AddToPlaylistModal.js';
import { Play, ListPlus, Heart, Info, Disc, Users, Plus, Download, Share2, Pencil, AlignLeft } from 'lucide-react';

interface TrackContextMenuProps {
  track: Track;
  x: number;
  y: number;
  triggerRect?: DOMRect;
  onClose: () => void;
  onGoToAlbum?: (id: string) => void;
  onGoToArtist?: (id: string) => void;
}

export function TrackContextMenu({
  track,
  x,
  y,
  triggerRect,
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
    startDownloadTrack
  } = usePlayerStore();

  const [showPlaylistSubmenu, setShowPlaylistSubmenu] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showMetadataModal, setShowMetadataModal] = useState(false);
  const [showLyricsModal, setShowLyricsModal] = useState(false);
  const [showAddToPlaylistModal, setShowAddToPlaylistModal] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isFavorited = favoritedTrackIds.includes(track.id);

  const handleDownload = () => {
    startDownloadTrack(track);
    onClose();
  };

  const handleShare = () => {
    const shareText = `Check out "${track.title}" by ${track.artist} on Glorify! http://localhost:5173/album/${track.id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText);
    }
    useToastStore.getState().addToast('Share link copied to clipboard!', 'info');
    onClose();
  };

  const [adjustedCoords, setAdjustedCoords] = useState({ x, y });
  const [isPositioned, setIsPositioned] = useState(false);

  // Position detection and boundary checking
  useEffect(() => {
    if (menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      let nextX = x;
      let nextY = y;

      if (triggerRect) {
        // Place menu underneath triggerRect, aligned to triggerRect's right edge
        nextX = triggerRect.right - rect.width;
        nextY = triggerRect.bottom + 4;

        // If there isn't enough space below, open upward
        if (nextY + rect.height > viewportHeight) {
          nextY = triggerRect.top - rect.height - 4;
        }

        // If there isn't enough space on the right (too far left), align to trigger left
        if (nextX < 16) {
          nextX = triggerRect.left;
        }
      } else {
        // Fallback for right-click: position at cursor
        if (x + rect.width > viewportWidth) {
          nextX = viewportWidth - rect.width - 16;
        }
        if (y + rect.height > viewportHeight) {
          nextY = viewportHeight - rect.height - 16;
        }
      }
      
      // Prevent going off-screen (viewport safety margins)
      if (nextX + rect.width > viewportWidth) {
        nextX = viewportWidth - rect.width - 16;
      }
      if (nextY + rect.height > viewportHeight) {
        nextY = viewportHeight - rect.height - 16;
      }
      if (nextX < 16) nextX = 16;
      if (nextY < 16) nextY = 16;

      setAdjustedCoords({ x: nextX, y: nextY });
      setIsPositioned(true);
    }
  }, [x, y, triggerRect, showAddToPlaylistModal, showMetadataModal, showLyricsModal, showDetailsModal]);

  // Click outside and key handler
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (showDetailsModal || showMetadataModal || showLyricsModal || showAddToPlaylistModal) {
        return;
      }
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (!showDetailsModal && !showMetadataModal && !showLyricsModal && !showAddToPlaylistModal) {
          onClose();
        }
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose, showDetailsModal, showMetadataModal, showLyricsModal, showAddToPlaylistModal]);

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
      if (track.source === 'local') {
        const { useLocalLibraryStore } = await import('../../store/localLibraryStore.js');
        const localAlbums = useLocalLibraryStore.getState().localAlbums;
        const album = localAlbums.find((al) => al.tracks.includes(track.id));
        if (album) {
          onGoToAlbum(album.id);
        }
      } else {
        const albums = await StaticMusicRepository.getAlbums();
        const album = albums.find((al) => al.title === track.album);
        if (album) {
          onGoToAlbum(album.id);
        }
      }
    }
    onClose();
  };

  const handleGoToArtist = async () => {
    if (onGoToArtist) {
      if (track.source === 'local') {
        const { useLocalLibraryStore } = await import('../../store/localLibraryStore.js');
        const localArtists = useLocalLibraryStore.getState().localArtists;
        
        // Split track artist to find the primary artist name
        const parts = (track.artist || 'Unknown Artist').split(/(?:\s+(?:feat\.?|ft\.?|&)\s+)|[,;\/]/gi);
        const primaryArtistName = parts[0]?.trim() || 'Unknown Artist';
        
        // Define safe normalization matching normalizeString:
        const normPrimary = primaryArtistName
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/\s+/g, ' ');
          
        const artist = localArtists.find((ar) => ar.id === `local_artist_${encodeURIComponent(normPrimary)}`);
        if (artist) {
          onGoToArtist(artist.id);
        } else {
          onGoToArtist(`local_artist_${encodeURIComponent(normPrimary)}`);
        }
      } else {
        const artists = await StaticMusicRepository.getArtists();
        const artist = artists.find((ar) => ar.name === track.artist);
        if (artist) {
          onGoToArtist(artist.id);
        }
      }
    }
    onClose();
  };

  return createPortal(
    React.createElement(
      React.Fragment,
      null,
      React.createElement(
        'div',
        {
          ref: menuRef,
          onClick: (e: React.MouseEvent) => e.stopPropagation(),
          onMouseDown: (e: React.MouseEvent) => e.stopPropagation(),
          onMouseUp: (e: React.MouseEvent) => e.stopPropagation(),
          style: {
            top: adjustedCoords.y,
            left: adjustedCoords.x,
            opacity: isPositioned ? 1 : 0,
            display: (showDetailsModal || showMetadataModal || showLyricsModal || showAddToPlaylistModal) ? 'none' : 'flex'
          },
          className:
            'fixed z-[99999] min-w-44 bg-glorify-bg-surface border border-glorify-border-primary rounded-xl shadow-[0_15px_35px_rgba(0,0,0,0.4)] py-1.5 flex flex-col text-xs font-sans select-none pointer-events-auto backdrop-blur-md',
        },
      React.createElement(
        'button',
        {
          onClick: handlePlay,
          className:
            'w-full text-left px-ch-4 py-ch-2 hover:bg-glorify-bg-secondary text-glorify-text-primary flex items-center gap-ch-2.5 cursor-pointer outline-none',
        },
        React.createElement(Play, { className: 'w-ch-3.5 h-ch-3.5 text-glorify-text-muted' }),
        'Play Now'
      ),
      React.createElement(
        'button',
        {
          onClick: handlePlayNext,
          className:
            'w-full text-left px-ch-4 py-ch-2 hover:bg-glorify-bg-secondary text-glorify-text-primary flex items-center gap-ch-2.5 cursor-pointer outline-none',
        },
        React.createElement(ListPlus, { className: 'w-ch-3.5 h-ch-3.5 text-glorify-text-muted' }),
        'Play Next'
      ),
      React.createElement(
        'button',
        {
          onClick: handlePlayLast,
          className:
            'w-full text-left px-ch-4 py-ch-2 hover:bg-glorify-bg-secondary text-glorify-text-primary flex items-center gap-ch-2.5 cursor-pointer outline-none',
        },
        React.createElement(Plus, { className: 'w-ch-3.5 h-ch-3.5 text-glorify-text-muted' }),
        'Add to Queue'
      ),
      React.createElement(
        'button',
        {
          onClick: () => setShowAddToPlaylistModal(true),
          className:
            'w-full text-left px-ch-4 py-ch-2 hover:bg-glorify-bg-secondary text-glorify-text-primary flex items-center gap-ch-2.5 cursor-pointer outline-none',
        },
        React.createElement(ListPlus, { className: 'w-ch-3.5 h-ch-3.5 text-glorify-text-muted' }),
        'Add to Playlist'
      ),
      track.album &&
        React.createElement(
          'button',
          {
            onClick: handleGoToAlbum,
            className:
              'w-full text-left px-ch-4 py-ch-2 hover:bg-glorify-bg-secondary text-glorify-text-primary flex items-center gap-ch-2.5 cursor-pointer outline-none',
          },
          React.createElement(Disc, { className: 'w-ch-3.5 h-ch-3.5 text-glorify-text-muted' }),
          'Go to Album'
        ),
      React.createElement(
        'button',
        {
          onClick: handleGoToArtist,
          className:
            'w-full text-left px-ch-4 py-ch-2 hover:bg-glorify-bg-secondary text-glorify-text-primary flex items-center gap-ch-2.5 cursor-pointer outline-none',
        },
        React.createElement(Users, { className: 'w-ch-3.5 h-ch-3.5 text-glorify-text-muted' }),
        'Go to Artist'
      ),
      React.createElement(
        'button',
        {
          onClick: handleFavorite,
          className:
            'w-full text-left px-ch-4 py-ch-2 hover:bg-glorify-bg-secondary text-glorify-text-primary flex items-center gap-ch-2.5 cursor-pointer outline-none',
        },
        React.createElement(Heart, {
          className: `w-ch-3.5 h-ch-3.5 ${isFavorited ? 'text-glorify-error fill-currentColor' : 'text-glorify-text-muted'}`,
        }),
        isFavorited ? 'Remove Favorite' : 'Favorite'
      ),
      React.createElement(
        'button',
        {
          onClick: handleDownload,
          className:
            'w-full text-left px-ch-4 py-ch-2 hover:bg-glorify-bg-secondary text-glorify-text-primary flex items-center gap-ch-2.5 cursor-pointer outline-none',
        },
        React.createElement(Download, { className: 'w-ch-3.5 h-ch-3.5 text-glorify-text-muted' }),
        'Download Track'
      ),
      React.createElement(
        'button',
        {
          onClick: handleShare,
          className:
            'w-full text-left px-ch-4 py-ch-2 hover:bg-glorify-bg-secondary text-glorify-text-primary flex items-center gap-ch-2.5 cursor-pointer outline-none',
        },
        React.createElement(Share2, { className: 'w-ch-3.5 h-ch-3.5 text-glorify-text-muted' }),
        'Share Link'
      ),
      React.createElement(
        'button',
        {
          onClick: () => setShowDetailsModal(true),
          className:
            'w-full text-left px-ch-4 py-ch-2 hover:bg-glorify-bg-secondary text-glorify-text-primary flex items-center gap-ch-2.5 cursor-pointer outline-none border-t border-glorify-border-primary/50 mt-1',
        },
        React.createElement(Info, { className: 'w-ch-3.5 h-ch-3.5 text-glorify-text-muted' }),
        'Track Info'
      ),
      track.source === 'local' &&
        React.createElement(
          'button',
          {
            onClick: () => setShowMetadataModal(true),
            className:
              'w-full text-left px-ch-4 py-ch-2 hover:bg-glorify-bg-secondary text-glorify-text-primary flex items-center gap-ch-2.5 cursor-pointer outline-none border-t border-glorify-border-primary/50 mt-1',
          },
          React.createElement(Pencil, { className: 'w-ch-3.5 h-ch-3.5 text-glorify-text-muted' }),
          'Edit Metadata'
        ),
      track.source === 'local' &&
        React.createElement(
          'button',
          {
            onClick: () => setShowLyricsModal(true),
            className:
              'w-full text-left px-ch-4 py-ch-2 hover:bg-glorify-bg-secondary text-glorify-text-primary flex items-center gap-ch-2.5 cursor-pointer outline-none border-t border-glorify-border-primary/50 mt-1',
          },
          React.createElement(AlignLeft, { className: 'w-ch-3.5 h-ch-3.5 text-glorify-text-muted' }),
          'Edit Lyrics'
        )
    ),
    // Details Metadata Modal Dialog
    showDetailsModal &&
      React.createElement(
        'div',
        { className: 'fixed inset-0 z-50 flex items-center justify-center p-ch-4 bg-[#0b0b0a]/70 backdrop-blur-xs' },
        React.createElement(
          'div',
          { className: 'bg-glorify-bg-surface border border-glorify-border-primary rounded-ch-lg p-ch-6 max-w-sm w-full flex flex-col gap-ch-4 text-left font-sans' },
          React.createElement('div', { className: 'text-xs font-mono text-glorify-aura-gold tracking-widest' }, '[ STEM_DETAILS_TELEMETRY ]'),
          React.createElement(
            'div',
            { className: 'flex flex-col gap-ch-1' },
            React.createElement('div', { className: 'text-xs text-glorify-text-muted' }, 'Track Title'),
            React.createElement('div', { className: 'text-sm font-semibold text-glorify-text-primary' }, track.title),
            React.createElement('div', { className: 'text-xs text-glorify-text-muted mt-ch-3' }, 'AI Prompts Metadata'),
            React.createElement(
              'div',
              { className: 'p-ch-3 bg-glorify-bg-secondary border border-glorify-border-secondary text-xs text-glorify-text-secondary leading-relaxed font-mono rounded-ch-sm' },
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
              className: 'mt-ch-4 py-ch-2 bg-glorify-text-primary text-glorify-bg-primary rounded-ch-sm text-xs font-semibold hover:opacity-90 outline-none',
            },
            'Dismiss Log'
          )
        )
      ),
    showMetadataModal &&
      React.createElement(MetadataEditorModal, {
        mode: 'single',
        trackIds: [track.id],
        onClose: () => {
          setShowMetadataModal(false);
          onClose();
        },
      }),
    showLyricsModal &&
      React.createElement(LyricsEditorModal, {
        trackId: track.id,
        onClose: () => {
          setShowLyricsModal(false);
          onClose();
        },
      }),
    showAddToPlaylistModal &&
      React.createElement(AddToPlaylistModal, {
        track: track,
        onClose: () => {
          setShowAddToPlaylistModal(false);
          onClose();
        },
      })
    ),
    document.body
  );
}
