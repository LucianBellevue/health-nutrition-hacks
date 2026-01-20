'use client';

import Link from 'next/link';
import Image from 'next/image';
import FooterNewsletter from './FooterNewsletter';
import { useAppSelector } from '@/store/hooks';

/**
 * Site footer with copyright and links
 */
export default function Footer() {
  const isAdminRoute = useAppSelector((state) => state.ui.isAdminRoute);
  const currentYear = new Date().getFullYear();

  if (isAdminRoute) return null;

  return (
    <footer className="relative mt-auto overflow-hidden">
      {/* Background gradient */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-linear-to-b from-zinc-50 via-white to-emerald-50/30 dark:from-zinc-950 dark:via-zinc-900 dark:to-emerald-950/20"
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        {/* Top section with branding + newsletter */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 mb-8 sm:mb-12">
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
            <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed mb-4">
              Evidence-based nutrition tips, healthy recipes, and wellness advice you can actually stick with.
            </p>
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

          {/* Newsletter signup */}
          <FooterNewsletter />
        </div>

        {/* Link columns */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 border-t border-zinc-200/70 dark:border-zinc-800/70 pt-8 sm:pt-10">
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
                <Link
                  href="/contact"
                  className="text-zinc-600 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  Contact
                </Link>
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
            <div className="flex items-center gap-4">
              <a
                href="https://www.facebook.com/profile.php?id=61586863918949"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-500 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                aria-label="Facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/company/health-nutrition-hacks"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-500 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                aria-label="LinkedIn"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a
                href="https://pin.it/2EPwRmoKE"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-500 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                aria-label="Pinterest"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-zinc-200/70 dark:border-zinc-800/70 mt-8 sm:mt-10 pt-6 sm:pt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-xs text-zinc-500 dark:text-zinc-400">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <p>© {currentYear} Health Nutrition Hacks. All rights reserved.</p>
            <span className="hidden sm:inline">•</span>
            <a
              href="https://uiforge.io"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            >
              Powered by UiForge
            </a>
          </div>
          <p className="max-w-md text-center sm:text-right">
            Information provided is for educational purposes only. Always consult a healthcare professional before making dietary changes.
          </p>
        </div>
      </div>
    </footer>
  );
}
