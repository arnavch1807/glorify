import { Track, Album, Artist, Playlist } from '@chotify/types';

// Mock Data Sets
const mockTracks: Track[] = [
  {
    id: 'sample_01',
    title: 'SoundHelix Song 1 (Lofi Remix)',
    artist: 'SoundHelix Composer',
    album: 'Helix Test Stems',
    genre: 'lofi',
    duration: 372,
    audioUrl: '/sample.mp3',
    isGenerated: true,
    prompt: 'Lofi piano keys with ambient record static clicks and warm sub-bass loops',
  },
  {
    id: 'sample_02',
    title: 'SoundHelix Song 2 (Ambient Drift)',
    artist: 'SoundHelix Composer',
    album: 'Helix Test Stems',
    genre: 'ambient',
    duration: 423,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    isGenerated: true,
    prompt: 'Washed out ambient pads, slow granular cloud textures',
  },
  {
    id: 'sample_03',
    title: 'SoundHelix Song 3 (Monochrome Loop)',
    artist: 'Aura Synthesizer',
    album: 'Aura Curations',
    genre: 'synthwave',
    duration: 302,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    isGenerated: true,
    prompt: 'Retrowave driving bassline, retro drum machine snaps',
  },
  {
    id: 'sample_04',
    title: 'SoundHelix Song 4 (Glitch Stems)',
    artist: 'Aura Synthesizer',
    album: 'Aura Curations',
    genre: 'glitch',
    duration: 302,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    isGenerated: true,
    prompt: 'Glitch hop synth stabs, fragmented percussions and bass skips',
  },
];

const mockArtists: Artist[] = [
  {
    id: 'artist_01',
    name: 'SoundHelix Composer',
    genres: ['lofi', 'ambient'],
    bio: 'An algorithmic composer generating complex melodic stems and lofi chill hooks.',
  },
  {
    id: 'artist_02',
    name: 'Aura Synthesizer',
    genres: ['synthwave', 'glitch'],
    bio: 'Exploring fragmented retro-futuristic soundscapes and driving retrowave tempos.',
  },
];

const mockAlbums: Album[] = [
  {
    id: 'album_01',
    title: 'Helix Test Stems',
    artistId: 'artist_01',
    artistName: 'SoundHelix Composer',
    releaseYear: 2026,
    tracks: ['sample_01', 'sample_02'],
    genre: 'lofi',
  },
  {
    id: 'album_02',
    title: 'Aura Curations',
    artistId: 'artist_02',
    artistName: 'Aura Synthesizer',
    releaseYear: 2026,
    tracks: ['sample_03', 'sample_04'],
    genre: 'synthwave',
  },
];

const mockPlaylists: Playlist[] = [
  {
    id: 'playlist_01',
    userId: 'user_dev',
    name: 'Lo-Fi Chill Focus Stems',
    description: 'Algorithmic focus loops for deep study sessions.',
    songs: ['sample_01', 'sample_02'],
    isPublic: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'playlist_02',
    userId: 'user_dev',
    name: 'Retrowave Synthesizers',
    description: 'Fast-paced driving basslines and retrowave filters.',
    songs: ['sample_03', 'sample_04'],
    isPublic: false,
    createdAt: new Date().toISOString(),
  },
];

// Repository Interface
export interface IMusicRepository {
  getTracks(): Promise<Track[]>;
  getAlbums(): Promise<Album[]>;
  getArtists(): Promise<Artist[]>;
  getPlaylists(): Promise<Playlist[]>;
  getArtistDetails(id: string): Promise<{ artist: Artist; tracks: Track[]; albums: Album[] } | null>;
  getAlbumDetails(id: string): Promise<{ album: Album; tracks: Track[] } | null>;
}

// Static Catalog Repository Implementation
export const StaticMusicRepository: IMusicRepository = {
  async getTracks() {
    return mockTracks;
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
  async getArtistDetails(id: string) {
    const artist = mockArtists.find((a) => a.id === id);
    if (!artist) return null;
    const tracks = mockTracks.filter((t) => t.artist === artist.name);
    const albums = mockAlbums.filter((al) => al.artistId === artist.id);
    return { artist, tracks, albums };
  },
  async getAlbumDetails(id: string) {
    const album = mockAlbums.find((al) => al.id === id);
    if (!album) return null;
    const tracks = mockTracks.filter((t) => album.tracks.includes(t.id));
    return { album, tracks };
  },
};
