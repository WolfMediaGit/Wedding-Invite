"use client";

import type { Layer } from "@/lib/layout";
import { useArtboard } from "../Artboard";

const px = (v: string | undefined, u: number) => {
  if (!v || v === "normal") return "normal";
  const n = parseFloat(v);
  return Number.isFinite(n) ? `${n * u}px` : v;
};

/** A Framer text block: one paragraph per measured line, sized in design px × u. */
export default function TextLayer({ layer }: { layer: Layer }) {
  const { u } = useArtboard();
  return (
    <div className={`layer-text${layer.wrap ? " wrap" : ""}`} style={{ width: "100%", height: "100%" }}>
      {layer.items!.map((it, i) => (
        <p
          key={i}
          style={{
            fontFamily: `"${it.ff}", serif`,
            fontSize: it.fs * u,
            lineHeight: px(it.lh, u),
            letterSpacing: px(it.ls, u),
            color: it.c,
            textAlign: "center",
          }}
        >
          {it.tx}
        </p>
      ))}
    </div>
  );
}
