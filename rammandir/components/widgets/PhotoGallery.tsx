"use client";

import { galleryPhotos } from "@/lib/config";
import { useArtboard } from "../Artboard";

const COUNT = 10;
const SECONDS_PER_TURN = 60;

/**
 * "Almost time to celebrate" photo wheel: ten rounded photos on a slowly turning
 * circle whose lower part is cropped. Geometry comes from the artboard (measured per breakpoint).
 */
export default function PhotoGallery() {
  const { u, artboard } = useArtboard();
  const g = artboard.gallery;
  const bg = artboard.style === "mobile" ? "rgb(255, 239, 226)" : "transparent";
  const radius = g.wheel / 2 - g.card / 2;
  const photos = Array.from({ length: COUNT }, (_, i) => galleryPhotos[i % galleryPhotos.length]);
  const size = Math.round(g.card * 2.5);

  return (
    <div style={{ width: "100%", height: "100%", background: bg, position: "relative" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: g.view * u, overflow: "hidden" }}>
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: g.wheelTop * u,
            width: g.wheel * u,
            height: g.wheel * u,
            marginLeft: (-g.wheel / 2) * u,
            animation: `wheel-spin ${SECONDS_PER_TURN}s linear infinite`,
          }}
        >
          {photos.map((src, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                width: g.card * u,
                height: g.card * u,
                margin: `${(-g.card / 2) * u}px 0 0 ${(-g.card / 2) * u}px`,
                transform: `rotate(${(360 / COUNT) * i}deg) translateY(${-radius * u}px)`,
              }}
            >
              <div style={{ width: "100%", height: "100%", borderRadius: 12 * u, overflow: "hidden", boxShadow: `rgba(0,0,0,0.15) 0 ${4 * u}px ${20 * u}px 0` }}>
                <img src={`${src}?w=${size}&h=${size}&fit=crop`} alt="" loading="lazy" draggable={false} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
