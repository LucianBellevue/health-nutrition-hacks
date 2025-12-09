'use client';

import { useReportWebVitals } from 'next/web-vitals';
import { reportWebVitals, Metric } from '@/lib/web-vitals';

/**
 * Web Vitals reporting component
 * Add this to layout.tsx to track Core Web Vitals
 */
export default function WebVitals() {
  useReportWebVitals((metric) => {
    reportWebVitals(metric as Metric);
  });

  return null;
}
