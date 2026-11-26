/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Plain <img> tags are used on purpose: every layer is absolutely positioned
  // and sized from the Framer measurements, so next/image adds nothing here.
  images: { unoptimized: true },
};

export default nextConfig;
