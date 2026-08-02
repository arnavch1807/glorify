import React, { useState } from 'react';
import { usePlayerStore } from '../../store/playerStore.js';
import { formatDuration } from '@chotify/utils';
import { Play, Pause, MoreHorizontal, Plus, Heart, AlertCircle } from 'lucide-react';
import { TrackContextMenu } from '../AudioPlayer/TrackContextMenu.js';
import { motion } from 'framer-motion';
export const TrackCard = React.memo(function TrackCard({ track, index, queueContext, onGoToAlbum, onGoToArtist, }) {
    const { currentTrack, isPlaying, playTrack, togglePlay, addToQueue, favoritedTrackIds, toggleFavoriteTrack, downloadStates, downloadProgress, startDownloadTrack } = usePlayerStore();
    const [contextMenu, setContextMenu] = useState(null);
    const isCurrent = currentTrack?.id === track.id;
    const isLiked = favoritedTrackIds.includes(track.id);
    // Download state mapping
    const downloadState = downloadStates[track.id];
    const progressVal = downloadProgress[track.id] || 0;
    const handlePlayClick = (e) => {
        e.stopPropagation();
        if (isCurrent) {
            togglePlay();
        }
        else {
            playTrack(track, queueContext);
        }
    };
    const handleQueueClick = (e) => {
        e.stopPropagation();
        addToQueue(track);
    };
    const handleFavoriteClick = (e) => {
        e.stopPropagation();
        toggleFavoriteTrack(track.id);
    };
    const handleContextMenu = (e) => {
        e.preventDefault();
        setContextMenu({ x: e.clientX, y: e.clientY });
    };
    const handleOptionsClick = (e) => {
        e.stopPropagation();
        setContextMenu({ x: e.clientX, y: e.clientY });
    };
    return React.createElement('div', {
        onDoubleClick: () => playTrack(track, queueContext),
        onContextMenu: handleContextMenu,
        className: 'group flex items-center justify-between px-ch-5 py-4 rounded-[22px] bg-glorify-bg-surface/20 hover:bg-glorify-bg-surface/75 border border-glorify-border-primary/5 hover:border-glorify-border-primary/10 transition-all duration-300 cursor-pointer select-none relative shadow-sm mb-ch-3 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] font-sans',
    }, 
    // Left: index, play button, equalizer, artwork, titles
    React.createElement('div', { className: 'flex items-center gap-ch-4 flex-1 min-w-0' }, 
    // Index / Play / Equalizer
    React.createElement('div', { className: 'w-ch-6 flex items-center justify-center flex-shrink-0' }, isCurrent && isPlaying
        ? React.createElement('div', { className: 'group-hover:hidden flex items-end justify-center gap-[2px] w-4 h-4 pb-0.5' }, React.createElement('div', { className: 'w-[2px] bg-glorify-accent eq-bar-1' }), React.createElement('div', { className: 'w-[2px] bg-glorify-accent eq-bar-2' }), React.createElement('div', { className: 'w-[2px] bg-glorify-accent eq-bar-3' }))
        : React.createElement('span', {
            className: `text-xs font-mono group-hover:hidden ${isCurrent ? 'text-glorify-accent font-semibold' : 'text-glorify-text-muted/70'}`,
        }, String(index + 1).padStart(2, '0')), React.createElement('button', {
        onClick: handlePlayClick,
        className: 'hidden group-hover:flex p-1 rounded-full text-glorify-text-primary hover:text-glorify-accent transition-colors outline-none focus-ring cursor-pointer border-none bg-transparent',
    }, isCurrent && isPlaying
        ? React.createElement(Pause, { className: 'w-ch-3.5 h-ch-3.5 fill-currentColor' })
        : React.createElement(Play, { className: 'w-ch-3.5 h-ch-3.5 fill-currentColor pl-0.5' }))), 
    // Artwork image
    track.coverImage
        ? React.createElement('img', {
            src: track.coverImage,
            alt: track.title,
            className: 'w-12 h-12 rounded-[20px] object-cover flex-shrink-0 shadow-sm',
        })
        : React.createElement('div', {
            className: 'w-12 h-12 rounded-[20px] bg-glorify-bg-secondary/80 flex items-center justify-center font-mono text-[8px] font-bold text-glorify-text-muted flex-shrink-0 shadow-sm',
        }, 'TRACK'), 
    // Title & Artist
    React.createElement('div', { className: 'flex-1 min-w-0' }, React.createElement('div', {
        className: `text-sm font-semibold truncate ${isCurrent ? 'text-glorify-accent' : 'text-glorify-text-primary'}`,
    }, track.title), React.createElement('div', { className: 'text-xs text-glorify-text-muted truncate mt-0.5' }, track.artist))), 
    // Middle: Album name
    track.album &&
        React.createElement('div', { className: 'hidden md:block flex-1 text-sm text-glorify-text-secondary truncate px-ch-4' }, track.album), 
    // Right: Like button, Offline/Download indicators, duration, context trigger
    React.createElement('div', { className: 'flex items-center gap-ch-4 text-glorify-text-secondary flex-shrink-0' }, 
    // Simulated Download Indicators (offline state badge / progress)
    downloadState === 'downloading' &&
        React.createElement('div', { className: 'flex items-center gap-1.5 text-[9px] font-mono text-glorify-accent' }, React.createElement('span', { className: 'w-1.5 h-1.5 rounded-full bg-glorify-accent animate-ping' }), `${progressVal}%`), downloadState === 'completed' &&
        React.createElement('span', {
            className: 'px-1.5 py-0.5 bg-glorify-accent/15 border border-glorify-accent/25 text-glorify-accent text-[8px] font-mono rounded font-bold uppercase tracking-wider',
            title: 'Available Offline'
        }, 'OFFLINE'), downloadState === 'failed' &&
        React.createElement('div', { title: 'Download Failed' }, React.createElement(AlertCircle, { className: 'w-3.5 h-3.5 text-glorify-error' })), 
    // Favorite Button (visible when favorited OR on hover)
    React.createElement(motion.button, {
        onClick: handleFavoriteClick,
        whileHover: { scale: 1.2 },
        whileTap: { scale: 0.8 },
        className: `p-1 rounded-full hover:bg-glorify-bg-secondary outline-none focus-ring cursor-pointer transition-all border-none bg-transparent ${isLiked
            ? 'text-glorify-accent opacity-100'
            : 'opacity-0 group-hover:opacity-100 hover:text-glorify-text-primary'}`,
        title: isLiked ? 'Remove from Liked Songs' : 'Add to Liked Songs',
    }, React.createElement(Heart, {
        className: 'w-ch-4 h-ch-4',
        fill: isLiked ? 'currentColor' : 'none'
    })), React.createElement('span', { className: 'text-xs font-mono text-glorify-text-muted/80' }, formatDuration(track.duration)), React.createElement('div', { className: 'flex items-center gap-ch-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200' }, React.createElement('button', {
        onClick: handleQueueClick,
        className: 'p-1 rounded-ch-sm hover:bg-glorify-bg-secondary hover:text-glorify-text-primary cursor-pointer outline-none focus-ring border-none bg-transparent',
        title: 'Add to queue',
    }, React.createElement(Plus, { className: 'w-ch-4 h-ch-4' })), React.createElement('button', {
        onClick: handleOptionsClick,
        className: 'p-1 rounded-ch-sm hover:bg-glorify-bg-secondary hover:text-glorify-text-primary cursor-pointer outline-none focus-ring border-none bg-transparent',
        'aria-label': 'More options',
    }, React.createElement(MoreHorizontal, { className: 'w-ch-4 h-ch-4' })))), 
    // Track Options Context Menu
    contextMenu &&
        React.createElement(TrackContextMenu, {
            track: track,
            x: contextMenu.x,
            y: contextMenu.y,
            onClose: () => setContextMenu(null),
            onGoToAlbum: onGoToAlbum,
            onGoToArtist: onGoToArtist,
        }));
});
//# sourceMappingURL=TrackCard.js.map