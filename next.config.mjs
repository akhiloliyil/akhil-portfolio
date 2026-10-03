/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Pin the workspace root — a stray lockfile in a parent directory otherwise
  // makes Next infer the wrong root and breaks page collection.
  turbopack: {
    root: import.meta.dirname,
  },
  images: {
    // AVIF first (smallest), WebP fallback; phone-sized widths first.
    formats: ["image/avif", "image/webp"],
    deviceSizes: [360, 414, 640, 750, 828, 1080, 1200, 1440, 1920],
  },
};

export default nextConfig;
