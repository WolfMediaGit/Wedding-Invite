"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useArtboard } from "../Artboard";

/** Long gold arrow under "On The Following Events" (SVG copied from the Framer component). */
export default function ScrollArrow() {
  const { u } = useArtboard();
  const reduce = useReducedMotion();
  return (
    <motion.div
      style={{ display: "flex", justifyContent: "center", alignItems: "flex-end", width: "100%", height: "100%", pointerEvents: "none" }}
      animate={reduce ? undefined : { y: [0, 10 * u, 0] }}
      transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
    >
      <svg width={40 * u} height="100%" viewBox="0 0 40 165" fill="none" style={{ overflow: "visible" }} aria-hidden>
        <line x1="20" y1="155" x2="20" y2="30" stroke="rgb(179, 116, 67)" strokeWidth="3" strokeLinecap="round" />
        <path d="M 6.67 141.67 L 20 155 L 33.33 141.67" stroke="rgb(179, 116, 67)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </motion.div>
  );
}
