"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Style } from "@/lib/layout";
import { maxGuests, rsvpEvents, rsvpMessage, wedding } from "@/lib/config";

const MAROON = "rgb(95, 37, 15)";
const BORDER = "rgb(224, 224, 224)";
const PLACEHOLDER = "rgba(0, 0, 0, 0.4)";
const GREEN = "rgb(37, 211, 102)";
const FONT = 'Gotham, -apple-system, "system-ui", "Segoe UI", Roboto, sans-serif';

/** Heading differs between Framer's mobile-style and desktop-style forms. */
const TITLE: Record<Style, string> = { mobile: "RSVP via WhatsApp", desktop: "Please confirm your presence" };

/**
 * WhatsApp RSVP card. Name + multi-select events + guest count; the button stays
 * at 50% opacity until all three are filled, then opens wa.me with the same
 * message text the original form builds.
 */
export default function RSVPForm({ style, width }: { style: Style; width: number }) {
  const [name, setName] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [people, setPeople] = useState("");
  const [open, setOpen] = useState(false);
  const [touched, setTouched] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: PointerEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [open]);

  const valid = name.trim().length > 0 && selected.length > 0 && people !== "";
  const href = useMemo(
    () => (valid ? `https://wa.me/${wedding.whatsappNumber}?text=${encodeURIComponent(rsvpMessage(name.trim(), selected, people))}` : undefined),
    [valid, name, selected, people],
  );

  const toggle = (ev: string) => setSelected((s) => (s.includes(ev) ? s.filter((x) => x !== ev) : [...s, ev]));
  const eventLabel = selected.length === 0 ? "Select Event" : selected.length === 1 ? selected[0] : `${selected.length} Selected`;

  const field: React.CSSProperties = {
    height: 43,
    border: `1px solid ${BORDER}`,
    borderRadius: 12,
    background: "#fff",
    fontFamily: FONT,
    fontSize: 14,
    color: MAROON,
    outline: "none",
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      style={{ width, display: "flex", flexDirection: "column", gap: 12, padding: 20, background: "#fff", borderRadius: 20, fontFamily: FONT, boxSizing: "border-box" }}
      aria-label="RSVP via WhatsApp"
    >
      <div style={{ fontSize: 17, fontWeight: 700, color: MAROON, lineHeight: "21px" }}>{TITLE[style]}</div>

      <input
        type="text"
        name="name"
        placeholder="Full Name"
        aria-label="Full Name"
        autoComplete="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        aria-invalid={touched && !name.trim()}
        style={{ ...field, padding: "0 14px", borderColor: touched && !name.trim() ? "rgb(229, 115, 115)" : BORDER }}
      />

      <div style={{ display: "flex", gap: 10, height: 45 }}>
        <div ref={menuRef} style={{ position: "relative", flex: 1, minWidth: 0 }}>
          <button
            type="button"
            aria-haspopup="listbox"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
            style={{
              ...field,
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 14px",
              cursor: "pointer",
              color: selected.length ? MAROON : PLACEHOLDER,
              borderColor: touched && !selected.length ? "rgb(229, 115, 115)" : BORDER,
            }}
          >
            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{eventLabel}</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginLeft: 6, transform: open ? "rotate(180deg)" : "none", transition: "transform 0.15s" }}>
              <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          {open && (
            <div
              role="listbox"
              aria-multiselectable
              style={{
                position: "absolute",
                top: 51,
                left: 0,
                width: "100%",
                background: "#fff",
                border: `1px solid ${BORDER}`,
                borderRadius: 12,
                boxShadow: "rgba(0, 0, 0, 0.12) 0px 8px 24px 0px",
                zIndex: 20,
                overflow: "hidden",
              }}
            >
              {rsvpEvents.map((ev) => {
                const on = selected.includes(ev);
                return (
                  <div
                    key={ev}
                    role="option"
                    aria-selected={on}
                    tabIndex={0}
                    onClick={() => toggle(ev)}
                    onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), toggle(ev))}
                    style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", fontSize: 14, color: MAROON, cursor: "pointer", lineHeight: "17px" }}
                  >
                    <span
                      style={{
                        width: 16,
                        height: 16,
                        flexShrink: 0,
                        borderRadius: 4,
                        border: `1.5px solid ${on ? GREEN : BORDER}`,
                        background: on ? GREEN : "transparent",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxSizing: "border-box",
                      }}
                    >
                      {on && (
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                          <path d="M5 13l4 4L19 7" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </span>
                    {ev}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <select
          name="people"
          value={people}
          onChange={(e) => setPeople(e.target.value)}
          aria-label="No. of People"
          style={{
            ...field,
            flex: 1,
            minWidth: 0,
            height: 45,
            padding: "0 14px",
            color: people ? MAROON : PLACEHOLDER,
            cursor: "pointer",
            borderColor: touched && !people ? "rgb(229, 115, 115)" : BORDER,
          }}
        >
          <option value="" disabled>
            No. of People
          </option>
          {Array.from({ length: maxGuests }, (_, i) => (
            <option key={i + 1} value={String(i + 1)}>
              {i + 1}
            </option>
          ))}
        </select>
      </div>

      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-disabled={!valid}
        onClick={(e) => {
          if (!valid) {
            e.preventDefault();
            setTouched(true);
          }
        }}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          padding: "14px 16px",
          background: GREEN,
          color: "#fff",
          borderRadius: 14,
          fontSize: 15,
          fontWeight: 700,
          lineHeight: "18px",
          textDecoration: "none",
          opacity: valid ? 1 : 0.5,
          cursor: valid ? "pointer" : "not-allowed",
          transition: "opacity 0.2s",
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M17.6 6.32A7.85 7.85 0 0012.05 4a7.94 7.94 0 00-6.9 11.9L4 20l4.2-1.1a7.9 7.9 0 003.85 1h.01a7.94 7.94 0 005.54-13.58zM12.05 18.4a6.6 6.6 0 01-3.36-.92l-.24-.14-2.5.65.67-2.43-.16-.25a6.6 6.6 0 1112.24-3.5 6.55 6.55 0 01-6.65 6.6zm3.6-4.93c-.2-.1-1.17-.58-1.35-.64-.18-.07-.32-.1-.45.1-.13.2-.5.64-.62.77-.11.13-.23.14-.43.05-.2-.1-.83-.31-1.58-.98a5.9 5.9 0 01-1.1-1.36c-.11-.2-.01-.3.09-.4.09-.09.2-.23.3-.35.1-.11.13-.2.2-.33.07-.13.03-.25-.02-.35-.05-.1-.45-1.08-.61-1.48-.16-.39-.33-.33-.45-.34h-.38c-.13 0-.35.05-.53.25-.18.2-.7.68-.7 1.66 0 .98.71 1.93.81 2.06.1.13 1.4 2.14 3.4 3 .47.2.84.33 1.13.42.47.15.9.13 1.24.08.38-.06 1.17-.48 1.33-.94.17-.46.17-.86.12-.94-.05-.09-.18-.14-.38-.24z"
            fill="currentColor"
          />
        </svg>
        Send via WhatsApp
      </a>
    </form>
  );
}
