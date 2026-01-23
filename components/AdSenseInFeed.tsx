'use client';

import { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

export default function AdSenseInFeed() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Use Intersection Observer to only load ad when near viewport
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: '200px', // Load when 200px away from viewport
        threshold: 0.01,
      }
    );

    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    
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
  }, [isVisible]);

  return (
    <div ref={containerRef} className="my-8 sm:my-12 min-w-[280px] w-full">
      {isVisible && (
        <ins
          className="adsbygoogle"
          style={{ display: 'block', minWidth: '250px', width: '100%' }}
          data-ad-format="fluid"
          data-ad-layout-key="-6t+ed+2i-1n-4w"
          data-ad-client="ca-pub-6330166847282337"
          data-ad-slot="5911345723"
        />
      )}
    </div>
  );
}
