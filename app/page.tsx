import Link from "next/link";
import { getRecentPosts } from "@/lib/posts";
import PostCard from "@/components/PostCard";

export default function Home() {
  const recentPosts = getRecentPosts(3);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-950/20 dark:via-teal-950/20 dark:to-cyan-950/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl sm:text-6xl font-bold text-zinc-900 dark:text-zinc-100 mb-6 leading-tight">
              Transform Your Health with
              <span className="text-emerald-600 dark:text-emerald-400"> Science-Backed</span> Nutrition
            </h1>
            <p className="text-xl text-zinc-700 dark:text-zinc-300 mb-8 leading-relaxed">
              Discover evidence-based nutrition tips, delicious healthy recipes, and practical wellness advice to help you live your healthiest, most energized life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/blog"
                className="inline-block bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white font-semibold px-8 py-4 rounded-lg transition-colors shadow-md hover:shadow-lg"
              >
                Explore Our Blog
              </Link>
              <Link
                href="/#latest"
                className="inline-block bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700 text-emerald-600 dark:text-emerald-400 font-semibold px-8 py-4 rounded-lg transition-colors shadow-md border-2 border-emerald-100 dark:border-emerald-900"
              >
                Latest Articles
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
              Why Trust Health Nutrition Hacks?
            </h2>
            <p className="text-lg text-zinc-700 dark:text-zinc-300 max-w-2xl mx-auto">
              We cut through the noise to bring you reliable, science-based nutrition information.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-zinc-900 p-8 rounded-lg shadow-sm border border-zinc-100 dark:border-zinc-800">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🔬</span>
              </div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                Evidence-Based
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                Every tip and recommendation is backed by peer-reviewed research and clinical studies.
              </p>
            </div>

            <div className="bg-white dark:bg-zinc-900 p-8 rounded-lg shadow-sm border border-zinc-100 dark:border-zinc-800">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">👨‍⚕️</span>
              </div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                Expert-Reviewed
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                Our content is reviewed by registered dietitians and nutrition professionals.
              </p>
            </div>

            <div className="bg-white dark:bg-zinc-900 p-8 rounded-lg shadow-sm border border-zinc-100 dark:border-zinc-800">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                Practical & Actionable
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                Get real-world tips you can implement immediately to see results.
              </p>
            </div>
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-6">
            About Health Nutrition Hacks
          </h2>
          <p className="text-lg text-zinc-700 dark:text-zinc-300 leading-relaxed mb-6">
            We&apos;re on a mission to make evidence-based nutrition accessible to everyone. In a world full of conflicting diet advice and quick-fix solutions, we believe in the power of science, sustainable habits, and practical strategies that actually work.
          </p>
          <p className="text-lg text-zinc-700 dark:text-zinc-300 leading-relaxed">
            Our team of nutrition experts cuts through the hype to deliver trustworthy, actionable information that helps you make informed decisions about your health. Whether you&apos;re looking to boost your energy, improve your diet, or simply understand nutrition better, we&apos;re here to guide you every step of the way.
          </p>
        </div>
      </section>
    </div>
  );
}
