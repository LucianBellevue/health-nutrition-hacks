import Link from 'next/link';
import Image from 'next/image';

/**
 * Site footer with copyright and links
 */
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mt-auto overflow-hidden">
      {/* Background gradient */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-linear-to-b from-zinc-50 via-white to-emerald-50/30 dark:from-zinc-950 dark:via-zinc-900 dark:to-emerald-950/20"
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Top section with branding + newsletter teaser */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-12">
          <div className="max-w-md">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-zinc-900 dark:bg-white/10 flex items-center justify-center shadow-lg">
                <Image
                  src="/hnh_logo.svg"
                  alt="Health Nutrition Hacks logo"
                  width={28}
                  height={28}
                  className="brightness-0 invert"
                />
              </div>
              <span className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                Health Nutrition Hacks
              </span>
            </div>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
              Evidence-based nutrition tips, healthy recipes, and wellness advice you can actually stick with.
            </p>
          </div>

          {/* Mini newsletter CTA */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/blog"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-5 py-3 text-sm font-semibold shadow-lg transition hover:-translate-y-0.5"
            >
              Read the blog
              <span aria-hidden="true">→</span>
            </Link>
            <a
              href="/rss.xml"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white/80 dark:bg-zinc-800/60 backdrop-blur px-5 py-3 text-sm font-semibold text-zinc-700 dark:text-zinc-200 transition hover:border-emerald-300"
            >
              RSS Feed
            </a>
          </div>
        </div>

        {/* Link columns */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 border-t border-zinc-200/70 dark:border-zinc-800/70 pt-10">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-emerald-600 mb-4">
              Navigation
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-zinc-600 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-zinc-600 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/categories"
                  className="text-zinc-600 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  Categories
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-emerald-600 mb-4">
              Company
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/#about"
                  className="text-zinc-600 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <a
                  href="mailto:hello@healthnutritionhacks.com"
                  className="text-zinc-600 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-emerald-600 mb-4">
              Legal
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="/privacy"
                  className="text-zinc-600 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="/terms"
                  className="text-zinc-600 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="/disclaimer"
                  className="text-zinc-600 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  Disclaimer
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-emerald-600 mb-4">
              Connect
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="https://www.instagram.com/healthnutritionhacks"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-600 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://www.pinterest.com/healthnutritionhacks"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-600 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  Pinterest
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-zinc-200/70 dark:border-zinc-800/70 mt-10 pt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-xs text-zinc-500 dark:text-zinc-400">
          <p>© {currentYear} Health Nutrition Hacks. All rights reserved.</p>
          <p className="max-w-md text-center sm:text-right">
            Information provided is for educational purposes only. Always consult a healthcare professional before making dietary changes.
          </p>
        </div>
      </div>
    </footer>
  );
}
