import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { StaticMusicRepository } from '../repositories/musicRepository.js';
import { Track, Album, Artist } from '@chotify/types';
import { TrackCard } from '../components/Library/TrackCard.js';
import { usePlayerStore } from '../store/playerStore.js';
import { AlbumPageSkeleton } from '../components/SkeletonLoaders.js';
import { Play, Shuffle, Heart, Disc, ArrowLeft, Clock, Calendar, Users } from 'lucide-react';
import { motion } from 'framer-motion';

export function AlbumPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [albumData, setAlbumData] = useState<{ album: Album; tracks: Track[] } | null>(null);
  const [artistAvatar, setArtistAvatar] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const {
    playTrack,
    setQueue,
    toggleShuffle,
    favoritedAlbumIds,
    toggleFavoriteAlbum
  } = usePlayerStore();

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    StaticMusicRepository.getAlbumDetails(id)
      .then((res) => {
        if (res) {
          setAlbumData(res);
          // Look up artist avatar URL
          StaticMusicRepository.getArtists().then((artists) => {
            const found = artists.find(a => a.name === res.album.artistName);
            if (found) {
              setArtistAvatar(found.avatarUrl || null);
            }
          });
        }
      })
      .catch((err) => console.error('Failed to load album details:', err))
      .finally(() => setLoading(false));
  }, [id]);

  const isLiked = useMemo(() => {
    if (!id) return false;
    return favoritedAlbumIds.includes(id);
  }, [favoritedAlbumIds, id]);

  const totalDuration = useMemo(() => {
    if (!albumData) return 0;
    return albumData.tracks.reduce((acc, t) => acc + t.duration, 0);
  }, [albumData]);

  const formatTotalTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const hours = Math.floor(mins / 60);
    const remMins = mins % 60;
    if (hours > 0) {
      return `${hours} hr ${remMins} min`;
    }
    return `${mins} min`;
  };

  const handlePlayAll = () => {
    if (albumData && albumData.tracks.length > 0) {
      playTrack(albumData.tracks[0], albumData.tracks);
    }
  };

  const handleShufflePlay = () => {
    if (albumData && albumData.tracks.length > 0) {
      setQueue(albumData.tracks);
      const store = usePlayerStore.getState();
      if (!store.isShuffle) {
        toggleShuffle();
      }
      const randomIndex = Math.floor(Math.random() * albumData.tracks.length);
      playTrack(albumData.tracks[randomIndex], albumData.tracks);
    }
  };

  if (loading) {
    return React.createElement(AlbumPageSkeleton);
  }

  if (!albumData) {
    return React.createElement(
      'div',
      { className: 'text-center py-16 font-sans' },
      React.createElement('h2', { className: 'text-xl font-bold' }, 'Album Not Found'),
      React.createElement(
        'button',
        { onClick: () => navigate(-1), className: 'mt-ch-4 text-xs text-glorify-accent hover:underline' },
        'Go Back'
      )
    );
  }

  const { album, tracks } = albumData;

  return React.createElement(
    'div',
    { className: 'w-full flex flex-col gap-8 pb-32 font-sans relative' },
    
    // Header Navigation Bar
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

    // Album Hero Panel with breathing mesh gradient
    React.createElement(
      'div',
      { className: 'relative w-full rounded-[28px] overflow-hidden bg-gradient-to-b from-[#1C1B17] via-glorify-bg-surface/90 to-glorify-bg-surface/40 border border-glorify-border-primary/5 p-6 md:p-8 flex flex-col md:flex-row items-center md:items-end gap-ch-6 text-center md:text-left shadow-md' },
      
      // Cover background blur
      album.coverUrl &&
        React.createElement('div', {
          className: 'absolute inset-0 -z-10 bg-cover bg-center opacity-[0.06] blur-2xl scale-105 pointer-events-none',
          style: { backgroundImage: `url(${album.coverUrl})` }
        }),

      // Cover Art
      React.createElement(
        'div',
        { className: 'w-40 h-40 sm:w-48 sm:h-48 rounded-[24px] overflow-hidden bg-glorify-carbon-900 border border-glorify-border-primary flex items-center justify-center shadow-2xl flex-shrink-0' },
        album.coverUrl
          ? React.createElement('img', { src: album.coverUrl, alt: album.title, className: 'w-full h-full object-cover transition-transform duration-500 hover:scale-105' })
          : React.createElement(Disc, { className: 'w-16 h-16 text-glorify-text-muted animate-spin-slow' })
      ),

      // Meta titles
      React.createElement(
        'div',
        { className: 'flex flex-col gap-ch-2 mt-ch-4 md:mt-0 flex-1 min-w-0 z-10' },
        React.createElement('span', { className: 'text-[10px] font-bold text-glorify-accent tracking-widest uppercase' }, 'ALBUM'),
        React.createElement('h1', { className: 'text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-glorify-text-primary leading-none truncate' }, album.title),
        
        React.createElement(
          'div',
          { className: 'flex flex-wrap items-center justify-center md:justify-start gap-ch-2.5 text-xs text-glorify-text-muted font-medium mt-2' },
          // Artist image + name
          React.createElement(
            'div',
            { className: 'flex items-center gap-1.5' },
            artistAvatar
              ? React.createElement('img', { src: artistAvatar, alt: album.artistName, className: 'w-5 h-5 rounded-full object-cover border border-white/10' })
              : React.createElement(Users, { className: 'w-4 h-4 text-glorify-text-muted' }),
            React.createElement('span', { className: 'text-glorify-text-primary font-semibold hover:underline cursor-pointer' }, album.artistName)
          ),
          React.createElement('span', null, '•'),
          React.createElement('span', { className: 'flex items-center gap-1' }, React.createElement(Calendar, { className: 'w-3.5 h-3.5' }), album.releaseYear),
          React.createElement('span', null, '•'),
          React.createElement('span', null, `${tracks.length} song${tracks.length === 1 ? '' : 's'}`),
          React.createElement('span', null, '•'),
          React.createElement('span', { className: 'flex items-center gap-1' }, React.createElement(Clock, { className: 'w-3.5 h-3.5' }), formatTotalTime(totalDuration))
        ),
        
        React.createElement(
          'span',
          { className: 'text-[10px] font-bold text-glorify-accent/80 tracking-widest uppercase mt-1' },
          `Genre: ${album.genre}`
        )
      )
    ),

    // Sticky Play/Shuffle Button Bar (Pins to top when scrolling)
    React.createElement(
      'div',
      { className: 'sticky top-0 z-20 py-4 bg-glorify-bg-primary/95 backdrop-blur-md border-b border-glorify-border-primary/5 flex items-center justify-between flex-wrap gap-ch-3' },
      
      React.createElement(
        'div',
        { className: 'flex items-center gap-ch-3' },
        tracks.length > 0 &&
          React.createElement(
            motion.button,
            {
              onClick: handlePlayAll,
              whileHover: { scale: 1.05 },
              whileTap: { scale: 0.95 },
              className: 'px-ch-6 py-3 rounded-full bg-glorify-accent text-glorify-carbon-950 text-xs font-bold flex items-center gap-ch-2 shadow-lg cursor-pointer hover:shadow-xl'
            },
            React.createElement(Play, { className: 'w-ch-4 h-ch-4 fill-currentColor pl-0.5' }),
            'Play All'
          ),
        tracks.length > 0 &&
          React.createElement(
            motion.button,
            {
              onClick: handleShufflePlay,
              whileHover: { scale: 1.05 },
              whileTap: { scale: 0.95 },
              className: 'px-ch-5 py-3 rounded-full bg-glorify-bg-secondary text-glorify-text-primary border border-glorify-border-primary text-xs font-bold flex items-center gap-ch-2 cursor-pointer'
            },
            React.createElement(Shuffle, { className: 'w-ch-4 h-ch-4' }),
            'Shuffle'
          )
      ),

      React.createElement(
        motion.button,
        {
          onClick: () => toggleFavoriteAlbum(album.id),
          whileHover: { scale: 1.1 },
          whileTap: { scale: 0.9 },
          className: `p-3 rounded-full border border-glorify-border-primary cursor-pointer transition-colors ${
            isLiked ? 'text-glorify-accent bg-glorify-accent/10 border-glorify-accent/20 shadow-sm' : 'text-glorify-text-muted hover:text-glorify-text-primary'
          }`
        },
        React.createElement(Heart, { className: 'w-ch-5 h-ch-5', fill: isLiked ? 'currentColor' : 'none' })
      )
    ),

    // Tracks List Section
    React.createElement(
      'div',
      { className: 'flex flex-col gap-ch-4 font-sans' },
      React.createElement(
        'div',
        { className: 'flex flex-col bg-glorify-bg-surface/20 border border-glorify-border-primary/5 rounded-[24px] p-ch-3 shadow-sm' },
        tracks.length === 0
          ? React.createElement('div', { className: 'text-center py-16 text-sm text-glorify-text-muted' }, 'No songs in this album.')
          : tracks.map((track, idx) =>
              React.createElement(TrackCard, {
                key: track.id,
                track: track,
                index: idx,
                queueContext: tracks,
                onGoToArtist: (artistId) => navigate(`/artist/${artistId}`),
              })
            )
      )
    )
  );
}
