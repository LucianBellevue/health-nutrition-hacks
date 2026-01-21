import { Metadata } from 'next';
import Link from 'next/link';

const SITE_URL = 'https://healthnutritionhacks.com';
const OG_IMAGE = `${SITE_URL}/android-chrome-512x512.png`;

export const metadata: Metadata = {
  title: 'Page Not Found – Health Nutrition Hacks',
  description: 'The page you are looking for does not exist or has been moved.',
  openGraph: {
    title: 'Page Not Found – Health Nutrition Hacks',
    description: 'The page you are looking for does not exist or has been moved.',
    url: SITE_URL,
    siteName: 'Health Nutrition Hacks',
    type: 'website',
    images: [
      {
        url: OG_IMAGE,
        width: 512,
        height: 512,
        alt: 'Health Nutrition Hacks',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: 'Page Not Found – Health Nutrition Hacks',
    description: 'The page you are looking for does not exist or has been moved.',
    images: [OG_IMAGE],
  },
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* 404 Illustration */}
        <div className="relative mb-8">
          <div className="text-[150px] sm:text-[200px] font-bold text-zinc-100 dark:text-zinc-800 leading-none select-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center">
              <svg
                className="w-10 h-10 text-emerald-600 dark:text-emerald-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Content */}
        <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-3">
          Page Not Found
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 mb-8 leading-relaxed">
          Oops! The page you&apos;re looking for doesn&apos;t exist or has been moved. 
          Let&apos;s get you back on track.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-semibold rounded-xl shadow-lg transition hover:-translate-y-0.5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Go Home
          </Link>
          <Link
            href="/blog"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 font-semibold rounded-xl transition hover:border-emerald-300 dark:hover:border-emerald-700"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
            Browse Articles
          </Link>
        </div>

        {/* Helpful links */}
        <div className="mt-12 pt-8 border-t border-zinc-200 dark:border-zinc-800">
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
            Popular pages you might be looking for:
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/blog/magnesium-benefits"
              className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              Magnesium Benefits
            </Link>
            <span className="text-zinc-300 dark:text-zinc-700">•</span>
            <Link
              href="/blog/best-suplement-for-energy-without-caffeine"
              className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              Energy Supplements
            </Link>
            <span className="text-zinc-300 dark:text-zinc-700">•</span>
            <Link
              href="/categories"
              className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              Categories
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
