'use client';

import { FormEvent, useState } from 'react';

interface NewsletterCTAProps {
  variant?: 'minimal' | 'banner';
  text?: string;
}

/**
 * Compact inline newsletter CTA for use within articles
 * Uses local state to avoid conflicts with other newsletter forms
 */
export default function NewsletterCTA({
  variant = 'minimal',
  text = 'Get more tips like this delivered to your inbox',
}: NewsletterCTAProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const validateEmail = (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email.trim()) {
      setStatus('error');
      setErrorMessage('Please enter your email');
      return;
    }

    if (!validateEmail(email)) {
      setStatus('error');
      setErrorMessage('Invalid email format');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStatus('success');
        setEmail('');
      } else {
        setStatus('error');
        setErrorMessage(data.error || 'Failed to subscribe');
      }
    } catch {
      setStatus('error');
      setErrorMessage('Network error. Try again.');
    }
  };

  if (status === 'success') {
    return (
      <div className="my-6 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300">
            You&apos;re subscribed! Check your inbox.
          </p>
        </div>
      </div>
    );
  }

  if (variant === 'banner') {
    return (
      <div className="my-8 p-6 rounded-2xl bg-linear-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/50 dark:to-teal-950/50 border border-emerald-100 dark:border-emerald-800/50">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1">
            <p className="font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
              {text}
            </p>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Join 5,000+ readers getting weekly nutrition tips.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="flex gap-2 shrink-0">
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (status === 'error') {
                  setStatus('idle');
                  setErrorMessage('');
                }
              }}
              placeholder="Your email"
              disabled={status === 'loading'}
              className="w-full sm:w-48 px-3 py-2 text-sm border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none placeholder:text-zinc-400"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-50 shrink-0"
            >
              {status === 'loading' ? '...' : 'Subscribe'}
            </button>
          </form>
        </div>
        {errorMessage && (
          <p className="mt-2 text-xs text-red-600 dark:text-red-400">{errorMessage}</p>
        )}
      </div>
    );
  }

  // Minimal variant
  return (
    <div className="my-6 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-700/50">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
            {text}
          </p>
          <div className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (status === 'error') {
                  setStatus('idle');
                  setErrorMessage('');
                }
              }}
              placeholder="Your email"
              disabled={status === 'loading'}
              className="flex-1 min-w-0 px-3 py-2 text-sm border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none placeholder:text-zinc-400"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="px-4 py-2 bg-zinc-900 dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-100 text-white dark:text-zinc-900 text-sm font-semibold rounded-xl transition-colors disabled:opacity-50 shrink-0"
            >
              {status === 'loading' ? '...' : 'Join'}
            </button>
          </div>
        </div>
      </form>
      {errorMessage && (
        <p className="mt-2 text-xs text-red-600 dark:text-red-400">{errorMessage}</p>
      )}
    </div>
  );
}
