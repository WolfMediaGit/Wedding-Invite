"use client";

import { createContext, useContext } from "react";
import type { ArtboardData } from "@/lib/layout";
import Section from "./Section";

type ArtboardCtx = { u: number; artboard: ArtboardData };
const Ctx = createContext<ArtboardCtx | null>(null);

/** Design-px → screen-px scale (`u`) and the artboard being drawn. */
export const useArtboard = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useArtboard must be used inside <Artboard>");
  return ctx;
};

/**
 * The page is one Framer artboard: four absolutely positioned sections that overlap
 * exactly as on the original (later sections paint over earlier ones by z-index).
 * The artboard is centred; anything wider than the window is cropped, as on Framer.
 */
export default function Artboard({ data, u }: { data: ArtboardData; u: number }) {
  const width = data.width * u;
  const timelineIndex = data.sections.findIndex((section) => section.id.startsWith("wedding-timeline"));
  const timeline = timelineIndex >= 0 ? data.sections[timelineIndex] : undefined;
  const previous = timelineIndex > 0 ? data.sections[timelineIndex - 1] : undefined;
  const next = timelineIndex >= 0 ? data.sections[timelineIndex + 1] : undefined;
  const collapseBy = timeline && previous && next
    ? Math.max(0, next.top - (previous.top + previous.height))
    : timeline?.top ?? 0;
  const sections = data.sections
    .filter((section) => !section.id.startsWith("wedding-timeline"))
    .map((section) => {
      const shift = timeline && section.top > timeline.top ? collapseBy : 0;
      return shift
        ? {
            ...section,
            top: section.top - shift,
            elements: section.elements.map((layer) => ({ ...layer, y: layer.y - shift })),
          }
        : section;
    });
  const height = data.height - collapseBy;

  return (
    <Ctx.Provider value={{ u, artboard: data }}>
      <div data-artboard={data.id} style={{ position: "relative", width: "100%", height: height * u, overflow: "clip" }}>
        <div style={{ position: "absolute", top: 0, left: "50%", width, height: "100%", marginLeft: -width / 2 }}>
          {sections.map((section) => (
            <Section key={section.id} data={section} />
          ))}
        </div>
      </div>
    </Ctx.Provider>
  );
}
