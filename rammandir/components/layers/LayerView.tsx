"use client";

import { motion, useReducedMotion, useScroll, useTransform, type MotionStyle, type MotionValue } from "framer-motion";
import type { CSSProperties, ReactNode } from "react";
import type { Layer } from "@/lib/layout";
import { motionFor, spring, IN_VIEW_DURATION, SHRINK_RANGE, type MotionFrom } from "@/lib/animations";
import { useArtboard } from "../Artboard";
import LayerContent from "./LayerContent";

const ZERO: MotionValue<number> | undefined = undefined;

/**
 * Positions one measured layer and wraps it in up to three motion shells:
 *   outer  — scroll-speed parallax and the hero-name shrink (scroll driven)
 *   middle — load / in-view entrance animation
 *   inner  — static rotation from the design (e.g. the flipped ornament)
 */
export default function LayerView({ layer, sectionTop }: { layer: Layer; sectionTop: number }) {
  const { u, artboard } = useArtboard();
  const reduce = useReducedMotion();
  const m = reduce ? undefined : motionFor(layer, artboard.style);

  const box: CSSProperties = {
    position: "absolute",
    left: layer.x * u,
    top: (layer.y - sectionTop) * u,
    width: layer.w * u,
    height: layer.h * u,
    zIndex: layer.z,
  };

  let content: ReactNode = <LayerContent layer={layer} />;
  if (layer.r) content = <div style={{ width: "100%", height: "100%", transform: `rotate(${layer.r}deg)` }}>{content}</div>;

  if (m?.intro || m?.inView) content = <Entrance m={m} u={u}>{content}</Entrance>;

  if (m?.parallax || m?.shrink) {
    return (
      <ScrollShell style={box} parallax={m.parallax ?? 0} shrink={!!m.shrink}>
        {content}
      </ScrollShell>
    );
  }
  return (
    <div style={box} data-layer={layer.id}>
      {content}
    </div>
  );
}

function scaled(from: MotionFrom, u: number, defaultOpacity: number) {
  return {
    x: (from.x ?? 0) * u,
    y: (from.y ?? 0) * u,
    rotate: from.rotate ?? 0,
    scale: from.scale ?? 1,
    opacity: from.opacity ?? defaultOpacity,
  };
}

const REST = { x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 };

function Entrance({ m, u, children }: { m: NonNullable<ReturnType<typeof motionFor>>; u: number; children: ReactNode }) {
  const fill = { width: "100%", height: "100%" };
  if (m.intro) {
    return (
      <motion.div style={fill} initial={scaled(m.intro.from, u, 1)} animate={REST} transition={spring(m.intro.duration, m.intro.delay)}>
        {children}
      </motion.div>
    );
  }
  const iv = m.inView!;
  return (
    <motion.div
      style={fill}
      initial={scaled(iv.from, u, 0)}
      whileInView={REST}
      viewport={{ once: true, amount: 0.15 }}
      transition={spring(IN_VIEW_DURATION, iv.delay ?? 0)}
    >
      {children}
    </motion.div>
  );
}

/** Framer scroll-speed effect: translateY grows linearly with page scroll. */
function ScrollShell({ style, parallax, shrink, children }: { style: CSSProperties; parallax: number; shrink: boolean; children: ReactNode }) {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, (v) => v * parallax);
  const scale = useTransform(scrollY, [0, SHRINK_RANGE], [1, 0.4], { clamp: true });
  const opacity = useTransform(scrollY, [0, SHRINK_RANGE], [1, 0.3], { clamp: true });
  return (
    <motion.div style={{ ...(style as MotionStyle), y, scale: shrink ? scale : ZERO, opacity: shrink ? opacity : ZERO, willChange: "transform" }}>
      {children}
    </motion.div>
  );
}
