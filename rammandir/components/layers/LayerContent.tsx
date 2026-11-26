"use client";

import type { Layer } from "@/lib/layout";
import { img } from "@/lib/assets";
import { useArtboard } from "../Artboard";
import TextLayer from "./TextLayer";
import EventCard from "../widgets/EventCard";
import HangingBell from "../widgets/HangingBell";
import WavingFlag from "../widgets/WavingFlag";
import FlockingBirds from "../widgets/FlockingBirds";
import ScrollArrow from "../widgets/ScrollArrow";
import MessageReveal from "../widgets/MessageReveal";
import PhotoGallery from "../widgets/PhotoGallery";
import RSVPForm from "../widgets/RSVPForm";
import Countdown from "../widgets/Countdown";
import LocationMap from "../widgets/LocationMap";
import InfoIcons from "../widgets/InfoIcons";
import Scaled from "../widgets/Scaled";

const EAGER = /Sky Background|Cloud|Mountain|Sun|Temple|Bells Frame|Corner Decoration/;

export default function LayerContent({ layer }: { layer: Layer }) {
  const { artboard } = useArtboard();

  switch (layer.t) {
    case "i":
      return (
        <img
          className="layer-img"
          src={img(layer.src!)}
          alt=""
          draggable={false}
          loading={EAGER.test(layer.n) ? "eager" : "lazy"}
          decoding="async"
          style={{ objectFit: (layer.fit as "cover" | "contain") ?? "cover" }}
        />
      );
    case "t":
      return <TextLayer layer={layer} />;
    case "b":
      return <div style={{ width: "100%", height: "100%", background: layer.bg }} />;
    case "card":
      return <EventCard layer={layer} index={Number(layer.n) - 1} />;
  }

  // Components ("c"): Framer code components / interactive blocks.
  const n = layer.n;
  if (n.startsWith("Hanging Bell")) return <HangingBell src={layer.src!} />;
  if (n === "Waving Flag") return <WavingFlag />;
  if (n === "Flocking Birds") return <FlockingBirds />;
  if (n === "Scroll Arrow") return <ScrollArrow />;
  if (n === "Message Scroll Text") return <MessageReveal layer={layer} />;
  if (n === "Photo Gallery") return <PhotoGallery />;

  // Blocks laid out at their own design size, then statically scaled (Framer scale property).
  const k = layer.k ?? 1;
  if (n === "RSVP Form") return <Scaled layer={layer} k={k}><RSVPForm style={artboard.style} width={layer.w / k} /></Scaled>;
  if (n === "Countdown Timer") return <Scaled layer={layer} k={k}><Countdown /></Scaled>;
  if (n === "Location Map") return <Scaled layer={layer} k={k}><LocationMap style={artboard.style} width={layer.w / k} /></Scaled>;
  if (n === "Info Icons Row") return <Scaled layer={layer} k={k}><InfoIcons /></Scaled>;
  return null;
}
