import React, { useState, useEffect, useMemo, useRef } from 'react';
import { usePlayerStore } from '../../store/playerStore.js';
import { useToastStore } from '../../store/toastStore.js';
import { formatDuration } from '@chotify/utils';
import { X, Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Shuffle, Repeat, Heart, Share2, ListMusic, FileText, Disc, Settings as SettingsIcon, Sliders, Moon, Trash2, Pencil, AlignLeft, MoreHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { NoQueue } from '../EmptyStates.js';
import { AudioVisualizer } from './AudioVisualizer.js';
import { parseLrc } from '../../utils/lrcParser.js';
import { LyricsEditorModal } from '../Library/LyricsEditorModal.js';
import { TrackContextMenu } from './TrackContextMenu.js';
// Dynamic color configurations mapped to cover metadata
const trackColors = {
    sample_01: { accent: '#D4AF37', glow: 'rgba(212, 175, 55, 0.35)' }, // Lofi - Gold
    sample_02: { accent: '#C87A53', glow: 'rgba(200, 122, 83, 0.35)' }, // Ambient - Copper
    sample_03: { accent: '#E66E4A', glow: 'rgba(230, 110, 74, 0.35)' }, // Synthwave - Orange
    sample_04: { accent: '#6E2034', glow: 'rgba(110, 32, 52, 0.35)' }, // Glitch - Burgundy
};
export function FullscreenPlayer() {
    const { currentTrack, isPlaying, currentTime, duration, volume, isMuted, repeatMode, isShuffle, queue, isFullscreen, crossfadeDuration, isGapless, isNormalized, sleepTimerMinutes, sleepTimerRemaining, audioQuality, outputDevice, activePlayerTab, favoritedTrackIds, togglePlay, seek, setVolume, toggleMute, setRepeatMode, toggleShuffle, skipNext, skipPrevious, setFullscreen, setActivePlayerTab, reorderQueue, removeFromQueue, clearQueue, setCrossfadeDuration, setGapless, setNormalized, setSleepTimer, setAudioQuality, setOutputDevice, toggleFavoriteTrack, downloadedTrackIds } = usePlayerStore();
    const [isScrubbing, setIsScrubbing] = useState(false);
    const [contextMenu, setContextMenu] = useState(null);
    const accentColor = (currentTrack && trackColors[currentTrack.id]) ? trackColors[currentTrack.id].accent : '#D4AF37';
    const [scrubTime, setScrubTime] = useState(0);
    const isLiked = favoritedTrackIds.includes(currentTrack?.id || '');
    const isDownloaded = currentTrack ? downloadedTrackIds.includes(currentTrack.id) : false;
    const bufferedPercent = isDownloaded ? 100 : duration ? Math.min(100, (((isScrubbing ? scrubTime : currentTime) + (duration * 0.15)) / duration) * 100) : 0;
    const handleScrubChange = (e) => {
        const val = parseFloat(e.target.value);
        setScrubTime(val);
        if (!isScrubbing) {
            setIsScrubbing(true);
        }
    };
    const handleScrubEnd = (e) => {
        seek(scrubTime);
        setIsScrubbing(false);
    };
    const handleVolumeChange = (e) => {
        setVolume(parseFloat(e.target.value));
    };
    const cycleRepeatMode = () => {
        if (repeatMode === 'none')
            setRepeatMode('all');
        else if (repeatMode === 'all')
            setRepeatMode('one');
        else
            setRepeatMode('none');
    };
    const handleDragStart = (e, index) => {
        e.dataTransfer.setData('text/plain', index.toString());
    };
    const handleDragOver = (e) => {
        e.preventDefault();
    };
    const handleDrop = (e, targetIndex) => {
        const sourceIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);
        if (!isNaN(sourceIndex) && sourceIndex !== targetIndex) {
            reorderQueue(sourceIndex, targetIndex);
        }
    };
    const [isAutoScrollSuspended, setIsAutoScrollSuspended] = useState(false);
    const [showLyricsEditModal, setShowLyricsEditModal] = useState(false);
    const parsedLyrics = useMemo(() => {
        if (!currentTrack || !currentTrack.lyrics)
            return null;
        const lyr = currentTrack.lyrics;
        if (typeof lyr === 'string') {
            if (/\[\d+:\d+(?:[.:]\d+)?\]/.test(lyr)) {
                return {
                    type: 'synced',
                    lines: parseLrc(lyr),
                    text: lyr
                };
            }
            return {
                type: 'plain',
                text: lyr
            };
        }
        return lyr;
    }, [currentTrack]);
    const activeLineIndex = useMemo(() => {
        if (!parsedLyrics || parsedLyrics.type !== 'synced' || !parsedLyrics.lines || parsedLyrics.lines.length === 0) {
            return -1;
        }
        const timeMs = (isScrubbing ? scrubTime : currentTime) * 1000;
        let activeIdx = 0;
        const lines = parsedLyrics.lines;
        for (let i = 0; i < lines.length; i++) {
            if (timeMs >= lines[i].time) {
                activeIdx = i;
            }
        }
        return activeIdx;
    }, [currentTime, scrubTime, isScrubbing, parsedLyrics]);
    useEffect(() => {
        setIsAutoScrollSuspended(false);
    }, [currentTrack?.id]);
    const formatSleepTime = (sec) => {
        const m = Math.floor(sec / 60);
        const s = sec % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };
    const activeLyricRef = useRef(null);
    useEffect(() => {
        if (activeLyricRef.current && activePlayerTab === 'lyrics' && !isAutoScrollSuspended) {
            activeLyricRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            });
        }
    }, [activeLineIndex, activePlayerTab, isAutoScrollSuspended]);
    useEffect(() => {
        if (isFullscreen) {
            document.body.style.overflow = 'hidden';
        }
        else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isFullscreen]);
    const progressPercent = duration ? ((isScrubbing ? scrubTime : currentTime) / duration) * 100 : 0;
    const volumePercent = isMuted ? 0 : volume * 100;
    const displayTime = isScrubbing ? scrubTime : currentTime;
    const remainingTime = duration ? duration - displayTime : 0;
    // Dynamically resolved colors
    const activeColors = useMemo(() => {
        if (!currentTrack)
            return { accent: '#D4AF37', glow: 'rgba(212, 175, 55, 0.35)' };
        return trackColors[currentTrack.id] || { accent: '#D4AF37', glow: 'rgba(212, 175, 55, 0.35)' };
    }, [currentTrack]);
    const listVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };
    const lyricItemVariants = {
        hidden: { opacity: 0, y: 25 },
        show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 180, damping: 20 } }
    };
    return React.createElement(AnimatePresence, null, isFullscreen && currentTrack &&
        React.createElement(motion.div, {
            layoutId: 'player-bar-container',
            initial: { opacity: 0, scale: 0.98 },
            animate: { opacity: 1, scale: 1 },
            exit: { opacity: 0, scale: 0.98 },
            transition: { type: 'spring', damping: 30, stiffness: 220 },
            style: {
                '--color-glorify-accent': activeColors.accent,
                '--glorify-color-accent': activeColors.accent,
                '--glorify-color-accent-glow': activeColors.glow,
            },
            className: 'fixed inset-0 z-[9999] bg-glorify-bg-primary text-glorify-text-primary flex flex-col justify-between font-sans selection:bg-transparent overflow-hidden w-screen h-screen',
        }, 
        // Immersive Canvas Artwork Backdrop Blur
        currentTrack.coverImage &&
            React.createElement(motion.div, {
                key: currentTrack.id,
                initial: { opacity: 0 },
                animate: { opacity: 0.38 },
                exit: { opacity: 0 },
                transition: { duration: 1.2 },
                className: 'absolute inset-0 bg-cover bg-center scale-110 blur-[110px] saturate-[1.6] pointer-events-none z-0 bg-breathing-active',
                style: { backgroundImage: `url(${currentTrack.coverImage})` }
            }), React.createElement('div', {
            className: 'absolute inset-0 z-0 bg-gradient-to-t from-glorify-bg-primary via-transparent to-glorify-bg-primary/20 pointer-events-none'
        }), React.createElement('div', {
            className: 'absolute inset-0 z-0 opacity-[0.02] bg-[url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")] pointer-events-none'
        }), React.createElement('div', {
            className: 'absolute inset-0 z-0 pointer-events-none shadow-[inset_0_0_120px_rgba(0,0,0,0.85)]'
        }), 
        // Header Section (Borders removed)
        React.createElement('header', {
            className: 'w-full h-20 px-8 flex items-center justify-between z-20 relative bg-glorify-bg-primary/10 backdrop-blur-md',
        }, React.createElement('span', { className: 'text-xs font-bold tracking-widest uppercase text-glorify-accent/80' }, 'Glorify Premium'), 
        // Navigation Tabs
        React.createElement('div', { className: 'flex items-center gap-ch-3 text-xs font-medium bg-glorify-bg-secondary/60 border border-glorify-border-primary/10 p-1 rounded-full' }, [
            { id: 'playback', label: 'Now Playing', icon: Disc },
            { id: 'lyrics', label: 'Lyrics', icon: FileText },
            { id: 'queue', label: 'Queue', icon: ListMusic },
            { id: 'settings', label: 'Settings', icon: SettingsIcon },
        ].map((tab) => React.createElement('button', {
            key: tab.id,
            onClick: () => setActivePlayerTab(tab.id),
            className: `flex items-center gap-ch-1.5 px-ch-4 py-1.5 rounded-full transition-all cursor-pointer outline-none ${activePlayerTab === tab.id
                ? 'bg-glorify-bg-surface text-glorify-text-primary font-semibold shadow-sm'
                : 'text-glorify-text-muted hover:text-glorify-copper'}`,
        }, React.createElement(tab.icon, { className: 'w-ch-3.5 h-ch-3.5' }), React.createElement('span', null, tab.label)))), 
        // Close button
        React.createElement(motion.button, {
            onClick: () => setFullscreen(false),
            whileHover: { scale: 1.1 },
            whileTap: { scale: 0.9 },
            className: 'p-2 rounded-full hover:bg-white/10 cursor-pointer outline-none focus-ring text-glorify-text-secondary hover:text-glorify-copper transition-colors',
            'aria-label': 'Close player overlay',
        }, React.createElement(X, { className: 'w-ch-5 h-ch-5' }))), 
        // Centered Content Workspace
        React.createElement('div', { className: 'flex-1 overflow-hidden z-10 relative flex items-center justify-center p-8 w-full max-w-[1100px] mx-auto' }, 
        // PLAYBACK VIEW (Fully Centered Single Column Layout)
        activePlayerTab === 'playback' &&
            React.createElement('div', { className: 'flex flex-col items-center justify-center gap-8 w-full max-w-[500px] mx-auto text-center font-sans' }, 
            // Floating mirrored artwork container
            React.createElement('div', { className: 'relative mb-6 group' }, React.createElement(motion.div, {
                layoutId: 'player-artwork-container',
                className: 'w-[280px] h-[280px] sm:w-[350px] sm:h-[350px] md:w-[450px] md:h-[450px] rounded-[24px] overflow-hidden bg-glorify-bg-secondary shadow-[0_24px_60px_rgba(0,0,0,0.35)] dark:shadow-[0_24px_60px_var(--glorify-color-accent-glow)] flex items-center justify-center relative'
            }, React.createElement(AnimatePresence, { mode: 'popLayout' }, currentTrack.coverImage
                ? React.createElement(motion.img, {
                    key: currentTrack.id,
                    layoutId: 'player-artwork',
                    initial: { opacity: 0 },
                    animate: { opacity: 1 },
                    exit: { opacity: 0 },
                    transition: { duration: 0.24 },
                    src: currentTrack.coverImage,
                    alt: currentTrack.title,
                    className: `w-full h-full object-cover absolute inset-0 ${isPlaying ? 'album-pulse-playing' : ''}`,
                    style: {
                        transform: isPlaying ? 'rotate(0.5deg)' : 'none',
                    }
                })
                : React.createElement(Disc, { key: 'fallback-disc', className: 'w-20 h-20 text-glorify-text-muted animate-spin-slow' }))), currentTrack.coverImage &&
                React.createElement('img', {
                    src: currentTrack.coverImage,
                    alt: '',
                    className: 'w-[280px] sm:w-[350px] md:w-[450px] h-[50px] md:h-[70px] rounded-b-[24px] object-cover scale-y-[-1] opacity-15 blur-md pointer-events-none absolute -bottom-[50px] md:-bottom-[70px] left-0 right-0 z-[-1]'
                })), 
            // Title and artist
            React.createElement('div', { className: 'flex flex-col gap-1.5 mt-2 h-16 justify-center overflow-hidden relative w-full' }, React.createElement(AnimatePresence, { mode: 'wait' }, React.createElement(motion.div, {
                key: currentTrack.id,
                initial: { opacity: 0, y: 6 },
                animate: { opacity: 1, y: 0 },
                exit: { opacity: 0, y: -6 },
                transition: { duration: 0.2, ease: 'easeOut' },
                className: 'flex flex-col gap-1'
            }, React.createElement('h2', { className: 'text-2xl md:text-3xl font-extrabold tracking-tight text-glorify-text-primary truncate px-2' }, currentTrack.title), React.createElement('p', { className: 'text-base text-glorify-text-muted font-medium truncate px-2' }, currentTrack.artist)))), React.createElement(AudioVisualizer, {
                isPlaying: isPlaying,
                color: accentColor
            }), 
            // Progress Scrubber Bar & Timestamps
            React.createElement('div', { className: 'w-full flex flex-col mt-4 relative' }, React.createElement('div', { className: 'w-full flex items-center justify-between text-xs font-bold px-1 mb-2 text-glorify-text-secondary' }, React.createElement('span', null, formatDuration(displayTime)), isScrubbing && React.createElement('span', { className: 'text-[9px] font-bold text-glorify-accent bg-glorify-accent-glow px-2 py-0.5 rounded-full shadow-sm animate-pulse' }, 'Dragging'), React.createElement('span', null, `-${formatDuration(remainingTime)}`)), React.createElement('div', { className: 'relative w-full h-4 flex items-center group' }, 
            // Track Background
            React.createElement('div', { className: 'absolute left-0 right-0 h-1 rounded-full bg-white/10 dark:bg-white/5 pointer-events-none' }), 
            // Buffered Track
            React.createElement('div', {
                style: { width: `${bufferedPercent}%` },
                className: 'absolute left-0 h-1 rounded-full bg-white/20 dark:bg-white/10 pointer-events-none'
            }), 
            // Active Track
            React.createElement('div', {
                style: { width: `${progressPercent}%` },
                className: 'absolute left-0 h-1 rounded-full bg-glorify-accent pointer-events-none transition-all duration-[60ms]'
            }), 
            // Seeker Slider Input (Draggable Seeker)
            React.createElement('input', {
                type: 'range',
                min: 0,
                max: duration || 100,
                value: displayTime,
                onChange: handleScrubChange,
                onInput: handleScrubChange,
                onMouseUp: handleScrubEnd,
                onTouchEnd: handleScrubEnd,
                className: 'absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10',
                'aria-label': 'Playback progress scrubber',
            }), 
            // Custom Thumb (Visible on Hover)
            React.createElement('div', {
                style: { left: `calc(${progressPercent}% - 6px)` },
                className: 'absolute w-3 h-3 rounded-full bg-glorify-accent border border-glorify-bg-surface shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none'
            }))), 
            // Circular Control buttons
            React.createElement('div', { className: 'flex items-center justify-center gap-6 md:gap-8 my-2' }, 
            // Shuffle
            React.createElement(motion.button, {
                whileHover: { scale: 1.15 },
                whileTap: { scale: 0.9 },
                onClick: toggleShuffle,
                className: `p-2 rounded-full cursor-pointer transition-all ${isShuffle ? 'text-glorify-accent' : 'text-glorify-text-muted hover:text-glorify-copper'}`,
                title: 'Shuffle'
            }, React.createElement(Shuffle, { className: 'w-5 h-5' })), 
            // Prev
            React.createElement(motion.button, {
                whileHover: { scale: 1.15 },
                whileTap: { scale: 0.85 },
                onClick: skipPrevious,
                className: 'p-2 rounded-full text-glorify-text-secondary hover:text-glorify-copper transition-all cursor-pointer',
                title: 'Previous'
            }, React.createElement(SkipBack, { className: 'w-6 h-6' })), 
            // Play/Pause Circle (Large Circular Play Button)
            React.createElement(motion.button, {
                whileHover: { scale: 1.08 },
                whileTap: { scale: 0.92 },
                onClick: togglePlay,
                className: 'w-16 h-16 rounded-full bg-glorify-text-primary text-glorify-bg-primary flex items-center justify-center shadow-lg hover:shadow-[0_0_25px_rgba(212,175,55,0.5)] transition-all cursor-pointer z-10',
                title: isPlaying ? 'Pause' : 'Play'
            }, isPlaying
                ? React.createElement(Pause, { className: 'w-6 h-6 fill-currentColor' })
                : React.createElement(Play, { className: 'w-6 h-6 fill-currentColor pl-1' })), 
            // Next
            React.createElement(motion.button, {
                whileHover: { scale: 1.15 },
                whileTap: { scale: 0.85 },
                onClick: skipNext,
                className: 'p-2 rounded-full text-glorify-text-secondary hover:text-glorify-copper transition-all cursor-pointer',
                title: 'Next'
            }, React.createElement(SkipForward, { className: 'w-6 h-6' })), 
            // Repeat
            React.createElement(motion.button, {
                whileHover: { scale: 1.15 },
                whileTap: { scale: 0.9 },
                onClick: cycleRepeatMode,
                className: `p-2 rounded-full cursor-pointer relative transition-all ${repeatMode !== 'none' ? 'text-glorify-accent' : 'text-glorify-text-muted hover:text-glorify-copper'}`,
                title: 'Repeat'
            }, React.createElement(Repeat, { className: 'w-5 h-5' }), repeatMode !== 'none' && React.createElement('span', { className: 'absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-glorify-accent' }))), 
            // Volume & Actions Row
            React.createElement('div', { className: 'w-full flex items-center justify-between mt-4 gap-6' }, 
            // Favorite
            React.createElement(motion.button, {
                whileHover: { scale: 1.15 },
                whileTap: { scale: 0.9 },
                onClick: () => toggleFavoriteTrack(currentTrack.id),
                className: `p-2 rounded-full cursor-pointer transition-all ${isLiked ? 'text-glorify-accent' : 'text-glorify-text-secondary hover:text-glorify-copper'}`,
                title: isLiked ? 'Remove from favorites' : 'Add to favorites'
            }, React.createElement(Heart, { className: 'w-5 h-5', fill: isLiked ? 'currentColor' : 'none' })), 
            // More options
            React.createElement(motion.button, {
                whileHover: { scale: 1.15 },
                whileTap: { scale: 0.9 },
                onClick: (e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    setContextMenu({ x: e.clientX, y: e.clientY, triggerRect: rect });
                },
                className: 'p-2 rounded-full text-glorify-text-secondary hover:text-glorify-copper cursor-pointer transition-all',
                title: 'More options'
            }, React.createElement(MoreHorizontal, { className: 'w-5 h-5' })), 
            // Volume slider
            React.createElement('div', { className: 'flex-1 max-w-[220px] flex items-center gap-3 bg-glorify-bg-secondary/40 border border-glorify-border-primary/5 px-4 py-2 rounded-full shadow-sm hover:shadow-md transition-all hover:scale-[1.02]' }, React.createElement(motion.button, {
                onClick: toggleMute,
                whileTap: { scale: 0.95 },
                className: 'p-1 rounded-full text-glorify-text-secondary hover:text-glorify-copper cursor-pointer outline-none transition-colors'
            }, isMuted
                ? React.createElement(VolumeX, { className: 'w-4 h-4 text-glorify-error' })
                : React.createElement(Volume2, { className: 'w-4 h-4' })), React.createElement('input', {
                type: 'range',
                min: 0,
                max: 1,
                step: 0.02,
                value: isMuted ? 0 : volume,
                onChange: handleVolumeChange,
                style: {
                    background: `linear-gradient(to right, var(--color-glorify-accent) 0%, var(--color-glorify-accent) ${volumePercent}%, var(--glorify-slider-bg) ${volumePercent}%, var(--glorify-slider-bg) 100%)`
                },
                className: 'premium-slider w-full bg-white/10 rounded-full appearance-none outline-none transition-all glow-progress',
                'aria-label': 'Volume controller'
            })), 
            // Share
            React.createElement(motion.button, {
                whileHover: { scale: 1.15 },
                whileTap: { scale: 0.9 },
                onClick: () => {
                    const shareText = `Check out "${currentTrack.title}" by ${currentTrack.artist} on Glorify! http://localhost:5173/album/${currentTrack.id}`;
                    if (navigator.clipboard) {
                        navigator.clipboard.writeText(shareText);
                    }
                    useToastStore.getState().addToast('Share link copied to clipboard!', 'info');
                },
                className: 'p-2 rounded-full text-glorify-text-secondary hover:text-glorify-copper cursor-pointer transition-all',
                title: 'Share'
            }, React.createElement(Share2, { className: 'w-5 h-5' })))), 
        // LYRICS VIEW
        activePlayerTab === 'lyrics' &&
            React.createElement('div', { className: 'relative max-w-3xl w-full h-[65vh] flex flex-col items-center z-10' }, 
            // Floating Edit Lyrics Button (Local tracks only)
            currentTrack.source === 'local' &&
                React.createElement('button', {
                    onClick: () => setShowLyricsEditModal(true),
                    className: 'absolute top-0 right-4 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full text-xs font-bold transition-all flex items-center gap-1.5 shadow-md cursor-pointer border border-white/10 z-20'
                }, React.createElement(Pencil, { className: 'w-3.5 h-3.5' }), 'Edit Lyrics'), 
            // Lyrics content container
            !parsedLyrics
                ? React.createElement('div', { className: 'flex flex-col items-center justify-center h-full text-center gap-4 py-20' }, React.createElement(AlignLeft, { className: 'w-12 h-12 text-glorify-text-muted/40' }), React.createElement('span', { className: 'text-base font-semibold text-glorify-text-secondary' }, 'No lyrics available'), currentTrack.source === 'local' &&
                    React.createElement('button', {
                        onClick: () => setShowLyricsEditModal(true),
                        className: 'px-5 py-2 bg-glorify-accent text-glorify-carbon-950 rounded-full text-xs font-bold hover:scale-105 active:scale-95 transition-all shadow-md cursor-pointer'
                    }, 'Add Lyrics'))
                : parsedLyrics.type === 'plain'
                    ? React.createElement('div', { className: 'w-full h-full overflow-y-auto px-6 text-center text-xl md:text-2xl font-bold leading-loose text-glorify-text-primary/90 whitespace-pre-wrap py-24 scrollbar-none' }, parsedLyrics.text)
                    : React.createElement('div', {
                        onWheel: () => setIsAutoScrollSuspended(true),
                        onTouchMove: () => setIsAutoScrollSuspended(true),
                        className: 'w-full h-full overflow-y-auto px-4 flex flex-col gap-7 py-44 scrollbar-none scroll-smooth text-center md:text-left relative'
                    }, parsedLyrics.lines?.map((line, idx) => {
                        const isActive = idx === activeLineIndex;
                        return React.createElement(motion.div, {
                            key: line.time + '-' + idx,
                            ref: isActive ? activeLyricRef : null,
                            onClick: () => seek(line.time / 1000),
                            className: `transition-all duration-300 cursor-pointer py-2 select-none ${isActive
                                ? 'text-white text-[30px] sm:text-[38px] md:text-[46px] font-extrabold leading-tight drop-shadow-md opacity-100 scale-102 text-glorify-accent'
                                : 'text-glorify-text-muted text-lg sm:text-xl md:text-2xl font-bold opacity-30 hover:opacity-65'}`
                        }, line.text || '• • •');
                    }), 
                    // Resume Auto-scroll control overlay
                    isAutoScrollSuspended &&
                        React.createElement('button', {
                            onClick: () => {
                                setIsAutoScrollSuspended(false);
                                if (activeLyricRef.current) {
                                    activeLyricRef.current.scrollIntoView({
                                        behavior: 'smooth',
                                        block: 'center'
                                    });
                                }
                            },
                            className: 'fixed bottom-28 left-1/2 -translate-x-1/2 px-5 py-2.5 bg-glorify-accent text-glorify-carbon-950 font-bold rounded-full text-xs hover:scale-105 active:scale-95 transition-all shadow-xl cursor-pointer z-30 flex items-center gap-1.5'
                        }, React.createElement(AlignLeft, { className: 'w-3.5 h-3.5' }), 'Jump to current line'))), 
        // QUEUE VIEW (Slides in from the right, no border)
        React.createElement(AnimatePresence, null, activePlayerTab === 'queue' &&
            React.createElement(motion.div, {
                initial: { x: '100%', opacity: 0 },
                animate: { x: 0, opacity: 1 },
                exit: { x: '100%', opacity: 0 },
                transition: { type: 'spring', damping: 26, stiffness: 220 },
                className: 'absolute top-0 bottom-0 right-0 w-full md:w-[420px] h-full bg-glorify-bg-surface/85 backdrop-blur-xl p-ch-6 flex flex-col gap-ch-4 shadow-2xl z-20 rounded-l-[24px]'
            }, React.createElement('div', { className: 'flex items-center justify-between pb-ch-3 border-b border-glorify-border-primary/5' }, React.createElement('span', { className: 'text-sm font-semibold text-glorify-text-primary' }, 'Queue'), queue.length > 1 &&
                React.createElement('button', {
                    onClick: clearQueue,
                    className: 'flex items-center gap-ch-1 text-xs text-glorify-error hover:underline cursor-pointer outline-none border-none bg-transparent',
                }, React.createElement(Trash2, { className: 'w-ch-3.5 h-ch-3.5' }), 'Clear')), React.createElement('div', { className: 'flex-1 overflow-y-auto flex flex-col gap-ch-1.5 scrollbar-none justify-center' }, queue.length === 0
                ? React.createElement(NoQueue)
                : queue.map((track, idx) => {
                    const isPlayingTrack = track.id === currentTrack.id;
                    return React.createElement('div', {
                        key: track.id + '-' + idx,
                        draggable: true,
                        onDragStart: (e) => handleDragStart(e, idx),
                        onDragOver: handleDragOver,
                        onDrop: (e) => handleDrop(e, idx),
                        className: `flex items-center gap-ch-3 p-ch-3 rounded-[12px] text-left text-sm transition-colors group cursor-grab active:cursor-grabbing border border-transparent ${isPlayingTrack
                            ? 'bg-glorify-accent/10 text-glorify-accent font-semibold'
                            : 'bg-transparent text-glorify-text-secondary hover:text-glorify-copper hover:bg-white/5'}`,
                    }, React.createElement('span', { className: 'w-ch-4 text-xs font-mono text-glorify-text-muted/50' }, String(idx + 1).padStart(2, '0')), track.coverImage && React.createElement('img', { src: track.coverImage, alt: '', className: 'w-8 h-8 rounded object-cover' }), React.createElement('div', { className: 'flex-1 min-w-0' }, React.createElement('div', { className: 'text-xs font-medium truncate' }, track.title), React.createElement('div', { className: 'text-[10px] text-glorify-text-muted truncate mt-0.5' }, track.artist)), isPlayingTrack
                        ? React.createElement('span', { className: 'w-1.5 h-1.5 rounded-full bg-glorify-accent animate-pulse flex-shrink-0' })
                        : React.createElement('button', {
                            onClick: (e) => {
                                e.stopPropagation();
                                removeFromQueue(track.id);
                            },
                            className: 'opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-white/10 text-glorify-error cursor-pointer outline-none border-none bg-transparent',
                        }, React.createElement(X, { className: 'w-ch-3.5 h-ch-3.5' })));
                })))), 
        // SETTINGS VIEW (Slides in from the right, no border)
        React.createElement(AnimatePresence, null, activePlayerTab === 'settings' &&
            React.createElement(motion.div, {
                initial: { x: '100%', opacity: 0 },
                animate: { x: 0, opacity: 1 },
                exit: { x: '100%', opacity: 0 },
                transition: { type: 'spring', damping: 26, stiffness: 220 },
                className: 'absolute top-0 bottom-0 right-0 w-full md:w-[420px] h-full bg-glorify-bg-surface/85 backdrop-blur-xl p-ch-6 flex flex-col gap-ch-6 shadow-2xl z-20 overflow-y-auto scrollbar-none rounded-l-[24px]'
            }, React.createElement('div', { className: 'flex items-center gap-ch-2 pb-ch-3 text-glorify-accent border-b border-glorify-border-primary/5' }, React.createElement(Sliders, { className: 'w-ch-4.5 h-ch-4.5' }), React.createElement('span', { className: 'text-sm font-semibold' }, 'Premium Audio Tuning')), 
            // Crossfade
            React.createElement('div', { className: 'flex flex-col gap-ch-2' }, React.createElement('div', { className: 'flex items-center justify-between text-xs text-glorify-text-secondary font-medium' }, React.createElement('span', null, 'Crossfade Duration'), React.createElement('span', { className: 'text-glorify-text-primary' }, `${crossfadeDuration}s`)), React.createElement('input', {
                type: 'range',
                min: 0,
                max: 12,
                step: 1,
                value: crossfadeDuration,
                onChange: (e) => setCrossfadeDuration(parseInt(e.target.value, 10)),
                style: {
                    background: `linear-gradient(to right, var(--color-glorify-accent) 0%, var(--color-glorify-accent) ${(crossfadeDuration / 12) * 100}%, var(--glorify-slider-bg) ${(crossfadeDuration / 12) * 100}%, var(--glorify-slider-bg) 100%)`
                },
                className: 'premium-slider w-full bg-white/10 rounded-full appearance-none outline-none transition-all glow-progress',
            })), 
            // Sleep Timer
            React.createElement('div', { className: 'flex flex-col gap-ch-2' }, React.createElement('div', { className: 'flex items-center justify-between text-xs text-glorify-text-secondary font-medium' }, React.createElement('span', { className: 'flex items-center gap-1.5' }, React.createElement(Moon, { className: 'w-ch-4 h-ch-4 text-glorify-text-muted' }), 'Sleep Timer'), React.createElement('span', { className: 'text-glorify-accent' }, sleepTimerMinutes ? `${sleepTimerMinutes}m` : 'Off')), React.createElement('div', { className: 'grid grid-cols-4 gap-ch-2' }, [null, 5, 15, 30].map((min) => React.createElement('button', {
                key: String(min),
                onClick: () => setSleepTimer(min),
                className: `py-2 rounded-full border border-glorify-border-primary/10 text-xs font-semibold cursor-pointer outline-none transition-all ${sleepTimerMinutes === min
                    ? 'bg-glorify-accent border-glorify-accent text-glorify-carbon-950 shadow-sm'
                    : 'bg-white/5 border-white/10 text-glorify-text-secondary hover:border-glorify-copper'}`,
            }, min === null ? 'Off' : `${min}m`)))), 
            // Audio Quality
            React.createElement('div', { className: 'flex flex-col gap-ch-2' }, React.createElement('div', { className: 'text-xs text-glorify-text-secondary font-medium' }, 'Audio Streaming Quality'), React.createElement('div', { className: 'grid grid-cols-3 gap-ch-2' }, ['standard', 'high', 'lossless'].map((qual) => React.createElement('button', {
                key: qual,
                onClick: () => setAudioQuality(qual),
                className: `py-2 rounded-full border border-glorify-border-primary/10 text-xs font-semibold cursor-pointer outline-none transition-all ${audioQuality === qual
                    ? 'bg-white border-white text-black shadow-sm'
                    : 'bg-transparent border-white/10 text-glorify-text-secondary hover:text-glorify-copper'}`,
            }, qual.charAt(0).toUpperCase() + qual.slice(1))))), 
            // Device Selector
            React.createElement('div', { className: 'flex flex-col gap-ch-1.5' }, React.createElement('label', { className: 'text-xs text-glorify-text-secondary font-medium' }, 'Output Source Device'), React.createElement('select', {
                value: outputDevice,
                onChange: (e) => setOutputDevice(e.target.value),
                className: 'px-ch-4 py-2.5 bg-white/5 border border-white/10 rounded-full text-xs text-glorify-text-primary outline-none focus:border-glorify-accent cursor-pointer',
            }, ['Default Speakers', 'USB Audio Interface', 'Bluetooth Headphones'].map((dev) => React.createElement('option', { key: dev, value: dev }, dev)))), 
            // Toggles
            React.createElement('div', { className: 'flex flex-col gap-ch-4 pt-ch-4 border-t border-glorify-border-primary/5' }, [
                { label: 'Gapless Playback Streams', val: isGapless, toggle: () => setGapless(!isGapless) },
                { label: 'Audio Normalization', val: isNormalized, toggle: () => setNormalized(!isNormalized) },
            ].map((sw) => React.createElement('div', { key: sw.label, className: 'flex items-center justify-between' }, React.createElement('span', { className: 'text-xs text-glorify-text-secondary font-medium' }, sw.label), React.createElement('input', {
                type: 'checkbox',
                checked: sw.val,
                onChange: sw.toggle,
                className: 'w-ch-4.5 h-ch-4.5 accent-glorify-accent cursor-pointer',
            })))))), showLyricsEditModal &&
            React.createElement(LyricsEditorModal, {
                trackId: currentTrack.id,
                onClose: () => setShowLyricsEditModal(false),
            }), contextMenu &&
            React.createElement(TrackContextMenu, {
                track: currentTrack,
                x: contextMenu.x,
                y: contextMenu.y,
                triggerRect: contextMenu.triggerRect,
                onClose: () => setContextMenu(null),
            }))));
}
//# sourceMappingURL=FullscreenPlayer.js.map