import React, { useState } from 'react';
import { usePlayerStore } from '../../store/playerStore.js';
import { X } from 'lucide-react';
export function PlaylistDialog({ playlistId, initialName = '', initialDescription = '', onClose, }) {
    const { createPlaylist, renamePlaylist } = usePlayerStore();
    const [name, setName] = useState(initialName);
    const [description, setDescription] = useState(initialDescription);
    const [error, setError] = useState('');
    const handleSave = (e) => {
        e.preventDefault();
        if (!name.trim()) {
            setError('Playlist name is required');
            return;
        }
        if (playlistId) {
            renamePlaylist(playlistId, name.trim(), description.trim());
        }
        else {
            createPlaylist(name.trim(), description.trim());
        }
        onClose();
    };
    return React.createElement('div', { className: 'fixed inset-0 z-50 flex items-center justify-center p-ch-4 bg-[#0b0b0a]/70 backdrop-blur-xs' }, React.createElement('div', { className: 'bg-chotify-bg-surface border border-chotify-border-primary rounded-ch-lg p-ch-6 max-w-sm w-full flex flex-col gap-ch-4 font-sans text-left' }, 
    // Title
    React.createElement('div', { className: 'flex items-center justify-between border-b border-chotify-border-secondary pb-ch-3' }, React.createElement('span', { className: 'text-xs font-mono font-bold tracking-widest text-chotify-text-primary' }, playlistId ? '[ CONFIGURE_PLAYLIST ]' : '[ CREATE_PLAYLIST ]'), React.createElement('button', { onClick: onClose, className: 'text-chotify-text-secondary hover:text-chotify-text-primary' }, React.createElement(X, { className: 'w-ch-4 h-ch-4' }))), 
    // Form fields
    React.createElement('form', { onSubmit: handleSave, className: 'flex flex-col gap-ch-4 mt-ch-2' }, React.createElement('div', { className: 'flex flex-col gap-ch-1' }, React.createElement('label', { className: 'text-[9px] font-mono text-chotify-text-muted uppercase' }, 'Playlist Title'), React.createElement('input', {
        type: 'text',
        value: name,
        onChange: (e) => {
            setName(e.target.value);
            setError('');
        },
        placeholder: 'My custom synthesis stems...',
        className: 'w-full px-ch-3 py-2 bg-chotify-bg-secondary border border-chotify-border-secondary rounded-ch-sm text-xs text-chotify-text-primary outline-none focus:border-chotify-aura-gold/50 transition-colors',
    }), error && React.createElement('span', { className: 'text-[9px] font-mono text-chotify-error mt-0.5' }, error)), React.createElement('div', { className: 'flex flex-col gap-ch-1' }, React.createElement('label', { className: 'text-[9px] font-mono text-chotify-text-muted uppercase' }, 'Description'), React.createElement('textarea', {
        value: description,
        onChange: (e) => setDescription(e.target.value),
        placeholder: 'Optional playlist description detailing prompts...',
        className: 'w-full h-20 p-ch-3 bg-chotify-bg-secondary border border-chotify-border-secondary rounded-ch-sm text-xs text-chotify-text-primary outline-none focus:border-chotify-aura-gold/50 transition-colors resize-none',
    })), 
    // Action triggers
    React.createElement('div', { className: 'flex justify-end gap-ch-2 mt-ch-2 border-t border-chotify-border-secondary pt-ch-4' }, React.createElement('button', {
        type: 'button',
        onClick: onClose,
        className: 'px-ch-4 py-ch-2 rounded-ch-sm text-xs font-semibold text-chotify-text-secondary hover:text-chotify-text-primary border border-chotify-border-primary cursor-pointer outline-none',
    }, 'Cancel'), React.createElement('button', {
        type: 'submit',
        className: 'px-ch-4 py-ch-2 rounded-ch-sm text-xs font-bold bg-chotify-aura-gold text-chotify-carbon-950 hover:opacity-90 cursor-pointer outline-none',
    }, playlistId ? 'Save Edits' : 'Create Playlist')))));
}
//# sourceMappingURL=PlaylistDialog.js.map