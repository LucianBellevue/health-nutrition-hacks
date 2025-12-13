'use client';

import { FormEvent } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  setEmail,
  submitStart,
  submitSuccess,
  submitError,
  resetStatus,
} from '@/store/slices/newsletterSlice';

interface NewsletterSignupProps {
  title?: string;
  description?: string;
}

/**
 * Newsletter signup component with email validation and API integration
 */
export default function NewsletterSignup({
  title = 'Get Weekly Nutrition Hacks',
  description = 'Join thousands of readers who receive evidence-based nutrition tips, healthy recipes, and exclusive content delivered straight to their inbox every week.',
}: NewsletterSignupProps) {
  const dispatch = useAppDispatch();
  const { email, status, errorMessage } = useAppSelector((state) => state.newsletter);

  const validateEmail = (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validation
    if (!email.trim()) {
      dispatch(submitError('Please enter your email address'));
      return;
    }

    if (!validateEmail(email)) {
      dispatch(submitError('Please enter a valid email address'));
      return;
    }

    dispatch(submitStart());

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
        dispatch(submitSuccess());
      } else {
        dispatch(submitError(data.error || 'Something went wrong. Please try again.'));
      }
    } catch {
      dispatch(submitError('Failed to subscribe. Please try again later.'));
    }
  };

  return (
    <div className="my-12 sm:my-16 max-w-2xl mx-auto bg-linear-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border border-emerald-100 dark:border-emerald-900 rounded-xl p-8 sm:p-10 shadow-sm">
      <div className="max-w-2xl mx-auto text-center">
        <h3 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-3">{title}</h3>
        <p className="text-zinc-700 dark:text-zinc-300 mb-6 leading-relaxed">{description}</p>

        {status === 'success' ? (
          <div className="bg-white rounded-lg p-6 border border-emerald-200">
            <div className="flex items-center justify-center mb-3">
              <svg
                className="w-12 h-12 text-emerald-600"
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
            <h4 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
              Thank you for subscribing!
            </h4>
            <p className="text-sm text-zinc-700 dark:text-zinc-300">
              Check your inbox for a confirmation email. We&apos;ll send you the best nutrition tips every week.
            </p>
            <button
              type="button"
              onClick={() => dispatch(resetStatus())}
              className="mt-4 inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-emerald-700 hover:text-emerald-900"
            >
              Subscribe another email
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <input
                type="email"
                value={email}
                onChange={(e) => dispatch(setEmail(e.target.value))}
                placeholder="Enter your email address"
                disabled={status === 'loading'}
                className="flex-1 px-4 py-3 border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:border-emerald-500 dark:focus:border-emerald-400 outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={status === 'loading'}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>
        )}

        {errorMessage && status !== 'success' && (
          <p className="mt-3 text-sm text-red-600">{errorMessage}</p>
        )}

        {status !== 'success' && (
          <p className="mt-3 text-xs text-zinc-500">
            We respect your privacy. Unsubscribe at any time.
          </p>
        )}
      </div>
    </div>
  );
}
