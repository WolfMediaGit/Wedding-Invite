import type { Layer, Style } from "./layout";

/**
 * Motion presets, read off the live Framer site:
 *  - `intro`   : start state of the load animation (Framer "appear" effects)
 *  - `inView`  : start state of the scroll-into-view animation (runs once)
 *  - `parallax`: translateY = parallax × scrollY (Framer scroll-speed effect, measured
 *                as a linear factor from the top of the page)
 *  - `shrink`  : the hero names scale 1 → 0.4 and fade 1 → 0.3 over the first 500px of scroll
 * Offsets are design px; they are multiplied by the artboard scale at render time.
 */
export type MotionFrom = { x?: number; y?: number; rotate?: number; scale?: number; opacity?: number };

export type LayerMotion = {
  intro?: { from: MotionFrom; delay: number; duration: number };
  inView?: { from: MotionFrom; delay?: number };
  parallax?: number;
  shrink?: boolean;
};

/** Framer springs with bounce 0, expressed as framer-motion transitions. */
export const spring = (duration: number, delay = 0) => ({ type: "spring" as const, bounce: 0, duration, delay });
export const IN_VIEW_DURATION = 1.2;
export const SHRINK_RANGE = 500;

const INVITATION = /^(Ganpati|Shri Line|Groom Parents|Bride Parents|Label —|Invitation Line|Groom Name|Ampersand|Bride Name)/;
const LOCATION_ITEMS = /^(RSVP Form|Countdown (Heading|Divider|Intro Text|Timer)|Location Map|Looking Forward Heading|Things to Know (Heading|Subtext)|Info Icons Row)$/;

export function motionFor(layer: Layer, style: Style): LayerMotion | undefined {
  const n = layer.n;
  const desktop = style === "desktop";

  // ── Hero: load sequence + scroll speed ────────────────────────────────
  switch (n) {
    case "Sun":
      return { intro: { from: { y: 688 }, delay: 0.1, duration: 2.5 }, parallax: -0.7 };
    case "Cloud":
      return { intro: { from: { y: 864 }, delay: 0.1, duration: 2.5 }, parallax: -0.7 };
    case "Mountain":
      return { intro: { from: { y: 688 }, delay: 0.1, duration: 2.5 }, parallax: -0.5 };
    case "Temple":
      return { intro: { from: { y: desktop ? 211 : 375 }, delay: 0.1, duration: 2.5 }, parallax: -0.2 };
    case "Corner Decoration":
    case "Waving Flag":
      return { intro: { from: { y: desktop ? 313 : 608, opacity: 0.2 }, delay: 0.4, duration: 2.5 }, parallax: -0.1 };
    case "Hero Title — Tushar":
      return { intro: { from: { y: 862, rotate: 40 }, delay: 0.3, duration: 2.5 }, parallax: 0.8, shrink: true };
    case "Hero Title — and":
      return { intro: { from: { y: 785, rotate: 33 }, delay: 0.4, duration: 2.5 }, parallax: 0.7, shrink: true };
    case "Hero Title — Monika":
      return { intro: { from: { y: 864, rotate: -40 }, delay: 0.5, duration: 2.5 }, parallax: 0.6, shrink: true };
    case "Bells Frame":
      return { intro: { from: { scale: desktop ? 1.6 : 2.3 }, delay: 0.1, duration: 2.5 } };
    case "Scroll Arrow":
      return { inView: { from: { y: 32 } }, parallax: -0.2 };
    case "Pillar Backdrop":
      return { parallax: 0.05 };
    case "Timeline Heading":
    case "Timeline Subtext":
      return { inView: { from: { y: 32 } } };
    case "Meet the Couple Heading":
      return { inView: { from: { y: 110, scale: 1.35 } } };
    case "Message Scroll Text":
      return { inView: { from: { y: 24 } } };
    case "Photo Gallery":
      return desktop ? { inView: { from: { y: 48, scale: 0.96 } } } : undefined;
  }
  if (/^Hanging Bell/.test(n)) return { intro: { from: { opacity: 0 }, delay: 0.7, duration: 2 } };
  if (INVITATION.test(n)) return { inView: { from: { y: 24 } }, parallax: -0.2 };
  if (LOCATION_ITEMS.test(n)) return { inView: { from: { y: 56, scale: 0.94 } } };

  // Event cards 1–6: mobile cards swing in from alternate sides, desktop cards slide from the left.
  if (layer.t === "card") {
    if (desktop) return { inView: { from: { x: -48 } } };
    const odd = Number(n) % 2 === 1;
    return { inView: { from: { x: odd ? -60 : 60, y: 50, rotate: odd ? -10 : 10 } } };
  }
  return undefined;
}
