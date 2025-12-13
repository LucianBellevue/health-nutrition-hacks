import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ReduxProvider from "@/components/providers/ReduxProvider";
import ThemeHydrator, { ThemeScript } from "@/components/theme/ThemeProvider";
import PreferencesHydrator from "@/components/preferences/PreferencesHydrator";

// Optimized font loading with next/font/google - Montserrat
const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap", // Prevents FOIT (Flash of Invisible Text)
  preload: true,
  weight: ["300", "400", "500", "600", "700", "800"],
});

const OG_IMAGE = "/android-chrome-512x512.png";
const SITE_URL = "https://www.healthnutritionhacks.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Health Nutrition Hacks – Evidence-Based Nutrition Tips & Healthy Recipes",
  description:
    "Discover science-backed nutrition advice, healthy recipes, and wellness tips to optimize your health and well-being.",
  keywords: ["nutrition", "health", "wellness", "healthy recipes", "diet tips", "nutrition science"],
  authors: [{ name: "Health Nutrition Hacks Team" }],
  openGraph: {
    title: "Health Nutrition Hacks – Evidence-Based Nutrition Tips & Healthy Recipes",
    description: "Evidence-based nutrition tips, healthy recipes, and actionable wellness guidance.",
    type: "website",
    url: "/",
    siteName: "Health Nutrition Hacks",
    images: [
      {
        url: OG_IMAGE,
        width: 512,
        height: 512,
        alt: "Health Nutrition Hacks logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Health Nutrition Hacks – Evidence-Based Nutrition Tips & Healthy Recipes",
    description: "Evidence-based nutrition tips, healthy recipes, and actionable wellness guidance.",
    images: [OG_IMAGE],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${montserrat.variable} antialiased flex flex-col min-h-screen bg-zinc-950 text-zinc-100 transition-colors duration-200`}>
        <ThemeScript />
        <ReduxProvider>
          <ThemeHydrator />
          <PreferencesHydrator />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </ReduxProvider>
      </body>
    </html>
  );
}
