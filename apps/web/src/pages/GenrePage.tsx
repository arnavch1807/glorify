import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Track, Album, Artist } from '@chotify/types';
import { TrackCard } from '../components/Library/TrackCard.js';
import { CatalogCard } from '../components/Library/CatalogCard.js';
import { usePlayerStore } from '../store/playerStore.js';
import { useLocalLibraryStore } from '../store/localLibraryStore.js';
import { LibrarySkeleton } from '../components/SkeletonLoaders.js';
import { Play, Shuffle, ArrowLeft, Tag, Clock, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export function GenrePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const { localTracks, localAlbums, localArtists, localGenres } = useLocalLibraryStore();

  const {
    playTrack,
    setQueue,
    toggleShuffle,
    totalPlays
  } = usePlayerStore();

  const genreObj = useMemo(() => {
    if (!id) return null;
    return localGenres.find(g => g.id === id) || null;
  }, [id, localGenres]);

  useEffect(() => {
    // Simulating loading to allow IndexedDB hydration
    if (localGenres.length > 0) {
      setLoading(false);
    } else {
      const timer = setTimeout(() => setLoading(false), 300);
      return () => clearTimeout(timer);
    }
  }, [localGenres]);

  const genreTracks = useMemo(() => {
    if (!genreObj) return [];
    return genreObj.tracks
      .map(tId => localTracks.find(t => t.id === tId))
      .filter((t): t is Track => !!t);
  }, [genreObj, localTracks]);

  const genreAlbums = useMemo(() => {
    if (!genreObj) return [];
    return localAlbums.filter(al => genreObj.albums.includes(al.id));
  }, [genreObj, localAlbums]);

  const genreArtists = useMemo(() => {
    if (!genreObj) return [];
    return localArtists.filter(art => genreObj.artists.includes(art.id));
  }, [genreObj, localArtists]);

  // Popular Compositions sorted by totalPlays desc, fallback alphabetical
  const popularTracks = useMemo(() => {
    return [...genreTracks]
      .sort((a, b) => {
        const playsA = totalPlays[a.id] || 0;
        const playsB = totalPlays[b.id] || 0;
        if (playsB !== playsA) {
          return playsB - playsA;
        }
        return (a.title || '').localeCompare(b.title || '');
      })
      .slice(0, 5);
  }, [genreTracks, totalPlays]);

  // Recently Added sorted by createdAt desc
  const recentlyAddedTracks = useMemo(() => {
    return [...genreTracks]
      .sort((a, b) => {
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return timeB - timeA;
      })
      .slice(0, 10);
  }, [genreTracks]);

  const handlePlayAll = () => {
    if (genreTracks.length > 0) {
      playTrack(genreTracks[0], genreTracks);
    }
  };

  const handleShufflePlay = () => {
    if (genreTracks.length > 0) {
      setQueue(genreTracks);
      const store = usePlayerStore.getState();
      if (!store.isShuffle) {
        toggleShuffle();
      }
      const randomIndex = Math.floor(Math.random() * genreTracks.length);
      playTrack(genreTracks[randomIndex], genreTracks);
    }
  };

  const handlePlayAlbum = (albumId: string) => {
    const alb = localAlbums.find(a => a.id === albumId);
    if (alb && alb.tracks.length > 0) {
      const albTracks = alb.tracks
        .map(tId => localTracks.find(t => t.id === tId))
        .filter((t): t is Track => !!t);
      if (albTracks.length > 0) {
        playTrack(albTracks[0], albTracks);
      }
    }
  };

  if (loading) {
    return React.createElement(LibrarySkeleton);
  }

  if (!genreObj) {
    return React.createElement(
      'div',
      { className: 'text-center py-16 font-sans' },
      React.createElement('h2', { className: 'text-xl font-bold text-glorify-text-primary' }, 'Genre Not Found'),
      React.createElement(
        'button',
        { onClick: () => navigate(-1), className: 'mt-ch-4 text-xs text-glorify-accent hover:underline' },
        'Go Back'
      )
    );
  }

  return React.createElement(
    'div',
    { className: 'w-full flex flex-col gap-10 pb-32 font-sans relative overflow-hidden' },
    
    // Background mesh gradient
    React.createElement(
      'div',
      { className: 'absolute inset-0 -z-20 pointer-events-none' },
      React.createElement(motion.div, {
        animate: {
          scale: [1, 1.12, 1],
          x: [0, 20, 0],
          y: [0, -10, 0]
        },
        transition: { repeat: Infinity, duration: 20, ease: 'easeInOut' },
        className: 'absolute top-[-5%] left-[10%] w-[380px] h-[380px] rounded-full bg-glorify-accent/5 blur-[100px]'
      })
    ),

    // Header Back navigation
    React.createElement(
      'div',
      { className: 'flex items-center gap-ch-2 z-10' },
      React.createElement(
        'button',
        {
          onClick: () => navigate(-1),
          className: 'flex items-center gap-ch-1.5 text-xs text-glorify-text-secondary hover:text-glorify-text-primary outline-none focus-ring cursor-pointer'
        },
        React.createElement(ArrowLeft, { className: 'w-ch-4 h-ch-4' }),
        'Back'
      )
    ),

    // Genre Hero Banner
    React.createElement(
      'div',
      {
        className: 'relative w-full rounded-[28px] overflow-hidden bg-gradient-to-b from-[#1C1B17] via-glorify-bg-surface/90 to-glorify-bg-surface/40 border border-glorify-border-primary/5 p-8 md:p-12 flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-8 justify-between relative shadow-md'
      },
      React.createElement(
        'div',
        { className: 'flex flex-col md:flex-row items-center md:items-end gap-ch-6 text-center md:text-left z-10' },
        React.createElement(
          'div',
          { className: 'w-32 h-32 md:w-36 md:h-36 rounded-2xl overflow-hidden border-2 border-glorify-accent/30 shadow-2xl bg-gradient-to-br from-glorify-carbon-900 to-glorify-carbon-950 flex items-center justify-center flex-shrink-0' },
          React.createElement(Tag, { className: 'w-16 h-16 text-glorify-accent' })
        ),
        React.createElement(
          'div',
          { className: 'flex flex-col gap-ch-2 mt-ch-4 md:mt-0' },
          React.createElement('span', { className: 'text-[10px] font-bold text-glorify-accent tracking-widest uppercase' }, 'GENRE COLLECTION'),
          React.createElement('h1', { className: 'text-4xl md:text-5xl font-extrabold tracking-tight text-glorify-text-primary leading-none' }, genreObj.name),
          React.createElement(
            'div',
            { className: 'flex items-center justify-center md:justify-start gap-2 text-xs text-glorify-text-secondary font-medium mt-1' },
            React.createElement('span', { className: 'text-glorify-text-primary font-semibold' }, `${genreTracks.length} song${genreTracks.length === 1 ? '' : 's'} · ${genreAlbums.length} album${genreAlbums.length === 1 ? '' : 's'} · ${genreArtists.length} artist${genreArtists.length === 1 ? '' : 's'}`)
          )
        )
      )
    ),

    // Controls subheader toolbar
    React.createElement(
      'div',
      { className: 'sticky top-0 z-20 py-4 bg-glorify-bg-primary/95 backdrop-blur-md border-b border-glorify-border-primary/5 flex items-center justify-between flex-wrap gap-ch-3' },
      React.createElement(
        'div',
        { className: 'flex items-center gap-ch-3' },
        genreTracks.length > 0 &&
          React.createElement(
            motion.button,
            {
              onClick: handlePlayAll,
              whileHover: { scale: 1.05 },
              whileTap: { scale: 0.95 },
              className: 'px-ch-6 py-3 rounded-full bg-glorify-accent text-glorify-carbon-950 text-xs font-bold flex items-center gap-ch-2 shadow-lg cursor-pointer hover:shadow-xl'
            },
            React.createElement(Play, { className: 'w-5 h-5 fill-currentColor pl-0.5' }),
            'Play All'
          ),
        genreTracks.length > 0 &&
          React.createElement(
            motion.button,
            {
              onClick: handleShufflePlay,
              whileHover: { scale: 1.05 },
              whileTap: { scale: 0.95 },
              className: 'px-ch-6 py-3 rounded-full border border-glorify-border-primary text-glorify-text-primary text-xs font-bold flex items-center gap-ch-2 cursor-pointer hover:bg-white/5'
            },
            React.createElement(Shuffle, { className: 'w-ch-4 h-ch-4' }),
            'Shuffle'
          )
      )
    ),

    // Double Column content
    React.createElement(
      'div',
      { className: 'grid grid-cols-1 lg:grid-cols-2 gap-10 z-10' },
      
      // Column Left: Popular Compositions
      React.createElement(
        'div',
        { className: 'flex flex-col gap-ch-4 text-left' },
        React.createElement(
          'div',
          { className: 'flex items-center gap-2 pl-ch-1 text-glorify-text-primary' },
          React.createElement(Sparkles, { className: 'w-4 h-4 text-glorify-accent' }),
          React.createElement('h2', { className: 'text-lg font-bold' }, 'Popular Compositions')
        ),
        React.createElement(
          'div',
          { className: 'flex flex-col bg-glorify-bg-surface/20 border border-glorify-border-primary/5 rounded-[24px] p-ch-3 shadow-sm' },
          popularTracks.length === 0
            ? React.createElement('div', { className: 'text-center py-10 text-xs text-glorify-text-muted' }, 'No popular songs')
            : popularTracks.map((track, idx) =>
                React.createElement(TrackCard, {
                  key: 'pop-' + track.id,
                  track: track,
                  index: idx,
                  queueContext: genreTracks,
                  onGoToAlbum: (albumId) => navigate(`/album/${albumId}`),
                  onGoToArtist: (artistId) => navigate(`/artist/${artistId}`),
                })
              )
        )
      ),

      // Column Right: Recently Added
      React.createElement(
        'div',
        { className: 'flex flex-col gap-ch-4 text-left' },
        React.createElement(
          'div',
          { className: 'flex items-center gap-2 pl-ch-1 text-glorify-text-primary' },
          React.createElement(Clock, { className: 'w-4 h-4 text-glorify-accent' }),
          React.createElement('h2', { className: 'text-lg font-bold' }, 'Recently Added')
        ),
        React.createElement(
          'div',
          { className: 'flex flex-col bg-glorify-bg-surface/20 border border-glorify-border-primary/5 rounded-[24px] p-ch-3 shadow-sm' },
          recentlyAddedTracks.length === 0
            ? React.createElement('div', { className: 'text-center py-10 text-xs text-glorify-text-muted' }, 'No tracks imported yet')
            : recentlyAddedTracks.map((track, idx) =>
                React.createElement(TrackCard, {
                  key: 'recent-' + track.id,
                  track: track,
                  index: idx,
                  queueContext: genreTracks,
                  onGoToAlbum: (albumId) => navigate(`/album/${albumId}`),
                  onGoToArtist: (artistId) => navigate(`/artist/${artistId}`),
                })
              )
        )
      )
    ),

    // Albums Section
    genreAlbums.length > 0 &&
      React.createElement(
        'div',
        { className: 'flex flex-col gap-ch-4 z-10' },
        React.createElement('h2', { className: 'text-lg font-bold text-glorify-text-primary pl-ch-1 text-left' }, 'Albums'),
        React.createElement(
          'div',
          { className: 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-ch-6' },
          genreAlbums.map((album) =>
            React.createElement(CatalogCard, {
              key: album.id,
              id: album.id,
              title: album.title,
              subtitle: `${album.artistName || 'Various Artists'} • Album`,
              type: 'album',
              coverUrl: album.coverUrl,
              onClick: () => navigate(`/album/${album.id}`),
              onPlayClick: (e) => {
                e.stopPropagation();
                handlePlayAlbum(album.id);
              }
            })
          )
        )
      ),

    // Artists Section
    genreArtists.length > 0 &&
      React.createElement(
        'div',
        { className: 'flex flex-col gap-ch-4 z-10' },
        React.createElement('h2', { className: 'text-lg font-bold text-glorify-text-primary pl-ch-1 text-left' }, 'Artists'),
        React.createElement(
          'div',
          { className: 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-ch-6' },
          genreArtists.map((artist) =>
            React.createElement(CatalogCard, {
              key: artist.id,
              id: artist.id,
              title: artist.name,
              subtitle: artist.genres.join(' / ').toUpperCase(),
              type: 'artist',
              coverUrl: artist.avatarUrl,
              onClick: () => navigate(`/artist/${artist.id}`),
              onPlayClick: (e) => {
                e.stopPropagation();
                // Play artist first track
                const artistTracks = localTracks.filter(t => artist.tracks?.includes(t.id));
                if (artistTracks.length > 0) {
                  playTrack(artistTracks[0], artistTracks);
                }
              }
            })
          )
        )
      )
  );
}
