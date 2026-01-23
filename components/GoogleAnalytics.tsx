'use client';

import Script from 'next/script';

/**
 * Google Analytics (GTM) client component
 * Lazy loaded to reduce initial JavaScript bundle
 */
export default function GoogleAnalytics() {
  return (
    <Script
      src="https://www.googletagmanager.com/gtag/js?id=G-E52LN1C1H2"
      strategy="lazyOnload"
      onLoad={() => {
        // @ts-expect-error - dataLayer is added by GTM script
        window.dataLayer = window.dataLayer || [];
        // @ts-expect-error - gtag is a global function added by GTM
        function gtag(...args: unknown[]){dataLayer.push(args);}
        gtag('js', new Date());
        gtag('config', 'G-E52LN1C1H2', {
          page_path: window.location.pathname,
          send_page_view: false // Prevent automatic page views
        });
      }}
    />
  );
}
