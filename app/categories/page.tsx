import { Metadata } from 'next';
import Link from 'next/link';
import { getAllCategories } from '@/lib/posts';

export const metadata: Metadata = {
  title: 'Categories – Health Nutrition Hacks',
  description: 'Browse all categories of nutrition and health topics.',
};

/**
 * Categories index page - lists all categories
 */
export default function CategoriesPage() {
  const categories = getAllCategories();

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-zinc-900 mb-4">
            Browse by Category
          </h1>
          <p className="text-lg text-zinc-600 max-w-2xl mx-auto">
            Explore our nutrition and wellness content organized by topic.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/categories/${category.slug}`}
              className="group"
            >
              <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border border-zinc-100 p-6 h-full">
                <div className="flex items-start justify-between mb-3">
                  <h2 className="text-xl font-bold text-zinc-900 group-hover:text-emerald-600 transition-colors">
                    {category.name}
                  </h2>
                  <span className="shrink-0 ml-3 inline-flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 text-sm font-semibold">
                    {category.count}
                  </span>
                </div>
                <p className="text-zinc-600 text-sm">
                  {category.count} {category.count === 1 ? 'post' : 'posts'} in this category
                </p>
              </div>
            </Link>
          ))}
        </div>

        {categories.length === 0 && (
          <div className="text-center py-12">
            <p className="text-zinc-600 text-lg">No categories yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
