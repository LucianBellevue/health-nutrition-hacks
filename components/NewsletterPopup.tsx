'use client';

import { useEffect, useState, useCallback, FormEvent } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  setEmail,
  submitStart,
  submitSuccess,
  submitError,
  dismissPopup,
} from '@/store/slices/newsletterSlice';

const POPUP_DELAY_MS = 15000; // 15 seconds
const SCROLL_THRESHOLD = 0.4; // 40% scroll depth
const STORAGE_KEY = 'hnh_popup_dismissed';
const DISMISS_DURATION_DAYS = 7;

/**
 * Newsletter popup with smart triggers:
 * - Time delay (15s on page)
 * - Scroll depth (40%)
 * - Exit intent (mouse leaves viewport)
 */
export default function NewsletterPopup() {
  const dispatch = useAppDispatch();
  const { email, status, errorMessage } = useAppSelector(
    (state) => state.newsletter.forms.popup
  );
  const { popupDismissed, hasSubscribed } = useAppSelector(
    (state) => state.newsletter
  );

  const [isVisible, setIsVisible] = useState(false);
  const [triggered, setTriggered] = useState(false);

  const validateEmail = (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const shouldShowPopup = useCallback(() => {
    // Don't show if already subscribed or dismissed
    if (hasSubscribed || popupDismissed) return false;

    // Check localStorage for previous dismissal
    if (typeof window !== 'undefined') {
      const dismissed = localStorage.getItem(STORAGE_KEY);
      if (dismissed) {
        const dismissedDate = new Date(dismissed);
        const now = new Date();
        const daysSinceDismissed =
          (now.getTime() - dismissedDate.getTime()) / (1000 * 60 * 60 * 24);
        if (daysSinceDismissed < DISMISS_DURATION_DAYS) {
          return false;
        }
      }
    }

    return true;
  }, [hasSubscribed, popupDismissed]);

  const showPopup = useCallback(() => {
    if (!triggered && shouldShowPopup()) {
      setTriggered(true);
      setIsVisible(true);
    }
  }, [triggered, shouldShowPopup]);

  const handleClose = () => {
    setIsVisible(false);
    dispatch(dismissPopup());
    localStorage.setItem(STORAGE_KEY, new Date().toISOString());
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email.trim()) {
      dispatch(submitError({ formId: 'popup', error: 'Please enter your email address' }));
      return;
    }

    if (!validateEmail(email)) {
      dispatch(submitError({ formId: 'popup', error: 'Please enter a valid email address' }));
      return;
    }

    dispatch(submitStart('popup'));

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        dispatch(submitSuccess('popup'));
        // Auto-close after success
        setTimeout(() => {
          setIsVisible(false);
          localStorage.setItem(STORAGE_KEY, new Date().toISOString());
        }, 3000);
      } else {
        dispatch(submitError({ formId: 'popup', error: data.error || 'Something went wrong.' }));
      }
    } catch {
      dispatch(submitError({ formId: 'popup', error: 'Failed to subscribe. Please try again.' }));
    }
  };

  // Time-based trigger
  useEffect(() => {
    const timer = setTimeout(() => {
      showPopup();
    }, POPUP_DELAY_MS);

    return () => clearTimeout(timer);
  }, [showPopup]);

  // Scroll-based trigger with debouncing to prevent forced reflows
  useEffect(() => {
    let ticking = false;
    let cachedScrollHeight = 0;

    const updateScrollHeight = () => {
      cachedScrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    };

    const handleScroll = () => {
      if (ticking) return;
      
      ticking = true;
      requestAnimationFrame(() => {
        // Use cached scrollHeight, only recalculate occasionally
        if (cachedScrollHeight === 0) {
          updateScrollHeight();
        }
        
        const scrolled = window.scrollY / cachedScrollHeight;
        if (scrolled >= SCROLL_THRESHOLD) {
          showPopup();
        }
        ticking = false;
      });
    };

    // Calculate initial scrollHeight after layout is stable
    requestAnimationFrame(updateScrollHeight);

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', updateScrollHeight, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateScrollHeight);
    };
  }, [showPopup]);

  // Exit intent trigger (desktop only)
  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        showPopup();
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [showPopup]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isVisible) {
        setIsVisible(false);
        dispatch(dismissPopup());
        localStorage.setItem(STORAGE_KEY, new Date().toISOString());
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isVisible, dispatch]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl animate-in zoom-in-95 fade-in duration-300 overflow-hidden">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors z-10"
          aria-label="Close popup"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Decorative gradient */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-linear-to-br from-emerald-500/20 via-teal-400/15 to-cyan-400/10" />

        <div className="relative p-6 sm:p-8 pt-12">
          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center">
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
          </div>

          {status === 'success' ? (
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center">
                  <svg className="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                Welcome aboard!
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                Check your inbox for a confirmation email.
              </p>
            </div>
          ) : (
            <>
              <div className="text-center mb-6">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-600 mb-2">
                  Don&apos;t miss out
                </p>
                <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                  Get Free Nutrition Tips
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm">
                  Join 5,000+ readers getting evidence-based health advice every week.
                </p>
              </div>

              {/* Benefits */}
              <ul className="space-y-2 mb-6">
                {[
                  'Weekly nutrition tips & healthy recipes',
                  'Exclusive content not on the blog',
                  'Science-backed wellness strategies',
                ].map((benefit) => (
                  <li key={benefit} className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
                    <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {benefit}
                  </li>
                ))}
              </ul>

              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => dispatch(setEmail({ formId: 'popup', email: e.target.value }))}
                  placeholder="Enter your email address"
                  disabled={status === 'loading'}
                  className="w-full px-4 py-3 border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-shadow placeholder:text-zinc-400"
                />
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/25 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                >
                  {status === 'loading' ? 'Subscribing...' : 'Yes, I want in!'}
                </button>
              </form>

              {errorMessage && (
                <p className="mt-3 text-sm text-red-600 dark:text-red-400 text-center">{errorMessage}</p>
              )}

              <p className="mt-4 text-xs text-zinc-500 dark:text-zinc-400 text-center">
                No spam, ever. Unsubscribe anytime.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
