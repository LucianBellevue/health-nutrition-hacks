import type { Metadata } from "next";

const LAST_REVIEWED = "December 12, 2025";

const sections = [
  {
    heading: "Educational Purpose Only",
    body: [
      "All information on Health Nutrition Hacks is provided for educational and inspirational purposes only.",
      "Content should not be interpreted as medical, dietary, or health advice tailored to your specific circumstances.",
    ],
  },
  {
    heading: "No Medical Relationship",
    body: [
      "Engaging with our articles, guides, or newsletters does not create a doctor-patient or dietitian-client relationship.",
      "Always consult a qualified healthcare provider before making decisions about nutrition, supplements, exercise, or lifestyle changes.",
    ],
  },
  {
    heading: "Accuracy & Timeliness",
    body: [
      "We strive to keep our information up to date and evidence-based, but nutrition science evolves quickly.",
      "Health Nutrition Hacks does not guarantee that every article reflects the latest research or clinical guidelines at all times.",
    ],
  },
  {
    heading: "Liability",
    body: [
      "By using this site, you agree that Health Nutrition Hacks, its contributors, and partners are not responsible for any actions you take based on the content provided.",
      "You accept full responsibility for consulting professionals and making informed decisions regarding your health.",
    ],
  },
  {
    heading: "External Links & Resources",
    body: [
      "Our site may reference third-party websites, products, or services. We are not responsible for the content or claims of those external resources.",
      "Please review their policies and consult a professional before purchasing or using any recommendations.",
    ],
  },
  {
    heading: "Contact Us",
    body: [
      "If you have any questions about this disclaimer, please email us at ",
      <a
        key="disclaimer-email"
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
  title: "Medical & Nutrition Disclaimer | Health Nutrition Hacks",
  description:
    "Understand the Health Nutrition Hacks disclaimer regarding medical, nutrition, and wellness information.",
  alternates: {
    canonical: "/disclaimer",
  },
  openGraph: {
    title: "Medical & Nutrition Disclaimer | Health Nutrition Hacks",
    description:
      "Read the medical and nutrition disclaimer that clarifies the educational purpose of Health Nutrition Hacks.",
    url: `${SITE_URL}/disclaimer`,
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
    title: "Medical & Nutrition Disclaimer | Health Nutrition Hacks",
    description:
      "Read the medical and nutrition disclaimer that clarifies the educational purpose of Health Nutrition Hacks.",
    images: [OG_IMAGE],
  },
};

export default function DisclaimerPage() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="space-y-3 text-center md:text-left">
          <p className="text-sm uppercase tracking-[0.3em] text-emerald-400">
            Last reviewed: {LAST_REVIEWED}
          </p>
          <h1 className="text-4xl font-semibold text-white">Disclaimer</h1>
          <p className="text-base text-zinc-300">
            Please read this disclaimer carefully before relying on any of our wellness or nutrition content.
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
