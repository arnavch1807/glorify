import React, { useMemo, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePlayerStore } from '../store/playerStore.js';
import { useLocalLibraryStore } from '../store/localLibraryStore.js';
import { Track } from '@chotify/types';
import { StaticMusicRepository } from '../repositories/musicRepository.js';
import { TrackCard } from '../components/Library/TrackCard.js';
import { Play, Shuffle, ArrowLeft, Clock, Music, Sparkles, Heart, Disc, ListMusic, SlidersHorizontal, Search } from 'lucide-react';
import { motion } from 'framer-motion';

export function CollectionPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [allTracks, setAllTracks] = useState<Track[]>([]);
  const [filterQuery, setFilterQuery] = useState('');

  const {
    playTrack,
    setQueue,
    toggleShuffle,
    isShuffle,
    favoritedTrackIds,
    listeningHistory,
    totalPlays
  } = usePlayerStore();

  const { localTracks, loadSavedLibrary } = useLocalLibraryStore();

  useEffect(() => {
    // Make sure local library is loaded
    loadSavedLibrary();
    
    // Load catalog tracks
    StaticMusicRepository.getTracks()
      .then(setAllTracks)
      .catch(err => console.error('Failed to load catalog tracks in CollectionPage:', err));
  }, []);

  const combinedTracks = useMemo(() => {
    return [...localTracks, ...allTracks];
  }, [localTracks, allTracks]);

  // Compute specific smart collection dynamically
  const collection = useMemo(() => {
    if (!id) return null;

    // 1. Recently Added
    const recentlyAddedTracks = [...combinedTracks]
      .filter(t => t.source === 'local')
      .sort((a, b) => {
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return timeB - timeA;
      });

    // 2. Recently Played
    const uniqueHistoryIds = Array.from(new Set((listeningHistory || []).map(item => item.trackId)));
    const recentlyPlayedTracks = uniqueHistoryIds
      .map(trackId => combinedTracks.find(t => t.id === trackId))
      .filter((t): t is Track => !!t);

    // 3. Most Played
    const mostPlayedTracks = [...combinedTracks]
      .filter(t => (totalPlays?.[t.id] || 0) > 0)
      .sort((a, b) => (totalPlays?.[b.id] || 0) - (totalPlays?.[a.id] || 0));

    // 4. Favorites
    const favoriteTracks = combinedTracks.filter(t => favoritedTrackIds.includes(t.id));

    // 5. Never Played
    const historySet = new Set((listeningHistory || []).map(item => item.trackId));
    const neverPlayedTracks = combinedTracks
      .filter(t => t.source === 'local' && !historySet.has(t.id))
      .sort((a, b) => a.title.localeCompare(b.title));

    // 6. Longest Tracks
    const longestTracks = [...combinedTracks]
      .filter(t => t.source === 'local')
      .sort((a, b) => b.duration - a.duration);

    // 7. Shortest Tracks
    const shortestTracks = [...combinedTracks]
      .filter(t => t.source === 'local')
      .sort((a, b) => a.duration - b.duration);

    const collections = [
      {
        id: 'recently-added',
        name: 'Recently Added',
        description: 'Your latest additions',
        tracks: recentlyAddedTracks.slice(0, 50),
        gradient: 'from-emerald-600 to-teal-800',
        icon: Sparkles,
        emptyState: 'Import some music to see it here.'
      },
      {
        id: 'recently-played',
        name: 'Recently Played',
        description: 'Jump back into your listening',
        tracks: recentlyPlayedTracks.slice(0, 50),
        gradient: 'from-indigo-600 to-blue-800',
        icon: Music,
        emptyState: "You haven't played anything yet."
      },
      {
        id: 'most-played',
        name: 'Most Played',
        description: 'Your most listened-to tracks',
        tracks: mostPlayedTracks.slice(0, 50),
        gradient: 'from-[#D4AF37] to-[#8C6D1F]',
        icon: Sparkles,
        emptyState: "You haven't played any tracks enough to rank them yet."
      },
      {
        id: 'favorites',
        name: 'Favorites',
        description: 'Your loved tracks',
        tracks: favoriteTracks,
        gradient: 'from-rose-600 to-red-800',
        icon: Heart,
        emptyState: "Like some tracks and they'll appear here."
      },
      {
        id: 'never-played',
        name: 'Never Played',
        description: "Discover music you haven't heard yet",
        tracks: neverPlayedTracks,
        gradient: 'from-purple-600 to-fuchsia-800',
        icon: Disc,
        emptyState: 'All your tracks have been played. Nice!'
      },
      {
        id: 'longest-tracks',
        name: 'Longest Tracks',
        description: 'Your longest audio tracks',
        tracks: longestTracks.slice(0, 50),
        gradient: 'from-orange-600 to-amber-800',
        icon: ListMusic,
        emptyState: 'Import some music to see it here.'
      },
      {
        id: 'shortest-tracks',
        name: 'Shortest Tracks',
        description: 'Your shortest audio tracks',
        tracks: shortestTracks.slice(0, 50),
        gradient: 'from-cyan-600 to-sky-800',
        icon: SlidersHorizontal,
        emptyState: 'Import some music to see it here.'
      }
    ];

    return collections.find(c => c.id === id) || null;
  }, [id, combinedTracks, listeningHistory, totalPlays, favoritedTrackIds]);

  const filteredTracks = useMemo(() => {
    if (!collection) return [];
    if (!filterQuery.trim()) return collection.tracks;
    const q = filterQuery.toLowerCase().trim();
    return collection.tracks.filter(t => 
      t.title.toLowerCase().includes(q) || 
      t.artist.toLowerCase().includes(q)
    );
  }, [collection, filterQuery]);

  const totalDuration = useMemo(() => {
    if (!collection) return 0;
    return collection.tracks.reduce((acc, t) => acc + t.duration, 0);
  }, [collection]);

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
    if (collection && collection.tracks.length > 0) {
      playTrack(collection.tracks[0], collection.tracks);
    }
  };

  const handleShufflePlay = () => {
    if (collection && collection.tracks.length > 0) {
      setQueue(collection.tracks);
      if (!isShuffle) {
        toggleShuffle();
      }
      const randomIndex = Math.floor(Math.random() * collection.tracks.length);
      playTrack(collection.tracks[randomIndex], collection.tracks);
    }
  };

  if (!collection) {
    return React.createElement(
      'div',
      { className: 'flex flex-col items-center justify-center h-[50vh] gap-4 font-sans text-center' },
      React.createElement('div', { className: 'text-sm text-glorify-text-muted' }, 'Smart collection not found.'),
      React.createElement(
        'button',
        { onClick: () => navigate('/library?tab=collections'), className: 'px-4 py-2 bg-glorify-accent text-glorify-carbon-950 font-bold rounded-full text-xs cursor-pointer' },
        'Back to Library'
      )
    );
  }

  const trackCount = collection.tracks.length;
  const firstTrackWithCover = collection.tracks.find(t => t.coverImage && !t.coverImage.includes('photo-1614613535308-eb5fbd3d2c17'));
  const coverUrl = firstTrackWithCover ? firstTrackWithCover.coverImage : undefined;

  return React.createElement(
    'div',
    { className: 'flex flex-col gap-6 w-full mx-auto pb-32 text-left font-sans' },
    
    // Back Button
    React.createElement(
      'button',
      {
        onClick: () => navigate('/library?tab=collections'),
        className: 'flex items-center gap-ch-2 text-xs text-glorify-text-secondary hover:text-glorify-text-primary self-start transition-colors outline-none cursor-pointer border-none bg-transparent',
      },
      React.createElement(ArrowLeft, { className: 'w-ch-4 h-ch-4' }),
      'Back to Library'
    ),

    // Header Jumbotron
    React.createElement(
      'div',
      { className: 'relative w-full rounded-[28px] overflow-hidden bg-gradient-to-b from-[#1C1B17] via-glorify-bg-surface/90 to-glorify-bg-surface/40 border border-glorify-border-primary/5 p-6 md:p-8 flex flex-col md:flex-row items-center md:items-end gap-ch-6 text-center md:text-left shadow-md' },
      
      // Cover Artwork
      React.createElement(
        'div',
        { className: 'w-40 h-40 md:w-44 md:h-44 rounded-[24px] shadow-2xl flex-shrink-0 overflow-hidden bg-glorify-bg-secondary flex items-center justify-center' },
        coverUrl
          ? React.createElement('img', { src: coverUrl, alt: collection.name, className: 'w-full h-full object-cover' })
          : React.createElement(
              'div',
              { className: `w-full h-full bg-gradient-to-br ${collection.gradient} flex items-center justify-center p-4` },
              React.createElement(collection.icon, { className: 'w-16 h-16 text-white/90 drop-shadow-lg' })
            )
      ),

      // Metadata Info
      React.createElement(
        'div',
        { className: 'flex flex-col gap-1.5 md:mb-1' },
        React.createElement(
          'span',
          { className: 'text-[10px] uppercase font-bold tracking-widest text-glorify-accent' },
          'Smart Collection'
        ),
        React.createElement(
          'h1',
          { className: 'text-2xl md:text-3xl font-extrabold text-glorify-text-primary tracking-tight' },
          collection.name
        ),
        React.createElement(
          'p',
          { className: 'text-xs text-glorify-text-muted leading-relaxed max-w-md' },
          collection.description
        ),
        React.createElement(
          'div',
          { className: 'flex items-center justify-center md:justify-start gap-1.5 text-xs text-glorify-text-secondary mt-1 font-semibold' },
          React.createElement('span', null, `${trackCount} song${trackCount === 1 ? '' : 's'}`),
          React.createElement('span', null, '•'),
          React.createElement('span', null, formatTotalTime(totalDuration))
        )
      )
    ),

    // Playback controls panel
    React.createElement(
      'div',
      { className: 'flex flex-wrap items-center justify-between gap-4 mt-2' },
      React.createElement(
        'div',
        { className: 'flex items-center gap-3' },
        React.createElement(
          'button',
          {
            disabled: trackCount === 0,
            onClick: handlePlayAll,
            className: 'flex items-center gap-ch-2 px-ch-5 py-2.5 bg-glorify-accent text-glorify-carbon-950 hover:scale-105 active:scale-95 disabled:scale-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-full text-xs font-bold shadow-md cursor-pointer transition-all outline-none focus-ring',
          },
          React.createElement(Play, { className: 'w-ch-4 h-ch-4 fill-currentColor pl-0.5' }),
          'Play All'
        ),
        React.createElement(
          'button',
          {
            disabled: trackCount === 0,
            onClick: handleShufflePlay,
            className: 'flex items-center gap-ch-2 px-ch-5 py-2.5 bg-glorify-bg-surface border border-glorify-border-primary hover:bg-glorify-bg-secondary text-glorify-text-primary hover:scale-105 active:scale-95 disabled:scale-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-full text-xs font-semibold shadow cursor-pointer transition-all outline-none focus-ring',
          },
          React.createElement(Shuffle, { className: 'w-ch-3.5 h-ch-3.5' }),
          'Shuffle'
        )
      ),

      // Filter Search Box
      trackCount > 0 && React.createElement(
        'div',
        { className: 'relative max-w-xs w-full' },
        React.createElement(Search, { className: 'absolute left-ch-3 top-1/2 -translate-y-1/2 w-ch-3.5 h-ch-3.5 text-glorify-text-muted' }),
        React.createElement('input', {
          type: 'text',
          placeholder: 'Search songs...',
          value: filterQuery,
          onChange: (e) => setFilterQuery(e.target.value),
          className: 'w-full pl-ch-8.5 pr-ch-4 py-1.5 rounded-full bg-glorify-bg-surface/45 border border-glorify-border-primary/10 text-xs text-glorify-text-primary placeholder:text-glorify-text-muted focus:border-glorify-accent outline-none focus-ring shadow-sm transition-all'
        })
      )
    ),

    // Songs List view container
    React.createElement(
      'div',
      { className: 'flex flex-col gap-1 bg-glorify-bg-surface/20 border border-glorify-border-primary/5 rounded-[24px] p-ch-3 mt-4 shadow-sm' },
      trackCount === 0
        ? React.createElement(
            'div',
            { className: 'flex flex-col items-center justify-center text-center py-20 px-6 gap-3' },
            React.createElement(collection.icon, { className: 'w-12 h-12 text-glorify-accent animate-pulse' }),
            React.createElement('h3', { className: 'text-sm font-bold text-glorify-text-primary' }, 'Collection is empty'),
            React.createElement('p', { className: 'text-xs text-glorify-text-muted max-w-xs leading-relaxed' }, collection.emptyState)
          )
        : (filteredTracks.length === 0
            ? React.createElement('div', { className: 'text-center py-16 text-sm text-glorify-text-muted font-light' }, 'No matches found in collection.')
            : filteredTracks.map((track, idx) =>
                React.createElement(TrackCard, {
                  key: track.id,
                  track: track,
                  index: idx,
                  queueContext: filteredTracks,
                  onGoToAlbum: (albumId) => navigate(`/album/${albumId}`),
                  onGoToArtist: (artistId) => navigate(`/artist/${artistId}`),
                })
              )
          )
    )
  );
}
