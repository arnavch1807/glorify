import React, { useState } from 'react';
import { Key, Shield, Download, Sliders, Volume2, Trash2, Bell, Keyboard, Sparkles, Paintbrush } from 'lucide-react';
import { Button, Input, useTheme } from '@chotify/ui';
import { usePlayerStore } from '../store/playerStore.js';
export function Settings() {
    const { theme, setTheme } = useTheme();
    const { crossfadeDuration, isGapless, isNormalized, audioQuality, outputDevice, sleepTimerMinutes, downloadedTrackIds, setCrossfadeDuration, setGapless, setNormalized, setSleepTimer, setAudioQuality, setOutputDevice, removeDownloadedTrack } = usePlayerStore();
    const [sunoKey, setSunoKey] = useState('');
    const [udioSecret, setUdioSecret] = useState('');
    // Simulated storage state
    const [cacheSize, setCacheSize] = useState('248.6 MB');
    const [allowNotifications, setAllowNotifications] = useState(true);
    const [experimentalLabs, setExperimentalLabs] = useState(false);
    const handleExportData = () => {
        const data = {
            username: 'user_dev',
            email: 'dev@glorify.com',
            theme,
            downloadedCount: downloadedTrackIds.length,
            playbackSettings: {
                crossfadeDuration,
                isGapless,
                isNormalized,
                audioQuality,
            }
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'glorify-profile-export.json';
        a.click();
        URL.revokeObjectURL(url);
    };
    const handleClearCache = () => {
        setCacheSize('0.0 MB');
        alert('Cache cleared successfully!');
    };
    const keyboardShortcuts = [
        { key: 'Space', desc: 'Play / Pause Audio Streams' },
        { key: 'ArrowRight', desc: 'Skip to Next Track in Queue' },
        { key: 'ArrowLeft', desc: 'Skip to Previous Track / Restart' },
        { key: 'M / m', desc: 'Toggle Mute Output Device' },
        { key: 'L / l', desc: 'Like / Favorite Current Track' },
        { key: 'Escape', desc: 'Exit Fullscreen Video Player' }
    ];
    return React.createElement('div', { className: 'flex flex-col gap-8 w-full mx-auto pb-32 font-sans' }, 
    // Header
    React.createElement('div', { className: 'flex flex-col gap-1 pb-ch-2 mt-ch-4 border-b border-glorify-border-primary/10' }, React.createElement('h1', { className: 'text-2xl lg:text-3xl font-bold tracking-tight text-glorify-text-primary' }, 'Settings'), React.createElement('p', { className: 'text-sm text-glorify-text-muted font-normal' }, 'Manage your account settings, audio preferences, cache storage and keyboard hotkeys.')), 
    // Settings Layout Grid
    React.createElement('div', { className: 'grid grid-cols-1 lg:grid-cols-2 gap-8' }, 
    // 1. Appearance Section
    React.createElement('div', { className: 'p-ch-6 rounded-[22px] bg-glorify-bg-surface/40 border border-glorify-border-primary/10 flex flex-col gap-ch-5 shadow-sm' }, React.createElement('div', { className: 'flex items-center gap-ch-2 pb-ch-2 border-b border-glorify-border-primary/5' }, React.createElement(Paintbrush, { className: 'w-ch-4.5 h-ch-4.5 text-glorify-accent' }), React.createElement('span', { className: 'text-sm font-semibold text-glorify-text-primary' }, 'Appearance')), React.createElement('div', { className: 'flex items-center justify-between text-xs font-semibold' }, React.createElement('span', { className: 'text-glorify-text-secondary font-medium' }, 'Theme Accent Canvas'), React.createElement('div', { className: 'flex items-center gap-ch-2 bg-glorify-bg-secondary/60 p-0.5 rounded-full border border-glorify-border-primary/10' }, ['sand', 'carbon'].map((t) => React.createElement('button', {
        key: t,
        onClick: () => setTheme(t),
        className: `px-ch-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider cursor-pointer transition-all ${theme === t
            ? 'bg-glorify-bg-surface text-glorify-text-primary shadow-sm font-bold'
            : 'text-glorify-text-muted hover:text-glorify-text-primary'}`
    }, t))))), 
    // 2. Playback Settings
    React.createElement('div', { className: 'p-ch-6 rounded-[22px] bg-glorify-bg-surface/40 border border-glorify-border-primary/10 flex flex-col gap-ch-5 shadow-sm' }, React.createElement('div', { className: 'flex items-center gap-ch-2 pb-ch-2 border-b border-glorify-border-primary/5' }, React.createElement(Sliders, { className: 'w-ch-4.5 h-ch-4.5 text-glorify-accent' }), React.createElement('span', { className: 'text-sm font-semibold text-glorify-text-primary' }, 'Playback')), 
    // Crossfade
    React.createElement('div', { className: 'flex flex-col gap-ch-2' }, React.createElement('div', { className: 'flex items-center justify-between text-xs text-glorify-text-secondary font-medium' }, React.createElement('span', null, 'Crossfade Duration'), React.createElement('span', { className: 'text-glorify-accent font-bold' }, `${crossfadeDuration}s`)), React.createElement('input', {
        type: 'range',
        min: 0,
        max: 12,
        step: 1,
        value: crossfadeDuration,
        onChange: (e) => setCrossfadeDuration(parseInt(e.target.value, 10)),
        style: {
            background: `linear-gradient(to right, var(--color-glorify-accent) 0%, var(--color-glorify-accent) ${(crossfadeDuration / 12) * 100}%, var(--glorify-slider-bg) ${(crossfadeDuration / 12) * 100}%, var(--glorify-slider-bg) 100%)`
        },
        className: 'premium-slider w-full bg-glorify-bg-secondary/60 rounded-full appearance-none outline-none transition-all glow-progress',
    })), 
    // Toggles
    React.createElement('div', { className: 'flex flex-col gap-ch-3' }, [
        { label: 'Gapless Playback Streams', val: isGapless, toggle: () => setGapless(!isGapless) },
        { label: 'Audio Normalization', val: isNormalized, toggle: () => setNormalized(!isNormalized) },
    ].map((sw) => React.createElement('div', { key: sw.label, className: 'flex items-center justify-between text-xs font-semibold' }, React.createElement('span', { className: 'text-glorify-text-secondary font-medium' }, sw.label), React.createElement('input', {
        type: 'checkbox',
        checked: sw.val,
        onChange: sw.toggle,
        className: 'w-ch-4.5 h-ch-4.5 accent-glorify-accent cursor-pointer',
    }))))), 
    // 3. Audio Quality
    React.createElement('div', { className: 'p-ch-6 rounded-[22px] bg-glorify-bg-surface/40 border border-glorify-border-primary/10 flex flex-col gap-ch-5 shadow-sm' }, React.createElement('div', { className: 'flex items-center gap-ch-2 pb-ch-2 border-b border-glorify-border-primary/5' }, React.createElement(Volume2, { className: 'w-ch-4.5 h-ch-4.5 text-glorify-accent' }), React.createElement('span', { className: 'text-sm font-semibold text-glorify-text-primary' }, 'Audio Quality')), 
    // Audio Quality options
    React.createElement('div', { className: 'flex flex-col gap-ch-2' }, React.createElement('div', { className: 'text-xs text-glorify-text-secondary font-medium' }, 'Streaming Quality Level'), React.createElement('div', { className: 'grid grid-cols-3 gap-ch-2 bg-glorify-bg-secondary/60 p-0.5 rounded-full border border-glorify-border-primary/10' }, ['standard', 'high', 'lossless'].map((qual) => React.createElement('button', {
        key: qual,
        onClick: () => setAudioQuality(qual),
        className: `py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider cursor-pointer transition-all ${audioQuality === qual
            ? 'bg-glorify-bg-surface text-glorify-text-primary shadow-sm font-bold'
            : 'text-glorify-text-muted hover:text-glorify-text-primary'}`,
    }, qual)))), 
    // Device Selector
    React.createElement('div', { className: 'flex flex-col gap-ch-1.5' }, React.createElement('label', { className: 'text-xs text-glorify-text-secondary font-medium' }, 'Output Device Stream Destination'), React.createElement('select', {
        value: outputDevice,
        onChange: (e) => setOutputDevice(e.target.value),
        className: 'px-ch-4 py-2.5 bg-glorify-bg-secondary/60 border border-glorify-border-primary/10 rounded-full text-xs text-glorify-text-primary outline-none focus:border-glorify-accent cursor-pointer font-semibold',
    }, ['Default Speakers', 'USB Audio Interface', 'Bluetooth Headphones'].map((dev) => React.createElement('option', { key: dev, value: dev }, dev))))), 
    // 4. Downloads & Storage Manager
    React.createElement('div', { className: 'p-ch-6 rounded-[22px] bg-glorify-bg-surface/40 border border-glorify-border-primary/10 flex flex-col justify-between gap-ch-5 shadow-sm' }, React.createElement('div', { className: 'flex items-center gap-ch-2 pb-ch-2 border-b border-glorify-border-primary/5' }, React.createElement(Download, { className: 'w-ch-4.5 h-ch-4.5 text-glorify-accent' }), React.createElement('span', { className: 'text-sm font-semibold text-glorify-text-primary' }, 'Downloads & Storage')), React.createElement('div', { className: 'flex items-center justify-between text-xs font-semibold' }, React.createElement('span', { className: 'text-glorify-text-secondary font-medium' }, `Offline downloads (${downloadedTrackIds.length} tracks)`), downloadedTrackIds.length > 0 &&
        React.createElement('button', {
            onClick: () => {
                if (confirm('Clear all downloads?')) {
                    downloadedTrackIds.forEach(id => removeDownloadedTrack(id));
                }
            },
            className: 'text-[10px] text-glorify-error hover:underline flex items-center gap-1 cursor-pointer'
        }, 'Remove All')), React.createElement('div', { className: 'flex items-center justify-between text-xs font-semibold pt-ch-2 border-t border-glorify-border-primary/5' }, React.createElement('div', { className: 'flex flex-col' }, React.createElement('span', { className: 'text-glorify-text-secondary font-medium' }, 'Local cached space'), React.createElement('span', { className: 'text-[10px] text-glorify-text-muted mt-0.5' }, 'Covers, stems logs and pre-loaded audio files')), React.createElement('div', { className: 'flex items-center gap-3' }, React.createElement('span', { className: 'text-xs text-glorify-text-primary font-bold' }, cacheSize), cacheSize !== '0.0 MB' &&
        React.createElement('button', {
            onClick: handleClearCache,
            className: 'p-2 rounded-full hover:bg-glorify-error/10 text-glorify-error cursor-pointer',
            title: 'Clear Cache'
        }, React.createElement(Trash2, { className: 'w-ch-4 h-ch-4' }))))), 
    // 5. API credentials integrations
    React.createElement('div', { className: 'p-ch-6 rounded-[22px] bg-glorify-bg-surface/40 border border-glorify-border-primary/10 flex flex-col gap-ch-5 shadow-sm' }, React.createElement('div', { className: 'flex items-center gap-ch-2 pb-ch-2 border-b border-glorify-border-primary/5' }, React.createElement(Key, { className: 'w-ch-4.5 h-ch-4.5 text-glorify-accent' }), React.createElement('span', { className: 'text-sm font-semibold text-glorify-text-primary' }, 'API Credentials')), React.createElement(Input, {
        label: 'Suno AI Studio Secret key',
        type: 'password',
        value: sunoKey,
        onChange: (e) => setSunoKey(e.target.value),
        placeholder: 'Enter Suno API key secret...',
    }), React.createElement(Input, {
        label: 'Udio Studio Secret key',
        type: 'password',
        value: udioSecret,
        onChange: (e) => setUdioSecret(e.target.value),
        placeholder: 'Enter Udio client secret...',
    }), React.createElement('div', { className: 'flex justify-end pt-ch-2' }, React.createElement(Button, {
        variant: 'secondary',
        onClick: () => alert('API credentials saved securely in local container!'),
        className: 'rounded-full text-xs font-semibold px-ch-4 py-2 hover:bg-glorify-bg-secondary'
    }, 'Save Credentials'))), 
    // 6. Privacy & GDPR settings
    React.createElement('div', { className: 'p-ch-6 rounded-[22px] bg-glorify-bg-surface/40 border border-glorify-border-primary/10 flex flex-col justify-between gap-ch-5 shadow-sm' }, React.createElement('div', { className: 'flex flex-col gap-ch-4' }, React.createElement('div', { className: 'flex items-center gap-ch-2 pb-ch-2 border-b border-glorify-border-primary/5' }, React.createElement(Shield, { className: 'w-ch-4.5 h-ch-4.5 text-glorify-text-muted' }), React.createElement('span', { className: 'text-sm font-semibold text-glorify-text-primary' }, 'Privacy & GDPR')), React.createElement('p', { className: 'text-xs text-glorify-text-secondary leading-relaxed font-normal' }, 'In accordance with compliance regulations (GDPR / CCPA), you can export your personal data or request deletion of your account information below.')), React.createElement('div', { className: 'flex flex-col gap-ch-3 border-t border-glorify-border-primary/5 pt-ch-4' }, React.createElement(Button, { onClick: handleExportData, className: 'flex items-center justify-center gap-ch-2 rounded-full text-xs font-semibold px-ch-4 py-2.5' }, React.createElement(Download, { className: 'w-ch-4 h-ch-4' }), 'Export Account Data (.json)'), React.createElement(Button, { variant: 'secondary', className: 'rounded-full text-xs font-semibold px-ch-4 py-2.5 text-glorify-error border-glorify-error/25 hover:bg-glorify-error/10 hover:border-glorify-error' }, 'Delete Account'))), 
    // 7. Notifications
    React.createElement('div', { className: 'p-ch-6 rounded-[22px] bg-glorify-bg-surface/40 border border-glorify-border-primary/10 flex flex-col gap-ch-5 shadow-sm' }, React.createElement('div', { className: 'flex items-center gap-ch-2 pb-ch-2 border-b border-glorify-border-primary/5' }, React.createElement(Bell, { className: 'w-ch-4.5 h-ch-4.5 text-glorify-accent' }), React.createElement('span', { className: 'text-sm font-semibold text-glorify-text-primary' }, 'Notifications')), React.createElement('div', { className: 'flex items-center justify-between text-xs font-semibold' }, React.createElement('div', { className: 'flex flex-col' }, React.createElement('span', { className: 'text-glorify-text-secondary font-medium' }, 'Allow platform notifications'), React.createElement('span', { className: 'text-[10px] text-glorify-text-muted mt-0.5' }, 'Receive alerts about new features, system updates, and downloads.')), React.createElement('input', {
        type: 'checkbox',
        checked: allowNotifications,
        onChange: () => setAllowNotifications(!allowNotifications),
        className: 'w-ch-4.5 h-ch-4.5 accent-glorify-accent cursor-pointer',
    }))), 
    // 8. Experimental Features
    React.createElement('div', { className: 'p-ch-6 rounded-[22px] bg-glorify-bg-surface/40 border border-glorify-border-primary/10 flex flex-col gap-ch-5 shadow-sm' }, React.createElement('div', { className: 'flex items-center gap-ch-2 pb-ch-2 border-b border-glorify-border-primary/5' }, React.createElement(Sparkles, { className: 'w-ch-4.5 h-ch-4.5 text-glorify-accent' }), React.createElement('span', { className: 'text-sm font-semibold text-glorify-text-primary' }, 'Experimental Features')), React.createElement('div', { className: 'flex items-center justify-between text-xs font-semibold' }, React.createElement('div', { className: 'flex flex-col' }, React.createElement('span', { className: 'text-glorify-text-secondary font-medium' }, 'Glorify Labs Developer Beta'), React.createElement('span', { className: 'text-[10px] text-glorify-text-muted mt-0.5' }, 'Enable next-gen generative music models and raw stems editing.')), React.createElement('input', {
        type: 'checkbox',
        checked: experimentalLabs,
        onChange: () => setExperimentalLabs(!experimentalLabs),
        className: 'w-ch-4.5 h-ch-4.5 accent-glorify-accent cursor-pointer',
    }))), 
    // 9. Keyboard Shortcuts Cheat-sheet (Full Width in flex container or layout)
    React.createElement('div', { className: 'p-ch-6 rounded-[22px] bg-glorify-bg-surface/40 border border-glorify-border-primary/10 flex flex-col gap-ch-4 shadow-sm lg:col-span-2' }, React.createElement('div', { className: 'flex items-center gap-ch-2 pb-ch-2 border-b border-glorify-border-primary/5' }, React.createElement(Keyboard, { className: 'w-ch-4.5 h-ch-4.5 text-glorify-accent' }), React.createElement('span', { className: 'text-sm font-semibold text-glorify-text-primary' }, 'Keyboard Shortcuts')), React.createElement('div', { className: 'flex flex-col gap-2' }, keyboardShortcuts.map((sc) => React.createElement('div', { key: sc.key, className: 'flex items-center justify-between text-xs py-1.5 border-b border-glorify-border-primary/5 font-semibold' }, React.createElement('span', { className: 'text-glorify-text-secondary font-medium' }, sc.desc), React.createElement('kbd', { className: 'px-2 py-1 bg-glorify-bg-secondary border border-glorify-border-primary/20 rounded font-mono text-[10px] text-glorify-accent font-bold' }, sc.key)))))));
}
//# sourceMappingURL=Settings.js.map