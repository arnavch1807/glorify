import React, { useEffect, useState } from 'react';
import { StaticMusicRepository } from '../../repositories/musicRepository.js';
import { TrackCard } from './TrackCard.js';
import { usePlayerStore } from '../../store/playerStore.js';
import { X, Play, Disc, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LoadingScreen } from '../LoadingScreen.js';
export function DetailOverlay({ id, type, onClose, onNavigate }) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const { playTrack } = usePlayerStore();
    useEffect(() => {
        if (!id || !type) {
            setData(null);
            return;
        }
        const fetchDetails = async () => {
            setLoading(true);
            try {
                if (type === 'album') {
                    const res = await StaticMusicRepository.getAlbumDetails(id);
                    if (res) {
                        setData({
                            title: res.album.title,
                            subtitle: res.album.artistName,
                            description: `Album • ${res.album.releaseYear} • ${res.album.genre.charAt(0).toUpperCase() + res.album.genre.slice(1)}`,
                            coverUrl: res.album.coverUrl,
                            tracks: res.tracks,
                        });
                    }
                }
                else if (type === 'artist') {
                    const res = await StaticMusicRepository.getArtistDetails(id);
                    if (res) {
                        setData({
                            title: res.artist.name,
                            subtitle: res.artist.genres.join(' / ').toUpperCase(),
                            description: res.artist.bio,
                            coverUrl: res.artist.avatarUrl,
                            tracks: res.tracks,
                        });
                    }
                }
                else if (type === 'playlist') {
                    const playlists = await StaticMusicRepository.getPlaylists();
                    const playlist = playlists.find((p) => p.id === id);
                    if (playlist) {
                        const allTracks = await StaticMusicRepository.getTracks();
                        const tracks = allTracks.filter((t) => playlist.songs.includes(t.id));
                        setData({
                            title: playlist.name,
                            subtitle: 'Playlist',
                            description: playlist.description,
                            coverUrl: playlist.coverImage,
                            tracks: tracks,
                        });
                    }
                }
            }
            catch (err) {
                console.error('Failed to load item details:', err);
            }
            finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [id, type]);
    const handlePlayAll = () => {
        if (data && data.tracks.length > 0) {
            playTrack(data.tracks[0], data.tracks);
        }
    };
    return React.createElement(AnimatePresence, null, id &&
        React.createElement('div', { className: 'fixed inset-0 z-30' }, 
        // Backdrop overlay
        React.createElement(motion.div, {
            initial: { opacity: 0 },
            animate: { opacity: 0.5 },
            exit: { opacity: 0 },
            className: 'absolute inset-0 bg-[#0B0B0A]/70 backdrop-blur-xs',
            onClick: onClose,
        }), 
        // Slide overlay container
        React.createElement(motion.div, {
            initial: { x: '100%' },
            animate: { x: 0 },
            exit: { x: '100%' },
            transition: { type: 'spring', damping: 26, stiffness: 220 },
            className: 'absolute top-0 bottom-0 right-0 w-full max-w-2xl bg-glorify-bg-surface border-l border-glorify-border-primary flex flex-col',
        }, 
        // Header Bar
        React.createElement('div', {
            className: 'px-ch-6 py-ch-4 border-b border-glorify-border-primary flex items-center justify-between',
        }, React.createElement('button', {
            onClick: onClose,
            className: 'flex items-center gap-ch-2 text-xs font-mono text-glorify-text-secondary hover:text-glorify-text-primary cursor-pointer outline-none focus-ring',
        }, React.createElement(ArrowLeft, { className: 'w-ch-4 h-ch-4' }), 'Go back'), React.createElement('button', {
            onClick: onClose,
            className: 'p-ch-1 rounded-full hover:bg-glorify-bg-secondary cursor-pointer outline-none focus-ring text-glorify-text-secondary hover:text-glorify-text-primary',
            'aria-label': 'Close detail view',
        }, React.createElement(X, { className: 'w-ch-5 h-ch-5' }))), 
        // Scrollable content
        React.createElement('div', { className: 'flex-1 overflow-y-auto p-ch-6 flex flex-col gap-ch-8' }, loading
            ? React.createElement(LoadingScreen)
            : data &&
                React.createElement(React.Fragment, null, 
                // Layout banner metadata
                React.createElement('div', { className: 'flex flex-col sm:flex-row items-center sm:items-start gap-ch-6 text-center sm:text-left border-b border-glorify-border-secondary pb-ch-6' }, 
                // Media
                React.createElement('div', {
                    className: `w-32 h-32 bg-glorify-bg-secondary border border-glorify-border-primary flex items-center justify-center font-mono overflow-hidden ${type === 'artist' ? 'rounded-full' : 'rounded-[20px]'}`,
                }, data.coverUrl
                    ? React.createElement('img', {
                        src: data.coverUrl,
                        alt: data.title,
                        className: 'w-full h-full object-cover',
                    })
                    : React.createElement(Disc, { className: 'w-ch-10 h-ch-10 text-glorify-text-muted animate-spin-slow' })), 
                // Titles
                React.createElement('div', { className: 'flex-1 flex flex-col gap-ch-2 mt-ch-2' }, React.createElement('h1', { className: 'text-xl font-bold tracking-tight text-glorify-text-primary' }, data.title), React.createElement('p', { className: 'text-xs font-mono uppercase tracking-widest text-glorify-aura-gold' }, data.subtitle), data.description &&
                    React.createElement('p', { className: 'text-xs text-glorify-text-secondary leading-relaxed max-w-md' }, data.description))), 
                // Tracks List block
                React.createElement('div', { className: 'flex flex-col gap-ch-4' }, 
                // Play triggers header
                React.createElement('div', { className: 'flex items-center justify-between' }, React.createElement('span', { className: 'text-[10px] font-mono text-glorify-text-muted tracking-widest' }, 'COMPOSITION INDEX'), data.tracks.length > 0 &&
                    React.createElement('button', {
                        onClick: handlePlayAll,
                        className: 'flex items-center gap-ch-2 px-ch-4 py-ch-2 rounded-ch-sm bg-glorify-aura-gold text-glorify-carbon-950 text-xs font-bold shadow-sm hover:shadow-ch-glow cursor-pointer active:scale-95 transition-all outline-none',
                    }, React.createElement(Play, { className: 'w-ch-3.5 h-ch-3.5 fill-currentColor pl-0.5' }), 'PLAY ALL')), 
                // Track lists table
                React.createElement('div', { className: 'flex flex-col gap-ch-1 mt-ch-2' }, data.tracks.length === 0
                    ? React.createElement('div', { className: 'text-center py-8 text-xs font-mono text-glorify-text-muted' }, 'NO_COMPOSITIONS_FOUND')
                    : data.tracks.map((track, idx) => React.createElement(TrackCard, {
                        key: track.id,
                        track: track,
                        index: idx,
                        queueContext: data.tracks,
                        onGoToAlbum: (albumId) => onNavigate?.(albumId, 'album'),
                        onGoToArtist: (artistId) => onNavigate?.(artistId, 'artist'),
                    })))))))));
}
//# sourceMappingURL=DetailOverlay.js.map