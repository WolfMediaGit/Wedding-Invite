"use client";

import { useEffect, useRef } from "react";

type Bird = { x: number; y: number; vx: number; vy: number; phase: number; size: number };

/**
 * Small dark birds drifting across the sky. The Framer site uses a three.js
 * boids component here; this is a dependency-free 2D boids flock with flapping wings.
 */
export default function FlockingBirds() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const birds: Bird[] = [];
    let w = 0;
    let h = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!birds.length) {
        const count = Math.round(Math.min(18, Math.max(8, w / 40)));
        for (let i = 0; i < count; i++) {
          birds.push({
            x: Math.random() * w,
            y: h * (0.08 + Math.random() * 0.5),
            vx: 0.35 + Math.random() * 0.35,
            vy: (Math.random() - 0.5) * 0.2,
            phase: Math.random() * Math.PI * 2,
            size: Math.max(3, w / 140) * (0.7 + Math.random() * 0.6),
          });
        }
      }
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let raf = 0;
    const step = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      for (const b of birds) {
        // cohesion + separation with neighbours (cheap boids)
        let cx = 0, cy = 0, n = 0, sx = 0, sy = 0;
        for (const o of birds) {
          if (o === b) continue;
          const dx = o.x - b.x, dy = o.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 120 * 120) { cx += o.x; cy += o.y; n++; }
          if (d2 < 22 * 22) { sx -= dx; sy -= dy; }
        }
        if (n) { b.vy += ((cy / n - b.y) * 0.0004); b.vx += ((cx / n - b.x) * 0.0001); }
        b.vx += sx * 0.002; b.vy += sy * 0.002;
        b.vx = Math.min(0.9, Math.max(0.25, b.vx));
        b.vy = Math.max(-0.35, Math.min(0.35, b.vy + (h * 0.3 - b.y) * 0.00002));
        if (!reduce) { b.x += b.vx; b.y += b.vy; }
        if (b.x > w + 20) { b.x = -20; b.y = h * (0.08 + Math.random() * 0.5); }

        const flap = Math.sin(t / 110 + b.phase);
        const s = b.size;
        ctx.strokeStyle = "rgba(55, 35, 25, 0.75)";
        ctx.lineWidth = Math.max(1, s * 0.28);
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(b.x - s, b.y - flap * s * 0.7);
        ctx.quadraticCurveTo(b.x - s * 0.4, b.y - s * 0.2, b.x, b.y);
        ctx.quadraticCurveTo(b.x + s * 0.4, b.y - s * 0.2, b.x + s, b.y - flap * s * 0.7);
        ctx.stroke();
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return <canvas ref={ref} aria-hidden style={{ width: "100%", height: "100%", display: "block", pointerEvents: "none" }} />;
}
