import type { Metadata } from 'next';
import Link from 'next/link';

const SITE_URL = 'https://www.healthnutritionhacks.com';
const OG_IMAGE = `${SITE_URL}/api/og?title=${encodeURIComponent('About Us - Meet Our Team')}&category=About&author=HNH Team`;

export const metadata: Metadata = {
  title: 'About Us | Health Nutrition Hacks',
  description:
    'Learn about Health Nutrition Hacks, our mission to provide evidence-based nutrition guidance, and meet our team of nutrition experts and health professionals.',
  keywords: ['about health nutrition hacks', 'nutrition experts', 'health team', 'evidence-based nutrition'],
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: 'About Us | Health Nutrition Hacks',
    description:
      'Meet the team behind Health Nutrition Hacks and learn about our mission to deliver science-backed nutrition advice.',
    url: `${SITE_URL}/about`,
    siteName: 'Health Nutrition Hacks',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: 'About Health Nutrition Hacks',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Us | Health Nutrition Hacks',
    description:
      'Meet the team behind Health Nutrition Hacks and learn about our mission to deliver science-backed nutrition advice.',
    site: '@healthnutritionhacks',
    creator: '@healthnutritionhacks',
    images: [OG_IMAGE],
  },
};

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Health Nutrition Hacks',
  url: 'https://www.healthnutritionhacks.com',
  logo: 'https://www.healthnutritionhacks.com/hnh_logo.svg',
  description:
    'Evidence-based nutrition hacks, metabolic health strategies, and realistic wellness guidance for busy people.',
  sameAs: [
    'https://www.instagram.com/healthnutritionhacks',
    'https://www.pinterest.com/healthnutritionhacks',
    'https://twitter.com/healthnutritionhacks',
    'https://www.linkedin.com/company/health-nutrition-hacks',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    email: 'info@healthnutritionhacks.com',
    contactType: 'Customer Service',
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-zinc-950 via-zinc-900 to-zinc-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 sm:py-24">
        <div className="absolute inset-0 bg-linear-to-br from-emerald-950/40 via-teal-950/30 to-cyan-950/20" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center text-xs uppercase tracking-[0.4em] text-emerald-400 font-semibold mb-4">
            About Us
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Evidence-Based Nutrition <span className="text-emerald-400">Guidance You Can Trust</span>
          </h1>
          <p className="text-xl text-zinc-300 leading-relaxed max-w-3xl mx-auto">
            Health Nutrition Hacks was founded to cut through diet culture noise and deliver practical,
            science-backed nutrition strategies that actually work for busy, health-conscious individuals.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-8 sm:p-12">
            <h2 className="text-3xl font-bold text-white mb-6">Our Mission</h2>
            <div className="space-y-4 text-zinc-300 leading-relaxed">
              <p>
                We believe nutrition shouldn&apos;t be complicated, expensive, or require perfection. Our goal is to
                translate complex research into actionable habits that fit real life—whether you&apos;re managing a busy
                schedule, dealing with digestive issues, or simply trying to feel more energized.
              </p>
              <p>
                Every article on Health Nutrition Hacks is grounded in peer-reviewed research, clinical guidelines, and
                practical experience. We combine human expertise with AI-assisted research synthesis to deliver
                comprehensive, unbiased nutrition guidance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">What Sets Us Apart</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6">
              <div className="w-12 h-12 rounded-xl bg-emerald-900/50 flex items-center justify-center mb-4">
                <span className="text-2xl">🔬</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Evidence-Based</h3>
              <p className="text-zinc-400">
                Every recommendation is backed by peer-reviewed research, clinical trials, or established health
                guidelines. We cite our sources and explain the &ldquo;why&rdquo; behind each tip.
              </p>
            </div>

            <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6">
              <div className="w-12 h-12 rounded-xl bg-emerald-900/50 flex items-center justify-center mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Practical & Actionable</h3>
              <p className="text-zinc-400">
                We provide meal plans, grocery lists, habit trackers, and step-by-step protocols you can implement
                immediately—no complicated prep or expensive supplements required.
              </p>
            </div>

            <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6">
              <div className="w-12 h-12 rounded-xl bg-emerald-900/50 flex items-center justify-center mb-4">
                <span className="text-2xl">🚫</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">No Fear-Mongering</h3>
              <p className="text-zinc-400">
                We don&apos;t promote detoxes, cleanses, or extreme diets. Our approach respects your relationship with food
                and focuses on sustainable, flexible habits.
              </p>
            </div>

            <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6">
              <div className="w-12 h-12 rounded-xl bg-emerald-900/50 flex items-center justify-center mb-4">
                <span className="text-2xl">🤖</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">AI-Assisted Research</h3>
              <p className="text-zinc-400">
                We leverage AI to synthesize thousands of studies, cross-reference databases, and surface high-quality
                insights—always with human editorial oversight.
              </p>
            </div>

            <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6">
              <div className="w-12 h-12 rounded-xl bg-emerald-900/50 flex items-center justify-center mb-4">
                <span className="text-2xl">🌍</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Inclusive Approach</h3>
              <p className="text-zinc-400">
                Our strategies work across dietary preferences, cultural backgrounds, and budget levels. We build
                frameworks, not rigid rules.
              </p>
            </div>

            <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6">
              <div className="w-12 h-12 rounded-xl bg-emerald-900/50 flex items-center justify-center mb-4">
                <span className="text-2xl">🔄</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Continuously Updated</h3>
              <p className="text-zinc-400">
                Nutrition science evolves. We regularly review and update our content to reflect the latest research and
                clinical best practices.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Editorial Standards */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-8 sm:p-12">
            <h2 className="text-3xl font-bold text-white mb-6">Our Editorial Standards</h2>
            <ul className="space-y-4 text-zinc-300">
              <li className="flex items-start gap-3">
                <span className="text-emerald-400 mt-1">✓</span>
                <span>
                  <strong>Research Citations:</strong> We link to peer-reviewed journals, clinical guidelines, and
                  reputable health organizations.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-emerald-400 mt-1">✓</span>
                <span>
                  <strong>Expert Review:</strong> Articles undergo review by registered dietitians or nutrition
                  professionals before publication.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-emerald-400 mt-1">✓</span>
                <span>
                  <strong>Transparency:</strong> We clearly disclose affiliate relationships and maintain editorial
                  independence.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-emerald-400 mt-1">✓</span>
                <span>
                  <strong>Accuracy First:</strong> Claims are fact-checked, and we correct errors promptly when
                  identified.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-emerald-400 mt-1">✓</span>
                <span>
                  <strong>No Medical Advice:</strong> Content is educational only; we always recommend consulting
                  healthcare providers.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to Get Started?</h2>
          <p className="text-zinc-300 mb-8 max-w-2xl mx-auto">
            Explore our evidence-based guides, meal plans, and nutrition hacks designed for real life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/blog"
              className="inline-flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8 py-4 rounded-lg transition-colors shadow-md hover:shadow-xl"
            >
              Browse Articles
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center bg-zinc-800 hover:bg-zinc-700 text-white font-semibold px-8 py-4 rounded-lg transition-colors border border-zinc-700"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
    </div>
  );
}
