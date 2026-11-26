"use client";

import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";
import type { Layer } from "@/lib/layout";
import { message } from "@/lib/config";
import { useArtboard } from "../Artboard";

const MAROON = [95, 37, 15];

/**
 * The couple's note inside the scalloped frame. Words start at 22% opacity and
 * light up one by one as the block scrolls through the viewport (Framer text-reveal).
 * Mobile: Gotham Book 13/15.6 in a 275px box; desktop scales with the box width.
 */
export default function MessageReveal({ layer }: { layer: Layer }) {
  const { u } = useArtboard();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });
  const paragraphs = message.split("\n\n");
  const words = paragraphs.map((paragraph) => paragraph.split(/\s+/).filter(Boolean));
  const totalWords = words.reduce((total, paragraph) => total + paragraph.length, 0);
  const k = layer.w / 275;

  return (
    <div
      ref={ref}
      style={{
        width: "100%",
        height: "100%",
        fontFamily: '"Gotham Book", sans-serif',
        fontSize: 13 * k * u,
        lineHeight: `${15.6 * k * u}px`,
        textAlign: "center",
      }}
    >
      {words.map((paragraph, paragraphIndex) => (
        <p key={paragraphIndex} style={{ margin: paragraphIndex === 0 ? 0 : "5px 0 0" }}>
          {paragraph.map((word, wordIndex) => {
            const index = words.slice(0, paragraphIndex).reduce((total, line) => total + line.length, 0) + wordIndex;
            return (
              <Word key={`${paragraphIndex}-${wordIndex}`} progress={scrollYProgress} index={index} total={totalWords}>
                {word}
              </Word>
            );
          })}
        </p>
      ))}
    </div>
  );
}

function Word({ progress, index, total, children }: { progress: MotionValue<number>; index: number; total: number; children: string }) {
  const start = index / total;
  const alpha = useTransform(progress, [start, start + 1 / total], [0.22, 1], { clamp: true });
  const color = useTransform(alpha, (a) => `rgba(${MAROON.join(", ")}, ${a})`);
  return (
    <>
      <motion.span style={{ display: "inline-block", color }}>{children}</motion.span>{" "}
    </>
  );
}
