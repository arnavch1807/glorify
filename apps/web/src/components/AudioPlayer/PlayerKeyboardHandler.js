import { useKeyPress } from '@chotify/hooks';
import { usePlayerStore } from '../../store/playerStore.js';
export function PlayerKeyboardHandler() {
    const { togglePlay, seek, currentTime, duration, volume, setVolume, toggleMute, } = usePlayerStore();
    useKeyPress(' ', () => {
        togglePlay();
    });
    useKeyPress('ArrowLeft', () => {
        seek(Math.max(0, currentTime - 5));
    });
    useKeyPress('ArrowRight', () => {
        seek(Math.min(duration, currentTime + 5));
    });
    useKeyPress('ArrowUp', () => {
        setVolume(Math.min(1, volume + 0.1));
    });
    useKeyPress('ArrowDown', () => {
        setVolume(Math.max(0, volume - 0.1));
    });
    useKeyPress('m', () => {
        toggleMute();
    });
    useKeyPress('M', () => {
        toggleMute();
    });
    return null;
}
//# sourceMappingURL=PlayerKeyboardHandler.js.map