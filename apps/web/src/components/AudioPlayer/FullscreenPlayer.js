import React, { useState } from 'react';
import { usePlayerStore } from '../../store/playerStore.js';
import { formatDuration } from '@chotify/utils';
import { X, Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Shuffle, Repeat, Share2, Smartphone, ListMusic, FileText, Disc, Settings as SettingsIcon, Sliders, Moon, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
export function FullscreenPlayer() {
    const { currentTrack, isPlaying, currentTime, duration, volume, isMuted, repeatMode, isShuffle, queue, isPlayerExpanded, crossfadeDuration, isGapless, isNormalized, sleepTimerMinutes, sleepTimerRemaining, audioQuality, outputDevice, togglePlay, seek, setVolume, toggleMute, setRepeatMode, toggleShuffle, skipNext, skipPrevious, setPlayerExpanded, playTrack, reorderQueue, removeFromQueue, clearQueue, setCrossfadeDuration, setGapless, setNormalized, setSleepTimer, setAudioQuality, setOutputDevice, } = usePlayerStore();
    const [activeTab, setActiveTab] = useState('playback');
    if (!isPlayerExpanded || !currentTrack)
        return null;
    const handleScrubChange = (e) => {
        seek(parseFloat(e.target.value));
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
    // HTML5 Native Drag & Drop operations
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
    const mockLyrics = [
        { time: 0, text: '[ Instrument Introduction ]' },
        { time: 10, text: 'Dusty keys on a record track' },
        { time: 24, text: 'Composer lines that pull us back' },
        { time: 38, text: 'Aura gold that lights the room' },
        { time: 52, text: 'Warm acoustic patterns in the gloom' },
        { time: 70, text: '[ Synth Solo Bridge ]' },
        { time: 92, text: 'Sand canvases and carbon keys' },
        { time: 108, text: 'Floating soundwaves in the breeze' },
    ];
    const formatSleepTime = (sec) => {
        const m = Math.floor(sec / 60);
        const s = sec % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };
    return React.createElement(AnimatePresence, null, React.createElement(motion.div, {
        initial: { y: '100%' },
        animate: { y: 0 },
        exit: { y: '100%' },
        transition: { type: 'spring', damping: 25, stiffness: 220 },
        className: 'fixed inset-0 z-40 bg-chotify-bg-primary text-chotify-text-primary flex flex-col justify-between font-sans selection:bg-transparent overflow-hidden',
    }, 
    // Blurred ambient backdrop responding to artwork color rules
    React.createElement('div', { className: 'absolute inset-0 z-0 pointer-events-none' }, currentTrack.coverImage
        ? React.createElement('div', {
            style: { backgroundImage: `url(${currentTrack.coverImage})` },
            className: 'absolute inset-0 bg-cover bg-center blur-3xl opacity-20 scale-110',
        })
        : React.createElement('div', {
            className: 'absolute inset-0 bg-chotify-aura-gold/5 blur-3xl scale-110',
        })), 
    // Header row
    React.createElement('header', {
        className: 'w-full h-16 border-b border-chotify-border-primary/45 px-ch-6 flex items-center justify-between z-10 relative bg-chotify-bg-surface/10 backdrop-blur-xs',
    }, React.createElement('span', { className: 'text-xs font-mono tracking-widest text-chotify-text-muted flex items-center gap-ch-2' }, 'NOW PLAYING', sleepTimerRemaining !== null &&
        React.createElement('span', { className: 'text-chotify-aura-gold bg-chotify-bg-secondary px-1.5 py-0.5 rounded-sm font-mono text-[9px] border border-chotify-aura-gold/20' }, `SLEEP: ${formatSleepTime(sleepTimerRemaining)}`)), 
    // Toggle view tabs
    React.createElement('div', { className: 'flex items-center gap-ch-4 text-xs font-mono' }, [
        { id: 'playback', label: 'PLAYBACK', icon: Disc },
        { id: 'lyrics', label: 'LYRICS', icon: FileText },
        { id: 'queue', label: 'QUEUE', icon: ListMusic },
        { id: 'settings', label: 'SETTINGS', icon: SettingsIcon },
    ].map((tab) => React.createElement('button', {
        key: tab.id,
        onClick: () => setActiveTab(tab.id),
        className: `flex items-center gap-ch-2 px-ch-3 py-1.5 rounded-ch-sm transition-colors cursor-pointer outline-none ${activeTab === tab.id
            ? 'bg-chotify-bg-secondary text-chotify-text-primary font-bold'
            : 'text-chotify-text-muted hover:text-chotify-text-secondary'}`,
    }, React.createElement(tab.icon, { className: 'w-ch-3.5 h-ch-3.5' }), React.createElement('span', null, tab.label)))), 
    // Close overlay button
    React.createElement('button', {
        onClick: () => setPlayerExpanded(false),
        className: 'p-ch-2 rounded-full hover:bg-chotify-bg-secondary cursor-pointer outline-none focus-ring text-chotify-text-secondary hover:text-chotify-text-primary',
        'aria-label': 'Close player overlay',
    }, React.createElement(X, { className: 'w-ch-5 h-ch-5' }))), 
    // Scrollable view workspace container
    React.createElement('div', { className: 'flex-1 overflow-y-auto z-10 relative flex items-center justify-center p-ch-6' }, activeTab === 'playback' &&
        React.createElement('div', { className: 'flex flex-col items-center gap-ch-6 max-w-sm w-full text-center' }, React.createElement(motion.div, {
            animate: { scale: isPlaying ? 1.02 : 0.98 },
            transition: { repeat: Infinity, repeatType: 'reverse', duration: 3, ease: 'easeInOut' },
            className: 'w-64 h-64 sm:w-80 sm:h-80 rounded-ch-lg overflow-hidden border border-chotify-border-primary bg-chotify-bg-secondary shadow-ch-glow flex items-center justify-center font-mono',
        }, currentTrack.coverImage
            ? React.createElement('img', {
                src: currentTrack.coverImage,
                alt: currentTrack.title,
                className: 'w-full h-full object-cover',
            })
            : React.createElement('div', { className: 'text-center flex flex-col items-center gap-ch-3 text-chotify-text-muted' }, React.createElement(Disc, { className: 'w-ch-12 h-ch-12 animate-spin-slow' }), React.createElement('span', { className: 'text-xs' }, '[ COMPOSE_STEM_LIVE ]'))), React.createElement('div', { className: 'flex flex-col gap-0.5 mt-ch-2' }, React.createElement('h2', { className: 'text-xl font-bold tracking-tight text-chotify-text-primary' }, currentTrack.title), React.createElement('p', { className: 'text-xs font-mono uppercase tracking-widest text-chotify-text-muted' }, currentTrack.artist))), activeTab === 'lyrics' &&
        React.createElement('div', { className: 'max-w-md w-full h-96 overflow-y-auto px-ch-4 flex flex-col gap-ch-6 py-ch-8 scroll-smooth' }, mockLyrics.map((line, idx) => {
            const isActive = currentTime >= line.time &&
                (idx === mockLyrics.length - 1 || currentTime < mockLyrics[idx + 1].time);
            return React.createElement('div', {
                key: line.time,
                className: `text-sm font-semibold transition-all duration-300 leading-relaxed cursor-default ${isActive
                    ? 'text-chotify-aura-gold scale-102 text-base'
                    : 'text-chotify-text-muted opacity-45 hover:opacity-75'}`,
            }, line.text);
        })), activeTab === 'queue' &&
        React.createElement('div', { className: 'max-w-md w-full h-96 overflow-y-auto flex flex-col gap-ch-1 p-ch-2 bg-chotify-bg-surface/40 backdrop-blur-xs border border-chotify-border-primary rounded-ch-lg' }, React.createElement('div', { className: 'px-ch-4 py-ch-2 text-[10px] font-mono text-chotify-text-muted border-b border-chotify-border-secondary mb-ch-2 flex items-center justify-between' }, React.createElement('span', null, 'PLAYBACK QUEUE (DRAG TO REORDER)'), queue.length > 1 &&
            React.createElement('button', {
                onClick: clearQueue,
                className: 'flex items-center gap-ch-1 text-[9px] text-chotify-error hover:underline cursor-pointer outline-none',
            }, React.createElement(Trash2, { className: 'w-ch-2.5 h-ch-2.5' }), 'CLEAR_ALL')), queue.map((track, idx) => {
            const isPlayingTrack = track.id === currentTrack.id;
            return React.createElement('div', {
                key: track.id + '-' + idx,
                draggable: true,
                onDragStart: (e) => handleDragStart(e, idx),
                onDragOver: handleDragOver,
                onDrop: (e) => handleDrop(e, idx),
                className: `w-full flex items-center gap-ch-3 px-ch-4 py-ch-2.5 rounded-ch-md text-left text-sm transition-colors group cursor-grab active:cursor-grabbing border border-transparent hover:border-chotify-border-secondary/20 ${isPlayingTrack
                    ? 'bg-chotify-bg-secondary text-chotify-aura-gold font-bold'
                    : 'bg-transparent text-chotify-text-secondary hover:text-chotify-text-primary hover:bg-chotify-bg-secondary/40'}`,
            }, React.createElement('span', { className: 'w-ch-4 text-xs font-mono text-chotify-text-muted' }, String(idx + 1).padStart(2, '0')), React.createElement('div', { className: 'flex-1 min-w-0' }, React.createElement('div', { className: 'text-xs truncate' }, track.title), React.createElement('div', { className: 'text-[9px] font-mono text-chotify-text-muted uppercase' }, track.artist)), React.createElement('div', { className: 'flex items-center gap-ch-2' }, isPlayingTrack
                ? React.createElement('span', { className: 'w-2 h-2 rounded-full bg-chotify-aura-gold animate-pulse' })
                : React.createElement('button', {
                    onClick: (e) => {
                        e.stopPropagation();
                        removeFromQueue(track.id);
                    },
                    className: 'opacity-0 group-hover:opacity-100 p-ch-1 rounded-ch-sm hover:bg-chotify-bg-secondary text-chotify-error cursor-pointer outline-none',
                    title: 'Remove from queue',
                }, React.createElement(X, { className: 'w-ch-3.5 h-ch-3.5' }))));
        })), activeTab === 'settings' &&
        React.createElement('div', { className: 'max-w-md w-full h-96 overflow-y-auto p-ch-6 bg-chotify-bg-surface/40 backdrop-blur-xs border border-chotify-border-primary rounded-ch-lg flex flex-col gap-ch-6' }, React.createElement('div', { className: 'border-b border-chotify-border-secondary pb-ch-3 flex items-center gap-ch-2 text-chotify-aura-gold' }, React.createElement(Sliders, { className: 'w-ch-4 h-ch-4' }), React.createElement('span', { className: 'text-xs font-mono font-bold tracking-widest' }, '[ ENGINE_TUNINGS_CONFIG ]')), 
        // Crossfade Duration Slider
        React.createElement('div', { className: 'flex flex-col gap-ch-2' }, React.createElement('div', { className: 'flex items-center justify-between text-xs font-mono text-chotify-text-secondary' }, React.createElement('span', null, 'Crossfade Duration'), React.createElement('span', { className: 'text-chotify-text-primary' }, `${crossfadeDuration}s`)), React.createElement('input', {
            type: 'range',
            min: 0,
            max: 12,
            step: 1,
            value: crossfadeDuration,
            onChange: (e) => setCrossfadeDuration(parseInt(e.target.value, 10)),
            className: 'w-full h-1 bg-chotify-border-primary rounded-full appearance-none cursor-pointer accent-chotify-aura-gold outline-none',
        })), 
        // Sleep Timer Control
        React.createElement('div', { className: 'flex flex-col gap-ch-2' }, React.createElement('div', { className: 'flex items-center justify-between text-xs font-mono text-chotify-text-secondary' }, React.createElement('span', { className: 'flex items-center gap-ch-1.5' }, React.createElement(Moon, { className: 'w-ch-3.5 h-ch-3.5 text-chotify-text-muted' }), 'Sleep Timer'), React.createElement('span', { className: 'text-chotify-aura-gold' }, sleepTimerMinutes ? `${sleepTimerMinutes}m` : 'Off')), React.createElement('div', { className: 'grid grid-cols-4 gap-ch-2' }, [null, 5, 15, 30].map((min) => React.createElement('button', {
            key: String(min),
            onClick: () => setSleepTimer(min),
            className: `py-1.5 rounded-ch-sm border text-[10px] font-mono cursor-pointer outline-none transition-all ${sleepTimerMinutes === min
                ? 'bg-chotify-aura-gold border-chotify-aura-gold text-chotify-carbon-950 font-bold'
                : 'bg-chotify-bg-secondary border-chotify-border-primary text-chotify-text-secondary hover:border-chotify-text-primary'}`,
        }, min === null ? 'OFF' : `${min}M`)))), 
        // Audio Quality Display
        React.createElement('div', { className: 'flex flex-col gap-ch-2' }, React.createElement('div', { className: 'text-xs font-mono text-chotify-text-secondary' }, 'Audio Output Bitrate Quality (UI)'), React.createElement('div', { className: 'grid grid-cols-3 gap-ch-2' }, ['standard', 'high', 'lossless'].map((qual) => React.createElement('button', {
            key: qual,
            onClick: () => setAudioQuality(qual),
            className: `py-1.5 rounded-ch-sm border text-[10px] font-mono uppercase cursor-pointer outline-none transition-all ${audioQuality === qual
                ? 'bg-chotify-bg-secondary border-chotify-border-primary text-chotify-aura-gold font-bold'
                : 'bg-transparent border-chotify-border-primary text-chotify-text-muted hover:text-chotify-text-secondary'}`,
        }, qual)))), 
        // Output Device list (UI only)
        React.createElement('div', { className: 'flex flex-col gap-ch-1' }, React.createElement('label', { className: 'text-xs font-mono text-chotify-text-secondary' }, 'Output Device (UI)'), React.createElement('select', {
            value: outputDevice,
            onChange: (e) => setOutputDevice(e.target.value),
            className: 'px-ch-3 py-2 bg-chotify-bg-secondary border border-chotify-border-primary rounded-ch-sm text-xs text-chotify-text-primary outline-none focus:border-chotify-aura-gold/50 cursor-pointer',
        }, ['Default Speakers', 'USB Audio Interface', 'Bluetooth Headphones'].map((dev) => React.createElement('option', { key: dev, value: dev }, dev)))), 
        // Gapless / Normalized Switches
        React.createElement('div', { className: 'flex flex-col gap-ch-3 pt-ch-2 border-t border-chotify-border-secondary' }, [
            { label: 'Gapless Playback Streams', val: isGapless, toggle: () => setGapless(!isGapless) },
            { label: 'Volume Audio Normalization', val: isNormalized, toggle: () => setNormalized(!isNormalized) },
        ].map((sw) => React.createElement('div', { key: sw.label, className: 'flex items-center justify-between' }, React.createElement('span', { className: 'text-xs font-mono text-chotify-text-secondary' }, sw.label), React.createElement('input', {
            type: 'checkbox',
            checked: sw.val,
            onChange: sw.toggle,
            className: 'w-ch-4 h-ch-4 accent-chotify-aura-gold cursor-pointer',
        })))))), 
    // Controls drawer console
    React.createElement('footer', {
        className: 'w-full border-t border-chotify-border-primary/45 p-ch-6 flex flex-col items-center gap-ch-4 z-10 bg-chotify-bg-surface/10 backdrop-blur-xs',
    }, React.createElement('div', { className: 'w-full max-w-lg flex items-center gap-ch-3 text-[10px] font-mono text-chotify-text-muted' }, React.createElement('span', null, formatDuration(currentTime)), React.createElement('input', {
        type: 'range',
        min: 0,
        max: duration || 100,
        value: currentTime,
        onChange: handleScrubChange,
        className: 'w-full h-1 bg-chotify-border-primary rounded-full appearance-none cursor-pointer accent-chotify-aura-gold outline-none',
        'aria-label': 'Playback progress scrubber expanded',
    }), React.createElement('span', null, formatDuration(duration))), React.createElement('div', { className: 'w-full max-w-lg flex items-center justify-between gap-ch-4 mt-ch-2' }, React.createElement('button', {
        className: 'p-ch-2 rounded-full text-chotify-text-secondary hover:text-chotify-text-primary cursor-pointer outline-none focus-ring',
        'aria-label': 'Select playback device',
    }, React.createElement(Smartphone, { className: 'w-ch-4.5 h-ch-4.5' })), React.createElement('div', { className: 'flex items-center gap-ch-6' }, React.createElement('button', {
        onClick: toggleShuffle,
        className: `p-ch-2 rounded-full cursor-pointer outline-none focus-ring transition-colors ${isShuffle ? 'text-chotify-aura-gold' : 'text-chotify-text-muted hover:text-chotify-text-primary'}`,
        'aria-label': 'Toggle shuffle',
    }, React.createElement(Shuffle, { className: 'w-ch-4 h-ch-4' })), React.createElement('button', {
        onClick: skipPrevious,
        className: 'p-ch-2 rounded-full text-chotify-text-secondary hover:text-chotify-text-primary cursor-pointer outline-none focus-ring active:scale-95 transition-transform',
        'aria-label': 'Previous track',
    }, React.createElement(SkipBack, { className: 'w-ch-5 h-ch-5' })), React.createElement('button', {
        onClick: togglePlay,
        className: 'w-14 h-14 rounded-full bg-chotify-text-primary text-chotify-bg-primary border border-chotify-border-primary flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer outline-none focus-ring',
        'aria-label': isPlaying ? 'Pause' : 'Play',
    }, isPlaying
        ? React.createElement(Pause, { className: 'w-ch-5 h-ch-5 fill-currentColor' })
        : React.createElement(Play, { className: 'w-ch-5 h-ch-5 fill-currentColor pl-0.5' })), React.createElement('button', {
        onClick: skipNext,
        className: 'p-ch-2 rounded-full text-chotify-text-secondary hover:text-chotify-text-primary cursor-pointer outline-none focus-ring active:scale-95 transition-transform',
        'aria-label': 'Next track',
    }, React.createElement(SkipForward, { className: 'w-ch-5 h-ch-5' })), React.createElement('button', {
        onClick: cycleRepeatMode,
        className: `p-ch-2 rounded-full cursor-pointer outline-none focus-ring transition-colors ${repeatMode !== 'none' ? 'text-chotify-aura-gold' : 'text-chotify-text-muted hover:text-chotify-text-primary'}`,
        'aria-label': `Repeat mode: ${repeatMode}`,
    }, React.createElement(Repeat, { className: 'w-ch-4 h-ch-4' }))), React.createElement('button', {
        className: 'p-ch-2 rounded-full text-chotify-text-secondary hover:text-chotify-text-primary cursor-pointer outline-none focus-ring',
        'aria-label': 'Share this track',
    }, React.createElement(Share2, { className: 'w-ch-4.5 h-ch-4.5' }))), React.createElement('div', { className: 'w-full max-w-xs flex items-center gap-ch-3 mt-ch-2 text-chotify-text-secondary' }, React.createElement('button', {
        onClick: toggleMute,
        className: 'p-ch-1 rounded-ch-sm hover:bg-chotify-bg-secondary cursor-pointer outline-none focus-ring',
        'aria-label': isMuted ? 'Unmute' : 'Mute',
    }, isMuted
        ? React.createElement(VolumeX, { className: 'w-ch-4 h-ch-4 text-chotify-error' })
        : React.createElement(Volume2, { className: 'w-ch-4 h-ch-4' })), React.createElement('input', {
        type: 'range',
        min: 0,
        max: 1,
        step: 0.05,
        value: isMuted ? 0 : volume,
        onChange: handleVolumeChange,
        className: 'w-full h-1 bg-chotify-border-primary rounded-full appearance-none cursor-pointer accent-chotify-aura-gold outline-none',
        'aria-label': 'Volume controller expanded',
    })))));
}
//# sourceMappingURL=FullscreenPlayer.js.map