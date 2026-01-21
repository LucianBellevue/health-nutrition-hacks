import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllCategories, getPostsByCategory, getCategoryBySlug } from '@/lib/db-posts';
import PostCard from '@/components/PostCard';
import Pagination from '@/components/Pagination';
import Link from 'next/link';

// Posts per page for category pages
const POSTS_PER_PAGE = 9;

const SITE_URL = 'https://healthnutritionhacks.com';

interface Props {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ page?: string }>;
}

/**
 * Generate static params for all categories
 */
export async function generateStaticParams() {
  const categories = await getAllCategories();
  return categories.map((category) => ({
    category: category.slug,
  }));
}

/**
 * Generate metadata for category pages
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const category = await getCategoryBySlug(categorySlug);

  if (!category) {
    return {
      title: 'Category Not Found – Health Nutrition Hacks',
    };
  }

  const ogImage = `${SITE_URL}/api/og?title=${encodeURIComponent(category.name)}&category=${encodeURIComponent(category.name)}&author=HNH Team`;

  return {
    title: `${category.name} – Health Nutrition Hacks`,
    description: `Browse all ${category.name.toLowerCase()} posts. ${category.count} articles about ${category.name.toLowerCase()}.`,
    alternates: {
      canonical: `/categories/${categorySlug}`,
    },
    openGraph: {
      title: `${category.name} – Health Nutrition Hacks`,
      description: `Browse all ${category.name.toLowerCase()} posts. ${category.count} articles about ${category.name.toLowerCase()}.`,
      url: `${SITE_URL}/categories/${categorySlug}`,
      siteName: 'Health Nutrition Hacks',
      type: 'website',
      locale: 'en_US',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${category.name} - Health Nutrition Hacks`,
          type: 'image/png',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${category.name} – Health Nutrition Hacks`,
      description: `Browse all ${category.name.toLowerCase()} posts. ${category.count} articles about ${category.name.toLowerCase()}.`,
      site: '@healthnutritionhacks',
      creator: '@healthnutritionhacks',
      images: [ogImage],
    },
  };
}

/**
 * Category detail page with pagination
 */
export default async function CategoryPage({ params, searchParams }: Props) {
  const { category: categorySlug } = await params;
  const queryParams = await searchParams;
  const category = await getCategoryBySlug(categorySlug);

  if (!category) {
    notFound();
  }

  const allPosts = await getPostsByCategory(categorySlug);

  // Parse page number from query params
  const currentPage = Math.max(1, parseInt(queryParams.page || '1', 10));

  // Calculate pagination
  const totalPosts = allPosts.length;
  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;

  // Get posts for current page
  const postsForPage = allPosts.slice(startIndex, endIndex);

  // If page number is out of bounds, show empty state
  if (currentPage > totalPages && totalPosts > 0) {
    return (
      <div className="min-h-screen bg-zinc-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-12">
            <p className="text-zinc-400 text-lg">
              Page not found.{' '}
              <Link href={`/categories/${categorySlug}`} className="text-emerald-400 hover:underline">
                Return to page 1
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-zinc-400 mb-6">
          <Link href="/categories" className="hover:text-emerald-400 transition-colors">
            Categories
          </Link>
          <span>/</span>
          <span className="text-white font-medium">{category.name}</span>
        </nav>

        {/* Header Section */}
        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            {category.name}
          </h1>
          <p className="text-lg text-zinc-300">
            {category.count} {category.count === 1 ? 'post' : 'posts'} in this category
          </p>
        </div>

        {/* Posts Grid */}
        {totalPosts > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {postsForPage.map((post) => (
                <PostCard key={post.metadata.slug} post={post.metadata} />
              ))}
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              basePath={`/categories/${categorySlug}`}
            />
          </>
        ) : (
          <div className="text-center py-12 bg-zinc-900 rounded-lg border border-zinc-800">
            <p className="text-zinc-400 text-lg">No posts in this category yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
