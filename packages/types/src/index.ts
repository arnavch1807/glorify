export interface User {
  id: string;
  username: string;
  email: string;
  theme: 'sand' | 'carbon';
}

export interface TrackLyrics {
  type: 'plain' | 'synced';
  text?: string;
  lines?: {
    time: number; // in milliseconds
    text: string;
  }[];
  source?: 'embedded' | 'local' | 'cloud' | 'manual';
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  album?: string;
  genre?: string;
  duration: number;
  coverImage?: string;
  audioUrl: string;
  lyrics?: string | TrackLyrics;
  isGenerated: boolean;
  prompt?: string;
  createdBy?: string;
  createdAt?: string;
  source?: 'local' | 'catalog';
  filePath?: string;
  fileHandle?: FileSystemFileHandle;
  albumArtist?: string;
  year?: number;
  trackNumber?: number;
  discNumber?: number;
  composer?: string;
  comment?: string;
  bpm?: number;
  keySignature?: string;
}

export interface Playlist {
  id: string;
  userId: string;
  name: string;
  description?: string;
  coverImage?: string;
  songs: string[];
  isPublic: boolean;
  createdAt: string;
}

export interface APIKeyRecord {
  id: string;
  userId: string;
  provider: 'suno' | 'udio' | 'openai' | 'gemini';
  encryptedKey: string;
  status: 'active' | 'invalid';
  createdAt: string;
}

export interface Artist {
  id: string;
  name: string;
  avatarUrl?: string;
  bio?: string;
  genres: string[];
  tracks?: string[];
  albums?: string[];
  followersCount?: number;
  isVerified?: boolean;
  singles?: string[];
  appearsOn?: string[];
}

export interface Album {
  id: string;
  title: string;
  artistId: string;
  artistName: string;
  artist?: string;
  albumArtist?: string;
  coverUrl?: string;
  artwork?: string;
  releaseYear: number;
  year?: number;
  tracks: string[]; // Track IDs
  genre: string;
  totalTracks?: number;
  totalDuration?: number;
  discCount?: number;
}

export interface PlaybackSource {
  id: string;
  type: 'stream' | 'local_file' | 'synth';
  quality: 'standard' | 'high' | 'lossless';
  bitrate: number;
}

export interface AudioQuality {
  codec: 'mp3' | 'aac' | 'flac';
  bitrate: number;
  sampleRate: number;
}

export interface TrackMetadata {
  bpm?: number;
  keySignature?: string;
  scale?: string;
  seed?: number;
}

export type Genre = string;

export interface GenreCollection {
  id: string;
  name: string;
  tracks: string[];
  albums: string[];
  artists: string[];
}

export interface QueueItem {
  id: string;
  track: Track;
  addedAt: string;
}

export interface Lyrics {
  trackId: string;
  lines: Array<{ time: number; text: string }>;
}

export interface Artwork {
  url: string;
  width: number;
  height: number;
}

export interface SmartCollection {
  id: string;
  name: string;
  description: string;
  type: string;
  artwork?: string;
  tracks: string[]; // Track IDs
  count: number;
}
