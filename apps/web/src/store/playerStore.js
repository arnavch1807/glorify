import { create } from 'zustand';
import { Howl } from 'howler';
import { useToastStore } from './toastStore.js';
let activeHowl = null;
let preloadedHowl = null;
let preloadedTrackId = null;
let progressIntervalId = null;
let sleepTimerIntervalId = null;
// Local storage helper loaders
const loadSavedPlaylists = () => {
    try {
        const saved = localStorage.getItem('glorify-playlists') || localStorage.getItem('chotify-playlists');
        return saved ? JSON.parse(saved) : [];
    }
    catch (e) {
        return [];
    }
};
const loadSavedFavorites = () => {
    try {
        const saved = localStorage.getItem('glorify-favorites') || localStorage.getItem('chotify-favorites');
        return saved ? JSON.parse(saved) : [];
    }
    catch (e) {
        return [];
    }
};
const loadSavedFavAlbums = () => {
    try {
        const saved = localStorage.getItem('glorify-favorites-albums');
        return saved ? JSON.parse(saved) : [];
    }
    catch (e) {
        return [];
    }
};
const loadSavedFavArtists = () => {
    try {
        const saved = localStorage.getItem('glorify-favorites-artists');
        return saved ? JSON.parse(saved) : [];
    }
    catch (e) {
        return [];
    }
};
const loadSavedDownloads = () => {
    try {
        const saved = localStorage.getItem('glorify-downloads');
        return saved ? JSON.parse(saved) : [];
    }
    catch (e) {
        return [];
    }
};
const loadListeningHistory = () => {
    try {
        const saved = localStorage.getItem('glorify-listening-history');
        return saved ? JSON.parse(saved) : [];
    }
    catch (e) {
        return [];
    }
};
const loadTotalPlays = () => {
    try {
        const saved = localStorage.getItem('glorify-total-plays');
        return saved ? JSON.parse(saved) : {};
    }
    catch (e) {
        return {};
    }
};
const loadSavedVolume = () => {
    try {
        const saved = localStorage.getItem('glorify-player-volume');
        return saved ? parseFloat(saved) : 0.8;
    }
    catch (e) {
        return 0.8;
    }
};
const loadSavedMuted = () => {
    try {
        return localStorage.getItem('glorify-player-muted') === 'true';
    }
    catch (e) {
        return false;
    }
};
const loadSavedLastUnmutedVolume = () => {
    try {
        const saved = localStorage.getItem('glorify-player-last-unmuted-volume');
        return saved ? parseFloat(saved) : 0.8;
    }
    catch (e) {
        return 0.8;
    }
};
const loadSavedQueue = () => {
    try {
        const saved = localStorage.getItem('glorify-queue');
        return saved ? JSON.parse(saved) : [];
    }
    catch (e) {
        return [];
    }
};
const loadSavedCurrentTrack = () => {
    try {
        const saved = localStorage.getItem('glorify-current-track');
        return saved ? JSON.parse(saved) : null;
    }
    catch (e) {
        return null;
    }
};
// Migrate old local storage keys if present
if (typeof window !== 'undefined') {
    const oldKeys = ['theme', 'playlists', 'favorites', 'search-history'];
    oldKeys.forEach((key) => {
        const oldVal = localStorage.getItem(`chotify-${key}`);
        if (oldVal && !localStorage.getItem(`glorify-${key}`)) {
            localStorage.setItem(`glorify-${key}`, oldVal);
        }
    });
}
const startProgressInterval = (store) => {
    if (progressIntervalId)
        clearInterval(progressIntervalId);
    progressIntervalId = setInterval(() => {
        if (activeHowl && activeHowl.playing()) {
            const time = activeHowl.seek();
            if (typeof time === 'number') {
                store.setState({ currentTime: time });
                // Gapless playback preloading
                const state = store.getState();
                if (state.isGapless && state.duration > 0 && state.duration - time < 5 && !preloadedHowl) {
                    const { queue, currentTrack, isShuffle, shuffledIndices, shuffledCurrentIndex } = state;
                    const currentIndex = queue.findIndex((t) => t.id === currentTrack?.id);
                    let nextIndex = currentIndex + 1;
                    if (isShuffle && shuffledIndices.length > 0) {
                        const nextShuffleIdx = shuffledCurrentIndex + 1;
                        if (nextShuffleIdx < shuffledIndices.length) {
                            nextIndex = shuffledIndices[nextShuffleIdx];
                        }
                    }
                    if (nextIndex < queue.length) {
                        const nextTrack = queue[nextIndex];
                        preloadedTrackId = nextTrack.id;
                        preloadedHowl = new Howl({
                            src: [nextTrack.audioUrl],
                            html5: true,
                            volume: 0,
                            preload: true
                        });
                    }
                }
            }
        }
    }, 60);
};
const stopProgressInterval = () => {
    if (progressIntervalId) {
        clearInterval(progressIntervalId);
        progressIntervalId = null;
    }
};
export const usePlayerStore = create((set, get) => ({
    // Base states
    currentTrack: loadSavedCurrentTrack(),
    queue: loadSavedQueue(),
    previousQueue: [],
    isPlaying: false,
    loadingState: 'idle',
    volume: loadSavedVolume(),
    isMuted: loadSavedMuted(),
    lastUnmutedVolume: loadSavedLastUnmutedVolume(),
    repeatMode: 'none',
    isShuffle: false,
    playbackRate: 1.0,
    currentTime: 0,
    duration: 0,
    isPlayerExpanded: false,
    isFullscreen: false,
    activePlayerTab: 'playback',
    // Extended configs
    crossfadeDuration: 3,
    isGapless: true,
    isNormalized: true,
    sleepTimerMinutes: null,
    sleepTimerRemaining: null,
    audioQuality: 'high',
    outputDevice: 'Default Speakers',
    // Lists
    playlists: loadSavedPlaylists(),
    favoritedTrackIds: loadSavedFavorites(),
    favoritedAlbumIds: loadSavedFavAlbums(),
    favoritedArtistIds: loadSavedFavArtists(),
    downloadedTrackIds: loadSavedDownloads(),
    listeningHistory: loadListeningHistory(),
    totalPlays: loadTotalPlays(),
    // Download simulation state
    downloadStates: {},
    downloadProgress: {},
    // Shuffle order state
    shuffledIndices: [],
    shuffledCurrentIndex: -1,
    playTrack: (track, queueContext) => {
        const { volume, isMuted, playbackRate, crossfadeDuration } = get();
        // Crossfade: Fade out the current Howl
        if (activeHowl) {
            if (crossfadeDuration > 0 && activeHowl.playing()) {
                const oldHowl = activeHowl;
                oldHowl.fade(oldHowl.volume(), 0, crossfadeDuration * 1000);
                setTimeout(() => {
                    try {
                        oldHowl.unload();
                    }
                    catch (e) { }
                }, crossfadeDuration * 1000);
            }
            else {
                activeHowl.unload();
            }
            activeHowl = null;
        }
        stopProgressInterval();
        set({
            currentTrack: track,
            loadingState: 'loading',
            currentTime: 0,
            duration: 0,
            isPlaying: false,
        });
        localStorage.setItem('glorify-current-track', JSON.stringify(track));
        // Handle queue update
        if (queueContext) {
            set({ queue: queueContext });
            localStorage.setItem('glorify-queue', JSON.stringify(queueContext));
            // Reset shuffle indices if new queue context provided
            if (get().isShuffle) {
                const indices = Array.from({ length: queueContext.length }, (_, i) => i);
                for (let i = indices.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [indices[i], indices[j]] = [indices[j], indices[i]];
                }
                const currentIndex = queueContext.findIndex((t) => t.id === track.id);
                const order = [currentIndex, ...indices.filter((idx) => idx !== currentIndex)];
                set({ shuffledIndices: order, shuffledCurrentIndex: 0 });
            }
        }
        else {
            const currentQueue = get().queue;
            if (!currentQueue.some((t) => t.id === track.id)) {
                const newQueue = [...currentQueue, track];
                set({ queue: newQueue });
                localStorage.setItem('glorify-queue', JSON.stringify(newQueue));
                if (get().isShuffle) {
                    set({
                        shuffledIndices: [...get().shuffledIndices, newQueue.length - 1]
                    });
                }
            }
        }
        // Track listening history
        const nextHistoryItem = {
            trackId: track.id,
            playedAt: new Date().toISOString(),
        };
        const nextHistory = [nextHistoryItem, ...get().listeningHistory].slice(0, 30);
        const nextTotalPlays = { ...get().totalPlays, [track.id]: (get().totalPlays[track.id] || 0) + 1 };
        set({ listeningHistory: nextHistory, totalPlays: nextTotalPlays });
        localStorage.setItem('glorify-listening-history', JSON.stringify(nextHistory));
        localStorage.setItem('glorify-total-plays', JSON.stringify(nextTotalPlays));
        try {
            // Re-use preloaded Howl if matches
            if (preloadedHowl && preloadedTrackId === track.id) {
                activeHowl = preloadedHowl;
                preloadedHowl = null;
                preloadedTrackId = null;
            }
            else {
                if (preloadedHowl) {
                    preloadedHowl.unload();
                    preloadedHowl = null;
                    preloadedTrackId = null;
                }
                activeHowl = new Howl({
                    src: [track.audioUrl],
                    html5: true,
                    volume: 0, // Fade in
                    rate: playbackRate,
                });
            }
            // Bind Howler callbacks
            activeHowl.on('load', () => {
                if (activeHowl) {
                    set({
                        duration: activeHowl.duration(),
                        loadingState: 'loaded',
                    });
                }
            });
            activeHowl.on('play', () => {
                set({ isPlaying: true, loadingState: 'loaded' });
                startProgressInterval({ setState: set, getState: get });
            });
            activeHowl.on('pause', () => {
                set({ isPlaying: false });
                stopProgressInterval();
            });
            activeHowl.on('stop', () => {
                set({ isPlaying: false, currentTime: 0 });
                stopProgressInterval();
            });
            activeHowl.on('end', () => {
                stopProgressInterval();
                const { repeatMode, skipNext } = get();
                if (repeatMode === 'one') {
                    activeHowl?.play();
                }
                else {
                    skipNext();
                }
            });
            activeHowl.on('loaderror', (_, error) => {
                console.error('Howler load error:', error);
                set({ loadingState: 'error', isPlaying: false });
            });
            activeHowl.on('playerror', (_, error) => {
                console.error('Howler play error:', error);
                set({ loadingState: 'error', isPlaying: false });
            });
            activeHowl.play();
            if (crossfadeDuration > 0) {
                activeHowl.fade(0, isMuted ? 0 : volume, crossfadeDuration * 1000);
            }
            else {
                activeHowl.volume(isMuted ? 0 : volume);
            }
        }
        catch (err) {
            console.error('Failed to initialize audio playback:', err);
            set({ loadingState: 'error' });
        }
    },
    togglePlay: () => {
        const { currentTrack, isPlaying, playTrack } = get();
        if (!currentTrack)
            return;
        if (activeHowl) {
            if (isPlaying) {
                activeHowl.pause();
            }
            else {
                activeHowl.play();
            }
        }
        else {
            playTrack(currentTrack);
        }
    },
    seek: (seconds) => {
        if (activeHowl && activeHowl.state() === 'loaded') {
            activeHowl.seek(seconds);
            set({ currentTime: seconds });
        }
    },
    setVolume: (volume) => {
        const clampedVolume = Math.max(0, Math.min(1, volume));
        set({ volume: clampedVolume });
        localStorage.setItem('glorify-player-volume', String(clampedVolume));
        if (clampedVolume > 0 && get().isMuted) {
            set({ isMuted: false });
            localStorage.setItem('glorify-player-muted', 'false');
        }
        if (activeHowl) {
            activeHowl.volume(get().isMuted ? 0 : clampedVolume);
        }
    },
    toggleMute: () => {
        const { isMuted, volume, lastUnmutedVolume } = get();
        const nextMute = !isMuted;
        if (nextMute) {
            const newLastVolume = volume > 0 ? volume : lastUnmutedVolume;
            set({ isMuted: nextMute, lastUnmutedVolume: newLastVolume });
            localStorage.setItem('glorify-player-muted', 'true');
            localStorage.setItem('glorify-player-last-unmuted-volume', String(newLastVolume));
            if (activeHowl) {
                activeHowl.volume(0);
            }
        }
        else {
            set({ isMuted: nextMute, volume: lastUnmutedVolume });
            localStorage.setItem('glorify-player-muted', 'false');
            localStorage.setItem('glorify-player-volume', String(lastUnmutedVolume));
            if (activeHowl) {
                activeHowl.volume(lastUnmutedVolume);
            }
        }
    },
    setPlaybackRate: (rate) => {
        const clampedRate = Math.max(0.5, Math.min(2.0, rate));
        set({ playbackRate: clampedRate });
        if (activeHowl) {
            activeHowl.rate(clampedRate);
        }
    },
    setRepeatMode: (mode) => {
        set({ repeatMode: mode });
    },
    toggleShuffle: () => {
        const nextShuffle = !get().isShuffle;
        set({ isShuffle: nextShuffle });
        if (nextShuffle) {
            // Build shuffled order indices
            const { queue, currentTrack } = get();
            const indices = Array.from({ length: queue.length }, (_, i) => i);
            for (let i = indices.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [indices[i], indices[j]] = [indices[j], indices[i]];
            }
            const currentIndex = queue.findIndex(t => t.id === currentTrack?.id);
            if (currentIndex !== -1) {
                const order = [currentIndex, ...indices.filter(idx => idx !== currentIndex)];
                set({ shuffledIndices: order, shuffledCurrentIndex: 0 });
            }
            else {
                set({ shuffledIndices: indices, shuffledCurrentIndex: 0 });
            }
        }
        else {
            set({ shuffledIndices: [], shuffledCurrentIndex: -1 });
        }
    },
    skipNext: () => {
        const { queue, currentTrack, isShuffle, shuffledIndices, shuffledCurrentIndex, repeatMode, playTrack } = get();
        if (queue.length === 0)
            return;
        let nextIndex = 0;
        if (isShuffle && shuffledIndices.length > 0) {
            const nextShuffleIdx = shuffledCurrentIndex + 1;
            if (nextShuffleIdx >= shuffledIndices.length) {
                if (repeatMode === 'all') {
                    nextIndex = shuffledIndices[0];
                    set({ shuffledCurrentIndex: 0 });
                }
                else {
                    if (activeHowl)
                        activeHowl.stop();
                    set({ isPlaying: false, currentTime: 0 });
                    return;
                }
            }
            else {
                nextIndex = shuffledIndices[nextShuffleIdx];
                set({ shuffledCurrentIndex: nextShuffleIdx });
            }
        }
        else {
            const currentIndex = queue.findIndex((t) => t.id === currentTrack?.id);
            nextIndex = currentIndex + 1;
            if (nextIndex >= queue.length) {
                if (repeatMode === 'all') {
                    nextIndex = 0;
                }
                else {
                    if (activeHowl)
                        activeHowl.stop();
                    set({ isPlaying: false, currentTime: 0 });
                    return;
                }
            }
        }
        const nextTrack = queue[nextIndex];
        if (nextTrack) {
            if (currentTrack) {
                set((state) => ({ previousQueue: [...state.previousQueue, currentTrack] }));
            }
            playTrack(nextTrack);
        }
    },
    skipPrevious: () => {
        const { queue, currentTrack, currentTime, previousQueue, playTrack, seek } = get();
        if (!currentTrack)
            return;
        if (currentTime > 3) {
            seek(0);
            return;
        }
        if (previousQueue.length > 0) {
            const prevTrack = previousQueue[previousQueue.length - 1];
            set((state) => ({
                previousQueue: state.previousQueue.slice(0, -1),
            }));
            playTrack(prevTrack);
            return;
        }
        if (queue.length === 0)
            return;
        const currentIndex = queue.findIndex((t) => t.id === currentTrack.id);
        let prevIndex = currentIndex - 1;
        if (prevIndex < 0) {
            prevIndex = queue.length - 1;
        }
        const prevTrack = queue[prevIndex];
        if (prevTrack) {
            playTrack(prevTrack);
        }
    },
    setPlayerExpanded: (expanded) => {
        set({ isPlayerExpanded: expanded, isFullscreen: expanded });
    },
    setFullscreen: (fullscreen) => {
        set({ isFullscreen: fullscreen, isPlayerExpanded: fullscreen });
    },
    toggleFullscreen: () => {
        const next = !get().isFullscreen;
        set({ isFullscreen: next, isPlayerExpanded: next });
    },
    setActivePlayerTab: (tab) => {
        set({ activePlayerTab: tab });
    },
    setQueue: (newQueue) => {
        set({ queue: newQueue });
        localStorage.setItem('glorify-queue', JSON.stringify(newQueue));
    },
    addToQueue: (track) => {
        const currentQueue = get().queue;
        if (!currentQueue.some((t) => t.id === track.id)) {
            const nextQueue = [...currentQueue, track];
            set({ queue: nextQueue });
            localStorage.setItem('glorify-queue', JSON.stringify(nextQueue));
        }
    },
    removeFromQueue: (trackId) => {
        const nextQueue = get().queue.filter((t) => t.id !== trackId);
        set({ queue: nextQueue });
        localStorage.setItem('glorify-queue', JSON.stringify(nextQueue));
    },
    // Actions - Queue Reordering & Helpers
    reorderQueue: (startIndex, endIndex) => {
        const result = Array.from(get().queue);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        set({ queue: result });
        localStorage.setItem('glorify-queue', JSON.stringify(result));
    },
    playNext: (track) => {
        const { queue, currentTrack } = get();
        const cleanQueue = queue.filter((t) => t.id !== track.id);
        const currentIndex = cleanQueue.findIndex((t) => t.id === currentTrack?.id);
        const nextQueue = [...cleanQueue];
        nextQueue.splice(currentIndex + 1, 0, track);
        set({ queue: nextQueue });
        localStorage.setItem('glorify-queue', JSON.stringify(nextQueue));
    },
    playLast: (track) => {
        const { queue } = get();
        const cleanQueue = queue.filter((t) => t.id !== track.id);
        const nextQueue = [...cleanQueue, track];
        set({ queue: nextQueue });
        localStorage.setItem('glorify-queue', JSON.stringify(nextQueue));
    },
    clearQueue: () => {
        const { currentTrack } = get();
        const nextQueue = currentTrack ? [currentTrack] : [];
        set({ queue: nextQueue, previousQueue: [] });
        localStorage.setItem('glorify-queue', JSON.stringify(nextQueue));
    },
    // Actions - Playlist Manager
    createPlaylist: (name, description, coverImage) => {
        const newPlaylist = {
            id: 'playlist_' + Date.now(),
            userId: 'user_dev',
            name,
            description,
            coverImage: coverImage || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop&q=80',
            songs: [],
            isPublic: true,
            createdAt: new Date().toISOString(),
        };
        const nextPlaylists = [...get().playlists, newPlaylist];
        set({ playlists: nextPlaylists });
        localStorage.setItem('glorify-playlists', JSON.stringify(nextPlaylists));
    },
    deletePlaylist: (playlistId) => {
        const nextPlaylists = get().playlists.filter((p) => p.id !== playlistId);
        set({ playlists: nextPlaylists });
        localStorage.setItem('glorify-playlists', JSON.stringify(nextPlaylists));
    },
    renamePlaylist: (playlistId, name, description, coverImage) => {
        const nextPlaylists = get().playlists.map((p) => p.id === playlistId ? { ...p, name, description, coverImage: coverImage || p.coverImage } : p);
        set({ playlists: nextPlaylists });
        localStorage.setItem('glorify-playlists', JSON.stringify(nextPlaylists));
    },
    addTrackToPlaylist: (playlistId, track) => {
        const nextPlaylists = get().playlists.map((p) => {
            if (p.id === playlistId) {
                if (!p.songs.includes(track.id)) {
                    return { ...p, songs: [...p.songs, track.id] };
                }
            }
            return p;
        });
        set({ playlists: nextPlaylists });
        localStorage.setItem('glorify-playlists', JSON.stringify(nextPlaylists));
    },
    removeTrackFromPlaylist: (playlistId, trackId) => {
        const nextPlaylists = get().playlists.map((p) => p.id === playlistId ? { ...p, songs: p.songs.filter((sid) => sid !== trackId) } : p);
        set({ playlists: nextPlaylists });
        localStorage.setItem('glorify-playlists', JSON.stringify(nextPlaylists));
    },
    reorderPlaylistTracks: (playlistId, startIndex, endIndex) => {
        const nextPlaylists = get().playlists.map((p) => {
            if (p.id === playlistId) {
                const result = Array.from(p.songs);
                const [removed] = result.splice(startIndex, 1);
                result.splice(endIndex, 0, removed);
                return { ...p, songs: result };
            }
            return p;
        });
        set({ playlists: nextPlaylists });
        localStorage.setItem('glorify-playlists', JSON.stringify(nextPlaylists));
    },
    duplicatePlaylist: (playlistId) => {
        const { playlists } = get();
        const original = playlists.find(p => p.id === playlistId);
        if (original) {
            const copy = {
                ...original,
                id: 'playlist_' + Date.now(),
                name: `${original.name} (Copy)`,
                createdAt: new Date().toISOString()
            };
            const nextPlaylists = [...playlists, copy];
            set({ playlists: nextPlaylists });
            localStorage.setItem('glorify-playlists', JSON.stringify(nextPlaylists));
            useToastStore.getState().addToast(`Duplicated "${original.name}"`, 'success');
        }
    },
    // Actions - Favorites
    toggleFavoriteTrack: (trackId) => {
        const favorites = get().favoritedTrackIds;
        const isFav = favorites.includes(trackId);
        const nextFavorites = isFav
            ? favorites.filter((id) => id !== trackId)
            : [...favorites, trackId];
        set({ favoritedTrackIds: nextFavorites });
        localStorage.setItem('glorify-favorites', JSON.stringify(nextFavorites));
        useToastStore.getState().addToast(isFav ? 'Removed from Liked Songs' : 'Added to Liked Songs', isFav ? 'info' : 'favorite');
    },
    toggleFavoriteAlbum: (albumId) => {
        const favAlbums = get().favoritedAlbumIds;
        const isFav = favAlbums.includes(albumId);
        const nextFavAlbums = isFav ? favAlbums.filter(id => id !== albumId) : [...favAlbums, albumId];
        set({ favoritedAlbumIds: nextFavAlbums });
        localStorage.setItem('glorify-favorites-albums', JSON.stringify(nextFavAlbums));
        useToastStore.getState().addToast(isFav ? 'Removed Album from Library' : 'Added Album to Library', 'success');
    },
    toggleFavoriteArtist: (artistId) => {
        const favArtists = get().favoritedArtistIds;
        const isFav = favArtists.includes(artistId);
        const nextFavArtists = isFav ? favArtists.filter(id => id !== artistId) : [...favArtists, artistId];
        set({ favoritedArtistIds: nextFavArtists });
        localStorage.setItem('glorify-favorites-artists', JSON.stringify(nextFavArtists));
        useToastStore.getState().addToast(isFav ? 'Unfollowed Artist' : 'Followed Artist', 'success');
    },
    // Actions - Simulated Downloads
    startDownloadTrack: (track) => {
        const { downloadedTrackIds, downloadStates } = get();
        if (downloadedTrackIds.includes(track.id) || downloadStates[track.id] === 'downloading')
            return;
        set((state) => ({
            downloadStates: { ...state.downloadStates, [track.id]: 'downloading' },
            downloadProgress: { ...state.downloadProgress, [track.id]: 0 },
        }));
        useToastStore.getState().addToast(`Downloading "${track.title}"`, 'download');
        let progress = 0;
        const interval = setInterval(() => {
            progress += 20;
            if (progress >= 100) {
                clearInterval(interval);
                // 10% chance to fail
                const isSuccess = Math.random() > 0.1;
                if (isSuccess) {
                    const nextDownloads = [...get().downloadedTrackIds, track.id];
                    set((state) => {
                        const nextStates = { ...state.downloadStates };
                        nextStates[track.id] = 'completed';
                        const nextProg = { ...state.downloadProgress };
                        nextProg[track.id] = 100;
                        return {
                            downloadedTrackIds: nextDownloads,
                            downloadStates: nextStates,
                            downloadProgress: nextProg,
                        };
                    });
                    localStorage.setItem('glorify-downloads', JSON.stringify(nextDownloads));
                    useToastStore.getState().addToast(`Download Complete: "${track.title}"`, 'download');
                }
                else {
                    set((state) => {
                        const nextStates = { ...state.downloadStates };
                        nextStates[track.id] = 'failed';
                        const nextProg = { ...state.downloadProgress };
                        nextProg[track.id] = 0;
                        return {
                            downloadStates: nextStates,
                            downloadProgress: nextProg,
                        };
                    });
                    useToastStore.getState().addToast(`Download Failed: "${track.title}"`, 'error');
                }
            }
            else {
                set((state) => {
                    const nextProg = { ...state.downloadProgress };
                    nextProg[track.id] = progress;
                    return { downloadProgress: nextProg };
                });
            }
        }, 300);
    },
    removeDownloadedTrack: (trackId) => {
        const nextDownloads = get().downloadedTrackIds.filter(id => id !== trackId);
        set((state) => {
            const nextStates = { ...state.downloadStates };
            delete nextStates[trackId];
            const nextProg = { ...state.downloadProgress };
            delete nextProg[trackId];
            return {
                downloadedTrackIds: nextDownloads,
                downloadStates: nextStates,
                downloadProgress: nextProg,
            };
        });
        localStorage.setItem('glorify-downloads', JSON.stringify(nextDownloads));
        useToastStore.getState().addToast('Removed from downloaded tracks', 'info');
    },
    // Actions - Configuration toggles
    setCrossfadeDuration: (val) => set({ crossfadeDuration: val }),
    setGapless: (val) => set({ isGapless: val }),
    setNormalized: (val) => set({ isNormalized: val }),
    setAudioQuality: (quality) => set({ audioQuality: quality }),
    setOutputDevice: (device) => set({ outputDevice: device }),
    setSleepTimer: (minutes) => {
        if (sleepTimerIntervalId) {
            clearInterval(sleepTimerIntervalId);
            sleepTimerIntervalId = null;
        }
        if (minutes === null) {
            set({ sleepTimerMinutes: null, sleepTimerRemaining: null });
            return;
        }
        const seconds = minutes * 60;
        set({ sleepTimerMinutes: minutes, sleepTimerRemaining: seconds });
        sleepTimerIntervalId = setInterval(() => {
            const remaining = get().sleepTimerRemaining;
            if (remaining === null || remaining <= 1) {
                clearInterval(sleepTimerIntervalId);
                sleepTimerIntervalId = null;
                set({ sleepTimerMinutes: null, sleepTimerRemaining: null });
                if (activeHowl)
                    activeHowl.pause();
                useToastStore.getState().addToast('Sleep timer expired. Audio playback paused.', 'info');
            }
            else {
                set({ sleepTimerRemaining: remaining - 1 });
            }
        }, 1000);
    },
}));
//# sourceMappingURL=playerStore.js.map