"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from "react";
import type { Map as LeafletMap, Marker } from "leaflet";
import { Check, Copy, Crosshair, ArrowUpRight } from "lucide-react";
import type { Style } from "@/lib/layout";
import { venues } from "@/lib/config";

const FONT = 'Gotham, -apple-system, "system-ui", "Segoe UI", Roboto, sans-serif';
const CHIP: React.CSSProperties = { background: "rgba(0, 0, 0, 0.55)", color: "#fff", borderRadius: 8, fontSize: 13, fontWeight: 600, fontFamily: FONT };

/** Mobile-style block stacks map, card and a 2×2 switcher; desktop-style sits map | card + list side by side. */
const VARIANT = {
  mobile: { dir: "column", mapH: 320, cardH: undefined, text: "rgb(26, 26, 26)", active: "rgb(179, 116, 67)", idle: "rgb(17, 17, 17)", grid: true },
  desktop: { dir: "row", mapH: 399, cardH: 163, text: "rgb(95, 37, 15)", active: "rgb(171, 86, 38)", idle: "rgb(95, 37, 15)", grid: false },
} as const;

const ZOOM = 14;

/**
 * OpenStreetMap venue map (Leaflet, as on the Framer site). The map is inert until
 * tapped so it never hijacks page scroll; location buttons switch the venue card,
 * pin and "Open in Google Maps" link.
 */
export default function LocationMap({ style, width }: { style: Style; width: number }) {
  const v = VARIANT[style];
  const mapW = style === "desktop" ? (width - 24) / 2 : width;
  const [active, setActive] = useState(0);
  const [interactive, setInteractive] = useState(false);
  const [copied, setCopied] = useState(false);
  const el = useRef<HTMLDivElement>(null);
  const map = useRef<LeafletMap | null>(null);
  const marker = useRef<Marker | null>(null);
  const venue = venues[active];
  const address = venue.address[style];

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !el.current || map.current) return;
      const base = "https://unpkg.com/leaflet@1.9.4/dist/images/";
      L.Icon.Default.mergeOptions({ iconUrl: `${base}marker-icon.png`, iconRetinaUrl: `${base}marker-icon-2x.png`, shadowUrl: `${base}marker-shadow.png` });
      const m = L.map(el.current, { center: [venues[0].lat, venues[0].lng], zoom: ZOOM, dragging: false, scrollWheelZoom: false, touchZoom: false, doubleClickZoom: false, boxZoom: false, keyboard: false });
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19, attribution: "© OpenStreetMap" }).addTo(m);
      marker.current = L.marker([venues[0].lat, venues[0].lng]).addTo(m);
      map.current = m;
    })();
    return () => {
      cancelled = true;
      map.current?.remove();
      map.current = null;
    };
  }, []);

  useEffect(() => {
    const m = map.current;
    if (!m) return;
    m.setView([venue.lat, venue.lng], m.getZoom(), { animate: true });
    marker.current?.setLatLng([venue.lat, venue.lng]);
  }, [venue]);

  const enable = () => {
    const m = map.current;
    if (!m) return;
    m.dragging.enable();
    m.touchZoom.enable();
    m.doubleClickZoom.enable();
    m.scrollWheelZoom.enable();
    setInteractive(true);
  };

  const recenter = () => map.current?.setView([venue.lat, venue.lng], ZOOM, { animate: true });

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`${venue.name}, ${address}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable (insecure context) */
    }
  };

  const gmaps = venue.googleMapsUrl ?? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${venue.lat}, ${venue.lng}`)}`;

  return (
    <div style={{ width, display: "flex", flexDirection: v.dir, gap: v.dir === "row" ? 24 : 16, fontFamily: FONT }}>
      {/* Map */}
      <div className="wedding-map" style={{ position: "relative", width: mapW, height: v.mapH, borderRadius: 16, overflow: "hidden", flexShrink: 0, isolation: "isolate" }}>
        <div ref={el} style={{ position: "absolute", inset: 0 }} />
        {!interactive && (
          <button
            type="button"
            onClick={enable}
            aria-label="Tap to interact with map"
            style={{ position: "absolute", inset: 0, zIndex: 500, background: "transparent", border: 0, cursor: "pointer", padding: 0 }}
          >
            <span style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)", background: "rgba(0, 0, 0, 0.6)", color: "#fff", borderRadius: 20, fontSize: 12, fontWeight: 600, padding: "8px 14px", whiteSpace: "nowrap" }}>
              Tap to interact with map
            </span>
          </button>
        )}
        <div style={{ ...CHIP, position: "absolute", top: 12, right: 12, zIndex: 600, padding: "8px 12px", lineHeight: "16.9px", pointerEvents: "none" }}>Nearby Location</div>
        <button
          type="button"
          onClick={recenter}
          aria-label="Re-centre map on venue"
          style={{ ...CHIP, position: "absolute", left: 12, bottom: 12, zIndex: 600, width: 34, height: 34, border: 0, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
        >
          <Crosshair size={16} strokeWidth={2} />
        </button>
        <a
          href={gmaps}
          target="_blank"
          rel="noopener noreferrer"
          style={{ ...CHIP, position: "absolute", right: 12, bottom: 12, zIndex: 600, display: "flex", alignItems: "center", gap: 6, padding: "8px 12px", textDecoration: "none", lineHeight: "16px" }}
        >
          Open in Google Maps <ArrowUpRight size={14} strokeWidth={2.2} />
        </a>
      </div>

      {/* Venue card + switcher */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16, width: mapW }}>
        <div style={{ position: "relative", height: v.cardH, minHeight: 102, background: "rgb(228, 188, 131)", borderRadius: 16, padding: "20px 24px", boxSizing: "border-box", color: v.text }}>
          <div style={{ fontSize: 18, fontWeight: 700, lineHeight: "22px" }}>{venue.name}</div>
          <div style={{ marginTop: 8, fontSize: 14, lineHeight: "17px", opacity: 0.8, paddingRight: 40, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical" }}>
            {address}
          </div>
          <button
            type="button"
            onClick={copy}
            aria-label="Copy address"
            style={{ position: "absolute", right: 16, bottom: 16, width: 32, height: 32, borderRadius: 8, border: 0, background: "rgba(255, 255, 255, 0.12)", color: v.text, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
          </button>
        </div>

        <div style={v.grid ? { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 } : { display: "flex", flexDirection: "column", gap: 12 }}>
          {venues.map((loc, i) => {
            const on = i === active;
            return (
              <button
                key={i}
                type="button"
                onClick={() => setActive(i)}
                aria-pressed={on}
                style={{
                  height: 46,
                  borderRadius: 16,
                  border: `1px solid ${on ? v.active : "rgb(208, 208, 208)"}`,
                  background: on ? v.active : "#fff",
                  color: on ? "#fff" : v.idle,
                  fontFamily: "sans-serif",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                {loc.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
