import type { Metadata } from "next";
import Link from "next/link";
import { getRecentPosts } from "@/lib/posts";
import PostCard from "@/components/PostCard";

export const metadata: Metadata = {
  title: "Health Nutrition Hacks | Evidence-Based Wellness Tips & Meal Prep Guides",
  description:
    "Health Nutrition Hacks delivers science-backed nutrition tips, metabolic health advice, meal planning systems, and energizing recipes to help you feel your best every day.",
  keywords: [
    "nutrition hacks",
    "healthy meal prep",
    "evidence-based wellness",
    "metabolic health tips",
    "functional nutrition blog",
  ],
  alternates: {
    canonical: "https://www.healthnutritionhacks.com/",
  },
  openGraph: {
    title: "Health Nutrition Hacks | Evidence-Based Wellness Tips & Meal Prep Guides",
    description:
      "Discover research-backed nutrition guidance, sustainable meal prep routines, and realistic wellness strategies tailored for busy, health-minded people.",
    url: "https://www.healthnutritionhacks.com/",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Health Nutrition Hacks",
  url: "https://www.healthnutritionhacks.com/",
  logo: "https://www.healthnutritionhacks.com/hnh_logo.svg",
  sameAs: [
    "https://www.instagram.com/healthnutritionhacks",
    "https://www.pinterest.com/healthnutritionhacks",
  ],
  description:
    "Evidence-based nutrition hacks, metabolic health strategies, and realistic wellness guidance for busy people.",
};

export default function Home() {
  const recentPosts = getRecentPosts(3);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-950/30 dark:via-teal-950/30 dark:to-cyan-950/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
            <div className="text-left max-w-3xl">
              <span className="inline-flex items-center text-xs uppercase tracking-[0.4em] text-emerald-500 font-semibold mb-4">
                Health · Nutrition · Habit Systems
              </span>
              <h1 className="text-5xl sm:text-6xl font-bold text-zinc-900 dark:text-zinc-100 mb-6 leading-tight">
                Health Nutrition Hacks for
                <span className="text-emerald-600 dark:text-emerald-400"> Sustainable Energy</span> & Everyday Vitality
              </h1>
              <p className="text-xl text-zinc-700 dark:text-zinc-300 mb-8 leading-relaxed">
                Get actionable, evidence-backed guidance on metabolic health, gut-friendly meal prep, hormone-balancing
                nutrition, and realistic wellness rituals—created for busy humans who want long-term results.
              </p>
              <ul className="space-y-3 mb-10 text-zinc-700 dark:text-zinc-300">
                <li className="flex items-start gap-3">
                  <span className="text-emerald-500 mt-1">✔</span>
                  <span>Weekly meal-prep blueprints and grocery shortcuts to keep healthy eating effortless.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-500 mt-1">✔</span>
                  <span>Science-supported protocols for boosting energy, balancing blood sugar, and reducing cravings.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-500 mt-1">✔</span>
                  <span>Digestible breakdowns of the latest nutrition research—minus the fearmongering.</span>
                </li>
              </ul>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/blog"
                  className="inline-flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white font-semibold px-8 py-4 rounded-lg transition-colors shadow-md hover:shadow-xl"
                >
                  Explore Expert Guides
                </Link>
                <Link
                  href="#about"
                  className="inline-flex items-center justify-center bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-emerald-700 dark:text-emerald-300 font-semibold px-8 py-4 rounded-lg border-2 border-emerald-100 dark:border-emerald-900 shadow-sm transition-colors"
                >
                  Why Health Nutrition Hacks?
                </Link>
              </div>
            </div>
            <div className="bg-white/90 dark:bg-zinc-900/60 border border-emerald-100/80 dark:border-emerald-900/60 rounded-3xl p-6 sm:p-8 shadow-[0_30px_80px_rgba(6,182,212,0.15)]">
              <h3 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2">Inside Every Article</h3>
              <p className="text-zinc-600 dark:text-zinc-400 mb-6">
                We combine clinical research, behavior design, and functional nutrition coaching into high-impact
                frameworks you can put into practice today.
              </p>
              <dl className="space-y-4">
                <div className="flex justify-between items-center border-b border-zinc-200 dark:border-zinc-800 pb-3">
                  <dt className="text-sm uppercase tracking-[0.3em] text-zinc-500">Meal Systems</dt>
                  <dd className="text-xl font-semibold text-emerald-600 dark:text-emerald-400">40+ templates</dd>
                </div>
                <div className="flex justify-between items-center border-b border-zinc-200 dark:border-zinc-800 pb-3">
                  <dt className="text-sm uppercase tracking-[0.3em] text-zinc-500">Metabolic Tips</dt>
                  <dd className="text-xl font-semibold text-emerald-600 dark:text-emerald-400">Research-backed</dd>
                </div>
                <div className="flex justify-between items-center">
                  <dt className="text-sm uppercase tracking-[0.3em] text-zinc-500">Reader Wins</dt>
                  <dd className="text-xl font-semibold text-emerald-600 dark:text-emerald-400">+125k energized days</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
              Why Health Nutrition Hacks Is a Trusted Wellness Resource
            </h2>
            <p className="text-lg text-zinc-700 dark:text-zinc-300 max-w-3xl mx-auto">
              We merge credentialed expertise, clinical research, and practical habit design so you can cut through diet
              culture noise and focus on strategies that actually improve metabolic health, digestion, and daily energy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <article className="bg-white dark:bg-zinc-900 p-8 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-md">
              <header className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
                  <span className="text-2xl">🧪</span>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-emerald-500">Clinical Rigor</p>
                  <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">Peer-Reviewed Foundations</h3>
                </div>
              </header>
              <p className="text-zinc-600 dark:text-zinc-400">
                Every guide cites randomized control trials, meta-analyses, or clinical practice guidelines so you know
                the nutrition hacks are grounded in evidence—not trends.
              </p>
            </article>

            <article className="bg-white dark:bg-zinc-900 p-8 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-md">
              <header className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
                  <span className="text-2xl">🤖</span>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-emerald-500">AI Research Stack</p>
                  <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">Integrated Deep Analysis</h3>
                </div>
              </header>
              <p className="text-zinc-600 dark:text-zinc-400">
                We combine LLM-powered synthesis with human editing to cross-reference nutrition databases, clinical
                studies, and public health guidelines—flagging bias and surfacing high-signal insights automatically.
              </p>
            </article>

            <article className="bg-white dark:bg-zinc-900 p-8 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-md">
              <header className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
                  <span className="text-2xl">📋</span>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-emerald-500">Results-Oriented</p>
                  <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">Habit Systems You Can Keep</h3>
                </div>
              </header>
              <p className="text-zinc-600 dark:text-zinc-400">
                Downloadable grocery lists, habit trackers, batch-cooking workflows, and micronutrient cheat sheets turn
                expert advice into routines that fit real life.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* Latest Posts Section */}
      <section id="latest" className="py-16 sm:py-20 bg-white dark:bg-zinc-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                Latest Articles
              </h2>
              <p className="text-lg text-zinc-700 dark:text-zinc-300">
                Fresh insights and tips to optimize your nutrition
              </p>
            </div>
            <Link
              href="/blog"
              className="hidden sm:inline-block text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-semibold"
            >
              View All →
            </Link>
          </div>

          {recentPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentPosts.map((post) => (
                <PostCard key={post.metadata.slug} post={post.metadata} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
              <p className="text-zinc-700 dark:text-zinc-300 text-lg">
                New content coming soon! Check back shortly.
              </p>
            </div>
          )}

          <div className="text-center mt-8 sm:hidden">
            <Link
              href="/blog"
              className="inline-block text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-semibold"
            >
              View All Articles →
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-[1.1fr_0.9fr] gap-10 items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.4em] text-emerald-400 mb-4">About Health Nutrition Hacks</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-6">
                Realistic science-backed nutrition guidance for energized living.
              </h2>
              <p className="text-lg text-zinc-700 dark:text-zinc-300 leading-relaxed mb-4">
                Our editorial lab pairs AI-assisted research pipelines with experienced nutrition strategists. We ingest
                new studies daily, score their quality, and translate the strongest findings into plug-and-play food
                systems you can trust.
              </p>
              <p className="text-lg text-zinc-700 dark:text-zinc-300 leading-relaxed">
                From gut repair protocols and hormone-friendly snack plans to batch-cooking frameworks, Health Nutrition
                Hacks delivers the practical clarity you need to upgrade daily routines without obsession or burnout.
              </p>
            </div>
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-lg">
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-4">What makes us different?</h3>
              <ul className="space-y-4 text-zinc-700 dark:text-zinc-300">
                <li>
                  <span className="font-semibold text-emerald-500">01 ·</span> Every article cites clinical research or
                  expert interviews so you can see the “why” behind each recommendation.
                </li>
                <li>
                  <span className="font-semibold text-emerald-500">02 ·</span> We build flexible frameworks that respect
                  your culture, schedule, and relationship with food—no detoxes or fear tactics.
                </li>
                <li>
                  <span className="font-semibold text-emerald-500">03 ·</span> Practical worksheets, grocery lists, and
                  prep templates are included whenever possible to move you from theory to action.
                </li>
              </ul>
              <Link
                href="/privacy"
                className="inline-flex mt-6 text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                Read our transparency & editorial standards →
              </Link>
            </div>
          </div>
        </div>
      </section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </div>
  );
}
