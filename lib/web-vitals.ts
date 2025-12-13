/**
 * Web Vitals tracking for Core Web Vitals metrics
 * 
 * Tracks: LCP, FID, CLS, FCP, TTFB, INP
 * 
 * Usage: Import in app/layout.tsx or create a WebVitals component
 */

export type Metric = {
  id: string;
  name: 'CLS' | 'FCP' | 'FID' | 'INP' | 'LCP' | 'TTFB';
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  navigationType: 'navigate' | 'reload' | 'back-forward' | 'back-forward-cache' | 'prerender' | 'restore';
};

/**
 * Report Web Vitals to console (or your analytics service)
 */
type WindowWithGtag = Window &
  typeof globalThis & {
    gtag?: (
      command: "event",
      action: string,
      params: {
        event_category: string;
        value: number;
        event_label: string;
        non_interaction: boolean;
      },
    ) => void;
  };

export function reportWebVitals(metric: Metric) {
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Web Vitals] ${metric.name}:`, {
      value: metric.value,
      rating: metric.rating,
      delta: metric.delta,
    });
  }

  // Example: Send to Google Analytics
  if (typeof window !== 'undefined') {
    const win = window as WindowWithGtag;
    win.gtag?.('event', metric.name, {
      event_category: 'Web Vitals',
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      event_label: metric.id,
      non_interaction: true,
    });
  }

  // Example: Send to custom analytics endpoint
  // fetch('/api/analytics', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({
  //     metric: metric.name,
  //     value: metric.value,
  //     rating: metric.rating,
  //     page: window.location.pathname,
  //   }),
  // });
}

/**
 * Get Web Vitals thresholds
 */
export const getThresholds = (name: Metric['name']) => {
  const thresholds = {
    LCP: { good: 2500, needsImprovement: 4000 }, // Largest Contentful Paint
    FID: { good: 100, needsImprovement: 300 },   // First Input Delay
    CLS: { good: 0.1, needsImprovement: 0.25 },  // Cumulative Layout Shift
    FCP: { good: 1800, needsImprovement: 3000 }, // First Contentful Paint
    TTFB: { good: 800, needsImprovement: 1800 }, // Time to First Byte
    INP: { good: 200, needsImprovement: 500 },   // Interaction to Next Paint
  };

  return thresholds[name];
};

/**
 * Calculate rating based on value
 */
export const getRating = (name: Metric['name'], value: number): Metric['rating'] => {
  const threshold = getThresholds(name);
  
  if (value <= threshold.good) return 'good';
  if (value <= threshold.needsImprovement) return 'needs-improvement';
  return 'poor';
};
