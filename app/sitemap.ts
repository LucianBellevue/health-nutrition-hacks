import { MetadataRoute } from 'next';
import { getAllPosts, getAllCategories } from '@/lib/db-posts';

const SITE_URL = 'https://healthnutritionhacks.com';

/**
 * XML Sitemap for Google and search engine indexing.
 * - All URLs are absolute https (no www)
 * - Includes only indexable pages (excludes /unsubscribe, /admin, etc.)
 * - lastModified, changeFrequency, and priority per Google best practices
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts();
  const categories = await getAllCategories();

  const blogPosts = posts.map((post) => {
    // Use updatedAt if available, otherwise fall back to date
    const lastModified = post.metadata.updatedAt
      ? new Date(post.metadata.updatedAt)
      : new Date(post.metadata.date);

    const sitemapEntry: MetadataRoute.Sitemap[0] = {
      url: `${SITE_URL}/blog/${post.metadata.slug}`,
      lastModified,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    };

    // Add images if available (supports both Cloudinary URLs and relative paths)
    if (post.metadata.image) {
      // Handle absolute URLs (Cloudinary) and relative paths
      const imageUrl = post.metadata.image.startsWith('http')
        ? post.metadata.image
        : `${SITE_URL}${post.metadata.image.startsWith('/') ? '' : '/'}${post.metadata.image}`;
      // Next.js sitemap images property expects array of image URLs
      sitemapEntry.images = [imageUrl];
    }

    return sitemapEntry;
  });

  const categoryPages = categories.map((category) => ({
    url: `${SITE_URL}/categories/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${SITE_URL}/blog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE_URL}/categories`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${SITE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/privacy`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${SITE_URL}/terms`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${SITE_URL}/disclaimer`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${SITE_URL}/cookies`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    ...categoryPages,
    ...blogPosts,
  ];
}
