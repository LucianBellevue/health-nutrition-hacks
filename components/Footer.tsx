'use client';

import { memo, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaFacebook, FaLinkedin, FaPinterest } from 'react-icons/fa';
import FooterNewsletter from './FooterNewsletter';
import { useAppSelector } from '@/store/hooks';

/**
 * Site footer with copyright and links
 * Memoized to prevent unnecessary re-renders
 */
function Footer() {
  const isAdminRoute = useAppSelector((state) => state.ui.isAdminRoute);
  const currentYear = useMemo(() => new Date().getFullYear(), []);

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
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8 border-t border-zinc-200/70 dark:border-zinc-800/70 pt-8 sm:pt-10">
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
              <li>
                <Link
                  href="/about"
                  className="text-zinc-600 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  About
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
                <Link
                  href="/privacy"
                  className="text-zinc-600 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-zinc-600 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/disclaimer"
                  className="text-zinc-600 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  Disclaimer
                </Link>
              </li>
              <li>
                <Link
                  href="/cookies"
                  className="text-zinc-600 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  Cookie Policy
                </Link>
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
                <FaFacebook className="w-5 h-5" />
              </a>
              <a
                href="https://www.linkedin.com/company/health-nutrition-hacks"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-500 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                aria-label="LinkedIn"
              >
                <FaLinkedin className="w-5 h-5" />
              </a>
              <a
                href="https://pin.it/2EPwRmoKE"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-500 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                aria-label="Pinterest"
              >
                <FaPinterest className="w-5 h-5" />
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

export default memo(Footer);
