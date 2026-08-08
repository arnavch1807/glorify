import { jsxs as _jsxs, jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect, useRef } from 'react';
import { useLocalLibraryStore } from '../../store/localLibraryStore.js';
import { useToastStore } from '../../store/toastStore.js';
import { X, Image as ImageIcon, Trash2, HelpCircle } from 'lucide-react';
import { LyricsEditorModal } from './LyricsEditorModal.js';
export function MetadataEditorModal({ mode, trackIds, albumId, onClose }) {
    const { localTracks, localAlbums, saveTracksMetadata, performUndoMetadata } = useLocalLibraryStore();
    // Form fields state
    const [title, setTitle] = useState('');
    const [artist, setArtist] = useState('');
    const [album, setAlbum] = useState('');
    const [albumArtist, setAlbumArtist] = useState('');
    const [genre, setGenre] = useState('');
    const [year, setYear] = useState('');
    const [trackNumber, setTrackNumber] = useState('');
    const [discNumber, setDiscNumber] = useState('');
    const [composer, setComposer] = useState('');
    const [comment, setComment] = useState('');
    // Artwork fields state
    const [coverUrl, setCoverUrl] = useState(null);
    const [newArtworkBlob, setNewArtworkBlob] = useState(null);
    const [removeArtwork, setRemoveArtwork] = useState(false);
    // UI state
    const [errors, setErrors] = useState({});
    const [isSaving, setIsSaving] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [showLyricsEdit, setShowLyricsEdit] = useState(false);
    const fileInputRef = useRef(null);
    useEffect(() => {
        if (mode === 'single' && trackIds.length > 0) {
            const track = localTracks.find((t) => t.id === trackIds[0]);
            if (track) {
                setTitle(track.title || '');
                setArtist(track.artist || '');
                setAlbum(track.album || '');
                setAlbumArtist(track.albumArtist || '');
                setGenre(track.genre || '');
                setYear(track.year ? String(track.year) : '');
                setTrackNumber(track.trackNumber ? String(track.trackNumber) : '');
                setDiscNumber(track.discNumber ? String(track.discNumber) : '');
                setComposer(track.composer || '');
                setComment(track.comment || '');
                setCoverUrl(track.coverImage || null);
            }
        }
        else if (mode === 'album' && albumId) {
            const alb = localAlbums.find((a) => a.id === albumId);
            if (alb) {
                setAlbum(alb.title || '');
                setAlbumArtist(alb.artistName || '');
                setGenre(alb.genre || '');
                setCoverUrl(alb.coverUrl || null);
                // Fetch year from first track if available
                const firstTrack = localTracks.find((t) => alb.tracks.includes(t.id));
                if (firstTrack && firstTrack.year) {
                    setYear(String(firstTrack.year));
                }
            }
        }
        // Keyboard listener for Escape key
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [mode, trackIds, albumId, localTracks, localAlbums, onClose]);
    const handleArtworkChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            if (!['image/png', 'image/jpeg', 'image/jpg', 'image/webp'].includes(file.type)) {
                setErrors((prev) => ({ ...prev, artwork: 'Supported formats: PNG, JPG, JPEG, WEBP' }));
                return;
            }
            setErrors((prev) => ({ ...prev, artwork: '' }));
            setNewArtworkBlob(file);
            setRemoveArtwork(false);
            setCoverUrl(URL.createObjectURL(file));
        }
    };
    const handleRemoveArtwork = () => {
        setNewArtworkBlob(null);
        setRemoveArtwork(true);
        setCoverUrl(null);
    };
    const validate = () => {
        const newErrors = {};
        if (mode === 'single' && !title.trim()) {
            newErrors.title = 'Title is required';
        }
        if (year.trim()) {
            const yearNum = Number(year);
            if (isNaN(yearNum) || !Number.isInteger(yearNum) || yearNum < 1000 || yearNum > 3000) {
                newErrors.year = 'Enter a valid year (1000 - 3000)';
            }
        }
        if (trackNumber.trim()) {
            const trackNum = Number(trackNumber);
            if (isNaN(trackNum) || !Number.isInteger(trackNum) || trackNum <= 0) {
                newErrors.trackNumber = 'Must be a positive integer';
            }
        }
        if (discNumber.trim()) {
            const discNum = Number(discNumber);
            if (isNaN(discNum) || !Number.isInteger(discNum) || discNum <= 0) {
                newErrors.discNumber = 'Must be a positive integer';
            }
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const handleSave = async () => {
        if (!validate())
            return;
        // Check if bulk confirmation is needed
        if (!showConfirm && (mode === 'bulk' || mode === 'album')) {
            setShowConfirm(true);
            return;
        }
        setIsSaving(true);
        try {
            const fields = {};
            if (mode === 'single') {
                fields.title = title;
                fields.trackNumber = trackNumber.trim() ? Number(trackNumber) : null;
                fields.discNumber = discNumber.trim() ? Number(discNumber) : null;
                fields.composer = composer;
                fields.comment = comment;
            }
            // Fields common to all modes
            if (mode === 'single' || artist.trim())
                fields.artist = artist;
            if (mode === 'single' || album.trim())
                fields.album = album;
            if (mode === 'single' || genre.trim())
                fields.genre = genre;
            if (mode === 'single' || albumArtist.trim())
                fields.albumArtist = albumArtist;
            if (year.trim()) {
                fields.year = Number(year);
            }
            else if (mode === 'single') {
                fields.year = null;
            }
            await saveTracksMetadata(trackIds, fields, newArtworkBlob, removeArtwork);
            // Show success toast with Undo action
            useToastStore.getState().addToast(mode === 'single'
                ? 'Metadata updated successfully'
                : `Metadata updated for ${trackIds.length} tracks`, 'success', {
                label: 'Undo',
                onClick: () => {
                    performUndoMetadata()
                        .then(() => useToastStore.getState().addToast('Metadata changes reverted', 'info'))
                        .catch(() => useToastStore.getState().addToast('Failed to revert metadata', 'error'));
                },
            });
            onClose();
        }
        catch (e) {
            console.error(e);
            useToastStore.getState().addToast('Failed to save metadata', 'error');
        }
        finally {
            setIsSaving(false);
        }
    };
    return (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0b0b0a]/75 backdrop-blur-md select-none font-sans overflow-y-auto", children: _jsxs("div", { className: "relative bg-glorify-bg-surface border border-glorify-border-primary/10 rounded-3xl p-6 md:p-8 w-full max-w-3xl flex flex-col gap-6 shadow-2xl overflow-hidden max-h-[90vh]", onClick: (e) => e.stopPropagation(), children: [_jsxs("div", { className: "flex items-center justify-between border-b border-glorify-border-primary/5 pb-4", children: [_jsxs("div", { className: "flex flex-col", children: [_jsxs("h2", { className: "text-lg font-bold text-glorify-text-primary tracking-tight", children: [mode === 'single' && 'EDIT TRACK METADATA', mode === 'bulk' && `BULK METADATA EDITOR (${trackIds.length} tracks)`, mode === 'album' && 'EDIT ALBUM METADATA'] }), _jsxs("p", { className: "text-xs text-glorify-text-muted mt-0.5 font-normal", children: [mode === 'bulk' && 'Only fields you explicitly change will be updated.', mode === 'album' && 'Changes will apply to all tracks within this album.', mode === 'single' && 'Saved locally inside your Glorify client database.'] })] }), _jsx("button", { onClick: onClose, className: "p-2 rounded-full hover:bg-glorify-bg-secondary text-glorify-text-muted hover:text-glorify-text-primary transition-all cursor-pointer outline-none", children: _jsx(X, { className: "w-5 h-5" }) })] }), !showConfirm ? (_jsxs("div", { className: "flex flex-col md:flex-row gap-8 overflow-y-auto pr-1", children: [_jsxs("div", { className: "flex flex-col items-center gap-4 w-full md:w-48 flex-shrink-0", children: [_jsxs("div", { className: "relative group w-40 h-40 md:w-48 md:h-48 rounded-[24px] overflow-hidden bg-glorify-bg-secondary border border-glorify-border-primary/10 flex items-center justify-center shadow-lg", children: [coverUrl ? (_jsx("img", { src: coverUrl, alt: "Album Art", className: "w-full h-full object-cover" })) : (_jsx(ImageIcon, { className: "w-16 h-16 text-glorify-text-muted/45" })), _jsxs("div", { className: "absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-2 transition-all duration-200", children: [_jsx("button", { type: "button", onClick: () => fileInputRef.current?.click(), className: "px-3 py-1 bg-glorify-accent text-glorify-carbon-950 rounded-full text-[10px] font-bold cursor-pointer hover:scale-105 active:scale-95 transition-all shadow", children: "Change" }), coverUrl && (_jsx("button", { type: "button", onClick: handleRemoveArtwork, className: "p-1.5 bg-red-500/20 text-red-400 rounded-full cursor-pointer hover:bg-red-500/30 transition-all", title: "Remove Artwork", children: _jsx(Trash2, { className: "w-3.5 h-3.5" }) }))] })] }), _jsx("input", { type: "file", ref: fileInputRef, onChange: handleArtworkChange, accept: "image/png, image/jpeg, image/jpg, image/webp", className: "hidden" }), _jsx("span", { className: "text-[10px] text-glorify-text-muted font-normal text-center", children: "Supports PNG, JPG, JPEG, WEBP" }), errors.artwork && (_jsx("span", { className: "text-[10px] text-red-400 font-semibold text-center mt-1", children: errors.artwork }))] }), _jsxs("div", { className: "flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 pb-2", children: [mode === 'single' && (_jsxs("div", { className: "col-span-2 flex flex-col gap-1.5", children: [_jsx("label", { className: "text-[10px] font-bold text-glorify-text-secondary tracking-widest uppercase", children: "Title" }), _jsx("input", { type: "text", value: title, onChange: (e) => setTitle(e.target.value), placeholder: "Enter track title", className: `w-full px-4 py-2.5 bg-glorify-bg-secondary/40 border ${errors.title ? 'border-red-400' : 'border-glorify-border-primary/10'} rounded-xl text-sm text-glorify-text-primary focus:border-glorify-accent outline-none transition-all font-medium` }), errors.title && _jsx("span", { className: "text-[10px] text-red-400 font-semibold", children: errors.title })] })), mode !== 'album' && (_jsxs("div", { className: "flex flex-col gap-1.5", children: [_jsx("label", { className: "text-[10px] font-bold text-glorify-text-secondary tracking-widest uppercase", children: "Artist" }), _jsx("input", { type: "text", value: artist, onChange: (e) => setArtist(e.target.value), placeholder: mode === 'bulk' ? 'Leave empty to keep current' : 'Artist name', className: "w-full px-4 py-2.5 bg-glorify-bg-secondary/40 border border-glorify-border-primary/10 rounded-xl text-sm text-glorify-text-primary focus:border-glorify-accent outline-none transition-all font-medium" })] })), _jsxs("div", { className: "flex flex-col gap-1.5", children: [_jsx("label", { className: "text-[10px] font-bold text-glorify-text-secondary tracking-widest uppercase", children: "Album" }), _jsx("input", { type: "text", value: album, onChange: (e) => setAlbum(e.target.value), placeholder: mode === 'bulk' ? 'Leave empty to keep current' : 'Album name', className: "w-full px-4 py-2.5 bg-glorify-bg-secondary/40 border border-glorify-border-primary/10 rounded-xl text-sm text-glorify-text-primary focus:border-glorify-accent outline-none transition-all font-medium" })] }), _jsxs("div", { className: "flex flex-col gap-1.5", children: [_jsx("label", { className: "text-[10px] font-bold text-glorify-text-secondary tracking-widest uppercase", children: "Album Artist" }), _jsx("input", { type: "text", value: albumArtist, onChange: (e) => setAlbumArtist(e.target.value), placeholder: mode === 'bulk' ? 'Leave empty to keep current' : 'Album artist', className: "w-full px-4 py-2.5 bg-glorify-bg-secondary/40 border border-glorify-border-primary/10 rounded-xl text-sm text-glorify-text-primary focus:border-glorify-accent outline-none transition-all font-medium" })] }), _jsxs("div", { className: "flex flex-col gap-1.5", children: [_jsx("label", { className: "text-[10px] font-bold text-glorify-text-secondary tracking-widest uppercase", children: "Genre" }), _jsx("input", { type: "text", value: genre, onChange: (e) => setGenre(e.target.value), placeholder: mode === 'bulk' ? 'Leave empty to keep current' : 'e.g. Pop, Lofi', className: "w-full px-4 py-2.5 bg-glorify-bg-secondary/40 border border-glorify-border-primary/10 rounded-xl text-sm text-glorify-text-primary focus:border-glorify-accent outline-none transition-all font-medium" })] }), _jsxs("div", { className: "flex flex-col gap-1.5", children: [_jsx("label", { className: "text-[10px] font-bold text-glorify-text-secondary tracking-widest uppercase", children: "Year" }), _jsx("input", { type: "text", value: year, onChange: (e) => setYear(e.target.value), placeholder: "e.g. 2026", className: `w-full px-4 py-2.5 bg-glorify-bg-secondary/40 border ${errors.year ? 'border-red-400' : 'border-glorify-border-primary/10'} rounded-xl text-sm text-glorify-text-primary focus:border-glorify-accent outline-none transition-all font-medium` }), errors.year && _jsx("span", { className: "text-[10px] text-red-400 font-semibold", children: errors.year })] }), mode === 'single' && (_jsxs(_Fragment, { children: [_jsxs("div", { className: "flex flex-col gap-1.5", children: [_jsx("label", { className: "text-[10px] font-bold text-glorify-text-secondary tracking-widest uppercase", children: "Track #" }), _jsx("input", { type: "text", value: trackNumber, onChange: (e) => setTrackNumber(e.target.value), placeholder: "e.g. 4", className: `w-full px-4 py-2.5 bg-glorify-bg-secondary/40 border ${errors.trackNumber ? 'border-red-400' : 'border-glorify-border-primary/10'} rounded-xl text-sm text-glorify-text-primary focus:border-glorify-accent outline-none transition-all font-medium` }), errors.trackNumber && _jsx("span", { className: "text-[10px] text-red-400 font-semibold", children: errors.trackNumber })] }), _jsxs("div", { className: "flex flex-col gap-1.5", children: [_jsx("label", { className: "text-[10px] font-bold text-glorify-text-secondary tracking-widest uppercase", children: "Disc #" }), _jsx("input", { type: "text", value: discNumber, onChange: (e) => setDiscNumber(e.target.value), placeholder: "e.g. 1", className: `w-full px-4 py-2.5 bg-glorify-bg-secondary/40 border ${errors.discNumber ? 'border-red-400' : 'border-glorify-border-primary/10'} rounded-xl text-sm text-glorify-text-primary focus:border-glorify-accent outline-none transition-all font-medium` }), errors.discNumber && _jsx("span", { className: "text-[10px] text-red-400 font-semibold", children: errors.discNumber })] })] })), mode === 'single' && (_jsxs("div", { className: "flex flex-col gap-1.5", children: [_jsx("label", { className: "text-[10px] font-bold text-glorify-text-secondary tracking-widest uppercase", children: "Composer" }), _jsx("input", { type: "text", value: composer, onChange: (e) => setComposer(e.target.value), placeholder: "Composer name", className: "w-full px-4 py-2.5 bg-glorify-bg-secondary/40 border border-glorify-border-primary/10 rounded-xl text-sm text-glorify-text-primary focus:border-glorify-accent outline-none transition-all font-medium" })] })), mode === 'single' && (_jsxs("div", { className: "col-span-2 flex flex-col gap-1.5", children: [_jsx("label", { className: "text-[10px] font-bold text-glorify-text-secondary tracking-widest uppercase", children: "Comment" }), _jsx("textarea", { value: comment, onChange: (e) => setComment(e.target.value), placeholder: "Enter notes or comments...", rows: 2, className: "w-full px-4 py-2.5 bg-glorify-bg-secondary/40 border border-glorify-border-primary/10 rounded-xl text-sm text-glorify-text-primary focus:border-glorify-accent outline-none transition-all font-medium resize-none" })] }))] })] })) : (
                /* Confirmation Overlay */
                _jsxs("div", { className: "flex flex-col items-center justify-center text-center p-8 bg-glorify-bg-secondary/20 rounded-2xl border border-glorify-border-primary/10 gap-4", children: [_jsx(HelpCircle, { className: "w-12 h-12 text-glorify-accent" }), _jsx("h3", { className: "text-base font-bold text-glorify-text-primary", children: "Confirm Bulk Update" }), _jsxs("p", { className: "text-sm text-glorify-text-muted max-w-md", children: ["Are you sure you want to update the metadata for all ", _jsxs("span", { className: "text-glorify-text-primary font-semibold", children: [trackIds.length, " tracks"] }), "? This operation will apply changed fields consistently across them."] }), _jsxs("div", { className: "flex items-center gap-3 mt-4", children: [_jsx("button", { onClick: () => setShowConfirm(false), className: "px-5 py-2.5 bg-glorify-bg-secondary hover:bg-glorify-bg-secondary/80 text-glorify-text-primary rounded-full text-xs font-bold cursor-pointer transition-all", children: "Back to Edit" }), _jsx("button", { onClick: handleSave, disabled: isSaving, className: "px-5 py-2.5 bg-glorify-accent text-glorify-carbon-950 hover:scale-105 active:scale-95 rounded-full text-xs font-bold cursor-pointer transition-all shadow", children: isSaving ? 'Saving...' : `Update ${trackIds.length} Tracks` })] })] })), !showConfirm && (_jsxs("div", { className: "flex items-center justify-end gap-3 border-t border-glorify-border-primary/5 pt-4", children: [_jsx("span", { className: "text-[10px] text-glorify-text-muted mr-auto font-normal", children: "Changes are saved to your Glorify library. Writing metadata directly to the original file isn't available in this browser." }), mode === 'single' && (_jsx("button", { type: "button", onClick: () => setShowLyricsEdit(true), className: "px-5 py-2.5 bg-glorify-bg-secondary hover:bg-glorify-bg-secondary/80 text-glorify-text-primary rounded-full text-xs font-bold cursor-pointer transition-all border border-glorify-border-primary/10 mr-1", children: "Edit Lyrics" })), _jsx("button", { onClick: onClose, className: "px-5 py-2.5 bg-glorify-bg-secondary hover:bg-glorify-bg-secondary/80 text-glorify-text-primary rounded-full text-xs font-bold cursor-pointer transition-all", children: "Cancel" }), _jsx("button", { onClick: handleSave, disabled: isSaving, className: "px-5 py-2.5 bg-glorify-accent text-glorify-carbon-950 hover:scale-105 active:scale-95 rounded-full text-xs font-bold cursor-pointer transition-all shadow", children: isSaving ? 'Saving...' : 'Save Changes' })] })), showLyricsEdit && (_jsx(LyricsEditorModal, { trackId: trackIds[0], onClose: () => setShowLyricsEdit(false) }))] }) }));
}
//# sourceMappingURL=MetadataEditorModal.js.map