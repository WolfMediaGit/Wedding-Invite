"use client";

import { useEffect, useState } from "react";
import Lenis from "lenis";
import Artboard from "./Artboard";
import { pickArtboard, type ArtboardData } from "@/lib/layout";

type Frame = { artboard: ArtboardData; u: number };

function measure(): Frame {
  // clientWidth excludes the scrollbar, matching how Framer resolves its breakpoints.
  return pickArtboard(document.documentElement.clientWidth);
}

/**
 * Picks the Framer artboard for the current width, draws it centred at the right
 * scale, and turns on smooth scrolling (Framer "Smooth Scroll" utility).
 */
export default function Invitation() {
  const [frame, setFrame] = useState<Frame | null>(null);

  useEffect(() => {
    const update = () => setFrame(measure());
    update();
    let raf = 0;
    const onResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ lerp: 0.1 });
    let id = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      id = requestAnimationFrame(loop);
    };
    id = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(id);
      lenis.destroy();
    };
  }, []);

  if (!frame) {
    // First paint before measuring: the hero background colour, so there is no white flash.
    return <div style={{ minHeight: "100vh", background: "rgb(247, 232, 212)" }} aria-hidden />;
  }

  return <Artboard key={frame.artboard.id} data={frame.artboard} u={frame.u} />;
}
