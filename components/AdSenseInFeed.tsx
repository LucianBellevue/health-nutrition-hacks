'use client';

import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

export default function AdSenseInFeed() {
  const initialized = useRef(false);

  useEffect(() => {
    // Prevent duplicate initialization and use rAF to avoid forced reflow
    if (initialized.current) return;
    initialized.current = true;

    requestAnimationFrame(() => {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (err) {
        console.error('AdSense error:', err);
      }
    });
  }, []);

  return (
    <div className="my-8 sm:my-12">
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-format="fluid"
        data-ad-layout-key="-6t+ed+2i-1n-4w"
        data-ad-client="ca-pub-6330166847282337"
        data-ad-slot="5911345723"
      />
    </div>
  );
}
