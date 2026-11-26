"use client";

import type { CSSProperties } from "react";
import type { Layer } from "@/lib/layout";
import { events } from "@/lib/config";
import { img } from "@/lib/assets";
import { useArtboard } from "../Artboard";

/**
 * Text placement inside the arch card, per Framer card design (offsets from the card's top,
 * in the card's own px). `base` is the card's design width; smaller boxes scale it down.
 */
const LAYOUT = {
  small: { base: 148, title: { top: 36.9, size: 23, lh: 27.6 }, lines: [[72.9, 12], [85.9, 12], [99.9, 12], [112.9, 12]], note: { top: 137.9, size: 8 } },
  tablet: { base: 267, title: { top: 57, size: 45, lh: 54 }, lines: [[127, 25], [158, 23], [188, 23], [218, 23]], note: { top: 257, size: 15 } },
  desktop: { base: 186, title: { top: 47, size: 23, lh: 27.6 }, lines: [[85, 13], [104, 13], [122.6, 13], [142, 13]], note: { top: 166.7, size: 10 } },
} as const;

const MAROON = "rgb(95, 37, 15)";
const RUST = "rgb(171, 86, 38)";

export default function EventCard({ layer, index }: { layer: Layer; index: number }) {
  const { u, artboard } = useArtboard();
  const L = LAYOUT[artboard.card];
  const s = (layer.w / L.base) * u; // card px → screen px
  const ev = events[index] ?? events[0];
  // On the 393px layout the first card's note is set one size larger.
  const noteSize = artboard.id === "mobile" && index === 0 ? 9 : L.note.size;

  const line = (top: number, text: string, size: number, family: string, color: string, lh: number) => {
    const style: CSSProperties = {
      position: "absolute",
      left: 0,
      right: 0,
      top: top * s,
      display: "flex",
      justifyContent: "center",
      whiteSpace: "nowrap",
      fontFamily: `"${family}", sans-serif`,
      fontSize: size * s,
      lineHeight: `${lh * s}px`,
      color,
    };
    return <div style={style}>{text}</div>;
  };

  const lineValues = [ev.day, ev.date, ev.place, ev.time];
  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }} role="group" aria-label={`${ev.title}, ${ev.day} ${ev.date}, ${ev.place}, ${ev.time}`}>
      <img className="layer-img" src={img(layer.src!)} alt="" draggable={false} loading="lazy" style={{ objectFit: "cover" }} />
      {line(L.title.top, ev.title, L.title.size, "IvyOra Display Medium", RUST, L.title.lh)}
      {L.lines.map(([top, size], i) => (
        <div key={i}>{line(top, lineValues[i], size, "Gotham Light", MAROON, 13.6)}</div>
      ))}
      {line(L.note.top, ev.note, noteSize, "Gotham Light", MAROON, 14)}
    </div>
  );
}
