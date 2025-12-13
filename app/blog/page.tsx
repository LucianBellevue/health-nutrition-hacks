import { Metadata } from 'next';
import { getAllPosts, getAllCategories } from '@/lib/posts';
import BlogList from '@/components/BlogList';
import Pagination from '@/components/Pagination';
import NewsletterSignup from '@/components/NewsletterSignup';
import Link from 'next/link';

// Posts per page
const POSTS_PER_PAGE = 9;

export const metadata: Metadata = {
  title: 'Nutrition Blog – Health Nutrition Hacks',
  description: 'Discover evidence-based nutrition tips, healthy recipes, and wellness advice from our expert team.',
  openGraph: {
    title: 'Nutrition Blog – Health Nutrition Hacks',
    description: 'Discover evidence-based nutrition tips, healthy recipes, and wellness advice from our expert team.',
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
  const allPosts = getAllPosts();
  const categories = getAllCategories();

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
