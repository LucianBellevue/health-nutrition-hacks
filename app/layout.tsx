import type { Metadata } from "next";
import Script from "next/script";
import dynamic from "next/dynamic";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ReduxProvider from "@/components/providers/ReduxProvider";
import ThemeHydrator, { ThemeScript } from "@/components/theme/ThemeProvider";
import PreferencesHydrator from "@/components/preferences/PreferencesHydrator";

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
});

const OG_IMAGE = `https://www.healthnutritionhacks.com/api/og?title=${encodeURIComponent("Evidence-Based Nutrition Tips & Healthy Recipes")}&category=Health&author=HNH Team`;
const SITE_URL = "https://www.healthnutritionhacks.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Health Nutrition Hacks – Evidence-Based Nutrition Tips & Healthy Recipes",
  description:
    "Discover science-backed nutrition advice, healthy recipes, and wellness tips to optimize your health and well-being.",
  keywords: ["nutrition", "health", "wellness", "healthy recipes", "diet tips", "nutrition science"],
  authors: [{ name: "Health Nutrition Hacks Editorial Team" }],
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
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Health Nutrition Hacks – Evidence-Based Nutrition Tips & Healthy Recipes",
    description: "Evidence-based nutrition tips, healthy recipes, and actionable wellness guidance.",
    site: "@healthnutritionhacks",
    creator: "@healthnutritionhacks",
    images: [OG_IMAGE],
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
        <style dangerouslySetInnerHTML={{ __html: `
          :root{--background:#ecfdf5;--foreground:#18181b}
          .dark{--background:#09090b;--foreground:#fafafa}
          body{background:var(--background);color:var(--foreground)}
        `}} />
        {/* RSS Feed discovery */}
        <link rel="alternate" type="application/rss+xml" title="Health Nutrition Hacks RSS Feed" href="https://www.healthnutritionhacks.com/rss.xml" />
        {/* Preconnect to AdSense */}
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" />
        <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />
        {/* Preconnect to Google Analytics */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        {/* Google Analytics (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-R0CDW6G178"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-R0CDW6G178');
          `}
        </Script>
        {/* AdSense script deferred to not block rendering */}
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
