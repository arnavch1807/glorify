import { parseBlob } from 'music-metadata';
export async function scanDirectoryHandle(dirHandle, onFileFound) {
    async function recurse(currentDir, pathPrefix) {
        for await (const entry of currentDir.values()) {
            const relativePath = pathPrefix ? `${pathPrefix}/${entry.name}` : entry.name;
            if (entry.kind === 'file') {
                const ext = entry.name.split('.').pop()?.toLowerCase();
                if (ext && ['mp3', 'wav', 'flac', 'm4a', 'aac', 'ogg', 'opus', 'lrc', 'txt'].includes(ext)) {
                    try {
                        const file = await entry.getFile();
                        await onFileFound(file, relativePath, entry);
                    }
                    catch (err) {
                        console.error(`Error reading file ${relativePath}:`, err);
                    }
                }
            }
            else if (entry.kind === 'directory') {
                await recurse(entry, relativePath);
            }
        }
    }
    await recurse(dirHandle, '');
}
export async function scanFileList(files, onFileFound) {
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const relativePath = file.webkitRelativePath || file.name;
        const ext = file.name.split('.').pop()?.toLowerCase();
        if (ext && ['mp3', 'wav', 'flac', 'm4a', 'aac', 'ogg', 'opus', 'lrc', 'txt'].includes(ext)) {
            await onFileFound(file, relativePath);
        }
    }
}
export async function parseMetadata(file) {
    try {
        const metadata = await parseBlob(file);
        const common = metadata.common;
        const format = metadata.format;
        let artworkBlob = null;
        if (common.picture && common.picture.length > 0) {
            const pic = common.picture[0];
            artworkBlob = new Blob([pic.data], { type: pic.format });
        }
        let rawLyrics = common.lyrics;
        if (!rawLyrics && common.unsyncedlyrics)
            rawLyrics = common.unsyncedlyrics;
        if (!rawLyrics && common.USLT)
            rawLyrics = common.USLT;
        if (!rawLyrics && common.lyrics)
            rawLyrics = common.lyrics;
        let embeddedLyrics = undefined;
        if (rawLyrics && rawLyrics.length > 0) {
            const first = rawLyrics[0];
            embeddedLyrics = typeof first === 'string' ? first : first.text || first.lyrics || first.value;
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
                ? (typeof common.comment[0] === 'string' ? common.comment[0] : common.comment[0].text)
                : undefined,
            embeddedLyrics,
        };
    }
    catch (err) {
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
//# sourceMappingURL=localMusicScanner.js.map