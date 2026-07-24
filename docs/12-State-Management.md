# Chotify State Management Architecture
**Version:** 1.0.0  
**Status:** Frontend State Blueprint  
**Target Stack:** Zustand (Global) + TanStack Query (Server) + React Local + IndexedDB (Offline)  

---

## 1. State Boundaries & Ownership
We separate state into four isolated boundaries to prevent redundant renders and ensure performance during audio streaming:

```
┌────────────────────────────────────────────────────────┐
│ UI / Local State (React hook state)                    │
│ - Drawer expansions, prompt inputs, tooltips           │
└───────────┬────────────────────────────────────────────┘
            │
┌───────────▼────────────────────────────────────────────┐
│ Server State (TanStack Query cache)                    │
│ - Songs catalog, user libraries, playlist tracks       │
└───────────┬────────────────────────────────────────────┘
            │
┌───────────▼────────────────────────────────────────────┐
│ Global Client State (Zustand store)                    │
│ - Playback queue, volume dials, active tracks          │
└───────────┬────────────────────────────────────────────┘
            │
┌───────────▼────────────────────────────────────────────┐
│ Offline & Persistent State (IndexedDB & LocalStorage)  │
│ - Cached audio binary blobs, theme settings            │
└────────────────────────────────────────────────────────┘
```

---

## 2. Store Specifications

### Global Client State (Zustand)
Manages fast-updating values. Retains playback timeline updates and volume parameters.
*   **Player Store (`usePlayerStore`):**
    *   *State:* `currentTrack` (Track | null), `isPlaying` (Boolean), `queue` (Track[]), `volume` (Number), `playbackPosition` (Number).
    *   *Actions:* `playTrack(track)`, `pause()`, `setVolume(value)`, `addToQueue(track)`, `reorderQueue(indexSrc, indexDest)`.
*   **Persistence:** The `volume` value is persisted to `localStorage` via the Zustand persist middleware.

### Server State (TanStack Query)
Coordinates caching and synchronization with the remote backend databases.
*   **Catalog Queries:**
    *   `useQuery(["songs", songId])` - Fetches track metadata. `staleTime` set to `60000ms` (1 minute).
    *   `useQuery(["playlists", playlistId])` - Fetches user playlists.
*   **Mutations:**
    *   `useMutation(postPlaylist)` - Creates a playlist and invalidates `["playlists"]` query keys on success.

### UI & Local State (React `useState`)
Confined strictly to individual components.
*   *Examples:* Prompt text inputs in the AI Composer console, active input focus states, expanded setting drawers.

---

## 3. Offline Caching, Hydration & Sync

*   **Hydration:** On application boot, Zustand persistence middleware reads settings (volume, theme) from `localStorage` and loads them into memory.
*   **Audio Blob Storage (IndexedDB):** Audio files are cached offline as binary blobs in the browser's IndexedDB. The global player check routes track requests to local blobs if network states are marked `Offline`.
*   **Synchronization:** Upon reconnecting to the network, cached local edits (e.g. offline playlist additions) are sent to the backend proxy queue via a synchronization pipeline.
