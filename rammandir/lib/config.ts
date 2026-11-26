/**
 * Everything a couple would change lives here. Visual layout (positions, sizes,
 * fonts) lives in data/*.json, measured from the Framer site.
 */

export const wedding = {
  bride: "Monika",
  groom: "Tushar",
  date: "2026-12-11T18:00:00+05:30",
  dateLabel: "11 Dec 2026",
  timeLabel: "6 PM",
  hashtag: "#2026",
  /** RSVP WhatsApp number in international format, digits only. */
  whatsappNumber: "918130429526",
  meta: {
    title: "Tushar & Monika | Wedding Invitation",
    description: "With the blessings of Lord Ganesha, the Tripathi family invites you to celebrate Tushar and Monika’s wedding.",
    ogImage: "https://framerusercontent.com/images/3JekLBRwVWegsCm3gX3wOcYeM.webp",
  },
};

/** RSVP option for the wedding venue. */
export const rsvpEvents = ["TEJO MAHALAYA"];
export const events = [{ title: "Wedding", day: "Friday", date: wedding.dateLabel, place: "TEJO MAHALAYA", time: wedding.timeLabel, note: "" }];
export const maxGuests = 50;

/** Builds the exact message the Framer form sends. */
export function rsvpMessage(name: string, selected: string[], people: string) {
  return `Hi! I'd like to RSVP.\nName: ${name}\nEvent(s): ${selected.join(", ")}\nNumber of People: ${people}`;
}

export type Venue = {
  label: string;
  name: string;
  /** The live site shows a different address string on its mobile and desktop layouts. */
  address: { mobile: string; desktop: string };
  lat: number;
  lng: number;
  googleMapsUrl?: string;
};

/** Location switcher under the map. Only the first location's coordinates exist on the live site. */
export const venues: Venue[] = [
  {
    label: "Wedding Venue",
    name: "TEJO MAHALAYA",
    address: {
      mobile: "HX6F+PQQ, Main Jhatikra Road, Deenpur, Najafgarh, Delhi – 110043",
      desktop: "HX6F+PQQ, Main Jhatikra Road, Deenpur, Najafgarh, Delhi – 110043",
    },
    lat: 28.6088,
    lng: 76.9856,
    googleMapsUrl: "https://maps.app.goo.gl/Z1c6nQAGQhwWQYGt5",
  },
];

export const message = `॥ वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ । निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा ॥

With the divine blessings of Lord Ganesha

WEDDING INVITATION — THE TRIPATHI FAMILY cordially invites you and your family to celebrate the auspicious wedding ceremony of TUSHAR, beloved son of Shri Jai Prakash Tripathi & Smt. Anita Tripathi, with MONIKA, beloved daughter of Shri Anil Bhandari & Smt. Sunita Bhandari.

Join us on 11 Dec 2026 at 6 PM. As two hearts unite and two families come together in the sacred bond of matrimony, we seek your gracious presence, love and blessings to make this celebration truly memorable.`;

/** "Almost time to celebrate" wheel. These are the placeholder photos the Framer site itself uses. */
export const galleryPhotos = [
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e",
  "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d",
  "https://images.unsplash.com/photo-1433086966358-54859d0ed716",
  "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05",
];

export const thingsToKnow = [
  { key: "hashtag", title: "Hashtag", icon: "EUPxZZrFKaWt9CBkczGVfDOj1c.webp", lines: ["While posting photos", "on social media please use", `the hashtag - ${wedding.hashtag}`] },
  { key: "weather", title: "Weather", icon: "KrRp2Koc5I3NO7nOduBFAoCVlQ.webp", lines: ["December evenings in Delhi can be cool. Consider bringing a light layer."] },
  { key: "staff", title: "Staff", icon: "hjcRmZcFhVMnmuu2IHPnk7pOudQ.webp", lines: ["We recommend the nearby hotel called Bhola Bhawan near the venue for the staff members"] },
  { key: "parking", title: "Parking", icon: "5uWzJVw11PDVfozRAkpivVBUPw.webp", lines: ["Valet parking for all our guests will be available at the venue"] },
];
