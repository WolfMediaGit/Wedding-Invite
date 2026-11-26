"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { wedding } from "@/lib/config";

type Parts = { DAYS: number; HOURS: number; MINUTES: number; SECONDS: number };

function remaining(target: number): Parts {
  const ms = Math.max(0, target - Date.now());
  const s = Math.floor(ms / 1000);
  return { DAYS: Math.floor(s / 86400), HOURS: Math.floor((s % 86400) / 3600), MINUTES: Math.floor((s % 3600) / 60), SECONDS: s % 60 };
}

/**
 * Live countdown in its Framer design size (333×63 px; the layer scales it).
 * Each digit rolls when it changes. Shows 00 once the date has passed, as the original does.
 */
export default function Countdown() {
  const target = new Date(wedding.date).getTime();
  const [parts, setParts] = useState<Parts>(() => remaining(target));

  useEffect(() => {
    const id = setInterval(() => setParts(remaining(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-start", gap: 39, width: "100%", height: "100%" }} role="timer" aria-live="off">
      {(Object.keys(parts) as (keyof Parts)[]).map((label) => {
        const v = String(Math.min(parts[label], 99)).padStart(2, "0");
        return (
          <div key={label} style={{ display: "flex", flexDirection: "column", alignItems: "center", width: label === "SECONDS" ? 56 : 53 }}>
            <div style={{ display: "flex", justifyContent: "center", width: 53, height: 45 }}>
              <Digit value={v[0]} />
              <Digit value={v[1]} />
            </div>
            <div style={{ marginTop: 6, fontFamily: "var(--font-inter), Inter, sans-serif", fontSize: 10, letterSpacing: 1, color: "rgb(136, 136, 136)", lineHeight: "12px" }}>
              {label}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Digit({ value }: { value: string }) {
  return (
    <div style={{ position: "relative", width: 27, height: 45, overflow: "hidden", display: "flex", justifyContent: "center" }}>
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          key={value}
          initial={{ y: "-100%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ type: "spring", bounce: 0, duration: 0.5 }}
          style={{ fontFamily: "var(--font-inter), Inter, sans-serif", fontWeight: 700, fontSize: 41, lineHeight: "41px", color: "rgb(221, 164, 93)" }}
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}
