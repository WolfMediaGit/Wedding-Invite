"use client";

import { motion, useAnimationControls, useReducedMotion } from "framer-motion";
import { useEffect } from "react";
import { img } from "@/lib/assets";

/**
 * Hanging bell with flowers. Hangs from its top edge, sways gently, and rings
 * (a larger damped swing) when tapped — the Framer component is a pointer target.
 */
export default function HangingBell({ src }: { src: string }) {
  const controls = useAnimationControls();
  const reduce = useReducedMotion();

  const sway = () =>
    controls.start({
      rotate: [0, 3, 0, -3, 0],
      transition: { duration: 4, ease: "easeInOut", repeat: Infinity },
    });

  useEffect(() => {
    if (!reduce) sway();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce]);

  const ring = async () => {
    await controls.start({
      rotate: [0, 16, -12, 8, -5, 2, 0],
      transition: { duration: 1.6, ease: "easeOut" },
    });
    if (!reduce) sway();
  };

  return (
    <div
      role="img"
      aria-label="Hanging bell with flowers"
      onClick={ring}
      style={{ width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "flex-start", cursor: "pointer", touchAction: "manipulation" }}
    >
      <motion.div animate={controls} style={{ width: "100%", height: "100%", transformOrigin: "50% 0%" }}>
        <img src={img(src)} alt="Hanging bell" draggable={false} style={{ width: "100%", height: "100%", objectFit: "contain", userSelect: "none", pointerEvents: "none" }} />
      </motion.div>
    </div>
  );
}
