"use client";

import { thingsToKnow } from "@/lib/config";
import { img } from "@/lib/assets";

const MAROON = "rgb(95, 37, 15)";

/**
 * "Things to know" row: four 220×220 items separated by 5px gold rules, drawn at
 * design size (the layer scales it — ×0.38 on mobile, ×1 on desktop).
 */
export default function InfoIcons() {
  return (
    <div style={{ width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center", gap: 20 }}>
      {thingsToKnow.map((item, i) => (
        <div key={item.key} style={{ display: "contents" }}>
          {i > 0 && <div style={{ width: 5, height: 225, background: "rgb(221, 164, 93)", flexShrink: 0, marginTop: -1 }} />}
          <div style={{ position: "relative", width: 220, height: 220, flexShrink: 0 }}>
            <img src={img(item.icon)} alt="" loading="lazy" draggable={false} style={{ position: "absolute", left: 60, top: 12.5, width: 100, height: 100, objectFit: "cover" }} />
            <div style={{ position: "absolute", left: 0, right: 0, top: 127, textAlign: "center", fontFamily: '"IvyOra Display Medium", serif', fontSize: 26, lineHeight: "31.2px", color: MAROON }}>
              {item.title}
            </div>
            <div
              style={{
                position: "absolute",
                left: 10,
                width: 200,
                top: 159,
                height: 60,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                textAlign: "center",
                fontFamily: '"IvyOra Display Regular", serif',
                fontSize: 13,
                lineHeight: "15.6px",
                color: MAROON,
              }}
            >
              {item.lines.map((l) => (
                <p key={l} style={{ margin: 0 }}>
                  {l}
                </p>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
