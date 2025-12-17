import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "m.media-amazon.com",
      },
      {
        protocol: "https",
        hostname: "cloudinary.images-iherb.com",
      },
    ],
  },
  // Performance optimizations
  compiler: {
    // Remove console.log in production
    removeConsole: process.env.NODE_ENV === "production",
  },
  experimental: {
    // Optimize package imports for smaller bundles
    optimizePackageImports: ["@reduxjs/toolkit", "react-redux"],
  },
};

export default nextConfig;
