import React, { useState, useEffect, useMemo, useRef } from 'react';
import { StaticMusicRepository } from '../repositories/musicRepository.js';
import { CatalogCard } from '../components/Library/CatalogCard.js';
import { DetailOverlay } from '../components/Library/DetailOverlay.js';
import { useDebounce } from '@chotify/hooks';
import { usePlayerStore } from '../store/playerStore.js';
import { Search, Flame, Music, Sparkles, Clock, Trash2, ArrowRight } from 'lucide-react';
export function Explore() {
    const [query, setQuery] = useState('');
    const debouncedQuery = useDebounce(query, 300);
    const [activeCategory, setActiveCategory] = useState('all');
    // Data sets
    const [tracks, setTracks] = useState([]);
    const [albums, setAlbums] = useState([]);
    const [artists, setArtists] = useState([]);
    const [playlists, setPlaylists] = useState([]);
    // Recent Searches History
    const [recentSearches, setRecentSearches] = useState([]);
    // Details Overlay Target
    const [selectedItem, setSelectedItem] = useState(null);
    const { playTrack } = usePlayerStore();
    const searchInputRef = useRef(null);
    // Load catalogs on mount
    useEffect(() => {
        const loadCatalog = async () => {
            try {
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
                console.error('Failed to load explore search data:', err);
            }
        };
        loadCatalog();
        // Load recent search history from local storage
        const saved = localStorage.getItem('chotify-search-history');
        if (saved) {
            setRecentSearches(JSON.parse(saved));
        }
    }, []);
    // Filter matching entries
    const filteredResults = useMemo(() => {
        if (!debouncedQuery.trim()) {
            return { tracks: [], albums: [], artists: [], playlists: [] };
        }
        const searchTerm = debouncedQuery.toLowerCase();
        const matchTracks = tracks.filter((t) => t.title.toLowerCase().includes(searchTerm) ||
            t.artist.toLowerCase().includes(searchTerm) ||
            (t.album && t.album.toLowerCase().includes(searchTerm)));
        const matchAlbums = albums.filter((al) => al.title.toLowerCase().includes(searchTerm) ||
            al.artistName.toLowerCase().includes(searchTerm));
        const matchArtists = artists.filter((ar) => ar.name.toLowerCase().includes(searchTerm) ||
            ar.genres.some((g) => g.toLowerCase().includes(searchTerm)));
        const matchPlaylists = playlists.filter((pl) => pl.name.toLowerCase().includes(searchTerm) ||
            (pl.description && pl.description.toLowerCase().includes(searchTerm)));
        return {
            tracks: matchTracks,
            albums: matchAlbums,
            artists: matchArtists,
            playlists: matchPlaylists,
        };
    }, [debouncedQuery, tracks, albums, artists, playlists]);
    // Combine results for keyboard list trapping
    const flatResultsList = useMemo(() => {
        const list = [];
        if (activeCategory === 'all' || activeCategory === 'songs') {
            filteredResults.tracks.forEach((t) => list.push({ id: t.id, title: t.title, subtitle: t.artist, type: 'track', raw: t }));
        }
        if (activeCategory === 'all' || activeCategory === 'albums') {
            filteredResults.albums.forEach((al) => list.push({ id: al.id, title: al.title, subtitle: al.artistName, type: 'album', raw: al }));
        }
        if (activeCategory === 'all' || activeCategory === 'artists') {
            filteredResults.artists.forEach((ar) => list.push({ id: ar.id, title: ar.name, subtitle: ar.genres.join(', '), type: 'artist', raw: ar }));
        }
        if (activeCategory === 'all' || activeCategory === 'playlists') {
            filteredResults.playlists.forEach((pl) => list.push({ id: pl.id, title: pl.name, subtitle: 'PLAYLIST', type: 'playlist', raw: pl }));
        }
        return list;
    }, [filteredResults, activeCategory]);
    const [keyboardIndex, setKeyboardIndex] = useState(-1);
    // Reset keyboard index on new search queries
    useEffect(() => {
        setKeyboardIndex(-1);
    }, [debouncedQuery, activeCategory]);
    // Keyboard navigation listeners
    const handleKeyDown = (e) => {
        if (flatResultsList.length === 0)
            return;
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setKeyboardIndex((prev) => (prev + 1) % flatResultsList.length);
        }
        else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setKeyboardIndex((prev) => (prev - 1 + flatResultsList.length) % flatResultsList.length);
        }
        else if (e.key === 'Enter') {
            e.preventDefault();
            if (keyboardIndex >= 0 && keyboardIndex < flatResultsList.length) {
                const selected = flatResultsList[keyboardIndex];
                triggerAction(selected);
            }
        }
        else if (e.key === 'Escape') {
            setQuery('');
            setKeyboardIndex(-1);
            searchInputRef.current?.blur();
        }
    };
    const triggerAction = (item) => {
        // Add term to recent searches history
        saveSearchQuery(query.trim());
        if (item.type === 'track') {
            playTrack(item.raw, tracks);
        }
        else {
            setSelectedItem({ id: item.id, type: item.type });
        }
    };
    const saveSearchQuery = (term) => {
        if (!term)
            return;
        setRecentSearches((prev) => {
            const next = [term, ...prev.filter((t) => t !== term)].slice(0, 5);
            localStorage.setItem('chotify-search-history', JSON.stringify(next));
            return next;
        });
    };
    const clearHistory = () => {
        setRecentSearches([]);
        localStorage.removeItem('chotify-search-history');
    };
    // Text highlight helper
    const highlightText = (text, highlight) => {
        if (!highlight.trim())
            return text;
        const regex = new RegExp(`(${highlight.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'gi');
        const parts = text.split(regex);
        return parts.map((part, index) => regex.test(part)
            ? React.createElement('span', { key: index, className: 'text-chotify-aura-gold underline font-semibold' }, part)
            : part);
    };
    const categoriesList = [
        { id: 'all', label: 'ALL RESULTS' },
        { id: 'songs', label: 'SONGS' },
        { id: 'albums', label: 'ALBUMS' },
        { id: 'artists', label: 'ARTISTS' },
        { id: 'playlists', label: 'PLAYLISTS' },
    ];
    return React.createElement('div', { className: 'flex flex-col gap-ch-8 outline-none', onKeyDown: handleKeyDown }, 
    // Search Bar Top Console
    React.createElement('div', { className: 'flex flex-col gap-ch-4' }, React.createElement('div', { className: 'relative w-full max-w-xl' }, React.createElement(Search, {
        className: 'absolute left-ch-4 top-1/2 -translate-y-1/2 w-ch-4 h-ch-4 text-chotify-text-muted',
    }), React.createElement('input', {
        ref: searchInputRef,
        type: 'text',
        value: query,
        onChange: (e) => setQuery(e.target.value),
        placeholder: 'Search songs, albums, algorithmic synthesis stems...',
        className: 'w-full h-11 pl-ch-11 pr-ch-4 rounded-ch-lg bg-chotify-bg-surface border border-chotify-border-primary text-xs text-chotify-text-primary placeholder-chotify-text-muted focus:border-chotify-aura-gold/50 outline-none transition-colors focus-ring',
        'aria-label': 'Catalog search bar input',
    })), 
    // Search Chips Categories
    query.trim() &&
        React.createElement('div', { className: 'flex items-center gap-ch-2 overflow-x-auto scrollbar-none pb-1' }, categoriesList.map((cat) => React.createElement('button', {
            key: cat.id,
            onClick: () => setActiveCategory(cat.id),
            className: `px-ch-3 py-1.5 rounded-ch-sm text-[10px] font-mono tracking-wider cursor-pointer outline-none focus-ring ${activeCategory === cat.id
                ? 'bg-chotify-bg-secondary text-chotify-text-primary border border-chotify-border-primary'
                : 'text-chotify-text-muted hover:text-chotify-text-secondary border border-transparent'}`,
        }, cat.label)))), 
    // Render Results Panel
    query.trim()
        ? React.createElement('div', { className: 'flex-1 flex flex-col gap-ch-6' }, flatResultsList.length === 0
            ? React.createElement('div', { className: 'text-center py-12 text-sm font-mono text-chotify-text-muted' }, 'NO_MATCHING_RESOURCES_FOUND')
            : React.createElement('div', { className: 'flex flex-col gap-ch-4' }, React.createElement('div', { className: 'text-[10px] font-mono text-chotify-text-muted tracking-widest' }, `SEARCH RESULTS (${flatResultsList.length})`), React.createElement('div', { className: 'flex flex-col gap-ch-1' }, flatResultsList.map((item, idx) => {
                const isKeyboardSelected = idx === keyboardIndex;
                return React.createElement('div', {
                    key: item.id + '-' + item.type + '-' + idx,
                    onClick: () => triggerAction(item),
                    className: `flex items-center justify-between p-ch-3 rounded-ch-md cursor-pointer transition-all ${isKeyboardSelected
                        ? 'bg-chotify-bg-secondary text-chotify-text-primary border-l-2 border-chotify-aura-gold'
                        : 'hover:bg-chotify-bg-secondary/40 text-chotify-text-secondary'}`,
                }, React.createElement('div', { className: 'flex items-center gap-ch-4' }, React.createElement('span', { className: 'text-[10px] font-mono text-chotify-text-muted uppercase w-14' }, `[ ${item.type} ]`), React.createElement('div', null, React.createElement('div', { className: 'text-xs font-semibold' }, highlightText(item.title, query)), React.createElement('div', { className: 'text-[9px] font-mono text-chotify-text-muted uppercase' }, highlightText(item.subtitle, query)))), React.createElement(ArrowRight, { className: 'w-ch-3.5 h-ch-3.5 text-chotify-text-muted opacity-45' }));
            }))))
        : // Discovery View (empty search query)
            React.createElement('div', { className: 'flex flex-col gap-ch-8' }, 
            // Recent searches panel
            recentSearches.length > 0 &&
                React.createElement('div', { className: 'flex flex-col gap-ch-3' }, React.createElement('div', { className: 'flex items-center justify-between' }, React.createElement('span', { className: 'text-[10px] font-mono text-chotify-text-muted tracking-widest' }, 'RECENT SEARCHES'), React.createElement('button', {
                    onClick: clearHistory,
                    className: 'flex items-center gap-ch-1 text-[10px] font-mono text-chotify-error hover:underline cursor-pointer outline-none',
                }, React.createElement(Trash2, { className: 'w-ch-3 h-ch-3' }), 'CLEAR_ALL')), React.createElement('div', { className: 'flex flex-wrap gap-ch-2 mt-ch-1' }, recentSearches.map((term) => React.createElement('button', {
                    key: term,
                    onClick: () => setQuery(term),
                    className: 'flex items-center gap-ch-2 px-ch-3 py-1.5 rounded-ch-sm bg-chotify-bg-surface border border-chotify-border-primary hover:border-chotify-aura-gold/20 text-xs text-chotify-text-secondary cursor-pointer outline-none focus-ring',
                }, React.createElement(Clock, { className: 'w-ch-3.5 h-ch-3.5 text-chotify-text-muted' }), term)))), 
            // Suggested Category Rows
            React.createElement('div', { className: 'flex flex-col gap-ch-4' }, React.createElement('span', { className: 'text-[10px] font-mono text-chotify-text-muted tracking-widest' }, 'DISCOVERY CHANNELS'), React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-3 gap-ch-6' }, [
                { name: 'TRENDING SYNTHS', desc: 'Popular generated tracks', icon: Flame, tag: 'lofi' },
                { name: 'NEW COMPOSITIONS', desc: 'Recently synthesized prompts', icon: Music, tag: 'ambient' },
                { name: 'AURA CURATIONS', desc: 'Handcrafted prompt structures', icon: Sparkles, tag: 'synthwave' },
            ].map((cat) => React.createElement('div', {
                key: cat.name,
                onClick: () => setQuery(cat.tag),
                className: 'p-ch-6 rounded-ch-lg bg-chotify-bg-surface border border-chotify-border-primary hover:border-chotify-aura-gold/40 transition-colors flex flex-col gap-ch-4 cursor-pointer',
            }, React.createElement('div', {
                className: 'w-10 h-10 rounded-full bg-chotify-bg-secondary flex items-center justify-center text-chotify-aura-gold border border-chotify-border-secondary',
            }, React.createElement(cat.icon, { className: 'w-ch-4 h-ch-4' })), React.createElement('div', null, React.createElement('h2', { className: 'text-xs font-mono font-bold tracking-widest text-chotify-text-primary mb-1' }, `[ ${cat.name} ]`), React.createElement('p', { className: 'text-xs text-chotify-text-secondary' }, cat.desc)))))), 
            // Horizontal albums carousel row
            React.createElement('div', { className: 'flex flex-col gap-ch-4' }, React.createElement('span', { className: 'text-[10px] font-mono text-chotify-text-muted tracking-widest' }, 'TRENDING RELEASES'), React.createElement('div', { className: 'grid grid-cols-2 sm:grid-cols-4 gap-ch-6' }, albums.map((album) => React.createElement(CatalogCard, {
                key: album.id,
                id: album.id,
                title: album.title,
                subtitle: album.artistName,
                type: 'album',
                onClick: () => setSelectedItem({ id: album.id, type: 'album' }),
            }))))), 
    // Catalog details overlay slider drawer
    React.createElement(DetailOverlay, {
        id: selectedItem?.id || null,
        type: selectedItem?.type || null,
        onClose: () => setSelectedItem(null),
    }));
}
//# sourceMappingURL=Explore.js.map