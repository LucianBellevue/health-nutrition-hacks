import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { getAllPosts, getAllCategories } from '@/lib/db-posts';
import BlogList from '@/components/BlogList';
import Pagination from '@/components/Pagination';
import Link from 'next/link';

// Dynamic imports for non-critical components to reduce initial JS bundle
const NewsletterSignup = dynamic(() => import('@/components/NewsletterSignup'), {
  loading: () => <div className="h-32 bg-zinc-100 dark:bg-zinc-800 rounded-lg animate-pulse" />,
});
const AdSenseMultiplex = dynamic(() => import('@/components/AdSenseMultiplex'));

// Posts per page
const POSTS_PER_PAGE = 9;

const SITE_URL = 'https://www.healthnutritionhacks.com';
const OG_IMAGE = `${SITE_URL}/api/og?title=${encodeURIComponent('Nutrition Blog - Latest Articles')}&category=Blog&author=HNH Team`;

export const metadata: Metadata = {
  title: 'Nutrition Blog – Health Nutrition Hacks',
  description: 'Discover evidence-based nutrition tips, healthy recipes, and wellness advice from our expert team.',
  alternates: {
    canonical: '/blog',
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
    site: '@healthnutritionhacks',
    creator: '@healthnutritionhacks',
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
  const params = await searchParams;
  const allPosts = await getAllPosts();
  const categories = await getAllCategories();

  // Parse page number from query params
  const currentPage = Math.max(1, parseInt(params.page || '1', 10));

  // Calculate pagination
  const totalPosts = allPosts.length;
  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;

  // Get posts for current page
  const postsForPage = allPosts.slice(startIndex, endIndex);
  const postsMetadata = postsForPage.map((post) => post.metadata);

  // If page number is out of bounds, show empty state
  if (currentPage > totalPages && totalPosts > 0) {
    return (
      <div className="min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-12">
            <p className="text-zinc-600 text-lg">
              Page not found. <Link href="/blog" className="text-emerald-600 hover:underline">Return to page 1</Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

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
        {totalPosts === 0 ? (
          <div className="text-center py-12">
            <p className="text-zinc-700 dark:text-zinc-300 text-lg">No posts yet. Check back soon!</p>
          </div>
        ) : (
          <>
            <BlogList posts={postsMetadata} categories={categories} />
            
            {/* Multiplex Ad */}
            <AdSenseMultiplex />
            
            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              basePath="/blog"
            />
          </>
        )}
      </div>
    </div>
  );
}
