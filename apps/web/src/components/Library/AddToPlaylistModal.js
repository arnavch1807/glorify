import React, { useState, useMemo } from 'react';
import { usePlayerStore } from '../../store/playerStore.js';
import { useToastStore } from '../../store/toastStore.js';
import { X, Search, Plus, FolderPlus, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
export function AddToPlaylistModal({ track, onClose }) {
    const { playlists, addTrackToPlaylist, createPlaylist } = usePlayerStore();
    const { addToast } = useToastStore();
    const [searchQuery, setSearchQuery] = useState('');
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newPlaylistName, setNewPlaylistName] = useState('');
    const [newPlaylistDesc, setNewPlaylistDesc] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    // Filter playlists
    const filteredPlaylists = useMemo(() => {
        return playlists.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }, [playlists, searchQuery]);
    const handleSelectPlaylist = async (playlist) => {
        try {
            // Check if track is already in playlist
            if (playlist.songs.includes(track.id)) {
                addToast(`"${track.title}" is already in "${playlist.name}"`, 'info');
                onClose();
                return;
            }
            await addTrackToPlaylist(playlist.id, track);
            addToast(`Added "${track.title}" to "${playlist.name}"`, 'success');
            onClose();
        }
        catch (err) {
            console.error(err);
            addToast('Failed to add track to playlist', 'error');
        }
    };
    const handleCreateAndAdd = async (e) => {
        e.preventDefault();
        if (!newPlaylistName.trim()) {
            setError('Playlist name is required');
            return;
        }
        setIsSubmitting(true);
        setError('');
        try {
            const created = await createPlaylist(newPlaylistName.trim(), newPlaylistDesc.trim());
            if (created) {
                await addTrackToPlaylist(created.id, track);
                addToast(`Created playlist "${created.name}" and added track!`, 'success');
                onClose();
            }
            else {
                throw new Error('Failed to create playlist');
            }
        }
        catch (err) {
            console.error(err);
            setError('Failed to create playlist. Please try again.');
            addToast('Failed to create playlist', 'error');
        }
        finally {
            setIsSubmitting(false);
        }
    };
    return React.createElement('div', {
        className: 'fixed inset-0 z-[99999] flex items-center justify-center p-ch-4 bg-[#0b0b0a]/75 backdrop-blur-xs font-sans text-left pointer-events-auto',
        onClick: (e) => {
            e.stopPropagation();
            onClose();
        },
        onMouseDown: (e) => e.stopPropagation(),
        onMouseUp: (e) => e.stopPropagation(),
    }, React.createElement(motion.div, {
        initial: { scale: 0.95, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        exit: { scale: 0.95, opacity: 0 },
        transition: { duration: 0.15 },
        className: 'bg-glorify-bg-surface border border-glorify-border-primary rounded-[24px] max-w-sm w-full shadow-2xl flex flex-col overflow-hidden max-h-[85vh]',
        onClick: (e) => e.stopPropagation(),
        onMouseDown: (e) => e.stopPropagation(),
        onMouseUp: (e) => e.stopPropagation(),
    }, 
    // Header
    React.createElement('div', { className: 'flex items-center justify-between px-ch-6 py-ch-4 border-b border-glorify-border-primary/10' }, React.createElement('span', { className: 'text-sm font-bold text-glorify-text-primary' }, 'Add to Playlist'), React.createElement('button', {
        onClick: onClose,
        className: 'p-1 rounded-full text-glorify-text-secondary hover:text-glorify-text-primary transition-all hover:bg-white/5 cursor-pointer outline-none focus-ring',
    }, React.createElement(X, { className: 'w-ch-4.5 h-ch-4.5' }))), 
    // Content Area
    React.createElement('div', { className: 'p-ch-6 flex flex-col gap-ch-4 overflow-y-auto scrollbar-none' }, !showCreateForm
        ? React.createElement(React.Fragment, null, 
        // Search input
        React.createElement('div', { className: 'relative flex items-center' }, React.createElement(Search, { className: 'absolute left-ch-3 w-ch-4 h-ch-4 text-glorify-text-secondary' }), React.createElement('input', {
            type: 'text',
            value: searchQuery,
            onChange: (e) => setSearchQuery(e.target.value),
            placeholder: 'Search playlists...',
            className: 'w-full pl-ch-9 pr-ch-3 py-2 bg-glorify-bg-surface/50 border border-glorify-border-primary/20 rounded-xl text-xs text-glorify-text-primary outline-none focus:border-glorify-accent/50 focus-ring transition-all',
        })), 
        // Playlists List
        React.createElement('div', { className: 'flex flex-col max-h-[220px] overflow-y-auto scrollbar-none gap-ch-1' }, filteredPlaylists.length === 0
            ? React.createElement('div', { className: 'text-center py-6 text-xs text-glorify-text-muted font-normal' }, 'No playlists found.')
            : filteredPlaylists.map((p) => React.createElement('button', {
                key: p.id,
                onClick: () => handleSelectPlaylist(p),
                className: 'w-full text-left px-ch-4 py-3 rounded-xl hover:bg-white/5 text-xs text-glorify-text-secondary hover:text-glorify-text-primary transition-all flex items-center justify-between cursor-pointer outline-none focus-ring',
            }, React.createElement('span', { className: 'font-semibold truncate mr-4' }, p.name), React.createElement('span', { className: 'text-[10px] text-glorify-text-muted flex-shrink-0' }, `${p.songs.length} song${p.songs.length === 1 ? '' : 's'}`)))), 
        // Divider
        React.createElement('div', { className: 'h-[1px] bg-glorify-border-primary/10 my-1' }), 
        // Create Trigger Button
        React.createElement('button', {
            onClick: () => setShowCreateForm(true),
            className: 'w-full flex items-center justify-center gap-ch-2 py-3 rounded-xl border border-dashed border-glorify-border-primary hover:border-glorify-accent/40 text-xs text-glorify-text-secondary hover:text-glorify-accent transition-all cursor-pointer font-bold outline-none focus-ring',
        }, React.createElement(Plus, { className: 'w-ch-4 h-ch-4' }), 'Create New Playlist'))
        : React.createElement('form', { onSubmit: handleCreateAndAdd, className: 'flex flex-col gap-ch-4' }, 
        // Form Title
        React.createElement('div', { className: 'flex items-center gap-2 mb-1' }, React.createElement(FolderPlus, { className: 'w-5 h-5 text-glorify-accent' }), React.createElement('span', { className: 'text-xs font-bold text-glorify-text-primary' }, 'New Playlist details')), 
        // Inputs
        React.createElement('div', { className: 'flex flex-col gap-ch-1' }, React.createElement('label', { className: 'text-[10px] font-bold text-glorify-text-secondary' }, 'Name'), React.createElement('input', {
            type: 'text',
            required: true,
            value: newPlaylistName,
            onChange: (e) => {
                setNewPlaylistName(e.target.value);
                setError('');
            },
            placeholder: 'My Summer Chill Synthwave...',
            className: 'w-full px-ch-3 py-2 bg-glorify-bg-surface/50 border border-glorify-border-primary/20 rounded-xl text-xs text-glorify-text-primary outline-none focus:border-glorify-accent/50 focus-ring transition-all',
        })), React.createElement('div', { className: 'flex flex-col gap-ch-1' }, React.createElement('label', { className: 'text-[10px] font-bold text-glorify-text-secondary' }, 'Description (optional)'), React.createElement('textarea', {
            value: newPlaylistDesc,
            onChange: (e) => setNewPlaylistDesc(e.target.value),
            placeholder: 'Algorithmic flow loops and lo-fi melodies...',
            className: 'w-full h-16 px-ch-3 py-2 bg-glorify-bg-surface/50 border border-glorify-border-primary/20 rounded-xl text-xs text-glorify-text-primary outline-none focus:border-glorify-accent/50 focus-ring transition-all resize-none',
        })), error &&
            React.createElement('div', { className: 'flex items-center gap-1.5 text-xs text-red-400 mt-1' }, React.createElement(AlertCircle, { className: 'w-4 h-4' }), React.createElement('span', null, error)), 
        // Actions
        React.createElement('div', { className: 'flex justify-end gap-ch-2 mt-ch-2' }, React.createElement('button', {
            type: 'button',
            onClick: () => {
                setShowCreateForm(false);
                setError('');
            },
            className: 'px-ch-4 py-2 border border-glorify-border-primary rounded-xl text-xs text-glorify-text-secondary hover:text-glorify-text-primary transition-all cursor-pointer outline-none focus-ring',
        }, 'Cancel'), React.createElement('button', {
            type: 'submit',
            disabled: isSubmitting,
            className: 'px-ch-4 py-2 bg-glorify-accent text-glorify-carbon-950 font-bold rounded-xl text-xs hover:scale-105 active:scale-95 transition-all cursor-pointer outline-none focus-ring disabled:opacity-50 disabled:pointer-events-none',
        }, isSubmitting ? 'Creating...' : 'Create & Add'))))));
}
//# sourceMappingURL=AddToPlaylistModal.js.map