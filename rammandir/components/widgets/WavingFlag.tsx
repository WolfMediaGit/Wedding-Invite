"use client";

import { useEffect, useRef } from "react";
import { img, FLAG_IMAGE } from "@/lib/assets";

/**
 * Saffron dhwaja on the temple spire. The Framer component is a canvas that
 * ripples a flag image; this draws the image in vertical strips displaced by a
 * travelling sine wave, stronger towards the free edge.
 */
export default function WavingFlag() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.src = img(FLAG_IMAGE);
    let ready = false;
    image.onload = () => (ready = true);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    const draw = (t: number) => {
      const dpr = window.devicePixelRatio || 1;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (canvas.width !== Math.round(w * dpr)) {
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const amp = h * 0.06;
      const strips = Math.max(12, Math.round(w / 2));
      const sw = w / strips;
      for (let i = 0; i < strips; i++) {
        const fx = i / strips;
        const dy = reduce ? 0 : Math.sin(fx * 7 - t / 180) * amp * fx;
        if (ready) {
          const sx = (fx * image.naturalWidth) | 0;
          const sWidth = Math.ceil(image.naturalWidth / strips) + 1;
          ctx.drawImage(image, sx, 0, sWidth, image.naturalHeight, i * sw, dy + amp, sw + 0.5, h - amp * 2);
        } else {
          // Fallback shape while the image loads: a two-tailed saffron pennant.
          ctx.fillStyle = "#E8742A";
          const top = dy + amp + (h - amp * 2) * fx * 0.18;
          const bottom = dy + h - amp - (h - amp * 2) * fx * 0.18;
          ctx.fillRect(i * sw, top, sw + 0.5, Math.max(0, bottom - top));
        }
      }
      if (!reduce || !ready) raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden" }} aria-hidden>
      <canvas ref={ref} style={{ width: "100%", height: "100%", display: "block", touchAction: "pan-y" }} />
    </div>
  );
}
