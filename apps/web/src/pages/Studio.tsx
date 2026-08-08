import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Play, Sliders, Settings, AlertTriangle, Loader2 } from 'lucide-react';
import { Button, Input, useTheme } from '@chotify/ui';
import { usePlayerStore } from '../store/playerStore.js';
import { useToastStore } from '../store/toastStore.js';
import { CloudRepository } from '../repositories/cloudRepository.js';

export function Studio() {
  const { theme } = useTheme();
  const { playTrack } = usePlayerStore();
  const { addToast } = useToastStore();

  const [prompt, setPrompt] = useState('Chill study beats with warm vintage synth pads');
  const [bpm, setBpm] = useState(110);
  const [keySignature, setKeySignature] = useState('C Major');
  const [genre, setGenre] = useState('Lofi');
  const [provider, setProvider] = useState<'suno' | 'udio'>('suno');

  const [hasKeys, setHasKeys] = useState({ suno: false, udio: false });
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [taskStatus, setTaskStatus] = useState<string>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const frameRef = useRef(0);

  // Check key credentials on mount
  useEffect(() => {
    const checkKeys = async () => {
      try {
        const res = await CloudRepository.getAPIKeysStatus();
        setHasKeys({
          suno: res.hasSuno && res.isValidSuno,
          udio: res.hasUdio && res.isValidUdio,
        });
      } catch (err) {
        console.error('Failed to query API key configuration:', err);
      }
    };
    checkKeys();
  }, []);

  // Animation Loop for Canvas fractal waveforms
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      frameRef.current += 1;
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      // Dynamic Gradient Background based on current active skin
      const isCarbon = theme === 'carbon';
      const grad = ctx.createRadialGradient(width / 2, height / 2, 10, width / 2, height / 2, width / 2);
      if (isCarbon) {
        grad.addColorStop(0, '#1c1917');
        grad.addColorStop(1, '#0c0a09');
      } else {
        grad.addColorStop(0, '#fbfaf8');
        grad.addColorStop(1, '#e5dacf');
      }
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Swirling orbit wave strings
      const ringCount = 5;
      ctx.lineWidth = 1;
      for (let i = 1; i <= ringCount; i++) {
        ctx.strokeStyle = isCarbon
          ? `rgba(235, 140, 90, ${0.1 * i})`
          : `rgba(163, 137, 116, ${0.1 * i})`;
        ctx.beginPath();
        const r = i * 25 + Math.sin(frameRef.current * 0.05 + i) * 5;
        ctx.arc(width / 2, height / 2, r, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Drawing sin waves
      ctx.lineWidth = 2;
      ctx.strokeStyle = isCarbon ? '#eb8c5a' : '#a38974';
      ctx.beginPath();
      for (let x = 0; x < width; x++) {
        const angle = (x / width) * Math.PI * 4 + (frameRef.current * 0.04);
        const y = height / 2 + Math.sin(angle) * 35 * Math.sin(frameRef.current * 0.01);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Nodes orbiting center
      const nodeCount = 6;
      ctx.fillStyle = isCarbon ? '#ffffff' : '#6e5f52';
      for (let i = 0; i < nodeCount; i++) {
        const angleOffset = (i * Math.PI * 2) / nodeCount;
        const currentAngle = angleOffset + (frameRef.current * 0.015);
        const radius = 55 + Math.cos(frameRef.current * 0.02 + i) * 15;
        const px = width / 2 + Math.cos(currentAngle) * radius;
        const py = height / 2 + Math.sin(currentAngle) * radius;

        ctx.beginPath();
        ctx.arc(px, py, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = isCarbon ? 'rgba(235, 140, 90, 0.2)' : 'rgba(163, 137, 116, 0.2)';
        ctx.beginPath();
        ctx.moveTo(width / 2, height / 2);
        ctx.lineTo(px, py);
        ctx.stroke();
      }

      // Only continue loop if active synthesizing, otherwise draw first idle frame
      if (isSynthesizing) {
        animationFrameRef.current = requestAnimationFrame(render);
      }
    };

    if (isSynthesizing) {
      render();
    } else {
      // Draw a single initial preview frame on mount / idle
      render();
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isSynthesizing, theme]);

  const handleStartSynthesis = async () => {
    const activeProviderKeyConfigured = provider === 'suno' ? hasKeys.suno : hasKeys.udio;

    if (!activeProviderKeyConfigured) {
      alert(`API key credentials for ${provider === 'suno' ? 'Suno AI' : 'Udio AI'} are not configured. Please visit Settings to add valid keys.`);
      return;
    }

    try {
      setErrorMsg(null);
      setIsSynthesizing(true);
      setProgress(10);
      setTaskStatus('queued');

      // Generate a static frame first to capture cover art
      const canvas = canvasRef.current;
      const coverImage = canvas ? canvas.toDataURL('image/jpeg', 0.8) : undefined;

      const response = await CloudRepository.composeTrack({
        prompt,
        bpm,
        keySignature,
        genre,
        provider,
        coverImage,
      });

      const taskId = response.taskId;

      const pollInterval = setInterval(async () => {
        try {
          const taskRes = await CloudRepository.pollTask(taskId);
          setProgress(taskRes.progress);
          setTaskStatus(taskRes.status);

          if (taskRes.status === 'completed') {
            clearInterval(pollInterval);
            setIsSynthesizing(false);
            if (taskRes.result) {
              playTrack(taskRes.result);
              addToast(`AI Track "${taskRes.result.title}" generated successfully!`, 'success');
            }
          } else if (taskRes.status === 'failed') {
            clearInterval(pollInterval);
            setIsSynthesizing(false);
            setErrorMsg(taskRes.error || 'Synthesis error occurred');
          }
        } catch (err: any) {
          clearInterval(pollInterval);
          setIsSynthesizing(false);
          setErrorMsg(err.response?.data?.message || err.message);
        }
      }, 1500);
    } catch (err: any) {
      setIsSynthesizing(false);
      setErrorMsg(err.response?.data?.message || err.message);
    }
  };

  const activeProviderKeyConfigured = provider === 'suno' ? hasKeys.suno : hasKeys.udio;

  return React.createElement(
    'div',
    { className: 'flex flex-col gap-6 w-full mx-auto pb-32 font-sans' },

    // Header Panel
    React.createElement(
      'div',
      { className: 'flex items-center justify-between pb-ch-2 mt-ch-4 border-b border-glorify-border-primary/10' },
      React.createElement(
        'div',
        { className: 'flex flex-col gap-1' },
        React.createElement(
          'h1',
          { className: 'text-2xl lg:text-3xl font-bold tracking-tight text-glorify-text-primary' },
          'Glorify Labs'
        ),
        React.createElement(
          'p',
          { className: 'text-sm text-glorify-text-muted font-normal' },
          'Create original generative sound waves from descriptive text.'
        )
      ),
      React.createElement(
        'span',
        { className: 'px-ch-3 py-1 bg-glorify-accent/15 text-glorify-accent border border-glorify-accent/25 rounded-full text-[10px] font-bold tracking-widest uppercase' },
        'AI Studio'
      )
    ),

    // Warning Badge if missing credentials
    !activeProviderKeyConfigured &&
      React.createElement(
        'div',
        { className: 'flex items-start gap-ch-3 p-ch-4 rounded-ch-lg bg-glorify-error/10 border border-glorify-error/20 text-glorify-error' },
        React.createElement(AlertTriangle, { className: 'w-ch-5 h-ch-5 shrink-0 mt-0.5' }),
        React.createElement(
          'div',
          { className: 'flex flex-col gap-0.5 text-xs' },
          React.createElement('span', { className: 'font-bold' }, 'API Key Required'),
          React.createElement(
            'span',
            null,
            `You do not have a valid credentials key saved for ${provider === 'suno' ? 'Suno AI' : 'Udio AI'}. Please configure it on the Settings page before composing.`
          )
        )
      ),

    // Grid split: Canvas Visualizer left, Tuning & Composer right
    React.createElement(
      'div',
      { className: 'grid grid-cols-1 lg:grid-cols-12 gap-ch-6 mt-2' },

      // Left Column: Canvas Cover Generator
      React.createElement(
        'div',
        { className: 'lg:col-span-4 flex flex-col gap-ch-4' },
        React.createElement(
          'div',
          { className: 'p-ch-6 rounded-[22px] bg-glorify-bg-surface/40 border border-glorify-border-primary/10 flex flex-col gap-ch-4 shadow-sm items-center justify-center relative overflow-hidden aspect-square' },
          React.createElement('canvas', {
            ref: canvasRef,
            width: 320,
            height: 320,
            className: 'w-full h-full rounded-[14px] bg-glorify-bg-secondary/40 border border-glorify-border-primary/5 shadow-inner'
          }),
          
          // Polling Progress Overlay
          isSynthesizing &&
            React.createElement(
              'div',
              { className: 'absolute inset-0 bg-glorify-bg-surface/85 backdrop-blur-sm flex flex-col items-center justify-center gap-ch-4 p-ch-6 text-center' },
              React.createElement(Loader2, { className: 'w-10 h-10 text-glorify-accent animate-spin' }),
              React.createElement(
                'div',
                { className: 'flex flex-col gap-1' },
                React.createElement('span', { className: 'text-sm font-bold text-glorify-text-primary capitalize' }, `${taskStatus}...`),
                React.createElement('span', { className: 'text-xs text-glorify-text-muted' }, `Progress: ${progress}%`)
              ),
              React.createElement(
                'div',
                { className: 'w-40 h-2 bg-glorify-bg-secondary rounded-full overflow-hidden' },
                React.createElement('div', {
                  className: 'h-full bg-glorify-accent transition-all duration-300',
                  style: { width: `${progress}%` }
                })
              )
            )
        ),
        React.createElement(
          'span',
          { className: 'text-[10px] text-glorify-text-muted text-center italic px-ch-2' },
          'Dynamic visual waves above snap automatically into track cover art upon completion.'
        )
      ),

      // Right Column: Tuning Parameters & Console
      React.createElement(
        'div',
        { className: 'lg:col-span-8 flex flex-col gap-ch-6' },

        // Tuning panel
        React.createElement(
          'div',
          { className: 'p-ch-6 rounded-[22px] bg-glorify-bg-surface/40 border border-glorify-border-primary/10 flex flex-col gap-ch-5 shadow-sm' },
          React.createElement(
            'div',
            { className: 'flex items-center gap-ch-2 pb-ch-2 border-b border-glorify-border-primary/5' },
            React.createElement(Sliders, { className: 'w-ch-4.5 h-ch-4.5 text-glorify-accent' }),
            React.createElement('span', { className: 'text-sm font-semibold text-glorify-text-primary' }, 'Synthesis Tuning')
          ),

          // Provider selector
          React.createElement(
            'div',
            { className: 'grid grid-cols-2 gap-ch-4' },
            React.createElement(
              'div',
              { className: 'flex flex-col gap-1.5' },
              React.createElement('label', { className: 'text-xs text-glorify-text-secondary font-medium' }, 'AI Provider'),
              React.createElement(
                'select',
                {
                  value: provider,
                  onChange: (e: any) => setProvider(e.target.value),
                  className: 'px-ch-4 py-2.5 bg-glorify-bg-secondary/60 border border-glorify-border-primary/10 rounded-full text-xs text-glorify-text-primary outline-none focus:border-glorify-accent cursor-pointer font-semibold'
                },
                React.createElement('option', { value: 'suno' }, 'Suno AI Synth'),
                React.createElement('option', { value: 'udio' }, 'Udio AI Synth')
              )
            ),

            // BPM input
            React.createElement(
              'div',
              { className: 'flex flex-col gap-1.5' },
              React.createElement(
                'div',
                { className: 'flex items-center justify-between text-xs text-glorify-text-secondary font-medium' },
                React.createElement('span', null, 'Tempo (BPM)'),
                React.createElement('span', { className: 'text-glorify-accent font-bold' }, bpm)
              ),
              React.createElement('input', {
                type: 'range',
                min: 60,
                max: 180,
                value: bpm,
                onChange: (e: any) => setBpm(parseInt(e.target.value, 10)),
                style: {
                  background: `linear-gradient(to right, var(--color-glorify-accent) 0%, var(--color-glorify-accent) ${((bpm - 60) / 120) * 100}%, var(--glorify-slider-bg) ${((bpm - 60) / 120) * 100}%, var(--glorify-slider-bg) 100%)`
                },
                className: 'premium-slider w-full bg-glorify-bg-secondary/60 rounded-full appearance-none outline-none cursor-pointer'
              })
            )
          ),

          // Key and Genre
          React.createElement(
            'div',
            { className: 'grid grid-cols-2 gap-ch-4' },
            React.createElement(
              'div',
              { className: 'flex flex-col gap-1.5' },
              React.createElement('label', { className: 'text-xs text-glorify-text-secondary font-medium' }, 'Key Signature'),
              React.createElement(
                'select',
                {
                  value: keySignature,
                  onChange: (e: any) => setKeySignature(e.target.value),
                  className: 'px-ch-4 py-2.5 bg-glorify-bg-secondary/60 border border-glorify-border-primary/10 rounded-full text-xs text-glorify-text-primary outline-none focus:border-glorify-accent cursor-pointer font-semibold'
                },
                ['C Major', 'A Minor', 'G Major', 'E Minor', 'D Major', 'B Minor', 'A Major', 'F# Minor', 'F Major', 'D Minor'].map(k =>
                  React.createElement('option', { key: k, value: k }, k)
                )
              )
            ),
            React.createElement(
              'div',
              { className: 'flex flex-col gap-1.5' },
              React.createElement('label', { className: 'text-xs text-glorify-text-secondary font-medium' }, 'Style / Genre'),
              React.createElement(
                'select',
                {
                  value: genre,
                  onChange: (e: any) => setGenre(e.target.value),
                  className: 'px-ch-4 py-2.5 bg-glorify-bg-secondary/60 border border-glorify-border-primary/10 rounded-full text-xs text-glorify-text-primary outline-none focus:border-glorify-accent cursor-pointer font-semibold'
                },
                ['Synthwave', 'Ambient', 'Lofi', 'Glitch', 'Rock', 'Techno', 'Jazz', 'Classical'].map(g =>
                  React.createElement('option', { key: g, value: g }, g)
                )
              )
            )
          )
        ),

        // Prompt Editor Card
        React.createElement(
          'div',
          { className: 'p-ch-6 rounded-[22px] bg-glorify-bg-surface/40 border border-glorify-border-primary/10 flex flex-col gap-ch-5 shadow-sm' },
          React.createElement(
            'div',
            { className: 'flex items-center gap-ch-2 pb-ch-2 border-b border-glorify-border-primary/5' },
            React.createElement(Sparkles, { className: 'w-ch-4.5 h-ch-4.5 text-glorify-accent' }),
            React.createElement('span', { className: 'text-sm font-semibold text-glorify-text-primary' }, 'Composition Console')
          ),
          React.createElement(
            'div',
            { className: 'flex flex-col gap-1.5' },
            React.createElement('label', { className: 'text-xs text-glorify-text-secondary font-medium' }, 'Describe your target composition'),
            React.createElement('textarea', {
              value: prompt,
              onChange: (e: any) => setPrompt(e.target.value),
              placeholder: 'Describe your target composition (e.g. Ambient lofi piano keys with space reverb and drum loops)...',
              className: 'w-full h-24 p-ch-4 rounded-ch-lg bg-glorify-bg-secondary/60 border border-glorify-border-primary/10 text-sm text-glorify-text-primary placeholder:text-glorify-text-muted/50 outline-none resize-none focus:border-glorify-accent cursor-pointer'
            })
          ),
          
          // Display error block if any
          errorMsg &&
            React.createElement(
              'div',
              { className: 'text-xs text-glorify-error font-medium p-ch-3 rounded-ch bg-glorify-error/5 border border-glorify-error/15' },
              errorMsg
            ),

          // Submit footer
          React.createElement(
            'div',
            { className: 'flex justify-end border-t border-glorify-border-primary/5 pt-ch-4' },
            React.createElement(
              Button,
              {
                variant: 'ai',
                onClick: handleStartSynthesis,
                disabled: isSynthesizing || !activeProviderKeyConfigured,
                className: 'flex items-center gap-ch-2 rounded-full text-xs font-semibold px-ch-6 py-3 hover:scale-[1.03] active:scale-[0.97] transition-all disabled:opacity-50 disabled:scale-100 disabled:pointer-events-none'
              },
              React.createElement(Play, { className: 'w-ch-3.5 h-ch-3.5 fill-currentColor pl-0.5 font-bold' }),
              isSynthesizing ? 'Synthesizing...' : 'Start Synthesis'
            )
          )
        )
      )
    )
  );
}
