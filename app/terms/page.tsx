import type { Metadata } from "next";

const EFFECTIVE_DATE = "December 12, 2025";

const sections = [
  {
    heading: "Acceptance of Terms",
    body: [
      "By accessing or using Health Nutrition Hacks, you agree to be bound by these Terms of Service and our Privacy Policy.",
      "If you do not agree with any part of the terms, please discontinue use of the site immediately.",
    ],
  },
  {
    heading: "Use of Content",
    body: [
      "All blog posts, guides, and resources are for informational purposes only and do not replace personalized medical or nutritional advice.",
      "You may share our content for non-commercial use with proper attribution. Please contact us for licensing inquiries.",
    ],
  },
  {
    heading: "User Responsibilities",
    body: [
      "You agree not to misuse the site, attempt to gain unauthorized access, or post harmful material in comments or forms.",
      "Any information you submit must be accurate and not violate the rights of others.",
    ],
  },
  {
    heading: "Intellectual Property",
    body: [
      "All trademarks, logos, and original content published on Health Nutrition Hacks are the property of their respective owners and protected under applicable laws.",
      "You may not copy or reproduce our brand assets without prior written consent.",
    ],
  },
  {
    heading: "Disclaimer of Warranties",
    body: [
      "We provide content “as is” without warranties of any kind. Nutritional guidance should always be confirmed with a qualified professional.",
      "Health Nutrition Hacks does not guarantee that the site will be error-free, uninterrupted, or completely secure.",
    ],
  },
  {
    heading: "Limitation of Liability",
    body: [
      "To the fullest extent permitted by law, Health Nutrition Hacks and its team are not liable for any damages resulting from your use of the site.",
      "This includes indirect, incidental, or consequential damages even if we have been advised of the possibility.",
    ],
  },
  {
    heading: "Changes to These Terms",
    body: [
      "We may update the Terms of Service from time to time. Updates become effective once posted on this page.",
      "Continued use of the site after changes constitutes acceptance of the revised terms.",
    ],
  },
  {
    heading: "Contact",
    body: [
      "If you have questions about these Terms, reach us at ",
      <a
        key="terms-email"
        href="mailto:info@healthnutritionhacks.com"
        className="text-emerald-400 hover:text-emerald-300 underline-offset-4 hover:underline"
      >
        info@healthnutritionhacks.com
      </a>,
      ".",
    ],
  },
];

export const metadata: Metadata = {
  title: "Terms of Service | Health Nutrition Hacks",
  description:
    "Please review the Terms of Service governing how you may use the Health Nutrition Hacks website and content.",
  alternates: {
    canonical: "/terms",
  },
  openGraph: {
    title: "Terms of Service | Health Nutrition Hacks",
    description:
      "Learn the rules that guide how you may access, share, and engage with Health Nutrition Hacks content and services.",
    url: "https://www.healthnutritionhacks.com/terms",
  },
};

export default function TermsOfServicePage() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="space-y-3 text-center md:text-left">
          <p className="text-sm uppercase tracking-[0.3em] text-emerald-400">Effective: {EFFECTIVE_DATE}</p>
          <h1 className="text-4xl font-semibold text-white">Terms of Service</h1>
          <p className="text-base text-zinc-300">
            Please review these guidelines that govern your use of Health Nutrition Hacks content and services.
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
