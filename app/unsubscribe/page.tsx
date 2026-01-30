'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';

type ActionType = 'unsubscribe' | 'resubscribe';
type Status = 'idle' | 'loading' | 'success' | 'error';

export default function UnsubscribePage() {
  const [email, setEmail] = useState('');
  const [action, setAction] = useState<ActionType>('unsubscribe');
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');

  const validateEmail = (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email.trim()) {
      setStatus('error');
      setMessage('Please enter your email address');
      return;
    }

    if (!validateEmail(email)) {
      setStatus('error');
      setMessage('Please enter a valid email address');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      const endpoint = action === 'unsubscribe' 
        ? '/api/newsletter/unsubscribe' 
        : '/api/newsletter';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStatus('success');
        setMessage(
          action === 'unsubscribe'
            ? 'You have been successfully unsubscribed from our newsletter.'
            : 'Welcome back! You have been resubscribed to our newsletter.'
        );
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setStatus('error');
      setMessage('Network error. Please try again later.');
    }
  };

  const breadcrumbItems = [{ name: 'Unsubscribe', href: '/unsubscribe' }];

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <div className="max-w-xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <Breadcrumbs items={breadcrumbItems} />
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-500/20 mb-6">
            <svg
              className="w-8 h-8 text-emerald-600 dark:text-emerald-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-3">
            Manage Your Subscription
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Update your email preferences below.
          </p>
        </div>

        {/* Success State */}
        {status === 'success' ? (
          <div className="rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 p-8 border border-emerald-100 dark:border-emerald-500/20 text-center">
            <div className="flex justify-center mb-4">
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
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
              {action === 'unsubscribe' ? 'Unsubscribed' : 'Resubscribed'}
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 mb-6">{message}</p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => {
                  setStatus('idle');
                  setAction(action === 'unsubscribe' ? 'resubscribe' : 'unsubscribe');
                }}
                className="px-6 py-3 text-sm font-semibold text-emerald-700 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-300 transition-colors"
              >
                {action === 'unsubscribe' ? 'Changed your mind? Resubscribe →' : 'Need to unsubscribe? →'}
              </button>
              <Link
                href="/"
                className="px-6 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-sm font-semibold rounded-xl hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors"
              >
                Back to Home
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Action Toggle */}
            <div className="flex rounded-xl bg-zinc-100 dark:bg-zinc-800 p-1 mb-8">
              <button
                type="button"
                onClick={() => setAction('unsubscribe')}
                className={`flex-1 py-3 px-4 text-sm font-semibold rounded-lg transition-all ${
                  action === 'unsubscribe'
                    ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
              >
                Unsubscribe
              </button>
              <button
                type="button"
                onClick={() => setAction('resubscribe')}
                className={`flex-1 py-3 px-4 text-sm font-semibold rounded-lg transition-all ${
                  action === 'resubscribe'
                    ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
              >
                Resubscribe
              </button>
            </div>

            {/* Form */}
            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-8">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                  {action === 'unsubscribe' 
                    ? 'Unsubscribe from our newsletter' 
                    : 'Resubscribe to our newsletter'}
                </h2>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  {action === 'unsubscribe'
                    ? "We're sorry to see you go. Enter your email below to unsubscribe from all newsletters."
                    : "Welcome back! Enter your email to start receiving our weekly nutrition tips again."}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label 
                    htmlFor="email" 
                    className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
                  >
                    Email address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (status === 'error') {
                        setStatus('idle');
                        setMessage('');
                      }
                    }}
                    placeholder="you@example.com"
                    disabled={status === 'loading'}
                    className="w-full px-4 py-3 border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-shadow placeholder:text-zinc-400"
                  />
                </div>

                {status === 'error' && message && (
                  <p className="text-sm text-red-600 dark:text-red-400">{message}</p>
                )}

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className={`w-full py-3 px-4 font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                    action === 'unsubscribe'
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }`}
                >
                  {status === 'loading' 
                    ? 'Processing...' 
                    : action === 'unsubscribe' 
                      ? 'Unsubscribe' 
                      : 'Resubscribe'}
                </button>
              </form>
            </div>

            {/* Additional info */}
            <div className="mt-8 text-center">
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                {action === 'unsubscribe' ? (
                  <>
                    Changed your mind?{' '}
                    <button
                      type="button"
                      onClick={() => setAction('resubscribe')}
                      className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium"
                    >
                      Resubscribe instead
                    </button>
                  </>
                ) : (
                  <>
                    Need to unsubscribe?{' '}
                    <button
                      type="button"
                      onClick={() => setAction('unsubscribe')}
                      className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium"
                    >
                      Click here
                    </button>
                  </>
                )}
              </p>
              <Link
                href="/"
                className="inline-block mt-4 text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
              >
                ← Back to Home
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
