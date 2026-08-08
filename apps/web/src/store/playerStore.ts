import { create } from 'zustand';
import { Howl } from 'howler';
import { Track, Playlist } from '@chotify/types';
import { useToastStore } from './toastStore.js';
import { CloudRepository } from '../repositories/cloudRepository.js';

export type LoadingState = 'idle' | 'loading' | 'loaded' | 'buffering' | 'error';
export type RepeatMode = 'none' | 'one' | 'all';
export type AudioQualityType = 'standard' | 'high' | 'lossless';

export interface ListeningHistoryItem {
  trackId: string;
  playedAt: string;
  duration?: number;
  progress?: number;
}

interface PlayerState {
  // Playback state
  currentTrack: Track | null;
  queue: Track[];
  previousQueue: Track[];
  isPlaying: boolean;
  loadingState: LoadingState;
  volume: number;
  isMuted: boolean;
  lastUnmutedVolume: number;
  repeatMode: RepeatMode;
  isShuffle: boolean;
  playbackRate: number;
  currentTime: number;
  duration: number;
  isPlayerExpanded: boolean;
  isFullscreen: boolean;
  activePlayerTab: 'playback' | 'lyrics' | 'queue' | 'settings';

  // Playback configs
  crossfadeDuration: number;
  isGapless: boolean;
  isNormalized: boolean;
  sleepTimerMinutes: number | null;
  sleepTimerRemaining: number | null; // in seconds
  audioQuality: AudioQualityType;
  outputDevice: string;

  // Local storage lists
  playlists: Playlist[];
  favoritedTrackIds: string[];
  favoritedAlbumIds: string[];
  favoritedArtistIds: string[];
  downloadedTrackIds: string[];
  
  // Listening History
  listeningHistory: ListeningHistoryItem[];
  totalPlays: Record<string, number>;
  syncStatus: 'idle' | 'syncing' | 'synced' | 'error';

  // Download simulation state
  downloadStates: Record<string, 'downloading' | 'completed' | 'failed'>;
  downloadProgress: Record<string, number>;

  // Shuffle order state
  shuffledIndices: number[];
  shuffledCurrentIndex: number;

  // Actions
  playTrack: (track: Track, queueContext?: Track[]) => void;
  togglePlay: () => void;
  seek: (seconds: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  setPlaybackRate: (rate: number) => void;
  setRepeatMode: (mode: RepeatMode) => void;
  toggleShuffle: () => void;
  skipNext: () => void;
  skipPrevious: () => void;
  setPlayerExpanded: (expanded: boolean) => void;
  setFullscreen: (fullscreen: boolean) => void;
  toggleFullscreen: () => void;
  setActivePlayerTab: (tab: 'playback' | 'lyrics' | 'queue' | 'settings') => void;
  setQueue: (queue: Track[]) => void;
  addToQueue: (track: Track) => void;
  removeFromQueue: (trackId: string) => void;

  // Actions - Queue
  reorderQueue: (startIndex: number, endIndex: number) => void;
  playNext: (track: Track) => void;
  playLast: (track: Track) => void;
  clearQueue: () => void;

  // Actions - Playlists
  createPlaylist: (name: string, description?: string, coverImage?: string) => Promise<Playlist>;
  deletePlaylist: (playlistId: string) => void;
  renamePlaylist: (playlistId: string, name: string, description?: string, coverImage?: string) => void;
  addTrackToPlaylist: (playlistId: string, track: Track) => void;
  removeTrackFromPlaylist: (playlistId: string, trackId: string) => void;
  reorderPlaylistTracks: (playlistId: string, startIndex: number, endIndex: number) => void;
  duplicatePlaylist: (playlistId: string) => void;

  // Actions - Favorites
  toggleFavoriteTrack: (trackId: string) => void;
  toggleFavoriteAlbum: (albumId: string) => void;
  toggleFavoriteArtist: (artistId: string) => void;

  // Actions - Downloads
  startDownloadTrack: (track: Track) => void;
  removeDownloadedTrack: (trackId: string) => void;

  // Actions - Configs
  setCrossfadeDuration: (val: number) => void;
  setGapless: (val: boolean) => void;
  setNormalized: (val: boolean) => void;
  setSleepTimer: (minutes: number | null) => void;
  setAudioQuality: (quality: AudioQualityType) => void;
  setOutputDevice: (device: string) => void;
  syncCloudData: () => Promise<void>;
  clearCloudData: () => void;
}

let activeHowl: Howl | null = null;
let preloadedHowl: Howl | null = null;
let preloadedTrackId: string | null = null;
let activeLocalBlobUrl: string | null = null;
let preloadedLocalBlobUrl: string | null = null;
let progressIntervalId: any = null;
let sleepTimerIntervalId: any = null;

// Local storage helper loaders
const loadSavedPlaylists = (): Playlist[] => {
  try {
    const saved = localStorage.getItem('glorify-playlists') || localStorage.getItem('chotify-playlists');
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    return [];
  }
};

const loadSavedFavorites = (): string[] => {
  try {
    const saved = localStorage.getItem('glorify-favorites') || localStorage.getItem('chotify-favorites');
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    return [];
  }
};

const loadSavedFavAlbums = (): string[] => {
  try {
    const saved = localStorage.getItem('glorify-favorites-albums');
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    return [];
  }
};

const loadSavedFavArtists = (): string[] => {
  try {
    const saved = localStorage.getItem('glorify-favorites-artists');
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    return [];
  }
};

const loadSavedDownloads = (): string[] => {
  try {
    const saved = localStorage.getItem('glorify-downloads');
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    return [];
  }
};

const loadListeningHistory = (): ListeningHistoryItem[] => {
  try {
    const saved = localStorage.getItem('glorify-listening-history');
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    return [];
  }
};

const loadTotalPlays = (): Record<string, number> => {
  try {
    const saved = localStorage.getItem('glorify-total-plays');
    return saved ? JSON.parse(saved) : {};
  } catch (e) {
    return {};
  }
};

const loadSavedVolume = (): number => {
  try {
    const saved = localStorage.getItem('glorify-player-volume');
    return saved ? parseFloat(saved) : 0.8;
  } catch (e) {
    return 0.8;
  }
};

const loadSavedMuted = (): boolean => {
  try {
    return localStorage.getItem('glorify-player-muted') === 'true';
  } catch (e) {
    return false;
  }
};

const loadSavedLastUnmutedVolume = (): number => {
  try {
    const saved = localStorage.getItem('glorify-player-last-unmuted-volume');
    return saved ? parseFloat(saved) : 0.8;
  } catch (e) {
    return 0.8;
  }
};

const loadSavedQueue = (): Track[] => {
  try {
    const saved = localStorage.getItem('glorify-queue');
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    return [];
  }
};

const loadSavedCurrentTrack = (): Track | null => {
  try {
    const saved = localStorage.getItem('glorify-current-track');
    return saved ? JSON.parse(saved) : null;
  } catch (e) {
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

const startProgressInterval = (store: any) => {
  if (progressIntervalId) clearInterval(progressIntervalId);
  progressIntervalId = setInterval(() => {
    if (activeHowl && activeHowl.playing()) {
      const time = activeHowl.seek() as number;
      if (typeof time === 'number') {
        store.setState({ currentTime: time });
        
        // Gapless playback preloading
        const state = store.getState();
        if (state.isGapless && state.duration > 0 && state.duration - time < 5 && !preloadedHowl) {
          const { queue, currentTrack, isShuffle, shuffledIndices, shuffledCurrentIndex } = state;
          const currentIndex = queue.findIndex((t: Track) => t.id === currentTrack?.id);
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
            if (nextTrack.source === 'local') {
              import('./localLibraryStore.js').then(async (m) => {
                try {
                  const file = await m.useLocalLibraryStore.getState().resolveAudioFile(nextTrack);
                  if (preloadedLocalBlobUrl) {
                    URL.revokeObjectURL(preloadedLocalBlobUrl);
                  }
                  preloadedLocalBlobUrl = URL.createObjectURL(file);
                  preloadedHowl = new Howl({
                    src: [preloadedLocalBlobUrl],
                    html5: true,
                    volume: 0,
                    preload: true
                  });
                } catch (e) {
                  console.error('Failed to preload local track:', e);
                }
              });
            } else {
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
    }
  }, 60);
};

const stopProgressInterval = () => {
  if (progressIntervalId) {
    clearInterval(progressIntervalId);
    progressIntervalId = null;
  }
};

export const usePlayerStore = create<PlayerState>((set, get) => ({
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
  syncStatus: 'idle',

  // Download simulation state
  downloadStates: {},
  downloadProgress: {},

  // Shuffle order state
  shuffledIndices: [],
  shuffledCurrentIndex: -1,

  playTrack: async (track: Track, queueContext?: Track[]) => {
    const { volume, isMuted, playbackRate, crossfadeDuration } = get();

    // Crossfade: Fade out the current Howl
    if (activeHowl) {
      if (crossfadeDuration > 0 && activeHowl.playing()) {
        const oldHowl = activeHowl;
        oldHowl.fade(oldHowl.volume(), 0, crossfadeDuration * 1000);
        setTimeout(() => {
          try { oldHowl.unload(); } catch(e){}
        }, crossfadeDuration * 1000);
      } else {
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
        const currentIndex = queueContext.findIndex((t: Track) => t.id === track.id);
        const order = [currentIndex, ...indices.filter((idx) => idx !== currentIndex)];
        set({ shuffledIndices: order, shuffledCurrentIndex: 0 });
      }
    } else {
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
    const nextHistoryItem: ListeningHistoryItem = {
      trackId: track.id,
      playedAt: new Date().toISOString(),
    };
    const nextHistory = [nextHistoryItem, ...get().listeningHistory].slice(0, 30);
    const nextTotalPlays = { ...get().totalPlays, [track.id]: (get().totalPlays[track.id] || 0) + 1 };
    
    // Check if we should log to cloud (prevent duplicate logs within 10s)
    const lastHistory = get().listeningHistory[0];
    if (!lastHistory || lastHistory.trackId !== track.id || Date.now() - new Date(lastHistory.playedAt).getTime() > 10000) {
      CloudRepository.addHistoryEvent(track.id, track.duration, 0).catch(err => {
        console.error('Failed to log history event to cloud:', err);
      });
    }

    set({ listeningHistory: nextHistory, totalPlays: nextTotalPlays });
    localStorage.setItem('glorify-listening-history', JSON.stringify(nextHistory));
    localStorage.setItem('glorify-total-plays', JSON.stringify(nextTotalPlays));

    try {
      // Re-use preloaded Howl if matches
      if (preloadedHowl && preloadedTrackId === track.id) {
        activeHowl = preloadedHowl;
        preloadedHowl = null;
        preloadedTrackId = null;
        if (activeLocalBlobUrl) {
          URL.revokeObjectURL(activeLocalBlobUrl);
        }
        activeLocalBlobUrl = preloadedLocalBlobUrl;
        preloadedLocalBlobUrl = null;
      } else {
        if (preloadedHowl) {
          preloadedHowl.unload();
          preloadedHowl = null;
          preloadedTrackId = null;
          if (preloadedLocalBlobUrl) {
            URL.revokeObjectURL(preloadedLocalBlobUrl);
            preloadedLocalBlobUrl = null;
          }
        }

        let sourceUrl = track.audioUrl;
        if (track.source === 'local') {
          try {
            const { useLocalLibraryStore } = await import('./localLibraryStore.js');
            const file = await useLocalLibraryStore.getState().resolveAudioFile(track);
            if (activeLocalBlobUrl) {
              URL.revokeObjectURL(activeLocalBlobUrl);
            }
            activeLocalBlobUrl = URL.createObjectURL(file);
            sourceUrl = activeLocalBlobUrl;
          } catch (err: any) {
            console.error('Failed to resolve local audio file:', err);
            useToastStore.getState().addToast(err.message || 'Failed to play local track', 'error');
            set({ loadingState: 'error' });
            return;
          }
        }

        activeHowl = new Howl({
          src: [sourceUrl],
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
        } else {
          skipNext();
        }
      });
      activeHowl.on('loaderror', (_, error) => {
        console.error('Howler load error:', error);
        set({ loadingState: 'error', isPlaying: false });
        useToastStore.getState().addToast(
          track.source === 'local' 
            ? `Browser cannot play this format (${track.filePath?.split('.').pop()?.toUpperCase()}).`
            : 'Failed to load audio track.',
          'error'
        );
      });
      activeHowl.on('playerror', (_, error) => {
        console.error('Howler play error:', error);
        set({ loadingState: 'error', isPlaying: false });
      });

      activeHowl.play();
      if (crossfadeDuration > 0) {
        activeHowl.fade(0, isMuted ? 0 : volume, crossfadeDuration * 1000);
      } else {
        activeHowl.volume(isMuted ? 0 : volume);
      }
    } catch (err) {
      console.error('Failed to initialize audio playback:', err);
      set({ loadingState: 'error' });
    }
  },

  togglePlay: () => {
    const { currentTrack, isPlaying, playTrack } = get();
    if (!currentTrack) return;

    if (activeHowl) {
      if (isPlaying) {
        activeHowl.pause();
      } else {
        activeHowl.play();
      }
    } else {
      playTrack(currentTrack);
    }
  },

  seek: (seconds: number) => {
    if (activeHowl && activeHowl.state() === 'loaded') {
      activeHowl.seek(seconds);
      set({ currentTime: seconds });
    }
  },

  setVolume: (volume: number) => {
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
    } else {
      set({ isMuted: nextMute, volume: lastUnmutedVolume });
      localStorage.setItem('glorify-player-muted', 'false');
      localStorage.setItem('glorify-player-volume', String(lastUnmutedVolume));
      if (activeHowl) {
        activeHowl.volume(lastUnmutedVolume);
      }
    }
  },

  setPlaybackRate: (rate: number) => {
    const clampedRate = Math.max(0.5, Math.min(2.0, rate));
    set({ playbackRate: clampedRate });
    if (activeHowl) {
      activeHowl.rate(clampedRate);
    }
  },

  setRepeatMode: (mode: RepeatMode) => {
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
      } else {
        set({ shuffledIndices: indices, shuffledCurrentIndex: 0 });
      }
    } else {
      set({ shuffledIndices: [], shuffledCurrentIndex: -1 });
    }
  },

  skipNext: () => {
    const { queue, currentTrack, isShuffle, shuffledIndices, shuffledCurrentIndex, repeatMode, playTrack } = get();
    if (queue.length === 0) return;

    let nextIndex = 0;
    if (isShuffle && shuffledIndices.length > 0) {
      const nextShuffleIdx = shuffledCurrentIndex + 1;
      if (nextShuffleIdx >= shuffledIndices.length) {
        if (repeatMode === 'all') {
          nextIndex = shuffledIndices[0];
          set({ shuffledCurrentIndex: 0 });
        } else {
          if (activeHowl) activeHowl.stop();
          set({ isPlaying: false, currentTime: 0 });
          return;
        }
      } else {
        nextIndex = shuffledIndices[nextShuffleIdx];
        set({ shuffledCurrentIndex: nextShuffleIdx });
      }
    } else {
      const currentIndex = queue.findIndex((t) => t.id === currentTrack?.id);
      nextIndex = currentIndex + 1;
      if (nextIndex >= queue.length) {
        if (repeatMode === 'all') {
          nextIndex = 0;
        } else {
          if (activeHowl) activeHowl.stop();
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
    if (!currentTrack) return;

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

    if (queue.length === 0) return;
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

  setPlayerExpanded: (expanded: boolean) => {
    set({ isPlayerExpanded: expanded, isFullscreen: expanded });
  },

  setFullscreen: (fullscreen: boolean) => {
    set({ isFullscreen: fullscreen, isPlayerExpanded: fullscreen });
  },

  toggleFullscreen: () => {
    const next = !get().isFullscreen;
    set({ isFullscreen: next, isPlayerExpanded: next });
  },

  setActivePlayerTab: (tab: 'playback' | 'lyrics' | 'queue' | 'settings') => {
    set({ activePlayerTab: tab });
  },

  setQueue: (newQueue: Track[]) => {
    set({ queue: newQueue });
    localStorage.setItem('glorify-queue', JSON.stringify(newQueue));
  },

  addToQueue: (track: Track) => {
    const currentQueue = get().queue;
    if (!currentQueue.some((t) => t.id === track.id)) {
      const nextQueue = [...currentQueue, track];
      set({ queue: nextQueue });
      localStorage.setItem('glorify-queue', JSON.stringify(nextQueue));
    }
  },

  removeFromQueue: (trackId: string) => {
    const nextQueue = get().queue.filter((t) => t.id !== trackId);
    set({ queue: nextQueue });
    localStorage.setItem('glorify-queue', JSON.stringify(nextQueue));
  },

  // Actions - Queue Reordering & Helpers
  reorderQueue: (startIndex: number, endIndex: number) => {
    const result = Array.from(get().queue);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    set({ queue: result });
    localStorage.setItem('glorify-queue', JSON.stringify(result));
  },

  playNext: (track: Track) => {
    const { queue, currentTrack } = get();
    const cleanQueue = queue.filter((t) => t.id !== track.id);
    const currentIndex = cleanQueue.findIndex((t: Track) => t.id === currentTrack?.id);
    
    const nextQueue = [...cleanQueue];
    nextQueue.splice(currentIndex + 1, 0, track);
    set({ queue: nextQueue });
    localStorage.setItem('glorify-queue', JSON.stringify(nextQueue));
  },

  playLast: (track: Track) => {
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
  createPlaylist: async (name: string, description?: string, coverImage?: string): Promise<Playlist> => {
    const tempId = 'playlist_' + Date.now();
    const newPlaylist: Playlist = {
      id: tempId,
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

    try {
      const serverPlaylist = await CloudRepository.createPlaylist(name, description, coverImage);
      set((state) => ({
        playlists: state.playlists.map((p) => (p.id === tempId ? { ...serverPlaylist, songs: p.songs } : p)),
      }));
      localStorage.setItem('glorify-playlists', JSON.stringify(get().playlists));
      return get().playlists.find(p => p.id === serverPlaylist.id) || serverPlaylist;
    } catch (err) {
      console.error('Failed to create playlist on cloud:', err);
      return newPlaylist;
    }
  },

  deletePlaylist: async (playlistId: string) => {
    const nextPlaylists = get().playlists.filter((p) => p.id !== playlistId);
    set({ playlists: nextPlaylists });
    localStorage.setItem('glorify-playlists', JSON.stringify(nextPlaylists));

    try {
      if (!playlistId.startsWith('playlist_')) {
        await CloudRepository.deletePlaylist(playlistId);
      }
    } catch (err) {
      console.error('Failed to delete playlist from cloud:', err);
    }
  },

  renamePlaylist: async (playlistId: string, name: string, description?: string, coverImage?: string) => {
    const nextPlaylists = get().playlists.map((p) =>
      p.id === playlistId ? { ...p, name, description, coverImage: coverImage || p.coverImage } : p
    );
    set({ playlists: nextPlaylists });
    localStorage.setItem('glorify-playlists', JSON.stringify(nextPlaylists));

    try {
      if (!playlistId.startsWith('playlist_')) {
        await CloudRepository.updatePlaylist(playlistId, name, description, coverImage);
      }
    } catch (err) {
      console.error('Failed to update playlist on cloud:', err);
    }
  },

  addTrackToPlaylist: async (playlistId: string, track: Track) => {
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

    try {
      if (!playlistId.startsWith('playlist_')) {
        await CloudRepository.addTrackToPlaylist(playlistId, track.id);
      }
    } catch (err) {
      console.error('Failed to add track to playlist on cloud:', err);
    }
  },

  removeTrackFromPlaylist: async (playlistId: string, trackId: string) => {
    const nextPlaylists = get().playlists.map((p) =>
      p.id === playlistId ? { ...p, songs: p.songs.filter((sid) => sid !== trackId) } : p
    );
    set({ playlists: nextPlaylists });
    localStorage.setItem('glorify-playlists', JSON.stringify(nextPlaylists));

    try {
      if (!playlistId.startsWith('playlist_')) {
        await CloudRepository.removeTrackFromPlaylist(playlistId, trackId);
      }
    } catch (err) {
      console.error('Failed to remove track from playlist on cloud:', err);
    }
  },

  reorderPlaylistTracks: async (playlistId: string, startIndex: number, endIndex: number) => {
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

    try {
      if (!playlistId.startsWith('playlist_')) {
        await CloudRepository.reorderPlaylistTracks(playlistId, startIndex, endIndex);
      }
    } catch (err) {
      console.error('Failed to reorder playlist tracks on cloud:', err);
    }
  },

  duplicatePlaylist: async (playlistId: string) => {
    const { playlists } = get();
    const original = playlists.find(p => p.id === playlistId);
    if (original) {
      const tempId = 'playlist_' + Date.now();
      const copy: Playlist = {
        ...original,
        id: tempId,
        name: `${original.name} (Copy)`,
        createdAt: new Date().toISOString()
      };
      const nextPlaylists = [...playlists, copy];
      set({ playlists: nextPlaylists });
      localStorage.setItem('glorify-playlists', JSON.stringify(nextPlaylists));
      useToastStore.getState().addToast(`Duplicated "${original.name}"`, 'success');

      try {
        const serverPlaylist = await CloudRepository.createPlaylist(copy.name, copy.description, copy.coverImage);
        set((state) => ({
          playlists: state.playlists.map((p) => (p.id === tempId ? serverPlaylist : p)),
        }));
        localStorage.setItem('glorify-playlists', JSON.stringify(get().playlists));
      } catch (err) {
        console.error('Failed to duplicate playlist on cloud:', err);
      }
    }
  },

  // Actions - Favorites
  toggleFavoriteTrack: async (trackId: string) => {
    const favorites = get().favoritedTrackIds;
    const isFav = favorites.includes(trackId);
    const nextFavorites = isFav
      ? favorites.filter((id) => id !== trackId)
      : [...favorites, trackId];
    
    set({ favoritedTrackIds: nextFavorites });
    localStorage.setItem('glorify-favorites', JSON.stringify(nextFavorites));
    useToastStore.getState().addToast(
      isFav ? 'Removed from Liked Songs' : 'Added to Liked Songs',
      isFav ? 'info' : 'favorite'
    );

    try {
      if (isFav) {
        await CloudRepository.removeFavorite(trackId, 'song');
      } else {
        await CloudRepository.addFavorite(trackId, 'song');
      }
    } catch (err) {
      console.error('Failed to toggle favorite track on cloud:', err);
    }
  },

  toggleFavoriteAlbum: async (albumId: string) => {
    const favAlbums = get().favoritedAlbumIds;
    const isFav = favAlbums.includes(albumId);
    const nextFavAlbums = isFav ? favAlbums.filter(id => id !== albumId) : [...favAlbums, albumId];
    set({ favoritedAlbumIds: nextFavAlbums });
    localStorage.setItem('glorify-favorites-albums', JSON.stringify(nextFavAlbums));
    useToastStore.getState().addToast(
      isFav ? 'Removed Album from Library' : 'Added Album to Library',
      'success'
    );

    try {
      if (isFav) {
        await CloudRepository.removeFavorite(albumId, 'album');
      } else {
        await CloudRepository.addFavorite(albumId, 'album');
      }
    } catch (err) {
      console.error('Failed to toggle favorite album on cloud:', err);
    }
  },

  toggleFavoriteArtist: async (artistId: string) => {
    const favArtists = get().favoritedArtistIds;
    const isFav = favArtists.includes(artistId);
    const nextFavArtists = isFav ? favArtists.filter(id => id !== artistId) : [...favArtists, artistId];
    set({ favoritedArtistIds: nextFavArtists });
    localStorage.setItem('glorify-favorites-artists', JSON.stringify(nextFavArtists));
    useToastStore.getState().addToast(
      isFav ? 'Unfollowed Artist' : 'Followed Artist',
      'success'
    );

    try {
      if (isFav) {
        await CloudRepository.removeFavorite(artistId, 'artist');
      } else {
        await CloudRepository.addFavorite(artistId, 'artist');
      }
    } catch (err) {
      console.error('Failed to toggle favorite artist on cloud:', err);
    }
  },

  // Actions - Simulated Downloads
  startDownloadTrack: (track: Track) => {
    const { downloadedTrackIds, downloadStates } = get();
    if (downloadedTrackIds.includes(track.id) || downloadStates[track.id] === 'downloading') return;

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
        } else {
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
          useToastStore.getState().addToast(`Download Failed: "${track.title}"`, 'error' as any);
        }
      } else {
        set((state) => {
          const nextProg = { ...state.downloadProgress };
          nextProg[track.id] = progress;
          return { downloadProgress: nextProg };
        });
      }
    }, 300);
  },

  removeDownloadedTrack: (trackId: string) => {
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
  setCrossfadeDuration: (val: number) => set({ crossfadeDuration: val }),
  setGapless: (val: boolean) => set({ isGapless: val }),
  setNormalized: (val: boolean) => set({ isNormalized: val }),
  setAudioQuality: (quality: AudioQualityType) => set({ audioQuality: quality }),
  setOutputDevice: (device: string) => set({ outputDevice: device }),

  setSleepTimer: (minutes: number | null) => {
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
        if (activeHowl) activeHowl.pause();
        useToastStore.getState().addToast('Sleep timer expired. Audio playback paused.', 'info');
      } else {
        set({ sleepTimerRemaining: remaining - 1 });
      }
    }, 1000);
  },

  syncCloudData: async () => {
    // If already syncing, don't trigger again
    if (get().syncStatus === 'syncing') return;
    set({ syncStatus: 'syncing' });
    try {
      const [playlists, favorites, history] = await Promise.all([
        CloudRepository.getPlaylists(),
        CloudRepository.getFavorites(),
        CloudRepository.getHistory(),
      ]);

      set({
        playlists,
        favoritedTrackIds: favorites.songs || [],
        favoritedAlbumIds: favorites.albums || [],
        favoritedArtistIds: favorites.artists || [],
        listeningHistory: history || [],
        syncStatus: 'synced',
      });

      localStorage.setItem('glorify-playlists', JSON.stringify(playlists));
      localStorage.setItem('glorify-favorites', JSON.stringify(favorites.songs || []));
      localStorage.setItem('glorify-favorites-albums', JSON.stringify(favorites.albums || []));
      localStorage.setItem('glorify-favorites-artists', JSON.stringify(favorites.artists || []));
      localStorage.setItem('glorify-listening-history', JSON.stringify(history || []));
    } catch (err) {
      console.error('Failed to sync cloud data:', err);
      set({ syncStatus: 'error' });
    }
  },

  clearCloudData: () => {
    set({
      playlists: [],
      favoritedTrackIds: [],
      favoritedAlbumIds: [],
      favoritedArtistIds: [],
      listeningHistory: [],
      syncStatus: 'idle',
    });
    localStorage.removeItem('glorify-playlists');
    localStorage.removeItem('glorify-favorites');
    localStorage.removeItem('glorify-favorites-albums');
    localStorage.removeItem('glorify-favorites-artists');
    localStorage.removeItem('glorify-listening-history');
  },
}));
