'use client';

import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

export default function AdSenseInFeed() {
  const initialized = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialized.current) return;

    const initAd = () => {
      const container = containerRef.current;
      if (!container || container.offsetWidth < 250) {
        setTimeout(initAd, 100);
        return;
      }

      initialized.current = true;
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (err) {
        console.error('AdSense error:', err);
      }
    };

    requestAnimationFrame(initAd);
  }, []);

  return (
    <div ref={containerRef} className="my-8 sm:my-12 min-w-[280px] w-full">
      <ins
        className="adsbygoogle"
        style={{ display: 'block', minWidth: '250px', width: '100%' }}
        data-ad-format="fluid"
        data-ad-layout-key="-6t+ed+2i-1n-4w"
        data-ad-client="ca-pub-6330166847282337"
        data-ad-slot="5911345723"
      />
    </div>
  );
}
