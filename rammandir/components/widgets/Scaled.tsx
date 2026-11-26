"use client";

import type { ReactNode } from "react";
import type { Layer } from "@/lib/layout";
import { useArtboard } from "../Artboard";

/**
 * Renders children in their own design-px coordinate space (w/k × h/k),
 * scaled to the layer box. `k` is the static scale Framer applies to the block;
 * `u` is the artboard scale. Children size themselves in plain design px.
 */
export default function Scaled({ layer, k, children }: { layer: Layer; k: number; children: ReactNode }) {
  const { u } = useArtboard();
  const w = layer.w / k;
  const h = layer.h / k;
  return (
    <div style={{ width: w, height: h, transform: `scale(${k * u})`, transformOrigin: "0 0", position: "relative" }}>
      {children}
    </div>
  );
}
