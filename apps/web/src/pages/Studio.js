import React from 'react';
import { Sparkles, Play, Sliders, Hammer } from 'lucide-react';
import { Button } from '@chotify/ui';
export function Studio() {
    return React.createElement('div', { className: 'flex flex-col gap-6 w-full mx-auto pb-32 font-sans' }, 
    // Header Panel
    React.createElement('div', { className: 'flex items-center justify-between pb-ch-2 mt-ch-4 border-b border-glorify-border-primary/10' }, React.createElement('div', { className: 'flex flex-col gap-1' }, React.createElement('h1', { className: 'text-2xl lg:text-3xl font-bold tracking-tight text-glorify-text-primary' }, 'Glorify Labs'), React.createElement('p', { className: 'text-sm text-glorify-text-muted font-normal' }, 'Experimental music synthesis suite (Version 2 preview)')), React.createElement('span', { className: 'px-ch-3 py-1 bg-glorify-accent/15 text-glorify-accent border border-glorify-accent/25 rounded-full text-[10px] font-bold tracking-widest uppercase' }, 'Coming Soon')), 
    // Immersive Coming Soon Panel
    React.createElement('div', { className: 'w-full py-16 px-6 bg-gradient-to-br from-glorify-accent/10 to-transparent border border-glorify-border-primary/5 rounded-[28px] flex flex-col items-center justify-center text-center gap-ch-4 shadow-sm' }, React.createElement(Hammer, { className: 'w-12 h-12 text-glorify-accent/80 animate-bounce' }), React.createElement('h2', { className: 'text-lg font-bold text-glorify-text-primary mt-2' }, 'Algorithmic Music Generation Under Construction'), React.createElement('p', { className: 'text-xs text-glorify-text-muted max-w-md leading-relaxed font-normal' }, 'We are currently designing a high-fidelity AI composer workspace. Connect Gemini and OpenAI APIs in settings to preview generative sound wave stems in the next release.')), React.createElement('div', { className: 'grid grid-cols-1 lg:grid-cols-3 gap-ch-6 mt-4 opacity-50 pointer-events-none select-none' }, 
    // Parameters Panel
    React.createElement('div', {
        className: 'lg:col-span-1 p-ch-6 rounded-[18px] bg-glorify-bg-surface/45 border border-glorify-border-primary/10 flex flex-col gap-ch-6 shadow-md',
    }, React.createElement('div', { className: 'flex items-center gap-ch-2 pb-ch-2 border-b border-white/5' }, React.createElement(Sliders, { className: 'w-ch-4.5 h-ch-4.5 text-glorify-text-muted' }), React.createElement('span', { className: 'text-sm font-semibold text-glorify-text-primary' }, 'Synthesis Tuning')), 
    // Tempo Slider
    React.createElement('div', { className: 'flex flex-col gap-ch-2' }, React.createElement('div', { className: 'flex items-center justify-between text-xs text-glorify-text-secondary font-medium' }, React.createElement('span', null, 'Tempo (BPM)'), React.createElement('span', { className: 'text-glorify-accent font-bold' }, '72')), React.createElement('input', {
        type: 'range',
        min: 60,
        max: 180,
        value: 72,
        readOnly: true,
        style: {
            background: `linear-gradient(to right, var(--color-glorify-accent) 0%, var(--color-glorify-accent) 15%, var(--glorify-slider-bg) 15%, var(--glorify-slider-bg) 100%)`
        },
        className: 'premium-slider w-full bg-white/10 rounded-full appearance-none outline-none cursor-pointer',
    })), 
    // Key selector (mock)
    React.createElement('div', { className: 'flex flex-col gap-ch-2' }, React.createElement('label', { className: 'text-xs text-glorify-text-secondary font-medium' }, 'Tonal Key'), React.createElement('div', {
        className: 'w-full px-ch-4 py-3 rounded-full bg-glorify-bg-secondary/60 border border-glorify-border-primary/10 text-xs text-glorify-text-primary flex items-center justify-between',
    }, React.createElement('span', null, 'A (Major)'), React.createElement('span', { className: 'text-[10px] text-glorify-text-muted font-semibold' }, 'Auto')))), 
    // Prompt Console
    React.createElement('div', {
        className: 'lg:col-span-2 p-ch-6 rounded-[18px] bg-glorify-bg-surface/45 border border-glorify-border-primary/10 flex flex-col justify-between gap-ch-6 shadow-md',
    }, React.createElement('div', { className: 'flex flex-col gap-ch-4' }, React.createElement('div', { className: 'flex items-center gap-ch-2 pb-ch-2 border-b border-white/5' }, React.createElement(Sparkles, { className: 'w-ch-4.5 h-ch-4.5 text-glorify-accent' }), React.createElement('span', { className: 'text-sm font-semibold text-glorify-text-primary' }, 'Composition Prompt')), React.createElement('div', { className: 'flex flex-col gap-ch-2' }, React.createElement('label', { className: 'text-xs text-glorify-text-muted font-medium' }, 'Describe your target track'), React.createElement('textarea', {
        placeholder: 'Describe your target composition (e.g., Ambient lofi, slow acoustic guitar, space reverb)...',
        readOnly: true,
        className: 'w-full h-32 p-ch-4 rounded-ch-lg bg-glorify-bg-secondary/60 border border-glorify-border-primary/10 text-sm text-glorify-text-primary placeholder:text-glorify-text-muted/60 outline-none resize-none focus:border-glorify-accent/40 transition-colors',
    }))), React.createElement('div', { className: 'flex justify-end border-t border-white/5 pt-ch-4' }, React.createElement(Button, { variant: 'ai', className: 'flex items-center gap-ch-2 rounded-full text-xs font-semibold px-ch-5 py-2.5 hover:scale-105 active:scale-95 transition-transform' }, React.createElement(Play, { className: 'w-ch-3.5 h-ch-3.5 fill-currentColor pl-0.5' }), 'Start Synthesis')))));
}
//# sourceMappingURL=Studio.js.map