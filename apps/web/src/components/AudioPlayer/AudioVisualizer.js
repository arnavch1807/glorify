import React, { useEffect, useRef } from 'react';
export function AudioVisualizer({ isPlaying, color }) {
    const canvasRef = useRef(null);
    const animationRef = useRef(null);
    const heightsRef = useRef(Array.from({ length: 30 }, () => 10));
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas)
            return;
        const ctx = canvas.getContext('2d');
        if (!ctx)
            return;
        const barsCount = 30;
        const heights = heightsRef.current;
        // Set canvas dimensions
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);
        const render = () => {
            ctx.clearRect(0, 0, rect.width, rect.height);
            const barWidth = rect.width / barsCount - 3;
            const centerY = rect.height / 2;
            for (let i = 0; i < barsCount; i++) {
                // Target height based on play state
                let target = 4;
                if (isPlaying) {
                    // Create organic noise-like bounce waves
                    const time = Date.now() * 0.004;
                    const wave1 = Math.sin(i * 0.15 + time) * 12;
                    const wave2 = Math.cos(i * 0.35 - time * 0.7) * 8;
                    const randomNoise = Math.sin(i * 0.8 + time * 1.5) * 4;
                    target = Math.max(4, 18 + wave1 + wave2 + randomNoise);
                }
                // Interpolate for smooth transition
                heights[i] += (target - heights[i]) * 0.12;
                const h = heights[i];
                const x = i * (barWidth + 3);
                const y = centerY - h / 2;
                // Draw rounded pill bars
                ctx.fillStyle = color;
                ctx.beginPath();
                if (ctx.roundRect) {
                    ctx.roundRect(x, y, barWidth, h, 2);
                }
                else {
                    ctx.rect(x, y, barWidth, h);
                }
                ctx.fill();
            }
            animationRef.current = requestAnimationFrame(render);
        };
        render();
        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [isPlaying, color]);
    return React.createElement('canvas', {
        ref: canvasRef,
        className: 'w-full h-12 opacity-80'
    });
}
//# sourceMappingURL=AudioVisualizer.js.map