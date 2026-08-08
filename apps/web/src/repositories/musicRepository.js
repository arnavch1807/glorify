import { apiClient } from '../utils/apiClient.js';
// Mock Data Sets
const mockTracks = [
    {
        id: 'sample_01',
        title: 'SoundHelix Song 1 (Lofi Remix)',
        artist: 'SoundHelix Composer',
        album: 'Helix Test Stems',
        genre: 'lofi',
        duration: 372,
        audioUrl: '/sample.mp3',
        coverImage: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=400&auto=format&fit=crop&q=80',
        isGenerated: true,
        prompt: 'Lofi piano keys with ambient record static clicks and warm sub-bass loops',
        bpm: 72,
        keySignature: 'A Min',
    },
    {
        id: 'sample_02',
        title: 'SoundHelix Song 2 (Ambient Drift)',
        artist: 'SoundHelix Composer',
        album: 'Helix Test Stems',
        genre: 'ambient',
        duration: 423,
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
        coverImage: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=400&auto=format&fit=crop&q=80',
        isGenerated: true,
        prompt: 'Washed out ambient pads, slow granular cloud textures',
        bpm: 65,
        keySignature: 'D Maj',
    },
    {
        id: 'sample_03',
        title: 'SoundHelix Song 3 (Monochrome Loop)',
        artist: 'Aura Synthesizer',
        album: 'Aura Curations',
        genre: 'synthwave',
        duration: 302,
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
        coverImage: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&auto=format&fit=crop&q=80',
        isGenerated: true,
        prompt: 'Retrowave driving bassline, retro drum machine snaps',
        bpm: 115,
        keySignature: 'F# Min',
    },
    {
        id: 'sample_04',
        title: 'SoundHelix Song 4 (Glitch Stems)',
        artist: 'Aura Synthesizer',
        album: 'Aura Curations',
        genre: 'glitch',
        duration: 302,
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
        coverImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&auto=format&fit=crop&q=80',
        isGenerated: true,
        prompt: 'Glitch hop synth stabs, fragmented percussions and bass skips',
        bpm: 140,
        keySignature: 'G Maj',
    },
];
const mockArtists = [
    {
        id: 'artist_01',
        name: 'SoundHelix Composer',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
        genres: ['lofi', 'ambient'],
        bio: 'An algorithmic composer generating complex melodic stems and lofi chill hooks.',
    },
    {
        id: 'artist_02',
        name: 'Aura Synthesizer',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
        genres: ['synthwave', 'glitch'],
        bio: 'Exploring fragmented retro-futuristic soundscapes and driving retrowave tempos.',
    },
];
const mockAlbums = [
    {
        id: 'album_01',
        title: 'Helix Test Stems',
        artistId: 'artist_01',
        artistName: 'SoundHelix Composer',
        coverUrl: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=500&auto=format&fit=crop&q=80',
        releaseYear: 2026,
        tracks: ['sample_01', 'sample_02'],
        genre: 'lofi',
    },
    {
        id: 'album_02',
        title: 'Aura Curations',
        artistId: 'artist_02',
        artistName: 'Aura Synthesizer',
        coverUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=500&auto=format&fit=crop&q=80',
        releaseYear: 2026,
        tracks: ['sample_03', 'sample_04'],
        genre: 'synthwave',
    },
];
const mockPlaylists = [
    {
        id: 'playlist_01',
        userId: 'user_dev',
        name: 'Lo-Fi Chill Focus Stems',
        description: 'Algorithmic focus loops for deep study sessions.',
        coverImage: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop&q=80',
        songs: ['sample_01', 'sample_02'],
        isPublic: true,
        createdAt: new Date().toISOString(),
    },
    {
        id: 'playlist_02',
        userId: 'user_dev',
        name: 'Retrowave Synthesizers',
        description: 'Fast-paced driving basslines and retrowave filters.',
        coverImage: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=500&auto=format&fit=crop&q=80',
        songs: ['sample_03', 'sample_04'],
        isPublic: false,
        createdAt: new Date().toISOString(),
    },
];
// Static Catalog Repository Implementation
export const StaticMusicRepository = {
    async getTracks() {
        try {
            const response = await apiClient.get('/api/v1/songs');
            if (response.data && response.data.success && Array.isArray(response.data.data)) {
                return response.data.data;
            }
            return mockTracks;
        }
        catch (err) {
            console.warn('Failed to fetch songs from backend database, using static fallback:', err);
            return mockTracks;
        }
    },
    async getAlbums() {
        return mockAlbums;
    },
    async getArtists() {
        return mockArtists;
    },
    async getPlaylists() {
        return mockPlaylists;
    },
    async getArtistDetails(id) {
        const artist = mockArtists.find((a) => a.id === id);
        if (!artist)
            return null;
        const tracks = mockTracks.filter((t) => t.artist === artist.name);
        const albums = mockAlbums.filter((al) => al.artistId === artist.id);
        return { artist, tracks, albums };
    },
    async getAlbumDetails(id) {
        const album = mockAlbums.find((al) => al.id === id);
        if (!album)
            return null;
        const tracks = mockTracks.filter((t) => album.tracks.includes(t.id));
        return { album, tracks };
    },
};
//# sourceMappingURL=musicRepository.js.map