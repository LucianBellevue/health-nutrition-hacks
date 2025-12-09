import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Optimized font loading with next/font/google - Montserrat
const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap", // Prevents FOIT (Flash of Invisible Text)
  preload: true,
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Health Nutrition Hacks – Evidence-Based Nutrition Tips & Healthy Recipes",
  description: "Discover science-backed nutrition advice, healthy recipes, and wellness tips to optimize your health and well-being.",
  keywords: ["nutrition", "health", "wellness", "healthy recipes", "diet tips", "nutrition science"],
  authors: [{ name: "Health Nutrition Hacks Team" }],
  openGraph: {
    title: "Health Nutrition Hacks",
    description: "Evidence-based nutrition tips and healthy recipes",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${montserrat.variable} antialiased flex flex-col min-h-screen bg-zinc-950 text-zinc-100 transition-colors duration-200`}
      >
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
