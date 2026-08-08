import { TrackLyrics } from '@chotify/types';

const DB_NAME = 'glorify-local-library';
const DB_VERSION = 1;

export interface SavedFolder {
  id: string;
  name: string;
  handle?: FileSystemDirectoryHandle;
}

export interface SavedTrack {
  id: string;
  title: string;
  artist: string;
  album?: string;
  genre?: string;
  duration: number;
  audioUrl?: string; // empty initially, generated as Blob URL on play
  coverImage?: string; // Unsplash fallback or ObjectURL generated from artwork Blob
  source: 'local';
  filePath: string;
  folderId: string;
  albumArtist?: string;
  year?: number;
  trackNumber?: number;
  discNumber?: number;
  composer?: string;
  comment?: string;
  lyrics?: string | TrackLyrics;
  createdAt?: string;
}

export function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains('folders')) {
        db.createObjectStore('folders', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('tracks')) {
        db.createObjectStore('tracks', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('artwork')) {
        db.createObjectStore('artwork', { keyPath: 'trackId' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveFolder(folder: SavedFolder): Promise<void> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('folders', 'readwrite');
    const store = transaction.objectStore('folders');
    const request = store.put(folder);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function getFolders(): Promise<SavedFolder[]> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('folders', 'readonly');
    const store = transaction.objectStore('folders');
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
}

export async function deleteFolder(id: string): Promise<void> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['folders', 'tracks'], 'readwrite');
    
    // Delete folder entry
    const folderStore = transaction.objectStore('folders');
    folderStore.delete(id);

    // Delete associated tracks
    const trackStore = transaction.objectStore('tracks');
    const request = trackStore.getAll();
    request.onsuccess = () => {
      const tracks = request.result || [];
      for (const track of tracks) {
        if (track.folderId === id) {
          trackStore.delete(track.id);
        }
      }
      resolve();
    };
    request.onerror = () => reject(request.error);
  });
}

export async function saveTracks(tracks: SavedTrack[]): Promise<void> {
  if (tracks.length === 0) return;
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('tracks', 'readwrite');
    const store = transaction.objectStore('tracks');
    for (const track of tracks) {
      store.put(track);
    }
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}

export async function getTracks(): Promise<SavedTrack[]> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('tracks', 'readonly');
    const store = transaction.objectStore('tracks');
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
}

export async function saveArtwork(trackId: string, blob: Blob): Promise<void> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('artwork', 'readwrite');
    const store = transaction.objectStore('artwork');
    const request = store.put({ trackId, blob });
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function getArtwork(trackId: string): Promise<Blob | null> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('artwork', 'readonly');
    const store = transaction.objectStore('artwork');
    const request = store.get(trackId);
    request.onsuccess = () => resolve(request.result ? request.result.blob : null);
    request.onerror = () => reject(request.error);
  });
}

export async function clearAllLocalData(): Promise<void> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['folders', 'tracks', 'artwork'], 'readwrite');
    transaction.objectStore('folders').clear();
    transaction.objectStore('tracks').clear();
    transaction.objectStore('artwork').clear();
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}
