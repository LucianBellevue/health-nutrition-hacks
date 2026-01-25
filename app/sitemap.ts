import { MetadataRoute } from 'next';
import { getAllPosts, getAllCategories } from '@/lib/db-posts';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = 'https://healthnutritionhacks.com';
  const posts = await getAllPosts();
  const categories = await getAllCategories();

  const blogPosts = posts.map((post) => {
    // Use updatedAt if available, otherwise fall back to date
    const lastModified = post.metadata.updatedAt
      ? new Date(post.metadata.updatedAt)
      : new Date(post.metadata.date);

    const sitemapEntry: MetadataRoute.Sitemap[0] = {
      url: `${siteUrl}/blog/${post.metadata.slug}`,
      lastModified,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    };

    // Add images if available (supports both Cloudinary URLs and relative paths)
    if (post.metadata.image) {
      // Handle absolute URLs (Cloudinary) and relative paths
      const imageUrl = post.metadata.image.startsWith('http')
        ? post.metadata.image
        : `${siteUrl}${post.metadata.image.startsWith('/') ? '' : '/'}${post.metadata.image}`;
      
      // Next.js sitemap images property expects array of image URLs
      sitemapEntry.images = [imageUrl];
    }

    return sitemapEntry;
  });

  const categoryPages = categories.map((category) => ({
    url: `${siteUrl}/categories/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${siteUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/categories`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${siteUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${siteUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${siteUrl}/disclaimer`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${siteUrl}/cookies`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    ...categoryPages,
    ...blogPosts,
  ];
}
