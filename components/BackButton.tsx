'use client';

import { useRouter } from 'next/navigation';

/**
 * Dynamic back button that navigates to the previous page in browser history
 */
export default function BackButton() {
  const router = useRouter();

  const handleBack = () => {
    // Check if there's history to go back to
    if (window.history.length > 1) {
      router.back();
    } else {
      // Fallback to blog page if no history
      router.push('/blog');
    }
  };

  return (
    <button
      onClick={handleBack}
      className="inline-flex items-center gap-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors group"
    >
      <svg
        className="w-4 h-4 transition-transform group-hover:-translate-x-1"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
      </svg>
      <span>Back</span>
    </button>
  );
}
