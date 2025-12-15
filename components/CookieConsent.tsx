'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const COOKIE_CONSENT_KEY = 'hnh_cookie_consent';
const CONSENT_EXPIRY_DAYS = 365;

type ConsentStatus = 'pending' | 'accepted' | 'declined';

interface ConsentData {
  status: ConsentStatus;
  timestamp: string;
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
}

/**
 * Cookie consent banner component
 * Shows only on first visit, stores preference in localStorage
 * GDPR and Google AdSense compliant
 */
export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState({
    essential: true, // Always true, cannot be disabled
    analytics: true,
    marketing: true,
  });

  useEffect(() => {
    // Check if user has already made a choice
    const checkConsent = () => {
      const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
      
      if (!consent) {
        return true; // Should show banner
      }

      // Verify consent hasn't expired
      try {
        const consentData: ConsentData = JSON.parse(consent);
        const consentDate = new Date(consentData.timestamp);
        const now = new Date();
        const daysSinceConsent = (now.getTime() - consentDate.getTime()) / (1000 * 60 * 60 * 24);
        
        if (daysSinceConsent > CONSENT_EXPIRY_DAYS) {
          localStorage.removeItem(COOKIE_CONSENT_KEY);
          return true; // Should show banner
        }
        return false; // Valid consent exists
      } catch {
        // Invalid consent data
        localStorage.removeItem(COOKIE_CONSENT_KEY);
        return true; // Should show banner
      }
    };

    const shouldShow = checkConsent();
    
    if (shouldShow) {
      // Small delay for better UX - don't show immediately
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const saveConsent = (status: ConsentStatus, prefs = preferences) => {
    const consentData: ConsentData = {
      status,
      timestamp: new Date().toISOString(),
      essential: true,
      analytics: status === 'accepted' ? prefs.analytics : false,
      marketing: status === 'accepted' ? prefs.marketing : false,
    };

    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consentData));
    setIsVisible(false);

    // Dispatch custom event for analytics scripts to listen to
    window.dispatchEvent(new CustomEvent('cookieConsentChanged', { detail: consentData }));
  };

  const handleAcceptAll = () => {
    setPreferences({ essential: true, analytics: true, marketing: true });
    saveConsent('accepted', { essential: true, analytics: true, marketing: true });
  };

  const handleDecline = () => {
    saveConsent('declined');
  };

  const handleSavePreferences = () => {
    saveConsent('accepted', preferences);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl shadow-black/10 dark:shadow-black/30 overflow-hidden">
          {/* Main Banner */}
          <div className="p-4 sm:p-6">
            <div className="flex flex-col lg:flex-row lg:items-start gap-4">
              {/* Icon & Text */}
              <div className="flex-1">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
                      We value your privacy
                    </h3>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. 
                      By clicking &quot;Accept All&quot;, you consent to our use of cookies.{' '}
                      <Link href="/cookies" className="text-emerald-600 dark:text-emerald-400 hover:underline">
                        Learn more
                      </Link>
                    </p>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 lg:shrink-0">
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="px-4 py-2.5 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                >
                  {showDetails ? 'Hide options' : 'Customize'}
                </button>
                <button
                  onClick={handleDecline}
                  className="px-4 py-2.5 text-sm font-medium border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  Decline
                </button>
                <button
                  onClick={handleAcceptAll}
                  className="px-5 py-2.5 text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-colors"
                >
                  Accept All
                </button>
              </div>
            </div>
          </div>

          {/* Expanded Options */}
          {showDetails && (
            <div className="border-t border-zinc-200 dark:border-zinc-800 p-4 sm:p-6 bg-zinc-50 dark:bg-zinc-900/50">
              <div className="space-y-4">
                {/* Essential Cookies */}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      <h4 className="font-medium text-zinc-900 dark:text-zinc-100 text-sm">
                        Essential Cookies
                      </h4>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-400">
                        Required
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                      Necessary for the website to function. Cannot be disabled.
                    </p>
                  </div>
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={true}
                      disabled
                      className="sr-only"
                    />
                    <div className="w-10 h-6 rounded-full bg-emerald-500 opacity-60 cursor-not-allowed">
                      <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-white shadow"></div>
                    </div>
                  </div>
                </div>

                {/* Analytics Cookies */}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                      <h4 className="font-medium text-zinc-900 dark:text-zinc-100 text-sm">
                        Analytics Cookies
                      </h4>
                    </div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                      Help us understand how visitors interact with our website.
                    </p>
                  </div>
                  <button
                    onClick={() => setPreferences(p => ({ ...p, analytics: !p.analytics }))}
                    className="relative shrink-0"
                    aria-label="Toggle analytics cookies"
                  >
                    <div className={`w-10 h-6 rounded-full transition-colors ${preferences.analytics ? 'bg-emerald-500' : 'bg-zinc-300 dark:bg-zinc-600'}`}>
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${preferences.analytics ? 'right-1' : 'left-1'}`}></div>
                    </div>
                  </button>
                </div>

                {/* Marketing Cookies */}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                      <h4 className="font-medium text-zinc-900 dark:text-zinc-100 text-sm">
                        Marketing Cookies
                      </h4>
                    </div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                      Used to deliver personalized advertisements.
                    </p>
                  </div>
                  <button
                    onClick={() => setPreferences(p => ({ ...p, marketing: !p.marketing }))}
                    className="relative shrink-0"
                    aria-label="Toggle marketing cookies"
                  >
                    <div className={`w-10 h-6 rounded-full transition-colors ${preferences.marketing ? 'bg-emerald-500' : 'bg-zinc-300 dark:bg-zinc-600'}`}>
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${preferences.marketing ? 'right-1' : 'left-1'}`}></div>
                    </div>
                  </button>
                </div>

                {/* Save Preferences Button */}
                <div className="pt-2">
                  <button
                    onClick={handleSavePreferences}
                    className="w-full sm:w-auto px-5 py-2.5 text-sm font-semibold bg-zinc-900 dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-100 text-white dark:text-zinc-900 rounded-xl transition-colors"
                  >
                    Save Preferences
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
