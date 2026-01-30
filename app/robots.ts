import { MetadataRoute } from 'next';

/**
 * robots.txt for Google and search engine indexing best practices.
 * - Allow all crawlers on public content
 * - Disallow admin, API, and non-indexable paths to preserve crawl budget
 * - Sitemap reference for discovery (https only, no www)
 */
export default function robots(): MetadataRoute.Robots {
  const siteUrl = 'https://healthnutritionhacks.com';

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
    host: siteUrl,
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
