'use client';

import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

export default function AdSenseMultiplex() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ins = container.querySelector('ins.adsbygoogle');
    if (!ins || ins.getAttribute('data-adsbygoogle-status')) return;

    const initAd = () => {
      if (container.offsetWidth < 250) {
        setTimeout(initAd, 100);
        return;
      }

      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch {
        // Silently ignore duplicate ad errors
      }
    };

    requestAnimationFrame(initAd);
  }, []);

  return (
    <div ref={containerRef} className="my-8 sm:my-12 min-w-[280px] w-full">
      <ins
        className="adsbygoogle"
        style={{ display: 'block', minWidth: '250px', width: '100%' }}
        data-ad-format="autorelaxed"
        data-ad-client="ca-pub-6330166847282337"
        data-ad-slot="5667162519"
      />
    </div>
  );
}
