import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { wedding } from "@/lib/config";
import { fontFaceCss } from "@/lib/assets";
import "./globals.css";

// The countdown digits use Inter 600/700, as on the Framer site.
const inter = Inter({ subsets: ["latin"], weight: ["400", "600", "700"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://rammandir.framer.website"),
  title: wedding.meta.title,
  description: wedding.meta.description,
  openGraph: {
    type: "website",
    title: wedding.meta.title,
    description: wedding.meta.description,
    images: [wedding.meta.ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: wedding.meta.title,
    description: wedding.meta.description,
    images: [wedding.meta.ogImage],
  },
  robots: { "max-image-preview": "large" },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#F7E8D4" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <style dangerouslySetInnerHTML={{ __html: fontFaceCss() }} />
        <link rel="preconnect" href="https://framerusercontent.com" crossOrigin="" />
      </head>
      <body>{children}</body>
    </html>
  );
}
