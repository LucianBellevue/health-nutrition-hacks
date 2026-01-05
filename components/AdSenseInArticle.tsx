'use client';

import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

export default function AdSenseInArticle() {
  const initialized = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialized.current) return;

    const initAd = () => {
      const container = containerRef.current;
      if (!container || container.offsetWidth < 250) {
        // Retry after a short delay if container isn't ready
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
    <div ref={containerRef} className="my-6 min-w-[280px] w-full">
      <ins
        className="adsbygoogle"
        style={{ display: 'block', textAlign: 'center', minWidth: '250px', width: '100%' }}
        data-ad-layout="in-article"
        data-ad-format="fluid"
        data-ad-client="ca-pub-6330166847282337"
        data-ad-slot="9299108152"
      />
    </div>
  );
}
