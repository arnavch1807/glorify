import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { StaticMusicRepository } from '../repositories/musicRepository.js';
import { TrackCard } from '../components/Library/TrackCard.js';
import { CatalogCard } from '../components/Library/CatalogCard.js';
import { PlaylistDialog } from '../components/Library/PlaylistDialog.js';
import { usePlayerStore } from '../store/playerStore.js';
import { Music, Disc, Users, Plus, ListMusic, Search, Heart, LayoutGrid, List, Pin, SlidersHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LibrarySkeleton } from '../components/SkeletonLoaders.js';
import { NoDownloads, NoFavorites, NoPlaylists } from '../components/EmptyStates.js';
export function Library() {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const rawTab = searchParams.get('tab');
    const activeTab = ['songs', 'albums', 'artists', 'playlists', 'liked', 'downloads'].includes(rawTab) ? rawTab : 'songs';
    const [tracks, setTracks] = useState([]);
    const [albums, setAlbums] = useState([]);
    const [artists, setArtists] = useState([]);
    const [query, setQuery] = useState('');
    const [sortBy, setSortBy] = useState('alphabetical');
    // Layout states
    const [viewMode, setViewMode] = useState('grid');
    const [cardSize, setCardSize] = useState(170); // Minmax width slider
    // Pinned playlists state loaded/saved to local storage
    const [pinnedPlaylistIds, setPinnedPlaylistIds] = useState(() => {
        try {
            const saved = localStorage.getItem('glorify-pinned-playlists');
            return saved ? JSON.parse(saved) : [];
        }
        catch (e) {
            return [];
        }
    });
    const [loading, setLoading] = useState(true);
    const { playlists, createPlaylist, playTrack, favoritedTrackIds, favoritedAlbumIds, favoritedArtistIds, downloadedTrackIds } = usePlayerStore();
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const handlePlayAlbum = (albumId) => {
        StaticMusicRepository.getAlbumDetails(albumId).then((res) => {
            if (res && res.tracks.length > 0) {
                playTrack(res.tracks[0], res.tracks);
            }
        });
    };
    const handlePlayArtist = (artistId) => {
        StaticMusicRepository.getArtistDetails(artistId).then((res) => {
            if (res && res.tracks.length > 0) {
                playTrack(res.tracks[0], res.tracks);
            }
        });
    };
    const handlePlayPlaylist = (playlistId) => {
        const playlist = playlists.find((p) => p.id === playlistId);
        if (playlist && playlist.songs.length > 0) {
            const playlistTracks = tracks.filter((t) => playlist.songs.includes(t.id));
            if (playlistTracks.length > 0) {
                playTrack(playlistTracks[0], playlistTracks);
            }
        }
    };
    useEffect(() => {
        const loadData = async () => {
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
                if (playlists.length === 0) {
                    createPlaylist('Lo-Fi Chill Focus Stems', 'Algorithmic focus loops for deep study sessions.');
                    createPlaylist('Retrowave Synthesizers', 'Fast-paced driving basslines and retrowave filters.');
                }
            }
            catch (err) {
                console.error('Failed to load library data:', err);
            }
            finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);
    const setActiveTab = (tab) => {
        setSearchParams({ tab });
    };
    const togglePinPlaylist = (e, playlistId) => {
        e.stopPropagation();
        setPinnedPlaylistIds(prev => {
            const next = prev.includes(playlistId) ? prev.filter(id => id !== playlistId) : [...prev, playlistId];
            localStorage.setItem('glorify-pinned-playlists', JSON.stringify(next));
            return next;
        });
    };
    // Helper duration getter for playlists
    const getPlaylistDuration = (p) => {
        return tracks.filter(t => p.songs.includes(t.id)).reduce((acc, t) => acc + t.duration, 0);
    };
    // Reactive sorting & filtering logic
    const processedSongs = useMemo(() => {
        let result = tracks.filter(t => t.title.toLowerCase().includes(query.toLowerCase()) ||
            t.artist.toLowerCase().includes(query.toLowerCase()));
        if (sortBy === 'alphabetical')
            result.sort((a, b) => a.title.localeCompare(b.title));
        else if (sortBy === 'creator')
            result.sort((a, b) => a.artist.localeCompare(b.artist));
        else if (sortBy === 'duration')
            result.sort((a, b) => b.duration - a.duration);
        return result;
    }, [tracks, query, sortBy]);
    // Liked Albums & Liked Artists filtering
    const processedAlbums = useMemo(() => {
        let list = albums;
        if (activeTab === 'liked') {
            list = albums.filter(al => favoritedAlbumIds.includes(al.id));
        }
        let result = list.filter(al => al.title.toLowerCase().includes(query.toLowerCase()) ||
            al.artistName.toLowerCase().includes(query.toLowerCase()));
        if (sortBy === 'alphabetical')
            result.sort((a, b) => a.title.localeCompare(b.title));
        else if (sortBy === 'creator')
            result.sort((a, b) => a.artistName.localeCompare(b.artistName));
        return result;
    }, [albums, query, sortBy, activeTab, favoritedAlbumIds]);
    const processedArtists = useMemo(() => {
        let list = artists;
        if (activeTab === 'liked') {
            list = artists.filter(ar => favoritedArtistIds.includes(ar.id));
        }
        let result = list.filter(art => art.name.toLowerCase().includes(query.toLowerCase()));
        if (sortBy === 'alphabetical')
            result.sort((a, b) => a.name.localeCompare(b.name));
        return result;
    }, [artists, query, sortBy, activeTab, favoritedArtistIds]);
    const processedPlaylists = useMemo(() => {
        let result = playlists.filter(p => p.name.toLowerCase().includes(query.toLowerCase()));
        result.sort((a, b) => {
            // Pinned status gets absolute priority
            const aPinned = pinnedPlaylistIds.includes(a.id);
            const bPinned = pinnedPlaylistIds.includes(b.id);
            if (aPinned && !bPinned)
                return -1;
            if (!aPinned && bPinned)
                return 1;
            // Secondary sorting
            if (sortBy === 'alphabetical')
                return a.name.localeCompare(b.name);
            if (sortBy === 'recently_added')
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            if (sortBy === 'creator')
                return a.userId.localeCompare(b.userId);
            if (sortBy === 'duration')
                return getPlaylistDuration(b) - getPlaylistDuration(a);
            return 0;
        });
        return result;
    }, [playlists, query, sortBy, pinnedPlaylistIds, tracks]);
    const favoritedTracks = useMemo(() => {
        let result = tracks.filter(t => favoritedTrackIds.includes(t.id));
        if (sortBy === 'alphabetical')
            result.sort((a, b) => a.title.localeCompare(b.title));
        else if (sortBy === 'creator')
            result.sort((a, b) => a.artist.localeCompare(b.artist));
        return result;
    }, [tracks, favoritedTrackIds, sortBy]);
    const downloadedTracks = useMemo(() => {
        let result = tracks.filter(t => downloadedTrackIds.includes(t.id));
        if (sortBy === 'alphabetical')
            result.sort((a, b) => a.title.localeCompare(b.title));
        return result;
    }, [tracks, downloadedTrackIds, sortBy]);
    const tabs = [
        { id: 'songs', label: 'Songs', icon: Music },
        { id: 'albums', label: 'Albums', icon: Disc },
        { id: 'artists', label: 'Artists', icon: Users },
        { id: 'playlists', label: 'Playlists', icon: ListMusic },
        { id: 'liked', label: 'Likes', icon: Heart },
        { id: 'downloads', label: 'Downloads', icon: Music }
    ];
    const gridStyles = {
        gridTemplateColumns: `repeat(auto-fill, minmax(${cardSize}px, 1fr))`
    };
    if (loading) {
        return React.createElement(LibrarySkeleton);
    }
    return React.createElement('div', { className: 'flex flex-col gap-6 w-full mx-auto pb-32 font-sans' }, 
    // Header section
    React.createElement('div', { className: 'flex items-center justify-between pb-ch-2 mt-ch-4' }, React.createElement('div', { className: 'flex flex-col gap-1' }, React.createElement('h1', { className: 'text-2xl lg:text-3xl font-bold tracking-tight text-glorify-text-primary' }, 'Your Library'), React.createElement('p', { className: 'text-sm text-glorify-text-muted font-normal' }, 'Your personalized collection of playlists, followed artists, liked albums, and offline tracks.')), activeTab === 'playlists' &&
        React.createElement('button', {
            onClick: () => setShowCreateDialog(true),
            className: 'flex items-center gap-ch-2 px-ch-4 py-2 bg-glorify-accent text-glorify-carbon-950 rounded-full text-xs font-semibold shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer outline-none focus-ring',
        }, React.createElement(Plus, { className: 'w-ch-4 h-ch-4' }), 'Create Playlist')), 
    // Search, Sort, View Controls subheader toolbar
    React.createElement('div', { className: 'flex flex-col xl:flex-row xl:items-center justify-between gap-ch-4 pb-ch-2 mt-ch-1 border-b border-glorify-border-primary/5' }, 
    // Left: Tab chips
    React.createElement('div', { className: 'flex items-center gap-ch-2 overflow-x-auto scrollbar-none py-1' }, tabs.map((tab) => React.createElement('button', {
        key: tab.id,
        onClick: () => setActiveTab(tab.id),
        className: `flex items-center gap-ch-1.5 px-ch-4 py-2 rounded-full text-xs font-semibold transition-all duration-300 cursor-pointer outline-none focus-ring ${activeTab === tab.id
            ? 'bg-glorify-accent text-glorify-carbon-950 shadow-md font-semibold'
            : 'text-glorify-text-secondary hover:text-glorify-text-primary bg-glorify-bg-surface/40 hover:bg-glorify-bg-surface/80 hover:shadow-sm border border-transparent'}`,
    }, React.createElement(tab.icon, { className: 'w-ch-3.5 h-ch-3.5 flex-shrink-0' }), React.createElement('span', null, tab.label)))), 
    // Right: Toolbar controls
    React.createElement('div', { className: 'flex flex-wrap items-center gap-4 xl:justify-end' }, 
    // Dynamic Card Size Slider (Visible in Grid View)
    viewMode === 'grid' && activeTab !== 'songs' && activeTab !== 'downloads' &&
        React.createElement('div', { className: 'flex items-center gap-2 bg-glorify-bg-surface/40 border border-glorify-border-primary/10 rounded-full px-4 py-1.5 shadow-sm text-xs text-glorify-text-secondary font-medium' }, React.createElement(SlidersHorizontal, { className: 'w-3.5 h-3.5 text-glorify-accent' }), React.createElement('span', null, 'Card Size'), React.createElement('input', {
            type: 'range',
            min: 120,
            max: 240,
            value: cardSize,
            onChange: (e) => setCardSize(parseInt(e.target.value)),
            className: 'w-20 accent-glorify-accent cursor-ew-resize h-1 bg-white/10 rounded-lg appearance-none outline-none'
        })), 
    // Grid/List Layout Switcher (Hidden on Songs/Downloads tab as they are lists only)
    activeTab !== 'songs' && activeTab !== 'downloads' &&
        React.createElement('div', { className: 'flex items-center bg-glorify-bg-surface/45 border border-glorify-border-primary/10 rounded-full p-0.5 shadow-sm' }, React.createElement('button', {
            onClick: () => setViewMode('grid'),
            className: `p-1.5 rounded-full cursor-pointer transition-all ${viewMode === 'grid' ? 'bg-glorify-accent text-glorify-carbon-950' : 'text-glorify-text-secondary hover:text-glorify-text-primary'}`,
            title: 'Grid layout'
        }, React.createElement(LayoutGrid, { className: 'w-3.5 h-3.5' })), React.createElement('button', {
            onClick: () => setViewMode('list'),
            className: `p-1.5 rounded-full cursor-pointer transition-all ${viewMode === 'list' ? 'bg-glorify-accent text-glorify-carbon-950' : 'text-glorify-text-secondary hover:text-glorify-text-primary'}`,
            title: 'List layout'
        }, React.createElement(List, { className: 'w-3.5 h-3.5' }))), 
    // Search Input
    React.createElement('div', { className: 'relative' }, React.createElement('input', {
        type: 'text',
        value: query,
        onChange: (e) => setQuery(e.target.value),
        placeholder: 'Search library...',
        className: 'w-36 sm:w-44 px-ch-4 py-1.5 pl-ch-9 rounded-full bg-glorify-bg-surface/45 border border-glorify-border-primary/10 text-xs text-glorify-text-primary placeholder:text-glorify-text-muted focus:border-glorify-accent outline-none focus-ring shadow-sm transition-all'
    }), React.createElement(Search, { className: 'w-ch-3.5 h-ch-3.5 text-glorify-text-muted absolute left-ch-3 top-1/2 -translate-y-1/2' })), 
    // Sorting options dropdown
    React.createElement('select', {
        value: sortBy,
        onChange: (e) => setSortBy(e.target.value),
        className: 'px-ch-4 py-1.5 rounded-full bg-glorify-bg-surface/45 border border-glorify-border-primary/10 text-xs text-glorify-text-primary focus:border-glorify-accent cursor-pointer outline-none shadow-sm font-semibold transition-all'
    }, React.createElement('option', { value: 'alphabetical' }, 'Alphabetical'), React.createElement('option', { value: 'recently_added' }, 'Recently Added'), React.createElement('option', { value: 'creator' }, 'Creator'), React.createElement('option', { value: 'duration' }, 'Duration')))), 
    // Content container with layout switcher
    React.createElement('div', { className: 'flex-1 min-h-[50vh] mt-ch-4' }, React.createElement(AnimatePresence, { mode: 'wait' }, React.createElement(motion.div, {
        key: activeTab + '-' + query + '-' + sortBy + '-' + viewMode + '-' + cardSize,
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -10 },
        transition: { duration: 0.25, ease: 'easeOut' },
        className: 'w-full'
    }, 
    // SONGS TAB (List mode only)
    activeTab === 'songs' &&
        React.createElement('div', { className: 'flex flex-col gap-1 bg-glorify-bg-surface/20 border border-glorify-border-primary/5 rounded-[20px] p-ch-2 shadow-sm' }, processedSongs.length === 0
            ? React.createElement('div', { className: 'text-center py-16 text-sm text-glorify-text-muted font-light' }, 'No matches found in library.')
            : processedSongs.map((track, idx) => React.createElement(TrackCard, {
                key: track.id,
                track: track,
                index: idx,
                queueContext: processedSongs,
                onGoToAlbum: (albumId) => navigate(`/album/${albumId}`),
                onGoToArtist: (artistId) => navigate(`/artist/${artistId}`),
            }))), 
    // ALBUMS TAB
    activeTab === 'albums' &&
        (viewMode === 'grid'
            ? React.createElement('div', { style: gridStyles, className: 'grid gap-ch-6' }, processedAlbums.length === 0
                ? React.createElement('div', { className: 'col-span-full text-center py-16 text-sm text-glorify-text-muted font-light' }, 'No albums saved matching search.')
                : processedAlbums.map((album) => React.createElement(CatalogCard, {
                    key: album.id,
                    id: album.id,
                    title: album.title,
                    subtitle: album.artistName,
                    type: 'album',
                    year: album.releaseYear,
                    onClick: () => navigate(`/album/${album.id}`),
                    onPlayClick: (e) => {
                        e.stopPropagation();
                        handlePlayAlbum(album.id);
                    },
                })))
            : React.createElement('div', { className: 'flex flex-col gap-1.5 bg-glorify-bg-surface/20 border border-glorify-border-primary/5 rounded-[20px] p-4 shadow-sm' }, processedAlbums.map((album) => React.createElement('div', {
                key: album.id,
                onClick: () => navigate(`/album/${album.id}`),
                className: 'flex items-center justify-between p-3 rounded-[12px] hover:bg-white/5 cursor-pointer text-left transition-all'
            }, React.createElement('div', { className: 'flex items-center gap-3 min-w-0' }, React.createElement('img', { src: album.coverUrl, className: 'w-10 h-10 rounded object-cover flex-shrink-0' }), React.createElement('div', { className: 'min-w-0' }, React.createElement('div', { className: 'text-sm font-semibold text-glorify-text-primary truncate' }, album.title), React.createElement('div', { className: 'text-xs text-glorify-text-muted mt-0.5' }, album.artistName))), React.createElement('span', { className: 'text-xs text-glorify-text-muted' }, album.releaseYear))))), 
    // ARTISTS TAB
    activeTab === 'artists' &&
        (viewMode === 'grid'
            ? React.createElement('div', { style: gridStyles, className: 'grid gap-ch-6' }, processedArtists.length === 0
                ? React.createElement('div', { className: 'col-span-full text-center py-16 text-sm text-glorify-text-muted font-light' }, 'No artists followed matching search.')
                : processedArtists.map((artist) => React.createElement(CatalogCard, {
                    key: artist.id,
                    id: artist.id,
                    title: artist.name,
                    subtitle: artist.genres.join(' • '),
                    type: 'artist',
                    coverUrl: artist.avatarUrl,
                    onClick: () => navigate(`/artist/${artist.id}`),
                    onPlayClick: (e) => {
                        e.stopPropagation();
                        handlePlayArtist(artist.id);
                    },
                })))
            : React.createElement('div', { className: 'flex flex-col gap-1.5 bg-glorify-bg-surface/20 border border-glorify-border-primary/5 rounded-[20px] p-4 shadow-sm' }, processedArtists.map((artist) => React.createElement('div', {
                key: artist.id,
                onClick: () => navigate(`/artist/${artist.id}`),
                className: 'flex items-center justify-between p-3 rounded-[12px] hover:bg-white/5 cursor-pointer text-left transition-all'
            }, React.createElement('div', { className: 'flex items-center gap-3 min-w-0' }, React.createElement('img', { src: artist.avatarUrl, className: 'w-10 h-10 rounded-full object-cover flex-shrink-0' }), React.createElement('div', { className: 'min-w-0' }, React.createElement('div', { className: 'text-sm font-semibold text-glorify-text-primary truncate' }, artist.name), React.createElement('div', { className: 'text-xs text-glorify-text-muted mt-0.5' }, artist.genres.join(' / ')))))))), 
    // PLAYLISTS TAB
    activeTab === 'playlists' &&
        (processedPlaylists.length === 0
            ? React.createElement(NoPlaylists, { onCreate: () => setShowCreateDialog(true) })
            : (viewMode === 'grid'
                ? React.createElement('div', { style: gridStyles, className: 'grid gap-ch-6' }, processedPlaylists.map((playlist) => {
                    const isPinned = pinnedPlaylistIds.includes(playlist.id);
                    return React.createElement('div', { key: playlist.id, className: 'relative group' }, React.createElement(CatalogCard, {
                        id: playlist.id,
                        title: playlist.name,
                        subtitle: `${playlist.songs.length} song${playlist.songs.length === 1 ? '' : 's'}`,
                        type: 'playlist',
                        coverUrl: playlist.coverImage,
                        onClick: () => navigate(`/playlist/${playlist.id}`),
                        onPlayClick: (e) => {
                            e.stopPropagation();
                            handlePlayPlaylist(playlist.id);
                        },
                    }), 
                    // Pin trigger overlay button
                    React.createElement('button', {
                        onClick: (e) => togglePinPlaylist(e, playlist.id),
                        className: `absolute top-3 right-3 p-1.5 rounded-full cursor-pointer outline-none transition-all shadow ${isPinned
                            ? 'bg-glorify-accent text-glorify-carbon-950 scale-100 opacity-100'
                            : 'bg-black/60 text-white/70 hover:text-white opacity-0 group-hover:opacity-100 scale-90 hover:scale-100'}`
                    }, React.createElement(Pin, { className: `w-3 h-3 ${isPinned ? 'fill-currentColor' : ''}` })));
                }))
                : React.createElement('div', { className: 'flex flex-col gap-1.5 bg-glorify-bg-surface/20 border border-glorify-border-primary/5 rounded-[20px] p-4 shadow-sm' }, processedPlaylists.map((playlist) => {
                    const isPinned = pinnedPlaylistIds.includes(playlist.id);
                    return React.createElement('div', {
                        key: playlist.id,
                        onClick: () => navigate(`/playlist/${playlist.id}`),
                        className: 'flex items-center justify-between p-3 rounded-[12px] hover:bg-white/5 cursor-pointer text-left transition-all group'
                    }, React.createElement('div', { className: 'flex items-center gap-3 min-w-0' }, React.createElement('img', { src: playlist.coverImage || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=100', className: 'w-10 h-10 rounded object-cover flex-shrink-0' }), React.createElement('div', { className: 'min-w-0' }, React.createElement('div', { className: 'text-sm font-semibold text-glorify-text-primary truncate flex items-center gap-1.5' }, playlist.name, isPinned && React.createElement(Pin, { className: 'w-3 h-3 text-glorify-accent fill-currentColor flex-shrink-0' })), React.createElement('div', { className: 'text-xs text-glorify-text-muted mt-0.5' }, `${playlist.songs.length} song${playlist.songs.length === 1 ? '' : 's'}`))), React.createElement('button', {
                        onClick: (e) => togglePinPlaylist(e, playlist.id),
                        className: `p-1.5 rounded-full cursor-pointer hover:bg-white/10 ${isPinned ? 'text-glorify-accent' : 'text-glorify-text-muted hover:text-glorify-text-primary opacity-0 group-hover:opacity-100 transition-opacity'}`
                    }, React.createElement(Pin, { className: `w-3.5 h-3.5 ${isPinned ? 'fill-currentColor' : ''}` })));
                })))), 
    // LIKES TAB
    activeTab === 'liked' &&
        (favoritedTracks.length === 0 && processedAlbums.length === 0 && processedArtists.length === 0
            ? React.createElement(NoFavorites)
            : React.createElement('div', { className: 'flex flex-col gap-8' }, 
            // Liked Songs
            React.createElement('div', { className: 'flex flex-col gap-ch-3' }, React.createElement('h3', { className: 'text-sm font-bold text-glorify-text-primary pl-ch-1' }, 'Liked Songs'), React.createElement('div', { className: 'flex flex-col bg-glorify-bg-surface/20 border border-glorify-border-primary/5 rounded-[22px] p-2 shadow-sm' }, favoritedTracks.length === 0
                ? React.createElement('div', { className: 'text-center py-8 text-xs text-glorify-text-muted font-mono' }, 'NO_LIKED_SONGS')
                : favoritedTracks.map((track, idx) => React.createElement(TrackCard, {
                    key: 'liked-' + track.id,
                    track: track,
                    index: idx,
                    queueContext: favoritedTracks,
                    onGoToAlbum: (albumId) => navigate(`/album/${albumId}`),
                    onGoToArtist: (artistId) => navigate(`/artist/${artistId}`),
                })))), 
            // Liked Albums
            React.createElement('div', { className: 'flex flex-col gap-ch-3' }, React.createElement('h3', { className: 'text-sm font-bold text-glorify-text-primary pl-ch-1' }, 'Liked Albums'), processedAlbums.length === 0
                ? React.createElement('div', { className: 'text-left py-4 text-xs text-glorify-text-muted pl-ch-1 font-mono' }, 'NO_LIKED_ALBUMS')
                : (viewMode === 'grid'
                    ? React.createElement('div', { style: gridStyles, className: 'grid gap-ch-6' }, processedAlbums.map((album) => React.createElement(CatalogCard, {
                        key: 'liked-alb-' + album.id,
                        id: album.id,
                        title: album.title,
                        subtitle: album.artistName,
                        type: 'album',
                        coverUrl: album.coverUrl,
                        onClick: () => navigate(`/album/${album.id}`),
                        onPlayClick: (e) => {
                            e.stopPropagation();
                            handlePlayAlbum(album.id);
                        }
                    })))
                    : React.createElement('div', { className: 'flex flex-col gap-1.5 bg-glorify-bg-surface/20 border border-glorify-border-primary/5 rounded-[20px] p-4 shadow-sm' }, processedAlbums.map((album) => React.createElement('div', {
                        key: 'liked-list-alb-' + album.id,
                        onClick: () => navigate(`/album/${album.id}`),
                        className: 'flex items-center justify-between p-3 rounded-[12px] hover:bg-white/5 cursor-pointer text-left transition-all'
                    }, React.createElement('div', { className: 'flex items-center gap-3 min-w-0' }, React.createElement('img', { src: album.coverUrl, className: 'w-10 h-10 rounded object-cover flex-shrink-0' }), React.createElement('div', { className: 'min-w-0' }, React.createElement('div', { className: 'text-sm font-semibold text-glorify-text-primary truncate' }, album.title), React.createElement('div', { className: 'text-xs text-glorify-text-muted mt-0.5' }, album.artistName)))))))), 
            // Followed Artists
            React.createElement('div', { className: 'flex flex-col gap-ch-3' }, React.createElement('h3', { className: 'text-sm font-bold text-glorify-text-primary pl-ch-1' }, 'Followed Artists'), processedArtists.length === 0
                ? React.createElement('div', { className: 'text-left py-4 text-xs text-glorify-text-muted pl-ch-1 font-mono' }, 'NO_FOLLOWED_ARTISTS')
                : (viewMode === 'grid'
                    ? React.createElement('div', { style: gridStyles, className: 'grid gap-ch-6' }, processedArtists.map((art) => React.createElement(CatalogCard, {
                        key: 'liked-art-' + art.id,
                        id: art.id,
                        title: art.name,
                        subtitle: art.genres.join(' • '),
                        type: 'artist',
                        coverUrl: art.avatarUrl,
                        onClick: () => navigate(`/artist/${art.id}`),
                        onPlayClick: (e) => {
                            e.stopPropagation();
                            handlePlayArtist(art.id);
                        }
                    })))
                    : React.createElement('div', { className: 'flex flex-col gap-1.5 bg-glorify-bg-surface/20 border border-glorify-border-primary/5 rounded-[20px] p-4 shadow-sm' }, processedArtists.map((art) => React.createElement('div', {
                        key: 'liked-list-art-' + art.id,
                        onClick: () => navigate(`/artist/${art.id}`),
                        className: 'flex items-center justify-between p-3 rounded-[12px] hover:bg-white/5 cursor-pointer text-left transition-all'
                    }, React.createElement('div', { className: 'flex items-center gap-3 min-w-0' }, React.createElement('img', { src: art.avatarUrl, className: 'w-10 h-10 rounded-full object-cover flex-shrink-0' }), React.createElement('div', { className: 'min-w-0' }, React.createElement('div', { className: 'text-sm font-semibold text-glorify-text-primary truncate' }, art.name), React.createElement('div', { className: 'text-xs text-glorify-text-muted mt-0.5' }, art.genres.join(' / '))))))))))), 
    // DOWNLOADS TAB
    activeTab === 'downloads' &&
        (downloadedTracks.length === 0
            ? React.createElement(NoDownloads)
            : React.createElement('div', { className: 'flex flex-col gap-1 bg-glorify-bg-surface/20 border border-glorify-border-primary/5 rounded-[22px] p-2 shadow-sm' }, downloadedTracks.map((track, idx) => React.createElement(TrackCard, {
                key: 'downloaded-' + track.id,
                track: track,
                index: idx,
                queueContext: downloadedTracks,
                onGoToAlbum: (albumId) => navigate(`/album/${albumId}`),
                onGoToArtist: (artistId) => navigate(`/artist/${artistId}`),
            }))))))), 
    // Create Playlist dialog modal
    showCreateDialog &&
        React.createElement(PlaylistDialog, {
            onClose: () => setShowCreateDialog(false),
        }));
}
//# sourceMappingURL=Library.js.map