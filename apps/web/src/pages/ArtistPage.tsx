import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { StaticMusicRepository } from '../repositories/musicRepository.js';
import { Track, Album, Artist } from '@chotify/types';
import { TrackCard } from '../components/Library/TrackCard.js';
import { CatalogCard } from '../components/Library/CatalogCard.js';
import { usePlayerStore } from '../store/playerStore.js';
import { useLocalLibraryStore } from '../store/localLibraryStore.js';
import { ArtistPageSkeleton } from '../components/SkeletonLoaders.js';
import { Play, Shuffle, Heart, Users, ArrowLeft, Info, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function sortArtistTracks(a: Track, b: Track): number {
  const albumA = a.album || '';
  const albumB = b.album || '';
  if (albumA !== albumB) {
    return albumA.localeCompare(albumB);
  }
  const discA = a.discNumber ?? 1;
  const discB = b.discNumber ?? 1;
  if (discA !== discB) {
    return discA - discB;
  }
  const hasA = a.trackNumber !== undefined && a.trackNumber !== null;
  const hasB = b.trackNumber !== undefined && b.trackNumber !== null;
  if (hasA && hasB) {
    if (a.trackNumber! !== b.trackNumber!) {
      return a.trackNumber! - b.trackNumber!;
    }
  } else if (hasA && !hasB) {
    return -1;
  } else if (!hasA && hasB) {
    return 1;
  }
  return (a.title || '').localeCompare(b.title || '');
}

export function ArtistPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [artistData, setArtistData] = useState<{ artist: Artist; tracks: Track[]; albums: Album[]; singles?: Album[]; appearsOn?: Album[] } | null>(null);
  const [allArtists, setAllArtists] = useState<Artist[]>([]);
  const [allAlbums, setAllAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);

  const {
    playTrack,
    setQueue,
    toggleShuffle,
    favoritedArtistIds,
    toggleFavoriteArtist,
    totalPlays
  } = usePlayerStore();

  const { localTracks, localAlbums, localArtists } = useLocalLibraryStore();

  useEffect(() => {
    if (!id) return;
    
    if (id.startsWith('local_artist_')) {
      const art = localArtists.find((a) => a.id === id);
      if (art) {
        const artistTracks = localTracks.filter((t) => art.tracks?.includes(t.id));
        // Deterministic sort
        artistTracks.sort(sortArtistTracks);

        const artistAlbums = localAlbums.filter((al) => art.albums?.includes(al.id));
        const artistSingles = localAlbums.filter((al) => art.singles?.includes(al.id));
        const artistAppearsOn = localAlbums.filter((al) => art.appearsOn?.includes(al.id));

        setArtistData({
          artist: art,
          tracks: artistTracks,
          albums: artistAlbums,
          singles: artistSingles,
          appearsOn: artistAppearsOn,
        });
      }
      setLoading(false);
      return;
    }

    setLoading(true);
    Promise.all([
      StaticMusicRepository.getArtistDetails(id),
      StaticMusicRepository.getArtists(),
      StaticMusicRepository.getAlbums()
    ])
      .then(([details, artists, albums]) => {
        if (details) {
          setArtistData(details);
        }
        setAllArtists(artists);
        setAllAlbums(albums);
      })
      .catch((err) => console.error('Failed to load artist details:', err))
      .finally(() => setLoading(false));
  }, [id, localTracks, localAlbums, localArtists]);

  const isFollowing = useMemo(() => {
    if (!id) return false;
    return favoritedArtistIds.includes(id);
  }, [favoritedArtistIds, id]);

  const handlePlayAlbum = (albumId: string) => {
    if (albumId.startsWith('local_album_')) {
      const localAlbum = localAlbums.find(al => al.id === albumId);
      if (localAlbum && localAlbum.tracks.length > 0) {
        const albumTracks = localAlbum.tracks
          .map(trackId => localTracks.find(t => t.id === trackId))
          .filter((t): t is Track => !!t);
        if (albumTracks.length > 0) {
          playTrack(albumTracks[0], albumTracks);
        }
      }
      return;
    }
    StaticMusicRepository.getAlbumDetails(albumId).then((res) => {
      if (res && res.tracks.length > 0) {
        playTrack(res.tracks[0], res.tracks);
      }
    });
  };

  const handlePlayAll = () => {
    if (artistData && artistData.tracks.length > 0) {
      playTrack(artistData.tracks[0], artistData.tracks);
    }
  };

  const handleShufflePlay = () => {
    if (artistData && artistData.tracks.length > 0) {
      setQueue(artistData.tracks);
      const store = usePlayerStore.getState();
      if (!store.isShuffle) {
        toggleShuffle();
      }
      const randomIndex = Math.floor(Math.random() * artistData.tracks.length);
      playTrack(artistData.tracks[randomIndex], artistData.tracks);
    }
  };

  const similarArtists = useMemo(() => {
    if (!id) return [];
    return allArtists.filter(a => a.id !== id);
  }, [allArtists, id]);

  // Unified local and catalog curation memo
  const { singles, popularTracks, displayAlbums, displayAppearsOn } = useMemo(() => {
    if (!artistData) return { singles: [], popularTracks: [], displayAlbums: [], displayAppearsOn: [] };
    
    const { artist, tracks } = artistData;

    if (id && id.startsWith('local_artist_')) {
      // Sort popular tracks by local play counts, falling back to deterministic order
      const popular = [...tracks].sort((a, b) => {
        const playsA = totalPlays[a.id] || 0;
        const playsB = totalPlays[b.id] || 0;
        if (playsB !== playsA) {
          return playsB - playsA;
        }
        return sortArtistTracks(a, b);
      }).slice(0, 5);

      return {
        singles: artistData.singles || [],
        popularTracks: popular,
        displayAlbums: artistData.albums || [],
        displayAppearsOn: artistData.appearsOn || [],
      };
    }
    
    // Catalog defaults
    const popular = tracks.slice(0, 5);
    const sgl = tracks.filter((t, idx) => idx % 2 === 1);
    
    // Appears On: albums by other artists where this artist name is featured, or other general albums
    const appearsOn = allAlbums.filter(al => al.artistName !== artist.name).slice(0, 2);
    
    return {
      singles: sgl,
      popularTracks: popular,
      displayAlbums: artistData.albums,
      displayAppearsOn: appearsOn,
    };
  }, [artistData, id, allAlbums, totalPlays]);

  if (loading) {
    return React.createElement(ArtistPageSkeleton);
  }

  if (!artistData) {
    return React.createElement(
      'div',
      { className: 'text-center py-16 font-sans' },
      React.createElement('h2', { className: 'text-xl font-bold' }, 'Artist Not Found'),
      React.createElement(
        'button',
        { onClick: () => navigate(-1), className: 'mt-ch-4 text-xs text-glorify-accent hover:underline' },
        'Go Back'
      )
    );
  }

  const { artist, tracks } = artistData;

  const mockListeners = (parseInt(artist.id.replace(/\D/g, ''), 10) || 45) * 23145 + 142050;

  return React.createElement(
    'div',
    { className: 'w-full flex flex-col gap-10 pb-32 font-sans relative overflow-hidden' },
    
    // Floating dynamic animated mesh gradient background in the artist page
    React.createElement(
      'div',
      { className: 'absolute inset-0 -z-20 pointer-events-none' },
      React.createElement(motion.div, {
        animate: {
          scale: [1, 1.15, 1],
          x: [0, 40, 0],
          y: [0, -20, 0]
        },
        transition: { repeat: Infinity, duration: 18, ease: 'easeInOut' },
        className: 'absolute top-[-10%] left-[20%] w-[350px] h-[350px] rounded-full bg-glorify-accent/5 blur-[90px]'
      }),
      React.createElement(motion.div, {
        animate: {
          scale: [1.1, 0.9, 1.1],
          x: [0, -30, 0],
          y: [0, 40, 0]
        },
        transition: { repeat: Infinity, duration: 14, ease: 'easeInOut' },
        className: 'absolute top-[30%] right-[10%] w-[400px] h-[400px] rounded-full bg-glorify-copper/5 blur-[100px]'
      })
    ),

    // Header Navigation
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

    // Large Circular Hero Avatar Banner
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
          { className: 'w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-2 border-glorify-accent/30 shadow-2xl bg-glorify-carbon-900 flex-shrink-0' },
          artist.avatarUrl
            ? React.createElement('img', { src: artist.avatarUrl, alt: artist.name, className: 'w-full h-full object-cover transition-transform duration-700 hover:scale-105' })
            : React.createElement(Users, { className: 'w-16 h-16 text-glorify-text-muted mt-8' })
        ),
        React.createElement(
          'div',
          { className: 'flex flex-col gap-ch-2 mt-ch-4 md:mt-0' },
          React.createElement(
            'span',
            { className: 'text-[10px] font-bold text-glorify-accent tracking-widest uppercase' },
            id?.startsWith('local_artist_') ? 'LOCAL ARTIST' : 'VERIFIED ARTIST'
          ),
          React.createElement('h1', { className: 'text-4xl md:text-6xl font-extrabold tracking-tight text-glorify-text-primary leading-none' }, artist.name),
          
          React.createElement(
            'div',
            { className: 'flex items-center justify-center md:justify-start gap-2 text-xs text-glorify-text-secondary font-medium mt-1' },
            !id?.startsWith('local_artist_')
              ? React.createElement('span', { className: 'text-glorify-text-primary font-semibold' }, `${mockListeners.toLocaleString()} monthly listeners`)
              : React.createElement('span', { className: 'text-glorify-text-primary font-semibold' }, `${tracks.length} track${tracks.length === 1 ? '' : 's'} · ${displayAlbums.length + (singles?.length || 0)} release${(displayAlbums.length + (singles?.length || 0)) === 1 ? '' : 's'}`),
            React.createElement('span', null, '•'),
            React.createElement('span', { className: 'uppercase tracking-widest text-[10px] font-bold text-glorify-accent/80' }, artist.genres.join(' / '))
          )
        )
      ),

      // Background image mesh blur
      artist.avatarUrl &&
        React.createElement('div', {
          className: 'absolute inset-0 -z-10 bg-cover bg-center opacity-[0.05] blur-2xl scale-105 pointer-events-none',
          style: { backgroundImage: `url(${artist.avatarUrl})` }
        })
    ),

    // Controls Toolbar (Sticky top)
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
          onClick: () => toggleFavoriteArtist(artist.id),
          whileHover: { scale: 1.05 },
          whileTap: { scale: 0.95 },
          className: `px-ch-6 py-3 rounded-full border text-xs font-bold transition-all cursor-pointer shadow-sm ${
            isFollowing 
              ? 'bg-glorify-accent text-glorify-carbon-950 border-glorify-accent font-semibold shadow-md' 
              : 'border-glorify-border-primary text-glorify-text-secondary hover:text-glorify-text-primary'
          }`
        },
        isFollowing ? 'Following' : 'Follow'
      )
    ),

    // Grid layout: Compositions & Biography
    React.createElement(
      'div',
      { className: 'grid grid-cols-1 lg:grid-cols-3 gap-10 z-10' },
      
      // Left: Popular Songs
      React.createElement(
        'div',
        { className: 'lg:col-span-2 flex flex-col gap-ch-4' },
        React.createElement('h2', { className: 'text-lg font-bold text-glorify-text-primary pl-ch-1' }, 'Popular Compositions'),
        React.createElement(
          'div',
          { className: 'flex flex-col bg-glorify-bg-surface/20 border border-glorify-border-primary/5 rounded-[24px] p-ch-3 shadow-sm' },
          popularTracks.map((track, idx) =>
            React.createElement(TrackCard, {
              key: track.id,
              track: track,
              index: idx,
              queueContext: tracks,
              onGoToAlbum: (albumId) => navigate(`/album/${albumId}`)
            })
          )
        )
      ),

      // Right: About biography
      React.createElement(
        'div',
        { className: 'lg:col-span-1 flex flex-col gap-ch-4' },
        React.createElement(
          'div',
          { className: 'flex items-center gap-2 pl-ch-1 text-glorify-text-primary' },
          React.createElement(Info, { className: 'w-4 h-4 text-glorify-accent' }),
          React.createElement('h2', { className: 'text-lg font-bold' }, 'Biography')
        ),
        React.createElement(
          'div',
          { className: 'p-ch-6 rounded-[24px] bg-glorify-bg-surface/30 border border-glorify-border-primary/10 shadow-sm leading-relaxed text-xs text-glorify-text-secondary' },
          React.createElement('p', null, artist.bio || 'No verified biography loaded for this artist catalog entry.')
        )
      )
    ),

    // Albums Section
    displayAlbums.length > 0 &&
      React.createElement(
        'div',
        { className: 'flex flex-col gap-ch-4 z-10' },
        React.createElement('h2', { className: 'text-lg font-bold text-glorify-text-primary pl-ch-1' }, 'Albums'),
        React.createElement(
          'div',
          { className: 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-ch-6' },
          displayAlbums.map((album) =>
            React.createElement(CatalogCard, {
              key: album.id,
              id: album.id,
              title: album.title,
              subtitle: `${album.releaseYear} • Album`,
              type: 'album',
              coverUrl: album.coverUrl,
              onClick: () => navigate(`/album/${album.id}`),
              onPlayClick: (e) => {
                e.stopPropagation();
                if (album.id.startsWith('local_album_')) {
                  handlePlayAlbum(album.id);
                } else {
                  StaticMusicRepository.getAlbumDetails(album.id).then((res) => {
                    if (res && res.tracks.length > 0) playTrack(res.tracks[0], res.tracks);
                  });
                }
              }
            })
          )
        )
      ),

    // Singles Section
    singles.length > 0 &&
      React.createElement(
        'div',
        { className: 'flex flex-col gap-ch-4 z-10' },
        React.createElement('h2', { className: 'text-lg font-bold text-glorify-text-primary pl-ch-1' }, 'Singles & EPs'),
        React.createElement(
          'div',
          { className: 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-ch-6' },
          singles.map((item) => {
            const isAlbum = 'coverUrl' in item;
            const title = isAlbum ? (item as Album).title : (item as Track).title;
            const itemKey = isAlbum ? (item as Album).id : (item as Track).id;
            const coverUrl = isAlbum ? (item as Album).coverUrl : (item as Track).coverImage;
            
            return React.createElement(CatalogCard, {
              key: 'single-' + itemKey,
              id: itemKey,
              title: title,
              subtitle: 'Single EP',
              type: 'album',
              coverUrl: coverUrl,
              onClick: () => {
                if (isAlbum) {
                  navigate(`/album/${itemKey}`);
                } else {
                  playTrack(item as Track, tracks);
                }
              },
              onPlayClick: (e) => {
                e.stopPropagation();
                if (isAlbum) {
                  handlePlayAlbum(itemKey);
                } else {
                  playTrack(item as Track, tracks);
                }
              }
            });
          })
        )
      ),

    // Appears On Section (Collabs & Features)
    displayAppearsOn.length > 0 &&
      React.createElement(
        'div',
        { className: 'flex flex-col gap-ch-4 z-10' },
        React.createElement('h2', { className: 'text-lg font-bold text-glorify-text-primary pl-ch-1' }, 'Appears On'),
        React.createElement(
          'div',
          { className: 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-ch-6' },
          displayAppearsOn.map((album) =>
            React.createElement(CatalogCard, {
              key: 'appears-' + album.id,
              id: album.id,
              title: album.title,
              subtitle: `${album.artistName || 'Various Artists'} • Album`,
              type: 'album',
              coverUrl: album.coverUrl,
              onClick: () => navigate(`/album/${album.id}`),
              onPlayClick: (e) => {
                e.stopPropagation();
                if (album.id.startsWith('local_album_')) {
                  handlePlayAlbum(album.id);
                } else {
                  StaticMusicRepository.getAlbumDetails(album.id).then((res) => {
                    if (res && res.tracks.length > 0) playTrack(res.tracks[0], res.tracks);
                  });
                }
              }
            })
          )
        )
      ),

    // Similar Artists Section
    similarArtists.length > 0 &&
      React.createElement(
        'div',
        { className: 'flex flex-col gap-ch-4 z-10' },
        React.createElement('h2', { className: 'text-lg font-bold text-glorify-text-primary pl-ch-1' }, 'Similar Artists'),
        React.createElement(
          'div',
          { className: 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-ch-6' },
          similarArtists.map((simArtist) =>
            React.createElement(CatalogCard, {
              key: simArtist.id,
              id: simArtist.id,
              title: simArtist.name,
              subtitle: simArtist.genres.join(' / ').toUpperCase(),
              type: 'artist',
              coverUrl: simArtist.avatarUrl,
              onClick: () => navigate(`/artist/${simArtist.id}`),
              onPlayClick: (e) => {
                e.stopPropagation();
                StaticMusicRepository.getArtistDetails(simArtist.id).then((res) => {
                  if (res && res.tracks.length > 0) playTrack(res.tracks[0], res.tracks);
                });
              }
            })
          )
        )
      )
  );
}
