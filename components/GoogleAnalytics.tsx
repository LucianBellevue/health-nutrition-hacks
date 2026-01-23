'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Script from 'next/script';

/**
 * Google Analytics (GTM) client component
 * Lazy loaded to reduce initial JavaScript bundle
 * Uses Next.js routing for better integration
 */
export default function GoogleAnalytics() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', 'G-E52LN1C1H2', {
        page_path: pathname,
      });
    }
  }, [pathname]);

  return (
    <Script
      src="https://www.googletagmanager.com/gtag/js?id=G-E52LN1C1H2"
      strategy="lazyOnload"
      onLoad={() => {
        window.dataLayer = window.dataLayer || [];
        function gtag(...args: unknown[]) {
          window.dataLayer.push(args);
        }
        window.gtag = gtag;
        gtag('js', new Date());
        gtag('config', 'G-E52LN1C1H2', {
          page_path: pathname,
          send_page_view: false // Prevent automatic page views
        });
      }}
    />
  );
}
