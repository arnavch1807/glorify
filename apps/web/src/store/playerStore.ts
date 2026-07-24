import { create } from 'zustand';
import { Howl } from 'howler';
import { Track, Playlist } from '@chotify/types';

export type LoadingState = 'idle' | 'loading' | 'loaded' | 'buffering' | 'error';
export type RepeatMode = 'none' | 'one' | 'all';
export type AudioQualityType = 'standard' | 'high' | 'lossless';

interface PlayerState {
  // Original playback state
  currentTrack: Track | null;
  queue: Track[];
  previousQueue: Track[];
  isPlaying: boolean;
  loadingState: LoadingState;
  volume: number;
  isMuted: boolean;
  repeatMode: RepeatMode;
  isShuffle: boolean;
  playbackRate: number;
  currentTime: number;
  duration: number;
  isPlayerExpanded: boolean;

  // New Playback configs
  crossfadeDuration: number;
  isGapless: boolean;
  isNormalized: boolean;
  sleepTimerMinutes: number | null;
  sleepTimerRemaining: number | null; // in seconds
  audioQuality: AudioQualityType;
  outputDevice: string;

  // New Local storage lists
  playlists: Playlist[];
  favoritedTrackIds: string[];

  // Original Actions
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
  setQueue: (queue: Track[]) => void;
  addToQueue: (track: Track) => void;
  removeFromQueue: (trackId: string) => void;

  // New Actions - Queue
  reorderQueue: (startIndex: number, endIndex: number) => void;
  playNext: (track: Track) => void;
  playLast: (track: Track) => void;
  clearQueue: () => void;

  // New Actions - Playlists
  createPlaylist: (name: string, description?: string) => void;
  deletePlaylist: (playlistId: string) => void;
  renamePlaylist: (playlistId: string, name: string, description?: string) => void;
  addTrackToPlaylist: (playlistId: string, track: Track) => void;
  removeTrackFromPlaylist: (playlistId: string, trackId: string) => void;
  reorderPlaylistTracks: (playlistId: string, startIndex: number, endIndex: number) => void;
  toggleFavoriteTrack: (trackId: string) => void;

  // New Actions - Configs
  setCrossfadeDuration: (val: number) => void;
  setGapless: (val: boolean) => void;
  setNormalized: (val: boolean) => void;
  setSleepTimer: (minutes: number | null) => void;
  setAudioQuality: (quality: AudioQualityType) => void;
  setOutputDevice: (device: string) => void;
}

let activeHowl: Howl | null = null;
let progressIntervalId: any = null;
let sleepTimerIntervalId: any = null;

const startProgressInterval = (store: any) => {
  if (progressIntervalId) clearInterval(progressIntervalId);
  progressIntervalId = setInterval(() => {
    if (activeHowl && activeHowl.playing()) {
      const time = activeHowl.seek() as number;
      if (typeof time === 'number') {
        store.setState({ currentTime: time });
      }
    }
  }, 250);
};

const stopProgressInterval = () => {
  if (progressIntervalId) {
    clearInterval(progressIntervalId);
    progressIntervalId = null;
  }
};

// Local storage helper loaders
const loadSavedPlaylists = (): Playlist[] => {
  try {
    const saved = localStorage.getItem('chotify-playlists');
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    return [];
  }
};

const loadSavedFavorites = (): string[] => {
  try {
    const saved = localStorage.getItem('chotify-favorites');
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    return [];
  }
};

export const usePlayerStore = create<PlayerState>((set, get) => ({
  // Base states
  currentTrack: null,
  queue: [],
  previousQueue: [],
  isPlaying: false,
  loadingState: 'idle',
  volume: 0.8,
  isMuted: false,
  repeatMode: 'none',
  isShuffle: false,
  playbackRate: 1.0,
  currentTime: 0,
  duration: 0,
  isPlayerExpanded: false,

  // Extended configs
  crossfadeDuration: 0,
  isGapless: false,
  isNormalized: true,
  sleepTimerMinutes: null,
  sleepTimerRemaining: null,
  audioQuality: 'high',
  outputDevice: 'Default Speakers',

  // Lists
  playlists: loadSavedPlaylists(),
  favoritedTrackIds: loadSavedFavorites(),

  playTrack: (track: Track, queueContext?: Track[]) => {
    const { volume, isMuted, playbackRate } = get();

    if (activeHowl) {
      activeHowl.unload();
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

    if (queueContext) {
      set({ queue: queueContext });
    } else {
      const currentQueue = get().queue;
      if (!currentQueue.some((t) => t.id === track.id)) {
        set({ queue: [...currentQueue, track] });
      }
    }

    try {
      activeHowl = new Howl({
        src: [track.audioUrl],
        html5: true,
        volume: isMuted ? 0 : volume,
        rate: playbackRate,
        onload: () => {
          if (activeHowl) {
            set({
              duration: activeHowl.duration(),
              loadingState: 'loaded',
            });
          }
        },
        onplay: () => {
          set({ isPlaying: true, loadingState: 'loaded' });
          startProgressInterval({ setState: set });
        },
        onpause: () => {
          set({ isPlaying: false });
          stopProgressInterval();
        },
        onstop: () => {
          set({ isPlaying: false, currentTime: 0 });
          stopProgressInterval();
        },
        onend: () => {
          stopProgressInterval();
          const { repeatMode, skipNext } = get();
          if (repeatMode === 'one') {
            activeHowl?.play();
          } else {
            skipNext();
          }
        },
        onloaderror: (_, error) => {
          console.error('Howler load error:', error);
          set({ loadingState: 'error', isPlaying: false });
        },
        onplayerror: (_, error) => {
          console.error('Howler play error:', error);
          set({ loadingState: 'error', isPlaying: false });
        },
      });

      activeHowl.play();
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
    if (activeHowl) {
      activeHowl.volume(get().isMuted ? 0 : clampedVolume);
    }
  },

  toggleMute: () => {
    const nextMute = !get().isMuted;
    set({ isMuted: nextMute });
    if (activeHowl) {
      activeHowl.volume(nextMute ? 0 : get().volume);
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
    set((state) => ({ isShuffle: !state.isShuffle }));
  },

  skipNext: () => {
    const { queue, currentTrack, isShuffle, repeatMode, playTrack } = get();
    if (queue.length === 0) return;

    let nextIndex = 0;
    const currentIndex = queue.findIndex((t) => t.id === currentTrack?.id);

    if (isShuffle) {
      nextIndex = Math.floor(Math.random() * queue.length);
    } else {
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
    set({ isPlayerExpanded: expanded });
  },

  setQueue: (newQueue: Track[]) => {
    set({ queue: newQueue });
  },

  addToQueue: (track: Track) => {
    const currentQueue = get().queue;
    if (!currentQueue.some((t) => t.id === track.id)) {
      set({ queue: [...currentQueue, track] });
    }
  },

  removeFromQueue: (trackId: string) => {
    set((state) => ({
      queue: state.queue.filter((t) => t.id !== trackId),
    }));
  },

  // Actions - Queue Reordering & Helpers
  reorderQueue: (startIndex: number, endIndex: number) => {
    const result = Array.from(get().queue);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    set({ queue: result });
  },

  playNext: (track: Track) => {
    const { queue, currentTrack } = get();
    const cleanQueue = queue.filter((t) => t.id !== track.id);
    const currentIndex = cleanQueue.findIndex((t) => t.id === currentTrack?.id);
    
    const nextQueue = [...cleanQueue];
    nextQueue.splice(currentIndex + 1, 0, track);
    set({ queue: nextQueue });
  },

  playLast: (track: Track) => {
    const { queue } = get();
    const cleanQueue = queue.filter((t) => t.id !== track.id);
    set({ queue: [...cleanQueue, track] });
  },

  clearQueue: () => {
    const { currentTrack } = get();
    set({ queue: currentTrack ? [currentTrack] : [], previousQueue: [] });
  },

  // Actions - Playlist Manager
  createPlaylist: (name: string, description?: string) => {
    const newPlaylist: Playlist = {
      id: 'playlist_' + Date.now(),
      userId: 'user_dev',
      name,
      description,
      songs: [],
      isPublic: true,
      createdAt: new Date().toISOString(),
    };
    const nextPlaylists = [...get().playlists, newPlaylist];
    set({ playlists: nextPlaylists });
    localStorage.setItem('chotify-playlists', JSON.stringify(nextPlaylists));
  },

  deletePlaylist: (playlistId: string) => {
    const nextPlaylists = get().playlists.filter((p) => p.id !== playlistId);
    set({ playlists: nextPlaylists });
    localStorage.setItem('chotify-playlists', JSON.stringify(nextPlaylists));
  },

  renamePlaylist: (playlistId: string, name: string, description?: string) => {
    const nextPlaylists = get().playlists.map((p) =>
      p.id === playlistId ? { ...p, name, description } : p
    );
    set({ playlists: nextPlaylists });
    localStorage.setItem('chotify-playlists', JSON.stringify(nextPlaylists));
  },

  addTrackToPlaylist: (playlistId: string, track: Track) => {
    const nextPlaylists = get().playlists.map((p) => {
      if (p.id === playlistId) {
        if (!p.songs.includes(track.id)) {
          return { ...p, songs: [...p.songs, track.id] };
        }
      }
      return p;
    });
    set({ playlists: nextPlaylists });
    localStorage.setItem('chotify-playlists', JSON.stringify(nextPlaylists));
  },

  removeTrackFromPlaylist: (playlistId: string, trackId: string) => {
    const nextPlaylists = get().playlists.map((p) =>
      p.id === playlistId ? { ...p, songs: p.songs.filter((sid) => sid !== trackId) } : p
    );
    set({ playlists: nextPlaylists });
    localStorage.setItem('chotify-playlists', JSON.stringify(nextPlaylists));
  },

  reorderPlaylistTracks: (playlistId: string, startIndex: number, endIndex: number) => {
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
    localStorage.setItem('chotify-playlists', JSON.stringify(nextPlaylists));
  },

  toggleFavoriteTrack: (trackId: string) => {
    const favorites = get().favoritedTrackIds;
    const isFav = favorites.includes(trackId);
    const nextFavorites = isFav
      ? favorites.filter((id) => id !== trackId)
      : [...favorites, trackId];
    
    set({ favoritedTrackIds: nextFavorites });
    localStorage.setItem('chotify-favorites', JSON.stringify(nextFavorites));
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
        // Pause active audio stream
        if (activeHowl) activeHowl.pause();
      } else {
        set({ sleepTimerRemaining: remaining - 1 });
      }
    }, 1000);
  },
}));
