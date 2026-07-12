/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Pin the workspace root — a stray lockfile in a parent directory otherwise
  // makes Next infer the wrong root and breaks page collection.
  turbopack: {
    root: import.meta.dirname,
  },
};

export default nextConfig;
