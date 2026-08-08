import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useLocalLibraryStore } from '../../store/localLibraryStore.js';
import { useToastStore } from '../../store/toastStore.js';
import { parseLrc, validateLrc } from '../../utils/lrcParser.js';
import { X, HelpCircle, FileText, Clock } from 'lucide-react';
export function LyricsEditorModal({ trackId, onClose }) {
    const { localTracks, saveTrackLyrics } = useLocalLibraryStore();
    const track = localTracks.find((t) => t.id === trackId);
    const [editorMode, setEditorMode] = useState('plain');
    const [plainText, setPlainText] = useState('');
    const [syncedText, setSyncedText] = useState('');
    const [error, setError] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    useEffect(() => {
        if (track && track.lyrics) {
            const lyr = track.lyrics;
            if (typeof lyr === 'string') {
                setPlainText(lyr);
                setEditorMode('plain');
            }
            else {
                if (lyr.type === 'synced') {
                    setSyncedText(lyr.text || '');
                    setEditorMode('synced');
                    // Populate plain text fallback just in case
                    setPlainText(lyr.text || '');
                }
                else {
                    setPlainText(lyr.text || '');
                    setEditorMode('plain');
                }
            }
        }
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [track, onClose]);
    const handleSave = async () => {
        if (!track)
            return;
        setError(null);
        setIsSaving(true);
        try {
            if (editorMode === 'plain') {
                if (!plainText.trim()) {
                    // Clear lyrics if input is empty
                    await saveTrackLyrics(trackId, null);
                    useToastStore.getState().addToast('Lyrics cleared successfully', 'success');
                    onClose();
                    return;
                }
                await saveTrackLyrics(trackId, {
                    type: 'plain',
                    text: plainText,
                    source: 'manual',
                });
            }
            else {
                if (!syncedText.trim()) {
                    await saveTrackLyrics(trackId, null);
                    useToastStore.getState().addToast('Lyrics cleared successfully', 'success');
                    onClose();
                    return;
                }
                if (!validateLrc(syncedText)) {
                    setError('LRC lyrics must contain at least one valid timestamp line (e.g. [00:12.50]Line text)');
                    setIsSaving(false);
                    return;
                }
                const lines = parseLrc(syncedText);
                await saveTrackLyrics(trackId, {
                    type: 'synced',
                    lines,
                    text: syncedText,
                    source: 'manual',
                });
            }
            useToastStore.getState().addToast('Lyrics saved successfully', 'success');
            onClose();
        }
        catch (err) {
            console.error(err);
            setError('An error occurred while saving lyrics.');
        }
        finally {
            setIsSaving(false);
        }
    };
    if (!track)
        return null;
    return (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0b0b0a]/75 backdrop-blur-md select-none font-sans", children: _jsxs("div", { className: "relative bg-glorify-bg-surface border border-glorify-border-primary/10 rounded-3xl p-6 md:p-8 w-full max-w-2xl flex flex-col gap-5 shadow-2xl overflow-hidden max-h-[90vh]", onClick: (e) => e.stopPropagation(), children: [_jsxs("div", { className: "flex items-center justify-between border-b border-glorify-border-primary/5 pb-4", children: [_jsxs("div", { className: "flex flex-col text-left", children: [_jsx("h2", { className: "text-lg font-bold text-glorify-text-primary tracking-tight", children: "EDIT LYRICS" }), _jsxs("p", { className: "text-xs text-glorify-text-muted mt-0.5 font-normal", children: [track.title, " \u2022 ", track.artist] })] }), _jsx("button", { onClick: onClose, className: "p-2 rounded-full hover:bg-glorify-bg-secondary text-glorify-text-muted hover:text-glorify-text-primary transition-all cursor-pointer outline-none", children: _jsx(X, { className: "w-5 h-5" }) })] }), _jsxs("div", { className: "flex items-center justify-center bg-glorify-bg-secondary/65 border border-glorify-border-primary/5 p-1 rounded-xl w-fit self-center", children: [_jsxs("button", { onClick: () => setEditorMode('plain'), className: `flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer outline-none ${editorMode === 'plain'
                                ? 'bg-glorify-bg-surface text-glorify-text-primary shadow-sm'
                                : 'text-glorify-text-muted hover:text-glorify-text-primary'}`, children: [_jsx(FileText, { className: "w-3.5 h-3.5" }), "Plain Text"] }), _jsxs("button", { onClick: () => setEditorMode('synced'), className: `flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer outline-none ${editorMode === 'synced'
                                ? 'bg-glorify-bg-surface text-glorify-text-primary shadow-sm'
                                : 'text-glorify-text-muted hover:text-glorify-text-primary'}`, children: [_jsx(Clock, { className: "w-3.5 h-3.5" }), "Synchronized (LRC)"] })] }), editorMode === 'plain' ? (_jsxs("div", { className: "flex flex-col gap-2", children: [_jsx("label", { className: "text-[10px] font-bold text-glorify-text-secondary tracking-widest uppercase text-left", children: "Paste or type plain lyrics text" }), _jsx("textarea", { value: plainText, onChange: (e) => setPlainText(e.target.value), placeholder: "Enter lyrics lines...", rows: 12, className: "w-full px-4 py-3 bg-glorify-bg-secondary/40 border border-glorify-border-primary/10 rounded-2xl text-sm text-glorify-text-primary focus:border-glorify-accent outline-none transition-all font-medium resize-none focus:ring-1 focus:ring-glorify-accent" })] })) : (
                /* Synced LRC Mode */
                _jsxs("div", { className: "flex flex-col gap-2", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("label", { className: "text-[10px] font-bold text-glorify-text-secondary tracking-widest uppercase text-left", children: "Enter synced LRC timestamped lyrics" }), _jsxs("div", { className: "group relative flex items-center text-glorify-accent cursor-help", children: [_jsx(HelpCircle, { className: "w-3.5 h-3.5" }), _jsxs("span", { className: "absolute bottom-6 right-0 scale-0 group-hover:scale-100 bg-glorify-bg-surface border border-glorify-border-primary/15 p-3 rounded-lg text-[10px] font-semibold text-glorify-text-primary w-52 text-left leading-normal shadow-lg transition-all z-10", children: ["Format example:", _jsx("br", {}), _jsxs("code", { className: "text-glorify-aura-gold font-mono block mt-1", children: ["[00:12.50]First line", _jsx("br", {}), "[00:16.80]Second line"] })] })] })] }), _jsx("textarea", { value: syncedText, onChange: (e) => setSyncedText(e.target.value), placeholder: "[00:04.50]Intro Instrumental\r[00:12.80]First lyric line...", rows: 12, className: "w-full px-4 py-3 bg-glorify-bg-secondary/40 border border-glorify-border-primary/10 rounded-2xl text-sm text-glorify-text-primary focus:border-glorify-accent outline-none transition-all font-mono resize-none focus:ring-1 focus:ring-glorify-accent" })] })), error && (_jsx("div", { className: "px-4 py-2.5 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold rounded-xl text-left", children: error })), _jsxs("div", { className: "flex items-center justify-end gap-3 border-t border-glorify-border-primary/5 pt-4", children: [_jsx("span", { className: "text-[10px] text-glorify-text-muted mr-auto font-normal text-left max-w-sm", children: "Saved locally in browser IndexedDB database. Writing metadata directly to the original file is unavailable." }), _jsx("button", { onClick: onClose, className: "px-5 py-2.5 bg-glorify-bg-secondary hover:bg-glorify-bg-secondary/80 text-glorify-text-primary rounded-full text-xs font-bold cursor-pointer transition-all", children: "Cancel" }), _jsx("button", { onClick: handleSave, disabled: isSaving, className: "px-5 py-2.5 bg-glorify-accent text-glorify-carbon-950 hover:scale-105 active:scale-95 rounded-full text-xs font-bold cursor-pointer transition-all shadow", children: isSaving ? 'Saving...' : 'Save Lyrics' })] })] }) }));
}
//# sourceMappingURL=LyricsEditorModal.js.map