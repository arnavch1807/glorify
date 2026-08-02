import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlayerStore } from '../store/playerStore.js';
import { StaticMusicRepository } from '../repositories/musicRepository.js';
import { CatalogCard } from '../components/Library/CatalogCard.js';
import { Play, Sparkles, Heart, Clock, Music, TrendingUp, Compass, Award, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { HomeSkeleton } from '../components/SkeletonLoaders.js';
export function Home() {
    const navigate = useNavigate();
    const { playTrack, previousQueue, playlists, currentTrack, listeningHistory, favoritedArtistIds } = usePlayerStore();
    const [tracks, setTracks] = useState([]);
    const [albums, setAlbums] = useState([]);
    const [artists, setArtists] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const loadCatalog = async () => {
            try {
                setLoading(true);
                const [t, al, ar] = await Promise.all([
                    StaticMusicRepository.getTracks(),
                    StaticMusicRepository.getAlbums(),
                    StaticMusicRepository.getArtists(),
                ]);
                setTracks(t);
                setAlbums(al);
                setArtists(ar);
            }
            catch (err) {
                console.error('Failed to load home page content:', err);
            }
            finally {
                setLoading(false);
            }
        };
        loadCatalog();
    }, []);
    // Time-based greeting helper
    const greeting = useMemo(() => {
        const hours = new Date().getHours();
        if (hours < 12)
            return 'Good morning';
        if (hours < 17)
            return 'Good afternoon';
        return 'Good evening';
    }, []);
    // Top 6 items for the grid
    const quickAccessItems = useMemo(() => {
        const items = [];
        playlists.forEach(p => {
            if (items.length < 6) {
                items.push({
                    id: p.id,
                    title: p.name,
                    coverUrl: p.coverImage || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=200&auto=format&fit=crop&q=80',
                    type: 'playlist'
                });
            }
        });
        albums.forEach(a => {
            if (items.length < 6) {
                items.push({
                    id: a.id,
                    title: a.title,
                    coverUrl: a.coverUrl || 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=200&auto=format&fit=crop&q=80',
                    type: 'album'
                });
            }
        });
        artists.forEach(art => {
            if (items.length < 6) {
                items.push({
                    id: art.id,
                    title: art.name,
                    coverUrl: art.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
                    type: 'artist'
                });
            }
        });
        return items;
    }, [playlists, albums, artists]);
    // Featured recommendation track
    const featuredTrack = useMemo(() => {
        return tracks[0] || null;
    }, [tracks]);
    // Unique sliced datasets for the 10 horizontal rows
    const recentlyPlayedTracks = useMemo(() => {
        if (listeningHistory && listeningHistory.length > 0) {
            const historyIds = listeningHistory.map(item => item.trackId);
            const uniqueIds = Array.from(new Set(historyIds));
            return uniqueIds.map(id => tracks.find(t => t.id === id)).filter(Boolean);
        }
        return tracks.slice(2, 6);
    }, [tracks, listeningHistory]);
    const jumpBackInTracks = useMemo(() => {
        return tracks.slice(4, 9);
    }, [tracks]);
    const becauseYouListenedTrack = useMemo(() => {
        return recentlyPlayedTracks[0] || tracks[1] || null;
    }, [recentlyPlayedTracks, tracks]);
    const becauseYouListenedTracks = useMemo(() => {
        if (!becauseYouListenedTrack)
            return [];
        return tracks.filter(t => t.id !== becauseYouListenedTrack.id).slice(0, 5);
    }, [becauseYouListenedTrack, tracks]);
    const trendingAlbums = useMemo(() => {
        return albums.slice(0, 5);
    }, [albums]);
    const newReleases = useMemo(() => {
        return albums.slice().reverse().slice(0, 5);
    }, [albums]);
    const chartsTracks = useMemo(() => {
        return tracks.slice(1, 6);
    }, [tracks]);
    const artistsYouLike = useMemo(() => {
        const liked = artists.filter(a => favoritedArtistIds.includes(a.id));
        return liked.length > 0 ? liked : artists.slice(0, 5);
    }, [artists, favoritedArtistIds]);
    const popularThisWeek = useMemo(() => {
        return tracks.slice(2, 7);
    }, [tracks]);
    const continueListeningTracks = useMemo(() => {
        return tracks.slice(0, 5);
    }, [tracks]);
    // Handlers
    const handlePlayAlbum = (albumId) => {
        StaticMusicRepository.getAlbumDetails(albumId).then((res) => {
            if (res && res.tracks.length > 0)
                playTrack(res.tracks[0], res.tracks);
        });
    };
    const handlePlayArtist = (artistId) => {
        StaticMusicRepository.getArtistDetails(artistId).then((res) => {
            if (res && res.tracks.length > 0)
                playTrack(res.tracks[0], res.tracks);
        });
    };
    const handlePlayPlaylist = (playlistId) => {
        const playlist = playlists.find((p) => p.id === playlistId);
        if (playlist && playlist.songs.length > 0) {
            const playlistTracks = tracks.filter((t) => playlist.songs.includes(t.id));
            if (playlistTracks.length > 0)
                playTrack(playlistTracks[0], playlistTracks);
        }
    };
    const handleQuickAccessPlay = (e, item) => {
        e.stopPropagation();
        if (item.type === 'album')
            handlePlayAlbum(item.id);
        else if (item.type === 'artist')
            handlePlayArtist(item.id);
        else if (item.type === 'playlist')
            handlePlayPlaylist(item.id);
    };
    if (loading) {
        return React.createElement(HomeSkeleton);
    }
    // Stagger entry configurations
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.05 }
        }
    };
    const itemVariants = {
        hidden: { opacity: 0, y: 15 },
        show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 220, damping: 22 } }
    };
    return React.createElement('div', { className: 'w-full flex flex-col gap-12 mt-4 pb-32 font-sans' }, 
    // Apple Music-inspired recommendation hero banner
    featuredTrack &&
        React.createElement(motion.div, {
            initial: { opacity: 0, y: 15 },
            animate: { opacity: 1, y: 0 },
            transition: { type: 'spring', damping: 25, stiffness: 200 },
            className: 'relative w-full rounded-[28px] overflow-hidden bg-gradient-to-r from-glorify-accent/20 via-glorify-copper/10 to-glorify-bg-surface/30 border border-glorify-border-primary/5 shadow-md backdrop-blur-md p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6'
        }, React.createElement('div', { className: 'flex flex-col gap-3 max-w-md z-10 text-left' }, React.createElement('span', { className: 'text-[10px] font-bold text-glorify-accent tracking-widest uppercase' }, 'Featured Release'), React.createElement('h1', { className: 'text-3xl md:text-5xl font-extrabold tracking-tight text-glorify-text-primary leading-tight' }, featuredTrack.title), React.createElement('p', { className: 'text-sm text-glorify-text-secondary font-medium' }, `By ${featuredTrack.artist} • Track of the week`), React.createElement('div', { className: 'flex items-center gap-3 mt-2' }, React.createElement(motion.button, {
            onClick: () => playTrack(featuredTrack, tracks),
            whileHover: { scale: 1.05 },
            whileTap: { scale: 0.95 },
            className: 'px-ch-6 py-3 rounded-[14px] bg-glorify-accent text-glorify-carbon-950 text-xs font-bold flex items-center gap-ch-2 shadow-lg cursor-pointer outline-none hover:shadow-xl'
        }, React.createElement(Play, { className: 'w-ch-4 h-ch-4 fill-currentColor pl-0.5' }), 'Play Now'))), React.createElement('div', { className: 'relative z-10 flex-shrink-0' }, React.createElement('img', {
            src: featuredTrack.coverImage,
            alt: featuredTrack.title,
            className: 'w-40 h-40 md:w-48 md:h-48 rounded-[20px] object-cover shadow-2xl transition-transform duration-700 hover:scale-105'
        }))), 
    // Good Evening Grid Section
    React.createElement('div', { className: 'flex flex-col gap-4' }, React.createElement('h2', { className: 'text-2xl font-extrabold tracking-tight text-glorify-text-primary pl-1' }, `${greeting}`), React.createElement('div', { className: 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6' }, quickAccessItems.map((item) => React.createElement(motion.div, {
        key: item.id + '-' + item.type,
        onClick: () => navigate(`/${item.type}/${item.id}`),
        whileHover: { scale: 1.02, y: -2 },
        whileTap: { scale: 0.98 },
        className: 'group flex items-center bg-glorify-bg-surface/40 hover:bg-glorify-bg-surface/80 border border-transparent rounded-[22px] overflow-hidden transition-all duration-300 cursor-pointer shadow-sm select-none relative pr-12 hover:shadow-md'
    }, React.createElement('img', {
        src: item.coverUrl,
        alt: item.title,
        className: 'w-20 h-20 object-cover flex-shrink-0 border-r border-white/5'
    }), React.createElement('span', { className: 'pl-4 text-sm font-semibold text-glorify-text-primary truncate' }, item.title), React.createElement(motion.button, {
        onClick: (e) => handleQuickAccessPlay(e, item),
        whileHover: { scale: 1.1 },
        whileTap: { scale: 0.9 },
        className: 'absolute right-4 w-9 h-9 rounded-full bg-glorify-accent text-glorify-carbon-950 flex items-center justify-center shadow-lg opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 cursor-pointer outline-none z-10'
    }, React.createElement(Play, { className: 'w-ch-4.5 h-ch-4.5 fill-currentColor pl-0.5' })))))), 
    // Discovery Sections Wrapper (Strict Order - 10 Curated Horizontal Rows)
    React.createElement(motion.div, {
        variants: containerVariants,
        initial: 'hidden',
        animate: 'show',
        className: 'flex flex-col gap-12'
    }, 
    // 1. Recently Played
    recentlyPlayedTracks.length > 0 &&
        React.createElement(motion.div, { variants: itemVariants, className: 'flex flex-col gap-4' }, React.createElement('h2', { className: 'text-2xl font-extrabold tracking-tight text-glorify-text-primary pl-1' }, 'Recently played'), React.createElement('div', { className: 'flex gap-6 overflow-x-auto scrollbar-none py-2 px-1' }, recentlyPlayedTracks.map((track) => React.createElement(motion.div, {
            key: 'recent-' + track.id,
            onClick: () => playTrack(track, tracks),
            whileHover: { scale: 1.03, y: -4 },
            whileTap: { scale: 0.97 },
            className: 'group w-44 flex-shrink-0 p-4 rounded-[22px] card-warm-gradient shadow-sm relative overflow-hidden cursor-pointer select-none'
        }, React.createElement('div', { className: 'w-full aspect-square bg-glorify-bg-secondary/60 rounded-[20px] relative overflow-hidden flex items-center justify-center' }, track.coverImage
            ? React.createElement('img', { src: track.coverImage, alt: track.title, className: 'w-full h-full object-cover transition-transform duration-500 group-hover:scale-110' })
            : React.createElement(Music, { className: 'w-ch-6 h-ch-6 text-glorify-text-muted/60' }), React.createElement('div', { className: 'absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none' }), React.createElement(motion.button, {
            onClick: (e) => {
                e.stopPropagation();
                playTrack(track, tracks);
            },
            whileHover: { scale: 1.1 },
            whileTap: { scale: 0.9 },
            className: 'absolute bottom-3 right-3 w-10 h-10 rounded-full bg-glorify-accent text-glorify-carbon-950 flex items-center justify-center shadow-lg opacity-0 scale-90 translate-y-2 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0 transition-all duration-300 cursor-pointer outline-none z-10'
        }, React.createElement(Play, { className: 'w-ch-4.5 h-ch-4.5 fill-currentColor pl-0.5' }))), React.createElement('div', { className: 'mt-3 text-left px-1' }, React.createElement('div', { className: 'text-xs font-semibold text-glorify-text-primary truncate' }, track.title), React.createElement('div', { className: 'text-[10px] text-glorify-text-muted truncate mt-0.5 font-normal' }, track.artist)))))), 
    // 2. Jump Back In
    jumpBackInTracks.length > 0 &&
        React.createElement(motion.div, { variants: itemVariants, className: 'flex flex-col gap-4' }, React.createElement('h2', { className: 'text-2xl font-extrabold tracking-tight text-glorify-text-primary pl-1' }, 'Jump back in'), React.createElement('div', { className: 'flex gap-6 overflow-x-auto scrollbar-none py-2 px-1' }, jumpBackInTracks.map((track) => React.createElement(motion.div, {
            key: 'jump-' + track.id,
            onClick: () => playTrack(track, tracks),
            whileHover: { scale: 1.03, y: -4 },
            whileTap: { scale: 0.97 },
            className: 'group w-44 flex-shrink-0 p-4 rounded-[22px] card-warm-gradient shadow-sm relative overflow-hidden cursor-pointer select-none'
        }, React.createElement('div', { className: 'w-full aspect-square bg-glorify-bg-secondary/60 rounded-[20px] relative overflow-hidden flex items-center justify-center' }, track.coverImage
            ? React.createElement('img', { src: track.coverImage, alt: track.title, className: 'w-full h-full object-cover transition-transform duration-500 group-hover:scale-110' })
            : React.createElement(Music, { className: 'w-ch-6 h-ch-6 text-glorify-text-muted/60' }), React.createElement('div', { className: 'absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none' }), React.createElement(motion.button, {
            onClick: (e) => {
                e.stopPropagation();
                playTrack(track, tracks);
            },
            whileHover: { scale: 1.1 },
            whileTap: { scale: 0.9 },
            className: 'absolute bottom-3 right-3 w-10 h-10 rounded-full bg-glorify-accent text-glorify-carbon-950 flex items-center justify-center shadow-lg opacity-0 scale-90 translate-y-2 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0 transition-all duration-300 cursor-pointer outline-none z-10'
        }, React.createElement(Play, { className: 'w-ch-4.5 h-ch-4.5 fill-currentColor pl-0.5' }))), React.createElement('div', { className: 'mt-3 text-left px-1' }, React.createElement('div', { className: 'text-xs font-semibold text-glorify-text-primary truncate' }, track.title), React.createElement('div', { className: 'text-[10px] text-glorify-text-muted truncate mt-0.5 font-normal' }, track.artist)))))), 
    // 3. Made For You
    playlists.length > 0 &&
        React.createElement(motion.div, { variants: itemVariants, className: 'flex flex-col gap-4' }, React.createElement('h2', { className: 'text-2xl font-extrabold tracking-tight text-glorify-text-primary pl-1' }, 'Made for you'), React.createElement('div', { className: 'flex gap-6 overflow-x-auto scrollbar-none py-2 px-1' }, playlists.map((playlist) => React.createElement('div', { key: 'madefor-' + playlist.id, className: 'w-48 flex-shrink-0' }, React.createElement(CatalogCard, {
            id: playlist.id,
            title: playlist.name,
            subtitle: 'Playlist',
            type: 'playlist',
            coverUrl: playlist.coverImage,
            onClick: () => navigate(`/playlist/${playlist.id}`),
            onPlayClick: (e) => {
                e.stopPropagation();
                handlePlayPlaylist(playlist.id);
            }
        }))))), 
    // 4. Because You Listened To [Track/Artist Name]
    becauseYouListenedTrack && becauseYouListenedTracks.length > 0 &&
        React.createElement(motion.div, { variants: itemVariants, className: 'flex flex-col gap-4' }, React.createElement('h2', { className: 'text-2xl font-extrabold tracking-tight text-glorify-text-primary pl-1 flex items-center gap-2' }, React.createElement(Sparkles, { className: 'w-5 h-5 text-glorify-accent' }), `Because you listened to ${becauseYouListenedTrack.title}`), React.createElement('div', { className: 'flex gap-6 overflow-x-auto scrollbar-none py-2 px-1' }, becauseYouListenedTracks.map((track) => React.createElement(motion.div, {
            key: 'because-' + track.id,
            onClick: () => playTrack(track, tracks),
            whileHover: { scale: 1.03, y: -4 },
            whileTap: { scale: 0.97 },
            className: 'group w-44 flex-shrink-0 p-4 rounded-[22px] card-warm-gradient shadow-sm relative overflow-hidden cursor-pointer select-none'
        }, React.createElement('div', { className: 'w-full aspect-square bg-glorify-bg-secondary/60 rounded-[20px] relative overflow-hidden flex items-center justify-center' }, track.coverImage
            ? React.createElement('img', { src: track.coverImage, alt: track.title, className: 'w-full h-full object-cover transition-transform duration-500 group-hover:scale-110' })
            : React.createElement(Music, { className: 'w-ch-6 h-ch-6 text-glorify-text-muted/60' }), React.createElement('div', { className: 'absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none' }), React.createElement(motion.button, {
            onClick: (e) => {
                e.stopPropagation();
                playTrack(track, tracks);
            },
            whileHover: { scale: 1.1 },
            whileTap: { scale: 0.9 },
            className: 'absolute bottom-3 right-3 w-10 h-10 rounded-full bg-glorify-accent text-glorify-carbon-950 flex items-center justify-center shadow-lg opacity-0 scale-90 translate-y-2 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0 transition-all duration-300 cursor-pointer outline-none z-10'
        }, React.createElement(Play, { className: 'w-ch-4.5 h-ch-4.5 fill-currentColor pl-0.5' }))), React.createElement('div', { className: 'mt-3 text-left px-1' }, React.createElement('div', { className: 'text-xs font-semibold text-glorify-text-primary truncate' }, track.title), React.createElement('div', { className: 'text-[10px] text-glorify-text-muted truncate mt-0.5 font-normal' }, track.artist)))))), 
    // 5. Trending
    trendingAlbums.length > 0 &&
        React.createElement(motion.div, { variants: itemVariants, className: 'flex flex-col gap-4' }, React.createElement('h2', { className: 'text-2xl font-extrabold tracking-tight text-glorify-text-primary pl-1 flex items-center gap-2' }, React.createElement(TrendingUp, { className: 'w-5 h-5 text-glorify-accent' }), 'Trending'), React.createElement('div', { className: 'flex gap-6 overflow-x-auto scrollbar-none py-2 px-1' }, trendingAlbums.map((album) => React.createElement('div', { key: 'trending-' + album.id, className: 'w-48 flex-shrink-0' }, React.createElement(CatalogCard, {
            id: album.id,
            title: album.title,
            subtitle: album.artistName,
            type: 'album',
            coverUrl: album.coverUrl,
            year: album.releaseYear,
            onClick: () => navigate(`/album/${album.id}`),
            onPlayClick: (e) => {
                e.stopPropagation();
                handlePlayAlbum(album.id);
            }
        }))))), 
    // 6. New Releases
    newReleases.length > 0 &&
        React.createElement(motion.div, { variants: itemVariants, className: 'flex flex-col gap-4' }, React.createElement('h2', { className: 'text-2xl font-extrabold tracking-tight text-glorify-text-primary pl-1 flex items-center gap-2' }, React.createElement(Compass, { className: 'w-5 h-5 text-glorify-accent' }), 'New releases'), React.createElement('div', { className: 'flex gap-6 overflow-x-auto scrollbar-none py-2 px-1' }, newReleases.map((album) => React.createElement('div', { key: 'new-release-' + album.id, className: 'w-48 flex-shrink-0' }, React.createElement(CatalogCard, {
            id: album.id,
            title: album.title,
            subtitle: album.artistName,
            type: 'album',
            coverUrl: album.coverUrl,
            year: album.releaseYear,
            onClick: () => navigate(`/album/${album.id}`),
            onPlayClick: (e) => {
                e.stopPropagation();
                handlePlayAlbum(album.id);
            }
        }))))), 
    // 7. Charts
    chartsTracks.length > 0 &&
        React.createElement(motion.div, { variants: itemVariants, className: 'flex flex-col gap-4' }, React.createElement('h2', { className: 'text-2xl font-extrabold tracking-tight text-glorify-text-primary pl-1 flex items-center gap-2' }, React.createElement(Award, { className: 'w-5 h-5 text-glorify-accent' }), 'Charts'), React.createElement('div', { className: 'flex gap-6 overflow-x-auto scrollbar-none py-2 px-1' }, chartsTracks.map((track) => React.createElement(motion.div, {
            key: 'chart-' + track.id,
            onClick: () => playTrack(track, tracks),
            whileHover: { scale: 1.03, y: -4 },
            whileTap: { scale: 0.97 },
            className: 'group w-44 flex-shrink-0 p-4 rounded-[22px] card-warm-gradient shadow-sm relative overflow-hidden cursor-pointer select-none'
        }, React.createElement('div', { className: 'w-full aspect-square bg-glorify-bg-secondary/60 rounded-[20px] relative overflow-hidden flex items-center justify-center' }, track.coverImage
            ? React.createElement('img', { src: track.coverImage, alt: track.title, className: 'w-full h-full object-cover transition-transform duration-500 group-hover:scale-110' })
            : React.createElement(Music, { className: 'w-ch-6 h-ch-6 text-glorify-text-muted/60' }), React.createElement('div', { className: 'absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none' }), React.createElement(motion.button, {
            onClick: (e) => {
                e.stopPropagation();
                playTrack(track, tracks);
            },
            whileHover: { scale: 1.1 },
            whileTap: { scale: 0.9 },
            className: 'absolute bottom-3 right-3 w-10 h-10 rounded-full bg-glorify-accent text-glorify-carbon-950 flex items-center justify-center shadow-lg opacity-0 scale-90 translate-y-2 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0 transition-all duration-300 cursor-pointer outline-none z-10'
        }, React.createElement(Play, { className: 'w-ch-4.5 h-ch-4.5 fill-currentColor pl-0.5' }))), React.createElement('div', { className: 'mt-3 text-left px-1' }, React.createElement('div', { className: 'text-xs font-semibold text-glorify-text-primary truncate' }, track.title), React.createElement('div', { className: 'text-[10px] text-glorify-text-muted truncate mt-0.5 font-normal' }, track.artist)))))), 
    // 8. Artists You Like
    artistsYouLike.length > 0 &&
        React.createElement(motion.div, { variants: itemVariants, className: 'flex flex-col gap-4' }, React.createElement('h2', { className: 'text-2xl font-extrabold tracking-tight text-glorify-text-primary pl-1 flex items-center gap-2' }, React.createElement(Heart, { className: 'w-5 h-5 text-glorify-accent fill-currentColor' }), 'Artists you like'), React.createElement('div', { className: 'flex gap-6 overflow-x-auto scrollbar-none py-2 px-1' }, artistsYouLike.map((artist) => React.createElement('div', { key: 'artist-like-' + artist.id, className: 'w-48 flex-shrink-0' }, React.createElement(CatalogCard, {
            id: artist.id,
            title: artist.name,
            subtitle: artist.genres.join(' • '),
            type: 'artist',
            coverUrl: artist.avatarUrl,
            onClick: () => navigate(`/artist/${artist.id}`),
            onPlayClick: (e) => {
                e.stopPropagation();
                handlePlayArtist(artist.id);
            }
        }))))), 
    // 9. Popular This Week
    popularThisWeek.length > 0 &&
        React.createElement(motion.div, { variants: itemVariants, className: 'flex flex-col gap-4' }, React.createElement('h2', { className: 'text-2xl font-extrabold tracking-tight text-glorify-text-primary pl-1 flex items-center gap-2' }, React.createElement(Star, { className: 'w-5 h-5 text-glorify-accent' }), 'Popular this week'), React.createElement('div', { className: 'flex gap-6 overflow-x-auto scrollbar-none py-2 px-1' }, popularThisWeek.map((track) => React.createElement(motion.div, {
            key: 'popular-week-' + track.id,
            onClick: () => playTrack(track, tracks),
            whileHover: { scale: 1.03, y: -4 },
            whileTap: { scale: 0.97 },
            className: 'group w-44 flex-shrink-0 p-4 rounded-[22px] card-warm-gradient shadow-sm relative overflow-hidden cursor-pointer select-none'
        }, React.createElement('div', { className: 'w-full aspect-square bg-glorify-bg-secondary/60 rounded-[20px] relative overflow-hidden flex items-center justify-center' }, track.coverImage
            ? React.createElement('img', { src: track.coverImage, alt: track.title, className: 'w-full h-full object-cover transition-transform duration-500 group-hover:scale-110' })
            : React.createElement(Music, { className: 'w-ch-6 h-ch-6 text-glorify-text-muted/60' }), React.createElement('div', { className: 'absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none' }), React.createElement(motion.button, {
            onClick: (e) => {
                e.stopPropagation();
                playTrack(track, tracks);
            },
            whileHover: { scale: 1.1 },
            whileTap: { scale: 0.9 },
            className: 'absolute bottom-3 right-3 w-10 h-10 rounded-full bg-glorify-accent text-glorify-carbon-950 flex items-center justify-center shadow-lg opacity-0 scale-90 translate-y-2 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0 transition-all duration-300 cursor-pointer outline-none z-10'
        }, React.createElement(Play, { className: 'w-ch-4.5 h-ch-4.5 fill-currentColor pl-0.5' }))), React.createElement('div', { className: 'mt-3 text-left px-1' }, React.createElement('div', { className: 'text-xs font-semibold text-glorify-text-primary truncate' }, track.title), React.createElement('div', { className: 'text-[10px] text-glorify-text-muted truncate mt-0.5 font-normal' }, track.artist)))))), 
    // 10. Continue Listening
    continueListeningTracks.length > 0 &&
        React.createElement(motion.div, { variants: itemVariants, className: 'flex flex-col gap-4' }, React.createElement('h2', { className: 'text-2xl font-extrabold tracking-tight text-glorify-text-primary pl-1 flex items-center gap-2' }, React.createElement(Clock, { className: 'w-5 h-5 text-glorify-accent' }), 'Continue listening'), React.createElement('div', { className: 'flex gap-6 overflow-x-auto scrollbar-none py-2 px-1' }, continueListeningTracks.map((track) => React.createElement(motion.div, {
            key: 'continue-row-' + track.id,
            onClick: () => playTrack(track, tracks),
            whileHover: { scale: 1.03, y: -4 },
            whileTap: { scale: 0.97 },
            className: 'group w-44 flex-shrink-0 p-4 rounded-[22px] card-warm-gradient shadow-sm relative overflow-hidden cursor-pointer select-none'
        }, React.createElement('div', { className: 'w-full aspect-square bg-glorify-bg-secondary/60 rounded-[20px] relative overflow-hidden flex items-center justify-center' }, track.coverImage
            ? React.createElement('img', { src: track.coverImage, alt: track.title, className: 'w-full h-full object-cover transition-transform duration-500 group-hover:scale-110' })
            : React.createElement(Music, { className: 'w-ch-6 h-ch-6 text-glorify-text-muted/60' }), React.createElement('div', { className: 'absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none' }), React.createElement(motion.button, {
            onClick: (e) => {
                e.stopPropagation();
                playTrack(track, tracks);
            },
            whileHover: { scale: 1.1 },
            whileTap: { scale: 0.9 },
            className: 'absolute bottom-3 right-3 w-10 h-10 rounded-full bg-glorify-accent text-glorify-carbon-950 flex items-center justify-center shadow-lg opacity-0 scale-90 translate-y-2 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0 transition-all duration-300 cursor-pointer outline-none z-10'
        }, React.createElement(Play, { className: 'w-ch-4.5 h-ch-4.5 fill-currentColor pl-0.5' }))), React.createElement('div', { className: 'mt-3 text-left px-1' }, React.createElement('div', { className: 'text-xs font-semibold text-glorify-text-primary truncate' }, track.title), React.createElement('div', { className: 'text-[10px] text-glorify-text-muted truncate mt-0.5 font-normal' }, track.artist))))))));
}
//# sourceMappingURL=Home.js.map