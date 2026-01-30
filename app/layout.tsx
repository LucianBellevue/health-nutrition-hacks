import type { Metadata } from "next";
import Script from "next/script";
import dynamic from "next/dynamic";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { CriticalCSS } from "./CriticalCSS";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ReduxProvider from "@/components/providers/ReduxProvider";
import ThemeHydrator, { ThemeScript } from "@/components/theme/ThemeProvider";
import PreferencesHydrator from "@/components/preferences/PreferencesHydrator";
import GoogleAnalytics from "@/components/GoogleAnalytics";

// Dynamic imports for non-critical components to reduce initial JS bundle
// These components are code-split and loaded separately from the main bundle
const NewsletterPopup = dynamic(() => import("@/components/NewsletterPopup"));
const CookieConsent = dynamic(() => import("@/components/CookieConsent"));

// Optimized font loading with next/font/google - Montserrat
// Reduced weight variants to only those actually used for smaller font file
const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap", // Prevents FOIT (Flash of Invisible Text)
  preload: true,
  weight: ["400", "500", "600", "700"], // Removed 300, 800 - rarely used
  fallback: ["system-ui", "-apple-system", "sans-serif"],
  adjustFontFallback: true, // Adjust fallback font to reduce layout shift
});

const SITE_URL = "https://healthnutritionhacks.com";
const OG_IMAGE = `${SITE_URL}/api/og?title=${encodeURIComponent("Evidence-Based Nutrition Tips & Healthy Recipes")}&category=Health&author=HNH Team`;
const OG_LOGO = `${SITE_URL}/og-logo.png`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Health Nutrition Hacks – Evidence-Based Nutrition Tips & Healthy Recipes",
  description:
    "Discover science-backed nutrition advice, healthy recipes, and wellness tips to optimize your health and well-being.",
  keywords: ["nutrition", "health", "wellness", "healthy recipes", "diet tips", "nutrition science"],
  authors: [{ name: "Health Nutrition Hacks Editorial Team" }],
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      { rel: "icon", url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { rel: "icon", url: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
  },
  openGraph: {
    title: "Health Nutrition Hacks – Evidence-Based Nutrition Tips & Healthy Recipes",
    description: "Evidence-based nutrition tips, healthy recipes, and actionable wellness guidance.",
    type: "website",
    url: SITE_URL,
    siteName: "Health Nutrition Hacks",
    locale: "en_US",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Health Nutrition Hacks - Evidence-Based Nutrition",
        type: "image/png",
      },
      {
        url: OG_LOGO,
        width: 1200,
        height: 630,
        alt: "Health Nutrition Hacks Logo",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Health Nutrition Hacks – Evidence-Based Nutrition Tips & Healthy Recipes",
    description: "Evidence-based nutrition tips, healthy recipes, and actionable wellness guidance.",
    images: [OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: 'index, follow',
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
  other: {
    "google-adsense-account": "ca-pub-6330166847282337",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        {/* Inline critical CSS to eliminate render-blocking chain */}
        <CriticalCSS />
        {/* RSS Feed discovery */}
        <link rel="alternate" type="application/rss+xml" title="Health Nutrition Hacks RSS Feed" href="https://healthnutritionhacks.com/rss.xml" />
        {/* Resource hints for faster loading */}
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        {/* Google Analytics - Lazy loaded to reduce initial JS */}
        <GoogleAnalytics />
        {/* AdSense - Lazy loaded, components handle initialization via Intersection Observer */}
        <Script
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6330166847282337"
          crossOrigin="anonymous"
          strategy="lazyOnload"
        />
      </head>
      <body className={`${montserrat.variable} antialiased flex flex-col min-h-screen bg-zinc-950 text-zinc-100 transition-colors duration-200`}>
        <ThemeScript />
        <ReduxProvider>
          <ThemeHydrator />
          <PreferencesHydrator />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <NewsletterPopup />
          <CookieConsent />
        </ReduxProvider>
      </body>
    </html>
  );
}
