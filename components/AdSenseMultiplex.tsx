'use client';

import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

export default function AdSenseMultiplex() {
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
        data-ad-format="autorelaxed"
        data-ad-client="ca-pub-6330166847282337"
        data-ad-slot="5667162519"
      />
    </div>
  );
}
