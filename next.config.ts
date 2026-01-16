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
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
    // Prefer modern image formats for better compression
    formats: ["image/avif", "image/webp"],
    // Optimize image sizing
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Minimize layout shift
    minimumCacheTTL: 31536000, // 1 year cache for optimized images
  },
  // Performance optimizations
  compiler: {
    // Remove console.log in production
    removeConsole: process.env.NODE_ENV === "production",
  },
  experimental: {
    // Optimize package imports for smaller bundles and better tree-shaking
    optimizePackageImports: [
      "@reduxjs/toolkit",
      "react-redux",
      "next-mdx-remote",
      "remark-gfm",
      "rehype-slug",
      "rehype-autolink-headings",
    ],
    // Inline critical CSS to reduce render-blocking
    optimizeCss: true,
  },
  // Cache headers for static assets
  async headers() {
    return [
      {
        // Static assets (images, fonts, etc.)
        source: "/:all*(svg|jpg|jpeg|png|webp|avif|gif|ico|woff|woff2)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // JavaScript and CSS files
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // HTML pages - shorter cache with revalidation
        source: "/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=3600, stale-while-revalidate=86400",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
