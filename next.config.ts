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
        hostname: "cloudinary.images-iherb.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "m.media-amazon.com",
      },
      {
        protocol: "https",
        hostname: "ws-na.amazon-adsystem.com",
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
    // React compiler optimizations
    reactRemoveProperties: process.env.NODE_ENV === "production" ? { properties: ['^data-test'] } : false,
  },
  // Target modern browsers to avoid unnecessary polyfills
  transpilePackages: [],
  // Production optimizations
  productionBrowserSourceMaps: false, // Disable source maps in production
  // External packages (moved from experimental in Next.js 16)
  serverExternalPackages: ['prisma', '@prisma/client'],
  // Turbopack configuration (Next.js 16 default bundler)
  turbopack: {},
  // Webpack optimizations for better code splitting
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      // Optimize chunk splitting
      config.optimization = {
        ...config.optimization,
        moduleIds: 'deterministic',
        runtimeChunk: { name: 'runtime' },
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
            // Separate vendor chunks
            framework: {
              name: 'framework',
              chunks: 'all',
              test: /(?<!node_modules.*)[\\/]node_modules[\\/](react|react-dom|scheduler|next)[\\/]/,
              priority: 40,
              enforce: true,
            },
            // Third-party libraries
            lib: {
              test: /[\\/]node_modules[\\/]/,
              name(module: { context: string }) {
                const packageName = module.context.match(
                  /[\\/]node_modules[\\/](.*?)([\\/]|$)/
                )?.[1];
                return `npm.${packageName?.replace('@', '')}`;
              },
              priority: 30,
              minChunks: 1,
              reuseExistingChunk: true,
            },
            // Common components
            commons: {
              name: 'commons',
              minChunks: 2,
              priority: 20,
              reuseExistingChunk: true,
            },
            // Separate styles chunk
            styles: {
              name: 'styles',
              test: /\.(css|scss|sass)$/,
              chunks: 'all',
              enforce: true,
              priority: 50,
            },
          },
          maxInitialRequests: 25,
          minSize: 20000,
        },
        minimize: true,
      };
    }
    return config;
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
      "lucide-react",
    ],
    // Inline critical CSS to reduce render-blocking
    optimizeCss: true,
    // CSS optimization (true for enabled, 'strict' for strict mode)
    cssChunking: true,
  },
  // Redirects for SEO consistency - www redirects to non-www (canonical)
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "www.healthnutritionhacks.com",
          },
        ],
        destination: "https://healthnutritionhacks.com/:path*",
        permanent: true,
      },
    ];
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
        // CSS files - prioritize with shorter cache for hot updates
        source: "/_next/static/css/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
        ],
      },
      {
        // JavaScript files
        source: "/_next/static/chunks/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // Other Next.js static files
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
