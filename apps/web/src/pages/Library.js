import React, { useState, useEffect } from 'react';
import { StaticMusicRepository } from '../repositories/musicRepository.js';
import { TrackCard } from '../components/Library/TrackCard.js';
import { CatalogCard } from '../components/Library/CatalogCard.js';
import { DetailOverlay } from '../components/Library/DetailOverlay.js';
import { PlaylistDialog } from '../components/Library/PlaylistDialog.js';
import { usePlayerStore } from '../store/playerStore.js';
import { Music, Disc, Users, Heart, Plus } from 'lucide-react';
export function Library() {
    const [activeTab, setActiveTab] = useState('songs');
    const [tracks, setTracks] = useState([]);
    const [albums, setAlbums] = useState([]);
    const [artists, setArtists] = useState([]);
    // Use playerStore playlists as single source of truth for reactivity
    const { playlists, createPlaylist } = usePlayerStore();
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    // Selected item to load in DetailOverlay drawer
    const [selectedItem, setSelectedItem] = useState(null);
    // Load static resources on mount
    useEffect(() => {
        const loadData = async () => {
            try {
                const [t, al, ar] = await Promise.all([
                    StaticMusicRepository.getTracks(),
                    StaticMusicRepository.getAlbums(),
                    StaticMusicRepository.getArtists(),
                ]);
                setTracks(t);
                setAlbums(al);
                setArtists(ar);
                // Preload default static playlists if no custom playlists exist
                if (playlists.length === 0) {
                    createPlaylist('Lo-Fi Chill Focus Stems', 'Algorithmic focus loops for deep study sessions.');
                    createPlaylist('Retrowave Synthesizers', 'Fast-paced driving basslines and retrowave filters.');
                }
            }
            catch (err) {
                console.error('Failed to load library catalog data:', err);
            }
        };
        loadData();
    }, []);
    const tabs = [
        { id: 'songs', label: 'SONGS', icon: Music },
        { id: 'albums', label: 'ALBUMS', icon: Disc },
        { id: 'artists', label: 'ARTISTS', icon: Users },
        { id: 'favorites', label: 'FAVORITES', icon: Heart },
    ];
    return React.createElement('div', { className: 'flex flex-col gap-ch-8' }, 
    // Header Title
    React.createElement('div', { className: 'flex items-center justify-between border-b border-chotify-border-primary pb-ch-4' }, React.createElement('div', { className: 'flex flex-col gap-ch-1' }, React.createElement('h1', { className: 'text-2xl lg:text-3xl font-bold tracking-tight text-chotify-text-primary' }, 'USER LIBRARY'), React.createElement('p', { className: 'text-sm text-chotify-text-muted font-mono uppercase tracking-wider' }, 'Browse and play your custom audio collection')), 
    // Create playlist action button
    activeTab === 'favorites' &&
        React.createElement('button', {
            onClick: () => setShowCreateDialog(true),
            className: 'flex items-center gap-ch-2 px-ch-4 py-ch-2 bg-chotify-text-primary text-chotify-bg-primary rounded-ch-sm text-xs font-bold shadow-sm hover:shadow-ch-glow cursor-pointer active:scale-95 transition-all outline-none',
        }, React.createElement(Plus, { className: 'w-ch-4 h-ch-4' }), 'NEW PLAYLIST')), 
    // Tabs Navigation Row
    React.createElement('div', { className: 'flex items-center gap-ch-3 border-b border-chotify-border-primary pb-ch-2 overflow-x-auto scrollbar-none' }, tabs.map((tab) => React.createElement('button', {
        key: tab.id,
        onClick: () => setActiveTab(tab.id),
        className: `flex items-center gap-ch-2 px-ch-4 py-ch-2.5 rounded-ch-sm text-xs font-mono tracking-wider transition-colors cursor-pointer outline-none focus-ring ${activeTab === tab.id
            ? 'bg-chotify-bg-secondary text-chotify-text-primary font-bold'
            : 'text-chotify-text-muted hover:text-chotify-text-secondary'}`,
    }, React.createElement(tab.icon, { className: 'w-ch-4 h-ch-4' }), React.createElement('span', null, tab.label)))), 
    // Tab workspaces rendering
    React.createElement('div', { className: 'flex-1 min-h-[50vh]' }, 
    // SONGS TAB
    activeTab === 'songs' &&
        React.createElement('div', { className: 'flex flex-col gap-ch-1' }, tracks.length === 0
            ? React.createElement('div', { className: 'text-center py-12 text-sm font-mono text-chotify-text-muted' }, 'NO_SONGS_FOUND')
            : tracks.map((track, idx) => React.createElement(TrackCard, {
                key: track.id,
                track: track,
                index: idx,
                queueContext: tracks,
                onGoToAlbum: (albumId) => setSelectedItem({ id: albumId, type: 'album' }),
                onGoToArtist: (artistId) => setSelectedItem({ id: artistId, type: 'artist' }),
            }))), 
    // ALBUMS TAB
    activeTab === 'albums' &&
        React.createElement('div', { className: 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-ch-6' }, albums.length === 0
            ? React.createElement('div', { className: 'col-span-full text-center py-12 text-sm font-mono text-chotify-text-muted' }, 'NO_ALBUMS_FOUND')
            : albums.map((album) => React.createElement(CatalogCard, {
                key: album.id,
                id: album.id,
                title: album.title,
                subtitle: album.artistName,
                type: 'album',
                onClick: () => setSelectedItem({ id: album.id, type: 'album' }),
            }))), 
    // ARTISTS TAB
    activeTab === 'artists' &&
        React.createElement('div', { className: 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-ch-6' }, artists.length === 0
            ? React.createElement('div', { className: 'col-span-full text-center py-12 text-sm font-mono text-chotify-text-muted' }, 'NO_ARTISTS_FOUND')
            : artists.map((artist) => React.createElement(CatalogCard, {
                key: artist.id,
                id: artist.id,
                title: artist.name,
                subtitle: artist.genres.join(' / ').toUpperCase(),
                type: 'artist',
                onClick: () => setSelectedItem({ id: artist.id, type: 'artist' }),
            }))), 
    // FAVORITES TAB (Playlists)
    activeTab === 'favorites' &&
        React.createElement('div', { className: 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-ch-6' }, playlists.length === 0
            ? React.createElement('div', { className: 'col-span-full text-center py-12 text-sm font-mono text-chotify-text-muted' }, 'NO_FAVORITED_PLAYLISTS_FOUND')
            : playlists.map((playlist) => React.createElement(CatalogCard, {
                key: playlist.id,
                id: playlist.id,
                title: playlist.name,
                subtitle: 'PLAYLIST',
                type: 'playlist',
                onClick: () => setSelectedItem({ id: playlist.id, type: 'playlist' }),
            })))), 
    // Expand Details drawer overlay
    React.createElement(DetailOverlay, {
        id: selectedItem?.id || null,
        type: selectedItem?.type || null,
        onClose: () => setSelectedItem(null),
        onNavigate: (id, type) => setSelectedItem({ id, type }),
    }), 
    // Playlist Creation dialog
    showCreateDialog &&
        React.createElement(PlaylistDialog, {
            onClose: () => setShowCreateDialog(false),
        }));
}
//# sourceMappingURL=Library.js.map