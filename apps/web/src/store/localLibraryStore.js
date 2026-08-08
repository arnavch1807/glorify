import { create } from 'zustand';
import * as db from '../utils/indexedDbHelper.js';
import * as scanner from '../utils/localMusicScanner.js';
import { usePlayerStore } from './playerStore.js';
import { parseLrc } from '../utils/lrcParser.js';
// In-memory cache of File objects (used during current browser session)
const fileCache = new Map();
// Keep track of active ObjectURLs to revoke them and avoid memory leaks
const activeObjectUrls = new Set();
function clearActiveObjectUrls() {
    for (const url of activeObjectUrls) {
        try {
            URL.revokeObjectURL(url);
        }
        catch (e) { }
    }
    activeObjectUrls.clear();
}
let lastMetadataUpdate = null;
export const useLocalLibraryStore = create((set, get) => ({
    localTracks: [],
    localAlbums: [],
    localArtists: [],
    localGenres: [],
    folders: [],
    scanningState: 'idle',
    scanProgress: { current: 0, total: 0 },
    isPermissionRequired: false,
    loadSavedLibrary: async () => {
        try {
            const folders = await db.getFolders();
            const tracks = await db.getTracks();
            // Check if any folder handle requires permission re-grant
            let permissionRequired = false;
            for (const folder of folders) {
                if (folder.handle) {
                    const status = await folder.handle.queryPermission({ mode: 'read' });
                    if (status !== 'granted') {
                        permissionRequired = true;
                    }
                }
            }
            // Rehydrate cover images from Blobs in IndexedDB
            clearActiveObjectUrls();
            const hydratedTracks = await Promise.all(tracks.map(async (t) => {
                const artworkBlob = await db.getArtwork(t.id);
                let coverImage = 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=400&auto=format&fit=crop&q=80';
                if (artworkBlob) {
                    const url = URL.createObjectURL(artworkBlob);
                    activeObjectUrls.add(url);
                    coverImage = url;
                }
                return {
                    id: t.id,
                    title: t.title,
                    artist: t.artist,
                    album: t.album,
                    genre: t.genre,
                    duration: t.duration,
                    audioUrl: '', // generated dynamically on play
                    coverImage,
                    source: 'local',
                    filePath: t.filePath,
                    isGenerated: false,
                    albumArtist: t.albumArtist,
                    year: t.year,
                    trackNumber: t.trackNumber,
                    discNumber: t.discNumber,
                    composer: t.composer,
                    comment: t.comment,
                    lyrics: t.lyrics,
                    createdAt: t.createdAt,
                };
            }));
            const { albums, artists, genres } = deriveCollections(hydratedTracks);
            set({
                folders,
                localTracks: hydratedTracks,
                localAlbums: albums,
                localArtists: artists,
                localGenres: genres,
                isPermissionRequired: permissionRequired,
                scanningState: 'ready',
            });
        }
        catch (err) {
            console.error('Failed to load local library:', err);
            set({ scanningState: 'error' });
        }
    },
    requestFolderPermissions: async () => {
        const { folders } = get();
        let allGranted = true;
        for (const folder of folders) {
            if (folder.handle) {
                try {
                    const status = await folder.handle.requestPermission({ mode: 'read' });
                    if (status !== 'granted') {
                        allGranted = false;
                    }
                }
                catch (e) {
                    console.warn('Failed requesting permission:', e);
                    allGranted = false;
                }
            }
        }
        if (allGranted) {
            set({ isPermissionRequired: false });
            // Re-scan or rehydrate file cache if needed
            for (const folder of folders) {
                if (folder.handle) {
                    try {
                        await scanner.scanDirectoryHandle(folder.handle, async (file, relativePath) => {
                            const trackId = `local_${folder.id}_${encodeURIComponent(relativePath)}`;
                            fileCache.set(trackId, file);
                        });
                    }
                    catch (e) {
                        console.error('Error caching files after permission grant:', e);
                    }
                }
            }
        }
        return allGranted;
    },
    importDirectory: async () => {
        if (!('showDirectoryPicker' in window)) {
            throw new Error('Directory Picker API is not supported in this browser.');
        }
        try {
            const handle = await window.showDirectoryPicker();
            const existingFolder = get().folders.find((f) => f.name === handle.name);
            const folderId = existingFolder ? existingFolder.id : 'folder_' + Date.now();
            const folderName = handle.name;
            // Save folder handle
            const folder = { id: folderId, name: folderName, handle };
            await db.saveFolder(folder);
            set({
                scanningState: 'scanning',
                scanProgress: { current: 0, total: 0 },
            });
            // Count files first for progress indicator
            const discoveredFiles = [];
            await scanner.scanDirectoryHandle(handle, async (file, relativePath, fileHandle) => {
                discoveredFiles.push({ file, path: relativePath, handle: fileHandle });
            });
            const audioFiles = [];
            const lyricsFilesMap = new Map();
            for (const item of discoveredFiles) {
                const ext = item.path.split('.').pop()?.toLowerCase();
                if (ext && ['lrc', 'txt'].includes(ext)) {
                    const lastSlash = item.path.lastIndexOf('/');
                    const dir = lastSlash === -1 ? '' : item.path.substring(0, lastSlash);
                    const filename = lastSlash === -1 ? item.path : item.path.substring(lastSlash + 1);
                    const dotIdx = filename.lastIndexOf('.');
                    const base = dotIdx === -1 ? filename : filename.substring(0, dotIdx);
                    const key = `${dir}/${base.trim().toLowerCase()}`;
                    lyricsFilesMap.set(key, { file: item.file, ext });
                }
                else {
                    audioFiles.push(item);
                }
            }
            const totalAudioFiles = audioFiles.length;
            set({ scanProgress: { current: 0, total: totalAudioFiles } });
            const tracksToSave = [];
            const newTracks = [];
            for (let i = 0; i < audioFiles.length; i++) {
                const { file, path } = audioFiles[i];
                const trackId = `local_${folderId}_${encodeURIComponent(path)}`;
                // Cache File object for current session playback
                fileCache.set(trackId, file);
                // Deduplication check: preserve user edits if track is already loaded
                const existingTrack = get().localTracks.find((t) => t.id === trackId);
                if (existingTrack) {
                    set({
                        scanProgress: { current: i + 1, total: totalAudioFiles },
                    });
                    continue;
                }
                // Parse metadata asynchronously
                const meta = await scanner.parseMetadata(file);
                // Store artwork Blob in IndexedDB
                if (meta.artworkBlob) {
                    await db.saveArtwork(trackId, meta.artworkBlob);
                }
                const coverImage = meta.artworkBlob
                    ? URL.createObjectURL(meta.artworkBlob)
                    : 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=400&auto=format&fit=crop&q=80';
                // Check for matching lyrics
                let trackLyrics = undefined;
                const lastSlash = path.lastIndexOf('/');
                const dir = lastSlash === -1 ? '' : path.substring(0, lastSlash);
                const filename = lastSlash === -1 ? path : path.substring(lastSlash + 1);
                const dotIdx = filename.lastIndexOf('.');
                const base = dotIdx === -1 ? filename : filename.substring(0, dotIdx);
                const lyricsKey = `${dir}/${base.trim().toLowerCase()}`;
                if (lyricsFilesMap.has(lyricsKey)) {
                    const lyrFile = lyricsFilesMap.get(lyricsKey);
                    try {
                        const text = await lyrFile.file.text();
                        if (lyrFile.ext === 'lrc') {
                            const lines = parseLrc(text);
                            trackLyrics = {
                                type: lines.length > 0 ? 'synced' : 'plain',
                                lines: lines.length > 0 ? lines : undefined,
                                text,
                                source: 'local'
                            };
                        }
                        else {
                            trackLyrics = {
                                type: 'plain',
                                text,
                                source: 'local'
                            };
                        }
                    }
                    catch (lyrErr) {
                        console.error(`Failed to read external lyrics file for ${path}:`, lyrErr);
                    }
                }
                // If no external lyrics, check embedded
                if (!trackLyrics && meta.embeddedLyrics) {
                    const lines = parseLrc(meta.embeddedLyrics);
                    trackLyrics = {
                        type: lines.length > 0 ? 'synced' : 'plain',
                        lines: lines.length > 0 ? lines : undefined,
                        text: meta.embeddedLyrics,
                        source: 'embedded'
                    };
                }
                const track = {
                    id: trackId,
                    title: meta.title,
                    artist: meta.artist,
                    album: meta.album,
                    genre: meta.genre,
                    duration: meta.duration || 0,
                    source: 'local',
                    filePath: path,
                    folderId,
                    albumArtist: meta.albumArtist,
                    year: meta.year,
                    trackNumber: meta.trackNumber,
                    discNumber: meta.discNumber,
                    composer: meta.composer,
                    comment: meta.comment,
                    lyrics: trackLyrics,
                    createdAt: new Date().toISOString(),
                };
                tracksToSave.push(track);
                newTracks.push({
                    ...track,
                    audioUrl: '',
                    coverImage,
                    isGenerated: false,
                });
                set({
                    scanProgress: { current: i + 1, total: totalAudioFiles },
                });
            }
            await db.saveTracks(tracksToSave);
            // Merge folders and tracks
            const nextFolders = existingFolder
                ? get().folders.map((f) => f.id === folderId ? folder : f)
                : [...get().folders, folder];
            const nextTracks = [...get().localTracks, ...newTracks];
            const { albums, artists, genres } = deriveCollections(nextTracks);
            set({
                folders: nextFolders,
                localTracks: nextTracks,
                localAlbums: albums,
                localArtists: artists,
                localGenres: genres,
                scanningState: 'ready',
            });
        }
        catch (err) {
            console.error('Import folder error:', err);
            set({ scanningState: 'ready' }); // keep ready but log error
        }
    },
    importFileList: async (files) => {
        try {
            const existingFolder = get().folders.find((f) => f.name === 'Local Uploads');
            const folderId = existingFolder ? existingFolder.id : 'fallback_folder_' + Date.now();
            const folderName = 'Local Uploads';
            const folder = { id: folderId, name: folderName };
            await db.saveFolder(folder);
            set({
                scanningState: 'scanning',
                scanProgress: { current: 0, total: files.length },
            });
            const discoveredFiles = [];
            await scanner.scanFileList(files, async (file, relativePath) => {
                discoveredFiles.push({ file, path: relativePath });
            });
            const audioFiles = [];
            const lyricsFilesMap = new Map();
            for (const item of discoveredFiles) {
                const ext = item.path.split('.').pop()?.toLowerCase();
                if (ext && ['lrc', 'txt'].includes(ext)) {
                    const lastSlash = item.path.lastIndexOf('/');
                    const dir = lastSlash === -1 ? '' : item.path.substring(0, lastSlash);
                    const filename = lastSlash === -1 ? item.path : item.path.substring(lastSlash + 1);
                    const dotIdx = filename.lastIndexOf('.');
                    const base = dotIdx === -1 ? filename : filename.substring(0, dotIdx);
                    const key = `${dir}/${base.trim().toLowerCase()}`;
                    lyricsFilesMap.set(key, { file: item.file, ext });
                }
                else {
                    audioFiles.push(item);
                }
            }
            const totalAudioFiles = audioFiles.length;
            set({ scanProgress: { current: 0, total: totalAudioFiles } });
            const tracksToSave = [];
            const newTracks = [];
            for (let i = 0; i < audioFiles.length; i++) {
                const { file, path } = audioFiles[i];
                const trackId = `local_${folderId}_${encodeURIComponent(path)}`;
                // Cache File object
                fileCache.set(trackId, file);
                // Deduplication check: preserve user edits
                const existingTrack = get().localTracks.find((t) => t.id === trackId);
                if (existingTrack) {
                    set({
                        scanProgress: { current: i + 1, total: totalAudioFiles },
                    });
                    continue;
                }
                // Parse metadata
                const meta = await scanner.parseMetadata(file);
                // Store artwork
                if (meta.artworkBlob) {
                    await db.saveArtwork(trackId, meta.artworkBlob);
                }
                const coverImage = meta.artworkBlob
                    ? URL.createObjectURL(meta.artworkBlob)
                    : 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=400&auto=format&fit=crop&q=80';
                // Check for matching lyrics
                let trackLyrics = undefined;
                const lastSlash = path.lastIndexOf('/');
                const dir = lastSlash === -1 ? '' : path.substring(0, lastSlash);
                const filename = lastSlash === -1 ? path : path.substring(lastSlash + 1);
                const dotIdx = filename.lastIndexOf('.');
                const base = dotIdx === -1 ? filename : filename.substring(0, dotIdx);
                const lyricsKey = `${dir}/${base.trim().toLowerCase()}`;
                if (lyricsFilesMap.has(lyricsKey)) {
                    const lyrFile = lyricsFilesMap.get(lyricsKey);
                    try {
                        const text = await lyrFile.file.text();
                        if (lyrFile.ext === 'lrc') {
                            const lines = parseLrc(text);
                            trackLyrics = {
                                type: lines.length > 0 ? 'synced' : 'plain',
                                lines: lines.length > 0 ? lines : undefined,
                                text,
                                source: 'local'
                            };
                        }
                        else {
                            trackLyrics = {
                                type: 'plain',
                                text,
                                source: 'local'
                            };
                        }
                    }
                    catch (lyrErr) {
                        console.error(`Failed to read external lyrics file for ${path}:`, lyrErr);
                    }
                }
                // If no external lyrics, check embedded
                if (!trackLyrics && meta.embeddedLyrics) {
                    const lines = parseLrc(meta.embeddedLyrics);
                    trackLyrics = {
                        type: lines.length > 0 ? 'synced' : 'plain',
                        lines: lines.length > 0 ? lines : undefined,
                        text: meta.embeddedLyrics,
                        source: 'embedded'
                    };
                }
                const track = {
                    id: trackId,
                    title: meta.title,
                    artist: meta.artist,
                    album: meta.album,
                    genre: meta.genre,
                    duration: meta.duration || 0,
                    source: 'local',
                    filePath: path,
                    folderId,
                    albumArtist: meta.albumArtist,
                    year: meta.year,
                    trackNumber: meta.trackNumber,
                    discNumber: meta.discNumber,
                    composer: meta.composer,
                    comment: meta.comment,
                    lyrics: trackLyrics,
                    createdAt: new Date().toISOString(),
                };
                tracksToSave.push(track);
                newTracks.push({
                    ...track,
                    audioUrl: '',
                    coverImage,
                    isGenerated: false,
                });
                set({
                    scanProgress: { current: i + 1, total: totalAudioFiles },
                });
            }
            await db.saveTracks(tracksToSave);
            const nextFolders = existingFolder
                ? get().folders.map((f) => f.id === folderId ? folder : f)
                : [...get().folders, folder];
            const nextTracks = [...get().localTracks, ...newTracks];
            const { albums, artists, genres } = deriveCollections(nextTracks);
            set({
                folders: nextFolders,
                localTracks: nextTracks,
                localAlbums: albums,
                localArtists: artists,
                localGenres: genres,
                scanningState: 'ready',
            });
        }
        catch (err) {
            console.error('Import fallback file list error:', err);
            set({ scanningState: 'ready' });
        }
    },
    deleteLibrary: async () => {
        try {
            await db.clearAllLocalData();
            fileCache.clear();
            set({
                localTracks: [],
                localAlbums: [],
                localArtists: [],
                folders: [],
                scanningState: 'idle',
                scanProgress: { current: 0, total: 0 },
                isPermissionRequired: false,
            });
        }
        catch (err) {
            console.error('Delete library failed:', err);
        }
    },
    resolveAudioFile: async (track) => {
        // 1. Check in-memory session cache first
        if (fileCache.has(track.id)) {
            return fileCache.get(track.id);
        }
        // 2. If not cached, resolve from FileSystemDirectoryHandle (requires permission)
        const folderId = track.id.split('_')[1];
        const { folders } = get();
        const folder = folders.find((f) => f.id === folderId);
        if (!folder || !folder.handle) {
            throw new Error('Audio file reference is unavailable. Please import or reselect the folder.');
        }
        // Query permission
        const status = await folder.handle.queryPermission({ mode: 'read' });
        if (status !== 'granted') {
            const grantStatus = await folder.handle.requestPermission({ mode: 'read' });
            if (grantStatus !== 'granted') {
                throw new Error('FileSystem read permission denied by user.');
            }
        }
        try {
            let currentDir = folder.handle;
            const parts = decodeURIComponent(track.filePath || '').split('/');
            // Traverse subdirectories
            for (let i = 0; i < parts.length - 1; i++) {
                currentDir = await currentDir.getDirectoryHandle(parts[i]);
            }
            // Get file handle
            const fileName = parts[parts.length - 1];
            const fileHandle = await currentDir.getFileHandle(fileName);
            const file = await fileHandle.getFile();
            // Cache it
            fileCache.set(track.id, file);
            return file;
        }
        catch (e) {
            console.error('Error resolving track file path:', e);
            throw new Error(`Local file not found on disk: ${track.filePath}`);
        }
    },
    saveTracksMetadata: async (trackIds, fields, newArtworkBlob, removeArtwork) => {
        try {
            const dbTracks = await db.getTracks();
            const previousTracks = [];
            const previousArtworks = new Map();
            for (const id of trackIds) {
                const dbTrack = dbTracks.find((t) => t.id === id);
                if (dbTrack) {
                    previousTracks.push({ ...dbTrack });
                    const art = await db.getArtwork(id);
                    previousArtworks.set(id, art);
                }
            }
            lastMetadataUpdate = {
                trackIds,
                previousTracks,
                previousArtworks,
            };
            const tracksToSave = [];
            for (const id of trackIds) {
                const dbTrack = dbTracks.find((t) => t.id === id);
                if (!dbTrack)
                    continue;
                const updated = { ...dbTrack };
                if (fields.artist !== undefined && fields.artist.trim() !== '')
                    updated.artist = fields.artist.trim();
                if (fields.album !== undefined && fields.album.trim() !== '')
                    updated.album = fields.album.trim();
                if (fields.genre !== undefined && fields.genre.trim() !== '')
                    updated.genre = fields.genre.trim();
                if (fields.year !== undefined)
                    updated.year = fields.year;
                if (fields.albumArtist !== undefined)
                    updated.albumArtist = fields.albumArtist.trim();
                if (trackIds.length === 1) {
                    if (fields.title !== undefined && fields.title.trim() !== '')
                        updated.title = fields.title.trim();
                    if (fields.trackNumber !== undefined)
                        updated.trackNumber = fields.trackNumber;
                    if (fields.discNumber !== undefined)
                        updated.discNumber = fields.discNumber;
                    if (fields.composer !== undefined)
                        updated.composer = fields.composer.trim();
                    if (fields.comment !== undefined)
                        updated.comment = fields.comment.trim();
                }
                tracksToSave.push(updated);
            }
            await db.saveTracks(tracksToSave);
            for (const id of trackIds) {
                if (removeArtwork) {
                    const database = await db.openDatabase();
                    await new Promise((resolve, reject) => {
                        const transaction = database.transaction('artwork', 'readwrite');
                        const store = transaction.objectStore('artwork');
                        const request = store.delete(id);
                        request.onsuccess = () => resolve();
                        request.onerror = () => reject(request.error);
                    });
                }
                else if (newArtworkBlob) {
                    await db.saveArtwork(id, newArtworkBlob);
                }
            }
            await get().loadSavedLibrary();
            // Sync active player details
            const playerStore = usePlayerStore.getState();
            if (playerStore.currentTrack && trackIds.includes(playerStore.currentTrack.id)) {
                const updatedTrack = get().localTracks.find((t) => t.id === playerStore.currentTrack.id);
                if (updatedTrack) {
                    usePlayerStore.setState({ currentTrack: updatedTrack });
                }
            }
            const queue = playerStore.queue;
            const updatedQueue = queue.map((t) => {
                if (trackIds.includes(t.id)) {
                    const updatedTrack = get().localTracks.find((lt) => lt.id === t.id);
                    return updatedTrack ? { ...updatedTrack } : t;
                }
                return t;
            });
            usePlayerStore.setState({ queue: updatedQueue });
        }
        catch (err) {
            console.error('Failed to save metadata updates:', err);
            throw err;
        }
    },
    performUndoMetadata: async () => {
        if (!lastMetadataUpdate)
            return;
        try {
            const { trackIds, previousTracks, previousArtworks } = lastMetadataUpdate;
            await db.saveTracks(previousTracks);
            for (const id of trackIds) {
                const prevArt = previousArtworks.get(id);
                if (prevArt) {
                    await db.saveArtwork(id, prevArt);
                }
                else {
                    const database = await db.openDatabase();
                    await new Promise((resolve, reject) => {
                        const transaction = database.transaction('artwork', 'readwrite');
                        const store = transaction.objectStore('artwork');
                        const request = store.delete(id);
                        request.onsuccess = () => resolve();
                        request.onerror = () => reject(request.error);
                    });
                }
            }
            lastMetadataUpdate = null;
            await get().loadSavedLibrary();
            const playerStore = usePlayerStore.getState();
            if (playerStore.currentTrack && trackIds.includes(playerStore.currentTrack.id)) {
                const updatedTrack = get().localTracks.find((t) => t.id === playerStore.currentTrack.id);
                if (updatedTrack) {
                    usePlayerStore.setState({ currentTrack: updatedTrack });
                }
            }
            const queue = playerStore.queue;
            const updatedQueue = queue.map((t) => {
                if (trackIds.includes(t.id)) {
                    const updatedTrack = get().localTracks.find((lt) => lt.id === t.id);
                    return updatedTrack ? { ...updatedTrack } : t;
                }
                return t;
            });
            usePlayerStore.setState({ queue: updatedQueue });
        }
        catch (err) {
            console.error('Failed to undo metadata updates:', err);
            throw err;
        }
    },
    saveTrackLyrics: async (trackId, lyrics) => {
        try {
            const dbTracks = await db.getTracks();
            const dbTrack = dbTracks.find((t) => t.id === trackId);
            if (!dbTrack)
                return;
            const updated = { ...dbTrack, lyrics: lyrics || undefined };
            await db.saveTracks([updated]);
            await get().loadSavedLibrary();
            // Update playerStore if playing
            const playerStore = usePlayerStore.getState();
            if (playerStore.currentTrack && playerStore.currentTrack.id === trackId) {
                const updatedTrack = get().localTracks.find((t) => t.id === trackId);
                if (updatedTrack) {
                    usePlayerStore.setState({ currentTrack: updatedTrack });
                }
            }
            const updatedQueue = playerStore.queue.map((t) => {
                if (t.id === trackId) {
                    const updatedTrack = get().localTracks.find((lt) => lt.id === trackId);
                    return updatedTrack ? { ...updatedTrack } : t;
                }
                return t;
            });
            usePlayerStore.setState({ queue: updatedQueue });
        }
        catch (err) {
            console.error('Failed to save track lyrics:', err);
            throw err;
        }
    },
}));
// ==========================================
// DYNAMIC COLLECTION GROUPING HELPERS
// ==========================================
function normalizeString(str) {
    if (!str)
        return '';
    return str
        .trim()
        .replace(/\s+/g, ' ')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
}
function sortTracks(a, b) {
    const discA = a.discNumber ?? 1;
    const discB = b.discNumber ?? 1;
    if (discA !== discB) {
        return discA - discB;
    }
    const hasA = a.trackNumber !== undefined && a.trackNumber !== null;
    const hasB = b.trackNumber !== undefined && b.trackNumber !== null;
    if (hasA && hasB) {
        if (a.trackNumber !== b.trackNumber) {
            return a.trackNumber - b.trackNumber;
        }
    }
    else if (hasA && !hasB) {
        return -1;
    }
    else if (!hasA && hasB) {
        return 1;
    }
    return (a.title || '').localeCompare(b.title || '');
}
function splitArtists(artistStr) {
    if (!artistStr)
        return [];
    const parts = artistStr.split(/(?:\s+(?:feat\.?|ft\.?|&)\s+)|[,;\/]/gi);
    return parts
        .map(p => p.trim())
        .filter(p => p.length > 0);
}
function splitGenres(genreStr) {
    if (!genreStr)
        return [];
    const parts = genreStr.split(/[,;\/]/gi);
    return parts
        .map(p => p.trim())
        .filter(p => p.length > 0);
}
function formatGenreName(name) {
    if (!name)
        return '';
    const cleaned = name.trim().replace(/\s+/g, ' ');
    return cleaned
        .split(' ')
        .map(word => {
        if (word.toLowerCase() === 'lo-fi')
            return 'Lo-Fi';
        if (word.toLowerCase() === 'hi-fi')
            return 'Hi-Fi';
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
        .join(' ');
}
function deriveCollections(tracks) {
    const albumMap = new Map();
    const artistMap = new Map();
    const DEFAULT_COVER = 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=400&auto=format&fit=crop&q=80';
    // 1. First Pass: Build Albums (grouped by album artist + album)
    for (const track of tracks) {
        const albumTitle = track.album?.trim() ? track.album.trim() : 'Unknown Album';
        const groupArtist = (track.albumArtist && track.albumArtist.trim() !== '') ? track.albumArtist.trim() : (track.artist || 'Unknown Artist').trim();
        const normAlbum = normalizeString(albumTitle);
        const normArtist = normalizeString(groupArtist);
        // Grouping key: NormArtist + NormAlbum
        const albumKey = `${normArtist}---${normAlbum}`;
        if (!albumMap.has(albumKey)) {
            albumMap.set(albumKey, {
                id: `local_album_${encodeURIComponent(normArtist)}_${encodeURIComponent(normAlbum)}`,
                title: albumTitle,
                artistId: `local_artist_${encodeURIComponent(normArtist)}`,
                artistName: groupArtist,
                artist: groupArtist,
                albumArtist: track.albumArtist || undefined,
                coverUrl: track.coverImage || DEFAULT_COVER,
                artwork: track.coverImage || DEFAULT_COVER,
                releaseYear: track.year || 0,
                year: track.year || 0,
                tracks: [],
                genre: track.genre || 'Unknown Genre',
            });
        }
        const alb = albumMap.get(albumKey);
        alb.tracks.push(track.id);
        // Update releaseYear if not set yet
        if (!alb.releaseYear && track.year) {
            alb.releaseYear = track.year;
            alb.year = track.year;
        }
        // Update genre if Unknown Genre
        if ((alb.genre === 'Unknown Genre' || !alb.genre) && track.genre && track.genre !== 'Unknown Genre') {
            alb.genre = track.genre;
        }
        // Update coverUrl if it's default cover but track has a custom one
        if ((alb.coverUrl === DEFAULT_COVER || !alb.coverUrl) && track.coverImage && track.coverImage !== DEFAULT_COVER) {
            alb.coverUrl = track.coverImage;
            alb.artwork = track.coverImage;
        }
    }
    const albums = Array.from(albumMap.values());
    // Sort tracks in each album and calculate totals
    for (const album of albums) {
        const albumTracksObjs = tracks.filter(t => album.tracks.includes(t.id));
        albumTracksObjs.sort(sortTracks);
        album.tracks = albumTracksObjs.map(t => t.id);
        album.totalTracks = albumTracksObjs.length;
        album.totalDuration = albumTracksObjs.reduce((acc, t) => acc + t.duration, 0);
        const discNumbers = albumTracksObjs.map(t => t.discNumber).filter((d) => d !== undefined && d !== null);
        album.discCount = discNumbers.length > 0 ? Math.max(...discNumbers) : 1;
    }
    // 2. Second Pass: Group all individual artists from tracks (splitting collaborations)
    for (const track of tracks) {
        const trackArtists = splitArtists(track.artist || 'Unknown Artist');
        const albumArtists = track.albumArtist ? splitArtists(track.albumArtist) : [];
        // Combine track artists and album artists to register this track under their profile
        const allTrackArtists = Array.from(new Set([...trackArtists, ...albumArtists]));
        for (const artName of allTrackArtists) {
            const normArt = normalizeString(artName);
            if (!artistMap.has(normArt)) {
                artistMap.set(normArt, {
                    id: `local_artist_${encodeURIComponent(normArt)}`,
                    name: artName,
                    genres: track.genre ? [track.genre] : [],
                    tracks: [],
                    albums: [],
                    singles: [],
                    appearsOn: [],
                    isVerified: false,
                });
            }
            else {
                const art = artistMap.get(normArt);
                if (track.genre && !art.genres.includes(track.genre)) {
                    art.genres.push(track.genre);
                }
            }
        }
    }
    // 3. Third Pass: Map albums, tracks, singles, appearsOn, and avatars back to each artist
    const artists = Array.from(artistMap.values()).map(art => {
        const normArt = normalizeString(art.name);
        // Track listing: tracks where this artist is in the split track artists or split album artists
        const artistTracks = tracks.filter(t => {
            const trackArts = splitArtists(t.artist || '').map(normalizeString);
            const albArts = t.albumArtist ? splitArtists(t.albumArtist).map(normalizeString) : [];
            return trackArts.includes(normArt) || albArts.includes(normArt);
        });
        // Album classification
        // Albums: albums where this artist is the main album artist
        const artistAlbums = albums.filter(al => {
            const albArt = (al.albumArtist || al.artistName || '').trim();
            const splitAlbArts = splitArtists(albArt).map(normalizeString);
            return splitAlbArts.includes(normArt);
        });
        // Appears On: albums where this artist appears in some track, but is NOT the main album artist
        const appearsOnAlbums = albums.filter(al => {
            const albArt = (al.albumArtist || al.artistName || '').trim();
            const splitAlbArts = splitArtists(albArt).map(normalizeString);
            if (splitAlbArts.includes(normArt))
                return false;
            // Check if this artist appears in any track on this album
            const albumTracks = tracks.filter(t => al.tracks.includes(t.id));
            return albumTracks.some(t => {
                const trackArts = splitArtists(t.artist || '').map(normalizeString);
                return trackArts.includes(normArt);
            });
        });
        // Singles: artist's main albums that have exactly 1 track AND either track title matches album title or album title is "Unknown Album"
        const singlesAlbums = artistAlbums.filter(al => {
            if (al.tracks.length !== 1)
                return false;
            const tId = al.tracks[0];
            const trackObj = tracks.find(t => t.id === tId);
            if (!trackObj)
                return false;
            const trackTitleNorm = normalizeString(trackObj.title || '');
            const albumTitleNorm = normalizeString(al.title || '');
            return albumTitleNorm === trackTitleNorm || albumTitleNorm === 'unknown album' || !al.title;
        });
        // Filter main albums to exclude singles
        const mainAlbumsFiltered = artistAlbums.filter(al => !singlesAlbums.some(s => s.id === al.id));
        // Dynamic Avatar Resolution priority:
        // 1. Explicit artist artwork (if we had it, we don't)
        // 2. Custom album cover of main albums (different from default cover)
        // 3. Custom track cover of artist's tracks
        // 4. Default fallback (undefined)
        const validAlbumCover = artistAlbums.find(al => al.coverUrl && al.coverUrl !== DEFAULT_COVER);
        const validTrackCover = artistTracks.find(t => t.coverImage && t.coverImage !== DEFAULT_COVER);
        const avatarUrl = validAlbumCover ? validAlbumCover.coverUrl : (validTrackCover ? validTrackCover.coverImage : undefined);
        return {
            ...art,
            tracks: artistTracks.map(t => t.id),
            albums: mainAlbumsFiltered.map(al => al.id),
            singles: singlesAlbums.map(al => al.id),
            appearsOn: appearsOnAlbums.map(al => al.id),
            avatarUrl,
        };
    });
    // 4. Fourth Pass: Group genres dynamically
    const genreMap = new Map();
    for (const track of tracks) {
        const trackGenres = splitGenres(track.genre || '');
        for (const genName of trackGenres) {
            const normGen = normalizeString(genName);
            if (normGen === '' || normGen === 'unknown genre')
                continue;
            const formattedName = formatGenreName(genName);
            if (!genreMap.has(normGen)) {
                genreMap.set(normGen, {
                    id: `local_genre_${encodeURIComponent(normGen)}`,
                    name: formattedName,
                    tracks: [],
                    albums: [],
                    artists: [],
                });
            }
            const gen = genreMap.get(normGen);
            if (!gen.tracks.includes(track.id)) {
                gen.tracks.push(track.id);
            }
        }
    }
    const genres = Array.from(genreMap.values());
    for (const gen of genres) {
        // Albums belonging to this genre
        const genreAlbums = albums.filter(al => al.tracks.some(tId => gen.tracks.includes(tId)));
        gen.albums = genreAlbums.map(al => al.id);
        // Artists associated with this genre
        const genreArtists = artists.filter(art => {
            const normArt = normalizeString(art.name);
            return tracks.some(t => {
                if (!gen.tracks.includes(t.id))
                    return false;
                const trackArts = splitArtists(t.artist || '').map(normalizeString);
                const albArts = t.albumArtist ? splitArtists(t.albumArtist).map(normalizeString) : [];
                return trackArts.includes(normArt) || albArts.includes(normArt);
            });
        });
        gen.artists = genreArtists.map(art => art.id);
    }
    return { albums, artists, genres };
}
//# sourceMappingURL=localLibraryStore.js.map