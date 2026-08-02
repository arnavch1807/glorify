import React, { useMemo, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePlayerStore } from '../store/playerStore.js';
import { StaticMusicRepository } from '../repositories/musicRepository.js';
import { TrackCard } from '../components/Library/TrackCard.js';
import { PlaylistDialog } from '../components/Library/PlaylistDialog.js';
import { Play, Shuffle, ArrowLeft, Clock, Trash2, Copy, Edit, Music, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlaylistPageSkeleton } from '../components/SkeletonLoaders.js';
export function PlaylistPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [allTracks, setAllTracks] = useState([]);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const { playlists, playTrack, setQueue, toggleShuffle, deletePlaylist, duplicatePlaylist, renamePlaylist, reorderPlaylistTracks } = usePlayerStore();
    const playlist = useMemo(() => {
        return playlists.find((p) => p.id === id);
    }, [playlists, id]);
    const [isEditingName, setIsEditingName] = useState(false);
    const [isEditingDesc, setIsEditingDesc] = useState(false);
    const [editName, setEditName] = useState('');
    const [editDesc, setEditDesc] = useState('');
    // Sync state when playlist is loaded
    useEffect(() => {
        if (playlist) {
            setEditName(playlist.name);
            setEditDesc(playlist.description || '');
        }
    }, [playlist]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        setLoading(true);
        StaticMusicRepository.getTracks()
            .then(setAllTracks)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);
    const tracks = useMemo(() => {
        if (!playlist)
            return [];
        return allTracks.filter((t) => playlist.songs.includes(t.id));
    }, [playlist, allTracks]);
    const totalDuration = useMemo(() => {
        return tracks.reduce((acc, t) => acc + t.duration, 0);
    }, [tracks]);
    if (loading) {
        return React.createElement(PlaylistPageSkeleton);
    }
    const formatTotalTime = (secs) => {
        const mins = Math.floor(secs / 60);
        const hours = Math.floor(mins / 60);
        const remMins = mins % 60;
        if (hours > 0) {
            return `${hours} hr ${remMins} min`;
        }
        return `${mins} min`;
    };
    const handlePlayAll = () => {
        if (tracks.length > 0) {
            playTrack(tracks[0], tracks);
        }
    };
    const handleShufflePlay = () => {
        if (tracks.length > 0) {
            setQueue(tracks);
            const store = usePlayerStore.getState();
            if (!store.isShuffle) {
                toggleShuffle();
            }
            const randomIndex = Math.floor(Math.random() * tracks.length);
            playTrack(tracks[randomIndex], tracks);
        }
    };
    const handleDelete = () => {
        if (playlist) {
            if (confirm(`Are you sure you want to delete "${playlist.name}"?`)) {
                deletePlaylist(playlist.id);
                navigate('/library?tab=playlists');
            }
        }
    };
    const handleDuplicate = () => {
        if (playlist) {
            duplicatePlaylist(playlist.id);
        }
    };
    const saveName = () => {
        if (playlist && editName.trim()) {
            renamePlaylist(playlist.id, editName, playlist.description, playlist.coverImage);
        }
        setIsEditingName(false);
    };
    const saveDesc = () => {
        if (playlist) {
            renamePlaylist(playlist.id, playlist.name, editDesc, playlist.coverImage);
        }
        setIsEditingDesc(false);
    };
    // Drag and drop handlers
    const handleDragStart = (e, index) => {
        e.dataTransfer.setData('text/plain', index.toString());
    };
    const handleDragOver = (e) => {
        e.preventDefault();
    };
    const handleDrop = (e, targetIndex) => {
        const sourceIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);
        if (!isNaN(sourceIndex) && sourceIndex !== targetIndex && playlist) {
            reorderPlaylistTracks(playlist.id, sourceIndex, targetIndex);
        }
    };
    if (!playlist) {
        return React.createElement('div', { className: 'text-center py-16 font-sans' }, React.createElement('h2', { className: 'text-xl font-bold' }, 'Playlist Not Found'), React.createElement('button', { onClick: () => navigate(-1), className: 'mt-ch-4 text-xs text-glorify-accent hover:underline' }, 'Go Back'));
    }
    const mockFollowers = (parseInt(playlist.id.replace(/\D/g, ''), 10) || 124) % 1500 + 45;
    return React.createElement('div', { className: 'w-full flex flex-col gap-8 pb-32 font-sans relative' }, 
    // Header Navigation Bar
    React.createElement('div', { className: 'flex items-center justify-between z-10' }, React.createElement('button', {
        onClick: () => navigate(-1),
        className: 'flex items-center gap-ch-1.5 text-xs text-glorify-text-secondary hover:text-glorify-text-primary outline-none focus-ring cursor-pointer'
    }, React.createElement(ArrowLeft, { className: 'w-ch-4 h-ch-4' }), 'Back')), 
    // Playlist Hero Panel with dynamic mesh background extracted from cover Image
    React.createElement('div', {
        className: 'relative w-full rounded-[28px] overflow-hidden bg-gradient-to-b from-[#1C1B17] via-glorify-bg-surface/90 to-glorify-bg-surface/40 border border-glorify-border-primary/5 p-6 md:p-8 flex flex-col md:flex-row items-center md:items-end gap-ch-6 text-center md:text-left shadow-md'
    }, 
    // Dynamic color mesh
    playlist.coverImage &&
        React.createElement('div', {
            className: 'absolute inset-0 -z-10 bg-cover bg-center opacity-[0.06] blur-2xl scale-105 pointer-events-none',
            style: { backgroundImage: `url(${playlist.coverImage})` }
        }), 
    // Cover Art with Change Cover Hover
    React.createElement('div', { className: 'w-40 h-40 sm:w-48 sm:h-48 rounded-[24px] overflow-hidden bg-glorify-bg-secondary border border-glorify-border-primary flex items-center justify-center shadow-2xl flex-shrink-0 relative group' }, playlist.coverImage
        ? React.createElement('img', { src: playlist.coverImage, alt: playlist.name, className: 'w-full h-full object-cover transition-transform duration-500 group-hover:scale-105' })
        : React.createElement(Music, { className: 'w-16 h-16 text-glorify-text-muted' }), React.createElement('button', {
        onClick: () => setShowEditDialog(true),
        className: 'absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-semibold gap-2 transition-opacity cursor-pointer outline-none'
    }, React.createElement(Edit, { className: 'w-ch-4 h-ch-4' }), 'Change Cover')), 
    // Metadata Info with Inline Edits
    React.createElement('div', { className: 'flex flex-col gap-ch-2 mt-ch-4 md:mt-0 flex-1 min-w-0 z-10' }, React.createElement('span', { className: 'text-[10px] font-bold text-glorify-accent tracking-widest uppercase' }, 'PLAYLIST'), 
    // Editable Name
    isEditingName
        ? React.createElement('div', { className: 'flex items-center gap-2 max-w-xl' }, React.createElement('input', {
            type: 'text',
            value: editName,
            onChange: (e) => setEditName(e.target.value),
            onBlur: saveName,
            onKeyDown: (e) => e.key === 'Enter' && saveName(),
            autoFocus: true,
            className: 'text-2xl sm:text-3xl font-extrabold bg-glorify-bg-secondary/80 border border-glorify-accent/40 rounded-[12px] px-3 py-1.5 w-full text-glorify-text-primary outline-none focus-ring'
        }), React.createElement('button', { onClick: saveName, className: 'p-2 rounded-full bg-glorify-accent text-glorify-carbon-950 cursor-pointer shadow-md' }, React.createElement(Check, { className: 'w-4 h-4' })))
        : React.createElement('h1', {
            onDoubleClick: () => setIsEditingName(true),
            className: 'group text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-glorify-text-primary leading-none truncate cursor-pointer flex items-center gap-3 hover:text-glorify-accent transition-colors'
        }, playlist.name, React.createElement('button', {
            onClick: () => setIsEditingName(true),
            className: 'opacity-0 group-hover:opacity-100 p-1 text-glorify-text-muted hover:text-glorify-text-primary transition-opacity cursor-pointer'
        }, React.createElement(Edit, { className: 'w-4 h-4' }))), 
    // Editable Description
    isEditingDesc
        ? React.createElement('div', { className: 'flex items-center gap-2 max-w-xl mt-1' }, React.createElement('input', {
            type: 'text',
            value: editDesc,
            onChange: (e) => setEditDesc(e.target.value),
            onBlur: saveDesc,
            onKeyDown: (e) => e.key === 'Enter' && saveDesc(),
            autoFocus: true,
            className: 'text-xs bg-glorify-bg-secondary/80 border border-glorify-accent/40 rounded-[8px] px-3 py-1.5 w-full text-glorify-text-primary outline-none focus-ring'
        }), React.createElement('button', { onClick: saveDesc, className: 'p-1.5 rounded-full bg-glorify-accent text-glorify-carbon-950 cursor-pointer shadow-md' }, React.createElement(Check, { className: 'w-3 h-3' })))
        : React.createElement('p', {
            onDoubleClick: () => setIsEditingDesc(true),
            className: 'group text-xs text-glorify-text-secondary leading-relaxed max-w-xl cursor-pointer flex items-center gap-2 hover:text-glorify-text-primary transition-colors mt-1'
        }, playlist.description || 'No description loaded. Double click to add details.', React.createElement('button', {
            onClick: () => setIsEditingDesc(true),
            className: 'opacity-0 group-hover:opacity-100 p-0.5 text-glorify-text-muted hover:text-glorify-text-primary transition-opacity cursor-pointer'
        }, React.createElement(Edit, { className: 'w-3.5 h-3.5' }))), 
    // Statistics row
    React.createElement('div', { className: 'flex flex-wrap items-center justify-center md:justify-start gap-ch-2 text-xs text-glorify-text-muted font-medium mt-2' }, React.createElement('span', { className: 'text-glorify-text-primary font-semibold' }, 'Creator: ' + (playlist.userId === 'user_dev' ? 'You' : 'Glorify AI')), React.createElement('span', null, '•'), React.createElement('span', null, `${mockFollowers.toLocaleString()} followers`), React.createElement('span', null, '•'), React.createElement('span', null, `${tracks.length} song${tracks.length === 1 ? '' : 's'}`), tracks.length > 0 && React.createElement('span', null, '•'), tracks.length > 0 && React.createElement('span', { className: 'flex items-center gap-1' }, React.createElement(Clock, { className: 'w-ch-3.5 h-ch-3.5' }), formatTotalTime(totalDuration))))), 
    // Sticky Play/Shuffle Button Bar (Pins to top when scrolling)
    React.createElement('div', { className: 'sticky top-0 z-20 py-4 bg-glorify-bg-primary/95 backdrop-blur-md border-b border-glorify-border-primary/5 flex items-center justify-between flex-wrap gap-ch-3' }, 
    // Play & Shuffle
    React.createElement('div', { className: 'flex items-center gap-ch-3' }, tracks.length > 0 &&
        React.createElement(motion.button, {
            onClick: handlePlayAll,
            whileHover: { scale: 1.05 },
            whileTap: { scale: 0.95 },
            className: 'px-ch-6 py-3 rounded-full bg-glorify-accent text-glorify-carbon-950 text-xs font-bold flex items-center gap-ch-2 shadow-lg cursor-pointer hover:shadow-xl'
        }, React.createElement(Play, { className: 'w-ch-4 fill-currentColor pl-0.5' }), 'Play All'), tracks.length > 0 &&
        React.createElement(motion.button, {
            onClick: handleShufflePlay,
            whileHover: { scale: 1.05 },
            whileTap: { scale: 0.95 },
            className: 'px-ch-5 py-3 rounded-full bg-glorify-bg-secondary text-glorify-text-primary border border-glorify-border-primary text-xs font-bold flex items-center gap-ch-2 cursor-pointer'
        }, React.createElement(Shuffle, { className: 'w-ch-4 h-ch-4' }), 'Shuffle')), 
    // Other actions
    React.createElement('div', { className: 'flex items-center gap-ch-2' }, React.createElement(motion.button, {
        onClick: () => setShowEditDialog(true),
        whileHover: { scale: 1.05 },
        whileTap: { scale: 0.95 },
        className: 'px-ch-4 py-2.5 rounded-full border border-glorify-border-primary text-glorify-text-secondary hover:text-glorify-text-primary text-xs font-bold flex items-center gap-1.5 cursor-pointer',
        title: 'Edit details'
    }, React.createElement(Edit, { className: 'w-ch-4 h-ch-4' }), 'Cover'), React.createElement(motion.button, {
        onClick: handleDuplicate,
        whileHover: { scale: 1.05 },
        whileTap: { scale: 0.95 },
        className: 'px-ch-4 py-2.5 rounded-full border border-glorify-border-primary text-glorify-text-secondary hover:text-glorify-text-primary text-xs font-bold flex items-center gap-1.5 cursor-pointer',
        title: 'Duplicate playlist'
    }, React.createElement(Copy, { className: 'w-ch-4 h-ch-4' }), 'Duplicate'), React.createElement(motion.button, {
        onClick: handleDelete,
        whileHover: { scale: 1.05 },
        whileTap: { scale: 0.95 },
        className: 'px-ch-4 py-2.5 rounded-full border border-glorify-border-primary text-glorify-error hover:bg-glorify-error/10 hover:border-glorify-error text-xs font-bold flex items-center gap-1.5 cursor-pointer',
        title: 'Delete playlist'
    }, React.createElement(Trash2, { className: 'w-ch-4 h-ch-4' }), 'Delete'))), 
    // Tracks Drag and Drop List Section
    React.createElement('div', { className: 'flex flex-col gap-ch-4' }, React.createElement('div', { className: 'flex flex-col bg-glorify-bg-surface/20 border border-glorify-border-primary/5 rounded-[24px] p-ch-3 shadow-sm' }, tracks.length === 0
        ? React.createElement('div', { className: 'text-center py-20 flex flex-col items-center justify-center gap-ch-4 font-sans select-none' }, React.createElement(Music, { className: 'w-12 h-12 text-glorify-text-muted/40 animate-pulse' }), React.createElement('div', { className: 'flex flex-col gap-1' }, React.createElement('span', { className: 'text-sm font-semibold text-glorify-text-secondary' }, 'Nothing here yet.'), React.createElement('span', { className: 'text-xs text-glorify-text-muted' }, "Let's build your music world.")), React.createElement('button', {
            onClick: () => navigate('/search'),
            className: 'mt-ch-2 px-ch-5 py-2 bg-glorify-accent text-glorify-carbon-950 rounded-full text-xs font-bold shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer'
        }, 'Explore songs'))
        : React.createElement(AnimatePresence, null, tracks.map((track, idx) => React.createElement('div', {
            key: track.id + '-' + idx,
            draggable: true,
            onDragStart: (e) => handleDragStart(e, idx),
            onDragOver: handleDragOver,
            onDrop: (e) => handleDrop(e, idx),
            className: 'cursor-grab active:cursor-grabbing hover-lift mb-ch-1'
        }, React.createElement(TrackCard, {
            track: track,
            index: idx,
            queueContext: tracks,
            onGoToAlbum: (albumId) => navigate(`/album/${albumId}`),
            onGoToArtist: (artistId) => navigate(`/artist/${artistId}`),
        })))))), 
    // Edit Playlist Dialog Modal
    showEditDialog &&
        React.createElement(PlaylistDialog, {
            playlistId: playlist.id,
            initialName: playlist.name,
            initialDescription: playlist.description,
            onClose: () => setShowEditDialog(false)
        }));
}
//# sourceMappingURL=PlaylistPage.js.map