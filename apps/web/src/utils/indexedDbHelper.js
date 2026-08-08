const DB_NAME = 'glorify-local-library';
const DB_VERSION = 1;
export function openDatabase() {
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
export async function saveFolder(folder) {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction('folders', 'readwrite');
        const store = transaction.objectStore('folders');
        const request = store.put(folder);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}
export async function getFolders() {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction('folders', 'readonly');
        const store = transaction.objectStore('folders');
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => reject(request.error);
    });
}
export async function deleteFolder(id) {
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
export async function saveTracks(tracks) {
    if (tracks.length === 0)
        return;
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
export async function getTracks() {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction('tracks', 'readonly');
        const store = transaction.objectStore('tracks');
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => reject(request.error);
    });
}
export async function saveArtwork(trackId, blob) {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction('artwork', 'readwrite');
        const store = transaction.objectStore('artwork');
        const request = store.put({ trackId, blob });
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}
export async function getArtwork(trackId) {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction('artwork', 'readonly');
        const store = transaction.objectStore('artwork');
        const request = store.get(trackId);
        request.onsuccess = () => resolve(request.result ? request.result.blob : null);
        request.onerror = () => reject(request.error);
    });
}
export async function clearAllLocalData() {
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
//# sourceMappingURL=indexedDbHelper.js.map