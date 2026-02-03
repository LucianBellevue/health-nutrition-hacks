import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site-url';

/**
 * robots.txt for Google and search engine indexing best practices.
 * - Allow all crawlers on public content
 * - Disallow admin, API, and non-indexable paths to preserve crawl budget
 * - Sitemap reference for discovery (https only, no www)
 */
export default function robots(): MetadataRoute.Robots {

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
      {
        userAgent: 'Googlebot-Image',
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
    ],
    host: SITE_URL,
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
