import type { Metadata } from "next";

const LAST_UPDATED = "December 12, 2025";

const sections = [
  {
    heading: "Information We Collect",
    body: [
      "Contact information you voluntarily provide (such as your name and email address) when subscribing to updates or contacting us directly.",
      "Analytics data like page views, referring URLs, and device/browser details that help us understand how visitors engage with our content.",
      "Optional data you submit through forms, surveys, or feedback requests related to nutrition interests and goals.",
    ],
  },
  {
    heading: "How We Use Your Information",
    body: [
      "To respond to inquiries, deliver newsletters, and provide the content or services you request.",
      "To analyze site performance, troubleshoot issues, and improve the overall Health Nutrition Hacks experience.",
      "To communicate important updates, policy changes, or promotional offers that align with your expressed interests.",
    ],
  },
  {
    heading: "Cookies & Tracking Technologies",
    body: [
      "We use cookies and similar technologies to remember preferences, measure traffic patterns, and personalize your browsing experience.",
      "You can adjust your browser settings to refuse cookies; however, some sections of the site may not function optimally.",
    ],
  },
  {
    heading: "Data Retention & Security",
    body: [
      "We retain personal data only as long as needed for the purposes outlined in this policy, unless a longer retention period is required by law.",
      "Industry-standard security measures protect personal information, but no online platform can guarantee absolute security.",
    ],
  },
  {
    heading: "Third-Party Services",
    body: [
      "We may link to or embed content from trusted third parties (for example, analytics partners or recipe tools).",
      "Those services maintain their own privacy practices. We encourage you to review their policies before providing personal data.",
    ],
  },
  {
    heading: "Your Rights & Choices",
    body: [
      "You may request access to, correction of, or deletion of your personal data, subject to applicable laws.",
      "You can opt out of marketing emails by using the unsubscribe link in our messages or contacting us directly.",
    ],
  },
  {
    heading: "Contact Us",
    body: [
      "If you have questions about this Privacy Policy or how we handle your data, email us at ",
      <a
        key="privacy-email"
        href="mailto:info@healthnutritionhacks.com"
        className="text-emerald-400 hover:text-emerald-300 underline-offset-4 hover:underline"
      >
        info@healthnutritionhacks.com
      </a>,
      ".",
    ],
  },
];

const SITE_URL = "https://www.healthnutritionhacks.com";
const OG_IMAGE = `${SITE_URL}/android-chrome-512x512.png`;

export const metadata: Metadata = {
  title: "Privacy Policy | Health Nutrition Hacks",
  description:
    "Learn how Health Nutrition Hacks collects, uses, and protects your personal information.",
  alternates: {
    canonical: "/privacy",
  },
  openGraph: {
    title: "Privacy Policy | Health Nutrition Hacks",
    description:
      "Understand how we handle personal data, cookies, and analytics across the Health Nutrition Hacks platform.",
    url: `${SITE_URL}/privacy`,
    siteName: "Health Nutrition Hacks",
    type: "website",
    images: [
      {
        url: OG_IMAGE,
        width: 512,
        height: 512,
        alt: "Health Nutrition Hacks",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Privacy Policy | Health Nutrition Hacks",
    description:
      "Understand how we handle personal data, cookies, and analytics across the Health Nutrition Hacks platform.",
    images: [OG_IMAGE],
  },
};

export default function PrivacyPolicyPage() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="space-y-3 text-center md:text-left">
          <p className="text-sm uppercase tracking-[0.3em] text-emerald-400">
            Last updated: {LAST_UPDATED}
          </p>
          <h1 className="text-4xl font-semibold text-white">Privacy Policy</h1>
          <p className="text-base text-zinc-300">
            Your trust matters. This page explains what personal data we collect, how we use it,
            and the choices you have when engaging with Health Nutrition Hacks.
          </p>
        </header>

        <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6 sm:p-10 shadow-[0_0_60px_rgba(16,185,129,0.08)] space-y-10">
          {sections.map((section) => (
            <div key={section.heading} className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">{section.heading}</h2>
              <div className="space-y-3 text-sm sm:text-base text-zinc-300 leading-relaxed">
                {section.body.map((content, index) =>
                  typeof content === "string" ? (
                    <p key={index}>{content}</p>
                  ) : (
                    <p key={index} className="flex flex-wrap gap-1 items-center">
                      {content}
                    </p>
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
