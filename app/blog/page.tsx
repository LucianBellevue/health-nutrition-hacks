import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { getAllPosts, getAllCategories } from '@/lib/db-posts';
import BlogList from '@/components/BlogList';

// Dynamic imports for non-critical components to reduce initial JS bundle
const NewsletterSignup = dynamic(() => import('@/components/NewsletterSignup'), {
  loading: () => <div className="h-32 bg-zinc-100 dark:bg-zinc-800 rounded-lg animate-pulse" />,
});
const AdSenseMultiplex = dynamic(() => import('@/components/AdSenseMultiplex'));

// Posts per page
const POSTS_PER_PAGE = 9;

const SITE_URL = 'https://healthnutritionhacks.com';
const OG_IMAGE = `${SITE_URL}/api/og?title=${encodeURIComponent('Nutrition Blog - Latest Articles')}&category=Blog&author=HNH Team`;

export const metadata: Metadata = {
  title: 'Nutrition Blog – Health Nutrition Hacks',
  description: 'Discover evidence-based nutrition tips, healthy recipes, and wellness advice from our expert team.',
  alternates: {
    canonical: `${SITE_URL}/blog`,
  },
  openGraph: {
    title: 'Nutrition Blog – Health Nutrition Hacks',
    description: 'Discover evidence-based nutrition tips, healthy recipes, and wellness advice from our expert team.',
    type: 'website',
    url: `${SITE_URL}/blog`,
    siteName: 'Health Nutrition Hacks',
    locale: 'en_US',
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: 'Health Nutrition Hacks Blog',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nutrition Blog – Health Nutrition Hacks',
    description: 'Discover evidence-based nutrition tips, healthy recipes, and wellness advice from our expert team.',
    images: [OG_IMAGE],
  },
};

interface BlogPageProps {
  searchParams: Promise<{ page?: string }>;
}

/**
 * Blog index page - lists all blog posts with search, filters, and pagination
 */
export default async function BlogPage({ searchParams }: BlogPageProps) {
  await searchParams; // Required by Next.js async searchParams pattern
  const allPosts = await getAllPosts();
  const categories = await getAllCategories();

  // Get all posts metadata (no server-side pagination - let client handle it after filtering)
  const postsMetadata = allPosts.map((post) => post.metadata);

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
            Nutrition Blog
          </h1>
          <p className="text-lg text-zinc-700 dark:text-zinc-300 max-w-2xl mx-auto">
            Evidence-based nutrition advice, healthy recipes, and wellness tips to help you live your healthiest life.
          </p>
        </div>

        {/* Newsletter Signup - Above Posts */}
        <div className="mb-12">
          <NewsletterSignup />
        </div>

        {/* Blog List with Filters (Client Component) */}
        {postsMetadata.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-zinc-700 dark:text-zinc-300 text-lg">No posts yet. Check back soon!</p>
          </div>
        ) : (
          <>
            <BlogList posts={postsMetadata} categories={categories} postsPerPage={POSTS_PER_PAGE} />
            
            {/* Multiplex Ad */}
            <AdSenseMultiplex />
          </>
        )}
      </div>
    </div>
  );
}
