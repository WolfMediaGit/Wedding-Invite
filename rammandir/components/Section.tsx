"use client";

import type { SectionData } from "@/lib/layout";
import { useArtboard } from "./Artboard";
import LayerView from "./layers/LayerView";

/**
 * One Framer section ("1 — Hero & Invitation", "2 — Wedding Timeline", "3 — Meet the Couple",
 * "4 — Location & Countdown"). The section is a stacking context with the same z-index as the
 * original, and clips its children where the original does.
 */
export default function Section({ data }: { data: SectionData }) {
  const { u } = useArtboard();
  return (
    <section
      id={data.id}
      aria-label={data.name.split("—")[1]?.trim()}
      style={{
        position: "absolute",
        left: 0,
        width: "100%",
        top: data.top * u,
        height: data.height * u,
        zIndex: data.z,
        overflow: data.clip ? "clip" : "visible",
        background: data.bg ?? undefined,
      }}
    >
      {data.elements.map((layer) => (
        <LayerView key={layer.id} layer={layer} sectionTop={data.top} />
      ))}
    </section>
  );
}
