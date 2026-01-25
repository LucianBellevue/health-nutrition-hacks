'use client';

import { FormEvent } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  setEmail,
  submitStart,
  submitSuccess,
  submitError,
  resetStatus,
  NewsletterFormId,
} from '@/store/slices/newsletterSlice';

interface NewsletterSignupProps {
  formId?: NewsletterFormId;
  title?: string;
  description?: string;
}

/**
 * Newsletter signup component with email validation and API integration
 */
export default function NewsletterSignup({
  formId = 'inline',
  title = 'Get Weekly Nutrition Hacks',
  description = 'Join thousands of readers who receive evidence-based nutrition tips, healthy recipes, and exclusive content delivered straight to their inbox every week.',
}: NewsletterSignupProps) {
  const dispatch = useAppDispatch();
  const { email, status, errorMessage } = useAppSelector((state) => state.newsletter.forms[formId]);

  const validateEmail = (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validation
    if (!email.trim()) {
      dispatch(submitError({ formId, error: 'Please enter your email address' }));
      return;
    }

    if (!validateEmail(email)) {
      dispatch(submitError({ formId, error: 'Please enter a valid email address' }));
      return;
    }

    dispatch(submitStart(formId));

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        dispatch(submitSuccess(formId));
      } else {
        dispatch(submitError({ formId, error: data.error || 'Something went wrong. Please try again.' }));
      }
    } catch {
      dispatch(submitError({ formId, error: 'Failed to subscribe. Please try again later.' }));
    }
  };

  return (
    <div className="relative my-12 sm:my-16">
      {/* Background glow */}
      <div
        aria-hidden="true"
        className="absolute inset-0 rounded-[32px] bg-linear-to-r from-emerald-500/25 via-teal-400/20 to-cyan-400/15 blur-3xl"
      />

      <div className="relative max-w-2xl mx-auto rounded-[24px] sm:rounded-[32px] border border-emerald-100/80 dark:border-emerald-900/50 bg-white/95 dark:bg-zinc-900/90 backdrop-blur-xl p-6 sm:p-10 shadow-[0_30px_70px_rgba(16,185,129,0.18)]">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] sm:tracking-[0.4em] text-emerald-600 mb-2 sm:mb-3">
            Stay in the loop
          </p>
          <h3 className="text-xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-2 sm:mb-3">
            {title}
          </h3>
          <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 mb-6 sm:mb-8 leading-relaxed max-w-lg mx-auto">
            {description}
          </p>

          {status === 'success' ? (
            <div className="rounded-2xl bg-emerald-50/80 dark:bg-emerald-500/10 p-8 border border-emerald-100 dark:border-emerald-500/20">
              <div className="flex items-center justify-center mb-4">
                <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center">
                  <svg
                    className="w-7 h-7 text-emerald-600 dark:text-emerald-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
              <h4 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                You&apos;re on the list!
              </h4>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Check your inbox for a confirmation email. We&apos;ll send you the best nutrition tips every week.
              </p>
              <button
                type="button"
                onClick={() => dispatch(resetStatus(formId))}
                className="mt-5 inline-flex items-center justify-center px-5 py-2 text-sm font-semibold text-emerald-700 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-300 transition-colors"
              >
                Subscribe another email &rarr;
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1" suppressHydrationWarning>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => dispatch(setEmail({ formId, email: e.target.value }))}
                  placeholder="Enter your email address"
                  disabled={status === 'loading'}
                  className="w-full px-5 py-4 border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:border-emerald-500 dark:focus:border-emerald-400 outline-none transition-shadow placeholder:text-zinc-400"
                />
              </div>
              <button
                type="submit"
                disabled={status === 'loading'}
                className="px-8 py-4 bg-zinc-900 dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-100 text-white dark:text-zinc-900 font-semibold rounded-2xl shadow-lg transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
          )}

          {errorMessage && status !== 'success' && (
            <p className="mt-4 text-sm text-red-600 dark:text-red-400">{errorMessage}</p>
          )}

          {status !== 'success' && (
            <p className="mt-4 text-xs text-zinc-500 dark:text-zinc-400">
              We respect your privacy. Unsubscribe at any time.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
