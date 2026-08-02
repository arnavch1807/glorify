import { useEffect } from 'react';
import { usePlayerStore } from '../../store/playerStore.js';
export function PlayerKeyboardHandler() {
    const { togglePlay, skipNext, skipPrevious, toggleMute, currentTrack, toggleFavoriteTrack, setFullscreen, isFullscreen } = usePlayerStore();
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Ignore keystrokes inside input and select fields
            const target = e.target;
            if (target.tagName === 'INPUT' ||
                target.tagName === 'SELECT' ||
                target.tagName === 'TEXTAREA' ||
                target.isContentEditable) {
                return;
            }
            switch (e.key) {
                case ' ':
                    e.preventDefault();
                    togglePlay();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    skipNext();
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    skipPrevious();
                    break;
                case 'm':
                case 'M':
                    e.preventDefault();
                    toggleMute();
                    break;
                case 'l':
                case 'L':
                    if (currentTrack) {
                        e.preventDefault();
                        toggleFavoriteTrack(currentTrack.id);
                    }
                    break;
                case 'Escape':
                    if (isFullscreen) {
                        e.preventDefault();
                        setFullscreen(false);
                    }
                    break;
                default:
                    break;
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [togglePlay, skipNext, skipPrevious, toggleMute, currentTrack, toggleFavoriteTrack, isFullscreen, setFullscreen]);
    return null;
}
//# sourceMappingURL=PlayerKeyboardHandler.js.map