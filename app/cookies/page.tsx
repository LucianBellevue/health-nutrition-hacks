import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Cookie Policy – Health Nutrition Hacks',
  description: 'Learn how Health Nutrition Hacks uses cookies and similar technologies to improve your browsing experience.',
};

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {/* Header */}
        <div className="mb-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors mb-6"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
            Cookie Policy
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-zinc dark:prose-invert max-w-none">
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
              What Are Cookies?
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
              Cookies are small text files that are stored on your computer or mobile device when you visit a website. 
              They are widely used to make websites work more efficiently and provide information to website owners.
            </p>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Cookies help us understand how you use our website, remember your preferences, and improve your overall experience.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
              How We Use Cookies
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
              Health Nutrition Hacks uses cookies and similar technologies for the following purposes:
            </p>
            
            <div className="space-y-6">
              <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-5">
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Essential Cookies
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  These cookies are necessary for the website to function properly. They enable basic functions like 
                  page navigation, access to secure areas, and remembering your cookie consent preferences. 
                  The website cannot function properly without these cookies.
                </p>
              </div>

              <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-5">
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  Preference Cookies
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  These cookies allow the website to remember choices you make (such as your preferred theme - 
                  light or dark mode) and provide enhanced, personalized features. They may also be used to 
                  remember changes you have made to text size and other customizable parts of web pages.
                </p>
              </div>

              <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-5">
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  Analytics Cookies
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  These cookies help us understand how visitors interact with our website by collecting and 
                  reporting information anonymously. This helps us improve our website&apos;s structure and content. 
                  We may use services like Google Analytics to collect this data.
                </p>
              </div>

              <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-5">
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                  Marketing Cookies
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  These cookies are used to track visitors across websites. The intention is to display ads 
                  that are relevant and engaging for individual users. These cookies may be set by third-party 
                  advertising networks with our permission.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
              Third-Party Cookies
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
              In addition to our own cookies, we may also use various third-party cookies to report usage 
              statistics of the website and deliver advertisements on and through the website. These may include:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-zinc-600 dark:text-zinc-400">
              <li><strong>Google Analytics</strong> – For website traffic analysis and reporting</li>
              <li><strong>Google AdSense</strong> – For displaying relevant advertisements</li>
              <li><strong>Social media plugins</strong> – For sharing content on social platforms</li>
              <li><strong>Affiliate networks</strong> – For tracking referrals to partner products (Amazon, iHerb)</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
              Managing Your Cookie Preferences
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
              You have the right to decide whether to accept or reject cookies. You can manage your cookie 
              preferences in the following ways:
            </p>
            
            <div className="rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 mb-4">
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                Cookie Consent Banner
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                When you first visit our website, you will see a cookie consent banner that allows you to 
                accept or decline non-essential cookies. You can change your preferences at any time by 
                clearing your browser cookies and revisiting our site.
              </p>
            </div>

            <div className="rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5">
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                Browser Settings
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">
                Most web browsers allow you to control cookies through their settings. You can set your 
                browser to refuse cookies or delete certain cookies. Here&apos;s how to manage cookies in popular browsers:
              </p>
              <ul className="text-sm text-zinc-600 dark:text-zinc-400 space-y-1">
                <li>• <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-emerald-600 dark:text-emerald-400 hover:underline">Google Chrome</a></li>
                <li>• <a href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer" target="_blank" rel="noopener noreferrer" className="text-emerald-600 dark:text-emerald-400 hover:underline">Mozilla Firefox</a></li>
                <li>• <a href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-emerald-600 dark:text-emerald-400 hover:underline">Safari</a></li>
                <li>• <a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-emerald-600 dark:text-emerald-400 hover:underline">Microsoft Edge</a></li>
              </ul>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
              Cookie Retention Period
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              The length of time cookies remain on your device varies depending on their type:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-zinc-600 dark:text-zinc-400 mt-4">
              <li><strong>Session cookies</strong> – These are temporary and are deleted when you close your browser.</li>
              <li><strong>Persistent cookies</strong> – These remain on your device for a set period (ranging from 
              30 days to 2 years) or until you delete them manually.</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
              Impact of Disabling Cookies
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              If you choose to disable cookies, some parts of our website may not function properly. 
              For example, your theme preferences may not be saved, and some interactive features may be limited. 
              Essential cookies cannot be disabled as they are necessary for the website to function.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
              Updates to This Policy
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              We may update this Cookie Policy from time to time to reflect changes in our practices or for 
              other operational, legal, or regulatory reasons. We encourage you to review this page periodically 
              for the latest information on our cookie practices.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
              Contact Us
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              If you have any questions about our use of cookies or this Cookie Policy, please contact us at:
            </p>
            <p className="mt-4">
              <a 
                href="mailto:privacy@healthnutritionhacks.com" 
                className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium"
              >
                privacy@healthnutritionhacks.com
              </a>
            </p>
          </section>

          {/* Related Links */}
          <section className="pt-8 border-t border-zinc-200 dark:border-zinc-800">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
              Related Policies
            </h2>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/privacy"
                className="text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                Terms of Service
              </Link>
              <Link
                href="/disclaimer"
                className="text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                Disclaimer
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
