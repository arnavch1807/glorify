import React, { useState, useEffect } from 'react';
import { useLocalLibraryStore } from '../../store/localLibraryStore.js';
import { useToastStore } from '../../store/toastStore.js';
import { parseLrc, validateLrc } from '../../utils/lrcParser.js';
import { X, HelpCircle, FileText, Clock } from 'lucide-react';

interface LyricsEditorModalProps {
  trackId: string;
  onClose: () => void;
}

export function LyricsEditorModal({ trackId, onClose }: LyricsEditorModalProps) {
  const { localTracks, saveTrackLyrics } = useLocalLibraryStore();
  const track = localTracks.find((t) => t.id === trackId);

  const [editorMode, setEditorMode] = useState<'plain' | 'synced'>('plain');
  const [plainText, setPlainText] = useState('');
  const [syncedText, setSyncedText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (track && track.lyrics) {
      const lyr = track.lyrics;
      if (typeof lyr === 'string') {
        setPlainText(lyr);
        setEditorMode('plain');
      } else {
        if (lyr.type === 'synced') {
          setSyncedText(lyr.text || '');
          setEditorMode('synced');
          // Populate plain text fallback just in case
          setPlainText(lyr.text || '');
        } else {
          setPlainText(lyr.text || '');
          setEditorMode('plain');
        }
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [track, onClose]);

  const handleSave = async () => {
    if (!track) return;
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
      } else {
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
    } catch (err) {
      console.error(err);
      setError('An error occurred while saving lyrics.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!track) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0b0b0a]/75 backdrop-blur-md select-none font-sans">
      <div 
        className="relative bg-glorify-bg-surface border border-glorify-border-primary/10 rounded-3xl p-6 md:p-8 w-full max-w-2xl flex flex-col gap-5 shadow-2xl overflow-hidden max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-glorify-border-primary/5 pb-4">
          <div className="flex flex-col text-left">
            <h2 className="text-lg font-bold text-glorify-text-primary tracking-tight">
              EDIT LYRICS
            </h2>
            <p className="text-xs text-glorify-text-muted mt-0.5 font-normal">
              {track.title} • {track.artist}
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 rounded-full hover:bg-glorify-bg-secondary text-glorify-text-muted hover:text-glorify-text-primary transition-all cursor-pointer outline-none"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Editor Mode Selector Switch */}
        <div className="flex items-center justify-center bg-glorify-bg-secondary/65 border border-glorify-border-primary/5 p-1 rounded-xl w-fit self-center">
          <button
            onClick={() => setEditorMode('plain')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer outline-none ${
              editorMode === 'plain'
                ? 'bg-glorify-bg-surface text-glorify-text-primary shadow-sm'
                : 'text-glorify-text-muted hover:text-glorify-text-primary'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Plain Text
          </button>
          <button
            onClick={() => setEditorMode('synced')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer outline-none ${
              editorMode === 'synced'
                ? 'bg-glorify-bg-surface text-glorify-text-primary shadow-sm'
                : 'text-glorify-text-muted hover:text-glorify-text-primary'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            Synchronized (LRC)
          </button>
        </div>

        {/* Plain Mode */}
        {editorMode === 'plain' ? (
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-glorify-text-secondary tracking-widest uppercase text-left">
              Paste or type plain lyrics text
            </label>
            <textarea
              value={plainText}
              onChange={(e) => setPlainText(e.target.value)}
              placeholder="Enter lyrics lines..."
              rows={12}
              className="w-full px-4 py-3 bg-glorify-bg-secondary/40 border border-glorify-border-primary/10 rounded-2xl text-sm text-glorify-text-primary focus:border-glorify-accent outline-none transition-all font-medium resize-none focus:ring-1 focus:ring-glorify-accent"
            />
          </div>
        ) : (
          /* Synced LRC Mode */
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold text-glorify-text-secondary tracking-widest uppercase text-left">
                Enter synced LRC timestamped lyrics
              </label>
              <div className="group relative flex items-center text-glorify-accent cursor-help">
                <HelpCircle className="w-3.5 h-3.5" />
                <span className="absolute bottom-6 right-0 scale-0 group-hover:scale-100 bg-glorify-bg-surface border border-glorify-border-primary/15 p-3 rounded-lg text-[10px] font-semibold text-glorify-text-primary w-52 text-left leading-normal shadow-lg transition-all z-10">
                  Format example:<br/>
                  <code className="text-glorify-aura-gold font-mono block mt-1">
                    [00:12.50]First line<br/>
                    [00:16.80]Second line
                  </code>
                </span>
              </div>
            </div>
            <textarea
              value={syncedText}
              onChange={(e) => setSyncedText(e.target.value)}
              placeholder="[00:04.50]Intro Instrumental&#13;[00:12.80]First lyric line..."
              rows={12}
              className="w-full px-4 py-3 bg-glorify-bg-secondary/40 border border-glorify-border-primary/10 rounded-2xl text-sm text-glorify-text-primary focus:border-glorify-accent outline-none transition-all font-mono resize-none focus:ring-1 focus:ring-glorify-accent"
            />
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="px-4 py-2.5 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold rounded-xl text-left">
            {error}
          </div>
        )}

        {/* Footer actions */}
        <div className="flex items-center justify-end gap-3 border-t border-glorify-border-primary/5 pt-4">
          <span className="text-[10px] text-glorify-text-muted mr-auto font-normal text-left max-w-sm">
            Saved locally in browser IndexedDB database. Writing metadata directly to the original file is unavailable.
          </span>
          <button 
            onClick={onClose} 
            className="px-5 py-2.5 bg-glorify-bg-secondary hover:bg-glorify-bg-secondary/80 text-glorify-text-primary rounded-full text-xs font-bold cursor-pointer transition-all"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave} 
            disabled={isSaving}
            className="px-5 py-2.5 bg-glorify-accent text-glorify-carbon-950 hover:scale-105 active:scale-95 rounded-full text-xs font-bold cursor-pointer transition-all shadow"
          >
            {isSaving ? 'Saving...' : 'Save Lyrics'}
          </button>
        </div>
      </div>
    </div>
  );
}
