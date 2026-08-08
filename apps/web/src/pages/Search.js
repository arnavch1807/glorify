import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { StaticMusicRepository } from '../repositories/musicRepository.js';
import { TrackCard } from '../components/Library/TrackCard.js';
import { CatalogCard } from '../components/Library/CatalogCard.js';
import { useDebounce } from '@chotify/hooks';
import { usePlayerStore } from '../store/playerStore.js';
import { useLocalLibraryStore } from '../store/localLibraryStore.js';
import { Search as SearchIcon, Trash2, ArrowRight, X, Disc, Play, SlidersHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SearchSkeleton } from '../components/SkeletonLoaders.js';
import { NoSearchResults } from '../components/EmptyStates.js';
export function Search() {
    const navigate = useNavigate();
    const [query, setQuery] = useState('');
    const debouncedQuery = useDebounce(query, 100);
    const [activeCategory, setActiveCategory] = useState('all');
    // Search Filters State
    const [showFilters, setShowFilters] = useState(false);
    const [sourceFilter, setSourceFilter] = useState('all');
    const [bpmFilter, setBpmFilter] = useState('all');
    const [keyFilter, setKeyFilter] = useState('all');
    const [tracks, setTracks] = useState([]);
    const [albums, setAlbums] = useState([]);
    const [artists, setArtists] = useState([]);
    const [playlists, setPlaylists] = useState([]);
    const [recentSearches, setRecentSearches] = useState([]);
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const [loading, setLoading] = useState(true);
    const { playTrack } = usePlayerStore();
    const searchInputRef = useRef(null);
    const { localTracks, localAlbums, localArtists } = useLocalLibraryStore();
    const combinedTracks = useMemo(() => {
        return [...localTracks, ...tracks];
    }, [localTracks, tracks]);
    const combinedAlbums = useMemo(() => {
        return [...localAlbums, ...albums];
    }, [localAlbums, albums]);
    const combinedArtists = useMemo(() => {
        return [...localArtists, ...artists];
    }, [localArtists, artists]);
    useEffect(() => {
        const loadCatalog = async () => {
            try {
                setLoading(true);
                const [t, al, ar, p] = await Promise.all([
                    StaticMusicRepository.getTracks(),
                    StaticMusicRepository.getAlbums(),
                    StaticMusicRepository.getArtists(),
                    StaticMusicRepository.getPlaylists(),
                ]);
                setTracks(t);
                setAlbums(al);
                setArtists(ar);
                setPlaylists(p);
            }
            catch (err) {
                console.error('Failed to load search data:', err);
            }
            finally {
                setLoading(false);
            }
        };
        loadCatalog();
        const saved = localStorage.getItem('glorify-recent-searches');
        if (saved) {
            setRecentSearches(JSON.parse(saved));
        }
    }, []);
    // Reset focus when query changes
    useEffect(() => {
        setFocusedIndex(-1);
    }, [query]);
    // Filter matching entries
    const filteredResults = useMemo(() => {
        if (!debouncedQuery.trim()) {
            return { tracks: [], albums: [], artists: [], playlists: [] };
        }
        const searchTerm = debouncedQuery.toLowerCase();
        return {
            tracks: combinedTracks.filter(t => {
                const matchesQuery = t.title.toLowerCase().includes(searchTerm) ||
                    t.artist.toLowerCase().includes(searchTerm) ||
                    (t.lyrics && (typeof t.lyrics === 'string' ? t.lyrics : t.lyrics.text || '').toLowerCase().includes(searchTerm));
                if (!matchesQuery)
                    return false;
                // Source Filter
                if (sourceFilter === 'standard' && t.isGenerated)
                    return false;
                if (sourceFilter === 'ai' && !t.isGenerated)
                    return false;
                // BPM Filter
                if (bpmFilter === 'slow' && (t.bpm === undefined || t.bpm >= 90))
                    return false;
                if (bpmFilter === 'medium' && (t.bpm === undefined || t.bpm < 90 || t.bpm > 120))
                    return false;
                if (bpmFilter === 'fast' && (t.bpm === undefined || t.bpm <= 120))
                    return false;
                // Key Signature Filter
                if (keyFilter !== 'all' && t.keySignature !== keyFilter)
                    return false;
                return true;
            }),
            albums: combinedAlbums.filter(al => al.title.toLowerCase().includes(searchTerm) || al.artistName.toLowerCase().includes(searchTerm)),
            artists: combinedArtists.filter(ar => ar.name.toLowerCase().includes(searchTerm) || ar.genres.some(g => g.toLowerCase().includes(searchTerm))),
            playlists: playlists.filter(pl => pl.name.toLowerCase().includes(searchTerm))
        };
    }, [debouncedQuery, combinedTracks, combinedAlbums, combinedArtists, playlists, sourceFilter, bpmFilter, keyFilter]);
    // Compute Top Result (first match of any type)
    const topResult = useMemo(() => {
        if (!debouncedQuery.trim())
            return null;
        if (filteredResults.tracks.length > 0) {
            const t = filteredResults.tracks[0];
            return { id: t.id, title: t.title, subtitle: t.artist, coverUrl: t.coverImage, type: 'track', raw: t };
        }
        if (filteredResults.artists.length > 0) {
            const ar = filteredResults.artists[0];
            return { id: ar.id, title: ar.name, subtitle: 'Artist', coverUrl: ar.avatarUrl, type: 'artist', raw: ar };
        }
        if (filteredResults.albums.length > 0) {
            const al = filteredResults.albums[0];
            return { id: al.id, title: al.title, subtitle: al.artistName, coverUrl: al.coverUrl, type: 'album', raw: al };
        }
        return null;
    }, [filteredResults, debouncedQuery]);
    const flatResultsList = useMemo(() => {
        const list = [];
        if (activeCategory === 'all' || activeCategory === 'songs') {
            filteredResults.tracks.forEach(t => list.push({ id: t.id, title: t.title, subtitle: t.artist, coverUrl: t.coverImage, type: 'track', raw: t }));
        }
        if (activeCategory === 'all' || activeCategory === 'albums') {
            filteredResults.albums.forEach(al => list.push({ id: al.id, title: al.title, subtitle: al.artistName, coverUrl: al.coverUrl, type: 'album', raw: al }));
        }
        if (activeCategory === 'all' || activeCategory === 'artists') {
            filteredResults.artists.forEach(ar => list.push({ id: ar.id, title: ar.name, subtitle: ar.genres.join(', '), coverUrl: ar.avatarUrl, type: 'artist', raw: ar }));
        }
        if (activeCategory === 'all' || activeCategory === 'playlists') {
            filteredResults.playlists.forEach(pl => list.push({ id: pl.id, title: pl.name, subtitle: 'PLAYLIST', coverUrl: pl.coverImage, type: 'playlist', raw: pl }));
        }
        return list;
    }, [filteredResults, activeCategory]);
    if (loading) {
        return React.createElement(SearchSkeleton);
    }
    const triggerAction = (item) => {
        setRecentSearches(prev => {
            const clean = prev.filter(x => x.id !== item.id);
            const next = [item, ...clean].slice(0, 6);
            localStorage.setItem('glorify-recent-searches', JSON.stringify(next));
            return next;
        });
        if (item.type === 'track') {
            playTrack(item.raw, tracks);
        }
        else {
            navigate(`/${item.type}/${item.id}`);
        }
    };
    const handleKeyDown = (e) => {
        const listLength = flatResultsList.length;
        if (listLength === 0)
            return;
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setFocusedIndex(prev => (prev + 1) % listLength);
        }
        else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setFocusedIndex(prev => (prev - 1 + listLength) % listLength);
        }
        else if (e.key === 'Enter') {
            e.preventDefault();
            if (focusedIndex >= 0 && focusedIndex < listLength) {
                triggerAction(flatResultsList[focusedIndex]);
            }
            else if (flatResultsList.length > 0) {
                triggerAction(flatResultsList[0]);
            }
        }
    };
    const highlightText = (text, highlight) => {
        if (!highlight.trim())
            return text;
        const regex = new RegExp(`(${highlight.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'gi');
        const parts = text.split(regex);
        return parts.map((part, index) => regex.test(part)
            ? React.createElement('span', { key: index, className: 'text-glorify-accent underline font-semibold' }, part)
            : part);
    };
    const clearHistory = () => {
        setRecentSearches([]);
        localStorage.removeItem('glorify-recent-searches');
    };
    const categoriesList = [
        { id: 'all', label: 'All Results' },
        { id: 'songs', label: 'Songs' },
        { id: 'albums', label: 'Albums' },
        { id: 'artists', label: 'Artists' },
        { id: 'playlists', label: 'Playlists' }
    ];
    return React.createElement('div', { className: 'flex flex-col gap-8 w-full mx-auto mt-4 pb-32 font-sans' }, 
    // Large Search input with Arrow key listener
    React.createElement('div', { className: 'flex flex-col gap-ch-4' }, React.createElement('div', { className: 'flex items-center gap-3 w-full' }, React.createElement('div', { className: 'relative flex-1' }, React.createElement(SearchIcon, {
        className: 'absolute left-ch-6 top-1/2 -translate-y-1/2 w-ch-5 h-ch-5 text-glorify-text-muted',
    }), React.createElement('input', {
        ref: searchInputRef,
        type: 'text',
        value: query,
        onChange: (e) => setQuery(e.target.value),
        onKeyDown: handleKeyDown,
        placeholder: 'What do you want to listen to?',
        className: 'w-full h-14 pl-ch-14 pr-ch-12 rounded-full bg-glorify-bg-surface/50 border border-glorify-border-primary/10 text-base text-glorify-text-primary placeholder-glorify-text-muted focus:border-glorify-accent/40 outline-none transition-all duration-300 shadow-sm focus:shadow-md focus-ring',
        'aria-label': 'Search catalog input',
    }), query.trim() &&
        React.createElement('button', {
            onClick: () => setQuery(''),
            className: 'absolute right-ch-4 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-glorify-bg-secondary text-glorify-text-muted hover:text-glorify-text-primary cursor-pointer outline-none focus-ring',
        }, React.createElement(X, { className: 'w-ch-4.5 h-ch-4.5' }))), React.createElement('button', {
        onClick: () => setShowFilters(!showFilters),
        className: `px-6 h-14 rounded-full border text-xs font-semibold flex items-center gap-2 shadow-sm focus-ring cursor-pointer transition-all duration-300 ${showFilters || sourceFilter !== 'all' || bpmFilter !== 'all' || keyFilter !== 'all'
            ? 'bg-glorify-accent border-glorify-accent text-glorify-carbon-950 font-bold'
            : 'bg-glorify-bg-surface/50 border-glorify-border-primary/10 text-glorify-text-primary hover:bg-glorify-bg-secondary'}`
    }, React.createElement(SlidersHorizontal, { className: 'w-4 h-4' }), 'Filters')), 
    // Collapsible Filters Panel
    showFilters &&
        React.createElement('div', { className: 'flex flex-wrap gap-6 p-5 bg-glorify-bg-surface/50 border border-glorify-border-primary/10 rounded-[22px] text-left shadow-sm font-sans animate-fade-in' }, 
        // Source filter
        React.createElement('div', { className: 'flex flex-col gap-1.5' }, React.createElement('span', { className: 'text-[10px] font-bold text-glorify-text-secondary tracking-widest uppercase pl-1' }, 'Source'), React.createElement('div', { className: 'flex items-center bg-glorify-bg-secondary/60 border border-glorify-border-primary/5 p-1 rounded-full' }, [
            { id: 'all', label: 'All' },
            { id: 'standard', label: 'Standard' },
            { id: 'ai', label: 'AI Generated' },
        ].map(opt => React.createElement('button', {
            key: opt.id,
            onClick: () => setSourceFilter(opt.id),
            className: `px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer outline-none ${sourceFilter === opt.id
                ? 'bg-glorify-bg-surface text-glorify-text-primary font-bold shadow-sm'
                : 'text-glorify-text-muted hover:text-glorify-text-primary'}`
        }, opt.label)))), 
        // BPM filter
        React.createElement('div', { className: 'flex flex-col gap-1.5' }, React.createElement('span', { className: 'text-[10px] font-bold text-glorify-text-secondary tracking-widest uppercase pl-1' }, 'Tempo (BPM)'), React.createElement('div', { className: 'flex items-center bg-glorify-bg-secondary/60 border border-glorify-border-primary/5 p-1 rounded-full' }, [
            { id: 'all', label: 'Any BPM' },
            { id: 'slow', label: 'Slow (<90)' },
            { id: 'medium', label: 'Medium (90-120)' },
            { id: 'fast', label: 'Fast (>120)' },
        ].map(opt => React.createElement('button', {
            key: opt.id,
            onClick: () => setBpmFilter(opt.id),
            className: `px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer outline-none ${bpmFilter === opt.id
                ? 'bg-glorify-bg-surface text-glorify-text-primary font-bold shadow-sm'
                : 'text-glorify-text-muted hover:text-glorify-text-primary'}`
        }, opt.label)))), 
        // Key Signature filter dropdown
        React.createElement('div', { className: 'flex flex-col gap-1.5 min-w-[140px]' }, React.createElement('span', { className: 'text-[10px] font-bold text-glorify-text-secondary tracking-widest uppercase pl-1' }, 'Key Signature'), React.createElement('select', {
            value: keyFilter,
            onChange: (e) => setKeyFilter(e.target.value),
            className: 'px-ch-4 py-2 bg-glorify-bg-secondary/60 border border-glorify-border-primary/5 rounded-full text-xs text-glorify-text-primary outline-none focus:border-glorify-accent cursor-pointer font-semibold shadow-sm transition-all'
        }, [
            { value: 'all', label: 'Any Key' },
            { value: 'A Min', label: 'A Minor' },
            { value: 'C Maj', label: 'C Major' },
            { value: 'D Maj', label: 'D Major' },
            { value: 'F# Min', label: 'F# Minor' },
            { value: 'G Maj', label: 'G Major' },
        ].map(opt => React.createElement('option', { key: opt.value, value: opt.value }, opt.label))))), 
    // Category Navigation Tabs
    query.trim() &&
        React.createElement('div', { className: 'flex items-center gap-ch-2 overflow-x-auto scrollbar-none pb-1' }, categoriesList.map((cat) => React.createElement('button', {
            key: cat.id,
            onClick: () => setActiveCategory(cat.id),
            className: `px-ch-4 py-2 rounded-full text-xs font-semibold cursor-pointer outline-none transition-all focus-ring ${activeCategory === cat.id
                ? 'bg-glorify-accent text-glorify-carbon-950 font-semibold shadow-sm'
                : 'text-glorify-text-secondary hover:text-glorify-text-primary bg-glorify-bg-surface/40 hover:bg-glorify-bg-surface/80 border border-transparent'}`,
        }, cat.label)))), 
    // Search Results Container
    React.createElement(AnimatePresence, { mode: 'wait' }, query.trim()
        ? React.createElement(motion.div, {
            key: 'results',
            initial: { opacity: 0, y: 10 },
            animate: { opacity: 1, y: 0 },
            exit: { opacity: 0, y: -10 },
            transition: { duration: 0.2, ease: 'easeOut' },
            className: 'flex-grow flex flex-col gap-8'
        }, 
        // Spotify-style double column layout for general/all category
        activeCategory === 'all' && topResult
            ? React.createElement('div', { className: 'grid grid-cols-1 lg:grid-cols-5 gap-8' }, 
            // Left: Prominent Top Result Card
            React.createElement('div', { className: 'lg:col-span-2 flex flex-col gap-4 text-left' }, React.createElement('span', { className: 'text-sm font-bold text-glorify-text-primary pl-ch-1' }, 'Top Result'), React.createElement(motion.div, {
                onClick: () => triggerAction(topResult),
                whileHover: { scale: 1.01 },
                className: 'group p-6 rounded-[28px] bg-glorify-bg-surface/40 hover:bg-glorify-bg-surface/80 border border-glorify-border-primary/5 transition-all duration-300 cursor-pointer shadow-sm relative flex flex-col gap-5 justify-end min-h-[230px] select-none hover:shadow-md'
            }, topResult.coverUrl &&
                React.createElement('img', {
                    src: topResult.coverUrl,
                    alt: '',
                    className: 'w-24 h-24 rounded-[20px] object-cover shadow-xl'
                }), React.createElement('div', { className: 'flex flex-col gap-1 pr-16' }, React.createElement('h2', { className: 'text-2xl font-extrabold text-glorify-text-primary leading-tight truncate' }, topResult.title), React.createElement('div', { className: 'flex items-center gap-2 mt-1' }, React.createElement('span', { className: 'text-[9px] font-mono font-bold tracking-widest text-glorify-accent bg-glorify-accent-glow px-2 py-0.5 rounded-sm' }, topResult.type.toUpperCase()), React.createElement('span', { className: 'text-xs text-glorify-text-secondary truncate' }, topResult.subtitle))), 
            // Floating play button shown on hover
            React.createElement(motion.button, {
                onClick: (e) => {
                    e.stopPropagation();
                    triggerAction(topResult);
                },
                whileHover: { scale: 1.1 },
                whileTap: { scale: 0.9 },
                className: 'absolute bottom-6 right-6 w-12 h-12 rounded-full bg-glorify-accent text-glorify-carbon-950 flex items-center justify-center shadow-lg opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100 transition-all duration-300 cursor-pointer outline-none z-10'
            }, React.createElement(Play, { className: 'w-5 h-5 fill-currentColor pl-0.5' })))), 
            // Right: Songs List
            React.createElement('div', { className: 'lg:col-span-3 flex flex-col gap-4 text-left' }, React.createElement('span', { className: 'text-sm font-bold text-glorify-text-primary pl-ch-1' }, 'Songs'), React.createElement('div', { className: 'flex flex-col bg-glorify-bg-surface/20 border border-glorify-border-primary/5 rounded-[28px] p-2 shadow-sm' }, filteredResults.tracks.slice(0, 4).map((track, idx) => React.createElement(TrackCard, {
                key: track.id,
                track: track,
                index: idx,
                queueContext: filteredResults.tracks,
                onGoToAlbum: (albumId) => navigate(`/album/${albumId}`),
                onGoToArtist: (artistId) => navigate(`/artist/${artistId}`),
            })))))
            : null, 
        // Filtered categories listings
        flatResultsList.length === 0
            ? React.createElement(NoSearchResults, { query })
            : (activeCategory === 'songs'
                ? React.createElement('div', { className: 'flex flex-col bg-glorify-bg-surface/20 border border-glorify-border-primary/5 rounded-[28px] p-2 shadow-sm text-left' }, filteredResults.tracks.map((track, idx) => React.createElement(TrackCard, {
                    key: track.id,
                    track: track,
                    index: idx,
                    queueContext: filteredResults.tracks,
                    onGoToAlbum: (albumId) => navigate(`/album/${albumId}`),
                    onGoToArtist: (artistId) => navigate(`/artist/${artistId}`),
                })))
                : React.createElement('div', { className: 'flex flex-col gap-3 bg-glorify-bg-surface/20 border border-glorify-border-primary/10 p-2 rounded-[24px]' }, flatResultsList.map((item, idx) => React.createElement('div', {
                    key: item.id + '-' + item.type + '-' + idx,
                    onClick: () => triggerAction(item),
                    className: `flex items-center justify-between p-3.5 rounded-[16px] transition-all duration-200 cursor-pointer border border-transparent ${focusedIndex === idx
                        ? 'bg-glorify-bg-secondary border-glorify-accent/20 text-glorify-text-primary shadow-sm'
                        : 'hover:bg-glorify-bg-secondary/40 text-glorify-text-secondary hover:text-glorify-text-primary'}`
                }, React.createElement('div', { className: 'flex items-center gap-4 min-w-0' }, React.createElement('span', { className: 'text-[9px] font-mono tracking-widest text-glorify-accent bg-glorify-accent-glow px-2 py-0.5 rounded-sm flex-shrink-0 font-semibold' }, item.type === 'track' ? 'SONG' : item.type.toUpperCase()), React.createElement('div', { className: 'min-w-0' }, React.createElement('div', { className: 'text-sm font-semibold truncate' }, highlightText(item.title, query)), React.createElement('div', { className: 'text-xs text-glorify-text-muted truncate mt-0.5' }, highlightText(item.subtitle, query)))), React.createElement(ArrowRight, { className: 'w-ch-4.5 h-ch-4.5 text-glorify-text-muted opacity-40 flex-shrink-0' }))))))
        : React.createElement(motion.div, {
            key: 'sections',
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            exit: { opacity: 0 },
            className: 'flex flex-col gap-ch-8'
        }, 
        // Persistent Recently Searched Items
        recentSearches.length > 0 &&
            React.createElement('div', { className: 'flex flex-col gap-ch-3' }, React.createElement('div', { className: 'flex items-center justify-between pl-ch-1' }, React.createElement('span', { className: 'text-sm font-bold text-glorify-text-primary' }, 'Recently Searched'), React.createElement('button', { onClick: clearHistory, className: 'text-xs text-glorify-error hover:underline flex items-center gap-1 cursor-pointer outline-none border-none bg-transparent' }, React.createElement(Trash2, { className: 'w-ch-3.5 h-ch-3.5' }), 'Clear History')), React.createElement('div', { className: 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-ch-6' }, recentSearches.map((item) => React.createElement(CatalogCard, {
                key: 'recent-' + item.id,
                id: item.id,
                title: item.title,
                subtitle: item.subtitle,
                type: item.type === 'track' ? 'album' : item.type,
                coverUrl: item.coverUrl,
                onClick: () => triggerAction(item)
            })))), 
        // Top categories
        React.createElement('div', { className: 'flex flex-col gap-ch-4' }, React.createElement('span', { className: 'text-sm font-bold text-glorify-text-primary pl-ch-1' }, 'Trending Genres'), React.createElement('div', { className: 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-ch-6' }, [
            { name: 'Lo-Fi Chill', color: 'from-[#8B7E74] to-[#C7BCA1]' },
            { name: 'Ambient Drift', color: 'from-[#C87A53] to-[#F6F2E9]' },
            { name: 'Retrowave', color: 'from-[#E66E4A] to-[#D4AF37]' },
            { name: 'Acoustic Folk', color: 'from-[#8D5B4C] to-[#C7A38D]' },
            { name: 'Neo-Classical', color: 'from-[#800020] to-[#C87A53]' },
            { name: 'Glitch Electronic', color: 'from-[#5A3825] to-[#B87333]' }
        ].map((genre) => React.createElement(motion.div, {
            key: genre.name,
            onClick: () => {
                setQuery(genre.name);
                searchInputRef.current?.focus();
            },
            whileHover: { scale: 1.04 },
            whileTap: { scale: 0.96 },
            className: `relative aspect-[3/4] p-ch-4 rounded-[24px] bg-gradient-to-br ${genre.color} border border-glorify-border-primary/5 shadow-md flex items-end cursor-pointer overflow-hidden group`
        }, React.createElement('span', { className: 'text-sm font-bold text-white leading-tight pr-4 drop-shadow' }, genre.name), React.createElement(Disc, { className: 'absolute -right-4 -bottom-4 w-20 h-20 text-white/10 group-hover:rotate-45 transition-transform duration-700' }))))))));
}
//# sourceMappingURL=Search.js.map