/**
 * Parses an LRC synchronized lyrics string into an array of LyricLine objects.
 * Supports multiple timestamps on the same line (e.g. [00:10.00][00:20.00]Hello).
 * Safely ignores metadata headers and malformed lines.
 */
export function parseLrc(lrcText) {
    const lines = lrcText.split(/\r?\n/);
    const result = [];
    // Regex to match one or more [mm:ss.xx] or [mm:ss:xx] or [mm:ss] timestamps
    const timeRegex = /\[(\d+):(\d+)(?:[.:](\d+))?\]/g;
    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed)
            continue;
        const matches = [];
        let match;
        // Reset regex match index for safety
        timeRegex.lastIndex = 0;
        while ((match = timeRegex.exec(trimmed)) !== null) {
            const min = parseInt(match[1], 10);
            const sec = parseInt(match[2], 10);
            let ms = 0;
            if (match[3]) {
                const msStr = match[3];
                if (msStr.length === 2) {
                    ms = parseInt(msStr, 10) * 10;
                }
                else if (msStr.length === 3) {
                    ms = parseInt(msStr, 10);
                }
                else if (msStr.length === 1) {
                    ms = parseInt(msStr, 10) * 100;
                }
            }
            const timeMs = min * 60 * 1000 + sec * 1000 + ms;
            matches.push({ time: timeMs });
        }
        if (matches.length > 0) {
            // Extract text after removing all bracketed timestamp prefix matches
            const text = trimmed.replace(/\[\d+:\d+(?:[.:]\d+)?\]/g, '').trim();
            for (const m of matches) {
                result.push({ time: m.time, text });
            }
        }
    }
    // Sort lines chronologically
    return result.sort((a, b) => a.time - b.time);
}
/**
 * Validates whether an LRC string has at least one valid timestamped line.
 */
export function validateLrc(lrcText) {
    const lines = lrcText.split(/\r?\n/);
    const timeRegex = /\[\d+:\d+(?:[.:]\d+)?\]/;
    for (const line of lines) {
        if (timeRegex.test(line)) {
            return true;
        }
    }
    return false;
}
//# sourceMappingURL=lrcParser.js.map