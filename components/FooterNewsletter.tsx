'use client';

import { FormEvent } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  setEmail,
  submitStart,
  submitSuccess,
  submitError,
} from '@/store/slices/newsletterSlice';

/**
 * Compact newsletter signup for the footer
 */
export default function FooterNewsletter() {
  const dispatch = useAppDispatch();
  const { email, status, errorMessage } = useAppSelector(
    (state) => state.newsletter.forms.footer
  );

  const validateEmail = (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email.trim()) {
      dispatch(submitError({ formId: 'footer', error: 'Please enter your email' }));
      return;
    }

    if (!validateEmail(email)) {
      dispatch(submitError({ formId: 'footer', error: 'Invalid email format' }));
      return;
    }

    dispatch(submitStart('footer'));

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        dispatch(submitSuccess('footer'));
      } else {
        dispatch(submitError({ formId: 'footer', error: data.error || 'Failed to subscribe' }));
      }
    } catch {
      dispatch(submitError({ formId: 'footer', error: 'Network error. Try again.' }));
    }
  };

  if (status === 'success') {
    return (
      <div className="rounded-2xl bg-emerald-50/80 dark:bg-emerald-500/10 p-4 border border-emerald-100 dark:border-emerald-500/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <p className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">You&apos;re subscribed!</p>
            <p className="text-xs text-zinc-600 dark:text-zinc-400">Check your inbox for confirmation.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
        Get weekly nutrition tips
      </h3>
      <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-3">
        Evidence-based health advice delivered every week.
      </p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => dispatch(setEmail({ formId: 'footer', email: e.target.value }))}
          placeholder="Your email"
          disabled={status === 'loading'}
          className="flex-1 min-w-0 px-3 py-2 text-sm border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-shadow placeholder:text-zinc-400"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
        >
          {status === 'loading' ? '...' : 'Join'}
        </button>
      </form>
      {errorMessage && (
        <p className="mt-2 text-xs text-red-600 dark:text-red-400">{errorMessage}</p>
      )}
    </div>
  );
}
