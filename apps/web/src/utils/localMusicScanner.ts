import { parseBlob } from 'music-metadata';

export interface ExtractedMetadata {
  title: string;
  artist: string;
  album: string;
  genre: string;
  duration: number;
  artworkBlob: Blob | null;
  year?: number;
  trackNumber?: number;
  discNumber?: number;
  albumArtist?: string;
  composer?: string;
  comment?: string;
  embeddedLyrics?: string;
}

export async function scanDirectoryHandle(
  dirHandle: FileSystemDirectoryHandle,
  onFileFound: (file: File, relativePath: string, fileHandle: FileSystemFileHandle) => Promise<void>
): Promise<void> {
  async function recurse(currentDir: FileSystemDirectoryHandle, pathPrefix: string) {
    for await (const entry of (currentDir as any).values()) {
      const relativePath = pathPrefix ? `${pathPrefix}/${entry.name}` : entry.name;
      if (entry.kind === 'file') {
        const ext = entry.name.split('.').pop()?.toLowerCase();
        if (ext && ['mp3', 'wav', 'flac', 'm4a', 'aac', 'ogg', 'opus', 'lrc', 'txt'].includes(ext)) {
          try {
            const file = await entry.getFile();
            await onFileFound(file, relativePath, entry);
          } catch (err) {
            console.error(`Error reading file ${relativePath}:`, err);
          }
        }
      } else if (entry.kind === 'directory') {
        await recurse(entry, relativePath);
      }
    }
  }
  await recurse(dirHandle, '');
}

export async function scanFileList(
  files: FileList | File[],
  onFileFound: (file: File, relativePath: string) => Promise<void>
): Promise<void> {
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const relativePath = file.webkitRelativePath || file.name;
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext && ['mp3', 'wav', 'flac', 'm4a', 'aac', 'ogg', 'opus', 'lrc', 'txt'].includes(ext)) {
      await onFileFound(file, relativePath);
    }
  }
}

export async function parseMetadata(file: File): Promise<ExtractedMetadata> {
  try {
    const metadata = await parseBlob(file);
    const common = metadata.common;
    const format = metadata.format;

    let artworkBlob: Blob | null = null;
    if (common.picture && common.picture.length > 0) {
      const pic = common.picture[0];
      artworkBlob = new Blob([pic.data as any], { type: pic.format });
    }

    let rawLyrics = common.lyrics;
    if (!rawLyrics && (common as any).unsyncedlyrics) rawLyrics = (common as any).unsyncedlyrics;
    if (!rawLyrics && (common as any).USLT) rawLyrics = (common as any).USLT;
    if (!rawLyrics && (common as any).lyrics) rawLyrics = (common as any).lyrics;
    
    let embeddedLyrics: string | undefined = undefined;
    if (rawLyrics && rawLyrics.length > 0) {
      const first = rawLyrics[0];
      embeddedLyrics = typeof first === 'string' ? first : (first as any).text || (first as any).lyrics || (first as any).value;
    }

    return {
      title: common.title || file.name.replace(/\.[^/.]+$/, ''),
      artist: common.artist || 'Unknown Artist',
      album: common.album || 'Unknown Album',
      genre: common.genre && common.genre.length > 0 ? common.genre[0] : 'Unknown Genre',
      duration: Math.round(format.duration || 0),
      artworkBlob,
      year: common.year,
      trackNumber: common.track?.no || undefined,
      discNumber: common.disk?.no || undefined,
      albumArtist: common.albumartist || undefined,
      composer: common.composer && common.composer.length > 0 ? common.composer[0] : undefined,
      comment: common.comment && common.comment.length > 0 
        ? (typeof common.comment[0] === 'string' ? common.comment[0] : (common.comment[0] as any).text) 
        : undefined,
      embeddedLyrics,
    };
  } catch (err) {
    console.warn(`Failed to parse metadata for ${file.name}, using fallback:`, err);
    return {
      title: file.name.replace(/\.[^/.]+$/, ''),
      artist: 'Unknown Artist',
      album: 'Unknown Album',
      genre: 'Unknown Genre',
      duration: 0,
      artworkBlob: null,
    };
  }
}
